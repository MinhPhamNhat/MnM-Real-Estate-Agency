$(document).ready(() => {
    $(".image-upload-holder").click(() => {
        $(".image-upload").trigger("click")
    })

    $(".city-picker").change(() => {
        var cityId = $(".city-picker option:selected").val()
        loadDistrict(cityId)
    })

    $(".more-choice").click((e) => {
        $(".show-more").toggle(300)
    })

    $(".set-price").click((e) => {
        $(".input-set-price").toggle(300)
    })

    $(".set-area").click((e) => {
        $(".input-set-area").toggle(300)
    })
    
    $(".property-infor #unit").change(()=>{
        if ($(".property-infor #unit option:selected").val() === "n"){
            $(".property-infor #price").removeAttr("required")
            $(".property-infor #price").attr("disabled", true)
        }else{
            $(".property-infor #price").attr("required", true)
            $(".property-infor #price").removeAttr("disabled")
        }
    })
    $(".search-second").click((e)=>{
        searchData(1)
    })

    $(".image-upload-mess").click(()=>{
        $(".property-attach .swiper-container").toggle(300)
    })

    $(".image-upload").change((e)=>{
        var files = e.target.files
        if (files.length){
            $(".swiper-container .swiper-slide").remove()
            for (file of files){
                var reader = new FileReader();
                reader.onload = function (e) {
                    swiper.prependSlide(`
                    <div class="swiper-slide">
                        <img src="${e.target.result}" >
                    </div>`)
                };
                reader.readAsDataURL(file);
            }
            $(".image-upload-mess").html(`Bạn đã thêm ${files.length} ảnh <i class="fa fa-chevron-down" aria-hidden="true"></i>`)
            $(".image-upload-mess").show()
        }
    })

})

var swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    loop: true,
    loopFillGroupWithBlank: true,
    freeMode: true,
    pagination: {
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    observer: true
  });

  const loadCity = (selectedCity) => {
    fetch(`/location/city`).then(result => result.json())
    .then(data => {
        data.forEach(value => {
            $(".city-picker").append(`<option value="${value.cityId}" ${selectedCity===value.cityId?"selected":""}>${value.name}</option>`)
        })

    })
  }
  const loadDistrict = (selectedCity, selectedDistrict) => {

      if (selectedCity === "any" || !selectedCity) {
        if (window.location.pathname === "/property/add-property" || window.location.pathname.includes("/property/edit-property/")) {
            $(".district-picker option").remove()
            $(".district-picker").append(`<option >--Chọn quận/huyện--</option>`)
        } else {
            $(".district-picker option").remove()
            $(".district-picker").append(`<option value="any">Tất cả</option>`)
        }
    } else
        fetch(`/location/district/${selectedCity}`).then(result => result.json())
            .then(data => {
                if (window.location.pathname === "/property/add-property" || window.location.pathname.includes("/property/edit-property/")) {
                    $(".district-picker option").remove()
                    $(".district-picker").append(`<option value="">--Chọn quận/huyện--</option>`)
                } else {
                    $(".district-picker option").remove()
                    $(".district-picker").append(`<option value="any">Tất cả</option>`)
                }
                data.forEach(value => {
                    $(".district-picker").append(`<option value="${value.districtId}" ${selectedDistrict===value.districtId?"selected":""}>${value.name}</option>`)
                })

            })
  }

  const setSlider = (area, price) =>{
    document.getElementById("sqrfeet-range").noUiSlider.set(area)
    document.getElementById("price-range").noUiSlider.set(price)
}
  const setNoUiSliderOption = (minPrice, maxPrice,minArea, maxArea) => {
    document.getElementById("sqrfeet-range").noUiSlider.updateOptions({
        range: {
            'min': minArea,
            'max': maxArea
        }
    },true );
    document.getElementById("price-range").noUiSlider.updateOptions({
        range: {
            'min': minPrice,
            'max': maxPrice
        },
    },true );
  }

  const getFlooredFixed = (v, d) => {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  }

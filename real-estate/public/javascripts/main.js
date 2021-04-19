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

    $(".sort-holder").click(()=>{
        $(".sort-modal").modal("show")
    })

    $(".sort-modal .radio-sort span").click((e)=>{
        var target = $(e.target).attr('class')
        $(`input#${target}`).prop('checked',true)

        if ($("#default-price").is(':checked') && $("#default-area").is(':checked') && $("#default-date").is(':checked')){
            $(".sort-holder").html("Mặc định")
        }else{
            var html = ""
            if ($("#asc-price").is(':checked')){
                html += "Giá từ thấp đến cao"
            }else if($("#desc-price").is(':checked')){
                html += "Giá từ cao đến thấp"
            }
            html+=" - "
            if ($("#asc-area").is(':checked')){
                html += "Diện tích từ thấp đến cao"
            }else if($("#desc-area").is(':checked')){
                html += "Diện tích từ cao đến thấp"
            }
            html+=" - "
            if ($("#asc-date").is(':checked')){
                html += "Ngày từ trước đến nay"
            }else if($("#desc-date").is(':checked')){
                html += "Ngày từ nay đến trước"
            }
            $(".sort-holder").html(html)
            $(".sort-holder").prop('title',html)
        }
    })

    
    $('body').on('click', ".delete-property-btn", (e)=>{
        $(".confirm-modal").modal("show")
        $(".confirm-yes").attr("data-id", e.target.dataset.id)
    })

    $('body').on('click', ".edit-property-btn", (e)=>{
        var propertyId = e.target.dataset.id
        window.location.href = window.location.origin+"/property/edit-property/"+propertyId
    })

    $(".confirm-yes").on('click', (e) => {
        var propertyId = e.target.dataset.id
        fetch(`/property/${propertyId}`,{method:"DELETE"}).then(data=>data.json())
        .then(data=>{
            if (data.code===0){
                var path = window.location.pathname
                if (path.includes("/property/search")){
                    searchData(currentPage)
                }else if (path.includes("/profile/")){
                    if (currentPage)
                        searchData(currentPage)
                    else{
                        searchData(1)
                    }
                }else
                window.location.href =  window.location.origin
            }else{
                window.location.href = window.location.origin+"/404"
            }
        })
        
        $(".confirm-modal").modal("hide")
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

  
  var currentPage = 1

  const searchData = (page) =>{
    currentPage = page
    if (window.location.pathname.includes("/profile/")){
        var path = window.location.href
        var userId = path.replace((window.location.origin+"/profile/"),"")
    }

    var noItem = $(".show-no-item option:selected").val()
    var sortPrice = $(".sort-modal .radio-sort input:checked")[0].value
    var sortArea = $(".sort-modal .radio-sort input:checked")[1].value
    var sortDate = $(".sort-modal .radio-sort input:checked")[2].value
    var keyword = $("#properties #keyword").val()
    var priceFrom = $("#properties #price-from").val()
    var priceTo = $("#properties #price-to").val()
    var areaFrom = $("#properties #area-from").val()
    var areaTo = $("#properties #area-to").val()
    var isSale = $("#properties #isSale").val()
    var rooms = $("#properties #rooms").val()
    var bedrooms = $("#properties #bedrooms").val()
    var bathrooms = $("#properties #bathrooms").val()
    var floors = $("#properties #floors").val()
    var type = $("#properties #type").val()
    var city = $("#properties #city").val()
    var district = $("#properties #district").val()
    
    var formData = {page, noItem, sortPrice, sortArea, sortDate, keyword, type, city, district, isSale, areaFrom, areaTo, priceFrom, priceTo, bedrooms, rooms, floors, bathrooms, userId}
    
    var container = $(".properties-nav")
    container.find("li").remove()

    var tag = `
    <li>
      <article class="properties-item">
        <a href="#" class="properties-item-img">
            <div style="height:220px;width:360px" class=" placeholder-content"></div>
        </a>
        <div class="tag for-rent placeholder-content" style="border:1px white solid">
          For Rent
        </div>
        <div class="properties-item-content">
          <div class="properties-info ">
            <span class="placeholder-content">5 Rooms</span>
            <span class="placeholder-content">2 Beds</span>
            <span class="placeholder-content">3 Baths</span>
            <span class="placeholder-content">1100 SQ FT</span>
          </div>
          <div class="properties-about">
            <h3><a  class="placeholder-content">Appartment Title</a></h3>
            <p  class="placeholder-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim molestiae vero ducimus quibusdam odit vitae.</p>                      
          </div>
          <div class="properties-detial">
            <span class="price placeholder-content">
              $11000
            </span>
            <a href="#" class="secondary-btn placeholder-content">View Details</a>
          </div>
        </div>
      </article>
    </li>`

    for (const i of Array(Number(noItem)).keys()){
        container.append(tag)
    }
    
    
    fetch(`/property/search?${new URLSearchParams(formData)}`, {method: "GET",headers:{'Content-Type': 'application/json'}, }).then(data=>data.json())
    .then(result=>{
        container.find("li").remove()
        var data = result.data
        var userId = result.userId
        $("li[class*=pagination-]").remove()
        var pageRange = result.pageRange 
        var page = result.page 
        pageRange.forEach(value=>{
            $(`<li class="pagination-${value} ${page===value?'active':'' }"><a onclick=searchData(${value})>${value}</a></li>`).insertBefore( ".next-page" )
        })

        data.forEach(value=> {
            var tag;
            if (userId){
                if (userId === value.authorId){
                    tag = `<div class="property-btn">
                                <span class="delete-property-btn" data-id="${value._id}">Xoá tin</span>
                                <span class="edit-property-btn" data-id="${value._id}">Thay đổi tin</span>
                            </div>`
                }
            }
            container.append(`
            <li>
                <article class="properties-item item-${value._id}">
                <a href="/properties/${value._id}" class="properties-item-img">
                <img src="${value.thumbnail||"/images/no-image.png"}" alt="img">
                </a>
                ${tag||''}
                <div class="tag for-${value.isSale ? "sale":"rent"}">
                    ${ value.isSale?"For Sale":"For Rent" }
                </div>
                <div class="properties-item-content">
                    <div class="properties-info">
                    ${value.features.rooms?`<span>${value.features.rooms} Phòng</span>`:''}
                    ${value.features.bathrooms?`<span>${value.features.bathrooms} Phòng vệ sinh</span>`:''}
                    ${value.features.bedrooms?`<span>${value.features.bedrooms} Phòng ngủ</span>`:''}
                    ${value.features.floors?`<span>${value.features.floors} Tầng</span>`:''}
                    </div>
                    <div class="properties-about">
                        <h3>
                            <a href="/properties/${value._id}">
                                ${ value.title }
                            </a>
                        </h3>
                        <p>${ value.location.district }, ${ value.location.city }</p>
                    </div>
                    <div class="properties-detial">
                        <span class="price">
                                <strong>${ value.price===0?"Giá thoả thuận":value.price<1000?(value.price.toString()+" triệu"):(Number(getFlooredFixed(value.price / 1000, 2)).toString() + " tỷ")}${ value.isSale?"":" / tháng"}</strong><span class="dot">·</span><strong>${ value.area} m²</strong>
                        </span>
                        <a href="/properties/${value._id}" class="btn" ${ value.isSale?`style=background-color:#59ABE3;color:white`:`style=background-color:#20ceb3;color:white` }> Xem chi tiết <i class="fa fa-angle-double-right" aria-hidden="true"></i></a>
                    </div>
                </div>
            </article>`)
        })
    })
  }
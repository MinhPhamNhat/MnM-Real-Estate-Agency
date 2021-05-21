$(document).ready(() => {
    
    if ($('#example')[0])
    $('#example').DataTable();

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
                }else if (path.includes("/profile/property/")){
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

   $(".phone-contact").on('click', () => {
        if (!$(".phone-contact span").hasClass("show-phone")){
            $(".phone-contact span").addClass("show-phone")
            var phone = $("#phone-copy")[0].dataset.phone
            $(".phone-contact span").text(formatPhone(phone))
        }else{
            $(".phone-contact span").removeClass("show-phone")
            $(".phone-contact span").text('Bấm để hiện số')
        }
    })

    $(".copy").on('click',()=>{
        var copyText = $("#phone-copy")[0].dataset.phone
        copy(copyText)
        $(".inform").text("Đã sao chép số")
        $(".inform").show()
        setTimeout(()=>{$( ".inform" ).fadeOut(1600)}, 1000)
    })

    $(".property-btn").on('click',(e)=>{
        
    })

    $(".profile-name span").on('click', (e) => {
        $(".profile-modal").modal("show")
    })
    
    $(".contact-require").on('click', (e) =>{
        $('.contact-require-modal').modal("show")
    })

    $(".confirm-send").on('click', (e) => {
        var propertyOwner = $(".contact-require")[0].dataset.id
        var propertyId = $(".contact-require")[0].dataset.property
        var name = $(".contact-require-modal .name-input").val()
        var email = $(".contact-require-modal .email-input").val()
        var phone = $(".contact-require-modal .phone-input").val()
        var desc = $(".contact-require-modal .desc-input").val()
        var formData = {propertyOwner, propertyId, name, email, phone, desc}
        Object.keys(formData).forEach(key => formData[key] === undefined && delete formData[key])
        
        if (phone){
            fetch("/inform/contact", 
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(data=>data.json())
            .then(data=>{
                if (data.code===0){
                    showToast("Yêu cầu liên hệ", "Đã yêu cầu liên hệ", "success")
                }else{
                    showToast("Yêu cầu liên hệ", "Yêu cầu liên hệ thất bại", "error")
                }
            })
            $('.contact-require-modal').modal("hide")
        }else{
            showToast("Yêu cầu liên hệ", "Vui lòng nhập số điện thoại", "warning")
        }
    })

    $(".contact-phone").click((e)=>{
        var id = e.target.dataset.id
        if (!$(`.contact-phone .contact-${id}`).hasClass("show-phone")){
            var phone = $(`.contact-phone .contact-${id}`)[0].dataset.phone
            $(`.contact-phone .contact-${id}`).text(formatPhone(phone))
            $(`.contact-phone .contact-${id}`).addClass("show-phone")
        }
        else{
            $(`.contact-phone .contact-${id}`).removeClass("show-phone")
            $(`.contact-phone .contact-${id}`).text("Bấm để hiện số")
        }
    })

    $(".inform-detail").click((e) => {
        var id = e.target.dataset.id
        fetch(`/inform/${id}`).then(data=>data.json())
        .then(data=>{
            if (data.code===0){
                var inform = data.data[data.data.type]
                if (data.data.type==='contact'){
                    $(".modal-name-contact").text(inform.name)
                    $(".modal-phone-contact").text(inform.phone)
                    $(".modal-email-contact").text(inform.email)
                    $(".modal-desc-contact").text(inform.desc)
                    $(".modal-date-contact").text(formatDateTime(new Date(inform.date)))
                    $(".modal-title-contact a").text(inform.propertyId.title)
                    $(".modal-title-contact a").attr("href", `/property/${inform.propertyId._id}`)
                    $(".contact-modal").modal("show")
                }else if (data.data.type==='censor'){
                    $(".modal-name-censor").text(inform.author.name)
                    $(".modal-role-censor").removeClass("admin")
                    $(".modal-role-censor").removeClass("staff")
                    $(".modal-role-censor").text(inform.author.role.staff?"Kiểm duyệt viên":"Admin")
                    $(".modal-role-censor").addClass(inform.author.role.staff?"staff":"admin")
                    $(".modal-status-censor").text(inform.isApproved?"Đã chấp nhận":"Từ chối kiểm duyệt")
                    $(".modal-status-censor").css("background-color",inform.isApproved?"#98d9ff":"#ff7575")
                    if (!inform.isApproved){
                        $(".censor-reason").css("display","")
                        $(".modal-reason-censor").text(inform.reason)
                    }else{
                        $(".censor-reason").css("display","none")
                        $(".modal-reason-censor").text("")
                    }
                    $(".modal-date-censor").text(formatDateTime(new Date(inform.date)))
                    $(".modal-title-censor a").text(inform.propertyId.title)
                    $(".modal-title-censor a").attr("href", `/${inform.propertyId.status?'property':'censor'}/${inform.propertyId._id}`)
                    $(".censor-modal").modal("show")
                } else{
                    $(".modal-name-warn").text(inform.author.name)
                    $(".modal-role-warn").removeClass("admin")
                    $(".modal-role-warn").removeClass("staff")
                    $(".modal-role-warn").text(inform.author.role.staff?"Kiểm duyệt viên":"Admin")
                    $(".modal-role-warn").addClass(inform.author.role.staff?"staff":"admin")
                    $(".modal-content-warn").text(inform.content)
                    $(".modal-date-warn").text(formatDateTime(new Date(inform.date)))
                    if (inform.propertyId){
                        $(".asdasdasd").show()
                        $(".modal-title-warn a").text(inform.propertyId.title)
                        console.log(inform.propertyId)
                        $(".modal-title-warn a").attr("href", `/${inform.propertyId.status?'property':'censor'}/${inform.propertyId._id}`)
                    }else{
                        $(".asdasdasd").hide()
                        $(".modal-title-warn a").text('')
                        $(".modal-title-warn a").removeAttr("href")
                    }
                    $(".warn-modal").modal("show")
                }
                $(`.inform-${data.data._id}`).removeClass("new")
            }
        })
    })
    $(".modal-phone-contact").click((e) => {
        var text = e.target.dataset.phone
        copy(text)
        $(".modal-inform").text("Đã sao chép số")
        $(".modal-inform").show()
        setTimeout(()=>{$( ".modal-inform" ).fadeOut(1600)}, 1000)
    })

    $(".delete-inform-btn").click((e)=>{
        e.preventDefault()
        var id = e.target.dataset.id
        $(".confirm-inform-modal").modal("show")
        $(".confirm-inform-modal .confirm-remove").attr("data-id", id)
    })

    $(".confirm-inform-modal .confirm-remove").click((e)=>{
        var id = e.target.dataset.id
        fetch(`/inform/${id}`, {method: "DELETE"}).then(data=>data.json())
        .then(data=>{
            if (data.code===0){
                showToast("Xoá thông báo", "Đã xoá thông báo", "success")
            }else{
                showToast("Xoá thông báo", "Xoá thông báo thất bại", "error")
            }
        })
        $(".confirm-inform-modal").modal("hide")
    })

    $(".properties-decline").click(()=>{
        $(".decline-modal").modal("show")
    })

    $(".properties-approve").click((e)=>{
        var propertyOwner = e.target.dataset.owner
        var propertyId = e.target.dataset.id
        var isApproved = true
        var formData = {propertyOwner, propertyId, isApproved}
        fetch("/inform/censor", 
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(data=>data.json())
        .then(data=>{
            window.location.href = "/dashboard/uncensor-property"
        })
    })

    $(".confirm-decline").click((e) => {
        var propertyOwner = e.target.dataset.owner
        var propertyId = e.target.dataset.id
        var reason = $(".decline-reasone").val()
        var isApproved = false
        var formData = {propertyOwner, propertyId, reason, isApproved}
        if (reason){
            fetch("/inform/censor", 
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(data=>data.json())
            .then(data=>{
                window.location.href = "/dashboard/uncensor-property"
            })
            $('.decline-modal').modal("hide")
        }
    })

    $(".censor-require-btn").click((e)=>{
        var id = e.target.dataset.id
        var formData = {id}
        fetch("/censor",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify(formData)})
        .then(data=>data.json())
        .then(data=>{
            if (data.code===0){
                showToast("Yêu cầu kiểm duyệt lại", "Đã yêu cầu", "success")
                $(".censor-require-btn").remove()
            }else{
                showToast("Yêu cầu kiểm duyệt lại", "Yêu cầu kiểm duyệt thất bại", "error")
            }
        })
    })

    $(".submit-create-staff").click((e) => {
        var name = $(".staff-name input").val()
        var email = $(".staff-email input").val()
        var position = $(".staff-position option:selected").val()
        var username = $(".staff-username input").val()
        var password = $(".staff-password input").val()
        var confirmPassword = $(".staff-confirm-password input").val()

        var formData = {
            name,
            email,
            position,
            username,
            password,
            'confirm-password': confirmPassword
        }

        fetch('/dashboard/account/staff', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(data=>data.json())
        .then(data=> {
            if (data.code === -3){
                $(".create-staff small").remove()
                $(`.create-staff .staff-${data.err.param}`).append(`<small class="invalid">${data.err.msg}</small>`)
            }else if (data.code === 0){
                var staff = data.data
                $(".create-staff small").remove()
                $(".staff-name input").val('')
                $(".staff-email input").val('')
                $(".staff-username input").val('')
                $(".staff-password input").val('')
                $(".staff-confirm-password input").val('')
                $(".staff-list tbody").prepend(`
                <tr class="user-row user-${staff.accountId}" onclick=getStaffInfo(this) data-id="${staff.accountId}">
                    <td>
                        ${staff.name}
                    </td>
                    <td>
                        ${staff.username}
                    </td>
                    <td>
                        ${staff.email}
                    </td>
                    <td>
                        ${staff.position==="censor"?"Kiểm duyệt viên":""}
                    </td>
                </tr>
                `)
                showToast("Tạo nhân viên", "Tạo thành công", "success")
            }else{
                $(".create-staff small").remove()
                showToast("Tạo nhân viên", "Tạo thất bại", "error")
            }
        })
    })

    $(".remove-user-modal").on('hidden.bs.modal', function(){
        $(".remove-user-modal input").val('')
    });

    $(".warn-user-modal").on('hidden.bs.modal', function(){
        $(".warn-user-content").val('')
    });

    $(".warn-property-modal").on('hidden.bs.modal', function(){
        $(".warn-property-content").val('')
    });

    $('.edit-profile-image').click(() => {
        $('.profile-infor-preview').trigger('click')
    })

    $('.profile-infor-preview').change((e) => {
        var file = e.target.files[0]
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('profile-image-preview');
            output.src = reader.result;
        };
        reader.readAsDataURL(file);
        $('#profile-image-standard').hide()
        $('#profile-image-preview').show()
    })

    $('.remove-image-preview').click(() => {
        $('#profile-image-standard').show()
        $('#profile-image-preview').hide()
        $('.profile-infor-preview').val(null)
    })

    $('.profile-button').click(() => {
        $('.profile-infor-name').removeAttr('disabled')
        $('.profile-infor-email').removeAttr('disabled')
        $('.profile-infor-phone').removeAttr('disabled')
        $(".asd").hide()
        $(".dsa").show()
        $('.edit-picture').show()
    })

    $('.profile-button-cancel').click(()=>{
        $('.profile-infor-name').attr("disabled", true)
        $('.profile-infor-email').attr("disabled", true)
        $('.profile-infor-phone').attr("disabled", true)
        $(".asd").show()
        $(".dsa").hide()
        $('.edit-picture').hide()
    })

    $('.profile-button-update').click(()=>{
        var name = $('.profile-infor-name').val()
        var email = $('.profile-infor-email').val()
        var phone = $('.profile-infor-phone').val()
        var picture = $('.profile-infor-preview')[0].files[0]
        var formData = new FormData()
        formData.append('picture', picture)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('phone', phone)
        var userId = window.location.pathname.replace('/profile/','')
        if (!name || !email || !phone){
            showToast("Cập nhật thông tin","Vui lòng nhập thông tin hợp lệ", "warning")
        }else{
            if (alphaOnly(name)){
                showToast("Cập nhật thông tin","Tên không được chưa ký tự đặc biệt", "warning")
            }else if (isNaN(phone)){
                showToast("Cập nhật thông tin","Số điện thoại không hợp lệ", "warning")
            }else if (!validateEmail(email))
                showToast("Cập nhật thông tin","Email không hợp lệ", "warning")
            else{
                fetch('/profile/',
                {
                    method: "POST",
                    body: formData,
                })
                .then(data=> data.json())
                .then(data=>{
                    if (data.code === 0){
                        showToast("Cập nhật thông tin","Cập nhật thành công", "success")
                        setTimeout(()=>{
                            window.location.href = `/profile/${userId}`
                        }, 300)
                    }else{
                        showToast("Cập nhật thông tin","Cập nhật thất bại", "error")
                    }
                })
            }
        }
    })

    $(".show-no-item").change(()=>{
        searchData(1)
    })

    $(".sort-modal").on('hidden.bs.modal', function(){
        searchData(1)
    });

    
    // CHANGE PASSWORD
    $(".save-change-btn").click(()=>{
        var oldPassword = $(".change-password #old-password").val()
        var newPassword = $(".change-password #new-password").val()
        var reNewPassword = $(".change-password #re-new-password").val()

        var formData = {oldPassword, newPassword, reNewPassword}
        fetch('/profile/change-password', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(data=>data.json()).then(data=>{
            if (data.code===0){
                var fields = ["oldPassword", "newPassword", "reNewPassword"]
                fields.forEach(value => {
                    var inputField = $(`.change-password .${value}`)
                    inputField.find("small").remove()
                    inputField.find("label").removeClass("text-danger")
                    inputField.find("input").removeClass("is-invalid")
                    inputField.find("label").addClass("text-success")
                    inputField.find("input").addClass("is-valid")
                })
                showToast("Thay đổi mật khẩu", "Thành công ", "success")
                setTimeout(()=>{
                    window.location.href = "/logout"
                },300)
            }else if (data.code === -3){
                var fields = ["oldPassword", "newPassword", "reNewPassword"]
                fields.forEach(value => {
                    var inputField = $(`.change-password .${value}`)
                    if (data.errors[value]) {
                        inputField.find("small").remove()
                        inputField.find("label").removeClass("text-success")
                        inputField.find("input").removeClass("is-valid")
                        inputField.find("label").addClass("text-danger")
                        inputField.find("input").addClass("is-invalid")
                        inputField.append(`<small class='text-danger'>${data.errors[value].msg}</>`)
                    } else {
                        inputField.find("small").remove()
                        inputField.find("label").removeClass("text-danger")
                        inputField.find("input").removeClass("is-invalid")
                        inputField.find("label").addClass("text-success")
                        inputField.find("input").addClass("is-valid")
                    }
                })
            }else if (data.code === -1){
                showToast("Thay đổi mật khẩu", "Đã xảy ra lỗi ", "error")
            }
        })
    })
})

const toggleOption = (e) => {
    var id = e.dataset.id
    if ($(`.option-${id} .option-btn`).css("display") === 'none'){
        $(`.option-${id} img`).css("transform","rotate(90deg)")
        $(`.option-${id} img`).css("box-shadow","0 0px 15px rgba(0, 0, 0, 1)")
        $(`.option-${id} .option-btn div`).css("box-shadow","0 0px 15px rgba(0, 0, 0, 1)")
        $(`.option-${id} .option-btn`).fadeIn(300)
    }
    else {
        $(`.option-${id} img`).css("transform","rotate(0deg)")
        $(`.option-${id} img`).css("box-shadow","none")
        $(`.option-${id} .option-btn div`).css("box-shadow","none")
        $(`.option-${id} .option-btn`).fadeOut(300)
    } 
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const formatDateTime = (date) => {
    var options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' , 
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("vi-VN", options)
  }
const copy = (copyText) =>{
    const el = document.createElement('textarea');
    el.value = copyText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
const alphaOnly = (event)=> {
    var key = event.keyCode;
    if ((key >= 33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 126)){
        return true
    }
    return false
  };

var swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,
    spaceBetween:10,
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

  const formatPhone = (value) =>{
    if (value[1] === "1"){
      return value.slice(0,5) + " " + value.slice(5,8) + " " + value.slice(8,12)
    }else{
      return value.slice(0,4) + " " + value.slice(4,7) + " " + value.slice(7,11)
    }
  }
  
  var currentPage = 1

  const searchData = (page) =>{
    currentPage = page
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

    if ($(".hidden-user-id")[0])
        var userId = $(".hidden-user-id").val()
    if (window.location.pathname.includes("/profile/censor"))
        var status = false
    var formData = {page, noItem, sortPrice, sortArea, sortDate, keyword, type, city, district, isSale, areaFrom, areaTo, priceFrom, priceTo, bedrooms, rooms, floors, bathrooms, userId, status}
    Object.keys(formData).forEach(key => formData[key] === undefined && delete formData[key])
    
    var container = $(".properties-nav")
    container.find("li").remove()
    container.find(".error-template").remove()
    var tag = `
    <li>
      <article class="properties-item">
        <a href="#" class="properties-item-img">
            <div style="height:220px;width:360px" class=" placeholder-content"></div>
        </a>
        <div class="tag for-rent placeholder-content" style="border:1px white solid">
          Cho Thuê
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
        container.find(".error-template").remove()
        var data = result.data
        var userId = result.userId
        var isAdmin = result.isAdmin
        $("li[class*=pagination-]").remove()
        var pageRange = result.pageRange 
        var page = result.page 
        pageRange.forEach(value=>{
            $(`<li class="pagination-${value} ${page===value?'active':'' }"><a onclick=searchData(${value})>${value}</a></li>`).insertBefore( ".next-page" )
        })
        $(".pagination .previous-page a").attr("onclick", `searchData(${pageRange[0]})`)
        $(".pagination .next-page a").attr("onclick", `searchData(${pageRange[pageRange.length - 1]})`)
        if (data.length){
            data.forEach(value=> {
                var tag;
                if (userId){
                    if (userId === value.author.accountId){
                        tag = `<div class="property-btn option-${value._id}" onclick=toggleOption(this) data-id="${value._id}">
                                    <img src="/images/option.png">
                                    <div class="option-btn">
                                        <div class="delete-property-btn" data-id="${value._id}">Xoá tin</div>
                                        <div class="edit-property-btn" data-id="${value._id}">Thay đổi tin</div>
                                    </div>
                                </div>
                                `
                    }else if (isAdmin){
                        tag = `<div class="property-btn option-${value._id}" onclick=toggleOption(this) data-id="${value._id}">
                                    <img src="/images/option.png">
                                    <div class="option-btn">
                                        <div class="delete-property-btn" data-id="${value._id}">Xoá tin</div>
                                    </div>
                                </div>
                                `
                    }
                }
                container.append(`
                    <li>
                        <article class="properties-item item-${value._id}">
                        <a href="/property/${value._id}" class="properties-item-img">
                            <img src="${value.thumbnail||"/images/no-image.png"}" alt="img">
                        </a>
                        ${tag||''}
                        <div class="tag for-${value.isSale ? "sale":"rent"}">
                            ${ value.isSale?"Bán":"Cho Thuê" }
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
                                    <a href="/property/${value._id}" title="${ value.title }">
                                        ${ value.title }
                                    </a>
                                </h3>
                                <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${ value.location.district.name }, ${ value.location.city.name }</p>
                            </div>
                            <div class="properties-detial">
                                <span class="price">
                                        <strong>${ value.price===0?"Giá thoả thuận":value.price<1000?(value.price.toString()+" triệu"):(Number(getFlooredFixed(value.price / 1000, 2)).toString() + " tỷ")}${ value.isSale?"":" / tháng"}</strong><span class="dot">·</span><strong>${ value.area} m²</strong>
                                </span>
                                <a href="/property/${value._id}" class="btn" ${ value.isSale?`style=background-color:darkviolet;color:white`:`style=background-color:darkgoldenrod;color:white` }> Xem chi tiết <i class="fa fa-angle-double-right" aria-hidden="true"></i></a>
                            </div>
                        </div>
                    </article>
                </li>`)
            })
        }else{
            container.append(`
                <div class="error-template">
                    <img src="/images/shortcut.png" class="error-background">
                    <h1>
                        Oops!</h1>
                    <h2>
                        Không có bất động sản nào</h2>
                    <div class="error-actions">
                        <a href="/" class="btn btn-primary btn-lg">Trang chủ</a>
                    </div>
                </div>
            `)
            
        }
    })
  }

const getUserInfo = (e) => {
    var userId = e.dataset.id
    fetch(`/dashboard/account/user/${userId}`)
    .then(data=>data.json())
    .then(data=>{
        if (data.code === 0){
            $(".user-container").html(profileUserInfoTag(data))
        }else if (data.code === -1){
            showToast("Lấy thông tin người dùng", "Người dùng không tồn tại", "warning")
        }else{
            showToast("Lấy thông tin người dùng", "Lỗi khi tìm người dùng", "error")
        }
    })
}

const getStaffInfo = (e) => {
    var userId = e.dataset.id
    fetch(`/dashboard/account/staff/${userId}`)
    .then(data=>data.json())
    .then(data=>{
        if (data.code === 0){
            $(".user-container").html(profileStaffInfoTag(data))
        }else if (data.code === -1){
            showToast("Lấy thông tin nhân viên", "Nhân viên không tồn tại", "warning")
        }else{
            showToast("Lấy thông tin nhân viên", "Lỗi khi tìm nhân viên", "error")
        }
    })
}

const profileStaffInfoTag = (u) => `
<div class="card">
    <div class="card-body">
        <center class="m-t-30"> <img src="${u.data.picture||`/images/userprofile.png`}" class="img-circle" width="150">
            <h4 class="card-title m-t-10"><a href="/profile/${u.data.accountId}">${u.data.name}</a></h4>
            <div class="row text-center justify-content-md-center">
                <div class="col-12">
                    <span class="staff">Nhân viên kiểm duyệt</span>
                </div>
            </div>
        </center>
    </div>
    <div>
    <hr> </div>
    <div class="card-body"> 
        <small class="text-muted">Email</small>
        <h6>${u.data.email}</h6> 
        <small class="text-muted p-t-30 db">Số điện thoại</small>
        ${u.data.phone?`<h6 data-phone="${u.data.phone}">${formatPhone(u.data.phone)}</h6> `:`<h6>Chưa cập nhật</h6>`}
        <small class="text-muted p-t-30 db">Số lượng bất động sản đã kiểm duyệt</small>
        <h6>${u.numOfCensor}</h6>
        <br>
        <button class="remove-user-btn" onclick=removeUserModal(this) data-id="${u.data.accountId}" data-name="${u.data.name}">Xoá nhân viên</button>
        <button class="warn-user-btn" onclick=warnUserModal(this) data-id="${u.data.accountId}" data-name="${u.data.name}">Cảnh báo nhân viên</button>
    </div>
</div>
`

const profileUserInfoTag = (u) => `
    <div class="card">
        <div class="card-body">
            <center class="m-t-30"> <img src="${u.data.picture||`/images/userprofile.png`}" class="img-circle" width="150">
                <h4 class="card-title m-t-10"><a href="/profile/${u.data.accountId}">${u.data.name}</a></h4>
                <div class="row text-center justify-content-md-center">
                    <div class="col-12">
                        <a href="/profile/property/${u.data.accountId}" class="link">
                            <i class="fa fa-home" aria-hidden="true"></i> <font class="font-medium">${u.numOfProperty}</font>
                        </a>
                    </div>
                </div>
            </center>
        </div>
        <div>
        <hr> </div>
        <div class="card-body"> 
            <small class="text-muted">Email</small>
            <h6>${u.data.email}</h6> 
            <small class="text-muted p-t-30 db">Số điện thoại</small>
            ${u.data.phone?`<h6 data-phone="${u.data.phone}">${formatPhone(u.data.phone)}</h6> `:`<h6>Chưa cập nhật</h6>`}
            <small class="text-muted p-t-30 db">Số lượng bất động sản</small>
            <h6>${u.numOfProperty}</h6>
            <br>
            <button class="remove-user-btn" onclick=removeUserModal(this) data-id="${u.data.accountId}" data-name="${u.data.name}">Xoá người dùng</button>
            <button class="warn-user-btn" onclick=warnUserModal(this) data-id="${u.data.accountId}" data-name="${u.data.name}">Cảnh báo người dùng</button>
        </div>
    </div>
`

const removeUserModal = (e) => {
    var userId = e.dataset.id
    var name = e.dataset.name
    $(".remove-user-modal").modal("show")
    $(".remove-user-name").text(name)
    $(".remove-user-confirm code").text(userId)
    $(".remove-user-modal .confirm").attr("data-id", userId)
}

const confirmRemoveUser = (e) => {
    var accountId = e.dataset.id
    var userIdConfirm = $("#confirm-user-id").val()
    if (accountId !== userIdConfirm){
        showToast("Xoá tài khoản", "Mã xác nhận không chính xác", "warning")
    }else{
        fetch(`/dashboard/account/${accountId}`,
        {
            method: "DELETE",
        })
        .then(data=> data.json())
        .then(data=>{
            if (data.code === 0){
                $(`.user-${accountId}`).remove()
                showToast("Xoá tài khoản",data.message, "success")
            }else {
                showToast("Xoá tài khoản",data.message, "error")
            }
        })
    }
    $(".remove-user-modal").modal("hide")
}

const warnUserModal = (e)=> {
    var userId = e.dataset.id
    var name = e.dataset.name
    $(".warn-user-modal").modal("show")
    $(".warn-user-name").text(name)
    $(".warn-user-modal .confirm").attr("data-id", userId)
}

const warnPropertyModal = (e) => {
    var propertyId = e.dataset.id
    $(".warn-property-modal .confirm").attr("data-id", propertyId)
    $(".warn-property-modal").modal("show")
}

const confirmWarnProperty = (e) => {
    var propertyId = e.dataset.id
    var propertyOwner = e.dataset.owner
    var content = $(".warn-property-modal textarea").val()
    var formData = {propertyId, content, propertyOwner}
    if (!content){
        showToast("Cảnh báo tài khoản", "Vui lòng nhập nội dung cảnh báo", "warning")
    }else{
        fetch(`/inform/warn`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(data=> data.json())
        .then(data=>{
            if (data.code === 0){
                showToast("Cảnh báo tài khoản","Đã cảnh báo", "success")
            }else {
                showToast("Cảnh báo tài khoản","Cảnh báo thất bại", "error")
            }
        })
    }
    $(".warn-property-modal").modal("hide")
}

const confirmWarnUser = (e) => {
    var propertyOwner = e.dataset.id
    var content = $(".warn-user-modal textarea").val()
    var formData = {propertyOwner, content}
    if (!content){
        showToast("Cảnh báo tài khoản", "Vui lòng nhập nội dung cảnh báo", "warning")
    }else{
        fetch(`/inform/warn`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(data=> data.json())
        .then(data=>{
            if (data.code === 0){
                showToast("Cảnh báo tài khoản","Đã cảnh báo", "success")
            }else {
                showToast("Cảnh báo tài khoản","Cảnh báo thất bại", "error")
            }
        })
    }
    $(".warn-user-modal").modal("hide")
}

var showToast = (title, mess, type = "success", x = 20, y = 20) => {
    var toastNum = $(".toast").length
    var typeVal = {
        "warning": `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>`,
        "error": `<i class="fa fa-exclamation" aria-hidden="true"></i>`,
        "noti": `<i class="fa fa-bell" aria-hidden="true"></i>`,
        "success": `<i class="fa fa-check" aria-hidden="true"></i>`
    }
    var color = {
        "warning": `rgb(254, 255, 193)`,
        "error": `rgb(255, 193, 193)`,
        "success": `rgb(200, 255, 193)`
    }
    var tag =
        `<div class="toastt toastt-${toastNum + 1}"  id="myToast" style="background-color: ${color[type]}; position: fixed; bottom: ${y}px; left: ${x}px;">
                <div class="toast-header">
                    <div style="margin-right: 20px">${typeVal[type]}</div><strong class="mr-auto">${title}</strong>

                </div>
                <div class="toast-body" style="margin: 10px;">
                    <div>${mess}</div>
                </div>
            </div>`

    $("body").append(tag)
    $(`.toastt-${toastNum + 1}`).show(3000);
    setTimeout(() => {
        $(`.toastt-${toastNum + 1}`).hide(300)
        setTimeout(()=>{
            $(`.toastt-${toastNum + 1}`).remove()
        }, 300)
    }, 4000)
}

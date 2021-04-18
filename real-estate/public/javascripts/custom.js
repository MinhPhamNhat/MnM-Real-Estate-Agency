/** 
  * Template Name: Home Property
  * Version: 1.0  
  * Template Scripts
  * Author: MarkUps
  * Author URI: http://www.markups.io/

  Custom JS
  

  1. FIXED NAVBAR 
  2. AGENTS SLIDER
  3. TESTIMONIAL SLIDER  
  4. CLIENT BRAND SLIDER (SLICK SLIDER)
  5. TOP SLIDER (SLICK SLIDER)
  6. LATEST PRODUCT SLIDER (SLICK SLIDER)
  7. HOVER DROPDOWN MENU
  8. ADVANCE SEARCH FILTER  (noUiSlider SLIDER)
  9. MIXIT FILTER ( FOR GALLERY ) 
  10. FANCYBOX ( FOR PORTFOLIO POPUP VIEW )
  11. SCROLL TOP BUTTON
  12. PRELOADER
  13. GRID AND LIST LAYOUT CHANGER 
  14.RELATED ITEM SLIDER (SLICK SLIDER)

  
**/

jQuery(function ($) {


  /* ----------------------------------------------------------- */
  /*  1. FIXED NAVBAR 
  /* ----------------------------------------------------------- */


  jQuery(window).bind('scroll', function () {
    if (jQuery(window).scrollTop() > 200) {
      jQuery('.main-navbar').addClass('navbar-fixed-top');

    } else {
      jQuery('.main-navbar').removeClass('navbar-fixed-top');
    }
  });

  /* ----------------------------------------------------------- */
  /*  2. AGENTS SLIDER
  /* ----------------------------------------------------------- */

  jQuery('.agents-slider').slick({
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  /* ----------------------------------------------------------- */
  /*  3. TESTIMONIAL SLIDER 
  /* ----------------------------------------------------------- */

  jQuery('.testimonial-slider').slick({
    dots: false,
    infinite: true,
    speed: 500,
    cssEase: 'linear'
  });

  /* ----------------------------------------------------------- */
  /*  4. CLIENT BRAND SLIDER (SLICK SLIDER)
  /* ----------------------------------------------------------- */

  jQuery('.client-brand-slider').slick({
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });


  /* ----------------------------------------------------------- */
  /*  5. TOP SLIDER (SLICK SLIDER)
  /* ----------------------------------------------------------- */

  jQuery('.top-slider').slick({
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    fade: true,
    cssEase: 'linear'
  });

  /* ----------------------------------------------------------- */
  /*  6. LATEST PRODUCT SLIDER (SLICK SLIDER)
  /* ----------------------------------------------------------- */

  jQuery('.properties-details-img').slick({
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    cssEase: 'linear'
  });


  /* ----------------------------------------------------------- */
  /*  7. HOVER DROPDOWN MENU
  /* ----------------------------------------------------------- */

  // for hover dropdown menu
  jQuery('ul.nav li.dropdown').hover(function () {
    jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
  }, function () {
    jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
  });


  /* ----------------------------------------------------------- */
  /* 8. ADVANCE SEARCH FILTER  (noUiSlider SLIDER)
  /* ----------------------------------------------------------- */

  jQuery(function () {
      function getFlooredFixed(v, d) {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
      }

    if (jQuery('body').is('.price-range')) {
      // FOR AREA SECTION
      var skipSlider = document.getElementById('sqrfeet-range');
      noUiSlider.create(skipSlider, {
        margin: 1,
        range: {
          'min': 0,
          'max': 1000
        },
        connect: true,
        start: [250, 750]
      });
      // for value print
      var skipValues = [
        document.getElementById('skip-value-lower'),
        document.getElementById('skip-value-upper')
      ];

      skipSlider.noUiSlider.on('update', function (values, handle) {
        skipValues[handle].innerHTML = parseInt(values[handle]).toString() + " m²";
        document.getElementById("area-from").value = parseInt(values[0])
        document.getElementById("area-to").value = parseInt(values[1])
        localStorage.setItem("area-from", document.getElementById("area-from").value)
        localStorage.setItem("area-to", document.getElementById("area-to").value)

      });

      // FOR PRICE SECTION

      var skipSlider2 = document.getElementById('price-range');
      noUiSlider.create(skipSlider2, {
        margin: 1,
        range: {
          'min': 0,
          'max': 20000
        },
        connect: true,
        start: [5000, 15000]
      });
      // for value print
      var skipValues2 = [
        document.getElementById('skip-value-lower2'),
        document.getElementById('skip-value-upper2')
      ];

      skipSlider2.noUiSlider.on('update', function (values, handle) {
        if (parseInt(values[handle]) < 1000) {
          var value = parseInt(values[handle]).toString() + " Triệu"
        } else {
          var value = Number(getFlooredFixed(parseInt(values[handle]) / 1000, 2)).toString() + " Tỷ"
        }
        skipValues2[handle].innerHTML = value;
        document.getElementById("price-from").value = parseInt(values[0])
        document.getElementById("price-to").value = parseInt(values[1])

      });


      $(`#area-from`).on("input", (e) => {
        $("#skip-value-lower").text(parseInt($(`#area-from`).val()).toString() + " m²")
        skipSlider.noUiSlider.set([parseInt($(`#area-from`).val()), parseInt($(`#area-to`).val())])


      })

      $(`#area-to`).on("input", (e) => {
        $("#skip-value-upper").text(parseInt($(`#area-to`).val()).toString() + " m²")
        skipSlider.noUiSlider.set([parseInt($(`#area-from`).val()), parseInt($(`#area-to`).val())])
      })

      $(`#price-from`).on("input", (e) => {
        var price = Number($(`#price-from`).val())
        if (parseInt(price) < 1000) {
          var value = parseInt(price).toString() + " Triệu"
        } else {
          var value = Number(getFlooredFixed(parseInt(price) / 1000, 2)).toString() + " Tỷ"
        }
        $("#skip-value-lower2").text(value)
        skipSlider2.noUiSlider.set([Number($(`#price-from`).val()), Number($(`#price-to`).val())])

      })

      $(`#price-to`).on("input", (e) => {
        var price = Number($(`#price-to`).val())
        if (parseInt(price) < 1000) {
          var value = parseInt(price).toString() + " Triệu"
        } else {
          var value = (parseInt(price) / 1000).toFixed(2).toString() + " Tỷ"
        }
        $("#skip-value-upper2").text(value)
        skipSlider2.noUiSlider.set([Number($(`#price-from`).val()), Number($(`#price-to`).val())])

      })
    }
  });

  /* ----------------------------------------------------------- */
  /*  9. MIXIT FILTER ( FOR GALLERY ) 
  /* ----------------------------------------------------------- */

  jQuery(function () {
    jQuery('#mixit-container').mixItUp();
  });

  /* ----------------------------------------------------------- */
  /*  10. FANCYBOX ( FOR PORTFOLIO POPUP VIEW ) 
  /* ----------------------------------------------------------- */

  jQuery(document).ready(function () {
    jQuery(".fancybox").fancybox();
  });


  /* ----------------------------------------------------------- */
  /*  11. SCROLL TOP BUTTON
  /* ----------------------------------------------------------- */

  //Check to see if the window is top if not then display button

  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() > 300) {
      jQuery('.scrollToTop').fadeIn();
    } else {
      jQuery('.scrollToTop').fadeOut();
    }
  });

  //Click event to scroll to top

  jQuery('.scrollToTop').click(function () {
    jQuery('html, body').animate({ scrollTop: 0 }, 800);
    return false;
  });

  /* ----------------------------------------------------------- */
  /*  12. PRELOADER
  /* ----------------------------------------------------------- */

  jQuery(window).load(function () { // makes sure the whole site is loaded      
    jQuery('#preloader-area').delay(300).fadeOut('slow'); // will fade out      
  })



  /* ----------------------------------------------------------- */
  /*  13. GRID AND LIST LAYOUT CHANGER 
  /* ----------------------------------------------------------- */

  jQuery("#list-properties").click(function (e) {
    e.preventDefault(e);
    jQuery(".properties-nav").addClass("list-view");
  });
  jQuery("#grid-properties").click(function (e) {
    e.preventDefault(e);
    jQuery(".properties-nav").removeClass("list-view");
  });


  /* ----------------------------------------------------------- */
  /*  14. RELATED ITEM SLIDER (SLICK SLIDER)
  /* ----------------------------------------------------------- */

  jQuery('.related-item-slider').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });


});


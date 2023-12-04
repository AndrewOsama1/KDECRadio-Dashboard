/*
Template: Muzik - Responsive Bootstrap 4 Admin Dashboard Template
Author: iqonicthemes.in
Design and Developed by: iqonicthemes.in
NOTE: This file contains the styling for responsive Template.
*/

/*----------------------------------------------
Index Of Script
------------------------------------------------

:: Tooltip
:: Sidebar Widget
:: Magnific Popup
:: Ripple Effect
:: Page Loader
:: Owl Carousel
:: Select input
:: Search input
:: Scrollbar
:: Counter
:: slick
:: Progress Bar
:: Page Menu
:: Page Loader
:: Page Menu
:: Wow Animation
:: Mail Inbox
:: Chat
:: Todo
:: Form Validation
:: Sidebar Widget
:: Flatpicker
:: active music

------------------------------------------------
Index Of Script
----------------------------------------------*/

(function (jQuery) {



    "use strict";

    jQuery(document).ready(function () {

        /*---------------------------------------------------------------------
        Tooltip
        -----------------------------------------------------------------------*/
        jQuery('[data-toggle="popover"]').popover();
        jQuery('[data-toggle="tooltip"]').tooltip();

        /*---------------------------------------------------------------------
        Sidebar Widget
        -----------------------------------------------------------------------*/
        function checkClass(ele, type, className) {
            switch (type) {
                case 'addClass':
                    if (!ele.hasClass(className)) {
                        ele.addClass(className);
                    }
                    break;
                case 'removeClass':
                    if (ele.hasClass(className)) {
                        ele.removeClass(className);
                    }
                    break;
                case 'toggleClass':
                    ele.toggleClass(className);
                    break;
            }
        }


        /*---------------------------------------------------------------------
        Magnific Popup
        -----------------------------------------------------------------------*/
        jQuery('.popup-gallery').magnificPopup({
            delegate: 'a.popup-img',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function (item) {
                    return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                }
            }
        });
        jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });


        /*---------------------------------------------------------------------
        Ripple Effect
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', ".iq-waves-effect", function (e) {
            // Remove any old one
            jQuery('.ripple').remove();
            // Setup
            let posX = jQuery(this).offset().left,
                posY = jQuery(this).offset().top,
                buttonWidth = jQuery(this).width(),
                buttonHeight = jQuery(this).height();

            // Add the element
            jQuery(this).prepend("<span class='ripple'></span>");


            // Make it round!
            if (buttonWidth >= buttonHeight) {
                buttonHeight = buttonWidth;
            } else {
                buttonWidth = buttonHeight;
            }

            // Get the center of the element
            let x = e.pageX - posX - buttonWidth / 2;
            let y = e.pageY - posY - buttonHeight / 2;


            // Add the ripples CSS and start the animation
            jQuery(".ripple").css({
                width: buttonWidth,
                height: buttonHeight,
                top: y + 'px',
                left: x + 'px'
            }).addClass("rippleEffect");
        });

        /*---------------------------------------------------------------------
            Sidebar Widget
        -----------------------------------------------------------------------*/

        jQuery(document).on("click", '.iq-menu > li > a', function () {
            jQuery('.iq-menu > li > a').parent().removeClass('active');
            jQuery(this).parent().addClass('active');
        });



        /*---------------------------------------------------------------------
        Page faq
        -----------------------------------------------------------------------*/
        jQuery('.iq-accordion .iq-accordion-block .accordion-details').hide();
        jQuery('.iq-accordion .iq-accordion-block:first').addClass('accordion-active').children().slideDown('slow');
        jQuery(document).on("click", '.iq-accordion .iq-accordion-block', function () {
            if (jQuery(this).children('div.accordion-details ').is(':hidden')) {
                jQuery('.iq-accordion .iq-accordion-block').removeClass('accordion-active').children('div.accordion-details ').slideUp('slow');
                jQuery(this).toggleClass('accordion-active').children('div.accordion-details ').slideDown('slow');
            }
        });

        /*---------------------------------------------------------------------
        Page Loader
        -----------------------------------------------------------------------*/
        jQuery("#load").fadeOut();
        jQuery("#loading").delay().fadeOut("");


        /*---------------------------------------------------------------------
        Owl Carousel
        -----------------------------------------------------------------------*/
        jQuery('.owl-carousel').each(function () {
            let jQuerycarousel = jQuery(this);
            jQuerycarousel.owlCarousel({
                items: jQuerycarousel.data("items"),
                loop: jQuerycarousel.data("loop"),
                margin: jQuerycarousel.data("margin"),
                nav: jQuerycarousel.data("nav"),
                dots: jQuerycarousel.data("dots"),
                autoplay: jQuerycarousel.data("autoplay"),
                autoplayTimeout: jQuerycarousel.data("autoplay-timeout"),
                navText: ["<i class='fa fa-angle-left fa-2x'></i>", "<i class='fa fa-angle-right fa-2x'></i>"],
                responsiveClass: true,
                responsive: {
                    // breakpoint from 0 up
                    0: {
                        items: jQuerycarousel.data("items-mobile-sm"),
                        nav: false,
                        dots: true
                    },
                    // breakpoint from 480 up
                    480: {
                        items: jQuerycarousel.data("items-mobile"),
                        nav: false,
                        dots: true
                    },
                    // breakpoint from 786 up
                    786: {
                        items: jQuerycarousel.data("items-tab")
                    },
                    // breakpoint from 1023 up
                    1023: {
                        items: jQuerycarousel.data("items-laptop")
                    },
                    1199: {
                        items: jQuerycarousel.data("items")
                    }
                }
            });
        });

        /*---------------------------------------------------------------------
        Select input
        -----------------------------------------------------------------------*/
        jQuery('.select2jsMultiSelect').select2({
            tags: true
        });

        /*---------------------------------------------------------------------
        Search input
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', function (e) {
            let myTargetElement = e.target;
            let selector, mainElement;
            if (jQuery(myTargetElement).hasClass('search-toggle') || jQuery(myTargetElement).parent().hasClass('search-toggle') || jQuery(myTargetElement).parent().parent().hasClass('search-toggle')) {
                if (jQuery(myTargetElement).hasClass('search-toggle')) {
                    selector = jQuery(myTargetElement).parent();
                    mainElement = jQuery(myTargetElement);
                } else if (jQuery(myTargetElement).parent().hasClass('search-toggle')) {
                    selector = jQuery(myTargetElement).parent().parent();
                    mainElement = jQuery(myTargetElement).parent();
                } else if (jQuery(myTargetElement).parent().parent().hasClass('search-toggle')) {
                    selector = jQuery(myTargetElement).parent().parent().parent();
                    mainElement = jQuery(myTargetElement).parent().parent();
                }
                if (!mainElement.hasClass('active') && jQuery(".navbar-list li").find('.active')) {
                    jQuery('.navbar-list li').removeClass('iq-show');
                    jQuery('.navbar-list li .search-toggle').removeClass('active');
                }

                selector.toggleClass('iq-show');
                mainElement.toggleClass('active');

                e.preventDefault();
            } else if (jQuery(myTargetElement).is('.search-input')) { } else {
                jQuery('.navbar-list li').removeClass('iq-show');
                jQuery('.navbar-list li .search-toggle').removeClass('active');
            }
        });

        /*---------------------------------------------------------------------
        Scrollbar
        -----------------------------------------------------------------------*/
        let Scrollbar = window.Scrollbar;
        if (jQuery('#sidebar-scrollbar').length) {
            Scrollbar.init(document.querySelector('#sidebar-scrollbar'), options);
        }
        let Scrollbar1 = window.Scrollbar;
        if (jQuery('#right-sidebar-scrollbar').length) {
            Scrollbar1.init(document.querySelector('#right-sidebar-scrollbar'), options);
        }



        /*---------------------------------------------------------------------
        Counter
        -----------------------------------------------------------------------*/
        jQuery('.counter').counterUp({
            delay: 10,
            time: 1000
        });

        /*---------------------------------------------------------------------
        slick
        -----------------------------------------------------------------------*/
        jQuery('.slick-slider').slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 9,
            slidesToScroll: 1,
            focusOnSelect: true,
            responsive: [{
                breakpoint: 992,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '30',
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '15',
                    slidesToShow: 1
                }
            }],
            nextArrow: '<a href="#" class="ri-arrow-left-s-line left a-aerrow"></a>',
            prevArrow: '<a href="#" class="ri-arrow-right-s-line right a-aerrow"></a>',
        });
        jQuery('.realeases-banner').slick({
            slidesToShow: 5,
            speed: 300,
            arrows: false,
            slidesToScroll: 1,
            vertical: true,
            verticalSwiping: true,
            focusOnSelect: true,
            responsive: [{
                breakpoint: 992,
                settings: {
                    arrows: false,
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    verticalSwiping: false,
                    slidesToShow: 4
                }
            }],
        });

        jQuery('.feature-album').slick({
            slidesToShow: 6,
            speed: 300,
            slidesToScroll: 1,
            focusOnSelect: true,
            appendArrows: $('#feature-album-slick-arrow'),
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    autoplay: true,
                    slidesToShow: 1
                }
            }],
        });

        jQuery('.feature-album-artist').slick({
            slidesToShow: 6,
            speed: 300,
            slidesToScroll: 1,
            appendArrows: $('#feature-album-artist-slick-arrow'),
            focusOnSelect: true,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 992,
                settings: {
                    arrows: true,
                    slidesToShow: 3
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    autoplay: true,
                    slidesToShow: 1
                }
            }],
        });

        jQuery('.hot-songs').slick({
            slidesToShow: 2,
            speed: 300,
            appendArrows: $('#hot-song-slick-arrow'),
            slidesToScroll: 1,
            rows: 3,
            focusOnSelect: true,
            responsive: [{
                breakpoint: 992,
                settings: {
                    arrows: true,
                    slidesToShow: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    autoplay: true,
                    slidesToShow: 1
                }
            }],
        });

        jQuery('.hot-video').slick({
            slidesToShow: 2,
            speed: 300,
            appendArrows: $('#hot-video-slick-arrow'),
            slidesToScroll: 1,
            focusOnSelect: true,
            responsive: [{
                breakpoint: 992,
                settings: {
                    arrows: true,
                    slidesToShow: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    autoplay: true,
                    slidesToShow: 1
                }
            }],
        });


        /*---------------------------------------------------------------------
        Progress Bar
        -----------------------------------------------------------------------*/
        jQuery('.iq-progress-bar > span').each(function () {
            let progressBar = jQuery(this);
            let width = jQuery(this).data('percent');
            progressBar.css({
                'transition': 'width 2s'
            });

            setTimeout(function () {
                progressBar.appear(function () {
                    progressBar.css('width', width + '%');
                });
            }, 100);
        });


        /*---------------------------------------------------------------------
        Page Menu
        -----------------------------------------------------------------------*/
        jQuery(document).on('click', '.wrapper-menu', function () {
            jQuery(this).toggleClass('open');
        });

        jQuery(document).on('click', ".wrapper-menu", function () {
            jQuery("body").toggleClass("sidebar-main")
            setTimeout(()=> jQuery("body").toggleClass("hover"), 450)
        });



        /*---------------------------------------------------------------------
        Wow Animation
        -----------------------------------------------------------------------*/
        let wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: false,
            live: true
        });
        wow.init();



        /*---------------------------------------------------------------------
        Form Validation
        -----------------------------------------------------------------------*/

        // Example starter JavaScript for disabling form submissions if there are invalid fields
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);

        /*---------------------------------------------------------------------
        Sidebar Widget
        -----------------------------------------------------------------------*/
        jQuery(document).ready(function () {
            jQuery().on('click', '.todo-task-lists li', function () {
                if (jQuery(this).find('input:checkbox[name=todo-check]').is(":checked")) {

                    jQuery(this).find('input:checkbox[name=todo-check]').attr("checked", false);
                    jQuery(this).removeClass('active-task');
                } else {
                    jQuery(this).find('input:checkbox[name=todo-check]').attr("checked", true);
                    jQuery(this).addClass('active-task');
                }

            });
        });



        /*------------------------------------------------------------------
        Flatpicker
        * -----------------------------------------------------------------*/
        if (typeof flatpickr !== 'undefined' && jQuery.isFunction(flatpickr)) {
            jQuery(".flatpicker").flatpickr({
                inline: true
            });
        }

        /*---------------------------------------------------------------------
            Datatables
        -----------------------------------------------------------------------*/
        if (jQuery('.data-tables').length) {
            $('.data-tables').DataTable();
        }

        /*---------------------------------------------------------------------
            Scroll up menu
        -----------------------------------------------------------------------*/
        var position = $(window).scrollTop();
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            //  console.log(scroll);

            if (scroll < position) {
                $('.tab-menu-horizontal').addClass('menu-up');
                $('.tab-menu-horizontal').removeClass('menu-down');
            }
            else {
                $('.tab-menu-horizontal').addClass('menu-down');
                $('.tab-menu-horizontal').removeClass('menu-up');
            }
            if (scroll == 0) {
                $('.tab-menu-horizontal').removeClass('menu-up');
                $('.tab-menu-horizontal').removeClass('menu-down');
            }
            position = scroll;
        });

        /*---------------------------------------------------------------------
        active music
        -----------------------------------------------------------------------*/
        jQuery('ul.iq-song-slide li').on('click', function () {
            jQuery('ul.iq-song-slide li').removeClass('active');
            jQuery(this).addClass('active');
        });
    });



})(jQuery);

if (document.getElementById('limitSetter')){
    document.getElementById('limitSetter').onchange = e => {
        document.getElementById('limitSetter').parentElement.submit()
    }
}

let forms = document.querySelectorAll('form.needConfirm')

if (forms && forms.length > 0)
    forms.forEach(form => {
        form.onsubmit = e => {
            e.preventDefault()
            if (form.reportValidity()){
                document.body.classList.add("modal-open")
                createConfirmWindow(form)
            }
        }
    })

const createConfirmWindow = form => {
    let action
    const modalWrapper = document.createElement('div')
    const modal = document.createElement('div')

    const head = document.createElement('div')
    const headTitle = document.createElement('h3')
    const closeBtn = document.createElement('a')

    const content = document.createElement('div')
    const confirmForm = document.createElement('form')
    const formWarn = document.createElement('h5')
    const formInput = document.createElement('input')
    const formButton = document.createElement('button')

    formButton.textContent = 'Confirm'
    formButton.type = "button"
    formInput.required = true
    confirmForm.method = "POST"
    confirmForm.classList.add('modal-form')
    content.classList.add('content')

    closeBtn.classList.add('btn-close', 'trigger')
    closeBtn.setAttribute('modal-target', 'confirm-form')
    head.classList.add('head')

    modal.classList.add('modal')
    modalWrapper.classList.add('modal-wrapper')
    modalWrapper.setAttribute('modal', 'confirm-form')

    switch (form.getAttribute('confirm-type')){
        case 'warn':
            formInput.placeholder = "CONFIRM"
            formInput.type = "text"
            formInput.maxLength = 7
            formInput.minLength = 7
            formWarn.innerHTML = "Are you sure you want to proceed?</br>type <span style=\"color: #ff4e4e;\">CONFIRM</span> to continue"
            action = "/confirm/warn"
            headTitle.textContent = "Warning confirm"
        break
        case 'password':
            formInput.placeholder = "Enter your password to confirm"
            formInput.type = "password"
            formInput.maxLength = 32
            formInput.minLength = 5
            formWarn.innerHTML = "Are you sure you want to proceed?</br>Enter your password to continue"
            action = "/confirm/password"
            headTitle.textContent = "Password confirm"
        break
        default: null
    }

    closeBtn.onclick = e => {
        modalWrapper.remove()
        document.body.classList.remove("modal-open")
    }
    formButton.onclick = async e => {
        if (confirmForm.reportValidity()){
            let response = await fetch(action,{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confirmValue: formInput.value
                })
            })
            if (response.status === 200) form.submit()
            else toastMessage(await response.json())
            modalWrapper.remove()
            document.body.classList.remove("modal-open")
        }
    }

    head.append(headTitle)
    head.append(closeBtn)

    confirmForm.append(formWarn)
    confirmForm.append(formInput)
    confirmForm.append(formButton)
    content.append(confirmForm)

    modal.append(head)
    modal.append(content)
    modalWrapper.append(modal)
    document.body.append(modalWrapper)

    setTimeout(()=> modalWrapper.classList.add('open'), 300)
}

const toastMessage = ({ message }) => {
    let toastCard = document.createElement('div')
    let toastCloser = document.createElement('img')
    let toastMessage = document.createElement('h3')
    toastMessage.innerText = message
    toastCloser.src = '/images/icons/close.png'
    toastMessage.classList.add('toast-message')
    toastCloser.classList.add('toast-closer')
    toastCard.classList.add('toast-card')
    toastCard.classList.add('error')
    toastCloser.addEventListener('click', e => toastCard.remove())
    toastCard.addEventListener('click', e => toastCard.remove())
    toastCard.appendChild(toastCloser)
    toastCard.appendChild(toastMessage)
    document.body.appendChild(toastCard)
    setTimeout(() => toastCard.remove(), 6300)
}

const logoutAction = document.querySelector('.logoutAction')

logoutAction.addEventListener('click', e => logoutAction.querySelector("form").submit())

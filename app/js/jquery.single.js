( function(){

    "use strict";

    $( function(){

        $.each( $( '.gallery' ), function() {
            new Sliders ( $( this ) );
        } );

    } );

    var Sliders = function( obj ) {

        //private properties
        var _obj = obj,
            _gallerySlider = _obj.find( '.gallery__swipe' ),
            _gallery;


        //private methods
        var _initSlider = function() {

                _gallery = new Swiper ( _gallerySlider, {
                    autoplay: false,
                    speed: 500,
                    effect: 'slide',
                    slidesPerView: 1,
                    centeredSlides: true,
                    loop: true,
                    nextButton: '.gallery__button-next',
                    prevButton: '.gallery__button-prev',
                    keyboardControl: true
                } );

            },
            _onEvent = function() {

            },
            _init = function() {
                _initSlider();
                _onEvent();
            };

        //public properties

        //public methods

        _init();
    };

} )();
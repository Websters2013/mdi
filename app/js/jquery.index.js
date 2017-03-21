( function(){

    "use strict";

    $( function(){

        $.each( $( '.site' ), function() {
            new Page ( $( this ) );
        } );

        $.each( $( '.review' ), function() {
            new Sliders ( $( this ) );
        } );

    } );

    var Page = function( obj ) {

        //private properties
        var _obj = obj,
            _self = this,
            _head = $( '.site__header' ),
            _hero = $( '.site-first-scene' ),
            _scrollIcon = _hero.find( '.hero__footnote' ),
            _promo = _obj.find( '.promo' ),
            _promoItem = _obj.find( '.promo__item' ),
            _promoPagination = _obj.find( '.promo__pagination' ),
            _promoSkip = _obj.find( '.promo__skip' ),
            _window = $( window ),
            _canScroll = false,
            _headerHammer = null,
            _action = false,
            _promoFlag = false,
            _firstPromoFlag = true,
            _stop = true,
            _menu = new Menu( $('.menu') );

        //private methods
        var _onEvent = function() {
                _window.on( {
                    'DOMMouseScroll':function(e){
                        var delta =  e.originalEvent.detail;

                        if( delta ){
                            var direction = ( delta > 0 ) ? 1 : -1;

                            if( !_action ){
                                _checkScroll(direction);
                            }

                            if( _action || !_canScroll ){
                                return false;
                            }
                        }
                    },
                    'mousewheel': function(e){
                        var delta = e.originalEvent.wheelDelta;

                        if( delta ){
                            var direction = ( delta > 0 ) ? -1 : 1;

                            if( !_action ){
                                _checkScroll(direction);
                            }

                            if( _action || !_canScroll ){
                                return false;
                            }
                        }

                    },
                    'keydown': function ( e ) {
                        switch( e.which ) {

                            case 32:
                                _checkScroll( 1 );
                                break;
                            case 33:
                                _checkScroll( -1 );
                                break;
                            case 34 :
                                _checkScroll( 1 );
                                break;
                            case 35 :
                                _checkScroll( 1 );
                                break;
                            case 36 :
                                _checkScroll( -1 );
                                break;
                            case 38:
                                _checkScroll( -1 );
                                break;
                            case 40:
                                _checkScroll( 1 );
                                break;

                            default:
                                return;
                        }
                    }
                });
                _headerHammer.on("panup", function(e){
                    if(e.pointerType == 'touch'){
                        if( !_action || _canScroll ){
                            _checkScroll(1);
                        }
                    }
                });
                _headerHammer.on("pandown", function(e){
                    if(e.pointerType == 'touch') {
                        if ( !_action || _canScroll) {
                            _checkScroll(-1);
                        }
                    }
                });
                _scrollIcon.on({
                    click: function () {
                        _checkScroll(1);
                    }
                });
                _obj.on({
                    'scroll': function () {
                        _canScroll = true;
                    }
                });
                _promoSkip.on( {
                    click: function() {

                        $( '.site' ).animate( {
                            scrollTop: _promo.outerHeight()
                        }, 600);

                        if ( _promoItem.filter( '.active' ).index() == 0 ) {
                            _firstPromoFlag = true;
                            _promoFlag = false;
                            _canScroll = false;
                        }

                        return false;
                    }
                } );
                _promoPagination.find( 'span' ).on( {
                    click: function () {

                        _stop = false;

                        var curPoint = $( this ).index();

                        _promoItem.removeClass( 'active' );
                        _promoItem.eq( curPoint ).addClass( 'active' );
                        _promoItem.eq( curPoint ).removeClass( 'prev' );
                        _promoItem.filter( '.active' ).prevAll( '.promo__item' ).addClass( 'prev' )
                        _promoItem.filter( '.active' ).nextAll( '.promo__item' ).removeClass( 'prev' )

                        _pagination();

                        if ( _promoItem.filter( '.active' ).index() == 0 ) {
                            _firstPromoFlag = true;
                            _promoFlag = false;
                        } else {
                            _firstPromoFlag = false;
                            _promoFlag = false;
                        }

                        //for css animation
                        setTimeout(function(){
                            _stop = true;
                        }, 1000);

                    }
                } )
            },
            _initHammer = function(){
                _headerHammer = new Hammer.Manager( $('body')[0] );
                _headerHammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
                delete Hammer.defaults.cssProps.userSelect;
            },
            _initPromo = function () {

                _promoItem.each( function () {
                    _promoPagination.append( '<span></span>' )
                } );

                _pagination();

            },
            _pagination  = function () {

                var curPoint = _promoItem.filter( '.active' ).index(),
                    span = _promoPagination.find( 'span' );

                span.removeClass( 'active' );
                span.eq( curPoint ).addClass( 'active' );

            },
            _checkScroll = function( direction ){
                if ( direction > 0 && !_canScroll && !_menu.opened && !_promoFlag && _stop ){
                    _hideHero();
                }
                else if ( direction > 0 && !_canScroll && !_menu.opened && _promoFlag && _stop ){
                    _checkPromoDown();
                }
                else if ( direction < 0 && !_canScroll && !_menu.opened && _firstPromoFlag && _stop ) {
                    _showHero();
                    _canScroll = false;
                }
                else if ( direction < 0 && ( _obj.scrollTop() == 0 ) && !_menu.opened && _stop ) {
                    _checkPromoUp()
                }

            },
            _checkPromoDown = function () {

                _stop = false;

                var curElem = _promoItem.filter( '.active' ),
                    lengthItems = _promoItem.length;

                if ( ( lengthItems - 2 ) >= curElem.index() ) {

                    curElem.each( function () {

                        $( this ).next( '.promo__item' ).addClass( 'active' );
                        $( this ).addClass( 'prev' );
                        $( this ).removeClass( 'active' );

                        _firstPromoFlag = false;
                    } );

                } else {
                    _canScroll = true;
                }

                _pagination();

                //for css animation
                setTimeout(function(){
                    _stop = true;
                    console.log( 'go' );
                }, 1000);

            },
            _checkPromoUp = function () {

                _stop = false;
                _canScroll = false;

                var curElem = _promoItem.filter( '.active' );

                if ( curElem.index() >= 1 ) {

                    curElem.each( function () {
                        $( this ).prev( '.promo__item' ).removeClass( 'prev' );
                        $( this ).prev( '.promo__item' ).addClass( 'active' );
                        $( this ).removeClass( 'active' );
                    } );

                    if ( curElem.index() == 1 ) {
                        _firstPromoFlag = true;
                        _promoFlag = false;
                    }

                }

                _pagination();

                //for css animation
                setTimeout(function(){
                    _stop = true;
                    console.log( 'go' );
                }, 1000);

            },
            _hideHero = function(){

                _stop = false;

                if(!_action){
                    _action = true;

                    _hero.addClass('hide');
                    _self.hide = true;
                    _head.addClass('site__header-hide');
                    $( '.menu' )[0].obj.destroy();

                    //for css animation
                    setTimeout(function(){
                        _action = false;
                        _stop = true;
                        console.log( 'go' );
                    }, 1500);

                    _promoFlag = true;

                }

            },
            _showHero = function(){

                _stop = false;

                if(!_action){
                    _action = true;

                    _hero.removeClass('hide');
                    _head.removeClass('site__header-hide');

                    //for css animation
                    setTimeout(function(){
                        _action = false;
                        _stop = true;
                        console.log( 'go' );
                    }, 1000);
                }

                _promoFlag = false;

            },
            _construct = function() {
                _initHammer();
                _initPromo();
                _onEvent();
                _obj[ 0 ].obj = _self;
            };

        //public properties
        _self.hide = false;

        //public methods

        _construct();
    };

    var Sliders = function( obj ) {

        //private properties
        var _obj = obj,
            _promoSlider = _obj.find( '.promo__swipe' ),
            _reviewSlider = _obj.find( '.review__swipe' ),
            _promo,
            _review;

        //private methods
        var _initSlider = function() {

                _promo = new Swiper ( _promoSlider, {
                    autoplay: 3000,
                    speed: 500,
                    effect: 'fade',
                    slidesPerView: 1,
                    loop: true,
                    centeredSlides: true
                } );

                _review = new Swiper ( _reviewSlider, {
                    autoplay: false,
                    speed: 500,
                    effect: 'fade',
                    slidesPerView: 1,
                    centeredSlides: true,
                    loop: true,
                    nextButton: '.review__button-next',
                    prevButton: '.review__button-prev'
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
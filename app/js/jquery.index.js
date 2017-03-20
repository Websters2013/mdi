( function(){

    "use strict";

    $( function(){

        $.each( $( '.site-first-scene' ), function() {
            new Hero ( $( this ) );
        } );

        $.each( $( '.review' ), function() {
            new Sliders ( $( this ) );
        } );

    } );

    var Promo = function( obj ) {

        //private properties
        var _obj = obj,
            _self = this,
            _item = _obj.find( '.promo__item' ),
            _site = $( '.site' ),
            _window = $( window ),
            _action = false,
            _canScroll = false,
            _hero = new Hero( $('.site-first-scene') );

        //private methods
        var _onEvent = function() {

            },
            _getScrollWidth = function (){
                var scrollDiv = document.createElement( 'div'),
                    scrollBarWidth;

                scrollDiv.className = 'promo__scrollbar-measure';

                document.body.appendChild( scrollDiv );

                scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

                document.body.removeChild(scrollDiv);

                return scrollBarWidth;
            },
            _construct = function() {
                _initFrame();
                _onEvent();
                _obj[ 0 ].obj = _self;
            };

        //public properties
        _self.first = false;

        //public methods

        _construct();
    };

    var Hero = function( obj ) {

        //private properties
        var _obj = obj,
            _self = this,
            _head = $( '.site__header' ),
            _site = $( '.site' ),
            _window = $( window ),
            _canScroll = false,
            _scrollIcon = _obj.find( '.hero__footnote' ),
            _promo = _obj.find( '.promo' ),
            _promoItem = _obj.find( '.promo__item' ),
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
            },
            _initHammer = function(){
                _headerHammer = new Hammer.Manager( $('body')[0] );
                _headerHammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
                delete Hammer.defaults.cssProps.userSelect;
            },
            _checkPromoDown = function () {

                _stop = false;

                var curElem = $( '.promo__item.active' ),
                    lengthItems = $( '.promo__item' ).length;

                if ( lengthItems >= curElem.index() + 2 ) {

                    curElem.each( function () {

                        $( this ).next( '.promo__item' ).addClass( 'active' );
                        $( this ).removeClass( 'active' );

                        _firstPromoFlag = false;
                    } );

                } else {
                    _canScroll = true;
                }

                //for css animation
                setTimeout(function(){
                    _stop = true;
                }, 1000);

            },
            _checkPromoUp = function () {

                _stop = false;

                var curElem = $( '.promo__item.active' );

                _canScroll = false;

                if ( curElem.index() >= 1 ) {

                    curElem.each( function () {
                        $( this ).prev( '.promo__item' ).addClass( 'active' );
                        $( this ).removeClass( 'active' );
                    } );

                } else {
                    _firstPromoFlag = true;
                    _promoFlag = false;
                }

                //for css animation
                setTimeout(function(){
                    _stop = true;
                }, 1000);

            },
            _checkScroll = function( direction ){
                if ( direction > 0 && !_canScroll && !_menu.opened && !_promoFlag && _stop ){
                    _hideHero();
                }
                else if ( direction > 0 && !_canScroll && _promoFlag && _stop ){
                    _checkPromoDown();
                }
                else if ( direction < 0 && !_canScroll && _firstPromoFlag && _stop ) {
                    _showHero();
                    _canScroll = false;
                }
                else if ( direction < 0 && ( _site.scrollTop() == 0 ) && _stop ) {
                    _checkPromoUp()
                }

            },
            _hideHero = function(){

                _stop = false;

                if(!_action){
                    _action = true;

                    _obj.addClass('hide');
                    _self.hide = true;
                    _head.addClass('site__header-hide');
                    $( '.menu' )[0].obj.destroy();

                    //for css animation
                    setTimeout(function(){
                        _action = false;
                        _stop = true;
                    }, 1000);

                    _promoFlag = true;

                }

            },
            _showHero = function(){

                _stop = false;

                if(!_action){
                    _action = true;

                    _obj.removeClass('hide');
                    _head.removeClass('site__header-hide');

                    //for css animation
                    setTimeout(function(){
                        _action = false;
                        _stop = true;
                    }, 1000);
                }

            },
            _construct = function() {
                _initHammer();
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
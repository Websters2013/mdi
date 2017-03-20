$( function(){

    $.each( $( '.service__menu-item' ), function() {
        new Anchor( $( this ) );
    } );

    $.each( $( '.service__menu' ), function() {
        new ServiceNav( $( this ) );
    } );

    $.each( $( '.service' ), function() {
        new ServiceParalax( $( this ) );
    } );

} );

var Anchor = function ( obj ) {
    var _obj = obj,
        _window = $( 'html, body' );

    var _onEvents = function() {

            _obj.on( {
                click: function() {

                    _window.animate( {
                        scrollTop: $( $.attr(this, 'href') ).offset().top - $( $.attr(this, 'href') ).outerHeight() / 2
                    }, 600);

                    return false;
                }
            } );

        },
        _construct = function() {
            _onEvents();
        };

    _construct()
};

var ServiceNav = function( obj ) {

    //private properties
    var _menu = obj,
        _siteSections = $( '.service__item' ),
        _menuPosition = _menu.offset().top,
        _parent = $( '.service' ),
        _window = $( window );

    //private methods
    var _initSlider = function() {

            _window.on( {
                'scroll': function() {

                    _fixMenu();
                    _actionTop();

                }
            } )

        },
        _fixMenu = function() {
            var parentPosition = _parent.offset().top,
                parentHeight = _parent.outerHeight(),
                menuPosition = _menu.offset().top,
                menuHeight =  _menu.outerHeight();

            if ( ( ( parentPosition + parentHeight ) <= ( menuPosition + menuHeight ) ) && ( ( _window.scrollTop() + _window.outerHeight() )  >= ( parentPosition + parentHeight ) ) ) {
                _menu.removeClass( 'service__menu_fix' );
                _menu.css( 'top', ( parentHeight - menuHeight ) );
            } else if ( ( _window.scrollTop() >= _menuPosition ) && ( parentPosition + parentHeight ) >= ( menuPosition + menuHeight ) ) {
                _menu.addClass( 'service__menu_fix' );
                _menu.css( 'top', 0 );
            } else {
                _menu.removeClass( 'service__menu_fix' );
            }

        },
        _actionTop = function() {

            _siteSections.each( function() {
                var siteSectionsTop = $( this ).offset().top - ( $( this ).outerHeight() / 2 + 10 ) ;

                if( siteSectionsTop <= _window.scrollTop() ) {

                    _siteSections. removeClass( 'active' );
                    $( this ).addClass( 'active' );

                    _menu.find( '.service__menu-item' ).removeClass( 'active' );
                    _menu.find( '.service__menu-item[href="#'+ $( this ).attr("id") +'"]' ).addClass( 'active' );
                }

            } );

        },
        _construct = function() {
            _fixMenu();
            _initSlider();
        };

    //public properties

    //public methods

    _construct();
};

var ServiceParalax = function ( obj ) {
    var _obj = obj,
        _step = 10,
        _deco1 = $( '.service__deco_1' ),
        _deco2 = $( '.service__deco_2' ),
        _decoImg1 = _deco1.find( 'img' ),
        _decoImg2 = _deco2.find( 'img' ),
        _decoPosition1 = _deco1.offset().top,
        _decoPosition2 = _deco2.offset().top,
        _window = $( window );

    var _onEvents = function() {

            _window.on( {
                scroll: function(){
                    _moveDecoScroll1();
                    _moveDecoScroll2();
                }
            } );

        },
        _moveDecoScroll1 = function() {
            var pageX = _window.scrollTop(),
                halfWidth = _obj.outerHeight(),
                percentFromCenterX = ( ( pageX - halfWidth ) / halfWidth ) * 20,
                percentFromCenterY = ( pageX - halfWidth ) / halfWidth * -50;

            _decoImg1.css( {
                '-webkit-transform': 'translate( ' + -( percentFromCenterX * _step ) + 'px, ' + -( percentFromCenterY * _step ) + 'px )',
                'transform': 'translate( ' + -( percentFromCenterX * _step ) + 'px, ' + -( percentFromCenterY * _step ) + 'px )'
            } );

        },
        _moveDecoScroll2 = function() {
            var pageX = _window.scrollTop(),
                halfWidth = _obj.outerHeight(),
                percentFromCenterX = ( ( pageX - halfWidth ) / halfWidth ) * -30,
                percentFromCenterY = ( pageX - halfWidth ) / halfWidth * 40;

            _decoImg2.css( {
                '-webkit-transform': 'translate( ' + -( percentFromCenterX * _step ) + 'px, ' + -( percentFromCenterY * _step ) + 'px )',
                'transform': 'translate( ' + -( percentFromCenterX * _step ) + 'px, ' + -( percentFromCenterY * _step ) + 'px )'
            } );

        },
        _construct = function() {
            _onEvents();
        };

    _construct()
};
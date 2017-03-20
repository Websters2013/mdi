$( function(){

    $.each( $( '.menu' ), function() {
        new Menu ( $( this ) );
    } );

    $.each( $( '.preloader' ), function() {
        new Preloader ( $( this ) );
    } );

} );

var Menu = function( obj ) {

    //private properties
    var _obj = obj,
        _self = this,
        _btnOpen = $( '.menu-btn' ),
        _btnClose = _obj.find( '.menu__close' ),
        _headerHammer = null,
        _window = $( window );

    //private methods
    var _onEvent = function () {

            _window.on(
                'resize', function(){
                    _closeMenu();
                }
            );

            _btnOpen.on(
                'click', function () {
                    _openMenu();
                }
            );

            _btnClose.on(
                'click', function () {
                    _closeMenu();
                }
            );

        },
        _openMenu = function () {
            _obj.addClass( 'menu_open' );
            _self.opened = true;
        },
        _closeMenu = function () {
            _obj.removeClass( 'menu_open' );
            _self.opened = false;
        },
        _construct = function () {
            _onEvent();
            _obj[ 0 ].obj = _self;
        };

    //public properties
    _self.opened = false;

    //public methods
    _self.destroy = function () {
        _closeMenu()
    };

    _construct();
};

var Preloader = function( obj ) {

    //private properties
    var _obj = obj;

    //private methods
    var  _onEvent = function() {

        },
        _showSite = function() {

            _obj.addClass( 'hide' );

            setTimeout(function() {
                _obj.remove();
            }, 750);

        },
        _init = function() {
            _onEvent();
            _showSite();
        };

    //public properties

    //public methods

    _init();
};
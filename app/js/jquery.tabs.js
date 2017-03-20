( function() {

    $( function() {

        $( '.tabs' ).each( function(){
            new Tabs( {
                obj: $( this ),
                showType: 2, // if "showType = 0" tabs will be without any animations
                activeIndex: function( index ){
                    console.log( index )
                 }
            } );
        } );

    } );

    var Tabs = function( params ) {

        //private properties
        var _self = this,
            _obj = params.obj,
            _showType = params.showType,
            _callbackActiveIndex = params.activeIndex,
            _window = $( window ),
            _tabsBtn = _obj.find( 'dt'),
            _tabsContent = _obj.find( 'dd'),
            _mobileScreen = true;

        //private methods
        var _addClassForAnimation = function() {

                if( _showType == 1 ){

                    _obj.addClass( 'tabs_animated1' );

                } else if( _showType == 2 ){

                    _obj.addClass( 'tabs_animated2' );

                }

            },
            _onEvents = function()  {

                _tabsBtn.on( {
                    click: function() {

                        if( _window.width() < 992 ) {

                            _slideContent( $( this) );

                        } else {

                            _changeActiveTab( $( this) );
                            _setMinHeight( $( this) );

                        }

                    }
                } );

                _window.on( {
                    load: function () {

                        if( _window.width() >= 992 ) {

                            _setTopPos();
                            _setFirstActive();
                            _mobileScreen = false;

                        } else {

                            _mobileScreen = true

                        }

                    },
                    resize: function() {

                        if( _window.width() >= 992 ) {

                            _setTopPos();
                            _setFirstActive();
                            _mobileScreen = false;

                        } else {

                            _resetStyle();
                            _mobileScreen = true

                        }

                    }
                } );

            },
            _init = function() {

                _obj[ 0 ].obj = _self;
                _onEvents();
                _addClassForAnimation();

            },
            _setTopPos = function() {

                _tabsContent.css( {
                    top: _tabsBtn.eq( -1 ).position().top + _tabsBtn.eq( -1 ).innerHeight()
                } );

            },
            _changeActiveTab = function( elem ) {

                var curItem = elem,
                    nextContent = curItem.next(),
                    nextContentInner = nextContent.find( '.tabs__content' );

                if( !curItem.hasClass( 'active' ) ) {

                    _tabsBtn.removeClass( 'active' );
                    _tabsContent.height( 0 );
                    curItem.addClass( 'active' );
                    nextContent.innerHeight( nextContentInner.innerHeight() );
                }

                _callbackActiveIndex( curItem.index() / 2 );

            },
            _setFirstActive = function() {

                if( _mobileScreen ) {

                    _tabsBtn.eq( 0 ).addClass( 'active' );
                    _setMinHeight( _tabsBtn.eq( 0 ) );

                }

            },
            _setMinHeight = function( elem ) {

                var nextElem = elem.next();

                _obj.css( {
                    'min-height': nextElem.find( '.tabs__content' ).height() + nextElem.position().top
                } );

            },
            _slideContent = function( elem ) {

                var curItem = elem,
                    nextContent = curItem.next(),
                    nextContentInner = nextContent.find( '.tabs__content' );

                if( !curItem.hasClass( 'active' ) ) {

                    _tabsBtn.removeClass( 'active' );
                    _tabsContent.removeAttr( 'style' );
                    curItem.addClass( 'active' );
                    nextContent.height( nextContentInner.innerHeight() );

                } else {

                    curItem.removeClass( 'active' );
                    nextContent.removeAttr( 'style' );
                }

            },
            _resetStyle = function() {

                _obj.removeAttr( 'style' );
                _tabsBtn.removeClass( 'active' );
                _tabsContent.removeAttr( 'style' );

            };

        _init();
    };

} )();


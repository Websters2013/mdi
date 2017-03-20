( function(){

    "use strict";

    $( function(){

        $.each( $( '.contact__form' ), function() {
            new Contact ( $( this ) );
        } );

        $.each($('.map'), function () {
            new Map($(this));
        });

    } );

    var Contact = function( obj ) {

        //private properties
        var _obj = obj,
            _input = _obj.find( 'input, textarea' ),
            _label = _input.next( 'span' );

        //private methods
        var _onEvent = function() {

                _input.on(
                    'change', function () {

                        if ( !( $( this ).val() == '' ) ){
                            $( this ).addClass( 'full' )
                        } else {
                            $( this ).removeClass( 'full' )
                        }

                    }
                )

            },
            _construct = function() {
                _onEvent();
            };

        //public properties

        //public methods

        _construct();
    };

    var Map = function (obj) {

        //private properties
        var _self = this,
            _window = $(window),
            _mapData = obj.data('map'),
            _map = null,
            _obj = obj;

        //private methods
        var _addEvents = function () {

            },
            _getMapData = function(){
                _mapData.center = new google.maps.LatLng(_mapData.center[0], _mapData.center[1]);

                $.each(_mapData.points, function (i) {
                    _mapData.points[i] = new google.maps.LatLng(this[0], this[1]);
                });
            },
            _init = function () {
                _getMapData();

                google.maps.event.addDomListener(window, 'load', _initMap);

                _addEvents();
            },
            _initMap= function(){

                var MY_MAPTYPE_ID = 'custom_style',
                    featureOpts = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}],
                    mapOptions = {
                        zoom: _mapData.zoom,
                        center: _mapData.center,
                        mapTypeControlOptions: {
                            mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
                        },
                        mapTypeId: MY_MAPTYPE_ID,
                        disableDefaultUI: true,
                        scrollwheel: false,
                        gestureHandling: 'cooperative',
                        zoomControl: false,
                        mapTypeControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: false
                    },
                    styledMapOptions = {
                        name: 'Custom Style'
                    },
                    customMapType = null,
                    image = 'img/map.png';

                _map = new google.maps.Map(_obj[0], mapOptions);

                customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

                _map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

                $.each(_mapData.points, function () {
                    new google.maps.Marker({
                        position: this,
                        map: _map,
                        icon: image
                    });
                });

            };

        //public properties

        //public methods


        _init();
    };

} )();
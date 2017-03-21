( function(){

    "use strict";

    $( function(){

        $.each( $( '.site' ), function() {
            new LoadItem ( $( this ) );
        } );

    } );

    var LoadItem = function( obj ) {

        //private properties
        var _obj = obj,
            _canSendRequest = true,
            _loadFlag,
            _request = new XMLHttpRequest();

        //private methods
        var _onEvent = function() {

            },
            _constructPage = function ( curItem  ) {

                var item;

                if ( curItem.d.EstateList.length == 0 ){
                    _noResults();
                }

                $.each( curItem.d.EstateList, function( i ) {

                    var item = this,
                        curPrice = String( item.Price ),
                        curPriceText = curPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.'),
                        curCurrency = item.Currency,
                        curCity = item.City,
                        curPurposes = item.Purposes[0].PurposeStatus,
                        curSubCategory = item.SubCategory,
                        curLongDescription = item.LongDescription,
                        curArea = item.Area,
                        curRooms = item.Rooms,
                        curBath = item.BathRooms,
                        curPictures = item.Pictures,
                        itemFeature = $( '.apartment__info' ),
                        gallery = $( '.gallery__wrap' ),
                        gallerySwipe = $( '<div class="gallery__swipe swiper-container"></div>' ),
                        swiperWrap = $( '<div class="swiper-wrapper"></div>' ),
                        swipePrev = $( '<div class="gallery__button-prev"></div>' ),
                        swipeNext = $( '<div class="gallery__button-next"></div>' );

                    $( '.apartment__title' ).html( curSubCategory +' '+ curPurposes +' à '+ curCity );
                    $( '.apartment__price' ).html( curPriceText +' '+ curCurrency );

                    if ( curLongDescription !== "" ) {

                        $( '.apartment__content' ).html( curLongDescription );
                        $( '.apartment__content' ).css( 'display', 'block' )

                    }

                    if ( curArea !== null ) {

                        itemFeature.append( '<li><img src="img/icons-001.png" alt="img"><p>'+curArea+' m<sup>2</sup></p></li>' )

                    }

                    if ( curRooms !== null && curRooms !== 0 ) {

                        itemFeature.append( '<li><img src="img/icons-002.png" alt="img">'+curRooms+' chambres</li>' )

                    }

                    if ( curBath !== null && curBath !== 0 ) {

                        itemFeature.append( '<li><img src="img/icons-003.png" alt="img">'+curBath+' salles de bain</li>' )

                    }

                    if ( curPictures !== null ) {

                        for( var i = 0; curPictures.length > i; i++ ){

                            var curPicture = curPictures[i].UrlLarge;
                            swiperWrap.append( '<div class="gallery__item swiper-slide"><img src="'+ curPicture +'" alt="img"/></div>' )

                        }

                        gallerySwipe.append( swiperWrap );
                        gallery.append( gallerySwipe );
                        gallery.append( swipePrev );
                        gallery.append( swipeNext );

                    }

                    $.each( $( '.gallery' ), function() {
                        new Sliders ( $( this ) );
                    } );

                    _obj.removeClass( 'loading' );

                    // var details = item.Details,
                    //     characteristicWrap = $( '.characteristic__wrap' ),
                    //     cadastralIncome = characteristicWrap.find( '#CadastralIncome' ),
                    //     realEstate = characteristicWrap.find( '#RealEstate' ),
                    //     yearOfConstruction = characteristicWrap.find( '#YearOfConstruction' ),
                    //     disabledAccess = characteristicWrap.find( '#DisabledAccess' ),
                    //     PEB = characteristicWrap.find( '#PEB' ),
                    //     electricityCertificate = characteristicWrap.find( '#ElectricityCertificate' ),
                    //     reinforcedDoor = characteristicWrap.find( '#ReinforcedDoor' ),
                    //     parlophone = characteristicWrap.find( '#Parlophone' ),
                    //     elevator = characteristicWrap.find( '#Elevator' );
                    //
                    // cadastralIncome.html ( details[0].Subdetails[0].Value +' '+ curCurrency );
                    // realEstate.html ( details[1].Subdetails[0].Value +' '+ curCurrency );
                    // yearOfConstruction.html ( details[4].Subdetails[0].Value );
                    // disabledAccess.html ( ( details[6].Subdetails[0].Value > 0 ) ? 'Oui' : 'Non' );
                    // PEB.html ( details[28].Subdetails[0].Value );
                    // electricityCertificate.html ( ( details[31].Subdetails[0].Value > 0 ) ? 'Oui' : 'Non' );
                    // reinforcedDoor.html ( ( details[37].Subdetails[0].Value > 0 ) ? 'Oui' : 'Non' );
                    // parlophone.html ( ( details[38].Subdetails[0].Value > 0 ) ? 'Oui' : 'Non' );
                    // elevator.html ( ( details[42].Subdetails[0].Value > 0 ) ? 'Oui' : 'Non' );

                    // sevenuCadastral.append()

                });

            },
            _getFilterString = function( id ) {

                var data = null;

                data = {
                    ClientId: "1411952449",
                    Page: 0,
                    RowsPerPage: 1,
                    Language:'fr-BE',
                    ShowDetails: 1,
                    EstateID: id
                };

                return JSON.stringify( data );

            },
            _loadData = function(){

                _loadFlag = false;

                var id = _checkUrl(),
                    data = _getFilterString( id );

                _sendRequest( data, false );

            },
            _noResults = function () {
                _obj.addClass( 'noResults' );
                _obj.removeClass( 'loading' );
            },
            _checkUrl= function() {

                var url = location.search.substr( 1 ).split( '&' );

                if ( url[0] == "" ) {
                    _noResults();
                    return false;
                }

                for ( var i = 0; i <= url.length; i++ ){

                    var str = url[i].split( '=' ),
                        token;

                    if( str[ 0 ] == 'id' ){
                        token = str[ 1 ];

                        return token;
                    }

                }

            },
            _sendRequest = function( requestData ) {

                if( _canSendRequest ){

                    _request.abort();
                    _obj.addClass( 'loading' );

                    _request = $.ajax({
                        url: 'https://crossorigin.me/http://webservices.whoman2.be/websiteservices/EstateService.svc/GetEstateList',
                        data: 'EstateServiceGetEstateListRequest=' + requestData,
                        dataType: 'json',
                        timeout: 20000,
                        type: 'GET',
                        success: function ( data ) {

                            setTimeout(function () {

                                _constructPage ( data );

                                console.log( data );

                            },150);


                        },
                        error: function ( XMLHttpRequest ) {
                            if ( XMLHttpRequest.statusText != "abort" ) {
                                _noResults();
                                console.log( 'err' );
                            }
                        }
                    });
                }

            },
            _constructor = function() {
                _loadData();
            };

        //public properties

        //public methods

        _constructor();
    };

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
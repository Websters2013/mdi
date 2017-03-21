$( function(){

    $.each( $( '.list__item' ), function() {
        new Sliders ( $( this ) );
    } );

    $.each( $( '.filter' ), function() {
        new FilterForm ( $( this ) );
    } );

    $.each( $( '.filter__item' ), function() {
        new OpenPopup ( $( this ) );
    } );

} );

var FilterForm = function( obj ){

    //private properties
    var _obj = obj,
        _filterForm = _obj.find( '.filter__form' ),
        _roomsWrapper = _obj.find( '.filter_room' ),
        _roomsInputs = _roomsWrapper.find( 'input' ),
        _typeWrapper  = _obj.find( '.filter_good' ),
        _typeInputs = _typeWrapper.find( 'input' ),
        _budgetWrapper  = _obj.find( '.filter_budget' ),
        _budgeInputs = _budgetWrapper.find( 'input' ),
        _purposeInputs = _obj.find( '.filter__purpose' ),
        _catalog = $( '.list' ),
        _catalogWrap = _catalog.find( '.list__wrap' ),
        _noResults = _catalog.find( '.list__noresults' ),
        _sortSelect = $( '#estate' ),
        _sortSens = $( '#order' ),
        _window = $( window ),
        _itemsPerPage = 5,
        _loadFlag,
        _rowCount,
        _canSendRequest = true,
        _request = new XMLHttpRequest();

    //private methods
    var _constructor = function(){
            _onEvents();
            _loadData();
        },
        _checkPriceFields = function ( input ) {

            var minField = _budgetWrapper.find( 'input' ).filter( '[name = price-min]' ),
                maxField = _budgetWrapper.find( 'input' ).filter( '[name = price-max]' ),
                minVal = parseInt( minField.val().replace(/[^-0-9]/gim,'') ),
                maxVal = parseInt( maxField.val().replace(/[^-0-9]/gim,'') ),
                nod = document.createTextNode( String.fromCharCode( 8364 ) ),
                label = _budgetWrapper.find( 'span' ),
                txt = nod.textContent;

            if (minVal > maxVal && maxVal > 0) {

                input.addClass( 'required' )

            } else if ( input.val() == '' ) {

                label.filter( "[data-type="+ input.attr( 'name' )+"]" ).html( '0 '+ txt );

                _filterForm.trigger( 'submit' );

            } else {

                label.filter( "[data-type="+ input.attr( 'name' )+"]" ).html( input.val().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') + ' '+txt );

                _budgetWrapper.find( 'input' ).removeClass( 'required' )

                _filterForm.trigger( 'submit' );
            }
        },
        _createCatalog = function( data ) {
            var card;

            _rowCount = data.d.QueryInfo.RowCount;

            $.each( data.d.EstateList, function( i ) {

                card = _createCatalogItem( this, _rowCount);

                _catalogWrap.append( card );

            });

            setTimeout(function () {

                $.each( $( '.list__item_new' ), function() {
                    new Sliders ( $( this ) );
                    $( this ).removeClass( 'list__item_new' );
                } );

            }, 100);

            _catalog.removeClass( 'loading' );

            if ( _rowCount == 0 || !$( '.list__item' ).length ){

                _noResults.addClass( 'active' );

            }

            _loadFlag = true;

        },
        _createCatalogItem = function( curItem ) {

            var curPrice = String( curItem.Price ),
                curPriceText = curPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.'),
                curName = curItem.Name,
                curCity = curItem.City,
                curSubCategory = curItem.SubCategory,
                curArea = curItem.Area,
                curRooms = curItem.Rooms,
                curBath = curItem.BathRooms,
                curCurrency = curItem.Currency,
                curPictures = curItem.Pictures,
                curId = curItem.EstateID,
                item = $( '<div class="list__item list__item_new"></div>' ),
                itemContent = $( '<div class="list__content"></div>' ),
                itemName = $( '<h2>'+curName+'</h2>' ),
                itemAbout = $( '<p>'+curSubCategory+' à '+curCity+'</p>' ),
                itemPrice = $( '<p><strong>'+curPriceText+' '+curCurrency+'<strong></p>' ),
                itemFeature = $( '<ul class="list__feature"></ul>' ),
                itemGallery = $( '<div class="list__gallery"></div>' ),
                swiper = $( '<div class="list__gallery-swipe swiper-container"></div>' ),
                swiperWrap = $( '<div class="swiper-wrapper"></div>' ),
                swiperPagination = $( '<div class="list__gallery-pagination"></div>' ),
                swiperLink = $( '<div class="list__more"><a href="single.html?id='+ curId +'">Découvrir le bien <svg viewBox="0 0 58.5 28.5"><g><g><path d="M58.5,14.25a1.75,1.75,0,0,0-.42-1L46.08.47A1.51,1.51,0,0,0,44,.41a1.55,1.55,0,0,0-.06,2.12l9.63,10.22H1.5a1.5,1.5,0,0,0,0,3h52L43.9,26A1.57,1.57,0,0,0,44,28.09,1.5,1.5,0,0,0,46.08,28l12-12.75A1.33,1.33,0,0,0,58.5,14.25Z"/></g></g></svg></a></div>' );

            if ( curArea !== null ) {

                itemFeature.append( '<li><img src="img/icons-004.png" alt="img"><p>'+curArea+' m<sup>2</sup></p></li>' )

            }

            if ( curRooms !== null && curRooms !== 0 ) {

                itemFeature.append( '<li><img src="img/icons-005.png" alt="img">'+curRooms+' chambres</li>' )

            }

            if ( curBath !== null && curBath !== 0 ) {

                itemFeature.append( '<li><img src="img/icons-006.png" alt="img">'+curBath+' salles de bain</li>' )

            }

            if ( curPictures !== null ) {

                for( var i = 0; 3 > i; i++ ){

                    var curPicture = curPictures[i].UrlLarge;
                    swiperWrap.append( '<div class="list__gallery-item swiper-slide" data-href="'+ curPicture +'"><img src="'+ curPicture +'" alt="img"/></div>' )
                }

                swiper.append( swiperWrap );
                itemGallery.append( swiper );
                itemGallery.append( swiperPagination );

            }

            itemContent.append( itemName );
            itemContent.append( itemAbout );
            itemContent.append( itemPrice );
            itemContent.append( itemFeature );
            itemContent.append( swiperLink );
            item.append( itemContent );
            item.append( itemGallery );

            return item;
        },
        _getFilterString = function( page ) {

            var rooms = _getMinMaxRoom(),
                data = null;

            data = {
                ClientId: "ff5cc96207e54f528fc1",
                PurposeIDList:[ _purposeInputs.val() ],
                StatusIDList:[1],
                RowsPerPage:_itemsPerPage,
                Page: page,
                Language:'fr-BE',
                ShowDetails:0,
                MinRooms:rooms[ 0 ],
                MaxRooms:rooms[ 1 ],
                CategoryIDList:_getCategoryArray(),
                ZipList:_getCityArray(),
                PriceRange:_getPriceRange(),
                OrderByFields: [ _sortSelect.val() +' '+ _sortSens.val() ]
            };

            _sendDataObj = data;

            return JSON.stringify( data );

        },
        _getCategoryArray = function() {

            var typeArr = [];

            _typeInputs.each(function (){

                var curInput = $( this );

                if ( curInput.prop( 'checked' ) ) {

                    typeArr.push( curInput.data( 'category' ) );

                }

            } );

            return typeArr;
        },
        _getCityArray = function() {
            var locationLabel = _obj.find( 'span' ).filter( '[data-type=location]' ),
                cityArr = [];

            locationLabel.each(function () {

                var curLabel = $( this );

                cityArr.push( parseFloat( curLabel.data('zip') ) );

            } );

            return cityArr;

        },
        _getMinRoom = function( rooms ) {
            var minRoom;

            if( rooms.length ){
                minRoom = rooms[0];
            } else {
                minRoom = 1;
            }

            return minRoom;
        },
        _getMaxRoom = function( rooms ) {
            var maxRoom;

            if( rooms.length === 1 ){
                maxRoom = rooms[ 0 ];
            } else if( rooms.length > 1 ){
                maxRoom = rooms[ rooms.length - 1 ];
            }

            if ( maxRoom === 4 || !rooms.length ) {
                maxRoom = null;
            }

            return maxRoom;
        },
        _getMinMaxRoom = function() {
            var rooms = [],
                curInput;

            _roomsInputs.each(function () {

                curInput = $( this );

                if (curInput.prop( 'checked' ) ) {

                    rooms.push( curInput.data( 'value' ) );

                }

            } );

            return [ _getMinRoom( rooms ), _getMaxRoom( rooms ) ];
        },
        _getPriceRange = function () {

            var minPriceVal = _budgeInputs.filter( '[ name = price-min ]' ).val().replace(/[^-0-9]/gim,''),
                maxPriceVal = _budgeInputs.filter( '[ name = price-max ]' ).val().replace(/[^-0-9]/gim,'');

            if ( minPriceVal == '' ) {

                minPriceVal = 0

            }

            if ( maxPriceVal == '' ) {

                maxPriceVal = 100000000

            }

            return [ minPriceVal, maxPriceVal ];

        },
        _loadData = function(){

            _loadFlag = false;

            var data = _getFilterString( 0 );

            _noResults.removeClass( 'active' );
            _sendRequest( data, false );

        },
        _loadContent = function () {

            if ( ( _rowCount <= ( _itemsPerPage * (_sendDataObj.Page) ) || _rowCount == 0 ) && _loadFlag ) {

                _loadFlag = false;

                // alert('no items');
                console.log('no items')

            } else if ( _loadFlag ) {

                _loadFlag = false;

                _sendDataObj.Page++;
                _sendRequest( JSON.stringify( _sendDataObj ), true );

            }

        },
        _onEvents = function() {

            _filterForm.on( {
                submit: function() {
                    _loadData();
                    return false;
                }
            } );

            _window.on( {
                scroll: function( e ) {
                    e.stopPropagation();

                    if ( _window.scrollTop() + _window.height() >= _catalogWrap.offset().top + _catalogWrap.height() - 10 ) {

                        _loadContent();

                    }
                }
            });

            _typeInputs.on( {
                change: function () {
                    _filterForm.trigger( 'submit' );
                }
            } );

            _budgeInputs.on( {
                keyup: function() {

                    _checkPriceFields( $( this ) );

                }
            });

            _roomsInputs.on( {
                change: function() {
                    _filterForm.trigger( 'submit' );
                }
            });

            _sortSelect.on( {
                change: function () {
                    _filterForm.trigger( 'submit' );
                }
            } );

            _sortSens.on( {
                change: function () {
                    _filterForm.trigger( 'submit' );
                }
            } );

        },
        _sendRequest = function( requestData, newPage ) {

            if( _canSendRequest ){

                _request.abort();
                _catalog.addClass( 'loading' );

                if ( !newPage ) {

                    _catalogWrap.html( '' );

                }

                console.info( requestData );

                _request = $.ajax({
                    url: _filterForm.attr( 'action' ),
                    data: 'EstateServiceGetEstateListRequest=' + requestData,
                    dataType: 'json',
                    timeout: 20000,
                    type: 'GET',
                    success: function ( data ) {

                        setTimeout(function () {

                            _createCatalog( data );

                            console.log( data );

                        },150);


                    },
                    error: function ( XMLHttpRequest ) {
                        if ( XMLHttpRequest.statusText != "abort" ) {
                            console.log( 'err' );
                        }
                    }
                });
            }

        };

    //public properties

    //public methods

    _constructor();
};

var Sliders = function( obj ) {

    //private properties
    var _self = this,
        _obj = obj,
        _gallerySlider = _obj.find( '.list__gallery-swipe' ),
        _galleryItem = _obj.find( '.list__gallery-item' ),
        _galleryPaginator = _obj.find( '.list__gallery-pagination'),
        _gallery;

    //private methods
    var _initSlider = function() {

            _gallery = new Swiper ( _gallerySlider, {
                autoplay: false,
                speed: 500,
                effect: 'slide',
                slidesPerView: 1,
                loop: true,
                autoplayDisableOnInteraction: false,
                pagination: _galleryPaginator,
                paginationClickable: true,
                paginationBulletRender: function (i, className) {
                    var slide = _galleryItem.eq(i),
                        bgImage = slide.data( 'href' );
                    return '<span class="' + className + '" style="background-image: url('+ bgImage +')"></span>';
                }
            } );

        },
        _onEvent = function() {

        },
        _constructor = function() {
            _obj[ 0 ].obj = _self;
            _initSlider();
            _onEvent();
        };

    //public properties

    //public methods
    _self.initSlider = function () {
        _initSlider()
    };

    _constructor();
};

var OpenPopup = function( obj ) {

    //private properties
    var _self = this,
        _obj = obj,
        _label = _obj.find( '.filter__item-label' ),
        _body = $( 'body' );

    //private methods
    var _onEvent = function() {

            _obj.on(
                'click', function ( e ) {
                    e.stopPropagation();
                }
            );

            _body.on(
                'click', function () {
                    _closePopup();
                }
            );

            _label.on(
                'click', function () {

                    if ( _obj.hasClass( 'open' ) ) {
                        _closePopup();
                    } else {
                        _openPopup();
                    }

                }
            );

        },
        _openPopup = function () {
            $( '.filter__item' ).removeClass( 'open' );
            $( '.search-autocomplite' )[0].obj.hidePopup();
            _obj.addClass( 'open' )
        },
        _closePopup = function () {
            $( '.filter__item' ).removeClass( 'open' );
        },
        _constructor = function() {
            _obj[ 0 ].obj = _self;
            _onEvent();
        };

    //public properties

    //public methods
    _self.closePopup = function () {
        _closePopup();
    };

    _constructor();
};
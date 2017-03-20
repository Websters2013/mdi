"use strict";
( function() {

    $( function() {

        $.each( $( '.listing' ), function() {

            new FilterListing ( $( this ) );

        } );

    });

    var FilterListing = function( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _body = $( 'body' ),
            _typeInputs = $( '.category-item' ),
            _closeOpenBtn = _obj.find( '.btn-filter' ),
            _budgetWrapper = _obj.find( '.listing__filter-budget' ),
            _priceList = _obj.find( '.listing__filter-budget-list' ),
            _priceItem = _priceList.find( 'li' ),
            _budgetPriceListMin = _budgetWrapper.find( '.listing__filter-budget-list_min' ),
            _budgetPriceListMax = _budgetWrapper.find( '.listing__filter-budget-list_max' ),
            _priceFields = _budgetWrapper.find( 'input' ),
            _roomsSelect = _obj.find( '.listing__filter-rooms select' ),
            _filterForm = _obj.find( '.listing__filter' ),
            _resultList = _obj.find( '.listing__filter-results' ),
            _catalog = _obj.find( '.listing__catalog' ),
            _catalogList = _obj.find( '.list' ),
            _catalogListWrap = _obj.find( '.listing__catalog-wrap' ),
            _canSendRequest = true,
            _request = new XMLHttpRequest(),
            _sortBtn = $( '.listing__catalog-sort > button' ),
            _window = $( window ),
            _sendDataObj,
            _itemsPerPage = 10,
            _curUrlPart,
            _rowCount,
            _loadFlag,
            _noResults = $( '.listing__catalog-noresults' ),
            _map = _obj.find( '.listing__map' );

        //private methods
        var _constructor = function() {
                _obj[ 0 ].obj = _self;
                _onEvents();
                _getMinMaxRoom();
                _loadData();
                _checkUrl()
            },
            _addLabel = function ( type, text, value ) {

                var resultItems = _resultList.find( ' > span ' ),
                    resultTypeItem = resultItems.filter( '[data-type='+type+']' ),
                    nod = document.createTextNode( String.fromCharCode( 8364 ) ),
                    txt = nod.textContent;

                if ( resultTypeItem.length ) {

                    resultTypeItem.remove();

                }

                if ( text == null ) {

                    _resultList.append( '<span data-type="'+type+'"><i class="fa fa-times" aria-hidden="true"></i>'+value+'</span>' );

                } else if ( type == 'price-min' || type == 'price-max' ) {

                    _resultList.append( '<span data-type="'+type+'"><i class="fa fa-times" aria-hidden="true"></i> '+text +' '+value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') + ' '+txt+'</span>' );

                } else {

                    _resultList.append( '<span data-type="'+type+'"><i class="fa fa-times" aria-hidden="true"></i> '+text +' '+value+'</span>' );

                }

                _catalogList[ 0 ].obj.setHeight();
                _filterForm.trigger( 'submit' );

            },
            _addSwiper = function () {

                $( '.listing__catalog-gallery' ).each( function () {

                    var curSwiper = $( this );

                    new Swiper( curSwiper, {
                        nextButton: curSwiper.find( '.swiper-button-next' ),
                        prevButton: curSwiper.find( '.swiper-button-prev' ),
                        loop: true
                    });

                })

            },
            _checkUrl= function() {

                var url = document.location.href.split( '/' ),
                    urlArr = [];

                for ( var i = 0; i < url.length; i++ ) {

                    urlArr.push( url[ i ] )

                }

                _curUrlPart = urlArr[ urlArr.length-1 ];

            },
            _checkPriceFields = function ( input ) {

                var index = input.index(),
                    minField = _budgetWrapper.find( 'input' ).filter( '[name = price-min]' ),
                    maxField = _budgetWrapper.find( 'input' ).filter( '[name = price-max]' ),
                    minVal = parseInt( minField.val().replace(/[^-0-9]/gim,'') ),
                    maxVal = parseInt( maxField.val().replace(/[^-0-9]/gim,'') );

                _priceList.eq(index).find( 'li' ).removeClass( 'active' );

                if (minVal > maxVal && maxVal > 0) {

                    input.addClass( 'required' )

                } else if ( input.val() == '' ) {

                    _removeResultItem( input.attr( 'name' ) );

                } else {

                    _addLabel( input.attr( 'name' ), input.attr( 'placeholder' ), input.val() );
                    _budgetWrapper.find( 'input' ).removeClass( 'required' )

                }
            },
            _createCatalogItem = function( curItem, rowCount ) {

                var curPrice = String( curItem.Price ),
                    curPriceText = curPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.'),
                    curName = curItem.Name,
                    curCity = curItem.City,
                    curAddress = curItem.Address1,
                    curSubCategory = curItem.SubCategory,
                    curArea = curItem.Area,
                    curBath = curItem.BathRooms,
                    curPictures = curItem.Pictures,
                    curRooms = curItem.Rooms,
                    curCurrency = curItem.Currency,
                    item = $( '<a href="#" class="listing__catalog-item"></a>' ),
                    itemPic = $( '<div class="listing__catalog-item-pics"></div>' ),
                    itemNameWrap = $( '<div class="listing__catalog-item-name"></div>' ),
                    itemName = $( '<div class="listing__catalog-name">'+curName+'</div>' ),
                    itemPrice = $( '<div class="listing__catalog-price">'+curCurrency+' '+curPriceText+'</div>' ),
                    itemWrap = $( '<div class="listing__catalog-item-wrap"></div>' ),
                    itemWrapTop = $( '<div><strong>'+curSubCategory+'</strong><address> - '+curCity+'</address></div>' ),
                    itemWrapList = $( '<ul></ul>' ),
                    swiper = $( '<div class="listing__catalog-gallery swiper-container"></div>' ),
                    swiperWrap = $( '<div class="swiper-wrapper"></div>' ),
                    swiperBtnNext = $( '<div class="swiper-button-next"></div>' ),
                    swiperBtnprev = $( '<div class="swiper-button-prev"></div>' );

                if ( curPictures !== null ) {

                    for( var i = 0; curPictures.length > i; i++ ){

                        var curPicture = curPictures[i].UrlLarge;
                        swiperWrap.append( '<div class="swiper-slide" style="background-image: url('+curPicture+')"></div>' )
                    }

                    swiper.append( swiperBtnNext );
                    swiper.append( swiperBtnprev );

                }

                if ( curRooms !== null && curRooms !== 0 ) {

                    itemWrapList.append( '<li>'+curRooms+' chambres</li>' )

                }

                if ( curBath !== null && curBath !== 0 ) {

                    itemWrapList.append( '<li>'+curBath+' salles de bain</li>' )

                }

                if ( curArea !== null ) {

                    itemWrapList.append( '<li>'+curArea+' m<sup>2</sup></li>' )

                }

                item.append( itemPic );
                item.append( itemWrap );
                itemPic.append( itemNameWrap );
                itemPic.append( swiper );
                swiper.append( swiperWrap );
                itemNameWrap.append( itemName );
                itemNameWrap.append( itemPrice );
                itemWrap.append( itemWrapTop );
                itemWrap.append( itemWrapList );

                setTimeout(function () {
                    swiper.addClass('show');
                }, 50);

                return item;
            },
            _createCatalog = function( data ) {
                var card;

                _rowCount = data.d.QueryInfo.RowCount;

                if ( !data.d.EstateList.length && !$( '.listing__catalog-item' ).length  ) {

                    _map[ 0 ].obj.clearMarkers();

                }

                $.each( data.d.EstateList, function( i ) {
                    console.log(i);

                    card = _createCatalogItem( this, _rowCount);

                    _catalogListWrap.append( card );

                });

                setTimeout(function () {

                    _addSwiper();

                }, 100);

                if (_window.width() >= 1200 ) {
                    _catalogList[0].obj.updateScroll();
                }

                _catalog.removeClass( 'loading' );

                if ( _rowCount == 0 || !$('.listing__catalog-item').length ){

                    _noResults.addClass('active')

                }
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

                var locationLabel = _resultList.find('span').filter( '[data-type=location]' ),
                    cityArr = [];

                locationLabel.each(function () {

                    var curLabel = $( this);

                    cityArr.push( parseFloat( curLabel.data('zip') ) );

                } );

                return cityArr;

            },
            _getFilterString = function( page ) {

                var rooms = _getMinMaxRoom(),
                    data = null;

                data = {
                    ClientId: "ff5cc96207e54f528fc1",
                    PurposeIDList:[ 2 ],
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
                    OrderByFields: _getOrder()
                };

                _sendDataObj = data;

                return JSON.stringify( data );

            }, //////////////////////////
            _getMinRoom = function( rooms ) {
                var minRoom;

                if( rooms.length ){
                    minRoom = rooms[ 0 ];
                } else {
                    minRoom = 1;
                }

                return minRoom;
            },//////////////////////////
            _getMaxRoom = function( rooms ) {
                var maxRoom;

                if( rooms.length === 1 ){
                    maxRoom = rooms[ 0 ];
                } else if( rooms.length > 1 ){
                    maxRoom = rooms[ rooms.length - 1 ];
                }

                if ( maxRoom === 3 || !rooms.length ) {
                    maxRoom = null;
                }

                return maxRoom;
            },//////////////////////////
            _getMinMaxRoom = function( curSelect ) {
                var rooms = [];

                if (curSelect !== undefined) {

                    var selectedOption = curSelect.find( 'option' ).filter( ':selected' );

                    _addLabel( curSelect.attr( 'name' ), null, selectedOption.text() );

                }

                _roomsSelect.each(function () {

                    var curSelect = $( this ),
                        selectedOption = curSelect.find( 'option' ).filter( ':selected' );

                    rooms.push( selectedOption.attr( 'value' ) );

                } );

                return [ _getMinRoom( rooms ), _getMaxRoom( rooms ) ];
            },//////////////////////////
            _getPriceRange = function () {

                var minPriceVal = _priceFields.filter( '[ name = price-min ]' ).val().replace(/[^-0-9]/gim,''),
                    maxPriceVal = _priceFields.filter( '[ name = price-max ]' ).val().replace(/[^-0-9]/gim,'');

                if ( minPriceVal == '' ) {

                    minPriceVal = 0

                }

                if ( maxPriceVal == '' ) {

                    maxPriceVal = 100000000

                }

                return [ minPriceVal, maxPriceVal ];

            },
            _onEvents = function() {

                _catalogList.on( {
                    'ps-y-reach-end': function() {

                        if ( $('.listing__catalog-item').length && _window.width() >= 1200 ) {

                            _loadContent();

                        }
                    }
                }); //lazy-load
                _window.on( {
                    scroll: function() {

                        if ( _window.width() < 1200 && _window.scrollTop() + _window.height() >= $( document).height() ) {

                            _loadContent();

                        }
                    }
                }); //lazy-load for mobile
                _sortBtn.on( {
                    click: function() {

                        var curBtn = $( this );

                        curBtn.prev().removeClass();
                        curBtn.next().removeClass();

                        if ( curBtn.hasClass( 'active' ) &&  curBtn.hasClass( 'active_desc' ) ) {

                            curBtn.removeClass();

                        } else if ( !curBtn.hasClass( 'active' ) && !curBtn.hasClass( 'active_asc' ) ) {

                            curBtn.addClass( 'active active_asc' )

                        } else if ( curBtn.hasClass( 'active' ) && !curBtn.hasClass( 'active_desc' ) ) {

                            curBtn.removeClass( 'active_asc' );
                            curBtn.addClass( 'active_desc' )

                        }

                        _filterForm.trigger( 'submit' );

                    }
                });
                _typeInputs.on( {
                    change: function() {

                        var curInput = $( this ),
                            curData = curInput.data( 'category' ),
                            curText = curInput.next().text();

                        if ( curInput.is( ':checked' ) ) {

                            _addLabel( curData, null, curText );

                        } else {

                            _removeResultItem( curData )

                        }


                    }
                });
                _priceFields.on( {
                    focus: function() {

                        _setPriceList( $( this ) )

                    },
                    keyup: function() {

                        _checkPriceFields( $( this ) );

                    }
                });
                _priceItem.on( {
                    click: function() {

                        var curItem = $( this );

                        if ( curItem.hasClass( 'disabled' ) || curItem.hasClass( 'active' ) ) {

                            return false

                        } else {

                            _setPrice( curItem )

                        }

                    }
                });
                _closeOpenBtn.on( {
                    click: function( e ) {

                        var curElem = $(this);

                        if (_filterForm.hasClass( 'active' )) {

                            _filterForm.removeClass( 'active' );
                            curElem.removeClass( 'active' );

                        } else {

                            _filterForm.addClass( 'active' );
                            curElem.addClass( 'active' );

                        }

                        e.stopPropagation();

                    }
                });
                _body.on( {
                    click: function() {

                        if ( _filterForm.hasClass( 'active' ) ) {

                            _filterForm.removeClass( 'active' )
                        }

                        if ( _priceFields.hasClass( 'active' ) ) {

                            _priceFields.removeClass('active');
                        }

                        if ( _closeOpenBtn.hasClass( 'active' ) ) {

                            _closeOpenBtn.removeClass( 'active' );
                        }

                    }
                });
                _resultList.on( 'click',' > span',  function() {

                    _removeLabel( $( this ) )

                } );
                _roomsSelect.on( {
                    change: function() {

                        _getMinMaxRoom( $( this ) );

                    }
                });
                _filterForm.on( {
                    submit: function() {

                        return false

                    },
                    click: function(e) {

                        e.stopPropagation();

                    }
                } );

            },
            _setPrice = function ( item ) {

                var curItem = item,
                    curParent = curItem.parents( '.listing__filter-budget-list' ),
                    curText = curItem.text().replace(/[^-0-9]/gim,'');

                curItem.prevAll().removeClass( 'active' );
                curItem.nextAll().removeClass( 'active' );
                curItem.addClass( 'active' );

                if ( curParent.hasClass( 'listing__filter-budget-list_min' ) ) {

                    _priceFields.filter( '[name = price-min]' ).val( curText.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') );

                    _budgetPriceListMax.find( 'li' ).each( function() {

                        var curElem = $( this );

                        if ( curElem.text().replace(/[^-0-9]/gim,'') < curText ) {

                            curElem.addClass( 'disabled' )

                        } else {

                            curElem.removeClass( 'disabled' )
                        }

                    });

                    _addLabel( 'price-min', 'Min', curText);

                } else if ( curParent.hasClass('listing__filter-budget-list_max') ) {

                    _priceFields.filter('[name = price-max]').val( curText.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.') );

                    _budgetPriceListMin.find('li').each( function() {

                        var curElem = $( this );

                        if ( curElem.text().replace(/[^-0-9]/gim,'') > curText ) {

                            curElem.addClass('disabled')

                        } else {

                            curElem.removeClass('disabled')
                        }

                    });

                    _addLabel( 'price-max', 'Max', curText);
                }

            },
            _setPriceList = function ( elem ) {

                var curField = elem,
                    curName = curField.attr( 'name' );

                _priceFields.removeClass( 'active' );
                curField.addClass( 'active' );

                if ( curName == 'price-min' ) {

                    _budgetPriceListMax.hide();
                    _budgetPriceListMin.show();

                } else if ( curName == 'price-max' ) {

                    _budgetPriceListMin.hide();
                    _budgetPriceListMax.show()

                }

            },
            _getOrder = function() {

                var sortArr = [];

                _sortBtn.each( function () {

                    var curBtn = $( this ),
                        curData = curBtn.data( 'sort' ),
                        sortVal;

                    if ( curBtn.hasClass( 'active_desc' ) ) {

                        sortVal = 'DESC';

                        sortArr.push( curData + " " + sortVal )

                    } else if ( curBtn.hasClass( 'active_asc' ) ) {

                        sortVal = 'ASC';

                        sortArr.push( curData + " " + sortVal )

                    }

                });

                return sortArr;

            },
            _sendRequest = function( requestData, newPage ) {

                if( _canSendRequest ){

                    _request.abort();
                    _catalog.addClass( 'loading' );

                    if ( !newPage ) {

                        _catalogListWrap.html( '' );

                    }

                    console.info(requestData);

                    _request = $.ajax({
                        url: _filterForm.attr( 'action' ),
                        data: 'EstateServiceGetEstateListRequest=' + requestData,
                        dataType: 'json',
                        timeout: 20000,
                        type: 'GET',
                        success: function ( data ) {

                            console.log(data);

                            setTimeout(function () {

                                _createCatalog( data );

                            },150);


                        },
                        error: function ( XMLHttpRequest ) {
                            if ( XMLHttpRequest.statusText != "abort" ) {
                                console.log( 'err' );
                            }
                        }
                    });
                }

            },
            _loadData = function(){

                var data = _getFilterString( 0 );

                _noResults.removeClass('active');
                _sendRequest( data, false );
                _loadFlag = true;

            },//////////////////////////
            _loadContent = function () {

                if ( _rowCount <= ( _itemsPerPage * (_sendDataObj.Page) ) || _rowCount == 0 ) {

                    // alert('no items');
                    // console.log('no items')

                }else{

                    _sendDataObj.Page++;
                    _sendRequest( JSON.stringify( _sendDataObj ), true );

                }

                _loadFlag = false;

            },
            _uncheckRooms = function ( type, flag ) {

                var curSelect = _roomsSelect.filter( '[name = '+type+']' ),
                    curOptions = curSelect.find( 'option' ),
                    curParent = curSelect.parents( '.websters-select' ),
                    curPopupItems = curParent.find( 'websters-select__popup li' ),
                    curTextWrap = curParent.find( '.websters-select__item' );

                curOptions.removeAttr( 'selected' );
                curPopupItems.removeClass( 'active' );
                curTextWrap.text( '' );

                if ( flag ) {

                    curOptions.eq(0).attr( 'selected', 'selected' );
                    curPopupItems.eq(0).addClass( 'active' );
                    curTextWrap.text( curOptions.eq( 0 ).text() );

                } else {

                    curOptions.eq( curOptions.length - 1 ).attr( 'selected', 'selected' );
                    curPopupItems.eq( curOptions.length - 1 ).addClass( 'active' );
                    curTextWrap.text( curOptions.eq( curOptions.length - 1 ).text() );

                }

            },
            _removeLabel = function ( curItem ) {

                var curType = curItem.data('type');

                if ( curType == 'price-min' ) {

                    _budgetPriceListMin.find( 'li' ).removeClass( 'active' );
                    _budgetPriceListMax.find( 'li' ).removeClass( 'disabled' );
                    _priceFields.filter( '[name = price-min]').val( '' );

                } else if ( curType == 'price-max' ) {

                    _budgetPriceListMax.find( 'li' ).removeClass( 'active' );
                    _budgetPriceListMin.find( 'li' ).removeClass( 'disabled' );
                    _priceFields.filter( '[name = price-max]').val( '' );

                } else if ( curType == 'min-rooms' ) {

                    _uncheckRooms( curType, true );

                } else if ( curType == 'max-rooms' ) {

                    _uncheckRooms( curType, false );

                } else if ( curType !== 'location' ) {

                    _typeInputs.filter( '[data-category = '+curType+']' )[ 0 ].checked = false

                }

                curItem.remove();
                _catalogList[ 0 ].obj.setHeight();
                _filterForm.trigger( 'submit' );

                _map[ 0 ].obj.clearMarkers();

            },
            _removeResultItem = function ( curData ) {

                var resultItems = $( '.listing__filter-results > span' );

                resultItems.filter( '[data-type = '+curData+']' ).remove();

                _filterForm.trigger( 'submit' );

            };

        _constructor();
    };

} )();

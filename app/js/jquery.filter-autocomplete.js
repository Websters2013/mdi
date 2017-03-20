( function(){
    'use strict';

    $( function () {

        $( '.search-autocomplite' ).each( function () {
            new FilterAutocomplete( $( this ) );
        } );

    } );

    var FilterAutocomplete = function( obj ){

        //private properties
        var _self = this,
            _obj = obj,
            _input = _obj.find( 'input' ),
            _window = $( window ),
            _body = $( 'body' ),
            _autocompliteList = $('.search-autocomplite__list'),
            _autocompliteItem = _autocompliteList.find( 'li' ),
            _resultList = $( '.search-autocomplite__results' ),
            _listItems,
            _data;

        //private methods
        var _constructor = function(){
                _obj[ 0 ].obj = _self;
                _setList();
            },
            _setList = function () {

                $.getJSON('php/cities.geo.json', function( kml ) {

                    _data = kml;

                    var dataList = _autocompliteList.find( 'ul' );

                    for ( var i = 0; i < _data.length; i++ ) {

                        var curData = _data[i],
                            name = curData.Name_Fr,
                            zipCodes = curData.zipCode;

                        if ( zipCodes !== 'undefined' ) {

                            dataList.append('<li><span>'+zipCodes+'</span>'+name+'</li>')

                        } else {

                            dataList.append('<li><span></span>'+name+'</li>')

                        }
                    }

                    setTimeout(function () {
                        _listItems = _autocompliteList.find( 'li' );
                        _autocompliteList.perfectScrollbar();
                        _onEvents();
                    }, 100);

                });

            },
            _filterItems = function() {
                var currentListItem;

                _listItems.removeClass( 'filtered' );

                _listItems.each( function() {

                    currentListItem = $( this );

                    if( currentListItem.text().toLowerCase().indexOf( _input.val().toLowerCase() ) == -1 ){
                        currentListItem.addClass( 'filtered' )
                    }

                } );

                _autocompliteList.perfectScrollbar('update');
            },
            _hideList = function () {
                var label = _resultList.find('span').filter( '[data-type=location]' );

                if ( _input.val() == '' ) {
                    _unselectItem();
                }

                _hidePopup();

            },
            _hidePopup = function () {

                _obj.removeClass('active');
                _listItems.removeClass( 'hover' );
                _autocompliteList.addClass( 'search-autocomplite__list_hidden' );

                _input.trigger( 'blur' );

                setTimeout(function () {
                    _autocompliteList.hide();
                }, 300)

            },
            _hover = function( item ){

                _listItems.removeClass( 'hover' );

                item.addClass( 'hover' );

                if( item.position().top >= _autocompliteList.height() ){
                    _autocompliteList.scrollTop(  item.position().top + _autocompliteList.scrollTop() - ( item.outerHeight() * 3 ) );
                } else if ( item.position().top < 0 ){
                    _autocompliteList.scrollTop(  item.position().top + _autocompliteList.scrollTop() );
                }

            },
            _hoverNext = function() {
                var items,
                    currentItem,
                    index;

                items = _listItems.filter( ':not(.hidden)' );
                items = items.filter( ':not(.filtered)' );
                currentItem = items.filter( '.hover' );
                index = items.index( currentItem );
                index = (index < 0)?0:index;


                if( currentItem.length ){

                    if( index + 1 === items.length ){
                        _hover( items.eq( 0 ) );
                    } else {
                        _hover( items.eq( index + 1 ) );
                    }

                } else {
                    _hover( items.eq( 0 ) );
                }

            },
            _hoverPrev = function() {
                var items,
                    currentItem,
                    index;

                items = _listItems.filter( ':not(.hidden)' );
                items = items.filter( ':not(.filtered)' );
                currentItem = items.filter( '.hover' );
                index = items.index( currentItem );

                if( currentItem.length ){
                    _hover( items.eq( index - 1 ) );

                } else {
                    _hover( items.eq( -1 ) );
                }
            },
            _onEvents = function(){

                _body.on( {
                    click: function() {

                        if ( _obj.hasClass( 'active' ) ){
                            _hideList();
                        }

                    }
                } );

                _obj.on( {
                    click: function(e) {
                        e.stopPropagation();
                        $( '.filter__item' )[0].obj.closePopup();
                    }
                } );

                _listItems.on(  {
                    click: function(e) {
                        _selectItem();
                    },
                    mouseenter: function() {
                        _hover( $( this ) );
                    }
                } );

                _input.on( {
                    focus: function() {
                        _showList();
                    },
                    keyup: function(e) {
                        _showList();

                        if( e.keyCode == 27 ){
                            _hideList(); //esc
                        } else if( e.keyCode == 40 ){
                            _hoverNext(); //down arrow
                        } else if( e.keyCode == 38 ){
                            _hoverPrev(); //up arrow
                        } else if ( e.keyCode == 13 ) {
                            _selectItem();
                            $( this ).trigger( 'blur' );
                        } else {
                            _filterItems();
                        }
                    }
                } );

                _resultList.on( 'click','> span[data-type = location]',  function() {

                    _unselectItem( [ $( this ).text() ] );

                } );

                _window.on( {
                    scroll: function() {
                        _hidePopup();
                    }
                } );

            },
            _selectItem = function() {

                var _hoveredItem = _listItems.filter( '.hover' ),
                    curIndex = _hoveredItem.index(),
                    label = _resultList.find('span').filter( '[data-type=location]' );

                if ( _hoveredItem.length == 0 ) {
                    _hideList();
                    return false;
                }

                _hoveredItem.addClass( 'hidden' );

                // _unselectItem( [ label.text() ] );

                _resultList.append( '<span data-zip="'+_hoveredItem.find('span').text()+'" data-type="location">'+ _elemText( _hoveredItem ) +'</span>' );

                if ( label.length < 1 ) {
                    _input.val ( _elemText( _hoveredItem ) )
                } else {
                    _input.val('');

                    _resultList.find( 'span' ).each( function () {

                        if ( _input.val() == '' ){
                            _input.val ( $( this ).text() );
                        } else {
                            var temp = _input.val();

                            _input.val ( temp +', '+ $( this ).text() )
                        }
                    } )

                }

                _hideList();

                $('.filter__form').trigger('submit');

            },
            _unselectItem = function( texts ) {

                var curItem;

                if ( texts == null ) {
                    _resultList.find('span').remove();
                    _autocompliteList.find( 'li' ).removeClass( 'hidden' );
                    $('.filter__form').trigger('submit');
                }

                _resultList.find( '> span[data-type = location]' ).each( function() {

                    curItem = $( this );

                    $.each( texts, function() {

                        if( curItem.text() == this ){
                            curItem.remove();
                        }

                    } );

                } );

                _listItems.each( function() {

                    curItem = $( this );

                    $.each( texts, function () {

                        if( _elemText( curItem ) == this ){

                            curItem.removeClass( 'hidden' );

                        }

                    } );
                } );

            },
            _elemText = function (elem) {

                var cloned = elem.clone();

                cloned.find('*').remove();

                return ( cloned.text().trim() )

            },
            _showList = function(){
                _autocompliteList.find( 'li' ).removeClass( 'filtered' );
                _obj.addClass('active');
                _autocompliteList.show();
                _autocompliteList.removeClass( 'search-autocomplite__list_hidden' );
            };

        //public properties

        //public methods
        _self.hidePopup = function(  ) {

            _obj.removeClass( 'active' );
            _listItems.removeClass( 'hover' );
            _autocompliteList.addClass( 'search-autocomplite__list_hidden' );

        };

        _constructor();
    };

} )();
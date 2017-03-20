( function () {
    $( function () {
        new Number();
    } );

    var Number = function () {

        //private properties
        var _body = $( 'body' );

        //private methods
        var _constructor = function () {
                _onEvents();
            },
            _onEvents = function () {
                _body.on( 'keypress', '.number', function (event) {
                    if ( ( event.which != 46 || $( this ).val().indexOf( '.' ) != -1 ) && ( event.which < 48 || event.which > 57 ) ) {
                        event.preventDefault();
                    }
                } );
                _body.on( 'paste', '.number', function (event) {
                    var input = $( this ),
                        inputVal = null;

                    setTimeout( function () {
                        inputVal = input.val();

                        if( inputVal ){
                            inputVal = inputVal.split( ',' ).join( '.' );
                        }

                        inputVal = parseFloat( inputVal );

                        if ( !isNaN( inputVal ) ){
                            input.val( parseFloat( inputVal ) );
                        } else {
                            input.val( '' );
                        }

                    } );
                } );
            };

        //public properties

        //public methods

        _constructor();
    };

} )();
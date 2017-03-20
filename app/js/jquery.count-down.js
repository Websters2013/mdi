( function(){

    $( function(){
        $( 'count-down' ).each( function(){
            new CountDown( $( this ) );
        } );
    } );

    var CountDown = function ( obj, callback ) {

        var _self = this,
            _obj = obj,
            _callback = callback || function(){},
            _millisecondsInSecond = 1000,
            _millisecondsInMinute = _millisecondsInSecond * 60,
            _millisecondsInHour = _millisecondsInMinute * 60,
            _millisecondsInDay = _millisecondsInHour * 24,
            _secondWrap = _obj.find( '.countdown__seconds' ),
            _minutesWrap = _obj.find( '.countdown__minutes' ),
            _hoursWrap = _obj.find( '.countdown__hours' ),
            _dayWrap = _obj.find( '.countdown__days' ),
            _stopped = false,
            _finishDate = new Date( _obj.data( 'finish' ) );

        var _checkDate = function(){
                var difference = ( _finishDate - new Date() ),
                    days,
                    hours,
                    minutes,
                    seconds;

                if( difference > 0 ){
                    days = Math.floor( difference / _millisecondsInDay );
                    hours =  Math.floor( ( difference - ( days * _millisecondsInDay ) ) / _millisecondsInHour );
                    minutes = Math.floor( ( difference - ( ( days * _millisecondsInDay ) + ( hours * _millisecondsInHour ) ) ) / _millisecondsInMinute );
                    seconds = Math.floor( ( difference - ( ( days * _millisecondsInDay ) + ( hours * _millisecondsInHour ) + ( minutes * _millisecondsInMinute ) ) ) / _millisecondsInSecond );

                    _setCalculation( days, hours, minutes, seconds );
                } else {
                    days = 0;
                    hours =  0;
                    minutes = 0;
                    seconds = 0;

                    _setCalculation( days, hours, minutes, seconds );

                    _stopped = true;

                    _callback();
                }
            },
            _init = function () {
                _obj[ 0 ].obj = _self;
                _loop();
            },
            _loop = function(){
                _checkDate();

                if( !_stopped ) {
                    requestAnimationFrame( _loop );
                }
            },
            _setCalculation = function( days, hours, minutes, seconds ){

                _secondWrap.text( seconds );
                _minutesWrap.text( minutes );
                _hoursWrap.text( hours );
                _dayWrap.text( days );

            };

        _init();

    };

} )();

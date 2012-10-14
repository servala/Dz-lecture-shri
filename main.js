$( document ).ready( function(){
    drawCalendar( cur_month, cur_year );
});
function toLS( data ){
    localStorage.calendar = JSON.stringify( data );
    search.reset();
}
function fromLS(){
    if ( !localStorage.calendar ){
        toLS( calendar );
    }
    return JSON.parse( localStorage.calendar );
}

    var data = fromLS();
    var lectures = data.years[2012].months[8].days;
    var flag = true;

    var week_days = {
        1: [ 'пн','понедельник' ],
        2: [ 'вт','вторник' ],
        3: [ 'ср','среда' ],
        4: [ 'чт','четверг' ],
        5: [ 'пт','пятница' ],
        6: [ 'сб','суббота' ],
        7: [ 'вс', 'воскресенье']
    },
    months = {
        0:  [ 'Январь','января' ],
        1:  [ 'Февраль','февраля' ],
        2:  [ 'Март','марта' ],
        3:  [ 'Апрель','апреля' ],
        4:  [ 'Май', 'мая' ],
        5:  [ 'Июнь','июня' ],
        6:  [ 'Июль','июля' ],
        7:  [ 'Август','августа' ],
        8:  [ 'Сентябрь','сентября' ],
        9:  [ 'Октябрь','октября' ],
        10: [ 'Ноябрь','ноября' ],
        11: [ 'Декабрь','декабря' ]
    },
    date_worker = {
        now: new Date(),
        get_first_day: function(m, y) {
            return new Date( y, m, 1 );
        },
        get_last_day: function(m, y) {
            var d = this.get_first_day( m + 1, y );
            d.setDate( 0 );
            return d;
        },
        get_week_day: function(date) {
            var day = date.getDay();
            return day === 0 ? 7 : day;
        },
        get_now_day: function(){
            return new Date(this.now);
        },
        is_current_month: function(m, y){
            return m === this.now.getMonth() && y === this.now.getFullYear();
        }
    },
    backup = '';

    var cur_date = date_worker.get_now_day();
    var cur_year = cur_date.getFullYear();
    var cur_month = cur_date.getMonth();

    function setMark( el, color ) {
        $( '<div></div>' ).addClass( 'mark' ).addClass( color ).appendTo( el );
        $( el ).css( 'cursor', 'pointer' );
    }

    function drawCalendar( m, y ) {
        var cur_start = date_worker.get_first_day( m, y );
        cur_month = cur_start.getMonth();
        cur_year = cur_start.getFullYear();
        var cur_end = date_worker.get_last_day( cur_month, cur_year );
        var cur_start_wday = date_worker.get_week_day( cur_start );
        var cur_end_wday = date_worker.get_week_day( cur_end );

        var is_show_date = date_worker.is_current_month( cur_month, cur_year );
        var show_date = cur_date.getDate();

        var cal = $( '.calendar' ).html('');
        var mon = $( '<div></div>' ).addClass( 'month' ).appendTo( cal );

        $( '<a></a>' ).attr('id', 'mon_p' ).text('▶').appendTo( mon );
        $( '<a></a>' ).attr('id', 'mon_n' ).text('◀').appendTo( mon );
        $( '<span></span>' ).addClass( 'letter' ).text( months[ cur_month ][ 0 ].charAt(0)).appendTo( mon );
        $( '<span></span>' ).text( months[ cur_month ][ 0 ].substr( 1 ) + ' ' + cur_year ).appendTo( mon );
        // account free space
        for ( var i = 1 ; i < 8 ; i++ ){
            var div = $('<div></div>').addClass('week-day').text( week_days[ i ][ 0 ]);
            if ( i === 7 ){
                div.addClass( 'sunday' );
            }
            if( i > 5 ){
                div.addClass( 'red' );
            }
            mon.append( div );
        }
        for ( var i = 1 ; i < cur_start_wday ; i++ ){
            var div = $( '<div></div>' ).addClass( 'empty' );
            cal.append( div );
        }
        // account free space
        for( var i = 1, l = cur_end.getDate() ; i <= l ; i++ ){

            var mod7 = ( i - 1 + cur_start_wday ) % 7;
            var div = $( '<div></div>' ).attr( 'id', 'd_' + i + '_' + cur_month + '_' + cur_year ).text( i );
            if ( mod7 === 1 && ( i + 7 >= l )){
                div.addClass( 'angle' );
            } else if( mod7 === 0 ){
                div.addClass( 'sunday' );
                if ( i === l ){
                    div.addClass( 'last' );
                }
            }

            if( is_show_date && i === show_date ){
                div.addClass( 'current' );
                if( flag ){
                    var sd = search.findGreaterNow();
                    if( !!sd ){
                        var d = search.unpack( sd );
                        if( !!d.d ){
                            drawContent([ new Date(d.y, d.m, d.d), data.years[ d.y ].months[ d.m ].days[ d.d ].lectures ]);
                        }
                    } else {
                        drawContent( null )
                    }
                    flag =false;
                }
            }

            if( data.years && data.years[ y ] && data.years[ y ].months && data.years[ y ].months[ m ] && data.years[ y ].months[ m ].days[ i ]){
                var day = data.years[ y ].months[ m ].days[ i ];
                div.addClass( 'i-draw-content' );
                $( div ).data( 'dateLecture', [ new Date(y , m , i), day.lectures ]);
                setMark( $( div ).get(0), day.decoration );
            }
            cal.append( div );
        }

        for( var i = cur_end_wday + 1 ; i < 8; i++ ){
            var div = $( '<div></div>' ).addClass( 'empty' );
            if ( i === 7 ){
                div.addClass( 'last' ).addClass( 'sunday' );
            }
            cal.append( div );
        }
        $( '.b-list-lecture').html( ' ' );

        if( data.years && data.years[ y ] && data.years[ y ].months && data.years[ y ].months[ m ]){
            drawLectureList ( y, m )
        }else{
            $( '.b-list-lecture').html( ' Нет лекций ' );
        }
    }

    // right-list
    function drawLectureList ( y, m ){
        $( '#print' ).show();
        $( '.b-search-content' ).html( '' )
        var blist = $( '.b-list-lecture')

        $.each( data.years[y].months[ m ].days, function( i ){
            var week_day = (new Date( y, m, i )).getDay() === 0 ? 7 : (new Date( y, m, i )).getDay();
            var title_text = i + ' ' + months[ m ][ 1 ] + ', ' + week_days[ week_day ][ 1 ];
            $( '<div></div>' )
                .addClass( 'b-list-lecture-title i-draw-content' )
                .text( title_text )
                .data( 'dateLecture', [ new Date( y , m , i ), data.years[y].months[ m ].days[i].lectures ])
                .appendTo( blist );
            var list = $( '<div></div>' ).addClass( 'b-list-lecture-list' ).appendTo( blist );
            $.each( this.lectures, function() {
                var in_list = $( '<p></p>' ).appendTo( list );
                if( !!this.history ){
                    in_list.addClass( this.history );
                }
                var title_text
                switch( this.history  )
                {
                    case 'red':
                        title_text = 'перенесено';
                        break;
                    case 'cancel':
                        title_text = 'отменено';
                        break;
                    default:
                        title_text = '';
                }
                $( '<span></span>').addClass( 'content' ).attr( 'title', title_text ).append( $( '<span></span>').text( this.caption ).addClass( !!this.description ? 'link' : '')).appendTo( in_list );
                $( '<span></span>' ).addClass( 'time' ).attr( 'title', title_text ).text( this.time ).appendTo( in_list );
            });
        });
    }

    function drawContent( dateLecture ){
        backup = dateLecture;
        if( !dateLecture ){
            $( '.b-day' ).html( 'Больше нет лекций' );
        }else{
            $( '.b-print' ).show();
            $( '.b-redactor-cancel' ).hide();
            $( '.b-search-content' ).html( '' );
            var date = dateLecture[ 0 ];
            var bdiv = $( '.b-day' ).html( '' )
            $( '.b-page-head' ).css( 'display' ,'none');

            var week_day = date.getDay();
            if( !week_day ) week_day =7;
            $( '<div></div>' ).addClass( 'b-day-title' )
                .append( $( '<span></span>' ).text( date.getDate() + ' ' + months[ date.getMonth()][ 1 ] + ' ' + date.getFullYear()))
                .append( week_days[ week_day ][ 1 ])
                .appendTo( bdiv );

            //lectures  we use for checked 'current'
            var list_lectures = $( '.e-day-list' ).html( '' );
            var list_lector = $( '.e-lector-list' ).html( '' );

            var id = ['l', date.getDate(), date.getMonth(), date.getFullYear()].join('_');
            $.each( dateLecture[ 1 ], function(){
                var p = $( '<p></p>' ).text( this.time ).addClass( this.history === 'cancel' ?'cancel':'').appendTo( list_lectures );
                $( '<span></span>' ).addClass( !!this.description ? 'link i-draw-list-block' : 'i-draw-list-block' ).text( this.caption ).data( 'lecture', this ).attr( 'id', id ).appendTo( p );
                var span = $( '<span></span>' ).addClass( !!this.author.link ? 'link' : '' ).text( this.author.name ).data( 'link' , this.author.link);
                $( '<p></p>' ).append( span ).appendTo( list_lector );
            });
            $( '.b-page-head' ).fadeIn(1000);
            $( '.b-lecture' ).html( '' );
        }
    }

    function drawLectureBody( data ){
        var blog_lecture = $( '.b-lecture' ).html( '' ).css( 'display', 'none');

        $( '<div></div>' ).addClass( 'b-lecture-title' ).addClass( data.history === 'cancel' ?'cancel':'').text( data.caption ).appendTo( blog_lecture );
        $( '<div></div>' ).addClass( 'b-lecture-autor' ).text( data.author.name ).appendTo( blog_lecture );
        $( '<div></div>' ).addClass( 'b-lecture-content' ).html( (!!data.description)?data.description:'' ).appendTo( blog_lecture );
        if( !!data.presentation ){
            $( '<div></div>' ).addClass( 'b-lecture-link' ).html('<a href="' + data.presentation + '" target="_blank">Презентация</a>').appendTo( blog_lecture )
        }
        if( !!data.video[ 0 ] ){
            $( '<div></div>' ).addClass( 'b-lecture-link' ).html('<a href="' + data.video[ 0 ] + '" target="_blank">Видео</a>').appendTo( blog_lecture )
        }
        if( !!data.video[ 1 ] ){
            $( '<div></div>' ).addClass( 'b-lecture-link' ).html('<a href="' + data.video[ 1 ] + '" target="_blank">Скачать видео</a>').appendTo( blog_lecture )
        }
        blog_lecture.fadeIn(1000);
    }

    //travel in calendar
    $( '#mon_p' ).live( 'click', function(){
        drawCalendar( cur_month + 1, cur_year );
    });
    $( '#mon_n' ).live( 'click', function(){
        drawCalendar( cur_month - 1, cur_year );
    });

    //события
    $('.b-page_main_tb_r').on('click', '.i-draw-content', function(){
            drawContent( $(this).data( 'dateLecture' ));
    });
    $('.b-page_main_tb_l').on('click', '.i-draw-list-block', function(){
        var d = $(this).data( 'lecture' )
        //if( d.history !== 'cancel' ){
            drawLectureBody( $(this).data( 'lecture' ));
        //}
    });
    $('.b-list-lecture').on('click', 'p', function(){
        $(this).parent().prev('.i-draw-content').click();
        $('.b-page_main_tb_l .i-draw-list-block').eq( $(this).parent().find('p').index(this)).click();
    });
    $('.e-lector-list').on('click', '.link', function(){
        window.open( $(this).data('link' ));
    });

//});

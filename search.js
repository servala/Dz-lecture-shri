     var search = {
        collection: [],
        get: function(){
            if( !this.collection.length ){
                var c = this.collection;
                $.each( data.years, function(y){
                    $.each( this.months, function(m){
                        $.each( this.days, function(d){
                            $.each( this.lectures, function(i){
                                if( this.history !== 'cancel' ){
                                    if(( d + '' ).length === 1 ) d = '0' + d;
                                    if(( m + '' ).length === 1 ) m = '0' + m;
                                    c.push([[ y, m, d , i].join( '-' ), this.time, this.caption, this.author.name, this.description].join( ' ' ));
                                }
                            });
                        });
                    });
                });
            }
            return this.collection.sort( function( a, b ){
                return a < b ? 1 : -1;
            });
        },
        reset: function(){
            this.collection.length = 0;
        },
        unpack: function( s ){
            var a = s.split(' '), b = a[ 0 ].split( '-' );
            var s = s.substr( 19 );
            return {
                d: parseInt( b[ 2 ], 10 ),
                m: parseInt( b[ 1 ], 10 ),
                y: b[ 0 ],
                time: a[ 1 ],
                words: s
            }
        },
        findGreaterNow: function() {
            var d = new Date();
            var day = d.getDate();
            var m = d.getMonth();
            if(( day + '' ).length === 1 ) day = '0' + day;
            if(( m + '' ).length === 1 ) m = '0' + m;
            var sd = [ d.getFullYear(), m, day ].join('-');
            var c = this.get();
            for( var i = 0, l = c.length - 1; i < l; i++ ){
                if(c[ i ] < sd) break;
            }
            return c[ i - 1 ] || '';
        },
        findWord: function( word ){
            word = word.toLowerCase();
            var c = this.get(), a = [];
            for( var i = 0, l = c.length; i < l; i++ ){
                if( c[ i ].toLowerCase().indexOf( word ) !== -1 ){
                    a.push( this.unpack( c[ i ]));
                }
            }
            return a;
        }
    }
    $('.b-search-form').submit(function() {
        var search_results = search.findWord( $(this).find( 'input[name=text]' ).val() );
        $( '.b-search-content' ).html( '' ).css( 'display', 'block');
        if( !search_results.length ){
            var div = $( '<div></div>' ).addClass( 'b-search-content-title' ).html( 'Нет результатов =(' )
            $( '.b-search-content' ).append( div ).fadeOut(2000);
        } else {
            try{
            drawSearchList( search_results );
            } catch(e){}
        }
        return false;
    })
    function drawSearchList( search_results ){
        var bsc = $( '.b-search-content' ).html( '' );
        $( '<div></div>' ).addClass( 'b-search-content-title' ).text( search_results.length + ' - вот сколько совпадений! ')
            .appendTo( bsc );
        $( '.e-day-list,.e-lector-list,.b-day,.b-lecture' ).html( '' );
        $.each( search_results, function(){
            var i, l, lectures = data.years[ this.y ].months[ this.m ].days[ this.d ].lectures;
            for( i = 0, l = lectures.length; i < l; i++ ){
                if( lectures[ i ].time === this.time && this.words.indexOf( lectures[ i ].caption ) !== -1) {
                    break;
                }
            }
            var span = $( '<span></span>').addClass('link').html( lectures[ i ].caption ).data( 'dateLecture', { 
                'parent_obj': [ new Date(this.y, this.m, this.d), lectures],
                'number': i 
            });
            $('<div></div>').addClass( 'b-search-list-final' ).append( span ).appendTo( bsc )
        });
    }
    $('.b-search-content').on('click', '.link', function(){
        var dataLecture  = $.data( $(this).get(0), 'dateLecture' );
        drawContent( dataLecture.parent_obj);
        $('.b-page_main_tb_l .i-draw-list-block').eq( dataLecture.number ).click();
    });
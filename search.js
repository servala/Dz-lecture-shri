    var search_results = []

    $('.b-search-form').submit(function() {
        search_results = []
        var value =  $(this).find( 'input[name=text]' );
        $( '.b-search-content' ).html( '' ).css( 'display', 'block');
            if( !!value ){
                searchMatch ( value.val() )
                if( search_results.length === 0){
                    //value.val('нет результатов(');
                    var div = $( '<div></div>' ).addClass( 'b-search-content-title' ).html( 'Нет результатов =(' )
                    $( '.b-search-content' ).append( div ).fadeOut(2000);
                }else{
                    drawSearchList( search_results );
                }
            }
        return false;
    })

    function searchMatch ( value ){
        var value = value.toLowerCase();
        $.each( data.years, function(y){
            $.each( this.months, function(m){
                $.each( this.days, function(d){
                    $.each( this.lectures, function( i ){
                        // собираем то, почему искать будем
                        var choose_str = [this.caption,this.description,this.author.name,this.time].join(' ').toLowerCase()
                        if( choose_str.indexOf( value ) != -1 ){
                           var arr_special = [ new Date( y , m , d ), data.years[ y ].months[ m ].days[ d ].lectures ]
                           search_results.push( [ this, arr_special , i ] )
                        }
                    });
                });
            });
        });
    }

    function drawSearchList( data_arr ){
        var bsc = $( '.b-search-content' ).html( '' );
        $( '<div></div>' ).addClass( 'b-search-content-title' ).text( data_arr.length + ' - вот сколько совпадений! ')
            .appendTo( bsc );
        $.each( data_arr , function( ){
            $( '.e-day-list , .e-lector-list, .b-day ,.b-lecture' ).html( '' );
            var span = $( '<span></span>').html( this[ 0 ].caption ).addClass('link')
                .data( 'dateLecture', { 'parent_obj': this[ 1 ], 'number':this[ 2 ]} )
            $('<div></div>').addClass( 'b-search-list-final' ).append( span ).appendTo( bsc )
        })
    }

    $('.b-search-content').on('click', '.link', function(){
        var dataLecture  = $.data( $(this).get(0), 'dateLecture' );
        drawContent( dataLecture.parent_obj);
        $('.b-page_main_tb_l .i-draw-list-block').eq( dataLecture.number ).click();
    });
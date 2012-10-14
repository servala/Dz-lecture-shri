$(document).ready(function(){
	$('.calendar').on({
		'contextmenu': function(e){
			e.preventDefault();
			var a = this.id.split( '_' );
			drawRedactor( a[ 1 ], a[ 2 ], a[ 3 ]);
			return false; 
		},
		'selectstart': function(){
			return false;
		}
	}, 'div[id^="d_"]');
	$('.b-page_main_tb').on({
		'contextmenu': function(e){
			e.preventDefault();
			var a = this.id.split( '_' );
			drawRedactor( a[ 1 ], a[ 2 ], a[ 3 ], $(this).data( 'lecture' ));
			return false; 
		},
		'selectstart': function(){
			return false;
		}
	}, '.i-draw-list-block');
});

function drawRedactor( d, m, y, edit ){
    $('.b-redactor-cancel').show();
	$( '.b-search-content, .e-day-list, .e-lector-list, .b-lecture, .b-search-content' ).html( '' );
    $( '.b-print' ).hide();
    var bdiv = $( '.b-day' ).html( '' );

    $( '<div></div>' ).addClass( 'b-day-title' ).append($( '<span></span>' ).text([ d, months[ m ][ 1 ], y ].join( ' ' ))).appendTo( bdiv );
    var div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
    $( '<label for="hour">Время</label>' ).add( '<select id="hour"></select>' ).add( '<select id="min"></select>' ).appendTo( div );
	hourSelect = $('#hour');
	$.each([ '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], function(){
		$('<option></option>').text(this).attr('value',this).appendTo(hourSelect)
	});   
	minSelect = $('#min');
	$.each([ '00', '15', '30', '45' ], function(){
		$('<option></option>').text(this).attr('value',this).appendTo(minSelect)
	});
	div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
	$( '<label for="caption">Лекция *</label>' ).add( '<input id="caption" />' ).appendTo( div );
	div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
	$( '<label for="ltype">Тип</label>' ).add( '<select id="ltype"></select>' ).appendTo( div );
	ltypeSelect = $('#ltype');
	$.each([ 'blue', 'orange', 'yellow' ], function(){
		$('<option></option>').text(this).attr('value',this).css('color', this).appendTo(ltypeSelect)
	}); 
	div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
	$( '<label for="description">О лекции</label>' ).add( '<textarea id="description"></textarea>' ).appendTo( div );
	div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
	$( '<label for="author">Лектор *</label>' ).add( '<input id="author" />' ).appendTo( div );
	div = $( '<div></div>' ).addClass('formLine').appendTo( bdiv );
	$( '<label></label>' ).add('<input type="button" id="del" value="Поломать" />').add( '<input type="button" id="save" value="Созидать" />' ).appendTo( div );
	if( !!edit ){
		$( '#del' ).click( function(){
			deleteLecture( d, m, y, edit );
		});
        // full filds
		$( '#caption' ).val( edit.caption );
		$( '#ltype' ).val( edit.history );
		$( '#description' ).val( edit.description );
		$( '#author' ).val( edit.author.name );
	}
	else {
		$( '#del' ).prop( 'disabled', true ).css({
			'background': '-webkit-linear-gradient(top, silver, gray)',
			'color': 'gray'
		});
	}
	$( '#save' ).click( function(){
		if( verifyForm() ){
			alert( 'Многоуважаемый, заполните поля со *' );
		}
		else {
			storyLecture( d, m, y, edit );
		}
	});
}
function verifyForm(){
	return $('#caption').val() === '' || $( '#author' ).val() === '';
}
function deleteLecture( d, m, y, edit ){
	if( !edit ) return;
	edit.history = 'cancel';
	toLS( data );
	drawCalendar( m, y );
	drawContent([ new Date(y, m, d), data.years[ y ].months[ m ].days[ d ].lectures ]);
 	drawLectureBody( edit );  
 	$( '#print' ).show();
}
function storyLecture( d, m, y, edit ){
	if( !edit ) {
		if( !data ){
			data = { 'years': {}};
		}
		if( !data.years[ y ]) {
			data.years[ y ] = { 'months': {}};
		}
		if( !data.years[ y ].months[ m ]){
			data.years[ y ].months[ m ] = { 'days': {}};
		}
		if( !data.years[ y ].months[ m ].days[ d ]){
			data.years[ y ].months[ m ].days[ d ] = { 'decoration': 'orange', 'lectures': []}
		}
		l = data.years[ y ].months[ m ].days[ d ].lectures;
		edit = l[ l.length ] = {};
	}
	edit.time = $('#hour').val() + ':' + $('#min').val();
	edit.caption = $( '#caption' ).val();
	if(!edit.author){
		edit.author = {};
	}
	if(!edit.video){
		edit.video = [ null,null ];
	}
	edit.author.name = $('#author').val();
	edit.description = $('#description').val();
	data.years[ y ].months[ m ].days[ d ].decoration = $('#ltype').val();
	data.years[ y ].months[ m ].days[ d ].lectures.sort(function(a,b){
		var at = a.time.split(':'), bt = b.time.split(':');
		return ( parseInt( at[ 0 ], 10 ) * 100 + parseInt( at[ 1 ], 10 )) - ( parseInt( bt[ 0 ], 10 ) * 100 + parseInt( bt[ 1 ], 10 ));
	});
	toLS( data );
	drawCalendar( m, y );
	drawContent([ new Date(y, m, d), data.years[ y ].months[ m ].days[ d ].lectures ]);
 	drawLectureBody( edit );   
 	$( '#print' ).show();     
}
$('.b-redactor-cancel').on( 'click', function(){
    drawContent( backup );
})

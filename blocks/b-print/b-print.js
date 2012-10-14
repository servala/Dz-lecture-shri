$('.b-print').on('click', function(){
    frm = $('#print_frame').get(0).contentWindow;
    frm.document.body.innerHTML = '';

    var css_for_print = '<style>' +
        '.b-lecture-title{font-size: 20px; margin: 20px 0 10px 0}'+
        '.b-lecture-autor{margin-top: 3px;}'+
        '.b-lecture-content{ padding: 25px 10px 0 40px;}' +
        '.w320{ width: 320px;}.e-day-list{padding-left: 40px;}'+
        '.b-day-title{font-size: 12px; margin-botom:20px;}'+
        '.b-day-title span{ font-size: 20px;padding-right: 5px;}'+
        '</style>';

    $(frm.document.head).append( css_for_print );
    $( '.b-page_main_tb_l>*:not(.b-print,iframe)').clone().appendTo(frm.document.body);
    frm.print();
});
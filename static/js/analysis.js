// define panel header click behavior
$(document).on('click', '.panel div.clickable,.panel_folded', function (e) {
    e.preventDefault();
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});


// define scroll to top click behavior
$(document).on('click', '.go_top', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $('body').offset().top
    }, 'fast');
});


$(function () {
    //only show first panel and fold the others
    $('.panel_folded div.clickable').click();

});

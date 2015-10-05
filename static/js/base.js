
$(function () {

    // Animate the scroll to top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1000) {
            $('.go_top').fadeIn(500);
        } else {
            $('.go_top').fadeOut(500);
        }
    });

});


$(document).ready(function () {

    $('.panel div.clickable,.panel_folded div.clickable').on('click' , function (e) {
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

    $('.panel_folded div.clickable').click();



    // Animate the scroll to top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1000) {
            $(".go_top").fadeIn(500);
        } else {
            $(".go_top").fadeOut(500);
        }
    });
    $(".go_top").click(function (event) {
        event.preventDefault();
        $("html, body").animate({
            scrollTop: $("body").offset().top
        }, "fast");
    });
});

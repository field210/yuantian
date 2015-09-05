$(function () {
    $("#submit").on("click", function (e) {

        // preventing default click action
        e.preventDefault();

        // show loading button
        var $btn = $(this);
        $btn.button("loading");

        // define delay
        var delay = 1000;

        $("#bokeh_warning").addClass("hidden");

        $.ajax({
            url    : $SCRIPT_ROOT,
            type   : "post",
            data   : $("#input_panel input").serialize(),
            success: function (data) {
                console.log("success");
                console.log(data);
                if ($.isEmptyObject(data)) {
                    $("#bokeh_warning").removeClass("hidden");
                    $("#bokeh_warning").addClass("show");

                    // reset loading button
                    setTimeout(function () {
                        $btn.button("reset");
                    }, delay);
                }

                $("#bokeh_plot").html(data.div + data.script);
            },
            error  : function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
                console.log(xhr.responseText);
            }
        });

        // reset loading button
        setTimeout(function () {
            $btn.button("reset");
        }, delay * 5);

    });
    return false;
});

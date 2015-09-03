$(function () {
    $('#submit').on('click', function (e) {
        e.preventDefault(); // preventing default click action

        $('#bokeh_warning').addClass('hidden');

        $.ajax({
            url    : $SCRIPT_ROOT,
            type   : 'post',
            data   : $('#input_panel input').serialize(),
            success: function (data) {
                console.log('success');
                console.log(data);
                if($.isEmptyObject(data)){
                    $('#bokeh_warning').removeClass('hidden');
                    $('#bokeh_warning').addClass('show');
                }

                $('#bokeh_plot').html(data.div + data.script);
            },
            error  : function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
                console.log(xhr.responseText);
            }
        });
    })
    return false;
});

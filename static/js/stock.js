$(function () {
    $('#submit').on('click', function (e) {
        e.preventDefault(); // preventing default click action
        $.ajax({
            url    : $SCRIPT_ROOT,
            type   : 'post',
            data   : $('#input_panel input').serialize(),
            success: function (data) {
                console.log('success');
                console.log(data);

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

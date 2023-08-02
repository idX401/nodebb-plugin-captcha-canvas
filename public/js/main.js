$(function() {
    $(window).on('action:ajaxify.end', function (evt, data) {
        console.log(data);
        if(data.tpl_url === 'register' || data.tpl_url === 'login') {
            socket.emit('plugins.canvasCaptcha.getProblem', function (err, results) {
                console.log(results);
                if(!err) {
                    $('#form-text-for-' + results.uuid + ' span').text(results.problem);
                } else {
                    console.log(err);
                }
            });
        }
    });
});

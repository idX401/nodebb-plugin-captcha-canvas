$(function() {
    $(window).on('action:ajaxify.end', function (evt, data) {
        if(data.tpl_url === 'register' || data.tpl_url === 'login') {
            socket.emit('plugins.canvasCaptcha.getProblem', function (err, results) {
                if(!err) {
                    $('#form-text-for-' + results.uuid + ' span').text(results.problem);
                } else {
                    console.log(err);
                }
            });
        }
    });
});

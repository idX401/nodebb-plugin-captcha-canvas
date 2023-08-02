$(function() {
    $(window).on('action:ajaxify.end', function (evt, data) {
        if(data.tpl_url === 'register') {
            socket.emit('plugins.mathCaptcha.getProblem', function (err, results) {
                if(!err) {
                    $('#form-text-for-' + results.uuid + ' span').text(results.problem);
                } else {
                    console.log(err);
                }
            });
        }
    });
});

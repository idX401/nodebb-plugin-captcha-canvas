'use strict';

let crypto = require('crypto');

let { v4: uuidv4 } = require('uuid');
let async = require('async');

let db = require.main.require('./src/database');

let nconf = require.main.require('nconf');
let winston = require.main.require('winston');

const { createCaptchaSync } = require('captcha-canvas');

let plugin = {};

const possible_solutions = ['empty', 'honeypot', 'not_a_number', 'invalid_session', 'wrong', 'correct'];

plugin.init = function(params, callback) {
    params.router.get('/admin/captcha-canvas', params.middleware.admin.buildHeader, renderAdmin);
    params.router.get('/api/admin/captcha-canvas', renderAdmin);
    /*
    let socketPlugins = require.main.require('./src/socket.io/plugins');
    socketPlugins.canvasCaptcha = {
        getProblem: function(socket, params, callback) {
            db.sessionStore.get(socket.request.signedCookies[nconf.get('sessionKey')], function (err, sessionData) {
                sessionData = sessionData && sessionData["nodebb-plugin-captcha-canvas"] || {
                    uuid: 'x-error-no-session-x',
                    problem: '#error-no-session#'
                };

                callback(null, {uuid: sessionData.uuid, problem: sessionData.problem});
            });
        }
    };
    */
    callback();
};

plugin.initPrometheus = function(params) {
    db.getObject('nodebb-plugin-captcha-canvas:counters', function (err, counters) {
        if(err) {
            winston.error('[plugin/captcha-canvas] Failed to init prometheus: ' + err.message);
            return;
        }

        plugin.prometheus = {
            created: new params.prometheus.Counter({
                name: 'nodebb_plugin_canvas_captcha_created_total',
                help: 'Total created captcha'
            }),
            submitted: new params.prometheus.Counter({
                name: 'nodebb_plugin_canvas_captcha_submitted_total',
                help: 'Total submitted captcha (solution is either correct, invalid_session, not_a_number, wrong, honeypot or empty)',
                labelNames: ['solution']
            })
        };

        for(let possible_solution of possible_solutions) {
            plugin.prometheus.submitted.inc({"solution": possible_solution}, 0);
        }

        if(counters !== null) {
            for (let key of Object.keys(counters)) {
                if (key === 'created') {
                    plugin.prometheus.created.inc(parseInt(counters[key], 10));
                } else if (possible_solutions.indexOf(key) > -1) {
                    plugin.prometheus.submitted.inc({"solution": key}, parseInt(counters[key], 10));
                }
            }
        }
    });
};

plugin.addAdminNavigation = function (header, callback) {
    header.plugins.push({
        route: '/captcha-canvas',
        icon: 'fa-shield',
        name: 'Canvas Captcha'
    });

    callback(null, header);
};

plugin.addCaptcha = function (data, callback) {
    const { image, text } = createCaptchaSync(300, 100);
    let imgBase64 = new Buffer(image).toString('base64');
    let uuid = uuidv4();
    
    data.req.session["nodebb-plugin-captcha-canvas"] = {
        uuid: uuid,
        solution: text
    };

    let captcha = {
        label: '[[nodebb-plugin-captcha-canvas:label]]',
        html: '<img id="img-' + uuid + '" alt="cap" src="data:image/png;base64,'+imgBase64+'" />'+
            '<input class="form-control" type="text" placeholder="[[nodebb-plugin-captcha-canvas:solution_placeholder]]" name="' + uuid + '" id="' + uuid + '" />',
        styleName: uuidv4()
    };

    if(data.templateData.regFormEntry && Array.isArray(data.templateData.regFormEntry)) {
        data.templateData.regFormEntry.push(captcha);
    }else if(data.templateData.loginFormEntry && Array.isArray(data.templateData.loginFormEntry)) {
        data.templateData.loginFormEntry.push(captcha);
    } else {
        data.templateData.captcha = captcha;
    }

    //console.log(data);
    //console.log(uuid, results);
    //console.log(captcha);
    
    increaseCounter('created');

    callback(null, data);
};
plugin.checkCaptcha = function (data, callback) {
    let sessionData = data.req.session["nodebb-plugin-captcha-canvas"];

    if(sessionData && sessionData.uuid && sessionData.solution && sessionData.honeypotSolution) {
        let result = data.userData[sessionData.uuid];
        if(result.toUpperCase() === sessionData.solution) {
            increaseCounter('correct');
            callback(null, data);
            return;
        } else if(result === '') {
            increaseCounter('empty');
        }else{
            increaseCounter('wrong');
        }
        /*
        else if(result === sessionData.honeypotSolution) {
            increaseCounter('honeypot');
        }
        else if(/^-?[0-9]+$/.test(result)) {
            increaseCounter('wrong');
        } else {
            increaseCounter('not_a_number');
        }
        */
    } else {
        increaseCounter('invalid_session');
    }

    callback(new Error('[[nodebb-plugin-captcha-canvas:failed]]'));
};

function increaseCounter(type) {
    db.incrObjectField('nodebb-plugin-captcha-canvas:counters', type);

    if(plugin.prometheus) {
        if(possible_solutions.indexOf(type) > -1) {
            plugin.prometheus.submitted.inc({"solution": type});
        } else if(type === 'created') {
            plugin.prometheus.created.inc();
        }
    }
}

function renderAdmin(req, res) {
    db.getObject('nodebb-plugin-captcha-canvas:counters', function (err, counters) {
        if(err) {
            winston.error('[plugin/captcha-canvas] Unable to retrieve counters: ' + err.message);
            counters = {
                empty: '#error#',
                honeypot: '#error#',
                wrong: '#error#',
                not_a_number: '#error#',
                invalid_session: '#error#',
                total_failures: '#error#',
                correct: '#error#',
                created: '#error#'
            };
        } else if(!counters) {
            counters = {
                empty: 0,
                honeypot: 0,
                wrong: 0,
                not_a_number: 0,
                invalid_session: 0,
                total_failures: 0,
                correct: 0,
                created: 0
            };
        }
        else {
            counters = {
                empty: parseInt(counters.empty, 10) || 0,
                honeypot: parseInt(counters.honeypot, 10) || 0,
                wrong: parseInt(counters.wrong, 10) || 0,
                not_a_number: parseInt(counters.not_a_number, 10) || 0,
                invalid_session: parseInt(counters.invalid_session, 10) || 0,
                correct: parseInt(counters.correct, 10) || 0,
                created: parseInt(counters.created, 10) || 0
            };

            counters.total_failures = counters.empty
                + counters.honeypot
                + counters.wrong
                + counters.not_a_number
                + counters.invalid_session;
        }

        res.render('admin/plugins/captcha-canvas', {
            counters: counters
        });
    });
}


module.exports = plugin;

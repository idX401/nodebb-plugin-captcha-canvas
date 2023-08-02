# nodebb-plugin-math-captcha

![nodebb compatibility](https://packages.nodebb.org/api/v1/plugins/nodebb-plugin-math-captcha/compatibility.png)

This plugin adds a captcha to the registration process for new users to solve. It displays a simple calculation that the users has to enter in an input box. The question is retrieved via web sockets. Initially a honeypot calculation before the web socket calculation is downloaded will be presented.

This is probably not a good captcha for frequently visited websites. Consider using other captcha solutions like [`nodebb-plugin-spam-be-gone`](https://www.npmjs.com/package/nodebb-plugin-spam-be-gone). The math captcha might be more user friendly but provides less security against spam bots.

If the `nodebb-plugin-prometheus` plugin is installed and activated, this plugin will deliver additional metrics.

|Name|Type|Labels|Help|
|----|----|------|----|
|nodebb_plugin_math_captcha_created_total|counter| |Total created captcha|
|nodebb_plugin_math_captcha_submitted_total|counter|solution|Total submitted captcha (solution is either correct, invalid_session, not_a_number, wrong, honeypot or empty)|

Repository: https://gitlab.com/cppnet/nodebb/nodebb-plugin-math-captcha
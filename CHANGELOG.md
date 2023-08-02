# Changelog

## v0.4.0 - 2018-12-28

* Fixed warning of require in NodeBB v1.11

## v0.3.1 - 2018-10-23

* Fixed warning about missing admin.js

## v0.3.0 - 2018-06-11

* Added created counter
* Added correct solution counter
* Renamed prometheus metrics (now submitted with labels and created, see the readme)
* **This version ignores all counters from previous versions!** Previous counters can still be found in the database in the key `nodebb-plugin-math-captcha:failures`.
* Fixed compatibility issue with Redis in displaying the counters in the ACP 

## v0.2.0 - 2018-06-10

* Fixed the possibility for the honeypot and correct solution to be the same
* Added support for monitoring via [`nodebb-plugin-prometheus`](https://www.npmjs.com/package/nodebb-plugin-prometheus)

## v0.1.1 - 2018-04-27

* Fixed uninitialized failure counters in ACP

## v0.1.0 - 2018-04-27

* Initial release
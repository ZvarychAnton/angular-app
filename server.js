/**
 * Created by Anton on 19.10.16.
 */
var path = require('path');
var express = require('express');


var app = express().use(express.static(
    path.join(__dirname, '')
));


app.listen(8084);

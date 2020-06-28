var mongoose = require( 'mongoose' );
var userData = require('./user');
var webpost = require('./webpost');
var propertyData = require('./property');
var readLine = require ("readline");
var adminCtrl = require('../controllers/administrator');
var gracefulShutdown;
var dbName = "your-database-name";
var dbURI = "mongodb://heroku_xxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mlab.com:xxxxx/heroku_xxxxxxxxx";

mongoose.connect(dbURI,  { useNewUrlParser: true, useUnifiedTopology: true } );

if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
    rl.on ("SIGUSR2", function (){
        process.emit ("SIGUSR2");
    });
    rl.on ("SIGTERM", function (){
        process.emit ("SIGTERM");
    });
}

/* Monitoring for successful connection*/
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

/* Checking for connection error*/
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: '+ err );
});

/* Checking for disconnection event*/
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function() {
        console.log("Mongoose disconnected through " + msg);
        callback();
    });
};

process.once('SIGURSR2', function(){
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function(){
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

process.on('SIGTERM', function(){
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

adminCtrl.createAdministrator();
adminCtrl.createTestAcc();

var myApp = angular.module('myApp', ['ngSyncano']);

myApp.config(function (syncanoServiceProvider) {
    syncanoServiceProvider.configure({
        apiKey: 'APIKEY',
        instance: 'INSTANCE'
    });
});

myApp.controller('SyncanoController', function ($scope, syncanoService) {

    var authSyncanoService = null; // instantiate user authenticated Syncano Service
    var userDetails = { // used to log in below - to get user key
        "username":"SyncanoUserName", // a user in your Syncano instance
        "password":"SyncanoUserPassword" // not your Syncano account password, but the user in your instance
    };

    syncanoService.user().login(userDetails)
        .then(function(res){
            authSyncanoService = syncanoService;
            authSyncanoService.config.userKey = res.user_key;
            // then pass the new service to any function
        })
        .catch(function(err){
            console.log(err);
        });

});
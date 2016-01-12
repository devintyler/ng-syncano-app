var myApp = angular.module('myApp', ['ui.router', 'ngSyncano']);

myApp.config(function ($stateProvider, $urlRouterProvider, syncanoServiceProvider) {
    syncanoServiceProvider.configure({
        apiKey: 'APIKEY', // public API key
        instance: 'INSTANCE'
    });

    // For any unmatched url, redirect here
    $urlRouterProvider.otherwise("/home/data-list");

    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "views/home.html",
            controller: "SyncanoController"
        })
        .state('home.dataList', {
            url: "/data-list",
            templateUrl: "views/partials/data-list.html"
        });
});

myApp.controller('SyncanoController', function ($scope, syncanoService) {

    // **************************************
    // OPTION 1: Public API Key with User Key

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
            // for example - getData();
            // be sure to only make Syncano calls after this one returns if you need permission
        })
        .catch(function(err){
            console.log(err);
        });

    // **************************************

    // **************************************
    // OPTION 2: Change the API Key in the configuration to a public API Key with the 'ignore_acl' flag
    // **************************************

    // **** dataList App ****
    function getData() {
        syncanoService.class('testdata').dataobject().list()
            .then(function(res){
                // load the array of data objects into dataList
                $scope.dataList = res.objects;
            })
            .catch(function(err){
                $scope.error = err;
            });
    }
    // **** End dataList App ****

});
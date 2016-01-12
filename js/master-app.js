var myApp = angular.module('myApp', ['ui.router', 'ngSyncano']);

myApp.config(function ($stateProvider, $urlRouterProvider, syncanoServiceProvider) { // Syncano app configuration
    syncanoServiceProvider.configure({
        apiKey: 'c261b092751f882fc73f28f6e672adf50626d0a7', // public API key with 'ignore_acl'
        instance: 'twilight-bird-3277'
    });

    // For any unmatched url
    $urlRouterProvider.otherwise("/home/data-list");

    // States
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

    // **** dataList App ****
    getData();

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

    $scope.addData = function(data){

    };
    // **** End dataList App ****

});
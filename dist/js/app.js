var myApp = angular.module('myApp', ['ui.router', 'ngSyncano']);

myApp.config(function ($stateProvider, $urlRouterProvider, syncanoServiceProvider) { // Syncano app configuration
    syncanoServiceProvider.configure({
        apiKey: 'APIKEY', // public API key with 'ignore_acl'
        instance: 'INSTANCE'
    });

    // For any unmatched url
    $urlRouterProvider.otherwise("/home");

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
    // initial $scope
    $scope.initial = ""; // to later reset model

    getData(); // get initial data

    $scope.dataListAdd = function(item) {
        if ($scope.dataList.length < 10){
            var newItem = angular.copy(item);
            $('#dataListItem').val(""); // clear the input

            addData(newItem)
                .then(function(res){
                    if (res){
                        $scope.dataList.push(res);
                    } else {
                        // TODO error
                    }
                });
        } else {
            alert('There are too many items! Delete some first to add more.');
        }
    };

    $scope.dataListRemove = function(itemID, index) {
        removeData(itemID)
            .then(function(res){
                if (res){
                    $scope.dataList.splice(index, 1);
                    $scope.$apply();
                } else {
                    // TODO error
                }
            });
    };

    function getData() {
        syncanoService.class('CLASS').dataobject().list()
            .then(function(res){
                // load the array of data objects into dataList
                $scope.dataList = res.objects;
            })
            .catch(function(err){
                $scope.error = err;
            });
    }

    function addData(item) {
        return syncanoService.class('CLASS').dataobject().add(item)
            .then(function(res){
                successAlert();
                return res;
            })
            .catch(function(err){
                $scope.error = err;
                return false;
            });
    }

    function removeData(itemID) {
        return syncanoService.class('CLASS').dataobject(itemID).delete()
            .then(function(res){
                return true;
            })
            .catch(function(err){
                console.log(err);
                return false;
            });
    }

    function successAlert() {
        var alert = $('#dataListAddSuccess');
        alert.fadeIn(800);
        alert.delay(500);
        alert.fadeOut(800);
    }
    // **** End dataList App ****

});
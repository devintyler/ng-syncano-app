var myApp = angular.module('myApp', ['ui.router', 'ngSyncano', 'ngAnimate', 'ngTouch', 'ngMessages']);

myApp.config(function ($stateProvider, $urlRouterProvider, syncanoConfigProvider) { // Syncano app configuration
    syncanoConfigProvider.configure({
        apiKey: '8f9761efaa4deffd95e9e7b3c587bf0d70c6084d', // public API key with 'ignore_acl' and 'user'
        instance: 'twilight-bird-3277'
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
        })
        .state('home.userAuth', {
            url: "/user-auth",
            templateUrl: "views/partials/user-auth.html"
        });
});

myApp.controller('SyncanoController', function ($scope, syncanoService) {

    var syncano = null;

    syncanoService.getSyncano()
        .then(function(res){
            syncano = res;

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
                syncano.class('testdata').dataobject().list()
                    .then(function(res){
                        // load the array of data objects into dataList
                        $scope.dataList = res.objects;
                    })
                    .catch(function(err){
                        $scope.error = err;
                    });
            }

            function addData(item) {
                return syncano.class('testdata').dataobject().add(item)
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
                return syncano.class('testdata').dataobject(itemID).delete()
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



            // **** userAuth App **** //

            // Variables
            $scope.signUp = {
                name: "",
                email: "",
                password: ""
            };
            $scope.signUpSuccess = false;
            $scope.logIn = {
                email: "",
                password: ""
            };
            $scope.logInSuccess = false;

            // Functions
            $scope.signUpSubmit = function(e) {
                console.log($scope.signUp);
                var user = {
                    "username":$scope.signUp.email,
                    "password":$scope.signUp.password
                };

                syncano.user().add(user)
                    .then(function(res){
                        console.log(res);
                        // TODO current object doesn't allow for updating user_profile
                        $scope.toggleSignUpSuccess();
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            };

            $scope.toggleSignUpSuccess = function() {
                if ($scope.signUpSuccess){
                    $scope.signUpSuccess = false;
                    $scope.signUp = {
                        name: "",
                        email: "",
                        password: ""
                    };
                } else {
                    $scope.signUpSuccess = true;
                }
            };

            // TODO log in submit
            $scope.logInSubmit = function(e) {
                console.log($scope.logIn);
                $scope.toggleLogInSuccess();
            };

            // TODO log in display user data (lost on page refresh)
            $scope.toggleLogInSuccess = function() {
                if ($scope.logInSuccess){
                    $scope.logInSuccess = false;
                } else {
                    $scope.logInSuccess = true;
                }
            };

            // **** End userAuth App **** //
        })
        .catch(function(err){
            console.log(err);
        });

});
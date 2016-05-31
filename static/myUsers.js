var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) { 
  $routeProvider 
    .when('/', { 
        controller: 'HomeController', 
        templateUrl: 'views/home.html' 
    }).when('/newuser', {
        controller: 'NewUserController',
        templateUrl: 'views/newUser.html'
    }).when('/edituser', {
        controller: 'EditUserController',
        templateUrl: 'views/editUser.html'
    }).otherwise({ 
        redirectTo: '/' 
    }); 
});

app.factory("dataService", ['$http', '$q',function($http, $q) {
    var obj = {}; 
    obj.currentId = null;
    obj.newUserId = 17;

    obj.getUsers = function($scope) { 
        $http.get('http://localhost:8888/api/users')
            .success(function(data) {
                $scope.users = data;
                $scope.syncFunc();
            });
    }

    // Save the Change
    obj.saveChange = function(newUserName, newId, fName, lName, title, sex, age) {
        var data = {
            "newUserName" : newUserName,
            "id" : newId,
            "fName" : fName,
            "lName" : lName,
            "title" : title,
            "sex" : sex,
            "age" : age
        }
        $http.post('http://localhost:8888/api/users', data)
            .success(function(data) {
                // obj.getUsers();
            });
    };

    obj.editChange = function(newUserName, id, fName, lName, title, sex, age, $scope) {
        var data = {
            "newUserName" : newUserName,
            "id" : id,
            "fName" : fName,
            "lName" : lName,
            "title" : title,
            "sex" : sex,
            "age" : age
        }
        $http.put('http://localhost:8888/api/users/' + id, data)
            .success(function(data) {
                console.log(data);
                $scope.users = data;
                obj.getUsers($scope);
                $scope.syncFunc();
            });
    };

    // Remove the User
    obj.removeUser = function(id) {
        var data = {
            "id" : id
        }
        $http.delete('http://localhost:8888/api/users/' + id);
    }

    obj.getEditUsers = function(id, $scope) {
        $http.get('http://localhost:8888/api/users/' + id)
            .success(function(data) {
                $scope.fName = data.fName;
                $scope.lName = data.lName;
                $scope.title = data.title;
                $scope.sex = data.sex;
                $scope.age = data.age;
            }); 
    }

    return obj;
}]);

//************* NEW USER CONTROLLER ************//
app.controller('NewUserController', ['$scope', 'dataService', function($scope, dataService) {
    $scope.users = dataService.getUsers();
    
    $scope.edit = true;

    $scope.fName = '';
    $scope.lName = '';
    $scope.title = '';
    $scope.sex = '';
    $scope.age = '';
    $scope.passw1 = '';
    $scope.passw2 = '';

    $scope.addUser = function() {
        dataService.saveChange(true, dataService.newUserId++, $scope.fName, $scope.lName, $scope.title, $scope.sex, $scope.age);
        dataService.getUsers($scope);
    };

    // Exam the data field valid!
    $scope.$watch('passw1', function() {
        $scope.test();
    });
    $scope.$watch('passw2', function() {
        $scope.test();
    });
    $scope.$watch('fName', function() {
        $scope.test();
    });
    $scope.$watch('lName', function() {
        $scope.test();
    });
    $scope.$watch('title', function() {
        $scope.test();
    });
    $scope.$watch('sex', function() {
        $scope.test();
    });
    $scope.$watch('age', function() {
        $scope.test();
    });

    // Test Two passward are same
    $scope.test = function() {
        if ($scope.passw1 !== $scope.passw2) {
            $scope.error = true;
        } else {
            $scope.error = false;
        }
        $scope.incomplete = false;
        if ($scope.edit && (!$scope.fName.length ||
                !$scope.lName.length ||
                !$scope.passw1.length || !$scope.passw2.length)) {
            $scope.incomplete = true;
        }
    };
}]);

//************* EDIT USER CONTROLLER ************//
app.controller('EditUserController', ['$scope', 'dataService', function($scope, dataService) {
    // $scope.users = dataService.getUsers($scope);
    $scope.newUserName = false;

    dataService.getEditUsers(dataService.currentId, $scope);

    $scope.addUser = function() {
        dataService.editChange(false, dataService.currentId, $scope.fName, $scope.lName, $scope.title, $scope.sex, $scope.age, $scope);
        dataService.getUsers($scope);
    };

    // Exam the data field valid!
    $scope.$watch('passw1', function() {
        $scope.test();
    });
    $scope.$watch('passw2', function() {
        $scope.test();
    });
    $scope.$watch('fName', function() {
        $scope.test();
    });
    $scope.$watch('lName', function() {
        $scope.test();
    });
    $scope.$watch('title', function() {
        $scope.test();
    });
    $scope.$watch('sex', function() {
        $scope.test();
    });
    $scope.$watch('age', function() {
        $scope.test();
    });

    // Test Two passward are same
    $scope.test = function() {
        if ($scope.passw1 !== $scope.passw2) {
            $scope.error = true;
        } else {
            $scope.error = false;
        }
        $scope.incomplete = false;
        if ($scope.edit && (!$scope.fName.length ||
                !$scope.lName.length ||
                !$scope.passw1.length || !$scope.passw2.length)) {
            $scope.incomplete = true;
        }
    };
}]);

//************ HOME PAGE CONTROLLER ************//
app.controller('HomeController', ['$scope', 'dataService', function($scope, dataService, $routeParams) {
    $scope.users = [];
    dataService.getUsers($scope);

    // Get the current user's id
    $scope.setId = function(id) {
        dataService.currentId = id;
    }

    $scope.deleteUser = function(id) {
        dataService.removeUser(id);
        dataService.getUsers($scope);
        $scope.syncFunc();
        if ( ($scope.currentPage - 1) * $scope.pageSize >= $scope.users.length) {
            $scope.updatePage($scope.currentPage - 1);
        } else {
            $scope.updatePage($scope.currentPage);
        }
    };

    // Pager Logic
    $scope.pageSize = 4;
    $scope.startIdx = 0;
    $scope.pageNumArray = [];
    $scope.currentPage = 1;

    $scope.syncFunc = function() {   
        $scope.pageNumbers = Math.ceil($scope.users.length / $scope.pageSize);
        $scope.pageNumArray = [];
        for (var i = 0; i < $scope.pageNumbers; i++) {
            $scope.pageNumArray[i] = i + 1;
        }
    };

    // This will update the page content base on the current page number
    $scope.updatePage = function(num) {
        if (num < 1 || num > $scope.pageNumArray.length) {
            return;
        } else {
            $scope.startIdx = $scope.pageSize * (num - 1);
            $scope.currentPage = num;
        }
    }
}]);



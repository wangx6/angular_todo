'use strict'

var demoApp = angular.module('demoApp',['ngRoute','ngAnimate']);
demoApp.config(function($routeProvider,$locationProvider){
   // $locationProvider.html5Mode(true);
    $routeProvider
        .when('/view1',{
            controller:'Controller',
            templateUrl:'partials/view1.html'
        })
        .otherwise({ redirectTo:'/view1' });
});

demoApp.factory('Factory', function(){
    var toDoItemList = [];
    var factory = {};

    // loading data from storage
    factory.getToDoList = function(){
        if (typeof(Storage) != "undefined"){
            toDoItemList = JSON.parse(localStorage.getItem("toDoList"));
            if(!toDoItemList){
                toDoItemList = [];
            }
            else{
                for(var i = 0 ; i < toDoItemList.length ; i++){
                    toDoItemList[i].isHighlighted = false;
                    toDoItemList[i].selectedToBeViewed = true;
                }
            }
        }
        else{
            console.log("Sorry, your browser does not support Web Storage...");
        }
        return toDoItemList;
    }
    return factory;
});

demoApp.controller('Controller', function ($scope, Factory){
    init();

    // init scope variables
    function init(){
        $scope.toDoItemList = Factory.getToDoList();
        $scope.toDoItem = '';
        $scope.noOfCompletedItems = 0;

        for(var i = 0; i<$scope.toDoItemList.length ; i++){
            if($scope.toDoItemList[i].isComplete)
            $scope.noOfCompletedItems++;
        }
    }

    // add one todo to the list
    $scope.addToList = function (){
        if($scope.toDoItem.length > 0){
            $scope.toDoItemList.push({  task:$scope.toDoItem,
                                        isComplete:false,
                                        isHighlighted:false,
                                        selectedToBeViewed:true,
                                        isDisabled:true});
            $scope.toDoItem = '';
            if (typeof(Storage) != "undefined"){
                localStorage.setItem("toDoList", JSON.stringify($scope.toDoItemList));
            }
            else{
                console.log("Sorry, your browser does not support Web Storage...");
            }
        }
    }

    // delete one item from the list
    $scope.deleteItem = function(){
        var isSureToDeleteItem = confirm('Are you sure you want to delete this item?');
        if(isSureToDeleteItem){
            for(var i = 0 ; i < $scope.toDoItemList.length ; i++){
                if($scope.toDoItemList[i].isHighlighted == true)
                    $scope.toDoItemList.splice(i,1);
            }
        }
    }

    // eidtItem - set input text abled/disabled
    $scope.editItem = function(index){
        for(var i = 0 ; i < $scope.toDoItemList.length ; i++){
            $scope.toDoItemList[i].isDisabled = true;
        }
        $scope.toDoItemList[index].isDisabled = false;
    }

    /* highligh item so that delete and other possible admin button can be shown
        note that in this app not only we allow hightlight to happle via mouseover
        we also allow it to happen when user click on the todo item. This is nessecary
        for mobile devices
     */
    $scope.highlightItem = function(index){
        var temp = $scope.toDoItemList[index].isDisabled;

        for(var i = 0 ; i < $scope.toDoItemList.length ; i++){
            $scope.toDoItemList[i].isHighlighted = false;
            $scope.toDoItemList[i].isDisabled = true;
        }
        if(!temp){
            $scope.toDoItemList[index].isDisabled = false;
        }
        $scope.toDoItemList[index].isHighlighted = true;

    }

    // set all item unhighlighted
    $scope.unhighlightItem = function(index){
            $scope.toDoItemList[index].isHighlighted = false;
    }

    // toggle item to be complete/incomplete
    $scope.toDoComplete = function(index){
        $scope.toDoItemList[index].isComplete = !$scope.toDoItemList[index].isComplete;
    }

    // delete all completed items
    $scope.clearCompletedItems = function(){
        if($scope.noOfCompletedItems > 0){
            var isSureToClearComplete = confirm('You are about the clear all completed items, are you sure?');
            if(isSureToClearComplete){
                var i = $scope.toDoItemList.length;
                while (i--) {
                    if($scope.toDoItemList[i].isComplete){
                        $scope.toDoItemList.splice(i,1);
                    }
                }
            }
        }
    }

    // filter items based on different request
    $scope.filterItems = function(condition){
        switch(condition){
            case 'all':
                for(var i = 0; i < $scope.toDoItemList.length; i++){
                    $scope.toDoItemList[i].selectedToBeViewed = true;
                }
                break;
            case 'active':
                for(var i = 0; i < $scope.toDoItemList.length; i++){
                    if(!$scope.toDoItemList[i].isComplete)
                        $scope.toDoItemList[i].selectedToBeViewed = true;
                    else
                        $scope.toDoItemList[i].selectedToBeViewed = false;
                }
                break;
            case 'completed':
                for(var i = 0; i < $scope.toDoItemList.length; i++){
                    if($scope.toDoItemList[i].isComplete)
                        $scope.toDoItemList[i].selectedToBeViewed = true;
                    else
                        $scope.toDoItemList[i].selectedToBeViewed = false;
                }
                break;
            default:
                for(var i = 0; i < $scope.toDoItemList.length; i++){
                    $scope.toDoItemList[i].selectedToBeViewed = true;
                }
                break;
        }
    }

    // once our list is modified store it to the local storage
    $scope.$watch('toDoItemList',function(){
        localStorage.setItem("toDoList", JSON.stringify($scope.toDoItemList));
        $scope.noOfCompletedItems = 0;
        for(var i = 0 ; i<$scope.toDoItemList.length ; i++){
            if($scope.toDoItemList[i].isComplete)
            $scope.noOfCompletedItems ++;
        }
    },true);
});
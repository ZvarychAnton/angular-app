/**
 * Created by anton on 20.10.16.
 */
angular.module("angularApp").component('messageList', {
    scope: true,
    bindings:{
        content:'<'
    },
    controller:['$scope', function($scope){
        var $ctrl = this;
        $ctrl.titles = ["N","From","Subject","Message"];
    }],
    templateUrl: 'modules/js/message-list/message-list.html'
});
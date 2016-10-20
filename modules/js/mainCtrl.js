/**
 * Created by anton on 19.10.16.
 */

angular.module("angularApp")
    .controller("testAppCtrl",[
    "$scope",
    "$injector",
    function($scope,
             $injector){

        $scope.isVisible = true;
        $scope.messagesArray = [];
        $timeout = $injector.get("$timeout");
        var decodeFabric = $injector.get("decodeFabric");

        var clientId = '851524981879-65cg7bv2248l88lqq3bpv87o29h22jn8.apps.googleusercontent.com';
        var apiKey = 'AIzaSyBJrYvdF581JiXwzxVzif2sOSoOZ6C--No';
        var scopes = 'https://www.googleapis.com/auth/gmail.readonly';

        $scope.handleClientLoad = function() {
            gapi.client.setApiKey(apiKey);
            $timeout(function() {
                $scope.checkAuth();
            }, 1);
        };

        $scope.checkAuth = function(){
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: true
            }, $scope.handleAuthResult);
        };

        $scope.handleAuthClick = function(){
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: false
            }, $scope.handleAuthResult);
            return false;
        };
        $scope.handleAuthResult = function(authResult) {
            if(authResult && !authResult.error) {
                $scope.loadGmailApi();
                $scope.isVisible = false;
            } else {
                $scope.isVisible = true;
            }
            $scope.$apply();

        };
        $scope.loadGmailApi = function(){
            gapi.client.load('gmail', 'v1', $scope.displayInbox);
        };
        $scope.displayInbox = function(){

            var request = gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': 'INBOX',
                'maxResults': 10
            });
            request.execute(function(response) {
                angular.forEach(response.messages, function(message) {
                    var messageRequest = gapi.client.gmail.users.messages.get({
                        'userId': 'me',
                        'id': message.id
                    });
                    messageRequest.execute(function(response) {

                        var messageData = {
                          'from': decodeFabric.getHeader(response.payload.headers, 'From'),
                          'subject': decodeFabric.getHeader(response.payload.headers, 'Subject'),
                          'date': decodeFabric.getHeader(response.payload.headers, 'Date'),
                          'text': decodeFabric.getBody(response.payload)
                        };
                        $scope.messagesArray.push(messageData);
                        //apply from js context
                        $scope.$apply();
                    });
                });
            });
        };

        $timeout(function() {
            $scope.handleClientLoad();
        }, 1000);
    }]);

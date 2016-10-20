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
                $('.table-inbox').removeClass("hidden");
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
                    //messageRequest.execute(appendMessageRow);
                    messageRequest.execute(function(response) {

                        var messageData = {
                          'from': getHeader(response.payload.headers, 'From'),
                          'subject': getHeader(response.payload.headers, 'Subject'),
                          'date': getHeader(response.payload.headers, 'Date'),
                          'text': getBody(response.payload)
                        };
                        $scope.messagesArray.push(messageData);
                        //apply from js context
                        $scope.$apply();
                    });
                });
            });
        };
        
        function getHeader(headers, index) {
            var header = '';
            angular.forEach(headers, function(type){
                if(type.name === index){
                    header = type.value;
                }
            });
            return header;
        }
        function getBody(message) {
            var encodedBody = '';
            if(typeof message.parts === 'undefined')
            {
                encodedBody = message.body.data;
            }
            else
            {
                encodedBody = getHTMLPart(message.parts);
            }
            encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
            return decodeURIComponent(escape(window.atob(encodedBody)));
        }
        function getHTMLPart(arr) {
            for(var x = 0; x <= arr.length; x++)
            {
                if(typeof arr[x].parts === 'undefined')
                {
                    if(arr[x].mimeType === 'text/html')
                    {
                        return arr[x].body.data;
                    }
                }
                else
                {
                    return getHTMLPart(arr[x].parts);
                }
            }
            return '';
        }


        $timeout(function() {
            $scope.handleClientLoad();
        }, 1000);
    }]);

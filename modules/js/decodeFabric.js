/**
 * Created by anton on 20.10.16.
 */
angular.module("angularApp").factory("decodeFabric", function() {

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
    return{
        getHeader: getHeader,
        getBody: getBody
    }
});
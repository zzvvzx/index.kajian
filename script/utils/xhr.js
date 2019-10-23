


'use strict';


/**
 * XMLHTTPRequest (ajax).
 * @desc manage all in/out request.
 */
 
UTILS.xhr = {};


/* start the request */
UTILS.xhr.send = function({url, method, auth, data, title, bytes}){
  return new Promise(function(resolve, reject){
    var x = new XMLHttpRequest();
    x.onload  = () => x.status === 200 ? resolve(x.response) : reject(x.status);
    x.onerror = () => reject(x.status);
    x.open(method, url);
    if(auth) x.setRequestHeader('Authorization', 'Bearer ' + auth);
    data ? x.send(data) : x.send();
  });
}


UTILS.xhr.getJSON = function(url,call){
  UTILS.xhr.send({
    url: url,
    method: 'GET'
  })
  .then(result => {
    call(JSON.parse(result));
  });
}
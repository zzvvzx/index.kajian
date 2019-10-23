

'use strict';

UTILS.state = {};

UTILS.state.init = function(name, obj, reset){
  if(!localStorage[name] || reset) setLocalStorage(name, obj);
}


UTILS.state.c = v => v ? 'checked'  : ''; // checkbox
UTILS.state.r = v => v ? 'selected' : ''; // radio
UTILS.state.o = v => v ? 'selected' : ''; // select option

UTILS.state.set = function(name, subname, val){
  var set = getLocalStorage(name);
  set[subname] = val;
  setLocalStorage(name, set);
};




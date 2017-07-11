'use strict';
function add(x,y){
  return x + y;
}
function sub(x,y){
  return x - y;
}
function mul(x,y){
  return x * y;
}
function identityf(x){
  return function anon(){
    return x;
  }
}
function addf(x){
  return function(y) {
    return x + y;
  };
}
function curry(passedIn,x){
  return function anon(y) {
    return passedIn(x,y);
  }
}

function curryr(binary,x){
  return function anonymous(y){
    //This is just the same as above but reversed
    return binary(y,x);
  }
}

function liftf(twoArgumentFunction){
  return function anonymousFunction(x){
    return function secondAnonymousFunction(y){
      return twoArgumentFunction(x,y);
    }
  }
}

var inc = curryr(sub,1);
console.log(inc(5));

var subAny = liftf(sub);




//Stuff from
console.log(subAny(4)(3));
console.log(curry(mul,5)(6));

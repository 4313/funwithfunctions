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
//Examples of how the first functions defined work
var subAny = liftf(sub);
console.log(subAny(4)(3));
console.log(curry(mul,5)(6));

//my solution to 'inc', a function that adds 1.
var inc = curryr(add,1);
console.log(inc(5));

//4 solutions to 'inc' from course
var inc1 = addf(1);
var inc2 = curry(add,1);
var inc3 = curryr(add,1);
var inc4 = liftf(add)(1);

//Break at 10am



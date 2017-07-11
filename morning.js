'use strict';
function add(x, y) {
  return x + y;
}
function sub(x, y) {
  return x - y;
}
function mul(x, y) {
  return x * y;
}
function identityf(x) {
  return function anon() {
    return x;
  }
}
function addf(x) {
  return function (y) {
    return x + y;
  };
}


function curry(passedIn, x) {
  return function anon(y) {
    return passedIn(x, y);
  }
}

function curryr(binary, x) {
  return function anonymous(y) {
    //This is just the same as above but reversed
    return binary(y, x);
  }
}

//liftf, a function which takes a two arguement function, and makes it double invokeable.
function liftf(twoArgumentFunction) {
  return function anonymousFunction(x) {
    return function secondAnonymousFunction(y) {
      return twoArgumentFunction(x, y);
    }
  }
}

//Examples of how the first functions defined work
var subAny = liftf(sub);
console.log(subAny(4)(3));
console.log(curry(mul, 5)(6));

//my solution to 'inc', a function that adds 1.
var inc = curryr(add, 1);
console.log("my solution to 'inc', a function that adds 1.");
console.log(inc(5));

//4 solutions to 'inc' from course
var inc1 = addf(1);
var inc2 = curry(add, 1);
var inc3 = curryr(add, 1);
var inc4 = liftf(add)(1);

//Break at 10am

//Twice, a function which given a function will pass one arguement given to it, to both arguements of the passed in function. i.e add(11,11) == twice(add)(11)
function twice(functionToBeRepeated) {
  return function repeat(x) {
    return functionToBeRepeated(x, x);
  }
}
var doubl = twice(add);
var squared = twice(mul);
console.log(squared(12));// 144

//Reverse, a function which reverses the arguements of a binary function 
function reverse(functionToBeReversed) {
  return function anonymousReversalFunction(x, y) {
    return functionToBeReversed(y, x);
  }
}
var reverseSub = reverse(sub);
console.log("Reverse, a function which reverses the arguements of a binary function");
console.log(reverseSub(1, 2));// 1

//Suggested by course - this is an ES6 specific thing so therefore doesn't work in IE. If it doesn't compile with node, update it to latest version!
function reverse2(func) {
  return function (...args) {
    return func(...args.reverse());
  }
}

//Composeu,  a function that takes two unary functions anrd returns a unary function that calls them both. Note, it calls the first function first, then the second function
function composeu(func1, func2) {
  return function (x) {
    return func2(func1(x));
  }
}
var doubleThenSquare = composeu(doubl, squared);
console.log("Composeu,  a function that takes two unary functions anrd returns a unary function that calls them both. Note, it calls the first function first, then the second function");
console.log(doubleThenSquare(5)); //100

//composeb, a function that takes two binary functions and returns a function that calls them both. 
function composeb(f, g) {
  return function (x, y, z) {
    return g(f(x, y), z);
  }
}
console.log("composeb, a function that takes two binary functions and returns a function that calls them both. ");
console.log(composeb(add, mul)(2, 3, 7));

//limit, a function that allows a binary function to be called a limited number of times
//Consider what you do if a user passes in a decimal.
function limit(func, limit) {
  var numberOfCalls = 0;
  return function (x, y) {
    numberOfCalls += 1;
    if (numberOfCalls <= limit) {
      return func(x, y);
    } else {
      return undefined;
    }
  }
}
//limit with a ternary instead from Steve Cusacks (A lot cleaner looking)
function limitTernary(func, limit) {
  var count = 0;
  return function (arg1, arg2) {
    return count++ < limit ? func(arg1, arg2) : undefined;
  }
}
//limit without a count variable from course
function limitWithoutACount(func, count) {
  return function (a, b) {
    return count-- < 1 ? func(a, b) : undefined;
  }
}
var add_ltd = limit(add, 1);
console.log("limit, a function that allows a binary function to be called a limited number of times");
console.log(add_ltd(1, 2));
console.log(add_ltd(1, 2));

//from factory, produces a generator that will produce a series of values
function from(x) {
  return function () {
    return x++;//You could define a more complex series in here.
  }
}
//From the course
function from2(x) {
  return function () {
    var next = number;
    number += 1;
    return next;
  }
}
var gen = from(0);
console.log("from factory, produces a generator that will produce a series of values");
console.log(gen());//0
console.log(gen());//1
console.log(gen());//2
console.log(gen());//3

// To factory, a function that takes a generator and an end value and returns a generator that will produce numbers up to that limit
function to(func, limit) {
  return function () {
    var value = func();
    return value < limit ? value : undefined;
  }
}

var gen = to(from(3), 5);
console.log("To factory, a function that takes a generator and an end value and returns a generator that will produce numbers up to that limit");
console.log(gen());//3
console.log(gen());//4
console.log(gen());//undefined

//FromTo Factory, producs a generator that will produce  values in a range
function fromto(start, end) {
  return function () {
    return start < end ? start++ : undefined;
  }
}
//Reusing previous code, Course
function fromto_course(start, end) {
  return to(from(start), end);
}

var gen = fromto_course(0, 3);
console.log("FromTo Factory, producs a generator that will produce  values in a range");
console.log(gen());//0
console.log(gen());//1
console.log(gen());//2
console.log(gen());//undefined

//11:15 break

//element factory, takes an array and a generator and returns a generator that will produce elements from the array
function element(array, generator) {
  return function () {
    var index = generator();
    return index !== undefined ? array[index] : undefined;
  }
}
var gen = element(["a", "b", "c", "d"], fromto_course(1, 3));
console.log("element factory, takes an array and a generator and returns a generator that will produce elements from the array");
console.log(gen());//b
console.log(gen());//c
console.log(gen());//undefined

//element_modified, adjusted version of element factory that has generator as optional. If generator is not provided then each of the elements of the array will be produced
function element_modified(array, generator = fromto(0, array.length)) {
  return function () {
    var index = generator();
    return index !== undefined ? array[index] : undefined;
  }
}
//Course version
function element_course(array, generator) {
  if (generator === undefined) {// I could use not typeof function to make it more resilient
    generator = fromto(0, array.length);
  }
  return function () {
    var index = generator();
    return index !== undefined ? array[index] : undefined;
  }
}
var gen = element_modified(["a", "b", "c", "d"]);
console.log("element_modified, adjusted version of element factory that has generator as optional. If generator is not provided then each of the elements of the array will be produced");
console.log(gen());//a
console.log(gen());//b
console.log(gen());//c
console.log(gen());//d
console.log(gen());//undefined

//Collect generator, a function that takes a generator and array and produces a function that will collect the result in the array
function collect(generator, array) {
  return function () {
    var value = generator();
    if (value !== undefined) {
      array.push(value);
      return value;
    }
  }
}
var array = [];
var gen = collect(fromto(0, 2), array);
console.log("Collect generator, a function that takes a generator and array and produces a function that will collect the result in the array");
console.log(gen());//0
console.log(gen());//1
console.log(gen());//undefined
console.log(array);// [0,1]

//filter factory that takes a generator and a predicate and produces a generator that produces only the values approved by the predicate
function filter(generator, predicate) {
  return function () {
    var value = generator();
    while (value !== undefined) {
      if (predicate(value)) {
        return value;
      } else {
        value = generator();
      }
    }
  }
}
function filter_courserecursion(generator, predicate) {
  return function recur() {
    var value = generator();
      if (value === undefined || predicate(value)) {
        return value;
      } else {
        return recur();
      }
  }
}
var gen = filter(fromto(0, 5), function third(value) {
  return (value % 3) === 0;
});
console.log("filter factory that takes a generator and a predicate and produces a generator that produces only the values approved by the predicate");
console.log(gen());//0
console.log(gen());//3
console.log(gen());//undefined

//concat factory, a function that takes two generator and produces a generator that combines the sequences
function concat(gen1,gen2){
  return function(){
     var value = gen1();
     if(value !== undefined){
       return value;
     } else {
       value = gen2();
       return value;
     }
  }
}
var gen = concat(fromto(0,3),fromto(0,2));
console.log("concat factory, a function that takes two generator and produces a generator that combines the sequences");
console.log(gen());//0
console.log(gen());//1
console.log(gen());//2
console.log(gen());//0
console.log(gen());//1
console.log(gen());//undefined
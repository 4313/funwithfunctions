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
function concat(gen1, gen2) {
  return function () {
    var value = gen1();
    if (value !== undefined) {
      return value;
    } else {
      value = gen2();
      return value;
    }
  }
}
var gen = concat(fromto(0, 3), fromto(0, 2));
console.log("concat factory, a function that takes two generator and produces a generator that combines the sequences");
console.log(gen());//0
console.log(gen());//1
console.log(gen());//2
console.log(gen());//0
console.log(gen());//1
console.log(gen());//undefined


//gensymf factory function that makes generators that make unique symbols.
function gensymf(seed) {
  var gen = from(1);
  return function () {// shoudl really add a check for typeof string
    return seed + gen();
  }
}
var geng = gensymf("G");
var genh = gensymf("H");
console.log("gensymf factory function that makes generators that make unique symbols.");
console.log(geng());//G1
console.log(genh());//H1
console.log(geng());//G2
console.log(genh());//H2

//Make a factory factory gensymff that takes a starting value and returns a factory
function gensymf_configurable(seed, startingValue = 1) {  //could check for undefined or type here rather than use default
  var gen = from(startingValue);
  return function () {// shoudl really add a check for typeof string
    return seed + gen();
  }
}
function gensymff(startingValue) {
  return function (seed) {
    return gensymf_configurable(seed, startingValue);
  }
}
var gensymf_new = gensymff(1);
var geng = gensymf_new("G");
var genh = gensymf_new("H");
console.log("Make a factory factory gensymff that takes a starting value and returns a factory");
console.log(geng());//G1
console.log(genh());//H1
console.log(geng());//G2
console.log(genh());//H2

//make a factory fibonaccif that returns a generator that will return the next fibnacci number
function fibonaccif(firstNumber, secondNumber) {
  var count = 0;
  return function () {
    if (count == 0) {
      count++;
      return firstNumber;
    } else if (count == 1) {
      count++;
      return secondNumber;
    } else {
      var answer = firstNumber + secondNumber;
      firstNumber = secondNumber;
      secondNumber = answer;
      count++;
      return answer;
    }
  }
}
function fibonaccif_course(a, b) {
  return function () {
    var next = a;
    a = b;
    b += next;
    return next;
  }
}
var single = composeu(identityf, curryr(limit, 1));
function fibonaccif_course2(a, b) {
  return concat(
    concat(single(a), single(b)), function fibonacci() {
      var next = a + b;
      a = b;
      b = next;
      return next;
    }
  )
}

var fib = fibonaccif(0, 1);
console.log("make a factory fibonaccif that returns a generator that will return the next fibnacci number");
console.log(fib());//0
console.log(fib());//1
console.log(fib());//1
console.log(fib());//2
console.log(fib());//3
console.log(fib());//5

//write a counter constructor that returns an object containing two functions that implement an up/down counter, hiding the counter
function counter() {
  var counter = 0;
  return {
    up: function () {
      return ++counter;
    },
    down: function () {
      return --counter;
    }
  }
}
var object = counter();
var up = object.up;
var down = object.down;
console.log("write a counter constructor that returns an object containing two functions that implement an up/down counter, hiding the counter");
console.log(up());//1
console.log(down());//0
console.log(down());//-1
console.log(up());//0

//Make a revocable constructor that takes a binary function, and returns an obkect containing an invoke function that can invoke the binary function and a revoke function that disables the invoke function
function revocable(func) {
  var invokeable = true;
  return {
    invoke: function (x, y) {
      return invokeable ? func(x, y) : undefined;
    },
    revoke: function () {
      invokeable = false;
    }
  }
}

function revocable_course(func) {
  var invokeable = true;
  return {
    invoke: function (x, y) {
      return func(x, y);
    },
    revoke: function () {
      func = undefined;
    }
  }
}
var rev = revocable(add);
var add_rev = rev.invoke;
console.log("Make a revocable constructor that takes a binary function, and returns an obkect containing an invoke function that can invoke the binary function and a revoke function that disables the invoke function");
console.log(add_rev(3, 4));//7
rev.revoke();
console.log(add_rev(5, 7));//undefined

//WRite a constructor m that takes a value and an optional source string and returns them in an object
function m(value, source) {
  return {
    value: value,
    source: (typeof source === "string") ? source : String(value)
  }
};
console.log(JSON.stringify(m(1)));
//{"value": 1}

//write a function addm that takes two m objects and returns an m object
function addm(m1, m2) {
  return m(m1.value + m2.value, "(" + m1.source + "+" + m2.source + ")");
}
console.log("write a function addm that takes two m objects and returns an m object");
console.log(JSON.stringify(addm(m(3), m(4)))); // {"value": 7, "source": "(3+4)"}
console.log(JSON.stringify(addm(m(1), m(Math.PI, "pi")))); // {"value": 4.14159, "source": (1+pi)}

//write a function liftm that takes a binary function and a string and returns a function that acts on m objects
function liftm(func, operatorRepresentation) {
  return function (x, y) {
    return m(func(x.value, y.value), "(" + x.source + operatorRepresentation + y.source + ")");
  }
}
console.log("write a function liftm that takes a binary function and a string and returns a function that acts on m objects")
var addmObj = liftm(add, "+");
console.log(JSON.stringify(addmObj(m(3), m(4)))); // {"value": 7, "source": "(3+4)"}
var mulmObj = liftm(mul, "*");
console.log(JSON.stringify(mulmObj(m(3), m(4)))); // {"value": 12, "source": "(3*4)"}

//modify liftm so that the functions it produces can accept arguments that are either numbers or m objects
function liftm_modified(func, operatorRepresentation) {
  return function (x, y) {
    if (typeof x === "number") {
      x = new m(x);
    }
    if (typeof y === "number") {
      y = new m(y);
    }

    return m(func(x.value, y.value), "(" + x.source + operatorRepresentation + y.source + ")");
  }
}
console.log("modify liftm so that the functions it produces can accept arguments that are either numbers or m objects")
var addmObj = liftm_modified(add, "+");
console.log(JSON.stringify(addmObj(3, 4))); // {"value": 7, "source": "(3+4)"}
var mulmObj = liftm_modified(mul, "*");
console.log(JSON.stringify(mulmObj(m(3), m(4)))); // {"value": 12, "source": "(3*4)"}

//Make a function continuize that takes a unary function, and returns a function that takes a callback and an argument
function continuize(func) {
  return function (callback, ...arg) {
    return callback(func(...arg));
  }
}
console.log("Make a function continuize that takes a unary function, and returns a function that takes a callback and an argument");
var sqrtc = continuize(Math.sqrt);
sqrtc(console.log, 81);

//allowing order of constructor args to be variable. ES6
function constructor(spec) {
  let { member } = spec; // this intializes a variable in the object with the same name. This lets you intialize objects with your own order
  const { other } = other_constructor(spec); // This just gets us the method we want, rather than everything.
  const method = function () {
    //spec, member, other, method
  };
  return Object.freeze({
    method,
    other
  }); //Immutable object. We are allowed to only state variable name and it creates a field with that name and value
}
//Advocates objects with only data, and objects with only functions.
//Should pass in an object with all of the data changes in one go, rather individual getters and setters
//functional programming is where the future is. The classical model is very brittle when dealing with concurrency and parallelism

//Security
//make an array wrapper object with methods get, store, append such that an attacler cannot get access to the private array
function vector() {
  var array = [];

  return {
    get: function get(i) {
      return array[i];
    },
    store: function store(i, v) {
      array[i] = v;
    },
    append: function append(v) {
      array.push(v);
    }
  }
}

var myvector = vector();
myvector.append(7);
myvector.store(1, 5);


//Attack consists of replacing push
var stash;
myvector.store("push", function () {
  stash = this;
});
myvector.append(); //stash is array
//'this' word is evil. He advocates getting rid of it, its built upon confusion. It's the only dynamic variable in a language of static ones. It causes security flaws.
//Fix it:
function vector_secure() {
  var array = [];

  return {
    get: function get(i) {
      return array[+i];//the plus forces it into an integer, no strings allowed
    },
    store: function store(i, v) {
      array[+i] = v;
    },
    apped: function append(v) {
      array[array.length] = v;//stops the renaming push problem
    }
  }
}

//Another one
//Make a function that makes a publish/subscribe object. it will reliably deliver all publications to all subscribers in the right order

var my_pubsub = pubsub();
function log(name) {
  return {
    name:name,
    publish:function(message){
      console.log(message);
    }
  }
}
my_pubsub.subscribe(log());
my_pubsub.subscribe(log());
my_pubsub.subscribe(log());

my_pubsub.publish("it works");

function pubsub() {
  var subscribers = [];
  return {
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      var i;
      var length = subscribers.length;
      for (i = 0; i < length; i += 1) {
        subscribers[i].publish(publication);
      }
    }
  };
}
//stop people from getting messages. no-one after this will get any messages because it causes an exception.
my_pubsub.subscribe(undefined);

//fix it with a try catch
function pubsub_trycatch() {
  var subscribers = [];
  return {
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      var i;
      var length = subscribers.length;
      for (i = 0; i < length; i += 1) {
        try {
          subscribers[i](publication);
        } catch (ignore) { }
      }
    }
  };
}
//my_pubsub.publish = undefined
//use object.freeze, so you can't replace functions
function pubsub_frozen() {
  var subscribers = [];
  return Object.freeze({
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      var i;
      var length = subscribers.length;
      for (i = 0; i < length; i += 1) {
        try {
          subscribers[i](publication);
        } catch (ignore) { }
      }
    }
  });
}
//my_pubsub.subscribe(function () { this.length = 0}); mess with this.length etc
//fixed with:
function pubsub_foreach() {
  var subscribers = [];
  return Object.freeze({
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      subscribers.forEach(function (s) {
        try {
          s(publication);
        } catch (ignore) { }
      });
    }
  });
}
//make a subscriber call publish
my_pubsub.subscribe(limit(function () {
  my_pubsub.publish("Out of order")
}), 1);

function pubsub_timeout() {
  var subscribers = [];
  return Object.freeze({
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      subscribers.forEach(function (s) {
        try {
          setTimeout(function(){
            s(publication);
          },0);
        } catch (ignore) { }
      });
    }
  });
}
//Returns a number that can be used to workout where things are in the queue

//http://www.crockford.com/pp/problems.pptx

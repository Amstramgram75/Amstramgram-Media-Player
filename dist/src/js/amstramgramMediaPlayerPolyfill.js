(function () {
  'use strict';
  (function(){
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
    if (typeof Object.assign !== 'function') {
      // Must be writable: true, enumerable: false, configurable: true
      Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
          if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
    
          var to = Object(target);
    
          for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
    
            if (nextSource !== null && nextSource !== undefined) { 
              for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true
      });
    }
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#polyfill
    // Production steps of ECMA-262, Edition 6, 22.1.2.1
    if (!Array.from) {
      Array.from = (function () {
          var symbolIterator;
          try {
              symbolIterator = Symbol.iterator
                  ? Symbol.iterator
                  : 'Symbol(Symbol.iterator)';
          } catch (e) {
              symbolIterator = 'Symbol(Symbol.iterator)';
          }

          var toStr = Object.prototype.toString;
          var isCallable = function (fn) {
              return (
                  typeof fn === 'function' ||
                  toStr.call(fn) === '[object Function]'
              );
          };
          var toInteger = function (value) {
              var number = Number(value);
              if (isNaN(number)) return 0;
              if (number === 0 || !isFinite(number)) return number;
              return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
          };
          var maxSafeInteger = Math.pow(2, 53) - 1;
          var toLength = function (value) {
              var len = toInteger(value);
              return Math.min(Math.max(len, 0), maxSafeInteger);
          };

          var setGetItemHandler = function setGetItemHandler(isIterator, items) {
              var iterator = isIterator && items[symbolIterator]();
              return function getItem(k) {
                  return isIterator ? iterator.next() : items[k];
              };
          };

          var getArray = function getArray(
              T,
              A,
              len,
              getItem,
              isIterator,
              mapFn
          ) {
              // 16. Let k be 0.
              var k = 0;

              // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
              while (k < len || isIterator) {
                  var item = getItem(k);
                  var kValue = isIterator ? item.value : item;

                  if (isIterator && item.done) {
                      return A;
                  } else {
                      if (mapFn) {
                          A[k] =
                              typeof T === 'undefined'
                                  ? mapFn(kValue, k)
                                  : mapFn.call(T, kValue, k);
                      } else {
                          A[k] = kValue;
                      }
                  }
                  k += 1;
              }

              if (isIterator) {
                  throw new TypeError(
                      'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
                  );
              } else {
                  A.length = len;
              }

              return A;
          };

          // The length property of the from method is 1.
          return function from(arrayLikeOrIterator /*, mapFn, thisArg */) {
              // 1. Let C be the this value.
              var C = this;

              // 2. Let items be ToObject(arrayLikeOrIterator).
              var items = Object(arrayLikeOrIterator);
              var isIterator = isCallable(items[symbolIterator]);

              // 3. ReturnIfAbrupt(items).
              if (arrayLikeOrIterator == null && !isIterator) {
                  throw new TypeError(
                      'Array.from requires an array-like object or iterator - not null or undefined'
                  );
              }

              // 4. If mapfn is undefined, then let mapping be false.
              var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
              var T;
              if (typeof mapFn !== 'undefined') {
                  // 5. else
                  // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                  if (!isCallable(mapFn)) {
                      throw new TypeError(
                          'Array.from: when provided, the second argument must be a function'
                      );
                  }

                  // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                  if (arguments.length > 2) {
                      T = arguments[2];
                  }
              }

              // 10. Let lenValue be Get(items, "length").
              // 11. Let len be ToLength(lenValue).
              var len = toLength(items.length);

              // 13. If IsConstructor(C) is true, then
              // 13. a. Let A be the result of calling the [[Construct]] internal method
              // of C with an argument list containing the single item len.
              // 14. a. Else, Let A be ArrayCreate(len).
              var A = isCallable(C) ? Object(new C(len)) : new Array(len);

              return getArray(
                  T,
                  A,
                  len,
                  setGetItemHandler(isIterator, items),
                  isIterator,
                  mapFn
              );
          };
      })();
    }
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          // 1. Let O be ? ToObject(this value).
          var o = Object(this);

          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = o.length >>> 0;

          // 3. If len is 0, return false.
          if (len === 0) {
            return false;
          }

          // 4. Let n be ? ToInteger(fromIndex).
          //    (If fromIndex is undefined, this step produces the value 0.)
          var n = fromIndex | 0;

          // 5. If n ≥ 0, then
          //  a. Let k be n.
          // 6. Else n < 0,
          //  a. Let k be len + n.
          //  b. If k < 0, let k be 0.
          var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

          function sameValueZero(x, y) {
            return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
          }

          // 7. Repeat, while k < len
          while (k < len) {
            // a. Let elementK be the result of ? Get(O, ! ToString(k)).
            // b. If SameValueZero(searchElement, elementK) is true, return true.
            if (sameValueZero(o[k], searchElement)) {
              return true;
            }
            // c. Increase k by 1. 
            k++;
          }

          // 8. Return false
          return false;
        }
      });
    }
    //A polyfill for IE11 or browsers that have a WeakMap, but not a WeakSet.
    //https://github.com/ungap/weakset/blob/master/cjs/index.js
    (function (WeakMap) {
      var all = new WeakMap;
      var proto = WeakSet.prototype;
      proto.add = function (value) {
        return all.get(this).set(value, 1), this;
      };
      proto.delete = function (value) {
        return all.get(this).delete(value);
      };
      proto.has = function (value) {
        return all.get(this).has(value);
      };
      window.WeakSet = WeakSet;
      function WeakSet(iterable) {
        'use strict';
        all.set(this, new WeakMap);
        if (iterable)
          iterable.forEach(this.add, this);
      }
    }(WeakMap));
    // Create Element.remove() function if not exist
    if (!('remove' in Element.prototype)) {
      Element.prototype.remove = function() {
          if (this.parentNode) {
              this.parentNode.removeChild(this);
          }
      };
    }
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw TypeError('"this" is null or not defined');
          }

          var o = Object(this);

          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = o.length >>> 0;

          // 3. If IsCallable(predicate) is false, throw a TypeError exception.
          if (typeof predicate !== 'function') {
            throw TypeError('predicate must be a function');
          }

          // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
          var thisArg = arguments[1];

          // 5. Let k be 0.
          var k = 0;

          // 6. Repeat, while k < len
          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
              return kValue;
            }
            // e. Increase k by 1.
            k++;
          }

          // 7. Return undefined.
          return undefined;
        },
        configurable: true,
        writable: true
      });
    }
    //https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    if (typeof window.CustomEvent !== "function") {
      function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
       }
      window.CustomEvent = CustomEvent;
    }
  })();
}());

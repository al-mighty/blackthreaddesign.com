(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var bind = createCommonjsModule(function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function bind(element, event, callback, useCapture) {
    element.addEventListener(event, callback, useCapture);
  }

  exports.default = bind;
});

var bind$1 = interopDefault(bind);

var require$$0 = Object.freeze({
	default: bind$1
});

var html = createCommonjsModule(function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appendChild = exports.show = exports.hide = exports.getOverlayBox = exports.createSpinnerWrapper = exports.createSpinner = exports.createOverlayBox = exports.createFrame = exports.createNextButton = exports.createPreviousButton = undefined;

  var _bind = interopDefault(require$$0);

  var _bind2 = _interopRequireDefault(_bind);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  var box = 'avalonbox';

  function createPreviousButton(doc) {
    var prev = doc.createElement('button');
    prev.id = box + '-prev';
    prev.className = box + '-move-button ' + box + '-prev-button';
    prev.innerHTML = "&lt";
    prev.type = "button";
    return prev;
  }

  function createNextButton(doc) {
    var next = doc.createElement('button');
    next.id = box + '-next';
    next.className = box + '-move-button ' + box + '-next-button';
    next.innerHTML = "&gt";
    next.type = "button";
    return next;
  }

  function createSpinner(doc) {
    var spinner = doc.createElement('div');
    spinner.id = box + '-spinner';
    spinner.className = box + '-spinner';

    return spinner;
  }

  function createSpinnerWrapper(doc) {
    var wrapper = doc.createElement('div');
    wrapper.id = box + '-spinner-wrapper';
    wrapper.className = box + '-spinner-wrapper';

    return wrapper;
  }

  function createFrame(doc) {
    var frame = doc.createElement('div');
    frame.id = box + '-frame';
    frame.className = box + '-frame';

    var image = doc.createElement('img');
    image.className = box + '-frame-image';
    image.id = box + '-frame-image';

    var link = doc.createElement('a');
    link.appendChild(image);

    (0, _bind2.default)(link, 'click', function (e) {
      e.preventDefault();
    });

    frame.appendChild(link);
    return { container: frame, image: image, link: link };
  }

  function createOverlayBox(doc) {
    var overlay = doc.createElement('div');
    overlay.className = box + '-overlay';
    overlay.id = box + '-overlay';
    return overlay;
  }

  function getOverlayBox(doc) {
    var overlay = doc.getElementById(box + '-overlay');
    return overlay;
  }

  function hide(el) {
    el.className = el.className.replace(' ' + box + '-hide', '') + (' ' + box + '-hide');
  }

  function show(el) {
    el.className = el.className.replace(' ' + box + '-hide', '');
  }

  function appendChild(doc, el) {
    doc.getElementsByTagName('body')[0].appendChild(el);
  }

  exports.createPreviousButton = createPreviousButton;
  exports.createNextButton = createNextButton;
  exports.createFrame = createFrame;
  exports.createOverlayBox = createOverlayBox;
  exports.createSpinner = createSpinner;
  exports.createSpinnerWrapper = createSpinnerWrapper;
  exports.getOverlayBox = getOverlayBox;
  exports.hide = hide;
  exports.show = show;
  exports.appendChild = appendChild;
});

var html$1 = interopDefault(html);
var appendChild = html.appendChild;
var show = html.show;
var hide = html.hide;
var getOverlayBox = html.getOverlayBox;
var createSpinnerWrapper = html.createSpinnerWrapper;
var createSpinner = html.createSpinner;
var createOverlayBox = html.createOverlayBox;
var createFrame = html.createFrame;
var createNextButton = html.createNextButton;
var createPreviousButton = html.createPreviousButton;

var require$$1 = Object.freeze({
	default: html$1,
	appendChild: appendChild,
	show: show,
	hide: hide,
	getOverlayBox: getOverlayBox,
	createSpinnerWrapper: createSpinnerWrapper,
	createSpinner: createSpinner,
	createOverlayBox: createOverlayBox,
	createFrame: createFrame,
	createNextButton: createNextButton,
	createPreviousButton: createPreviousButton
});

var avalonbox = createCommonjsModule(function (module) {
  var _html = interopDefault(require$$1);

  var html = _interopRequireWildcard(_html);

  var _bind = interopDefault(require$$0);

  var _bind2 = _interopRequireDefault(_bind);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    return newObj;
  }

  var Avalonbox = function () {
    var doc = document;
    var buttons = {};
    var overlay = html.createOverlayBox(doc);
    var frame = html.createFrame(doc);
    var spinner = html.createSpinner(doc);
    var spinnerWrapper = html.createSpinnerWrapper(doc);
    var downloadImage = new Image();

    var active = void 0;
    var currentLink = void 0;

    initialize();

    function initialize() {
      active = false;
      html.hide(overlay);
      html.appendChild(doc, overlay);
      buttons.prev = html.createPreviousButton(doc);
      buttons.next = html.createNextButton(doc);
      spinnerWrapper.appendChild(spinner);
      overlay.appendChild(frame.container);
      overlay.appendChild(spinnerWrapper);
      overlay.appendChild(buttons.prev);
      overlay.appendChild(buttons.next);

      (0, _bind2.default)(overlay, 'click', hideOverlay);
      (0, _bind2.default)(buttons.prev, 'click', previous);
      (0, _bind2.default)(buttons.next, 'click', next);
      (0, _bind2.default)(doc, 'keydown', keyPressHandler);
    }

    function hideOverlay(e) {
      var f = frame.container;
      if (f === e.target || !f.contains(e.target)) {
        cleanFrame();
      }
    }

    function cleanFrame() {
      html.hide(overlay);
      frame.image.src = '';
      active = false;
    }

    function showOverlay(e) {
      e.preventDefault();

      active = true;
      html.show(overlay);
      currentLink = e.target.parentNode;

      loadImage();

      if (single(currentLink.parentNode.id)) {
        html.hide(buttons.prev);
        html.hide(buttons.next);
      } else {
        if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName === 'A') {
          html.show(buttons.prev);
        } else {
          html.hide(buttons.prev);
        }

        if (currentLink.nextElementSibling && currentLink.nextElementSibling.tagName === 'A') {
          html.show(buttons.next);
        } else {
          html.hide(buttons.next);
        }
      }
    }

    function next(e) {
      html.show(buttons.prev);
      if (currentLink.nextElementSibling && currentLink.nextElementSibling.tagName === 'A') {
        currentLink = currentLink.nextElementSibling;
        loadImage();
        if (currentLink.previousElementSibling && currentLink.nextElementSibling.tagName !== 'A') {
          html.hide(buttons.next);
        }
      }

      e.stopPropagation();
    }

    function previous(e) {
      html.show(buttons.next);
      if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName === 'A') {
        currentLink = currentLink.previousElementSibling;
        loadImage();
        if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName !== 'A') {
          html.hide(buttons.prev);
        }
      }

      e.stopPropagation();
    }

    function loadImage() {
      frame.image.src = '';
      html.hide(frame.image);
      html.show(spinner);
      downloadImage.onload = function () {
        html.show(frame.image);
        frame.image.src = this.src;
        html.hide(spinner);
      };

      downloadImage.src = currentLink.getAttribute('href');
      frame.link.href = currentLink.getAttribute('href');
    }

    // TODO: Swap [].slice for Array.from (ES6)
    // Need to test in IE9
    function single(query) {
      var links = doc.getElementById(query).getElementsByTagName('a');
      return [].slice.call(links).length == 1;
    }

    function run(query) {
      eventHandlers(query);
    }

    function eventHandlers(query) {
      var links = document.getElementById(query).getElementsByTagName('a');
      links = [].slice.call(links);
      links.forEach(function (link) {
        (0, _bind2.default)(link, 'click', showOverlay);
      });
    }

    function keyPressHandler(e) {
      e = e || window.event;

      if (!active) {
        return;
      }

      if (e.keyCode == '37') {
        previous(e);
      } else if (e.keyCode == '39') {
        next(e);
      } else if (e.key == 'Escape') {
        hideOverlay(e);
      }
    }

    return { run: run };
  }();

  module.exports = Avalonbox;
});

var avalonbox$1 = interopDefault(avalonbox);

var utilities = createCommonjsModule(function (module, exports) {
  //Simple uuid function
  var uuid = function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  };

  exports.uuid = uuid;
});

var uuid = utilities.uuid;

document.querySelectorAll('.gallery').forEach(function (gallery) {
  if (!gallery.id) gallery.id = uuid();
  avalonbox$1.run(gallery.id);
});

document.querySelectorAll('.lightbox').forEach(function (image) {
  if (!image.id) image.id = uuid();
  avalonbox$1.run(image.id);
});

var greedyNav = createCommonjsModule(function (module) {
  var Greedy = function Greedy(options) {
    this.element = document.querySelector(options.element);
    this.counter = options.counter || false;
    this.visibleLinks = this.element.querySelector('.visible-links');
    this.toggleButton = this.element.querySelector('.toggle-links');
    this.breakpoints = [];
    this.init();
  };

  window.Greedy = Greedy;

  Greedy.prototype.init = function () {
    this.setupMenu();
    this.calculateBreakpoints();
    this.updateMenu();
    this.addBindings();
  };

  /*
    Creates/returns a method bounded with 'this'. Used for creating
    named event listeners that can easily be removed
  */
  Greedy.prototype.bindMethod = function (name) {
    return this['_' + name + '_'] || Object.defineProperty(this, '_' + name + '_', { value: this[name].bind(this) })['_' + name + '_'];
  };

  /*
    Creates the necessary markup and adds the necessary classes
  */
  Greedy.prototype.setupMenu = function () {
    this.hiddenLinks = document.createElement('ul');
    this.hiddenLinks.classList.add('hidden-links');
    this.hiddenLinks.classList.add('links-invisible');
    this.element.appendChild(this.hiddenLinks);
    this.visibleLinks.classList.add('visible-links');

    if (this.counter) {
      this.toggleButton.classList.add('counter');
    } else {
      this.toggleButton.classList.add('no-counter');
    }
  };

  /*
    For each navigation item, calculate how much space is needed
    to accomodate it
  */
  Greedy.prototype.calculateBreakpoints = function () {
    var childrenWidth = 0;

    for (var i = 0; i < this.visibleLinks.children.length; i++) {
      childrenWidth += this.visibleLinks.children[i].offsetWidth;
      this.breakpoints[i] = childrenWidth;
    }
  };

  Greedy.prototype.addBindings = function () {
    window.addEventListener('resize', this.bindMethod('updateMenu'));
    this.toggleButton.addEventListener('click', this.bindMethod('toggleHiddenLinks'));
  };

  Greedy.prototype.updateMenu = function () {
    var availableSpace = this.element.offsetWidth - this.toggleButton.offsetWidth;
    var itemsVisible = this.visibleLinks.children.length;
    var requiredSpace = this.breakpoints[itemsVisible - 1];

    /*
      Check if there is not enough space for the visible links or
      if there is space available for the hidden link
    */
    if (availableSpace < this.breakpoints[itemsVisible - 1]) {
      this.toggleButton.classList.remove('hidden');

      while (availableSpace < this.breakpoints[itemsVisible - 1]) {
        this.hiddenLinks.insertBefore(this.visibleLinks.children[itemsVisible - 1], this.hiddenLinks.firstChild);
        itemsVisible--;
      }
    } else if (availableSpace > this.breakpoints[itemsVisible]) {
      while (availableSpace > this.breakpoints[itemsVisible]) {
        this.visibleLinks.appendChild(this.hiddenLinks.removeChild(this.hiddenLinks.firstChild));
        itemsVisible++;
      }
    }

    if (this.counter) {
      this.toggleButton.setAttribute('data-count', this.hiddenLinks.children.length);
      if (!this.hiddenLinks.children.length) {
        this.toggleButton.classList.add('hidden');
      }
    }
  };

  Greedy.prototype.toggleHiddenLinks = function () {
    this.hiddenLinks.classList.toggle('links-invisible');
    this.toggleButton.classList.toggle('links-displayed');
  };

  module.exports = Greedy;
});

var Greedy = interopDefault(greedyNav);

var menu = new Greedy({
  element: '.greedy-nav',
  counter: false
});

// Robert Penner's easeInOutQuad

// find the rest of his easing functions here: http://robertpenner.com/easing/
// find them exported for ES6 consumption here: https://github.com/jaxgeller/ez.js

var easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

var jumper = function () {
  // private variable cache
  // no variables are created during a jump, preventing memory leaks

  var element = void 0; // element to scroll to                   (node)

  var start = void 0; // where scroll starts                    (px)
  var stop = void 0; // where scroll stops                     (px)

  var offset = void 0; // adjustment from the stop position      (px)
  var easing = void 0; // easing function                        (function)
  var a11y = void 0; // accessibility support flag             (boolean)

  var distance = void 0; // distance of scroll                     (px)
  var duration = void 0; // scroll duration                        (ms)

  var timeStart = void 0; // time scroll started                    (ms)
  var timeElapsed = void 0; // time spent scrolling thus far          (ms)

  var next = void 0; // next scroll position                   (px)

  var callback = void 0; // to call when done scrolling            (function)

  // scroll position helper

  function location() {
    return window.scrollY || window.pageYOffset;
  }

  // element offset helper

  function top(element) {
    return element.getBoundingClientRect().top + start;
  }

  // rAF loop helper

  function loop(timeCurrent) {
    // store time scroll started, if not started already
    if (!timeStart) {
      timeStart = timeCurrent;
    }

    // determine time spent scrolling so far
    timeElapsed = timeCurrent - timeStart;

    // calculate next scroll position
    next = easing(timeElapsed, start, distance, duration);

    // scroll to it
    window.scrollTo(0, next);

    // check progress
    timeElapsed < duration ? window.requestAnimationFrame(loop) // continue scroll loop
    : done(); // scrolling is done
  }

  // scroll finished helper

  function done() {
    // account for rAF time rounding inaccuracies
    window.scrollTo(0, start + distance);

    // if scrolling to an element, and accessibility is enabled
    if (element && a11y) {
      // add tabindex indicating programmatic focus
      element.setAttribute('tabindex', '-1');

      // focus the element
      element.focus();
    }

    // if it exists, fire the callback
    if (typeof callback === 'function') {
      callback();
    }

    // reset time for next jump
    timeStart = false;
  }

  // API

  function jump(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // resolve options, or use defaults
    duration = options.duration || 1000;
    offset = options.offset || 0;
    callback = options.callback; // "undefined" is a suitable default, and won't be called
    easing = options.easing || easeInOutQuad;
    a11y = options.a11y || false;

    // cache starting position
    start = location();

    // resolve target
    switch (typeof target) {
      // scroll from current position
      case 'number':
        element = undefined; // no element to scroll to
        a11y = false; // make sure accessibility is off
        stop = start + target;
        break;

      // scroll to element (node)
      // bounding rect is relative to the viewport
      case 'object':
        element = target;
        stop = top(element);
        break;

      // scroll to element (selector)
      // bounding rect is relative to the viewport
      case 'string':
        element = document.querySelector(target);
        stop = top(element);
        break;
    }

    // resolve scroll distance, accounting for offset
    distance = stop - start + offset;

    // resolve duration
    switch (typeof options.duration) {
      // number in ms
      case 'number':
        duration = options.duration;
        break;

      // function passed the distance of the scroll
      case 'function':
        duration = options.duration(distance);
        break;
    }

    // start the loop
    window.requestAnimationFrame(loop);
  }

  // expose only the jump method
  return jump;
};

// export singleton

var singleton = jumper();

var links = document.querySelectorAll('a');

//Filename of current page
var fileName = location.href.split("/").pop().split("#")[0];

links.forEach(function (a) {
  //check if it's a link to another location on the page
  if (~a.href.indexOf(fileName + '#')) {
    var link = '#' + a.href.split('#').pop();
    a.onclick = function () {
      return singleton(link);
    };
  }
});

var index = createCommonjsModule(function (module) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;
});

var throttle = interopDefault(index);

function outerHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

// Sticky footer
var setBodyMargin = function setBodyMargin() {
  var height = outerHeight(document.querySelector('.page__footer'));
  document.querySelector('body').style.marginBottom = height + 'px';
};

setBodyMargin();

window.addEventListener('resize', throttle(setBodyMargin, 250));

var fluidVids = createCommonjsModule(function (module) {
  var fluidvids = {
    selector: ['iframe', 'object'],
    players: ['www.youtube.com', 'player.vimeo.com']
  };

  var css = ['.fluidvids {', 'width: 100%; max-width: 100%;', '}', '.fluidvids-item {', 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;', '}'].join('');

  var head = document.head || document.getElementsByTagName('head')[0];

  function matches(src) {
    return new RegExp('^(https?:)?\/\/(?:' + fluidvids.players.join('|') + ').*$', 'i').test(src);
  }

  function getRatio(height, width) {
    return parseInt(height, 10) / parseInt(width, 10) * 100 + '%';
  }

  function fluid(elem) {
    if (!matches(elem.src) && !matches(elem.data) || !!elem.getAttribute('data-fluidvids')) {
      return;
    }
    var wrap = document.createElement('div');
    elem.parentNode.insertBefore(wrap, elem);
    elem.className += (elem.className ? ' ' : '') + 'fluidvids-item';
    elem.setAttribute('data-fluidvids', 'loaded');
    wrap.className += 'fluidvids';
    wrap.style.paddingTop = getRatio(elem.height, elem.width);
    wrap.appendChild(elem);
  }

  function addStyles() {
    var div = document.createElement('div');
    div.innerHTML = '<p>x</p><style>' + css + '</style>';
    head.appendChild(div.childNodes[1]);
  }

  fluidvids.render = function () {
    var nodes = document.querySelectorAll(fluidvids.selector.join());
    var i = nodes.length;
    while (i--) {
      fluid(nodes[i]);
    }
  };

  fluidvids.init = function (obj) {
    for (var key in obj) {
      fluidvids[key] = obj[key];
    }
    fluidvids.render();
    addStyles();
  };

  module.exports = fluidvids;
});

var fluidvids = interopDefault(fluidVids);

fluidvids.init({
  selector: ['iframe', 'object'], // runs querySelectorAll()
  players: ['www.youtube.com', 'player.vimeo.com'] });

}());

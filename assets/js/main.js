(function () {
'use strict';

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
    'use strict';

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
        } else {
            var newObj = {};
            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }
            newObj.default = obj;
            return newObj;
        }
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
            if (f === e.target || !f.contains(e.target)) cleanFrame();
        }

        function cleanFrame() {
            html.hide(overlay);
            frame.image.src = "";
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
                if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName === "A") html.show(buttons.prev);else html.hide(buttons.prev);

                if (currentLink.nextElementSibling && currentLink.nextElementSibling.tagName === "A") html.show(buttons.next);else html.hide(buttons.next);
            }
        }

        function next(e) {
            html.show(buttons.prev);
            if (currentLink.nextElementSibling && currentLink.nextElementSibling.tagName === "A") {
                currentLink = currentLink.nextElementSibling;
                loadImage();
                if (currentLink.nextElementSibling.tagName !== "A") html.hide(buttons.next);
            }

            e.stopPropagation();
        }

        function previous(e) {
            html.show(buttons.next);
            if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName === "A") {
                currentLink = currentLink.previousElementSibling;
                loadImage();
                if (currentLink.previousElementSibling.tagName !== "A") html.hide(buttons.prev);
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

            if (!active) return;

            if (e.keyCode == '37') previous(e);else if (e.keyCode == '39') next(e);
        }

        return { run: run };
    }();

    module.exports = Avalonbox;
});

var avalonbox$1 = interopDefault(avalonbox);

avalonbox$1.run('image-gallery');

fluidvids.init({
  selector: ['iframe', 'object'], // runs querySelectorAll()
  players: ['www.youtube.com', 'player.vimeo.com'] });

// equivalent to jQuery outerHeight( true )
function outerHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

// Sticky footer
var bumpIt = function bumpIt() {
  var height = outerHeight(document.querySelector('.page__footer'));
  document.querySelector('body').style.marginBottom = height + 'px';
};

var didResize = false;

bumpIt();

var onResize = function onResize() {
  didResize = true;
};

window.addEventListener('resize', onResize);

setInterval(function () {
  if (didResize) {
    didResize = false;
    bumpIt();
  }
}, 250);

// Initialise menu
var menu = new Greedy({
  element: '.greedy-nav',
  counter: false
});

}());

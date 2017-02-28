'use strict';

var _html = require('./html');

var html = _interopRequireWildcard(_html);

var _bind = require('./bind');

var _bind2 = _interopRequireDefault(_bind);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule
        ? obj
        : {
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
                if (Object.prototype.hasOwnProperty.call(obj, key))
                    newObj[key] = obj[key];
                }
            }
        newObj.default = obj;
        return newObj;
    }
}

var Avalonbox = function() {
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
        if (f === e.target || !f.contains(e.target))
            cleanFrame();
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
            if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName === "A")
                html.show(buttons.prev);
            else
                html.hide(buttons.prev);

            if (currentLink.nextElementSibling && currentLink.nextElementSibling.tagName === "A")
                html.show(buttons.next);
            else
                html.hide(buttons.next);
            }
        }

    function next(e) {
        html.show(buttons.prev);
        if (currentLink.nextElementSibling && currentLink.nextElementSibling.tagName === "A") {
            currentLink = currentLink.nextElementSibling;
            loadImage();
            if (currentLink.nextElementSibling.tagName !== "A")
                html.hide(buttons.next);
            }

        e.stopPropagation();
    }

    function previous(e) {
        html.show(buttons.next);
        if (currentLink.previousElementSibling && currentLink.previousElementSibling.tagName === "A") {
            currentLink = currentLink.previousElementSibling;
            loadImage();
            if (currentLink.previousElementSibling.tagName !== "A")
                html.hide(buttons.prev);
            }

        e.stopPropagation();
    }

    function loadImage() {
        frame.image.src = '';
        html.hide(frame.image);
        html.show(spinner);
        downloadImage.onload = function() {
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
        links.forEach(function(link) {
            (0, _bind2.default)(link, 'click', showOverlay);
        });
    }

    function keyPressHandler(e) {
        e = e || window.event;

        if (!active)
            return;

        if (e.keyCode == '37')
            previous(e);
        else if (e.keyCode == '39')
            next(e);
        }

    return {run: run};
}();

module.exports = Avalonbox;

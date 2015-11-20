module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/**
	 * @method computedProperty
	 * @param {HTMLElement} element
	 * @return {Function}
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.transform = transform;
	var computedProperty = function computedProperty(element) {
	    return function (property) {
	        var coerceFn = arguments.length <= 1 || arguments[1] === undefined ? parseFloat : arguments[1];

	        return (coerceFn || function (x) {
	            return x;
	        })(getComputedStyle(element).getPropertyValue(property), 10);
	    };
	};

	/**
	 * @method transform
	 * @param {HTMLElement} img
	 * @param {String} [src]
	 * @param {String} [text]
	 * @param {Number} [paddingLeft]
	 * @param {Number} [paddingRight]
	 * @param {Number} [paddingTop]
	 * @return {Promise}
	 */

	function transform(img) {
	    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var src = _ref.src;
	    var text = _ref.text;
	    var _ref$paddingLeft = _ref.paddingLeft;
	    var paddingLeft = _ref$paddingLeft === undefined ? 0 : _ref$paddingLeft;
	    var _ref$paddingRight = _ref.paddingRight;
	    var paddingRight = _ref$paddingRight === undefined ? 0 : _ref$paddingRight;
	    var _ref$paddingTop = _ref.paddingTop;
	    var paddingTop = _ref$paddingTop === undefined ? 0 : _ref$paddingTop;

	    var computed = computedProperty(img);
	    var height = computed('height');
	    var width = computed('width');

	    if (height === 0 || width === 0) {
	        throw new Error('Photomask: Image MUST have a fixed height and width.');
	    }

	    var fontFamily = computed('font-family', null);

	    /**
	     * Recursively computes the ideal font-size, which can be perfected using the padding
	     * properties via CSS.
	     *
	     * @property fontSize
	     * @type {Number}
	     */
	    var fontSize = (function computeFontSize(_x3, _x4) {
	        var _again = true;

	        _function: while (_again) {
	            var size = _x3,
	                widthConstraint = _x4;
	            _again = false;

	            var canvas = document.createElement('canvas');
	            var context = canvas.getContext('2d');
	            context.font = size + 'px ' + fontFamily;

	            if (context.measureText(text).width <= widthConstraint) {
	                return size;
	            }

	            _x3 = size - 1;
	            _x4 = widthConstraint;
	            _again = true;
	            canvas = context = undefined;
	            continue _function;
	        }
	    })(500, width - (paddingLeft + paddingRight));

	    var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"\n                      preserveAspectRatio="xMidYMid meet" viewBox="0 0 ' + width + ' ' + height + '">\n                    <defs>\n                        <mask id="mask" maskUnits="userSpaceOnUse" width="' + width + '" height="' + height + '" x="0" y="0" />\n                        <text id="photomask" x="' + width / 2 + '" y="' + (height / 2 + paddingTop) + '" fill="white"\n                              font-size="' + fontSize + '" font-family="' + fontFamily + '"\n                              alignment-baseline="central" text-anchor="middle">\n                            ' + text + '\n                        </text>\n                    </defs>\n                    <use xlink:href="#photomask" />\n                 </svg>';

	    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
	    var data = 'data:image/svg+xml;base64,' + btoa(svg);

	    img.setAttribute('style', '\n        padding: 0;\n        background-image: url(' + src + ');\n        background-size: cover;\n        -webkit-mask-image: url(' + data + ');\n        mask: url(' + data + '#mask)');
	}

	/**
	 * @method readAttributes
	 * @param {Element} element
	 * @return {Object}
	 */
	function readAttributes(element) {

	    var computed = computedProperty(element);
	    var paddingLeft = computed('padding-left');
	    var paddingRight = computed('padding-right');
	    var paddingTop = computed('padding-top');

	    return {
	        text: element.getAttribute('alt'),
	        src: element.getAttribute('src'),
	        paddingLeft: paddingLeft, paddingRight: paddingRight, paddingTop: paddingTop
	    };
	}

	document.registerElement('x-photomask', {

	    /**
	     * @property extends
	     * @type {String}
	     */
	    'extends': 'img',

	    /**
	     * @property prototype
	     * @type {Object}
	     * @return {void}
	     */
	    prototype: Object.create(HTMLImageElement.prototype, {

	        /**
	         * @property attachedCallback
	         * @type {Object}
	         */
	        attachedCallback: { value: function attachedCallback() {
	                transform(this, readAttributes(this));
	            } }

	    })
	});

/***/ }
/******/ ]);
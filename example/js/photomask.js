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
	 * @method transform
	 * @param {HTMLElement} img
	 * @param {String} [src]
	 * @param {String} [text]
	 * @return {Promise}
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.transform = transform;

	function transform(img, _ref) {
	    var src = _ref.src;
	    var text = _ref.text;

	    /**
	     * @method getDimension
	     * @param {String} property
	     * @return {Number}
	     */
	    var getDimension = function getDimension(property) {
	        return parseInt(getComputedStyle(img).getPropertyValue(property), 10);
	    };

	    var height = getDimension('height');
	    var width = getDimension('width');

	    var svg = '<svg xmlns="http://www.w3.org/2000/svg">\n                    <text x="' + width / 2 + '" y="' + height / 2 + '" fill="white"\n                          font-size="80" font-family="WhoopAss, san-serif" textLength="100%" text-anchor="middle">\n                        ' + text + '\n                    </text>\n                 </svg>';

	    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
	    var mask = 'url(data:image/svg+xml;base64,' + btoa(svg) + ')';

	    img.setAttribute('style', '\n        background-image: url(\'images/meadows.jpg\');\n        background-size: cover;\n        -webkit-mask-image: ' + mask + ';\n        mask: ' + mask);
	}

	/**
	 * @method readAttributes
	 * @param {Element} element
	 * @return {Object}
	 */
	function readAttributes(element) {

	    return {
	        text: element.getAttribute('alt'),
	        src: element.getAttribute('src')
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
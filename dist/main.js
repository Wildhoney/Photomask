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
	 * @param {HTMLElement} element
	 * @param {String} [image]
	 * @param {String} [text]
	 * @return {Promise}
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.transform = transform;

	function transform(element, _ref) {
	  var image = _ref.image;
	  var text = _ref.text;
	}

	/**
	 * @method readAttributes
	 * @param {Element} element
	 * @return {Object}
	 */
	function readAttributes(element) {

	  return {
	    image: element.getAttribute('src'),
	    text: element.getAttribute('alt')
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
	     * @method attachedCallback
	     * @return {void}
	     */
	    attachedCallback: function attachedCallback() {
	      transform(undefined, undefined.readAttributes(undefined));
	    },

	    /**
	     * @method attributeChangedCallback
	     * @return {void}
	     */
	    attributeChangedCallback: function attributeChangedCallback() {
	      transform(undefined, undefined.readAttributes(undefined));
	    }

	  })
	});

/***/ }
/******/ ]);
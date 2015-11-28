(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @method computedProperty
 * @param {HTMLElement} element
 * @return {Function}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.registerFont = registerFont;
exports.transform = transform;
exports.readAttributes = readAttributes;
var computedProperty = function computedProperty(element) {
    return function (property) {
        var coerceFn = arguments.length <= 1 || arguments[1] === undefined ? parseFloat : arguments[1];

        return (coerceFn || function (x) {
            return x;
        })(getComputedStyle(element).getPropertyValue(property), 10);
    };
};

/**
 * @property blankImage
 * @type {String}
 */
var blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7';

/**
 * @property isFirefox
 * @type {Boolean}
 */
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/**
 * @property registeredFonts
 * @type {Array}
 */
var registeredFonts = [];

/**
 * @method registerFont
 * @param {String} name
 * @param {String} dataUri
 * @return {void}
 */

function registerFont(name, dataUri) {
    registeredFonts.push({ name: name, dataUri: dataUri });
}

/**
 * @method transform
 * @param {HTMLElement} img
 * @param {String} [src]
 * @param {String} [text]
 * @param {Number} [paddingLeft]
 * @param {Number} [paddingRight]
 * @param {Number} [paddingTop]
 * @return {void}
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
    var offset = isFirefox ? 36 : 0;

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

    // Import all of the registered fonts.
    var fonts = registeredFonts.map(function (font) {
        return '\n        @font-face {\n            font-family: ' + font.name + ';\n            src: url(' + font.dataUri + ')\n        }';
    });

    var svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n                      preserveAspectRatio="xMidYMid meet" viewBox="0 0 ' + width + ' ' + height + '">\n                    <defs>\n                        <style type="text/css">\n                            ' + fonts.join('') + '\n                        </style>\n                        <mask id="mask" maskUnits="userSpaceOnUse" width="' + width + '" height="' + height + '" x="0" y="0">\n                            <text id="photomask" x="' + width / 2 + '" y="' + (height / 2 + (paddingTop + offset)) + '" fill="white"\n                                  font-size="' + fontSize + '" font-family="' + fontFamily + '"\n                                  alignment-baseline="central" text-anchor="middle">\n                                ' + text + '\n                            </text>\n                        </mask>\n                    </defs>\n                    <use xlink:href="#photomask" />\n                 </svg>';

    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
    var data = 'data:image/svg+xml;base64,' + btoa(svg);

    img.setAttribute('src', blankImage);
    img.setAttribute('style', '\n        padding: 0;\n        background: transparent url(' + src + ') ' + computed('background-position', null) + ';\n        background-size: cover;\n        -webkit-mask-image: url(' + data + ');\n        mask: url(' + data + '#mask)');
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9QaG90b21hc2svc3JjL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0tBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDekMsU0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDLENBQUM7QUFDSCxPQUFPLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztBQUNwQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM5QixPQUFPLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQVB4QyxJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFJLE9BQU8sRUFBSztBQUNsQyxXQUFPLFVBQUMsUUFBUSxFQUE0QjtBQVN4QyxZQVRjLFFBQVEsR0FBQSxTQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFHLFVBQVUsR0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7O0FBQ25DLGVBQU8sQ0FBQyxRQUFRLElBQUssVUFBQyxDQUFDLEVBQUE7QUFXbkIsbUJBWHdCLENBQUMsQ0FBQTtTQUFBLENBQUEsQ0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM3RixDQUFDO0NBQ0wsQ0FBQzs7Ozs7O0FBTUYsSUFBTSxVQUFVLEdBQUcsZ0ZBQWdGLENBQUM7Ozs7OztBQU1wRyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBTTVFLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQzs7Ozs7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R0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0MsUUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUUzQyxXQUFPO0FBQ0gsWUFBSSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBQ2pDLFdBQUcsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztBQUNoQyxtQkFBVyxFQUFYLFdBQVcsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFVBQVUsRUFBVixVQUFVO0tBQ3hDLENBQUM7Q0FFTDs7QUFFRCxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRTs7Ozs7O0FBTXBDLGFBQUEsRUFBUyxLQUFLOzs7Ozs7O0FBT2QsYUFBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFOzs7Ozs7QUFNakQsd0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxnQkFBZ0IsR0FBRztBQUNuRCx5QkFBUyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN6QyxFQUFDOztLQUVMLENBQUM7Q0FDTCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBAbWV0aG9kIGNvbXB1dGVkUHJvcGVydHlcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5jb25zdCBjb21wdXRlZFByb3BlcnR5ID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gKHByb3BlcnR5LCBjb2VyY2VGbiA9IHBhcnNlRmxvYXQpID0+IHtcbiAgICAgICAgcmV0dXJuIChjb2VyY2VGbiB8fCAoKHgpID0+IHgpKShnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpLCAxMCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICogQHByb3BlcnR5IGJsYW5rSW1hZ2VcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbmNvbnN0IGJsYW5rSW1hZ2UgPSAnZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQVFBSUJSQUE3JztcblxuLyoqXG4gKiBAcHJvcGVydHkgaXNGaXJlZm94XG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuY29uc3QgaXNGaXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSByZWdpc3RlcmVkRm9udHNcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuY29uc3QgcmVnaXN0ZXJlZEZvbnRzID0gW107XG5cbi8qKlxuICogQG1ldGhvZCByZWdpc3RlckZvbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YVVyaVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRm9udChuYW1lLCBkYXRhVXJpKSB7XG4gICAgcmVnaXN0ZXJlZEZvbnRzLnB1c2goeyBuYW1lLCBkYXRhVXJpIH0pO1xufVxuXG4vKipcbiAqIEBtZXRob2QgdHJhbnNmb3JtXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpbWdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3JjXVxuICogQHBhcmFtIHtTdHJpbmd9IFt0ZXh0XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtwYWRkaW5nTGVmdF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbcGFkZGluZ1JpZ2h0XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtwYWRkaW5nVG9wXVxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybShpbWcsIHsgc3JjLCB0ZXh0LCBwYWRkaW5nTGVmdCA9IDAsIHBhZGRpbmdSaWdodCA9IDAsIHBhZGRpbmdUb3AgPSAwIH0gPSB7fSkge1xuXG4gICAgY29uc3QgY29tcHV0ZWQgPSBjb21wdXRlZFByb3BlcnR5KGltZyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gY29tcHV0ZWQoJ2hlaWdodCcpO1xuICAgIGNvbnN0IHdpZHRoID0gY29tcHV0ZWQoJ3dpZHRoJyk7XG5cbiAgICBpZiAoaGVpZ2h0ID09PSAwIHx8IHdpZHRoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUGhvdG9tYXNrOiBJbWFnZSBNVVNUIGhhdmUgYSBmaXhlZCBoZWlnaHQgYW5kIHdpZHRoLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvbnRGYW1pbHkgPSBjb21wdXRlZCgnZm9udC1mYW1pbHknLCBudWxsKTtcbiAgICBjb25zdCBvZmZzZXQgPSBpc0ZpcmVmb3ggPyAzNiA6IDA7XG5cbiAgICAvKipcbiAgICAgKiBSZWN1cnNpdmVseSBjb21wdXRlcyB0aGUgaWRlYWwgZm9udC1zaXplLCB3aGljaCBjYW4gYmUgcGVyZmVjdGVkIHVzaW5nIHRoZSBwYWRkaW5nXG4gICAgICogcHJvcGVydGllcyB2aWEgQ1NTLlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGZvbnRTaXplXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdCBmb250U2l6ZSA9IChmdW5jdGlvbiBjb21wdXRlRm9udFNpemUoc2l6ZSwgd2lkdGhDb25zdHJhaW50KSB7XG5cbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY29udGV4dC5mb250ID0gYCR7c2l6ZX1weCAke2ZvbnRGYW1pbHl9YDtcblxuICAgICAgICBpZiAoY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aCA8PSB3aWR0aENvbnN0cmFpbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXB1dGVGb250U2l6ZShzaXplIC0gMSwgd2lkdGhDb25zdHJhaW50KTtcblxuICAgIH0pKDUwMCwgd2lkdGggLSAocGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQpKTtcblxuICAgIC8vIEltcG9ydCBhbGwgb2YgdGhlIHJlZ2lzdGVyZWQgZm9udHMuXG4gICAgY29uc3QgZm9udHMgPSByZWdpc3RlcmVkRm9udHMubWFwKGZvbnQgPT4gYFxuICAgICAgICBAZm9udC1mYWNlIHtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAke2ZvbnQubmFtZX07XG4gICAgICAgICAgICBzcmM6IHVybCgke2ZvbnQuZGF0YVVyaX0pXG4gICAgICAgIH1gKTtcblxuICAgIGNvbnN0IHN2ZyA9IGA8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiIHZpZXdCb3g9XCIwIDAgJHt3aWR0aH0gJHtoZWlnaHR9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Zm9udHMuam9pbignJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N0eWxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9XCJtYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIiB3aWR0aD1cIiR7d2lkdGh9XCIgaGVpZ2h0PVwiJHtoZWlnaHR9XCIgeD1cIjBcIiB5PVwiMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IGlkPVwicGhvdG9tYXNrXCIgeD1cIiR7d2lkdGggLyAyfVwiIHk9XCIkeyhoZWlnaHQgLyAyKSArIChwYWRkaW5nVG9wICsgb2Zmc2V0KX1cIiBmaWxsPVwid2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZT1cIiR7Zm9udFNpemV9XCIgZm9udC1mYW1pbHk9XCIke2ZvbnRGYW1pbHl9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJjZW50cmFsXCIgdGV4dC1hbmNob3I9XCJtaWRkbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt0ZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbWFzaz5cbiAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjcGhvdG9tYXNrXCIgLz5cbiAgICAgICAgICAgICAgICAgPC9zdmc+YDtcblxuICAgIC8vIERlZmluZSB0aGUgU1ZHIGRhdGEgdG8gYmUgdXNlZCBhcyB0aGUgbWFzaywgYW5kIHRoZW4gY29uc3RydWN0IHRoZSBgc3R5bGVgIGF0dHJpYnV0ZS5cbiAgICBjb25zdCBkYXRhID0gYGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJHtidG9hKHN2Zyl9YDtcblxuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGJsYW5rSW1hZ2UpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYFxuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCB1cmwoJHtzcmN9KSAke2NvbXB1dGVkKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgbnVsbCl9O1xuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCgke2RhdGF9KTtcbiAgICAgICAgbWFzazogdXJsKCR7ZGF0YX0jbWFzaylgKTtcblxufVxuXG4vKipcbiAqIEBtZXRob2QgcmVhZEF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZXMoZWxlbWVudCkge1xuXG4gICAgY29uc3QgY29tcHV0ZWQgPSBjb21wdXRlZFByb3BlcnR5KGVsZW1lbnQpO1xuICAgIGNvbnN0IHBhZGRpbmdMZWZ0ID0gY29tcHV0ZWQoJ3BhZGRpbmctbGVmdCcpO1xuICAgIGNvbnN0IHBhZGRpbmdSaWdodCA9IGNvbXB1dGVkKCdwYWRkaW5nLXJpZ2h0Jyk7XG4gICAgY29uc3QgcGFkZGluZ1RvcCA9IGNvbXB1dGVkKCdwYWRkaW5nLXRvcCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FsdCcpLFxuICAgICAgICBzcmM6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSxcbiAgICAgICAgcGFkZGluZ0xlZnQsIHBhZGRpbmdSaWdodCwgcGFkZGluZ1RvcFxuICAgIH07XG5cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd4LXBob3RvbWFzaycsIHtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBleHRlbmRzXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBleHRlbmRzOiAnaW1nJyxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBwcm90b3R5cGVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKEhUTUxJbWFnZUVsZW1lbnQucHJvdG90eXBlLCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7IHZhbHVlOiBmdW5jdGlvbiBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgdHJhbnNmb3JtKHRoaXMsIHJlYWRBdHRyaWJ1dGVzKHRoaXMpKTtcbiAgICAgICAgfX1cblxuICAgIH0pXG59KTtcbiJdfQ==

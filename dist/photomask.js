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

    var svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n                      preserveAspectRatio="xMidYMid meet" viewBox="0 0 ' + width + ' ' + height + '">\n                    <defs>\n                        <mask id="mask" maskUnits="userSpaceOnUse" width="' + width + '" height="' + height + '" x="0" y="0">\n                            <text id="photomask" x="' + width / 2 + '" y="' + (height / 2 + (paddingTop + offset)) + '" fill="white"\n                                  font-size="' + fontSize + '" font-family="' + fontFamily + '"\n                                  alignment-baseline="central" text-anchor="middle">\n                                ' + text + '\n                            </text>\n                        </mask>\n                    </defs>\n                    <use xlink:href="#photomask" />\n                 </svg>';

    console.log(svg);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9QaG90b21hc2svc3JjL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0tBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDekMsU0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDLENBQUM7QUFDSCxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM5QixPQUFPLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQU54QyxJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFJLE9BQU8sRUFBSztBQUNsQyxXQUFPLFVBQUMsUUFBUSxFQUE0QjtBQVF4QyxZQVJjLFFBQVEsR0FBQSxTQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFHLFVBQVUsR0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7O0FBQ25DLGVBQU8sQ0FBQyxRQUFRLElBQUssVUFBQyxDQUFDLEVBQUE7QUFVbkIsbUJBVndCLENBQUMsQ0FBQTtTQUFBLENBQUEsQ0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM3RixDQUFDO0NBQ0wsQ0FBQzs7Ozs7O0FBTUYsSUFBTSxVQUFVLEdBQUcsZ0ZBQWdGLENBQUM7Ozs7OztBQU1wRyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQVlyRSxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQXlFO0FBYWxHLFFBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxN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LEVBQUU7Ozs7OztBQU1qRCx3QkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLGdCQUFnQixHQUFHO0FBQ25ELHlCQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3pDLEVBQUM7O0tBRUwsQ0FBQztDQUNMLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEBtZXRob2QgY29tcHV0ZWRQcm9wZXJ0eVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmNvbnN0IGNvbXB1dGVkUHJvcGVydHkgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiAocHJvcGVydHksIGNvZXJjZUZuID0gcGFyc2VGbG9hdCkgPT4ge1xuICAgICAgICByZXR1cm4gKGNvZXJjZUZuIHx8ICgoeCkgPT4geCkpKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSksIDEwKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBAcHJvcGVydHkgYmxhbmtJbWFnZVxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuY29uc3QgYmxhbmtJbWFnZSA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUlBQUFBQUFBUC8vL3lINUJBRUFBQUFBTEFBQUFBQUJBQUVBUUFJQlJBQTcnO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSBpc0ZpcmVmb3hcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5jb25zdCBpc0ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID4gLTE7XG5cbi8qKlxuICogQG1ldGhvZCB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGltZ1xuICogQHBhcmFtIHtTdHJpbmd9IFtzcmNdXG4gKiBAcGFyYW0ge1N0cmluZ30gW3RleHRdXG4gKiBAcGFyYW0ge051bWJlcn0gW3BhZGRpbmdMZWZ0XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtwYWRkaW5nUmlnaHRdXG4gKiBAcGFyYW0ge051bWJlcn0gW3BhZGRpbmdUb3BdXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtKGltZywgeyBzcmMsIHRleHQsIHBhZGRpbmdMZWZ0ID0gMCwgcGFkZGluZ1JpZ2h0ID0gMCwgcGFkZGluZ1RvcCA9IDAgfSA9IHt9KSB7XG5cbiAgICBjb25zdCBjb21wdXRlZCA9IGNvbXB1dGVkUHJvcGVydHkoaW1nKTtcbiAgICBjb25zdCBoZWlnaHQgPSBjb21wdXRlZCgnaGVpZ2h0Jyk7XG4gICAgY29uc3Qgd2lkdGggPSBjb21wdXRlZCgnd2lkdGgnKTtcblxuICAgIGlmIChoZWlnaHQgPT09IDAgfHwgd2lkdGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQaG90b21hc2s6IEltYWdlIE1VU1QgaGF2ZSBhIGZpeGVkIGhlaWdodCBhbmQgd2lkdGguJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZm9udEZhbWlseSA9IGNvbXB1dGVkKCdmb250LWZhbWlseScsIG51bGwpO1xuICAgIGNvbnN0IG9mZnNldCA9IGlzRmlyZWZveCA/IDM2IDogMDtcblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2l2ZWx5IGNvbXB1dGVzIHRoZSBpZGVhbCBmb250LXNpemUsIHdoaWNoIGNhbiBiZSBwZXJmZWN0ZWQgdXNpbmcgdGhlIHBhZGRpbmdcbiAgICAgKiBwcm9wZXJ0aWVzIHZpYSBDU1MuXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgZm9udFNpemVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIGNvbnN0IGZvbnRTaXplID0gKGZ1bmN0aW9uIGNvbXB1dGVGb250U2l6ZShzaXplLCB3aWR0aENvbnN0cmFpbnQpIHtcblxuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBjb250ZXh0LmZvbnQgPSBgJHtzaXplfXB4ICR7Zm9udEZhbWlseX1gO1xuXG4gICAgICAgIGlmIChjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoIDw9IHdpZHRoQ29uc3RyYWludCkge1xuICAgICAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcHV0ZUZvbnRTaXplKHNpemUgLSAxLCB3aWR0aENvbnN0cmFpbnQpO1xuXG4gICAgfSkoNTAwLCB3aWR0aCAtIChwYWRkaW5nTGVmdCArIHBhZGRpbmdSaWdodCkpO1xuXG4gICAgY29uc3Qgc3ZnID0gYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCIgdmlld0JveD1cIjAgMCAke3dpZHRofSAke2hlaWdodH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD1cIm1hc2tcIiBtYXNrVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiIHdpZHRoPVwiJHt3aWR0aH1cIiBoZWlnaHQ9XCIke2hlaWdodH1cIiB4PVwiMFwiIHk9XCIwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgaWQ9XCJwaG90b21hc2tcIiB4PVwiJHt3aWR0aCAvIDJ9XCIgeT1cIiR7KGhlaWdodCAvIDIpICsgKHBhZGRpbmdUb3AgKyBvZmZzZXQpfVwiIGZpbGw9XCJ3aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplPVwiJHtmb250U2l6ZX1cIiBmb250LWZhbWlseT1cIiR7Zm9udEZhbWlseX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIiB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNwaG90b21hc2tcIiAvPlxuICAgICAgICAgICAgICAgICA8L3N2Zz5gO1xuXG4gICAgY29uc29sZS5sb2coc3ZnKTtcblxuICAgIC8vIERlZmluZSB0aGUgU1ZHIGRhdGEgdG8gYmUgdXNlZCBhcyB0aGUgbWFzaywgYW5kIHRoZW4gY29uc3RydWN0IHRoZSBgc3R5bGVgIGF0dHJpYnV0ZS5cbiAgICBjb25zdCBkYXRhID0gYGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJHtidG9hKHN2Zyl9YDtcblxuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsIGJsYW5rSW1hZ2UpO1xuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYFxuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudCB1cmwoJHtzcmN9KSAke2NvbXB1dGVkKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgbnVsbCl9O1xuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCgke2RhdGF9KTtcbiAgICAgICAgbWFzazogdXJsKCR7ZGF0YX0jbWFzaylgKTtcblxufVxuXG4vKipcbiAqIEBtZXRob2QgcmVhZEF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZXMoZWxlbWVudCkge1xuXG4gICAgY29uc3QgY29tcHV0ZWQgPSBjb21wdXRlZFByb3BlcnR5KGVsZW1lbnQpO1xuICAgIGNvbnN0IHBhZGRpbmdMZWZ0ID0gY29tcHV0ZWQoJ3BhZGRpbmctbGVmdCcpO1xuICAgIGNvbnN0IHBhZGRpbmdSaWdodCA9IGNvbXB1dGVkKCdwYWRkaW5nLXJpZ2h0Jyk7XG4gICAgY29uc3QgcGFkZGluZ1RvcCA9IGNvbXB1dGVkKCdwYWRkaW5nLXRvcCcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FsdCcpLFxuICAgICAgICBzcmM6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSxcbiAgICAgICAgcGFkZGluZ0xlZnQsIHBhZGRpbmdSaWdodCwgcGFkZGluZ1RvcFxuICAgIH07XG5cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd4LXBob3RvbWFzaycsIHtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBleHRlbmRzXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBleHRlbmRzOiAnaW1nJyxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBwcm90b3R5cGVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKEhUTUxJbWFnZUVsZW1lbnQucHJvdG90eXBlLCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcm9wZXJ0eSBhdHRhY2hlZENhbGxiYWNrXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBhdHRhY2hlZENhbGxiYWNrOiB7IHZhbHVlOiBmdW5jdGlvbiBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgdHJhbnNmb3JtKHRoaXMsIHJlYWRBdHRyaWJ1dGVzKHRoaXMpKTtcbiAgICAgICAgfX1cblxuICAgIH0pXG59KTtcbiJdfQ==

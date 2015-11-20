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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXRpbWJlcmxha2UvV2Vicm9vdC9QaG90b21hc2svc3JjL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0tBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7QUFDekMsU0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDLENBQUM7QUFDSCxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUw5QixJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFJLE9BQU8sRUFBSztBQUNsQyxXQUFPLFVBQUMsUUFBUSxFQUE0QjtBQU94QyxZQVBjLFFBQVEsR0FBQSxTQUFBLENBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLEtBQUEsU0FBQSxHQUFHLFVBQVUsR0FBQSxTQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7O0FBQ25DLGVBQU8sQ0FBQyxRQUFRLElBQUssVUFBQyxDQUFDLEVBQUE7QUFTbkIsbUJBVHdCLENBQUMsQ0FBQTtTQUFBLENBQUEsQ0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM3RixDQUFDO0NBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7OztBQVlLLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBeUU7QUFZbEcsUUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FaZ0MsRUFBRSxHQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUEsQ0FBQTs7QUFjaEcsUUFkNkIsR0FBRyxHQUFBLElBQUEsQ0FBSCxHQUFHLENBQUE7QUFlaEMsUUFma0MsSUFBSSxHQUFBLElBQUEsQ0FBSixJQUFJLENBQUE7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QVMsY0FBYyxDQUFDLE9BQU8sRUFBRTs7QUFFN0IsUUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsUUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzdDLFFBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMvQyxRQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRTNDLFdBQU87QUFDSCxZQUFJLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDakMsV0FBRyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBQ2hDLG1CQUFXLEVBQVgsV0FBVyxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsVUFBVSxFQUFWLFVBQVU7S0FDeEMsQ0FBQztDQUVMOztBQUVELFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFOzs7Ozs7QUFNcEMsYUFBQSxFQUFTLEtBQUs7Ozs7Ozs7QUFPZCxhQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUU7Ozs7OztBQU1qRCx3QkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLGdCQUFnQixHQUFHO0FBQ3BELHlCQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3hDLEVBQUM7O0tBRUwsQ0FBQztDQUNMLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEBtZXRob2QgY29tcHV0ZWRQcm9wZXJ0eVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmNvbnN0IGNvbXB1dGVkUHJvcGVydHkgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiAocHJvcGVydHksIGNvZXJjZUZuID0gcGFyc2VGbG9hdCkgPT4ge1xuICAgICAgICByZXR1cm4gKGNvZXJjZUZuIHx8ICgoeCkgPT4geCkpKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSksIDEwKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIHRyYW5zZm9ybVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaW1nXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NyY11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbdGV4dF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbcGFkZGluZ0xlZnRdXG4gKiBAcGFyYW0ge051bWJlcn0gW3BhZGRpbmdSaWdodF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbcGFkZGluZ1RvcF1cbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm0oaW1nLCB7IHNyYywgdGV4dCwgcGFkZGluZ0xlZnQgPSAwLCBwYWRkaW5nUmlnaHQgPSAwLCBwYWRkaW5nVG9wID0gMCB9ID0ge30pIHtcblxuICAgIGNvbnN0IGNvbXB1dGVkID0gY29tcHV0ZWRQcm9wZXJ0eShpbWcpO1xuICAgIGNvbnN0IGhlaWdodCA9IGNvbXB1dGVkKCdoZWlnaHQnKTtcbiAgICBjb25zdCB3aWR0aCA9IGNvbXB1dGVkKCd3aWR0aCcpO1xuXG4gICAgaWYgKGhlaWdodCA9PT0gMCB8fCB3aWR0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bob3RvbWFzazogSW1hZ2UgTVVTVCBoYXZlIGEgZml4ZWQgaGVpZ2h0IGFuZCB3aWR0aC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBmb250RmFtaWx5ID0gY29tcHV0ZWQoJ2ZvbnQtZmFtaWx5JywgbnVsbCk7XG5cbiAgICAvKipcbiAgICAgKiBSZWN1cnNpdmVseSBjb21wdXRlcyB0aGUgaWRlYWwgZm9udC1zaXplLCB3aGljaCBjYW4gYmUgcGVyZmVjdGVkIHVzaW5nIHRoZSBwYWRkaW5nXG4gICAgICogcHJvcGVydGllcyB2aWEgQ1NTLlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IGZvbnRTaXplXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdCBmb250U2l6ZSA9IChmdW5jdGlvbiBjb21wdXRlRm9udFNpemUoc2l6ZSwgd2lkdGhDb25zdHJhaW50KSB7XG5cbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY29udGV4dC5mb250ID0gYCR7c2l6ZX1weCAke2ZvbnRGYW1pbHl9YDtcblxuICAgICAgICBpZiAoY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aCA8PSB3aWR0aENvbnN0cmFpbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXB1dGVGb250U2l6ZShzaXplIC0gMSwgd2lkdGhDb25zdHJhaW50KTtcblxuICAgIH0pKDUwMCwgd2lkdGggLSAocGFkZGluZ0xlZnQgKyBwYWRkaW5nUmlnaHQpKTtcblxuICAgIGNvbnN0IHN2ZyA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWQgbWVldFwiIHZpZXdCb3g9XCIwIDAgJHt3aWR0aH0gJHtoZWlnaHR9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9XCJtYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIiB3aWR0aD1cIiR7d2lkdGh9XCIgaGVpZ2h0PVwiJHtoZWlnaHR9XCIgeD1cIjBcIiB5PVwiMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCBpZD1cInBob3RvbWFza1wiIHg9XCIke3dpZHRoIC8gMn1cIiB5PVwiJHsoaGVpZ2h0IC8gMikgKyBwYWRkaW5nVG9wfVwiIGZpbGw9XCJ3aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXNpemU9XCIke2ZvbnRTaXplfVwiIGZvbnQtZmFtaWx5PVwiJHtmb250RmFtaWx5fVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJjZW50cmFsXCIgdGV4dC1hbmNob3I9XCJtaWRkbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RleHR9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI3Bob3RvbWFza1wiIC8+XG4gICAgICAgICAgICAgICAgIDwvc3ZnPmA7XG5cbiAgICAvLyBEZWZpbmUgdGhlIFNWRyBkYXRhIHRvIGJlIHVzZWQgYXMgdGhlIG1hc2ssIGFuZCB0aGVuIGNvbnN0cnVjdCB0aGUgYHN0eWxlYCBhdHRyaWJ1dGUuXG4gICAgY29uc3QgZGF0YSA9IGBkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCR7YnRvYShzdmcpfWA7XG5cbiAgICBpbWcuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7c3JjfSk7XG4gICAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKCR7ZGF0YX0pO1xuICAgICAgICBtYXNrOiB1cmwoJHtkYXRhfSNtYXNrKWApO1xuXG59XG5cbi8qKlxuICogQG1ldGhvZCByZWFkQXR0cmlidXRlc1xuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHJlYWRBdHRyaWJ1dGVzKGVsZW1lbnQpIHtcblxuICAgIGNvbnN0IGNvbXB1dGVkID0gY29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50KTtcbiAgICBjb25zdCBwYWRkaW5nTGVmdCA9IGNvbXB1dGVkKCdwYWRkaW5nLWxlZnQnKTtcbiAgICBjb25zdCBwYWRkaW5nUmlnaHQgPSBjb21wdXRlZCgncGFkZGluZy1yaWdodCcpO1xuICAgIGNvbnN0IHBhZGRpbmdUb3AgPSBjb21wdXRlZCgncGFkZGluZy10b3AnKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRleHQ6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhbHQnKSxcbiAgICAgICAgc3JjOiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJyksXG4gICAgICAgIHBhZGRpbmdMZWZ0LCBwYWRkaW5nUmlnaHQsIHBhZGRpbmdUb3BcbiAgICB9O1xuXG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgneC1waG90b21hc2snLCB7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZXh0ZW5kc1xuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgZXh0ZW5kczogJ2ltZycsXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgcHJvdG90eXBlXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MSW1hZ2VFbGVtZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJvcGVydHkgYXR0YWNoZWRDYWxsYmFja1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgYXR0YWNoZWRDYWxsYmFjazogeyB2YWx1ZTogZnVuY3Rpb24gYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgdHJhbnNmb3JtKHRoaXMsIHJlYWRBdHRyaWJ1dGVzKHRoaXMpKTtcbiAgICAgICAgfX1cblxuICAgIH0pXG59KTtcbiJdfQ==

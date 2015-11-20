/**
 * @method transform
 * @param {HTMLElement} img
 * @param {String} [src]
 * @param {String} [text]
 * @return {Promise}
 */
export function transform(img, { src, text }) {

    /**
     * @method computerProperty
     * @param {String} property
     * @param {Function} [coerceFn=parseFloat]
     * @return {Number}
     */
    const computerProperty = (property, coerceFn = parseFloat) => {
        return (coerceFn || ((x) => x))(getComputedStyle(img).getPropertyValue(property), 10);
    };

    const height = computerProperty('height');
    const width = computerProperty('width');
    const paddingLeft = computerProperty('padding-left');
    const paddingRight = computerProperty('padding-right');
    const paddingTop = computerProperty('padding-top');
    const fontFamily = computerProperty('font-family', null);
    const fontSize = (function computeFontSize(size, widthConstraint) {

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = `${size}px ${fontFamily}`;

        if (context.measureText(text).width <= widthConstraint) {
            return size;
        }

        return computeFontSize(size - 1, widthConstraint);

    })(500, width - (paddingLeft + paddingRight));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg">
                    <text x="${width / 2}" y="${(height / 2) + paddingTop}" fill="white"
                          font-size="${fontSize}" font-family="${fontFamily}"
                          alignment-baseline="central" text-anchor="middle">
                        ${text}
                    </text>
                 </svg>`;

    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
    const mask = `url(data:image/svg+xml;base64,${btoa(svg)})`;

    img.setAttribute('style', `
        padding: 0;
        background-image: url(${src});
        background-size: cover;
        -webkit-mask-image: ${mask};
        mask: ${mask}`);

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
    extends: 'img',

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
        }}

    })
});

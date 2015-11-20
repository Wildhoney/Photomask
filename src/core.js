/**
 * @method computedProperty
 * @param {HTMLElement} element
 * @return {Function}
 */
const computedProperty = (element) => {
    return (property, coerceFn = parseFloat) => {
        return (coerceFn || ((x) => x))(getComputedStyle(element).getPropertyValue(property), 10);
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
export function transform(img, { src, text, paddingLeft = 0, paddingRight = 0, paddingTop = 0 } = {}) {

    const computed = computedProperty(img);
    const height = computed('height');
    const width = computed('width');

    if (height === 0 || width === 0) {
        throw new Error('Photomask: Image MUST have a fixed height and width.');
    }

    const fontFamily = computed('font-family', null);

    /**
     * Recursively computes the ideal font-size, which can be perfected using the padding
     * properties via CSS.
     *
     * @property fontSize
     * @type {Number}
     */
    const fontSize = (function computeFontSize(size, widthConstraint) {

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = `${size}px ${fontFamily}`;

        if (context.measureText(text).width <= widthConstraint) {
            return size;
        }

        return computeFontSize(size - 1, widthConstraint);

    })(500, width - (paddingLeft + paddingRight));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                      preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <mask id="mask" maskUnits="userSpaceOnUse" width="${width}" height="${height}" x="0" y="0" />
                        <text id="photomask" x="${width / 2}" y="${(height / 2) + paddingTop}" fill="white"
                              font-size="${fontSize}" font-family="${fontFamily}"
                              alignment-baseline="central" text-anchor="middle">
                            ${text}
                        </text>
                    </defs>
                    <use xlink:href="#photomask" />
                 </svg>`;

    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
    const data = `data:image/svg+xml;base64,${btoa(svg)}`;

    img.setAttribute('style', `
        padding: 0;
        background-image: url(${src});
        background-size: cover;
        -webkit-mask-image: url(${data});
        mask: url(${data}#mask)`);

}

/**
 * @method readAttributes
 * @param {Element} element
 * @return {Object}
 */
function readAttributes(element) {

    const computed = computedProperty(element);
    const paddingLeft = computed('padding-left');
    const paddingRight = computed('padding-right');
    const paddingTop = computed('padding-top');

    return {
        text: element.getAttribute('alt'),
        src: element.getAttribute('src'),
        paddingLeft, paddingRight, paddingTop
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

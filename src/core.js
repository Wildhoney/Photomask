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
 * @property blankImage
 * @type {String}
 */
const blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7';

/**
 * @property isFirefox
 * @type {Boolean}
 */
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

/**
 * @property registeredFonts
 * @type {Array}
 */
const registeredFonts = [];

/**
 * @method registerFont
 * @param {String} name
 * @param {String} dataUri
 * @return {void}
 */
export function registerFont(name, dataUri) {
    registeredFonts.push({ name, dataUri });
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
export function transform(img, { src, text, paddingLeft = 0, paddingRight = 0, paddingTop = 0 } = {}) {

    const computed = computedProperty(img);
    const height = computed('height');
    const width = computed('width');

    if (height === 0 || width === 0) {
        throw new Error('Photomask: Image MUST have a fixed height and width.');
    }

    const fontFamily = computed('font-family', null);
    const offset = isFirefox ? 36 : 0;

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

    // Import all of the registered fonts.
    const fonts = registeredFonts.map(font => `
        @font-face {
            font-family: ${font.name};
            src: url(${font.dataUri})
        }`);

    const svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <style type="text/css">
                            ${fonts.join('')}
                        </style>
                        <mask id="mask" maskUnits="userSpaceOnUse" width="${width}" height="${height}" x="0" y="0">
                            <text id="photomask" x="${width / 2}" y="${(height / 2) + (paddingTop + offset)}" fill="white"
                                  font-size="${fontSize}" font-family="${fontFamily}"
                                  alignment-baseline="central" text-anchor="middle">
                                ${text}
                            </text>
                        </mask>
                    </defs>
                    <use xlink:href="#photomask" />
                 </svg>`;

    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
    const data = `data:image/svg+xml;base64,${btoa(svg)}`;

    img.setAttribute('src', blankImage);
    img.setAttribute('style', `
        padding: 0;
        background: transparent url(${src}) ${computed('background-position', null)};
        background-size: cover;
        -webkit-mask-image: url(${data});
        mask: url(${data}#mask)`);

}

/**
 * @method readAttributes
 * @param {Element} element
 * @return {Object}
 */
export function readAttributes(element) {

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

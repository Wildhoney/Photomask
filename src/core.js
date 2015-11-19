/**
 * @method transform
 * @param {HTMLElement} img
 * @param {String} [src]
 * @param {String} [text]
 * @return {Promise}
 */
export function transform(img, { src, text }) {

    /**
     * @method getDimension
     * @param {String} property
     * @return {Number}
     */
    const getDimension = property => {
        return parseInt(getComputedStyle(img).getPropertyValue(property), 10);
    };

    const height   = getDimension('height');
    const width    = getDimension('width');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg">
                    <text x="${width / 2}" y="${height / 2}" fill="white"
                          font-size="80" font-family="WhoopAss, san-serif" textLength="100%" text-anchor="middle">
                        ${text}
                    </text>
                 </svg>`;

    // Define the SVG data to be used as the mask, and then construct the `style` attribute.
    const mask = `url(data:image/svg+xml;base64,${btoa(svg)})`;

    img.setAttribute('style', `
        background-image: url('images/meadows.jpg');
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

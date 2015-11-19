/**
 * @method transform
 * @param {HTMLElement} element
 * @param {String} [image]
 * @param {String} [text]
 * @return {Promise}
 */
export function transform(element, { image, text }) {

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
    extends: 'img',

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
    	attachedCallback: () => {
            transform(this, this.readAttributes(this));
    	},

        /**
         * @method attributeChangedCallback
         * @return {void}
         */
        attributeChangedCallback: () => {
            transform(this, this.readAttributes(this));
        }

    })
});

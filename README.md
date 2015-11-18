# Photomask

Apply an alpha mask to your text using SVG and CSS mask-mode with custom font support.

## Getting Started

Photomask uses the `transform` function to provide the rendering of the text with a mask applied.

```javascript
import {transform} from 'photomask';

// ...

const headerElement = document.querySelector('h1');

transform(headerElement, {
    image: '/path/to/image.png'
});
```

Where the `h1` would be a normal element with a title that will be used for the masking process &mdash; the masking image can either be passed in using the `data-image` attribute in the HTML, or the `image` property in the `transform` function &mdash; the function's property takes precedence.

```html
<h1 data-image="/path/to/image.png">Photomask</h1>
```

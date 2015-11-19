# Photomask

> Apply an alpha mask to your text using SVG and CSS `mask` with custom font support.

![Photomask Example](media/screenshot.png)

## Getting Started

Photomask uses the `transform` function to provide the rendering of the text with a mask applied.

```javascript
import {transform} from 'photomask';

// ...

const imgElement = document.querySelector('img');
transform(imgElement);
```

For the image mask the `src` attribute will be used, whereas the text will be taken from the `img` element's `alt` attribute. When creating the `img` element, you're required to add the `is="x-photomask"` attribute which is a registered [custom element](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/).

```html
<img is="x-photomask" src="/path/to/landscape.png" alt="Photomask" />
```


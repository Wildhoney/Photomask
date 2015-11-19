# Photomask

Apply an alpha mask to your text using SVG and CSS mask-mode with custom font support.

## Getting Started

Photomask uses the `transform` function to provide the rendering of the text with a mask applied.

```javascript
import {transform} from 'photomask';

// ...

const imgElement = document.querySelector('img');
transform(imgElement);
```

For the image mask the `src` attribute will be used, whereas the text will be taken from the `img` element's `alt` attribute.

```html
<img src="/path/to/landscape.png" alt="Photomask" />
```


## The `src` directory

## Overview

The `src` directory contains all code used in the application along with all
tests of such code.

```
src/
| |- app/
| |- home/
| |- app.js
| |- app.spec.js
|- assets/
|- common/
|- sass/
| |- mais.scss
|- index.html
```

- `src/app/` - application-specific code, i.e code but not likely to be reused
in another application. [Read more &raquo;](app/README.md)
- `src/assets/` - static files like fonts and images. [Read more &raquo;](assets/README.md)
- `src/common/` - third-party libraries or companies likely to be reused in
another application. [Read more &raquo;](common/README.md)
- `src/sass/` - SASS files. [Read more &raquo;](sass/README.md)
- `src/index.html` - this is the HTML document of the single-page application.
See below

See each directory for a detailed explanation.

## `index.html`

The `index.html` file is the HTML document of the single-page application (SPA) that should contain all markup that applies to everithing in the app, such as the jeader and footer. It specifies the main `AppCtrl` controller into which the other controllers are placed.

The `index.html` is compiled as a Lo/Dash template, so some variables from `Gulpfile.js` and `package.json` can be referenced from within it. Changind the `name` in `package.json` from "m-boilerplate" will rename the resultant CSS and JavaScript placed in `build/`, so this HTML references them by variable for convenience.
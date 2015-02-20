# The `src/app` directory

## Overview

```
src/
 |- app/
 |  |- home/
 |  |- about/
 |  |- app.js/
 |  |- app.spec.js/
```

The `src/app` directory contains all code specific to this application. Apart from `app.js` and its accompanying tests (discussed below), this directory is filled with subdirectories corresponding to high-level sections of the application, often corresponding to top-level routes. Each directory can have as many subdirectories as it needs, and the build system will understand what to do. For example, a top-level route might be "products", which would be a folder within the `src/app` directory that conceptually corresponds to the top-level route `/products`, through this is in no way enforced. Products may then have subdirectories for "create", "view", "search", etc. The "view" submodule then define a route of `products/:id`, ad infinitum.

As `m-boilerplate` is quite minimal, take a look at the two provided submodules to gain a better understanding of how these are used as well as to get a glimpse of how powerful this simple construct can be.

## `app.js`

## Testing

One of the design philosophies of `m-boilerplate` is that tests should exist alongside the code they test and that the build system should be smart enough to know the difference and react accordingly. As such, the unit test for `app.js` is `app.spec.js`, though it is quite minimal.
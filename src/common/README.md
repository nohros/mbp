# The `src/common` directory.

The `src/common` directory houses internal and third-party re-usable components. Essentially, this folder is for everithing that isn't completely specific to this application.

Each component resides in its own directory that may then be structured any way the developer desires. The build system will read all `*.js` files that do not end in `.spec.js` as source files to be included in the final build, all `*.spec.js` files as unit tests to be excluded, and all `*.msx` files as templates to be compiled by msx. There is currently no way to handle components that do not meet this pattern.

```
src/
 |- common
 |  |- plusOne/
```

- `plusOne` - A simple directive to load a Google +1 buton on an element.

Every component contained here should be drad-and-drop reusable in any other project; they should depend on no other components that aren't similarly drag-and-drop reusable.
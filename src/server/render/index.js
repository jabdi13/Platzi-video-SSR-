import getManifest from "../getManifest";

let files = false;
if (process.env.NODE_ENV !== 'development') files = getManifest();

const render = (html, preloadedState) => {
    const mainStyles = files ? files['main.css'] : 'assets/main.css';
    const mainBuild = files ? files['main.js'] : 'assets/app.js';
    const vendorBuild = files ? files['vendors.js'] : 'assets/vendor.js';

    return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <link type="text/css" rel="stylesheet" href="${mainStyles}">
        <title>Platzi Video</title>
    </head>
    <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
        /</g,
        '\\u003c'
    )}
        </script>
        <script src="${mainBuild}" type="text/javascript"></script>
        <script src="${vendorBuild}" type="text/javascript"></script>
    </body>
    </html>
  `);
};

export default render;

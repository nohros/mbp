var m = require("mithril");

var __base_uri = "http://rem-rest-api.herokuapp.com";

/**
 * Makes XHR requests and returns a promise
 * @param {String} url m.request -> url
 * @param {Object} options m.request -> options
 */
var Rest = function(url, options) {
  var opts = options || {};
  var uri = url;
  if (typeof uri === "string") {
    if (opts.url == null) {
      opts.url = uri;
    }
    uri = opts.url;
  }
  
  if (!uri.startsWith(__base_uri)) {
    if (uri.startsWith("/")) {
      uri = __base_uri + uri;
    } else {
      uri = __base_uri + "/" + uri;
    }
  }
  
  opts.url = uri;
  return m.request(opts);
}

module.exports = Rest;
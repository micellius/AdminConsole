/**
 * Created by vadimto on 09.05.14.
 */
exports.head = function(req, res) {
    res.writeHead(200, {
        "cache-control": "no-cache",
        "content-length": 0,
        "content-type": "text/html",
        "expires": "Thu, 01 Jan 1970 00:00:00 GMT",
        "x-csrf-token": "76B97B4E18ACA143956EAAA683EA9CEF"
    });
    res.end();
};
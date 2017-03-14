var request = require('request'),
    cheerio = require('cheerio'),
    path = require('path'),
    _utils = require('./wuxiaworld-utils'),
    uniq = _utils.uniq,
    _write = _utils.writeFile,
    _mkdir = _utils.mkdir,
    _contents = _utils.getContents;

module.exports = (start_url, filename, done) => {
    console.log('\t [ +++ ] Starting request');
    request({
        url : start_url,
        headers : {
            'User-Agent' : 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36'
        }    
    }, function (error, response, body) {
        console.log('\t [ +++ ] Request completed');
        if (!error && response.statusCode == 200) {
            console.log('\t [ +++ ] Recieved 200 OK ...');
            _contents(body, path.basename(start_url), done);
        } else {
            console.log('\t [ +++ ] Failed request...');
        }
    });
}

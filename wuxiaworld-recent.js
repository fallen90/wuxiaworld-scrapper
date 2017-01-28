var request = require('request');
var cheerio = require('cheerio');

request('http://m.wuxiaworld.com/mobile-active-index/', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var list = $('#recent-posts-2 > ul li a');
        var ret = [];
        for (var i = list.length - 1; i >= 0; i--) {
            ret.push({
                title: $(list[i]).text(),
                link: $(list[i]).attr('href')
            })
        }
        console.log(JSON.stringify(ret));
    } else {
        console.log(JSON.stringify(error));
    }
});

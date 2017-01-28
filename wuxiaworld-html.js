var request = require('request'),
    cheerio = require('cheerio'),
    _utils = require('./wuxiaworld-utils'),
    uniq = _utils.uniq,
    _write = _utils.writeFile,
    _mkdir = _utils.mkdir

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
            var $ = cheerio.load(body);
            var article = $('[itemprop="articleBody"]');

            $('body').html(article);
            $('body div > p a').parent().remove();
            $('body hr').remove();
            $('body').attr('class', '');

            var x = cheerio.load($('body [itemprop="articleBody"] *:first-child').first().html());
            x('sup').remove()
            x('.footnote').remove();
            var title = x.text();

            $('head').html('<meta content="width=device-width,maximum-scale=1.0,initial-scale=1.0,minimum-scale=1.0,user-scalable=yes" name="viewport">');
            $('head').append('<title>' + title + '</title>');
            //remove links
            $('body a').each((index, element) => {
                if ($(element).text().includes("Chapter")) {
                    $(element).remove();
                }
            });

            $('.footnotes').css({
                'font-style': 'italic',
                'border': '1px solid #ccc',
                'padding': '12px'
            })
            _mkdir('files/output');
            _write('files/' + filename + '.html', $.html(), () => {
                console.log('\t [ +++ ] File saved!');
                done();
            });
        } else {
            console.log('\t [ +++ ] Failed request...');
        }
    });
}

var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var ls = require('./wuxiaworld-utils').listfiles;
var read = require('./wuxiaworld-utils').readFileSync;
var write = require('./wuxiaworld-utils').writeFile;
var minify = require('html-minifier').minify;
var output_file = __dirname + '/files/output/';
var temp_file = __dirname + '/files/temp_output/';

ls(output_file, function(err, files) {
    files.forEach(file => {
        console.log('Reading ', file);

        _file = path.join(output_file, file);
        var $ = cheerio.load(read(_file));
        var get_title = function(cb) {
            $('body div > p').each((index, value) => {
                if ($(value).text().includes('Chapter')) {
                    cb($(value).text());
                }
            });
        }

        get_title(title => {
            $('title').attr('read', true);
            $('title').empty().html(title);
        });

        var data = minify($.html(), {
            html5: true,
            removeAttributeQuotes: true,
            removeTagWhitespace: true,
            removeScriptTypeAttributes: true,
            removeComments: true,
            collapseWhitespace: true,
            minifyURLs: true,
            minifyJS: true,
            minifyCSS: true,
            removeStyleLinkTypeAttributes: true
        });
        
        write(path.join(temp_file, file), data, (err) => {
            console.log('Written to File', file);
        });

    });
});

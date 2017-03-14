var fs = require('fs');
var cheerio = require('cheerio');
module.exports = {
    uniq: a => {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    },
    basename: (path, suffix) => {
        var b = path,
            lastChar = b.charAt(b.length - 1);
        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1)
        }
        b = b.replace(/^.*[\/\\]/g, '')
        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
            b = b.substr(0, b.length - suffix.length)
        }
        return b
    },
    writeFile: (filename, data, done) => {
        fs.writeFile(filename, data, 'utf8', done());
    },
    readFile: (file, done) => {
        fs.readFile(file, 'utf8', function readFileCallback(err, data) {
            done(err, data);
        });
    },
    readFileSync: (file) => {
        if (fs.existsSync(file)) {
            return fs.readFileSync(file);
        }
    },
    exists: (path) => {
        return fs.existsSync(path);
    },
    delete: (path) => {
        fs.unlinkSync(path);
    },
    mkdir: (dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    },
    listfiles: (path, done) => {
        fs.readdir(path, (err, files) => {
            done(err, files);
        });
    },
    loader: (file, done) => {
        fs.readFile(file, 'utf8', function readFileCallback(err, data) {
            var $ = cheerio.load(data);
            done({
                title: $('title').text(),
                data: $('body').html()
            });
        });
    },
    getContents: (body, filename, done) => {
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
        });

        if (!fs.existsSync('files/output')) {
            fs.mkdirSync('files/output');
        }

        require('./wuxiaworld-utils').writeFile('files/output/' + filename + '.html', $.html(), () => {

            console.log('\t [ +++ ] File saved!', filename);

            done();
        });
    }
}

var fs = require('fs');
var cheerio = require('cheerio');
module.exports = {
    uniq: a => {
        return a.sort().filter(function (item, pos, ary) {
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
    readFileSync : (file) => {
        if(fs.existsSync(file)){
            return fs.readFileSync(file);
        }
    },
    exists: (path) => {
        return fs.existsSync(path);
    },
    delete : (path) => {
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
    }
}
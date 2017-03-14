var epub = require("epub-gen"),
    cheerio = require('cheerio'),
    _utils = require('./wuxiaworld-utils'),
    _read = _utils.readFileSync,
    _files = _utils.listfiles,
    _write = _utils.writeFile,
    _delete = _utils.delete,
    _exists = _utils.exists,
    option = {
        title: "MGA", // *Required, title of the book.
        author: "MGA", // *Required, name of the author.
        publisher: "fallen-epub-generator", // optional
        lang: 'en',
        output: "files/path.epub",
        cover: "cover.png", // Url or File path, both ok.
        content: []
    };


function loadContents(done) {
    let base_dir = 'files/output/';
    _files(base_dir, (err, files) => {
        let done_extract = 0;

        if (files) {
            for (i = 0; i < files.length; i++) {

                var data = _read(base_dir + files[i]);
                if (data) {
                    console.log('[' + (i + 1) + '/' + files.length + '] Adding Chapter `' + files[i] + '` to book')
                    var $ = cheerio.load(data);
                    option.content.push({
                        title: $('title').text(),
                        data: $('body').html()
                    });
                }

            }
            console.log('[ = ] Creating epub from data ...');
            if (_exists(option.output)) {
                console.log('[ = ] Output file exists, Deleting..,');
                _delete(option.output);
            }
            new epub(option);
        }



    });
}

loadContents();


module.exports = {
    setOptions: options => {
        option = options;
    },
    setBookDetails: details => {
        option.title = details.title;
        option.author = details.author;
        option.publisher = details.publisher;
        option.output = details.output;
        option.cover = details.cover;
    },
    create: (output, done) => {
        if(output){
            option.output = output;
        }

        new epub(option).promise.then( () => {
            done(option.output);
        });
    }
};
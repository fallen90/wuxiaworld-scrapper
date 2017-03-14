var request = require('request'),
    cheerio = require('cheerio'),
    generator = require('./wuxiaworld-generator'),
    epub = require('./wuxiaworld-epub'),
    _utils = require('./wuxiaworld-utils'),
    uniq = _utils.uniq,
    _write = _utils.writeFile,
    _contents = _utils.getContents;
    _basename = _utils.basename,
    start_url = "http://www.wuxiaworld.com/absolute-choice-index/ac-chapter-106/",
    url_list = [start_url];
console.log('[ ******** Wuxiaworld Crawler ******** ]');

var crawler = function (url) {
    let start_time = new Date();
    let request_loop = false;
    let url_to_loop = "";

    if (url.includes('www.wuxiaworld.com')) {
        url = url.replace('www', 'm');
    }

    console.log('[ = ] Loading Url ' + url);
    request({
        url: url,
        timeout : 20000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36'
        }
    }, function (error, response, body) {



        let end_time = new Date();
        console.log('\t [ * ] Finished Loading ', ((end_time - start_time) / 1000) + 's');
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var links = $('[itemprop="articleBody"] > p a');
            for (var i = links.length - 1; i >= 0; i--) {
                if ($(links[i]).text().includes("Chapter")) {
                    if ($(links[i]).text().includes("Next")) {
                        url_list.push($(links[i]).attr('href'));
                        url_to_loop = $(links[i]).attr('href');
                        request_loop = true;
                    } 
                }
            }

            //download this chapter

            _contents(body, _basename(url), function(){
                if(request_loop){
                    crawler(url_to_loop);
                } else {
                    console.log('[ ^_^v ] Finished!!');
                }
            });

            // if (request_loop) {
            //     crawler(url_to_loop);
            // } else {
                
            // }
        } else {
            if (response && response.statusCode == '404') {
                save(JSON.stringify(uniq(url_list)));
            } else {
                console.log('\t [ * ] Failed... Retrying ....');
                crawler(url);
            }
        }
    });
};
var save = (data) => {
    console.log('[ = ] Yey Done. .. Saving !!');
    _write('list.json', data, () => {
        console.log('[ = ] Written to file list.json!!');
    });

    //done wait till the file is written, it's only a safe keep
    var i = 0;
    var idl = () => {
        download_book(data[i], _basename(data[i]), () => {
            i++;
            if ((i + 1) == data.length) {
                create_book();
            } else {
                idl();
            }
        });
    };
    idl();
};
var download_book = (url, filename, done) => {
    require('./wuxiaworld-html')(url, filename, done);
}
var create_book = () => {
    epub.create('files/output.epub', out_file => {
        console.log('[ *** ] Done creating EPUB ' + out_file);
    });
}
crawler(start_url);
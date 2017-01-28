var page = require('webpage').create();
var system = require('system');
var filename = system.args[2] || 'output.png';
var component_size = system.args[3] || 'xiaomi';
var wurl = system.args[1] || '';
var fs = require('fs');
var start_time = new Date();

var getHostDomain = function (url) {
    var urlP = url.split('/').clean("");
    return urlP[1];
}

var getSizes = function (size) {
    var sizes = {
        letter: {
            width: '8.5in',
            height: '11in',
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            }
        },
        xiaomi: {
            width: 400,
            height: 700,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    };

    return sizes[size];
}
var getViewportSizes = function (size) {
    var sizes = {
        letter: {
            width: 800
        },
        xiaomi: {
            width: 500
        }
    }
    return sizes[size];
}

page.viewportSize = getViewportSizes(component_size);
page.paperSize = getSizes(component_size);
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;
page.settings.timeout = 200;


page.onResourceRequested = function (req) {
    var url = getHostDomain(req.url);
    if (url.indexOf('wuxiaworld') === -1) {
        req.abort();
    }
};

console.log('\t[ = ] Fetching Page...');

page.open(wurl, function (status) {
    var end_time = new Date();
    console.log('\t[ = ] Fetching Page *done...', "\t" + ((end_time - start_time) / 1000) + "s");
    if (status === 'success') {
        var ua = page.evaluate(function () {
            jQuery('body').removeClass('custom-background');
            jQuery('#comments').remove();
            jQuery('header').remove();
            jQuery('[role=complementary]').remove();
            jQuery('.widget-area').remove();
            jQuery('footer').remove();
            jQuery('.code-block').remove();
            var articleBody = jQuery('[itemprop=articleBody]');
            articleBody.find('p:first-child').remove();
            articleBody.find('p:last-child').remove();
            articleBody.find('hr').remove();
            var article = articleBody.html();
            jQuery('body').html(article);
            jQuery('[role=dialog]').remove();
            jQuery('#wpstats').remove();
            jQuery('.netseer_inview_banner').remove();
            jQuery('body').attr('class','');
            jQuery('.skip-link').remove();
            jQuery('iframe').remove();
            jQuery('head *').remove();
            jQuery('head').html('<meta content="width=device-width,maximum-scale=1.0,initial-scale=1.0,minimum-scale=1.0,user-scalable=yes" name="viewport">');
            var style = document.createElement('style');
            document.body.appendChild(style);
        });
        //------------------------------------------------------
        // console.log('\t[ = ] Rendering file....');
        // page.render('./files/' + filename);
        // console.log('\t[ = ] Render done....', "\t\t" + (((new Date()) - start_time) / 1000) + "s");
        //------------------------------------------------------
        fs.write('files/tests/1.html', page.content, 'w');
        phantom.exit();
    } else {
        console.log('Error fetching', status);
        phantom.exit();
    }
});

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
var _utils = require('./wuxiaworld-utils');
var _basename = _utils.basename;
var _write = _utils.writeFile;
var _read = _utils.readFile;
module.exports = (file, mode, callback) => {
    console.log('[ *** ] Generator Started...')
    console.log('[ *** ] Using ' + mode + ' mode...')
    mode = (mode) ? mode : "phantomjs";
    _read((file) ? file : 'list.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let sh_lines = [];
            let d = JSON.parse(data);

            for (var i = 0; i < d.length; i++) {
                let line = "";
                if (mode == "phantomjs") {
                    line = 'echo "[' + (i + 1) + '/' + d.length + '] Downloading ' + _basename(d[i]) + '"' +
                        "\nphantomjs tasks/wuxiaworld.js " + d[i] + " output/" + _basename(d[i]) + ".pdf"
                } else {
                    line = 'echo "[' + (i + 1) + '/' + d.length + '] Downloading ' + _basename(d[i]) + '"' +
                        "\nnode tasks/wuxiaworld-html.js " + d[i] + " output/" + _basename(d[i])
                }
                sh_lines.push(line);
            }

            var sh_ = sh_lines.join("\n");
            _write('downloader_test_' + mode + '.sh', sh_, () => {
                console.log('[ *** ] Write done');

                if (callback) {
                    callback();
                }
            }); // write it back 
        }
    });
};
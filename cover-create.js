var pimg = require('pureimage');
var fs = require('fs');

pimg.registerFont('./calibril.ttf', 'calibri', 'light', 'regular', '').load(function() {

    var img1 = pimg.make(400, 570);
    var ctx = img1.getContext('2d');
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, 400, 570);
    ctx.fillStyle = "#FFFfff";
    ctx.lineStyle = "#FFFfff";
    ctx.setFont('calibri', 50);
    wrapText(ctx, "Absolute Choice", 80, 120, 200, 100);

    pimg.encodePNG(img1, fs.createWriteStream('cover.png'), function(err) {
        console.log("wrote cover the png file to cover.png");
    });

});


function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

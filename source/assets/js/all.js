//= require_tree .
// 
function Underwater(canvas, image, amplitude, frequency) {

    'use strict';

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    canvas.id = "turing";
    canvas.className = "canvas";
    canvas.width = vw;
    canvas.height = vh;
    var stride = vw * 4,
        pixels = new Array(4 * vw * vh),
        interval = 1000 / 60,
        frames = 0,
        // canvas = $('<canvas id="turing"/>').attr({width: width, height: height}).appendTo('#main'),
        context = canvas.getContext('2d'),
        result = context.createImageData(vw, vh),
        ticker;
        document.body.appendChild(canvas);

    function init() {
        var i, source;

        context.drawImage(image, 0, 0);
        source = context.getImageData(0, 0, vw, vh);

        result = context.createImageData(vw, vh);
        for (i = 0; i < 4 * vh * vw; i += 1) {
            pixels[i] = source.data[i];
            result.data[i] = 255;
        }
    }

    function apply() {
        var r, T, x, y, xs, ys, dest, src;

        r = result.data;

        T = frames * interval * frequency / 1000;
        for (x = amplitude; x < vw - amplitude; ++x) {
            for (y = amplitude; y < vh - amplitude; ++y) {
                xs = amplitude * Math.sin(2 * Math.PI * (3 * y / vh + T));
                ys = amplitude * Math.cos(2 * Math.PI * (3 * x / vw + T));
                xs = Math.round(xs);
                ys = Math.round(ys);
                dest = y * stride + x * 4;
                src = (y + ys) * stride + (x + xs) * 4;
                r[dest] = pixels[src];
                r[dest + 1] = pixels[src + 1];
                r[dest + 2] = pixels[src + 2];
            }
        }

        context.putImageData(result, 0, 0);
        frames += .2;

        // Force flushing the pending painting.
        context.getImageData(0, 0, 1, 1);
        requestAnimationFrame(apply);
    }

    var fps = 60;
    var now;
    var then = Date.now();
    var interval = 1000/fps;
    var delta;

    function start() {
        requestAnimationFrame(apply);
    }

    function frameRate() {
        return (1000 * frames / (Date.now() - timestamp));
    }

    if (typeof Int16Array !== 'undefined') {
        pixels = new Int16Array(4 * vw * vh);
    }

    init();

    return {
        start: start,
        frameRate: frameRate
    };
}

function Grid() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    //grid width and height
    var gd = 160;
    var gsw = Math.ceil(vw / gd);
    var gsh = Math.ceil(vh / gd);
    //padding around grid
    var ph = (vw - gd*(gsw-2));
    var pv = (vh - gd*(gsh-2));
    //size of canvas
    var cw = gd*(gsw-2);
    var ch = gd*(gsh-2);
    canvas.id = "grid";
    canvas.className = "canvas";
    canvas.width = cw;
    canvas.height = ch;
    document.body.appendChild(canvas);

    var drawBoard = function(e) {
        for (var x1 = 32; x1 <= vw; x1 += gd) {
            context.moveTo(x1 + 0.5 - 16, 0);
            context.lineTo(x1 + 0.5 - 16, gsh*gd - ph);
        }
        for (var x1 = -32; x1 <= vw; x1 += gd) {
            context.moveTo(x1 + 0.5 + 16, 0);
            context.lineTo(x1 + 0.5 + 16, gsh*gd - ph);
        }

        for (var y1 = 32; y1 <= vh; y1 += gd) {
            context.moveTo(0, y1 + 0.5 - 16);
            context.lineTo(gsw*gd - pv, y1 + 0.5 - 16);
        }

        for (var y1 = -32; y1 <= vh; y1 += gd) {
            context.moveTo(0, y1 + 0.5 + 16);
            context.lineTo(gsw*gd - pv, y1 + 0.5 + 16);
        }

        context.strokeStyle = "rgba(0, 0, 0, 0.25)";
        context.stroke();
    }

    return new drawBoard();
}


window.onload = function(event) {
    var canvas, image, fx;
    canvas = document.getElementById('turing');
    image = document.getElementById('my_class');
    fx = new Underwater(canvas, image, 14, 1);

    window.requestAnimationFrame(function () {
        fx.start();
        Grid();
    });
}

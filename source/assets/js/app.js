const $ = window.$;
const TEYEPE = window.TEYEPE || {};

TEYEPE.shader = function(canvas, image, amplitude, frequency) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var image = new Image();
    image.src = '../assets/img/bg.png';
    canvas.id = 'turing-canvas';
    canvas.className = 'turing-canvas';
    canvas.width = vw;
    canvas.height = vh;
    var stride = vw * 4,
        pixels = new Array(4 * vw * vh),
        interval = 1000 / 60,
        frames = 0,
        context = canvas.getContext('2d'),
        result = context.createImageData(vw, vh);
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

        requestAnimationFrame(apply);
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

        context.getImageData(0, 0, 1, 1);
    };

    if (typeof Int16Array !== 'undefined') {
        pixels = new Int16Array(4 * vw * vh);
    };

    function start() {
        requestAnimationFrame(apply);
        init();
    };

    return {
        start
    };
};

TEYEPE.blink = () => {
    var logo = document.getElementById('logo'),
        animationEnter = document.getElementById('animation-enter'),
        animationOut = document.getElementById('animation-out');

    for (var i = 0 ; i < logo.length; i++) {
        logo[i].addEventListener('mouseover', function() {
            animationEnter.beginElement();
        });
    }
};

TEYEPE.imageReveal = () => {
    var hoverSample = $('.js-sample'),
        sample = $('.samples__item');

    $(hoverSample).on('mouseenter', function(){
        showSample($(this));
    });
    function showSample(e) {
        var thisImageIndex = hoverSample.index(e);
        for (i=0;i<sample.length;i++) {
            sample.removeClass('is-visible');
            sample.eq(thisImageIndex).addClass('is-visible');
        }
    };
};

TEYEPE.fx = () => {
    var canvas, image, fx;
    canvas = document.getElementById('turing-canvas');
    image = document.getElementById('diffusion-pttrn');
    fx = new TEYEPE.shader(canvas, image, 14, 1);
    fx.start();
};

TEYEPE.continuousScroll = () => {
    const scrollEl = document.scrollingElement || document.documentElement;
    const disallowedCloneTags = ['SCRIPT', 'STYLE', 'IMG', 'CANVAS'];
    const origDocHeight = document.body.offsetHeight;
    let isInitScroll = true;
    let latestKnownScrollY = 0;
    let ticking = false;

    function update() {
        if (latestKnownScrollY > origDocHeight) scrollEl.scrollTo(0, 0);
        if (latestKnownScrollY <= 0) scrollEl.scrollTo(0, origDocHeight);
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    function onScroll() {
        if (isInitScroll) {
            isInitScroll = false;
            return;
        }
        latestKnownScrollY = scrollEl.scrollTop;
        requestTick();
    }

    function _cloneBody() {
        const bodyChildren  = [].slice.call(document.body.children).filter(function (child) {
                return disallowedCloneTags.indexOf(child.tagName) === -1;
            });
        bodyChildren.forEach(child => {
            const clone = child.cloneNode(true);
            document.body.appendChild(clone);
        });
    }

    function _bindScrollEvent() {
        window.addEventListener("scroll", onScroll);
    }

    function init() {
        _cloneBody();
        scrollEl.scrollTo(0, origDocHeight);
        _bindScrollEvent();
    }

    return {
        init
    };
};

TEYEPE.init = function() {
    TEYEPE.blink();
    TEYEPE.fx();
    TEYEPE.imageReveal();
    TEYEPE.continuousScroll().init();
};

$(function() {
    if (document.readyState !== 'loading') {
        TEYEPE.init();
    } else {
        doc.addEventListener('DOMContentLoaded', TEYEPE.init, false);
    }
});

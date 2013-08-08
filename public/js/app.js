var isMobile;

// Identify if visitor on mobile with lame sniffing to remove parallaxing title
if( navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/BlackBerry/)
) {
    isMobile = true;
}

function random(num1, num2){
    return Math.floor(Math.random() * num2) + num1;
}

var guilloche = function(canvas, opts) {
    var opts = opts || {};

    //Determine pixel density and compute canvas size appropriately
    if (window.devicePixelRatio >= 2) {
        //canvas.width = canvas.width * 2;
        //canvas.height = canvas.height * 2;
    } else {
        canvas.width = canvas.width;
        canvas.height = canvas.height; 
    }

    var ctx = canvas.getContext('2d'),
        size = {x: canvas.offsetWidth, y: canvas.offsetHeight},
        halfSize = {x: size.x / 2, y: size.y / 2},
        majorR =                             opts.majorR || 479.5,
        minorR =                             opts.minorR || 50,
        angleMultiplier =           opts.angleMultiplier || 50,
        minAngleMultiplier =     opts.minAngleMultiplier || 20,
        maxAngleMultiplier =     opts.maxAngleMultiplier || 70,
        radiusEffectConstant = opts.radiusEffectConstant || 250,
        steps =                               opts.steps || 1210,
        centerPoint =                   opts.centerPoint || { x: canvas.width/2, y:canvas.height/2 },
        color =                               opts.color || 'rgb(238,238,238)',
        globalAlpha =                   opts.globalAlpha || 1.0;


    function draw(){  
        ctx.globalAlpha = globalAlpha;
        ctx.clearRect(0, 0, size.x, size.y);

        var diff  = majorR - minorR,
            s = diff / minorR,
            theta = 0,
            radiusEffect = radiusEffectConstant + minorR,
            oldX,
            oldY;

        for (var i = steps; i--;) {
            var new_theta = angleMultiplier * theta,
                x = diff * Math.sin(new_theta) + radiusEffect * Math.sin(new_theta * s) + (centerPoint.x),
                y = diff * Math.cos(new_theta) - radiusEffect * Math.cos(new_theta * s) + (centerPoint.y);

            theta += Math.PI * 4 / steps;

            if (oldX) {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(oldX, oldY);
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.stroke();
            }

            oldX = x;
            oldY = y;
        }
    }
    draw();
}

$(document).ready(function() {
    // Global vars
    var articleHeaderInner = $('.article-header-inner'),
        articleHeaderGuilloche = $('.article-header-guilloche'),
        articleHeader = $('.article-header'),
        articleTitle = $('.article-title'),
        articleSubtitle = $('.article-subtitle'),
        articleTime = $('.article-time');
    
    var articleTitleFontSize = parseInt(articleTitle.css('font-size'));
    var nav = $('.nav'),
        canvas = $('#gl');
    var windowScroll;
    
    // Apply Fittext to article titles to make it scale responsively in a smooth fashion
    articleTitle.fitText(1, { minFontSize: '34px' });
    
    // Identify if visitor has a large enough viewport for parallaxing title
    function isLargeViewport() {
        return nav.css('position') == "relative" ? false : true;
    }
    
    // If large viewport and not mobile, parallax the title
    if(!isMobile) {
        $(window).scroll(function() {
            if(isLargeViewport()) {
                slidingTitle();
            }
        });
    }
    
    // Window gets large enough, need to recalc all parallaxing title values
    $(window).resize(function() {
        if(isLargeViewport()) {
            slidingTitle();
        }
        
        canvas[0].width = articleHeader.width();
        canvas[0].height = $(window).height();
        
        guilloche(canvas[0], {
            angleMultiplier: random(20, 70),
            radiusEffectConstant: random(100, 400)
        });
    });
    
    // Functional parallaxing calculations
    function slidingTitle() {
        //Get scroll position of window
        windowScroll = $(this).scrollTop();
    
        articleHeaderInner.css({
            'margin-top' : -(windowScroll/3)+"px",
            'opacity' : 1-(windowScroll/450)
        });
        
        articleHeaderGuilloche.css({
            'opacity' : 1-(windowScroll/550)
        });
        
        articleHeader.css({
            'background-position' : 'center ' + (-windowScroll/8)+"px"
        });
        
        //Fade the .nav out
        nav.css({
            'opacity' : 1-(windowScroll/400)
        });
    
    }
    
    // Link to top of page without changing URL
    $('.back-to-top a').click(function(e) {
        e.preventDefault();
        $(window).scrollTop(0);
    });
    
    canvas[0].width = articleHeader.width();
    canvas[0].height = $(window).height();
    
    guilloche(canvas[0], {
        angleMultiplier: random(20, 70),
        radiusEffectConstant: random(100, 400)
    });

});
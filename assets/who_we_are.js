$(".Menu-btn,.close_icon").on('click', function() {
    $('.main_nav').fadeToggle(1000);
});

// #630000'
var myFullpage = new fullpage('#fullpage', {
    sectionsColor: ['#f3f1f5', '#fff', '#fff5eb', '#fff', 'wheat', '#dddddddd', 'ivory'],
    anchors: ['Service1', 'Service2', 'Service3', 'Service4', 'Service5', 'Service6', 'Service7'],
    navigation: true,
    navigationTooltips: ['Who We Are', 'Graphic Design', 'Video Art & Editing', 'Photo Retouching', '3D Modeling', '2D/3D Animation', 'Web Development'],
    showActiveTooltip: true,
    keyboardScrolling: true,
    animateAnchor: true,
    recordHistory: true,
    scrollingSpeed: 1500,
    navigationPosition: 'right',
    continuousVertical: true,

    afterLoad: function(origin, destination, direction) {



        if (destination.index == 0) {
            document.querySelector('#section0 .intro').querySelector('h1').style.opacity = 1;
            document.querySelector('#section0 .intro').querySelector('.span_red').style.opacity = 1;
            document.querySelector('#section0 .intro').querySelector('.after_last').style.opacity = 1;
            document.querySelector('#section0 .intro').querySelector('p').style.bottom = 0 + '%';
            document.querySelector('#section0 .intro').querySelector('span').style.bottom = 0 + '%';
        }

        //back to original state
        else if (origin && origin.index == 0) {
           document.querySelector('#section0 .intro').querySelector('h1').style.opacity = 0;
           document.querySelector('#section0 .intro').querySelector('.span_red').style.opacity = 0;
           document.querySelector('#section0 .intro').querySelector('.after_last').style.opacity = 0;
           document.querySelector('#section0 .intro').querySelector('p').style.bottom = -1000 + '%';
           document.querySelector('#section0 .intro').querySelector('span').style.bottom = -1000 + '%';
        }



        //section 1
        if (destination.index == 1) {
            document.querySelector('#section1 .intro').querySelector('h1').style.left = 0 + 'px';
            document.querySelector('#section1 .intro').querySelector('.red_span_2').style.left = 0 + 'px';
            document.querySelector('#section1').querySelector('img').style.opacity = 1;
        }

        //back to original state
        else if (origin && origin.index == 1) {
            document.querySelector('#section1 .intro').querySelector('h1').style.left = 1000 + '%';
            document.querySelector('#section1 .intro').querySelector('.red_span_2').style.left = -1000 + '%';
            document.querySelector('#section1').querySelector('img').style.opacity = 0;
        }

        if (destination.index == 2) {
            document.querySelector('#section2 .intro').querySelector('.end_h1').style.left = 0 + 'px';
            document.querySelector('#section2 .intro').querySelector('h1').style.bottom = 0 + '%';
            document.querySelector('#section2 .intro').querySelector('h1.red_span').style.opacity = 1;
        }

        //back to original state
        else if (origin && origin.index == 2) {
            document.querySelector('#section2 .intro').querySelector('.end_h1').style.left = 1000 + '%';
            document.querySelector('#section2 .intro').querySelector('h1').style.bottom = -1000 + '%';
            document.querySelector('#section2 .intro').querySelector('h1.red_span').style.opacity = 0;
        }

        if (destination.index == 3) {
            document.querySelector('#section3 .intro').querySelector('.after_invert').style.opacity = 1;
            document.querySelector('#section3 .intro').querySelector('.red_span3').style.opacity = 1;
            document.querySelector('#section3 .intro').querySelector('.first_invert').style.opacity = 1;
        }

        //back to original state
        else if (origin && origin.index == 3) {
            document.querySelector('#section3 .intro').querySelector('.after_invert').style.opacity = 0;
            document.querySelector('#section3 .intro').querySelector('.red_span3').style.opacity = 0;
            document.querySelector('#section3 .intro').querySelector('.first_invert').style.opacity = 0;
        }



        if (destination.index == 4) {
            document.querySelector('#section4 .intro').querySelector('.after_f_span').style.opacity = 1;
            document.querySelector('#section4 .intro').querySelector('.red_span4').style.opacity = 1;
            document.querySelector('#section4 .intro').querySelector('.red_span4').style.bottom = 0 + '%';
        }

        //back to original state
        else if (origin && origin.index == 4) {
            document.querySelector('#section4 .intro').querySelector('.after_f_span').style.opacity = 0;
            document.querySelector('#section4 .intro').querySelector('.red_span4').style.opacity = 0;
            document.querySelector('#section4 .intro').querySelector('.red_span4').style.bottom = -1000 + '%';

        }


        if (destination.index == 5) {
            document.querySelector('#section5 .intro').querySelector('.last_span5').style.opacity = 1;
            document.querySelector('#section5 .intro').querySelector('.red_span5').style.left = 0 + '%';
            document.querySelector('#section5 .intro').querySelector('.black_span5').style.left = 0 + '%';
        }

        //back to original state
        else if (origin && origin.index == 5) {
            document.querySelector('#section5 .intro').querySelector('.last_span5').style.opacity = 0;
            document.querySelector('#section5 .intro').querySelector('.red_span5').style.left = 1000 + '%';
            document.querySelector('#section5 .intro').querySelector('.black_span5').style.left = -1000 + '%';
        }


        if (destination.index == 6) {
            document.querySelector('#section6 .intro').querySelector('h1').style.bottom = 0 + '%';
        }

        //back to original state
        else if (origin && origin.index == 6) {
            document.querySelector('#section6 .intro').querySelector('h1').style.bottom = -1000 + '%';
        }
    }
});
$(".Menu-btn,.close_icon").on('click', function() {
    $('.main_nav').fadeToggle(1000);
});







// **************
// Created using a tutorial from Redstapler
// **************

// Three JS needs mainly below three things

/* //////////////////////////////////////// */

// SCENE
scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002);

/* //////////////////////////////////////// */

// CAMERA
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
camera.rotation.x = 1.16;
camera.rotation.y = -0.12;
camera.rotation.z = 0.27;

/* //////////////////////////////////////// */

// RENDERER
renderer = new THREE.WebGLRenderer();
renderer.setClearColor(scene.fog.color);
renderer.setSize(window.innerWidth, window.innerHeight);

// Append canvas to the body


// document.body.appendChild(renderer.domElement);
document.querySelector('.main_full').appendChild(renderer.domElement);

/* //////////////////////////////////////// */

// Ambient Light
ambient = new THREE.AmbientLight(0x000112);
scene.add(ambient);

/* //////////////////////////////////////// */

// Directional Light
directionalLight = new THREE.DirectionalLight(0x123123);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);


/* //////////////////////////////////////// */

// Point Light
flash = new THREE.PointLight(0xffffff, 80, 500, 3);
flash.position.set(200, 300, 100);
scene.add(flash);

/* //////////////////////////////////////// */

// Rain Drop Texture
rainCount = 9500;
cloudParticles = [];
rainGeo = new THREE.Geometry();
for (let i = 0; i < rainCount; i++) {
    rainDrop = new THREE.Vector3(
        Math.random() * 400 - 200,
        Math.random() * 500 - 250,
        Math.random() * 400 - 200
    )
    rainDrop.velocity = {};
    rainDrop.velocity = 0;
    rainGeo.vertices.push(rainDrop);
}

rainMaterial = new THREE.PointsMaterial({
    color: 0x5b5b5b,
    size: 0.1,
    transparent: true
})

rain = new THREE.Points(rainGeo, rainMaterial);
scene.add(rain)

/* //////////////////////////////////////// */

// Smoke Texture Loader
let loader = new THREE.TextureLoader();
loader.load("https://raw.githubusercontent.com/navin-navi/codepen-assets/master/images/smoke.png", function(texture) {
    cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
    });

    for (let p = 0; p < 25; p++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
            Math.random() * 800 - 400,
            500,
            Math.random() * 500 - 500
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        cloud.material.opacity = 0.55;
        cloudParticles.push(cloud);
        scene.add(cloud);
    }
});

/* //////////////////////////////////////// */

// Render animation on every rendering phase
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    // Cloud Rotation Animation
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.002;
    })

    // RainDrop Animation
    rainGeo.vertices.forEach(p => {
        p.velocity -= 3 * Math.random() * 1;
        p.y += p.velocity;
        if (p.y < -100) {
            p.y = 100;
            p.velocity = 0;
        }
    })
    rainGeo.verticesNeedUpdate = true;
    rain.rotation.y += 0.002;

    // Lightening Animation
    if (Math.random() > 0.96 || flash.power > 100) {
        if (flash.power < 100) {
            flash.position.set(
                Math.random() * 400,
                300 + Math.random() * 200,
                100
            );
        }
        flash.power = 50 + Math.random() * 500;
    }
}

render();

/* //////////////////////////////////////// */

// Update Camera Aspect Ratio and Renderer ScreenSize on Window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

/*////////////////////////////////////////*/

// set and cache variables
var w, container, carousel, item, radius, itemLength, rY, ticker, fps;
var mouseX = 0;
var mouseY = 0;
var mouseZ = 0;
var addX = 0;


// fps counter created by: https://gist.github.com/sharkbrainguy/1156092,
// no need to create my own :)
var fps_counter = {

    tick: function() {
        // this has to clone the array every tick so that
        // separate instances won't share state 
        this.times = this.times.concat(+new Date());
        var seconds, times = this.times;

        if (times.length > this.span + 1) {
            times.shift(); // ditch the oldest time
            seconds = (times[times.length - 1] - times[0]) / 1000;
            return Math.round(this.span / seconds);
        } else return null;
    },

    times: [],
    span: 20
};
var counter = Object.create(fps_counter);



$(document).ready(init)

function init() {
    w = $(window);
    container = $('#contentContainer');
    carousel = $('#carouselContainer');
    item = $('.carouselItem');
    itemLength = $('.carouselItem').length;
    fps = $('#fps');
    rY = 360 / itemLength;
    radius = Math.round((250) / Math.tan(Math.PI / itemLength));

    // set container 3d props
    TweenMax.set(container, { perspective: 600 })
    TweenMax.set(carousel, { z: -(radius) })

    // create carousel item props

    for (var i = 0; i < itemLength; i++) {
        var $item = item.eq(i);
        var $block = $item.find('.carouselItemInner');

        //thanks @chrisgannon!        
        TweenMax.set($item, { rotationY: rY * i, z: radius, transformOrigin: "50% 50% " + -radius + "px" });

        animateIn($item, $block)
    }

    // set mouse x and y props and looper ticker
    window.addEventListener("mousemove", onMouseMove, false);
    $('body').on('mousewheel DOMMouseScroll', function(e) {
        if (typeof e.originalEvent.detail == 'number' && e.originalEvent.detail !== 0) {
            if (e.originalEvent.detail > 0) {
                onScrollDown();
            } else if (e.originalEvent.detail < 0) {
                onScrollUp();
            }
        } else if (typeof e.originalEvent.wheelDelta == 'number') {
            if (e.originalEvent.wheelDelta < 0) {
                onScrollDown();

            } else if (e.originalEvent.wheelDelta > 0) {
                onScrollUp();
            }
        }
    });


    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);


    // function detectMob(event) {
    //     if (window.innerWidth <= 600) {
    //         mouseX = -(-(window.innerWidth * .5)) * .0005;
    //         addX += mouseX
    //         TweenMax.to(carousel, 1, { rotationY: addX, rotationX: mouseY, ease: Quint.easeOut })
    //         TweenMax.set(carousel, { z: mouseZ })
    //         fps.text('Framerate: ' + counter.tick() + '/80 FPS')
    //     }

    // }

    // setInterval(detectMob, 1000 / 60);

    ticker = setInterval(looper, 1000 / 60);
}
let listening = false,
    direction = "down",
    current,
    next = 0;


const touch = {
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    startTime: 0,
    dt: 0
};


function handleDirection() {
    listening = false;


    if (direction === "down") {
        next = current + 1;
        mouseX = -(-(window.innerWidth * .4)) * .0030;
        addX += mouseX
    }

    if (direction === "up") {
        next = current - 1;
        mouseX = -(-(window.innerWidth * .4)) * .0030;
        addX -= mouseX
    }
}

function handleTouchMove(e) {
    handleDirection();
}

function handleTouchEnd(e) {
    if (!listening) return;
    const t = e.changedTouches[0];
    touch.dx = t.pageX - touch.startX;
    touch.dy = t.pageY - touch.startY;
    if (touch.dy > 10) direction = "up";
    if (touch.dy < -10) direction = "down";
    handleDirection();
}

function animateIn($item, $block) {
    var $nrX = 360 * getRandomInt(2);
    var $nrY = 360 * getRandomInt(2);

    var $nx = -(2000) + getRandomInt(4000)
    var $ny = -(2000) + getRandomInt(4000)
    var $nz = -4000 + getRandomInt(4000)

    var $s = 1.5 + (getRandomInt(10) * .1)
    var $d = 1 - (getRandomInt(8) * .1)

    TweenMax.set($item, { autoAlpha: 1, delay: $d })
    TweenMax.set($block, { z: $nz, rotationY: $nrY, rotationX: $nrX, x: $nx, y: $ny, autoAlpha: 0 })
    TweenMax.to($block, $s, { delay: $d, rotationY: 0, rotationX: 0, z: 0, ease: Expo.easeInOut })
    TweenMax.to($block, $s - .5, { delay: $d, x: 0, y: 0, autoAlpha: 1, ease: Expo.easeInOut })
}

function onMouseMove(event) {
    mouseX = -(-(window.innerWidth * .5) + event.pageX) * .0095;
    mouseY = -(-(window.innerHeight * .5) + event.pageY) * .01;
    mouseZ = -(radius) - (Math.abs(-(window.innerHeight * .5) + event.pageY) - 200);
}



function onScrollDown(event) {
    addX += mouseX
    TweenMax.to(carousel, 1, { rotationY: addX, rotationX: mouseY, ease: Quint.easeOut })
    TweenMax.set(carousel, { z: mouseZ })
    fps.text('Framerate: ' + counter.tick() + '/80 FPS')

}

function onScrollUp(event) {
    addX -= mouseX
    TweenMax.to(carousel, 1, { rotationY: addX, rotationX: mouseY, ease: Quint.easeOut })
    TweenMax.set(carousel, { z: mouseZ })
    fps.text('Framerate: ' + counter.tick() + '/80 FPS')

}

Draggable.create(".carouselItem", {
    type: "x,y",
    liveSnap: {
        points: function(point) {
            //if it's within 100px, snap exactly to 500,250
            var dx = point.x - 500;
            var dy = point.y - 250;
            if (Math.sqrt(dx * dx + dy * dy) < 100) {
                return { x: 500, y: 250 };
            }
            return point; //otherwise don't change anything.
        }
    }
})

// // loops and sets the carousel 3d properties
function looper() {
    // addX += mouseX
    TweenMax.to(carousel, 1, { rotationY: addX, rotationX: mouseY, ease: Quint.easeOut })
    TweenMax.set(carousel, { z: mouseZ })
    fps.text('Framerate: ' + counter.tick() + '/80 FPS')
}

function getRandomInt($n) {
    return Math.floor((Math.random() * $n) + 1);
}




bar3 = document.querySelector('.bar-c');
var sound3 = new Howl({
    src: ['../assets/sounds/22-Roll-over-Polarised.mp3'],
    volume: 1,
    loop: true,
    html5: true,
});

window.addEventListener('load', function() {
    setTimeout(function() {
        $(".bar").removeClass("noAnim");
        sound3.play();
        $(".bar_img_mute").css('opacity', '0');

    }, 3500);
});

click = 0;

bar3.addEventListener('click', function(e) {
    // loop
    click += 1;

    if (click == 1) {
        sound3.pause();
        $(".bar").addClass("noAnim");
        $(".bar_img_mute").css('opacity', '1');


        click += 1;
    } else if (click > 1) {
        sound3.play();
        $(".bar").removeClass("noAnim");
        $(".bar_img_mute").css('opacity', '0');
        click -= 2;
    }
});
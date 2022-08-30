import gsap from "https://cdn.skypack.dev/gsap";
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import * as dat from "https://cdn.skypack.dev/dat.gui";

const gui = new dat.GUI();
const world = {
    plane: {
        width: 500,
        height: 500,
        widthSegments: 80,
        heightSegments: 80,
    },
};
gui.add(world.plane, "width", 1, 500).onChange(generatePlane);

gui.add(world.plane, "height", 1, 500).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 100).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 100).onChange(generatePlane);

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    );

    // vertice position randomization
    const { array } = planeMesh.geometry.attributes.position;
    const randomValues = [];
    for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];

            array[i] = x + (Math.random() - 5) * 10;
            array[i + 1] = y + (Math.random() - 5) * 10;
            array[i + 2] = z + (Math.random() - 5) * 10;
        }

        randomValues.push(Math.random() * Math.PI * 0.3);
    }

    planeMesh.geometry.attributes.position.randomValues = randomValues;
    planeMesh.geometry.attributes.position.originalPosition =
        planeMesh.geometry.attributes.position.array;

    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0, 0);
    }

    planeMesh.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);

renderer.setPixelRatio(devicePixelRatio);

let first_page_animations = document.querySelector(".first_page_animations");

first_page_animations.append(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

camera.position.z = 60;

const planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
generatePlane();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
    x: undefined,
    y: undefined,
};

let frame = 0;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);
    frame += 0.01;

    const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        // x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.08;

        // y
        array[i + 1] =
            originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.05;
    }

    planeMesh.geometry.attributes.position.needsUpdate = true;

    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes;

        // vertice 1
        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.1);
        color.setZ(intersects[0].face.a, 0.1);

        // vertice 2
        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.1);
        color.setZ(intersects[0].face.b, 0.1);

        // vertice 3
        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.1);
        color.setZ(intersects[0].face.c, 0.1);

        intersects[0].object.geometry.attributes.color.needsUpdate = true;

        const initialColor = {
            r: 0,
            g: 0,
            b: 0,
        };

        const hoverColor = {
            r: 1.2,
            g: 1.2,
            b: 1.2,
        };

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 1,
            onUpdate: () => {
                // vertice 1
                color.setX(intersects[0].face.a, hoverColor.r);
                color.setY(intersects[0].face.a, hoverColor.g);
                color.setZ(intersects[0].face.a, hoverColor.b);

                // vertice 2
                color.setX(intersects[0].face.b, hoverColor.r);
                color.setY(intersects[0].face.b, hoverColor.g);
                color.setZ(intersects[0].face.b, hoverColor.b);

                // vertice 3
                color.setX(intersects[0].face.c, hoverColor.r);
                color.setY(intersects[0].face.c, hoverColor.g);
                color.setZ(intersects[0].face.c, hoverColor.b);
                color.needsUpdate = true;
            },
        });
    }
}

animate();

addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});

let tap_transform1 = document.querySelector(".tap_transform1");
// $(".second_container").hide();
// $(".second_container .second_page_animations").hide();

// $(".tap_transform1").click(function () {
//   $(".second_container").animate(
//     {
//       opacity: 1,
//       left: "0",
//     },
//     function () {






addEventListener("load", (event) => {





    // $("body").find(".first_page_animations").hide();
    // $("body").find(".first_container").hide();

    // $("body").find(".second_container").show(); //
    // $(".second_container .second_page_animations").show(); //

    const gui = new dat.GUI();
    const world2 = {
        plane: {
            width: 500,
            height: 500,
            widthSegments: 70,
            heightSegments: 70,
        },
    };

    gui.add(world2.plane, "width", 1, 500).onChange(generatePlane);

    gui.add(world2.plane, "height", 1, 500).onChange(generatePlane);
    gui.add(world2.plane, "widthSegments", 1, 100).onChange(generatePlane);
    gui.add(world2.plane, "heightSegments", 1, 100).onChange(generatePlane);

    function generatePlane() {
        planeMesh.geometry.dispose();
        planeMesh.geometry = new THREE.PlaneGeometry(
            world2.plane.width,
            world2.plane.height,
            world2.plane.widthSegments,
            world2.plane.heightSegments
        );

        // vertice position randomization
        const { array } = planeMesh.geometry.attributes.position;
        const randomValues = [];
        for (let i = 0; i < array.length; i++) {
            if (i % 3 === 0) {
                const x = array[i];
                const y = array[i + 1];
                const z = array[i + 2];

                array[i] = x + (Math.random() - 5) * 5;
                array[i + 1] = y + (Math.random() - 5) * 5;
                array[i + 2] = z + (Math.random() - 5) * 5;
            }

            randomValues.push(Math.random() * Math.PI * 0.2);
        }

        planeMesh.geometry.attributes.position.randomValues = randomValues;
        planeMesh.geometry.attributes.position.originalPosition =
            planeMesh.geometry.attributes.position.array;

        const colors = [];
        for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
            colors.push(0.9, 0.9, 0.9);
        }

        planeMesh.geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3)
        );
    }

    const raycaster = new THREE.Raycaster();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60,
        innerWidth / innerHeight,
        0.9,
        1000
    );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(innerWidth, innerHeight);

    renderer.setPixelRatio(devicePixelRatio);

    let second_page_animations = document.querySelector(
        ".second_page_animations"
    );




    second_page_animations.append(renderer.domElement);

    new OrbitControls(camera, renderer.domElement);

    camera.position.z = 100;

    const planeGeometry = new THREE.PlaneGeometry(
        world2.plane.width,
        world2.plane.height,
        world2.plane.widthSegments,
        world2.plane.heightSegments
    );
    const planeMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        flatShading: THREE.FlatShading,
        vertexColors: true,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);
    generatePlane();

    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(0, -1, 1);
    scene.add(light);

    const backLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    const mouse = {
        x: undefined,
        y: undefined,
    };

    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0.9, 0.9, 0.9);
    }

    planeMesh.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
    let frame2 = 0;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

        raycaster.setFromCamera(mouse, camera);
        frame2 += 0.01;

        const { array, originalPosition, randomValues } =
        planeMesh.geometry.attributes.position;
        for (let i = 0; i < array.length; i += 3) {
            // x
            array[i] =
                originalPosition[i] + Math.cos(frame2 + randomValues[i]) * 0.08;

            // y
            array[i + 1] =
                originalPosition[i + 1] + Math.sin(frame2 + randomValues[i + 1]) * 0.05;
        }

        planeMesh.geometry.attributes.position.needsUpdate = true;

        const intersects = raycaster.intersectObject(planeMesh);
        if (intersects.length > 0) {
            const { color } = intersects[0].object.geometry.attributes;

            // vertice 1
            color.setX(intersects[0].face.a, 0.1);
            color.setY(intersects[0].face.a, 0.1);
            color.setZ(intersects[0].face.a, 0.1);

            // vertice 2
            color.setX(intersects[0].face.b, 0.1);
            color.setY(intersects[0].face.b, 0.1);
            color.setZ(intersects[0].face.b, 0.1);

            // vertice 3
            color.setX(intersects[0].face.c, 0.1);
            color.setY(intersects[0].face.c, 0.1);
            color.setZ(intersects[0].face.c, 0.1);

            intersects[0].object.geometry.attributes.color.needsUpdate = true;

            const initialColor = {
                r: 0.9,
                g: 0.9,
                b: 0.9,
            };

            const hoverColor = {
                r: 0,
                g: 0,
                b: 0,
            };

            gsap.to(hoverColor, {
                r: initialColor.r,
                g: initialColor.g,
                b: initialColor.b,
                duration: 1,
                onUpdate: () => {
                    // vertice 1
                    color.setX(intersects[0].face.a, hoverColor.r);
                    color.setY(intersects[0].face.a, hoverColor.g);
                    color.setZ(intersects[0].face.a, hoverColor.b);

                    // vertice 2
                    color.setX(intersects[0].face.b, hoverColor.r);
                    color.setY(intersects[0].face.b, hoverColor.g);
                    color.setZ(intersects[0].face.b, hoverColor.b);

                    // vertice 3
                    color.setX(intersects[0].face.c, hoverColor.r);
                    color.setY(intersects[0].face.c, hoverColor.g);
                    color.setZ(intersects[0].face.c, hoverColor.b);
                    color.needsUpdate = true;
                },
            });
        }
    }
    animate();
    addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    });
});
// });

const DEBUG = false;
const REPETITION_COUNT = 2; // number of times each pixel is assigned to a canvas
const NUM_FRAMES = 40;

/**
 * Generates the individual subsets of pixels that are animated to create the effect
 * @param {HTMLCanvasElement} ctx
 * @param {number} count The higher the frame count, the less grouped the pixels will look - Google use 32, but for our elms we use 128 since we have images near the edges
 * @return {HTMLCanvasElement[]} Each canvas contains a subset of the original pixels
 */
function generateFrames($canvas, count = 32) {
    const { width, height } = $canvas;
    const ctx = $canvas.getContext("2d");
    const originalData = ctx.getImageData(0, 0, width, height);
    const imageDatas = [...Array(count)].map((_, i) =>
        ctx.createImageData(width, height)
    );

    // assign the pixels to a canvas
    // each pixel is assigned to 2 canvas', based on its x-position
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            for (let i = 0; i < REPETITION_COUNT; ++i) {
                const dataIndex = Math.floor(
                    (count * (Math.random() + (2 * x) / width)) / 3
                );
                const pixelIndex = (y * width + x) * 4;
                // copy the pixel over from the original image
                for (let offset = 0; offset < 5; ++offset) {
                    imageDatas[dataIndex].data[pixelIndex + offset] =
                        originalData.data[pixelIndex + offset];
                }
            }
        }
    }

    // turn image datas into canvas'
    return imageDatas.map((data) => {
        const $c = $canvas.cloneNode(true);
        $c.getContext("2d").putImageData(data, 0, 0);
        return $c;
    });
}

/**
 * Inserts a new element over an old one, hiding the old one
 */
function replaceElementVisually($old, $new) {
    const $parent = $old.offsetParent;
    $new.style.top = `${$old.offsetTop}px`;
    $new.style.left = `${$old.offsetLeft}px`;
    $new.style.width = `${$old.offsetWidth}px`;
    $new.style.height = `${$old.offsetHeight}px`;
    $parent.appendChild($new);
    $old.style.visibility = "hidden";
}

/**
 * Disintegrates an element
 * @param {HTMLElement} $elm
 */
function disintegrate($elm) {
    html2canvas($elm).then(($canvas) => {
        // create the container we'll use to replace the element with
        const $container = document.createElement("div");
        $container.classList.add("disintegration-container");

        // setup the frames for animation
        const $frames = generateFrames($canvas, NUM_FRAMES);
        $frames.forEach(($frame, i) => {
            $frame.style.transitionDelay = `${(.5 * i) / $frames.length}s`;
            $container.appendChild($frame);
        });

        // then insert them into the DOM over the element
        replaceElementVisually($elm, $container);

        // then animate them
        $container.offsetLeft; // forces reflow, so CSS we apply below does transition
        if (!DEBUG) {
            // set the values the frame should animate to
            // note that this is done after reflow so the transitions trigger
            $frames.forEach(($frame) => {
                const randomRadian = 1 * Math.PI * (Math.random() - 1);
                $frame.style.transform = `rotate(${
          5 * (Math.random() - 1)
        }deg) translate(${200 * Math.cos(randomRadian)}px, ${
          5 * Math.sin(randomRadian)
        }px)
rotate(${5 * (Math.random() - 1)}deg)`;
                $frame.style.opacity = 0;
            });
        } else {
            $frames.forEach(($frame) => {
                $frame.style.animation = `debug-pulse 2s ease ${$frame.style.transitionDelay} infinite alternate-reverse`;
            });
        }
    });
}




// for sounds animations

var sound1 = new Howl({
    src: ['/chapter43_animated_website/assets/sounds/16-Transition-Stone-to-Flag.mp3'],
    volume: 1,
    html5: true,
});


var sound2 = new Howl({
    src: ['/chapter43_animated_website/assets/sounds/10-Zoom-Stone.mp3'],
    volume: 1,
    html5: true,
});

let second_page_animations_h1_c = document.querySelector(
    ".second_page_animations_h1"
);

let bar3 = document.querySelector('.bar-c');
let click = 0;

bar3.addEventListener('click', function(e) {

    // loop
    click += 1;

    if (click > 1) {
        sound1.pause();
        $(".bar").addClass("noAnim");
        $(".bar_img_mute").css('opacity', '1');
        click -= 2;
    } else if (click == 1) {
        sound1.play();
        $(".bar").removeClass("noAnim");
        $(".bar_img_mute").css('opacity', '0');
        click += 1;
    }

});

/** === Below is just to bind the module and the DOM == */
[...document.querySelectorAll(".disintegration-target")].forEach(($elm) => {

    $elm.addEventListener("click", () => {


        // $("body").find(".second_container").show(); //
        // $(".second_container .second_page_animations").show(); //
        if ($elm.disintegrated) {
            $("body").find(".first_page_animations").hide();
            $("body").find(".first_container").hide();
            $("body").find(".second_page_animations_h1").style.color = "#000";
            return;
        }
        $elm.disintegrated = true;
        disintegrate($elm);

        $(".bar").removeClass("noAnim");
        setTimeout(function() {
            $(".bar").removeClass("noAnim");
            $(".bar_img_mute").css('opacity', '0');
            sound1.play();
        }, 900);



        setTimeout(function() {
            $(".tap_transform").css('color', 'black');
            $(".bar").css("background-color", "#000");
            $(".bar").css("background", "#000");
            $(".bar").css("background", "#000");
            document.getElementById("img_bolt").src = "/chapter43_animated_website/assets/images/thin_bolt_black.png";
            document.getElementById("main_logo_left").src = "/chapter43_animated_website/assets/Data/Logo/6-01.png";
            document.getElementById("menu_icon_right").src = "/chapter43_animated_website/assets/images/burger2.svg";

        }, 2900);

        setTimeout(function() {
            $(".bar").addClass("noAnim");
            $(".bar_img_mute").css('opacity', '1');
        }, 3200);

    });

});

$(".bot_click").on('click', function() {
    window.location = "https://ayyan420.github.io/chapter43_animated_website/";
});

$(".Menu-btn,.close_icon").on('click', function() {
    $('.main_nav').fadeToggle(1000);
});




// ** === Below is just to bind the module and the DOM == */
[...document.querySelectorAll(".disintegration-target2")].forEach(($elm) => {
    $elm.addEventListener("click", () => {

        // $("body").find(".second_container").show(); //
        // $(".second_container .second_page_animations").show(); //
        if ($elm.disintegrated) {
            $(".main_logo").css("display", "none");
            $("body").find(".second_page_animations").hide();
            $("body").find(".second_container").hide();
            return;
        }
        $elm.disintegrated = true;
        disintegrate($elm);

        $(".bar").removeClass("noAnim");
        setTimeout(function() {
            $(".bar").removeClass("noAnim");
            $(".bar_img_mute").css('opacity', '0');

            bar3.addEventListener('click', function(e) {

                // loop
                click += 1;

                if (click == 1) {
                    sound2.pause();
                    $(".bar").addClass("noAnim");
                    $(".bar_img_mute").css('opacity', '1');


                    click += 1;
                } else if (click > 1) {
                    sound2.play();
                    $(".bar").removeClass("noAnim");
                    $(".bar_img_mute").css('opacity', '0');
                    click -= 2;
                }

            });
            sound2.play();
        }, 1200);

        setTimeout(function() {
            $(".bar").addClass("noAnim");
            $(".bar_img_mute").css('opacity', '1');
        }, 3200);

        setTimeout(function() {
            window.location = "/chapter43_animated_website/Pages/case_study.html";
        }, 3300);

    });
});
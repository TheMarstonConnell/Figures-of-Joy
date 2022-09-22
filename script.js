let x;

let noodles = [];

let drawing = true
let c;
let count;
let points;

function generateNoodles(width, height, speed, maxWidth, minWidth) {
    noodles = []



    for (let index = 0; index < count; index++) {
        let n = {
            x : fxrand() * 800,
            y : 0,
            xStep : 0,
            yStep: 0,
            timer: 0,
            maxLength: fxrand() * height / 4 * 2 + height / 4,
            canvas: createGraphics(width, height),
            rotationSpeed: speed,
            width: fxrand() * (maxWidth - minWidth) + minWidth,
            rotOffset: Math.floor(fxrand() * 360)
        }

        noodles.push(n)
    }

    return noodles
    
}

function chooseColor() {

    const choices = [
        {
            color: color(100, 100, 255),
            name: "Sage Green"
        },
        {
            color: color(200, 160, 255),
            name: "Mightnight Tempest"
        },
        {
            color: color(150, 200, 255),
            name: "Sapphire Moon"
        },
        {
            color: color(0, 160, 255),
            name: "Crimson Dagger"
        },
        {
            color: color(40, 100, 255),
            name: "Mudded Waters"
        }
    ]

    let choice = Math.floor(fxrand() * choices.length)

    return choices[choice]
}

function setup() {

    let w = 800
    let h = 800

    createCanvas(w, h);
    background(100)

    x = 0

    let rotation = fxrand() * 10 > 6

    let rSpeed = 0
    if (rotation) {
        rSpeed = fxrand() * 6
        rSpeed = rSpeed - rSpeed % 0.5
    }

    let minWidth = fxrand() * 50 + 20
    let maxWidth = fxrand() * 200 + minWidth + 20

    count = Math.floor(fxrand() * 60) + 20

    points = Math.floor(fxrand() * 5) + 3

    noodles = generateNoodles(w, h, rSpeed, maxWidth, minWidth)

    colorMode(HSB, 255);

    ccc = chooseColor()

    c = ccc.color

    window.$fxhashFeatures = {
        "Screwy": rotation,
        "Screw Speed": rSpeed,
        "Max Width": Math.floor(maxWidth),
        "Min Width": Math.floor(minWidth),
        "Total Count": count,
        "Points": points,
        "Color": ccc.name
    }

    console.log(window.$fxhashFeatures)
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function pFromC(cx, cy, angle, r) {
    let a = degrees_to_radians(angle)

    let X = cx + (r * Math.cos(a))  
    let Y = cy + (r * Math.sin(a))

    return {x:X, y:Y}
}

function buildShape(cx, cy, count, radius, rotation) {

    let points = []

    for (let index = 0; index < count; index++) {

        let spacing = 360 / count

        points.push(pFromC(cx, cy, (spacing * index + rotation) % 360, radius))
        
    }

    return points

}

function updateNoodle(noodle) {

    if ( noodle.timer > noodle.maxLength ) {
        return true
    }

    let distance = 2

    let xMod = 1
    let yMod = 2

    let xr = fxrand() * distance - distance / 2 * xMod
    let yr = fxrand() * distance - distance / 2 * yMod

    noodle.xStep = noodle.xStep + xr
    noodle.yStep = noodle.yStep + yr

    noodle.timer = noodle.timer + 1



    let nx = noodle.x + noodle.xStep
    let ny = noodle.y - noodle.yStep

    let radius = (1 - (noodle.timer / noodle.maxLength)) * noodle.width


    let rotation = noodle.rotationSpeed == 0 ? noodle.rotOffset : noodle.timer / noodle.rotationSpeed + noodle.rotOffset

    let ps = buildShape(nx, ny, points, radius, rotation)

    noodle.canvas.colorMode(HSB, 255);

    let h = hue(c)
    let s = saturation(c)
    let b = brightness(c)

    let bb = 255 * (noodle.timer / noodle.maxLength)

    noodle.canvas.fill(h, s, bb)

    noodle.canvas.noStroke();
    noodle.canvas.beginShape();
    for (const p of ps) {
        noodle.canvas.vertex(p.x, p.y);
    }
    
    noodle.canvas.endShape(CLOSE);
    return false
}

function draw() {

    if (!drawing) {
        return
    }
    background(c)

    let total = true

    let t = 0

    for (const n of noodles) {
        let done = updateNoodle(n)
        total = total && done
        image(n.canvas, 0, 0)
        t ++ 
        if (t % (Math.floor(count / 10)) == 0) {
            fill('rgba(0, 0, 0, 0.1)')
            rect(0, 0, 800, 800)
        }
        
    }
    if (total) {
        fxpreview()
        drawing = false
    }

}
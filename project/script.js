const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
//amanha fazer um efeito que sai do meio como se fosse a explosao
//canvas size
let canvasWidth = window.innerWidth * 0.8 ;
let canvasHeight = window.innerHeight * 0.7 ;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

//components
let go = document.getElementById("go");
let rst = document.getElementById("reset");
let gravity = document.querySelector('#gravity').value;
let yz = document.getElementById("y").value;
let xz = document.getElementById("x").value;
let velocity = document.getElementById("velocity").value;
let angle = document.getElementById("angle").value;
let t = 0;

let yzComp = document.getElementById("y");
let xzComp = document.getElementById("x");
let velocityComp = document.getElementById("velocity");
let angleComp = document.getElementById("angle");
let gravityComp = document.getElementById("gravity");


var timeSlider = document.getElementById("timeSlider");
var currentTimeDisplay = document.getElementById("currentTime");

let zoomin = document.getElementById("more");
let zoomout = document.getElementById("less");

// Reference to the table element
var table = document.querySelector('.table');

// Reference to the tbody element
var tbody = table.querySelector('tbody');

//position of axis
var centerX = window.innerWidth * 0.8 / 2 
var centerY = (window.innerHeight * 0.7 / 2) - 2

let maxTime = (((velocity * Math.sin(angle * Math.PI / 180)) + Math.sqrt( Math.pow(velocity * Math.sin(angle * Math.PI / 180), 2) - 0 + 2*gravity*yz )) / gravity);
//set max time of slider
timeSlider.setAttribute("max", maxTime);

//variables
let fire = false
let size; 
let stop = false;
// Calculate horizontal and vertical components of initial velocity
let velocityX = velocity * Math.cos(angle * Math.PI / 180);
let velocityY = velocity * Math.sin(angle * Math.PI / 180) - (gravity * t);
//buttons
go.addEventListener('click', function() {
    gravity = document.getElementById("gravity").value;
    yz = document.getElementById("y").value;
    xz = document.getElementById("x").value;
    velocity = document.getElementById("velocity").value;
    angle = document.getElementById("angle").value;
    t = 0;
    velocityX = velocity * Math.cos(angle * Math.PI / 180);
    console.log(angle)
    fire = true
    effectSize = 5;
    effectOpacity = 0.3; 
    effectColor1 = `${(Math.random() * 255) + 186}, ${(Math.random() * 255) + 24}, ${(Math.random() * 255) + 27}`;
    effectColor2 = `${(Math.random() * 255) + 229}, ${(Math.random() * 255) + 56}, ${(Math.random() * 255) + 59}`;
    maxTime = (((velocity * Math.sin(angle * Math.PI / 180)) + Math.sqrt( Math.pow(velocity * Math.sin(angle * Math.PI / 180), 2) - 0 + 2*gravity*yz )) / gravity);
    //set max time of slider
    timeSlider.setAttribute("max", maxTime);
});

rst.addEventListener('click', () => reset())

function reset() {
    gravity = 9.8;
    yz = 0;
    xz = 0;
    velocity = 70;
    angle = 45;
    t = 0;

    yzComp.value = 0;
    xzComp.value = 0;
    velocityComp.value = 70;
    angleComp.value = 45;
    gravityComp.value = 9.8;
    
    fire = false
    cameraZoom = 1
}
///time slider
timeSlider.addEventListener("input", function() {
    t = parseFloat(timeSlider.value);
    currentTimeDisplay.textContent = t.toFixed(2);
    draw() 
});

function updateTable() {

    var newData = [
        { x: ((particle.x - centerX + (window.innerWidth * 0.8 / 2)) ).toFixed(2), 
          y: (((- particle.y) + centerY - window.innerHeight * 0.7 / 2)).toFixed(2), 
          time: t.toFixed(2) ,
          vx: velocityX.toFixed(2),
          vy: velocityY.toFixed(2),
          v: this.vx + this.vy
        }
    ];

    let v =  (Math.sqrt( Math.pow(Number(newData[0].vx), 2) + Math.pow(Number(newData[0].vy), 2) )).toFixed(2)
    console.log(Math.pow(Number(newData[0].vx), 2), )
    tbody.innerHTML = '';
    
    var row = tbody.insertRow();
    newData.forEach(function (item) {

        var cellX = row.insertCell(0);
        cellX.textContent = item.x;

        var cellY = row.insertCell(1);
        cellY.textContent = item.y;

        var cellTime = row.insertCell(2);
        cellTime.textContent = item.time;

        var cellVx = row.insertCell(3);
        cellVx.textContent = item.vx;

        var cellVy = row.insertCell(4);
        cellVy.textContent = item.vy;

    });

    var cellV = row.insertCell(5);
    cellV.textContent = v;

    let maxY = ((Math.pow(velocity, 2) * Math.pow(Math.sin(angle * Math.PI / 180), 2)) / (2 * gravity)) + Number(yz);  //amanha achar eq
    let maxX = ((0 + velocity * Math.cos(angle * Math.PI / 180) * maxTime) ) + Number(xz); 
    
    var cellMaxY = row.insertCell(6);
    cellMaxY.textContent = maxY.toFixed(2);  
    
    var cellMaxX = row.insertCell(7);
    cellMaxX.textContent = maxX.toFixed(2); 

    var cellMaxT = row.insertCell(8);
    cellMaxT.textContent = maxTime.toFixed(2);
}

// Draw the axis
function drawAxis(){
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "#1c3332";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-window.innerWidth * 0.8, 0);
    ctx.lineTo(window.innerWidth * 0.8, 0);
    ctx.stroke();

    // Draw the y-axis
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, window.innerHeight * 0.7);
    ctx.lineTo(0, -window.innerHeight * 0.7)
    ctx.stroke();

    
}
var width = ctx.canvas.width;
var height = ctx.canvas.height;
function draw() {
    ctx.save();
    img()

    ctx.translate( window.innerWidth * 0.8 / 2, window.innerHeight * 0.7 / 2 )
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate( -window.innerWidth * 0.8 / 2 + cameraOffset.x, -window.innerHeight * 0.7 / 2 + cameraOffset.y )

    drawAxis()

    particle.update()
    particle.draw()  
    if (fire) {
        //fireEffect() 
    }
    ctx.restore()
}
function img () {

    const img = new Image(); // Create new img element
    img.src = "1.png"; // Set source path

    const img4 = new Image(); // Create new img element
    img4.src = "4.png"; // Set source path
    // Wait for the image to load
    img.onload = function () {
        ctx.drawImage(img, 0, 0, window.innerWidth * 0.8 , window.innerHeight * 0.7 ); // Adjusted coordinates
        ctx.drawImage(img4, 0, 0, window.innerWidth * 0.8, window.innerHeight * 0.7); // Adjusted coordinates
    };
}
class Particle{
    constructor(x, y, s, size){
        this.x = x;
        this.y = y;
        this.size = 2;      
    }
    
    update(){ 
        this.y = (-(0 + velocity * Math.sin(angle * Math.PI / 180) * t - ((gravity * Math.pow(t, 2)) / 2)) ) + (centerY - ( yz)) - window.innerHeight * 0.7 / 2;
        this.x = ((0 + velocity * Math.cos(angle * Math.PI / 180) * t) ) + Number(centerX) + Number(xz) - window.innerWidth * 0.8
     / 2; 
        
        if (fire && t + 0.02 <= maxTime) {
            t += 0.05;  /// thats the problem check if its iqual to max time before adding up
        } else if (t + 0.02 > maxTime) {
            t = maxTime
        }
             
        timeSlider.value = t;
        currentTimeDisplay.textContent = t.toFixed(2);
        velocityY = (velocity * Math.sin(angle * Math.PI / 180) - gravity * t);

        updateTable()
        
        if (t >= maxTime) fire = false

    }

    draw(){  
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "#ff0000"; 
        ctx.fillStyle = "#000000";    
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill(); 
        ctx.stroke();    
    }
}

//iniciar
let particle
function init() {
    particle = new Particle(centerX, centerY - yz, size) 
    draw()
}

window.addEventListener('load', init);

let cameraOffset = { x: window.innerWidth * 0.8 / 2, y: window.innerHeight * 0.7 / 2}
let cameraZoom = 1
let MAX_ZOOM = 6
let MIN_ZOOM = 1
let SCROLL_SENSITIVITY = 0.005

function animate(){
    draw()

    requestAnimationFrame(animate);  

}

let effectSize = 5;
let effectOpacity = 0; 
let effectColor1 = `rgba(186, 24, 27, ${effectOpacity})`;
let effectColor2 = `rgba(229, 56, 59, ${effectOpacity})`;

function fireEffect() { 
     
    ctx.fillStyle = `rgba(${effectColor1}, ${effectOpacity})`;;  
    ctx.beginPath();
    ctx.arc(0, 0, effectSize * 3, 0, Math.PI * 2);
    ctx.fill(); 

    // ctx.fillStyle = `rgba(${effectColor2}, ${effectOpacity})`;  
    // ctx.beginPath();
    // ctx.arc( window.innerWidth * 0.8 / 2, window.innerHeight * 0.7 / 2, effectSize, 0, Math.PI * 2);
    // ctx.fill();
    
    if (effectSize < 200) {
        effectSize *= 1.3
    } else if (effectSize > 200 && effectSize < 350){
        effectOpacity -= 0.08
        effectSize += 5
    }
}

// Zoom by chengarda on code pen///////////////////////////////////////////////
// https://codepen.io/chengarda/pen/wRxoyB
// Gets the relevant location from a mouse or single touch event
function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}

function drawRect(x, y, width, height)
{
    ctx.fillRect( x, y, width, height )
}

let isDragging = false
let dragStart = { x: 0, y: 0 }

function onPointerDown(e)
{
    isDragging = true
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y
}

function onPointerUp(e)
{
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

function onPointerMove(e)
{
    if (isDragging)
    {
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y
    }
    
}

function handleTouch(e, singleTouchHandler)
{
    if ( e.touches.length == 1 )
    {
        singleTouchHandler(e)
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
        isDragging = false
        handlePinch(e)
    }
}

let initialPinchDistance = null
let lastZoom = cameraZoom

function handlePinch(e)
{
    e.preventDefault()
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
    
    if (initialPinchDistance == null)
    {
        initialPinchDistance = currentDistance
    }
    else
    {
        adjustZoom( null, currentDistance/initialPinchDistance )
    }
}

function adjustZoom(zoomAmount, zoomFactor)
{
    if (!isDragging)
    {
        if (zoomAmount)
        {
            cameraZoom += zoomAmount
        }
        else if (zoomFactor)
        {
            //console.log(zoomFactor)
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
        
        //console.log(zoomAmount)
    }
}

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*-SCROLL_SENSITIVITY))

// Ready, set, go

init()
    
animate();


//equações/////////////////////////////////////////////////////////////////

// vy = v0y – g.t
// y = y0 + v0y.t – gt² / 2

// v0x = v0 .cosθ
// x= x0 + v0x.t 
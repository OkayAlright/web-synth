/*
synth.js

    a collection of functions and declarations 
    for csmarlboro.org/ldavis to run a web-page
    synth

Resources:
    For the audio, I just referenced W3C's documentation
    on the WebAudio API: http://webaudio.github.io/web-audio-api/

    For the visual component, I am using some altered code for 
    chrisdavidmills's voice-change-o-matic found here:
    https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js#L123-L167

Logan Davis | 2/5/16 | editor: emacs 
*/

var context = new (window.AudioContext || window.webkitAudioContext)();  //for cross-browser purposes


var canvas = document.querySelector('.visual'); //canvas element
var canvasCtx = canvas.getContext("2d");
canvas.width = document.getElementById("ruler").offsetWidth; //resize for new screen


var analyser= context.createAnalyser();      //Visual context objects
analyser.fftSize = 4096;//2**12
var bufferLength = analyser.fftSize;
var dataArray = new Uint8Array(bufferLength);

var osc1 = context.createOscillator();          //Audio context objects
var osc2 = context.createOscillator();
var osc3 = context.createOscillator();
var gainNode1 = context.createGain();
var gainNode2 = context.createGain();
var gainNode3 = context.createGain();

osc1.type = 'sine'; //sine wave                 OSC 1
osc1.frequency.value = 440.0; // note = A
gainNode1.gain.value = 0.5;

osc2.type = 'sine';                           // OSC 2
osc2.frequency.value = 880.0;
gainNode2.gain.value = 0.25;

osc3.type = 'sine';                           // OSC 3
osc3.frequency.value = 220.0;
gainNode3.gain.value = 1.0;




osc1.connect(gainNode1);                       //chaining nodes
osc2.connect(gainNode2);
osc3.connect(gainNode3);
gainNode1.connect(analyser);
gainNode2.connect(analyser);
gainNode3.connect(analyser);
analyser.connect(context.destination);


osc1.start(0);                                  //start audio
osc2.start(0);
osc3.start(0);

function visualize(){
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var drawVisual;

    canvasCtx.clearRect(0,0,WIDTH,HEIGHT);
    
    drawVisual = requestAnimationFrame(draw);
    function draw() {

	drawVisual = requestAnimationFrame(draw);

	analyser.getByteTimeDomainData(dataArray);

	canvasCtx.fillStyle = 'rgb(255, 255, 255)';
	canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

	canvasCtx.lineWidth = 2;
	canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

	canvasCtx.beginPath();

	var sliceWidth = WIDTH * 1.0 / bufferLength;
	var x = 0;

	for(var i = 0; i < bufferLength; i++) {
   
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
		canvasCtx.moveTo(x, y);
            } else {
		canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
	}

	canvasCtx.lineTo(canvas.width, canvas.height/2);
	canvasCtx.stroke();
    };

    draw();
    
}

setInterval(visualize(),1000/30);  //to update canvas



function changeGain(sliderVal, node){
    node.gain.value = sliderVal/100.0;
}

function changeWave(wave, osc){
    osc.type = wave;
}

function changePitch(sliderVal, osc){
    osc.frequency.value = sliderVal;
}

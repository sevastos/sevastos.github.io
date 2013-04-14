/**************************/
/******* SIMPLE BASE ******/
/**************************/

var MindController = {
	debug: false,

	browserPrefixes : ['-webkit-', '-moz-', '-ms-', '-o-', ''],

	cacheEls: null,

	init: function(faceEls) {
		var that = this;
		$(document).ready(function(){
			that.cacheEls = $(faceEls);
		});
	},

	/**
	 * Set head's angle (with CSS transforms)
	 * @param {Float} degrees Degrees of rotation on Y axis
	 */
	setAngle: function(degrees) {
		if (this.debug) {
			console.log('Setting Head Angle to: ' + degrees + ' degrees');
		}

		// change face orientation
		var transform = 'rotateY('+degrees+'deg)';
		this.setCss(this.cacheEls, 'transform', transform);
	},

	/**
	 * Set head's perspective (with CSS)
	 * @param {Integer} perspective CSS perspective value in pixels
	 */
	setPerspective: function(perspective) {
		if (this.debug) {
			console.log('Setting Head Perspective to: ' + perspective + ' (px)');
		}

		// change face depth
		var perspective = perspective + 'px'; //TODO check px removal
		this.setCss(this.cacheEls, 'perspective', perspective);

	},


	/**
	 * Helping function to set cross browser CSS
	 * @param {jQuery} el jQuery wrapped DOM element
	 * @param {String} attr CSS attribute name
	 * @param {String} value Value for the attribute
	 */
	setCss: function(el, attr, value) {
		var props = {};
		for (var i = this.browserPrefixes.length - 1; i >= 0; i--) {
			props[this.browserPrefixes[i] + attr] = value;
		};
		el.css(props);
	},
	ab: false
};


MindController.init('.face-canvas > *');


/**************************/
/****** HEAD TRACKING *****/
/**************************/

var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var htracker = new headtrackr.Tracker({});
htracker.init(videoInput, canvasInput);
htracker.start();
var lastX = 0, lastZ = 0;
document.addEventListener('headtrackingEvent', function(event) {
	////////////////
	/////// X //////

	var curX = Math.round(event.x), // or Math.round(event.x * 10) / 10

		baseZ = 30, // base CM of Z axis - lower to increase angle
		angleScale = 0.5, // lower to make max angle smaller
		headAngle = Math.atan2(baseZ, event.x) * 180 / Math.PI - 90; // Real angle
	headAngle = Math.round(headAngle * 100) / 100 * angleScale; // "Smoothen" angle


	if(lastX !== curX){
		MindController.setAngle(headAngle);
	}

	////////////////
	/////// Z //////

	// in cm's
	// 10 min
	// 25 - 30 maybe warn user
	// 40 - 60 normal
	// 200 max
	var curZ = Math.round(event.z * 100) / 100;
	if (lastZ !== curZ || lastX !== curX) {
		if(curZ < 30) {
			//TODO: danger alert user to stay back
		}

/*		var perspective = min +
						(distanceFromScreen/maxDistFromScreen * idealPerspective / 80) +
						(headAngle/maxHeadAngle * idealPerspective / 20);*/
		var idealPerspective = 2000,//1500,
			maxIdealHeadAngle = 9, //18,
			distanceFromScreen = curZ,
			idealDistFromScreen = 55;
		var perspective = 1500 + //$('#perspective').attr('min') +
						//((170 - (curZ/170)) * idealPerspective * 0.8) +
						((distanceFromScreen/idealDistFromScreen) * idealPerspective * -0.5) +
						(Math.abs(headAngle)/maxIdealHeadAngle * idealPerspective * 0.5);


		MindController.setPerspective(perspective);
	}


	lastX = curX;
	lastZ = curZ;


}, false);


// for each facetracking event received draw rectangle around tracked face on canvas
var canvasOverlay = document.getElementById('overlay');
var overlayContext = canvasOverlay.getContext('2d');
//document.addEventListener("facetrackingEvent", function( event ) {
document.addEventListener("facetrackingEvent", function( event ) {
	// clear canvas
	overlayContext.clearRect(0,0,320,240);
	// once we have stable tracking, draw rectangle
	if (event.detection == "CS") {
		overlayContext.translate(event.x, event.y)
		overlayContext.rotate(event.angle-(Math.PI/2));
		overlayContext.strokeStyle = "#00CC00";
		overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
		overlayContext.rotate((Math.PI/2)-event.angle);
		overlayContext.translate(-event.x, -event.y);
	}
});








/*************************************/
/******** SVG TO HTML5 els ***********/
/*************************************/
function handleSVGs(){
	var that = this,
		w = that.width || that.naturalWidth,
		h = that.height || that.naturalHeight;

	that.dataset['handled'] ='1';

	$.ajax({
		url: that.src,
		dataType: 'text',
		success:
		function(data){
			$(that)
				.replaceWith(
					data
						.replace(/width="[^"]*"/, 'width="'+ w +'"')
						.replace(/height="[^"]*"/, 'height="'+ h +'"')
				);
		}
	});
}

$('img[src$="svg"]')
	.bind('ready load error', handleSVGs)
	.not('[handled]')
		.each(function(){
			handleSVGs.apply(this);
		});


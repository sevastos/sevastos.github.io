/**************************/
/******* SIMPLE BASE ******/
/**************************/

var MindController = {
	debug: false,

	browserPrefixes : ['-webkit-', '-moz-', '-ms-', '-o-', ''],

	cacheObj: {}, // Prefs
	cachedEls: {}, // Actual cached elements
	originalTransform: {},

	/* Config */
	config: {
		// Warn Distance for users that get too close
		warnDistanceZ : 30, //cm's of distance between Camera & User
		warnDistanceMaxBlur: 10 //px blur radius
	},

	// Depth adjustments
	// Margin %
	sides: {
		// less outwards
		left : {
			'in' : 14,
			'out': 17
		},
		//more outwards
		right: {
			'in' : 38,
			'out': 35
		}
	},

	/* Runtime */
	run: {
		blur: 0

	},

	/**
	 * Initialize stuff (DOM elements etc.)
	 * @param  {Object} elsToCache Selector of elements ,that depend on perspective or rotation, to cache
	 */
	init: function(elsToCache) {
		this.cacheObj = elsToCache;
		var that = this;
		$(document).ready(function(){
			that.recacheDom(true);
		});
	},

	/**
	 * Recache the DOM elements involved
	 */
	recacheDom: function(first){
		for (var attr in this.cacheObj) {
			this.cachedEls[attr] = $(this.cacheObj[attr]);
/*			if (first) {
				this.getTransform(this.cachedEls[attr]);
			}*/
		}
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
		this.setCss(this.cachedEls['rotation'], 'transform', transform);

		return this;
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
		this.setCss(this.cachedEls['perspective'], 'perspective', perspective);

		return this;
	},

	/**
	 * Set the blur filter in case the user gets too close to the screen
	 * @param {Float} distanceZ Distance of user<->screen in cm's
	 */
	setBlur: function(distanceZ) {
		console.log('distance Z:', distanceZ);
		if (distanceZ <= this.config.warnDistanceZ) {
			var blur;
			blur = (this.config.warnDistanceZ - distanceZ);
			blur = (blur / this.config.warnDistanceZ) * this.config.warnDistanceMaxBlur; //scale
			blur = Math.round(blur);// / 10;
			if (this.run.blur !== blur) {
				console.log('distance Z:', distanceZ, ' => ', blur, 'NEW');
				this.run.blur = blur;
				this.setCss(this.cachedEls['wrapper'], 'filter', 'blur(' + blur + 'px)');
			} else {
				console.log('distance Z:', distanceZ, ' => ', blur, 'SKIPPED');
			}
		} else {
			if (this.run.blur !== 0) {
				console.log('distance Z:', distanceZ, ' => ', 'NO');
				this.run.blur = 0;
				this.setCss(this.cachedEls['wrapper'], 'filter', '');
			}
		}
	},


	/**
	 * [setExtraDepth description]
	 * @param {[type]} side   [description]
	 * @param {[type]} factor 0 - 1
	 */
	setExtraDepth: function(factor, angle) {
		/*var side;
		if (angle > 0) {
			side = 'left';
		} else if (angle < 0) {
			side = 'right';
		} else {

		}*/
		var sides = ['left', 'right'];
		for (var i in sides) {
			var side = sides[i];
			var margin = ((this.sides[side]['in'] - this.sides[side]['out']) * factor)
					   + this.sides[side]['out'];
			if (angle > 0 && side === 'left' || angle < 0 && side === 'right') {
				margin = Math.round(margin * 100) / 100;
			} else {
				margin = this.sides[side]['out'];
			}

			this.cachedEls[side+'Side'].css('margin-left', margin + '%');
		}
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

/*	getTransform: function(el) {
		for (var i = this.browserPrefixes.length - 1; i >= 0; i--) {
			var val = el.css(this.browserPrefixes[i] + 'transform');
			console.log('transf', val);
		};
	}*/

};


// > :not(svg)
MindController.init({
	wrapper: 'header.has-face',
	perspective: '.face-canvas',
	rotation: '.face-canvas > *:not(.face-shadow)',
	leftSide: '.face-side-left',
	rightSide: '.face-side-right'
});


/**************************/
/****** HEAD TRACKING *****/
/**************************/

var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var debugCanvas = document.getElementById('debugCanvas');

var htracker = new headtrackr.Tracker({
		altVideo:{},
		debug: debugCanvas
	});
htracker.init(videoInput, canvasInput);
htracker.start();
var lastX = 0, lastZ = 0, firstTrigger = true;
document.addEventListener('headtrackingEvent', function(event) {
	// First time
	if (firstTrigger) {
		firstTrigger = false;
		MindController.cachedEls['wrapper'].removeClass('is-waiting');
	}


	////////////////
	/////// X //////

	var curX = Math.round(event.x), // or Math.round(event.x * 10) / 10

		baseZ = 40, // base CM of Z axis - lower to increase angle
		angleScale = 0.314, // lower to make max angle smaller
		headAngle = Math.atan2(baseZ, event.x) * 180 / Math.PI - 90; // Real angle
	headAngle = Math.round(headAngle * 100) / 100 * angleScale; // "Smoothen" angle


	if(lastX !== curX){
		MindController.setAngle(headAngle * 0.8);
	}

	////////////////
	/////// Z //////


	// in cm's
	// 10 min
	// 25 - 30 maybe warn user
	// 40 - 60 normal
	// 200 max
	var curZ = Math.round(event.z * 10) / 10;


	var angleMax = 9,
		perspectiveMin = 590, //280, //230, //330,
		perspectiveMax = 666;

	var idealPerspective = 600,//1500,
		maxIdealHeadAngle = 9, //18, 5, //
		distanceFromScreen = curZ,
		idealDistFromScreen = 55;
	if (lastZ !== curZ || lastX !== curX) {

		MindController.setBlur(curZ);

/*		var perspective = min +
						(distanceFromScreen/maxDistFromScreen * idealPerspective / 80) +
						(headAngle/maxHeadAngle * idealPerspective / 20);*/


		var perspective = /*perspectiveBase*/ //$('#perspective').attr('min') +
						//((170 - (curZ/170)) * idealPerspective * 0.8) +
						/*+*/ (Math.abs(headAngle)/maxIdealHeadAngle * idealPerspective * 0.5)
						- ((distanceFromScreen/idealDistFromScreen) * idealPerspective * 0.2);
			$('#calc1').text((Math.abs(headAngle)/maxIdealHeadAngle * idealPerspective * 0.5));
			$('#calc2').text(((distanceFromScreen/idealDistFromScreen) * idealPerspective * 0.5));
			$('#calc3').text(perspective);
			perspective = Math.max(perspectiveMin, perspective); //(perspective < perspectiveMin?perspectiveMin:perspective);
			perspective = Math.min(perspectiveMax, perspective);
			$('#calc4').text(perspective);



		MindController.setPerspective(Math.round(perspective));
	}

	// Extra movement of the sides
	var absHeadAngle = Math.abs(headAngle);
	var factor = Math.pow(absHeadAngle, 2) / Math.pow(maxIdealHeadAngle, 2);
	//var factor = (absHeadAngle > 1 ? Math.pow(absHeadAngle, 2) : 0) / maxIdealHeadAngle;
	factor = Math.round(factor * 100) / 100;
	factor = (factor > 1 ? 1 : factor);
	$('#calc5').text(factor);
	MindController.setExtraDepth(factor, headAngle);


	lastX = curX;
	lastZ = curZ;


}, false);





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
			//var faceCanvas = $('.face-canvas');
			//faceCanvas.animate({opacity: 0}, 1000);

			//setTimeout(function(){
				$(that)
					.replaceWith(
						data
							.replace('<svg ', '<svg style="opacity:0" ')
							.replace(/width="[^"]+"/, 'width="'+ w +'px"')
							.replace(/height="[^"]+"/, 'height="'+ h +'px"')
					);

				MindController.recacheDom();
			//	faceCanvas.animate({opacity: 1}, 1000);
			//}, 1000);
		}
	});
}

if (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
	$('.js-svg-to-html')
		.bind('ready load error', handleSVGs)
		.not('[handled]')
			.each(function(){
				handleSVGs.apply(this);
			});
} else {
	// TODO: Use SVG -> Canvas
}


/*** DEBUG ***/

$('#range-rotation, #range-depth').change(function() {

	if(this.id === 'range-depth') {
		MindController.setPerspective(this.value);
	} else if(this.id === 'range-rotation') {
		MindController.setAngle(this.value);
	}
});

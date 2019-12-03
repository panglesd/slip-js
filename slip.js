function parseAndFormat () {
    let presentationElement = document.querySelector(".presentation");
    presentationElement.innerHTML =
'	<div id="open-window">\
	    <div class="format-container">\
	    <div class="rotate-container">\
		<div class="scale-container">\
		    <div class="universe movable" id="universe">\
			<div width="10000" height="10000" class="fog"></div>\
			<canvas style="position:absolute;top:0;left:0;z-index:-2" width="10000" height="10000" id="globalCanvas" class="background-canvas"></canvas>\
' + presentationElement.innerHTML + '\
		    </div>\
		</div>\
		</div>\
	    </div>\
	</div>\
	<div class="cpt-slip">0</div>';
    presentationElement.querySelectorAll(".slide").forEach((slideElem) => {
	slideElem.innerHTML = '\
    <div class="slide-rotate-container"><canvas style="position:absolute;top:0;left:0;z-index:-2" width="1440" height="1080" class="background-canvas" id="canvas-'+slideElem.id+'"></canvas><div class="slide-container">'+ slideElem.innerHTML + '\
</div>';
    });
    // document.querySelector(".globalCanvas").addEventListener("click", (ev) => { console.log("vous avez cliquez aux coordonées : ", ev.layerX, ev.layerY); });
    document.querySelectorAll(".background-canvas").forEach((elem)=> {elem.addEventListener("click", (ev) => { console.log("vous avez cliquez aux coordonnées : ", ev.layerX, ev.layerY); });});
    
}
parseAndFormat();

let Engine = function() {
    // Constants
    document.body.style.cursor = "auto";
    let timeOutIds = [];
    document.body.addEventListener("mousemove", (ev) => {
	timeOutIds.forEach((id) => { clearTimeout(id); });
	document.body.style.cursor = "auto";
	timeOutIds.push(setTimeout(() => { document.body.style.cursor = "none";}, 5000));
    });
    let openWindow = document.querySelector("#open-window");
    let universe = document.querySelector("#universe");
    let slides = universe.querySelectorAll(".slide");
    let browserHeight, openWindowWidth;
    let browserWidth, openWindowHeight;
    this.getOpenWindowHeight = () => openWindowHeight;
    this.getOpenWindowWidth = () => openWindowWidth;

    let winX, winY;
    let currentScale, currentRotate;

    this.moveWindow = function (x, y, scale, rotate, delay) {
	console.log("move to", x, y, "with scale, rotate, delay", scale, rotate, delay);
	currentScale = scale;
	currentRotate = rotate;
	winX = x ;
	winY = y;
	console.log(x,y);
	document.querySelector(".scale-container").style.transitionDuration = delay+"s";
	document.querySelector(".rotate-container").style.transitionDuration = delay+"s";
	universe.style.transitionDuration = delay+"s, "+delay+ "s"; 
	universe.style.left = -(x*1440 - 1440/2)+"px";
	universe.style.top = -(y*1080 - 1080/2)+"px";
	document.querySelector(".scale-container").style.transform = "scale("+(1/scale)+")";
	document.querySelector(".rotate-container").style.transform = "rotate("+(rotate)+"deg)";
    };
    this.moveWindowRelative = function(dx, dy, dscale, drotate, delay) {
	this.moveWindow(winX+dx, winY+dy, currentScale+dscale, currentRotate+drotate, delay);
    };
    this.placeSlides = function () {
	let posX = 0.5;
	let posY = 0.5;
	slides.forEach((slide) => {
	    let x=parseFloat(slide.getAttribute("pos-x")), y=parseFloat(slide.getAttribute("pos-y"));
	    let scale = parseFloat(slide.getAttribute("scale"));
	    let rotate = 0;
	    scale = isNaN(scale) ? 1 : scale ;
	    x = (isNaN(x) ? posX : x);
	    y = (isNaN(y) ? posY : y);
	    slide.setAttribute("pos-x", x);
	    slide.setAttribute("pos-y", y);
	    slide.setAttribute("scale", scale);
	    slide.setAttribute("rotate", rotate);
	    posX = x + 1;
	    posY = y;
	    slide.style.top = (y*1080 - 1080/2)+"px";
	    slide.style.left = (x*1440 - 1440/2)+"px";
	    if(!slide.classList.contains("permanent"))
		slide.style.zIndex = "-1";
	    slide.style.transformOrigin = "50% 50%";
	    slide.style.transform = "scale("+scale+")";

	});	
    };
    this.placeSlides();
    this.placeOpenWindow = function () {
	browserHeight = window.innerHeight;
	browserWidth = window.innerWidth;
	if(browserHeight/3 < browserWidth/4) {
	    openWindowWidth = Math.floor((browserHeight*4)/3);
	    openWindowHeight = browserHeight;
	    openWindow.style.left = ((window.innerWidth - openWindowWidth) /2)+"px";
	    openWindow.style.right = ((window.innerWidth - openWindowWidth) /2)+"px";
	    openWindow.style.width = (openWindowWidth)+"px";
	    openWindow.style.top = "0";
	    openWindow.style.bottom = "0";
	    openWindow.style.height = (openWindowHeight)+"px";
	}
	else {
	    openWindowHeight = Math.floor((browserWidth*3)/4);
	    openWindowWidth = browserWidth;
	    openWindow.style.top = ((window.innerHeight - openWindowHeight) /2)+"px";
	    openWindow.style.bottom = ((window.innerHeight - openWindowHeight) /2)+"px";
	    openWindow.style.height = (openWindowHeight)+"px";
	    openWindow.style.right = "0";
	    openWindow.style.left = "0";
	    openWindow.style.width = openWindowWidth+"px";
	}
	document.querySelector(".scale-container").style.transformOrigin = (1440/2)+"px "+(1080/2)+"px";
	document.querySelector(".rotate-container").style.transformOrigin = (1440/2)+"px "+(1080/2)+"px";
	document.querySelector(".format-container").style.transform = "scale("+(openWindowWidth/1440)+")";
	document.querySelector(".cpt-slip").style.right =  (parseInt(openWindow.style.left)) + "px";
	document.querySelector(".cpt-slip").style.bottom =  "0";
	document.querySelector(".cpt-slip").style.zIndex =  "10";
    };
    this.placeOpenWindow();
    window.addEventListener("resize", (ev) => {
	this.placeOpenWindow();
	this.moveWindow(winX, winY, currentScale, currentRotate, 0);
    });
    
};

let Controller = function (ng, pres) {
    let engine = ng;
    this.getEngine = () => this.engine;
    this.setEngine = (ng) => this.engine = ng;

    let presentation = pres;
    this.getPresentation = () => presentation;
    this.setPresentation = (pres) => presentation = pres;

    let speedMove=1;
    document.addEventListener("keypress", (ev) => {
	if(ev.key == "f") { speedMove = (speedMove + 4)%30+1; }    
	if(ev.key == "r") { presentation.refresh(); }    
	if(ev.key == "#") {
	    document.querySelectorAll(".slide").forEach((slide) => {slide.style.zIndex = "-1";});
	    document.querySelectorAll(".background-canvas").forEach((canvas) => {canvas.style.zIndex = "1";});
	}    
    });
    document.addEventListener("keydown", (ev) => {
	let openWindowHeight = engine.getOpenWindowHeight();
	let openWindowWidth = engine.getOpenWindowWidth();
	if(ev.key == "l") { engine.moveWindowRelative( 0                          ,  (speedMove)/openWindowHeight, 0, 0, 0.1); }   // Bas
	if(ev.key == "o") { engine.moveWindowRelative( 0                          , -(speedMove)/openWindowHeight, 0, 0, 0.1); }  // Haut
	if(ev.key == "k") { engine.moveWindowRelative(-(speedMove)/openWindowWidth,  0                           , 0, 0, 0.1); }   // Gauche
	if(ev.key == "m") { engine.moveWindowRelative( (speedMove)/openWindowWidth,  0                           , 0, 0, 0.1); }   // Droite
	if(ev.key == "i") { engine.moveWindowRelative(0, 0,  0   ,  1, 0.1); }                             // Rotate 
	if(ev.key == "p") { engine.moveWindowRelative(0, 0,  0   , -1, 0.1); }                             // Unrotate
	if(ev.key == "z") { engine.moveWindowRelative(0, 0,  0.01,  0, 0.1); }                          // Zoom
	if(ev.key == "Z") { engine.moveWindowRelative(0, 0, -0.01,  0, 0.1); }                          // Unzoom
	if(ev.key == "ArrowRight") {
	    console.log(ev);
	    if(ev.shiftKey)
		presentation.nextSlide();
	    else    
		presentation.next();
	}
	else if (ev.key == "ArrowLeft") {
	    if(ev.shiftKey)
		presentation.previousSlide();
	    else    
		presentation.previous();
	}
    });  
    
};


function Slide (name, actionL, present, ng, options) {
    let engine = ng;
    this.getEngine = () => engine;
    this.setEngine = (ng) => engine = ng;
    
    let presentation = present;
    this.getPresentation = () => presentation;
    this.setPresentation = (present) => presentation = present;
    
    this.element = document.querySelector(".slide#"+name);
    let initialHTML = this.element.outerHTML;
    let innerHTML = this.element.innerHTML;

    this.x = parseFloat(this.element.getAttribute("pos-x"));
    this.y = parseFloat(this.element.getAttribute("pos-y"));
    this.currentX = this.x;
    this.currentY = this.y;
    this.scale = parseFloat(this.element.getAttribute("scale"));
    this.rotate = parseFloat(this.element.getAttribute("rotate"));
    this.delay = isNaN(parseFloat(this.element.getAttribute("delay"))) ? 0 : (parseFloat(this.element.getAttribute("delay")));

    this.query = (quer) => this.element.querySelector(quer);
    this.queryAll = (quer) => this.element.querySelectorAll(quer);
    let actionList = actionL;
    let actionIndex=0;
    this.setActionIndex = (actionI) => actionIndex = actionI;
    this.getActionIndex = () => actionIndex;
    this.setAction = (actionL) => {actionList = actionL;};
    this.setNthAction = (n,action) => {actionList[n] = action;};

    this.hideAndShow = () => {
	this.queryAll("*[mk-hidden-at]").forEach((elem) => {
	    let hiddenAt = elem.getAttribute("mk-hidden-at").split(" ").map((str) => parseInt(str));
	    if(hiddenAt.includes(actionIndex))
		elem.style.opacity = "0";});	
	this.queryAll("*[mk-visible-at]").forEach((elem) => {
	    let visibleAt = elem.getAttribute("mk-visible-at").split(" ").map((str) => parseInt(str));
	    if(visibleAt.includes(actionIndex))
		elem.style.opacity = "1";});	
	this.queryAll("*[mk-emphasize-at]").forEach((elem) => {
	    let emphAt = elem.getAttribute("mk-emphasize-at").split(" ").map((str) => parseInt(str));
	    if(emphAt.includes(actionIndex))
		elem.classList.add("emphasize");});	
	this.queryAll("*[mk-unemphasize-at]").forEach((elem) => {
	    let unemphAt = elem.getAttribute("mk-unemphasize-at").split(" ").map((str) => parseInt(str));
	    if(unemphAt.includes(actionIndex))
		elem.classList.remove("emphasize");});	
	this.queryAll("*[emphasize-at]").forEach((elem) => {
	    let emphAt = elem.getAttribute("emphasize-at").split(" ").map((str) => parseInt(str));
	    if(emphAt.includes(actionIndex))
		elem.classList.add("emphasize");
	    else
		elem.classList.remove("emphasize");
	});	
	this.queryAll("*[chg-visib-at]").forEach((elem) => {
	    let visibAt = elem.getAttribute("chg-visib-at").split(" ").map((str) => parseInt(str));
	    console.log("fromHideAndShow", actionIndex);
	    if(visibAt.includes(actionIndex))
		elem.style.opacity = "1";
	    if(visibAt.includes(-actionIndex))
		elem.style.opacity = "0";
	});	
	    
    };
    
    this.next = function (presentation) {
	if(actionIndex >= this.getMaxNext())
	    return false;
	actionIndex = actionIndex+1;
	this.hideAndShow();
	this.queryAll("*[down-at]").forEach((elem) => {
	    let goDownTo = elem.getAttribute("down-at").split(" ").map((str) => parseInt(str));
	    if(goDownTo.includes(actionIndex))
		this.moveDownTo(elem, 1);});
	this.queryAll("*[up-at]").forEach((elem) => {
	    let goTo = elem.getAttribute("up-at").split(" ").map((str) => parseInt(str));
	    if(goTo.includes(actionIndex))
		this.moveUpTo(elem, 1);});
	this.queryAll("*[center-at]").forEach((elem) => {
	    let goDownTo = elem.getAttribute("center-at").split(" ").map((str) => parseInt(str));
	    if(goDownTo.includes(actionIndex))
		this.moveCenterTo(elem, 1);});
	if(typeof actionList[actionIndex-1] == "function")
	    actionList[actionIndex-1](this);
	return true;
    };
    this.firstVisit = () => {
	if(options.firstVisit)
	    options.firstVisit(this);
    };
    this.init = () => {
	if(options.init)
	    options.init(this);
	this.hideAndShow();
    };
    this.whenLeaving = () => {
	if(options.whenLeaving)
	    options.whenLeaving(this);
    };
	
    this.refresh = () => {
	this.setActionIndex(0);
	console.log(this.element);
	// this.element.outerHTML = initialHTML;
	this.element.innerHTML = innerHTML;
	// if(MathJax && typeof Mathjax.typeset == "function")
	//     MathJax.typeset();
	this.init();
	this.firstVisit();
	console.log("ai", actionIndex);
    };
    this.init(this, presentation, engine);
    this.moveUpTo = (selector, delay,  offset) => {
	let elem;
	if(typeof selector == "string") elem = this.query(selector);
	else elem = selector;
	if (typeof offset == "undefined") offset = 0.0125;
	let d = ((elem.offsetTop)/1080-offset)*this.scale;
	this.currentX = this.x;
	this.currentY = this.y+d;
	engine.moveWindow(this.x, this.y+d, this.scale, this.rotate, delay);
    };
    this.moveDownTo = (selector, delay, offset) => {
	let elem;
	if(typeof selector == "string") elem = this.query(selector);
	else elem = selector;
	if (typeof offset == "undefined") offset = 0.0125;
	let d = ((elem.offsetTop+elem.offsetHeight)/1080 - 1 + offset)*this.scale;
	this.currentX = this.x;
	this.currentY = this.y+d;
	engine.moveWindow(this.x, this.y+d, this.scale, this.rotate, delay);
    };
    this.moveCenterTo = (selector, delay, offset) => {
	let elem;
	if(typeof selector == "string") elem = this.query(selector);
	else elem = selector;
	if (typeof offset == "undefined") offset = 0;
	let d = ((elem.offsetTop+elem.offsetHeight/2)/1080-1/2+offset)*this.scale;
	this.currentX = this.x;
	this.currentY = this.y+d;
	engine.moveWindow(this.x, this.y+d, this.scale, this.rotate, delay);
    };
    this.reveal = (selector) => {
	this.query(selector).style.opacity = "1";
    };
    this.revealAll = (selector) => {
	this.queryAll(selector).forEach((elem) => { elem.style.opacity = "1";});
    };
    this.hide = (selector) => {
	this.query(selector).style.opacity = "0";
    };
    this.hideAll = (selector) => {
	this.queryAll(selector).forEach((elem) => { elem.style.opacity = "0";});
    };
    this.getMaxNext = () => {
	let maxTemp = actionList.length;
	["mk-visible-at",
	 "mk-hidden-at",
	 "mk-emphasize-at",
	 "mk-unemphasize-at",
	 "emphasize-at",
	 "chg-visib-at",
	 "up-at",
	 "down-at",
	 "center-at",
	].forEach((attr) => {
	     this.queryAll("*["+attr+"]").forEach((elem) => {
		 elem.getAttribute(attr).split(" ").forEach((strMax) => {
		     maxTemp = Math.max(Math.abs(parseInt(strMax)),maxTemp);
		 });
	     });
	 });
	return maxTemp;	
    };
}

let Presentation = function (ng, ls) {
    if(!ls)
	ls = Array.from(document.querySelectorAll(".slide")).map((elem) => { return new Slide(elem.id, [], this, ng, {});});
    console.log(ls);
    let cpt = 0;
    this.getCpt = () => cpt;
    
    let engine = ng;
    this.getEngine = () => this.engine;
    this.setEngine = (ng) => this.engine = ng;
    let listSlides = ls || [];
    let slideIndex = 0;
    this.getSlides = () => listSlides;
    this.setSlides = (ls) => listSlides = ls;
    this.getCurrentSlide = () => listSlides[slideIndex];
    this.gotoSlide = function(slide, options) {
	options = options ? options : {};
	console.log("options is ", options);
	// let x = slide.x, y = slide.y;
	// let scale = slide.scale, rotate = slide.rotate, delay = slide.delay;
	// console.log(x,y, scale, rotate);
	engine.moveWindow(slide.currentX, slide.currentY, slide.scale, slide.rotate, options.delay ? options.delay : slide.delay);
    };
    this.gotoSlideIndex = (index, options) => {
	if(!listSlides[slideIndex].element.classList.contains("permanent"))
	    listSlides[slideIndex].element.style.zIndex = "-1";
	slideIndex = index;
	listSlides[slideIndex].element.style.zIndex = "1";
	this.gotoSlide(listSlides[slideIndex], options);
	if(!listSlides[slideIndex].visited) {
	    listSlides[slideIndex].visited = true;
	    listSlides[slideIndex].firstVisit(this);
	}
    };
    this.next = () => {
	listSlides[slideIndex].currentCpt = cpt;
	let flag;
	if((flag = !listSlides[slideIndex].next(this))) {
	    this.gotoSlideIndex(Math.min((slideIndex+1),listSlides.length-1));
	}
	cpt++;
	document.querySelector(".cpt-slip").innerText = (cpt);
	return flag;
    };
    this.nextSlide = () => {
	if(!this.next())
	    this.nextSlide();
    };
    this.skipSlide = (options) => {
	this.gotoSlideIndex(slideIndex+1, options);
    };
    this.previousSlide = () => {
	slideIndex = Math.max(0, slideIndex -1);
	this.gotoSlide(listSlides[slideIndex]);
	cpt = listSlides[slideIndex].currentCpt;
	document.querySelector(".cpt-slip").innerText = (cpt);
    };
    this.previous = () => {
	let saveCpt = cpt;
	this.refresh();
	if(saveCpt == cpt)
	    this.previousSlide();
	else
	    while(cpt<saveCpt-1)
		this.next();
    };
    this.refresh = () => {
	listSlides[slideIndex].refresh();
	this.gotoSlide(listSlides[slideIndex]);
	cpt = listSlides[slideIndex].initCpt;
	document.querySelector(".cpt-slip").innerText = (cpt);
    };
    this.start = () => {
	slideIndex = 0;
	this.gotoSlide(listSlides[slideIndex]);
	listSlides[slideIndex].element.style.zIndex = "1";
	listSlides[slideIndex].firstVisit(this);
	listSlides[slideIndex].initCpt = cpt;
	listSlides[slideIndex].currentCpt = cpt;
    };
};

let engine = new Engine();
let presentation = new Presentation(engine);
let controller = new Controller(engine, presentation);
presentation.start();

function getAnchor() {
    var currentUrl = document.URL,
	urlParts   = currentUrl.split('#');
		
    return (urlParts.length > 1) ? urlParts[1] : null;
}
let anchor = parseInt(getAnchor());
if(anchor) {
    for(let i=0;i<anchor; i++) {
	presentation.next();
    }
}


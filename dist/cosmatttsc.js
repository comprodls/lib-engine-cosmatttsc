/*
 * Require-CSS RequireJS css! loader plugin
 * 0.1.8
 * Guy Bedford 2014
 * MIT
 */

/*
 *
 * Usage:
 *  require(['css!./mycssFile']);
 *
 * Tested and working in (up to latest versions as of March 2013):
 * Android
 * iOS 6
 * IE 6 - 10
 * Chome 3 - 26
 * Firefox 3.5 - 19
 * Opera 10 - 12
 * 
 * browserling.com used for virtual testing environment
 *
 * Credit to B Cavalier & J Hann for the IE 6 - 9 method,
 * refined with help from Martin Cermak
 * 
 * Sources that helped along the way:
 * - https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 * - http://www.phpied.com/when-is-a-stylesheet-really-loaded/
 * - https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
 *
 */

define('css',[],function() {
  if (typeof window == 'undefined')
    return { load: function(n, r, load){ load() } };

  var head = document.getElementsByTagName('head')[0];

  var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0;

  // use <style> @import load method (IE < 9, Firefox < 18)
  var useImportLoad = false;
  
  // set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
  var useOnload = true;

  // trident / msie
  if (engine[1] || engine[7])
    useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
  // webkit
  else if (engine[2] || engine[8])
    useOnload = false;
  // gecko
  else if (engine[4])
    useImportLoad = parseInt(engine[4]) < 18;

  //main api object
  var cssAPI = {};

  cssAPI.pluginBuilder = './css-builder';

  // <style> @import load method
  var curStyle, curSheet;
  var createStyle = function () {
    curStyle = document.createElement('style');
    head.appendChild(curStyle);
    curSheet = curStyle.styleSheet || curStyle.sheet;
  }
  var ieCnt = 0;
  var ieLoads = [];
  var ieCurCallback;
  
  var createIeLoad = function(url) {
    curSheet.addImport(url);
    curStyle.onload = function(){ processIeLoad() };
    
    ieCnt++;
    if (ieCnt == 31) {
      createStyle();
      ieCnt = 0;
    }
  }
  var processIeLoad = function() {
    ieCurCallback();
 
    var nextLoad = ieLoads.shift();
 
    if (!nextLoad) {
      ieCurCallback = null;
      return;
    }
 
    ieCurCallback = nextLoad[1];
    createIeLoad(nextLoad[0]);
  }
  var importLoad = function(url, callback) {
    if (!curSheet || !curSheet.addImport)
      createStyle();

    if (curSheet && curSheet.addImport) {
      // old IE
      if (ieCurCallback) {
        ieLoads.push([url, callback]);
      }
      else {
        createIeLoad(url);
        ieCurCallback = callback;
      }
    }
    else {
      // old Firefox
      curStyle.textContent = '@import "' + url + '";';

      var loadInterval = setInterval(function() {
        try {
          curStyle.sheet.cssRules;
          clearInterval(loadInterval);
          callback();
        } catch(e) {}
      }, 10);
    }
  }

  // <link> load method
  var linkLoad = function(url, callback) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    if (useOnload)
      link.onload = function() {
        link.onload = function() {};
        // for style dimensions queries, a short delay can still be necessary
        setTimeout(callback, 7);
      }
    else
      var loadInterval = setInterval(function() {
        for (var i = 0; i < document.styleSheets.length; i++) {
          var sheet = document.styleSheets[i];
          if (sheet.href == link.href) {
            clearInterval(loadInterval);
            return callback();
          }
        }
      }, 10);
    link.href = url;
    head.appendChild(link);
  }

  cssAPI.normalize = function(name, normalize) {
    if (name.substr(name.length - 4, 4) == '.css')
      name = name.substr(0, name.length - 4);

    return normalize(name);
  }

  cssAPI.load = function(cssId, req, load, config) {

    (useImportLoad ? importLoad : linkLoad)(req.toUrl(cssId + '.css'), load);

  }

  return cssAPI;
});


define('css!../css/cosmatttsc',[],function(){});
;
define("jquery", function(){});

/*! =======================================================
                      VERSION  9.8.1              
========================================================= */
var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},windowIsDefined="object"===("undefined"==typeof window?"undefined":_typeof(window));!function(a){if("function"==typeof define&&define.amd)define('../../bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',["jquery"],a);else if("object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports){var b;try{b=require("jquery")}catch(c){b=null}module.exports=a(b)}else window&&(window.Slider=a(window.jQuery))}(function(a){var b="slider",c="bootstrapSlider";windowIsDefined&&!window.console&&(window.console={}),windowIsDefined&&!window.console.log&&(window.console.log=function(){}),windowIsDefined&&!window.console.warn&&(window.console.warn=function(){});var d;return function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l&&l!==k)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}var m=this.map(function(){var d=a.data(this,b);return d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d)),a(this)});return!m||m.length>1?m:m[0]}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;c(a)}(a),function(a){function e(b,c){function d(a,b){var c="data-slider-"+b.replace(/_/g,"-"),d=a.getAttribute(c);try{return JSON.parse(d)}catch(e){return d}}this._state={value:null,enabled:null,offset:null,size:null,percentage:null,inDrag:!1,over:!1},this.ticksCallbackMap={},this.handleCallbackMap={},"string"==typeof b?this.element=document.querySelector(b):b instanceof HTMLElement&&(this.element=b),c=c?c:{};for(var e=Object.keys(this.defaultOptions),f=0;f<e.length;f++){var h=e[f],i=c[h];i="undefined"!=typeof i?i:d(this.element,h),i=null!==i?i:this.defaultOptions[h],this.options||(this.options={}),this.options[h]=i}"auto"===this.options.rtl&&(this.options.rtl="rtl"===window.getComputedStyle(this.element).direction),"vertical"!==this.options.orientation||"top"!==this.options.tooltip_position&&"bottom"!==this.options.tooltip_position?"horizontal"!==this.options.orientation||"left"!==this.options.tooltip_position&&"right"!==this.options.tooltip_position||(this.options.tooltip_position="top"):this.options.rtl?this.options.tooltip_position="left":this.options.tooltip_position="right";var j,k,l,m,n,o=this.element.style.width,p=!1,q=this.element.parentNode;if(this.sliderElem)p=!0;else{this.sliderElem=document.createElement("div"),this.sliderElem.className="slider";var r=document.createElement("div");r.className="slider-track",k=document.createElement("div"),k.className="slider-track-low",j=document.createElement("div"),j.className="slider-selection",l=document.createElement("div"),l.className="slider-track-high",m=document.createElement("div"),m.className="slider-handle min-slider-handle",m.setAttribute("role","slider"),m.setAttribute("aria-valuemin",this.options.min),m.setAttribute("aria-valuemax",this.options.max),n=document.createElement("div"),n.className="slider-handle max-slider-handle",n.setAttribute("role","slider"),n.setAttribute("aria-valuemin",this.options.min),n.setAttribute("aria-valuemax",this.options.max),r.appendChild(k),r.appendChild(j),r.appendChild(l),this.rangeHighlightElements=[];var s=this.options.rangeHighlights;if(Array.isArray(s)&&s.length>0)for(var t=0;t<s.length;t++){var u=document.createElement("div"),v=s[t]["class"]||"";u.className="slider-rangeHighlight slider-selection "+v,this.rangeHighlightElements.push(u),r.appendChild(u)}var w=Array.isArray(this.options.labelledby);if(w&&this.options.labelledby[0]&&m.setAttribute("aria-labelledby",this.options.labelledby[0]),w&&this.options.labelledby[1]&&n.setAttribute("aria-labelledby",this.options.labelledby[1]),!w&&this.options.labelledby&&(m.setAttribute("aria-labelledby",this.options.labelledby),n.setAttribute("aria-labelledby",this.options.labelledby)),this.ticks=[],Array.isArray(this.options.ticks)&&this.options.ticks.length>0){for(this.ticksContainer=document.createElement("div"),this.ticksContainer.className="slider-tick-container",f=0;f<this.options.ticks.length;f++){var x=document.createElement("div");if(x.className="slider-tick",this.options.ticks_tooltip){var y=this._addTickListener(),z=y.addMouseEnter(this,x,f),A=y.addMouseLeave(this,x);this.ticksCallbackMap[f]={mouseEnter:z,mouseLeave:A}}this.ticks.push(x),this.ticksContainer.appendChild(x)}j.className+=" tick-slider-selection"}if(this.tickLabels=[],Array.isArray(this.options.ticks_labels)&&this.options.ticks_labels.length>0)for(this.tickLabelContainer=document.createElement("div"),this.tickLabelContainer.className="slider-tick-label-container",f=0;f<this.options.ticks_labels.length;f++){var B=document.createElement("div"),C=0===this.options.ticks_positions.length,D=this.options.reversed&&C?this.options.ticks_labels.length-(f+1):f;B.className="slider-tick-label",B.innerHTML=this.options.ticks_labels[D],this.tickLabels.push(B),this.tickLabelContainer.appendChild(B)}var E=function(a){var b=document.createElement("div");b.className="tooltip-arrow";var c=document.createElement("div");c.className="tooltip-inner",a.appendChild(b),a.appendChild(c)},F=document.createElement("div");F.className="tooltip tooltip-main",F.setAttribute("role","presentation"),E(F);var G=document.createElement("div");G.className="tooltip tooltip-min",G.setAttribute("role","presentation"),E(G);var H=document.createElement("div");H.className="tooltip tooltip-max",H.setAttribute("role","presentation"),E(H),this.sliderElem.appendChild(r),this.sliderElem.appendChild(F),this.sliderElem.appendChild(G),this.sliderElem.appendChild(H),this.tickLabelContainer&&this.sliderElem.appendChild(this.tickLabelContainer),this.ticksContainer&&this.sliderElem.appendChild(this.ticksContainer),this.sliderElem.appendChild(m),this.sliderElem.appendChild(n),q.insertBefore(this.sliderElem,this.element),this.element.style.display="none"}if(a&&(this.$element=a(this.element),this.$sliderElem=a(this.sliderElem)),this.eventToCallbackMap={},this.sliderElem.id=this.options.id,this.touchCapable="ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch,this.touchX=0,this.touchY=0,this.tooltip=this.sliderElem.querySelector(".tooltip-main"),this.tooltipInner=this.tooltip.querySelector(".tooltip-inner"),this.tooltip_min=this.sliderElem.querySelector(".tooltip-min"),this.tooltipInner_min=this.tooltip_min.querySelector(".tooltip-inner"),this.tooltip_max=this.sliderElem.querySelector(".tooltip-max"),this.tooltipInner_max=this.tooltip_max.querySelector(".tooltip-inner"),g[this.options.scale]&&(this.options.scale=g[this.options.scale]),p===!0&&(this._removeClass(this.sliderElem,"slider-horizontal"),this._removeClass(this.sliderElem,"slider-vertical"),this._removeClass(this.sliderElem,"slider-rtl"),this._removeClass(this.tooltip,"hide"),this._removeClass(this.tooltip_min,"hide"),this._removeClass(this.tooltip_max,"hide"),["left","right","top","width","height"].forEach(function(a){this._removeProperty(this.trackLow,a),this._removeProperty(this.trackSelection,a),this._removeProperty(this.trackHigh,a)},this),[this.handle1,this.handle2].forEach(function(a){this._removeProperty(a,"left"),this._removeProperty(a,"right"),this._removeProperty(a,"top")},this),[this.tooltip,this.tooltip_min,this.tooltip_max].forEach(function(a){this._removeProperty(a,"left"),this._removeProperty(a,"right"),this._removeProperty(a,"top"),this._removeProperty(a,"margin-left"),this._removeProperty(a,"margin-right"),this._removeProperty(a,"margin-top"),this._removeClass(a,"right"),this._removeClass(a,"left"),this._removeClass(a,"top")},this)),"vertical"===this.options.orientation?(this._addClass(this.sliderElem,"slider-vertical"),this.stylePos="top",this.mousePos="pageY",this.sizePos="offsetHeight"):(this._addClass(this.sliderElem,"slider-horizontal"),this.sliderElem.style.width=o,this.options.orientation="horizontal",this.options.rtl?this.stylePos="right":this.stylePos="left",this.mousePos="pageX",this.sizePos="offsetWidth"),this.options.rtl&&this._addClass(this.sliderElem,"slider-rtl"),this._setTooltipPosition(),Array.isArray(this.options.ticks)&&this.options.ticks.length>0&&(this.options.max=Math.max.apply(Math,this.options.ticks),this.options.min=Math.min.apply(Math,this.options.ticks)),Array.isArray(this.options.value)?(this.options.range=!0,this._state.value=this.options.value):this.options.range?this._state.value=[this.options.value,this.options.max]:this._state.value=this.options.value,this.trackLow=k||this.trackLow,this.trackSelection=j||this.trackSelection,this.trackHigh=l||this.trackHigh,"none"===this.options.selection?(this._addClass(this.trackLow,"hide"),this._addClass(this.trackSelection,"hide"),this._addClass(this.trackHigh,"hide")):("after"===this.options.selection||"before"===this.options.selection)&&(this._removeClass(this.trackLow,"hide"),this._removeClass(this.trackSelection,"hide"),this._removeClass(this.trackHigh,"hide")),this.handle1=m||this.handle1,this.handle2=n||this.handle2,p===!0)for(this._removeClass(this.handle1,"round triangle"),this._removeClass(this.handle2,"round triangle hide"),f=0;f<this.ticks.length;f++)this._removeClass(this.ticks[f],"round triangle hide");var I=["round","triangle","custom"],J=-1!==I.indexOf(this.options.handle);if(J)for(this._addClass(this.handle1,this.options.handle),this._addClass(this.handle2,this.options.handle),f=0;f<this.ticks.length;f++)this._addClass(this.ticks[f],this.options.handle);if(this._state.offset=this._offset(this.sliderElem),this._state.size=this.sliderElem[this.sizePos],this.setValue(this._state.value),this.handle1Keydown=this._keydown.bind(this,0),this.handle1.addEventListener("keydown",this.handle1Keydown,!1),this.handle2Keydown=this._keydown.bind(this,1),this.handle2.addEventListener("keydown",this.handle2Keydown,!1),this.mousedown=this._mousedown.bind(this),this.touchstart=this._touchstart.bind(this),this.touchmove=this._touchmove.bind(this),this.touchCapable){var K=!1;try{var L=Object.defineProperty({},"passive",{get:function(){K=!0}});window.addEventListener("test",null,L)}catch(M){}var N=K?{passive:!0}:!1;this.sliderElem.addEventListener("touchstart",this.touchstart,N),this.sliderElem.addEventListener("touchmove",this.touchmove,N)}if(this.sliderElem.addEventListener("mousedown",this.mousedown,!1),this.resize=this._resize.bind(this),window.addEventListener("resize",this.resize,!1),"hide"===this.options.tooltip)this._addClass(this.tooltip,"hide"),this._addClass(this.tooltip_min,"hide"),this._addClass(this.tooltip_max,"hide");else if("always"===this.options.tooltip)this._showTooltip(),this._alwaysShowTooltip=!0;else{if(this.showTooltip=this._showTooltip.bind(this),this.hideTooltip=this._hideTooltip.bind(this),this.options.ticks_tooltip){var O=this._addTickListener(),P=O.addMouseEnter(this,this.handle1),Q=O.addMouseLeave(this,this.handle1);this.handleCallbackMap.handle1={mouseEnter:P,mouseLeave:Q},P=O.addMouseEnter(this,this.handle2),Q=O.addMouseLeave(this,this.handle2),this.handleCallbackMap.handle2={mouseEnter:P,mouseLeave:Q}}else this.sliderElem.addEventListener("mouseenter",this.showTooltip,!1),this.sliderElem.addEventListener("mouseleave",this.hideTooltip,!1);this.handle1.addEventListener("focus",this.showTooltip,!1),this.handle1.addEventListener("blur",this.hideTooltip,!1),this.handle2.addEventListener("focus",this.showTooltip,!1),this.handle2.addEventListener("blur",this.hideTooltip,!1)}this.options.enabled?this.enable():this.disable()}var f={formatInvalidInputErrorMsg:function(a){return"Invalid input value '"+a+"' passed in"},callingContextNotSliderInstance:"Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"},g={linear:{toValue:function(a){var b=a/100*(this.options.max-this.options.min),c=!0;if(this.options.ticks_positions.length>0){for(var d,e,f,g=0,h=1;h<this.options.ticks_positions.length;h++)if(a<=this.options.ticks_positions[h]){d=this.options.ticks[h-1],f=this.options.ticks_positions[h-1],e=this.options.ticks[h],g=this.options.ticks_positions[h];break}var i=(a-f)/(g-f);b=d+i*(e-d),c=!1}var j=c?this.options.min:0,k=j+Math.round(b/this.options.step)*this.options.step;return k<this.options.min?this.options.min:k>this.options.max?this.options.max:k},toPercentage:function(a){if(this.options.max===this.options.min)return 0;if(this.options.ticks_positions.length>0){for(var b,c,d,e=0,f=0;f<this.options.ticks.length;f++)if(a<=this.options.ticks[f]){b=f>0?this.options.ticks[f-1]:0,d=f>0?this.options.ticks_positions[f-1]:0,c=this.options.ticks[f],e=this.options.ticks_positions[f];break}if(f>0){var g=(a-b)/(c-b);return d+g*(e-d)}}return 100*(a-this.options.min)/(this.options.max-this.options.min)}},logarithmic:{toValue:function(a){var b=0===this.options.min?0:Math.log(this.options.min),c=Math.log(this.options.max),d=Math.exp(b+(c-b)*a/100);return Math.round(d)===this.options.max?this.options.max:(d=this.options.min+Math.round((d-this.options.min)/this.options.step)*this.options.step,d<this.options.min?this.options.min:d>this.options.max?this.options.max:d)},toPercentage:function(a){if(this.options.max===this.options.min)return 0;var b=Math.log(this.options.max),c=0===this.options.min?0:Math.log(this.options.min),d=0===a?0:Math.log(a);return 100*(d-c)/(b-c)}}};if(d=function(a,b){return e.call(this,a,b),this},d.prototype={_init:function(){},constructor:d,defaultOptions:{id:"",min:0,max:10,step:1,precision:0,orientation:"horizontal",value:5,range:!1,selection:"before",tooltip:"show",tooltip_split:!1,handle:"round",reversed:!1,rtl:"auto",enabled:!0,formatter:function(a){return Array.isArray(a)?a[0]+" : "+a[1]:a},natural_arrow_keys:!1,ticks:[],ticks_positions:[],ticks_labels:[],ticks_snap_bounds:0,ticks_tooltip:!1,scale:"linear",focus:!1,tooltip_position:null,labelledby:null,rangeHighlights:[]},getElement:function(){return this.sliderElem},getValue:function(){return this.options.range?this._state.value:this._state.value[0]},setValue:function(a,b,c){a||(a=0);var d=this.getValue();this._state.value=this._validateInputValue(a);var e=this._applyPrecision.bind(this);this.options.range?(this._state.value[0]=e(this._state.value[0]),this._state.value[1]=e(this._state.value[1]),this._state.value[0]=Math.max(this.options.min,Math.min(this.options.max,this._state.value[0])),this._state.value[1]=Math.max(this.options.min,Math.min(this.options.max,this._state.value[1]))):(this._state.value=e(this._state.value),this._state.value=[Math.max(this.options.min,Math.min(this.options.max,this._state.value))],this._addClass(this.handle2,"hide"),"after"===this.options.selection?this._state.value[1]=this.options.max:this._state.value[1]=this.options.min),this.options.max>this.options.min?this._state.percentage=[this._toPercentage(this._state.value[0]),this._toPercentage(this._state.value[1]),100*this.options.step/(this.options.max-this.options.min)]:this._state.percentage=[0,0,100],this._layout();var f=this.options.range?this._state.value:this._state.value[0];return this._setDataVal(f),b===!0&&this._trigger("slide",f),d!==f&&c===!0&&this._trigger("change",{oldValue:d,newValue:f}),this},destroy:function(){this._removeSliderEventHandlers(),this.sliderElem.parentNode.removeChild(this.sliderElem),this.element.style.display="",this._cleanUpEventCallbacksMap(),this.element.removeAttribute("data"),a&&(this._unbindJQueryEventHandlers(),this.$element.removeData("slider"))},disable:function(){return this._state.enabled=!1,this.handle1.removeAttribute("tabindex"),this.handle2.removeAttribute("tabindex"),this._addClass(this.sliderElem,"slider-disabled"),this._trigger("slideDisabled"),this},enable:function(){return this._state.enabled=!0,this.handle1.setAttribute("tabindex",0),this.handle2.setAttribute("tabindex",0),this._removeClass(this.sliderElem,"slider-disabled"),this._trigger("slideEnabled"),this},toggle:function(){return this._state.enabled?this.disable():this.enable(),this},isEnabled:function(){return this._state.enabled},on:function(a,b){return this._bindNonQueryEventHandler(a,b),this},off:function(b,c){a?(this.$element.off(b,c),this.$sliderElem.off(b,c)):this._unbindNonQueryEventHandler(b,c)},getAttribute:function(a){return a?this.options[a]:this.options},setAttribute:function(a,b){return this.options[a]=b,this},refresh:function(){return this._removeSliderEventHandlers(),e.call(this,this.element,this.options),a&&a.data(this.element,"slider",this),this},relayout:function(){return this._resize(),this._layout(),this},_removeSliderEventHandlers:function(){if(this.handle1.removeEventListener("keydown",this.handle1Keydown,!1),this.handle2.removeEventListener("keydown",this.handle2Keydown,!1),this.options.ticks_tooltip){for(var a=this.ticksContainer.getElementsByClassName("slider-tick"),b=0;b<a.length;b++)a[b].removeEventListener("mouseenter",this.ticksCallbackMap[b].mouseEnter,!1),a[b].removeEventListener("mouseleave",this.ticksCallbackMap[b].mouseLeave,!1);this.handle1.removeEventListener("mouseenter",this.handleCallbackMap.handle1.mouseEnter,!1),this.handle2.removeEventListener("mouseenter",this.handleCallbackMap.handle2.mouseEnter,!1),this.handle1.removeEventListener("mouseleave",this.handleCallbackMap.handle1.mouseLeave,!1),this.handle2.removeEventListener("mouseleave",this.handleCallbackMap.handle2.mouseLeave,!1)}this.handleCallbackMap=null,this.ticksCallbackMap=null,this.showTooltip&&(this.handle1.removeEventListener("focus",this.showTooltip,!1),this.handle2.removeEventListener("focus",this.showTooltip,!1)),this.hideTooltip&&(this.handle1.removeEventListener("blur",this.hideTooltip,!1),this.handle2.removeEventListener("blur",this.hideTooltip,!1)),this.showTooltip&&this.sliderElem.removeEventListener("mouseenter",this.showTooltip,!1),this.hideTooltip&&this.sliderElem.removeEventListener("mouseleave",this.hideTooltip,!1),this.sliderElem.removeEventListener("touchstart",this.touchstart,!1),this.sliderElem.removeEventListener("touchmove",this.touchmove,!1),this.sliderElem.removeEventListener("mousedown",this.mousedown,!1),window.removeEventListener("resize",this.resize,!1)},_bindNonQueryEventHandler:function(a,b){void 0===this.eventToCallbackMap[a]&&(this.eventToCallbackMap[a]=[]),this.eventToCallbackMap[a].push(b)},_unbindNonQueryEventHandler:function(a,b){var c=this.eventToCallbackMap[a];if(void 0!==c)for(var d=0;d<c.length;d++)if(c[d]===b){c.splice(d,1);break}},_cleanUpEventCallbacksMap:function(){for(var a=Object.keys(this.eventToCallbackMap),b=0;b<a.length;b++){var c=a[b];delete this.eventToCallbackMap[c]}},_showTooltip:function(){this.options.tooltip_split===!1?(this._addClass(this.tooltip,"in"),this.tooltip_min.style.display="none",this.tooltip_max.style.display="none"):(this._addClass(this.tooltip_min,"in"),this._addClass(this.tooltip_max,"in"),this.tooltip.style.display="none"),this._state.over=!0},_hideTooltip:function(){this._state.inDrag===!1&&this.alwaysShowTooltip!==!0&&(this._removeClass(this.tooltip,"in"),this._removeClass(this.tooltip_min,"in"),this._removeClass(this.tooltip_max,"in")),this._state.over=!1},_setToolTipOnMouseOver:function(a){function b(a,b){return b?[100-a.percentage[0],this.options.range?100-a.percentage[1]:a.percentage[1]]:[a.percentage[0],a.percentage[1]]}var c=this.options.formatter(a?a.value[0]:this._state.value[0]),d=a?b(a,this.options.reversed):b(this._state,this.options.reversed);this._setText(this.tooltipInner,c),this.tooltip.style[this.stylePos]=d[0]+"%","vertical"===this.options.orientation?this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetHeight/2+"px"):this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetWidth/2+"px")},_addTickListener:function(){return{addMouseEnter:function(a,b,c){var d=function(){var b=a._state,d=c>=0?c:this.attributes["aria-valuenow"].value,e=parseInt(d,10);b.value[0]=e,b.percentage[0]=a.options.ticks_positions[e],a._setToolTipOnMouseOver(b),a._showTooltip()};return b.addEventListener("mouseenter",d,!1),d},addMouseLeave:function(a,b){var c=function(){a._hideTooltip()};return b.addEventListener("mouseleave",c,!1),c}}},_layout:function(){var a;if(a=this.options.reversed?[100-this._state.percentage[0],this.options.range?100-this._state.percentage[1]:this._state.percentage[1]]:[this._state.percentage[0],this._state.percentage[1]],this.handle1.style[this.stylePos]=a[0]+"%",this.handle1.setAttribute("aria-valuenow",this._state.value[0]),isNaN(this.options.formatter(this._state.value[0]))&&this.handle1.setAttribute("aria-valuetext",this.options.formatter(this._state.value[0])),this.handle2.style[this.stylePos]=a[1]+"%",this.handle2.setAttribute("aria-valuenow",this._state.value[1]),isNaN(this.options.formatter(this._state.value[1]))&&this.handle2.setAttribute("aria-valuetext",this.options.formatter(this._state.value[1])),this.rangeHighlightElements.length>0&&Array.isArray(this.options.rangeHighlights)&&this.options.rangeHighlights.length>0)for(var b=0;b<this.options.rangeHighlights.length;b++){var c=this._toPercentage(this.options.rangeHighlights[b].start),d=this._toPercentage(this.options.rangeHighlights[b].end);if(this.options.reversed){var e=100-d;d=100-c,c=e}var f=this._createHighlightRange(c,d);f?"vertical"===this.options.orientation?(this.rangeHighlightElements[b].style.top=f.start+"%",this.rangeHighlightElements[b].style.height=f.size+"%"):(this.options.rtl?this.rangeHighlightElements[b].style.right=f.start+"%":this.rangeHighlightElements[b].style.left=f.start+"%",this.rangeHighlightElements[b].style.width=f.size+"%"):this.rangeHighlightElements[b].style.display="none"}if(Array.isArray(this.options.ticks)&&this.options.ticks.length>0){var g,h="vertical"===this.options.orientation?"height":"width";g="vertical"===this.options.orientation?"marginTop":this.options.rtl?"marginRight":"marginLeft";var i=this._state.size/(this.options.ticks.length-1);if(this.tickLabelContainer){var j=0;if(0===this.options.ticks_positions.length)"vertical"!==this.options.orientation&&(this.tickLabelContainer.style[g]=-i/2+"px"),j=this.tickLabelContainer.offsetHeight;else for(k=0;k<this.tickLabelContainer.childNodes.length;k++)this.tickLabelContainer.childNodes[k].offsetHeight>j&&(j=this.tickLabelContainer.childNodes[k].offsetHeight);"horizontal"===this.options.orientation&&(this.sliderElem.style.marginBottom=j+"px")}for(var k=0;k<this.options.ticks.length;k++){var l=this.options.ticks_positions[k]||this._toPercentage(this.options.ticks[k]);this.options.reversed&&(l=100-l),this.ticks[k].style[this.stylePos]=l+"%",this._removeClass(this.ticks[k],"in-selection"),this.options.range?l>=a[0]&&l<=a[1]&&this._addClass(this.ticks[k],"in-selection"):"after"===this.options.selection&&l>=a[0]?this._addClass(this.ticks[k],"in-selection"):"before"===this.options.selection&&l<=a[0]&&this._addClass(this.ticks[k],"in-selection"),this.tickLabels[k]&&(this.tickLabels[k].style[h]=i+"px","vertical"!==this.options.orientation&&void 0!==this.options.ticks_positions[k]?(this.tickLabels[k].style.position="absolute",this.tickLabels[k].style[this.stylePos]=l+"%",this.tickLabels[k].style[g]=-i/2+"px"):"vertical"===this.options.orientation&&(this.options.rtl?this.tickLabels[k].style.marginRight=this.sliderElem.offsetWidth+"px":this.tickLabels[k].style.marginLeft=this.sliderElem.offsetWidth+"px",this.tickLabelContainer.style[g]=this.sliderElem.offsetWidth/2*-1+"px"))}}var m;if(this.options.range){m=this.options.formatter(this._state.value),this._setText(this.tooltipInner,m),this.tooltip.style[this.stylePos]=(a[1]+a[0])/2+"%","vertical"===this.options.orientation?this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetHeight/2+"px"):this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetWidth/2+"px");var n=this.options.formatter(this._state.value[0]);this._setText(this.tooltipInner_min,n);var o=this.options.formatter(this._state.value[1]);this._setText(this.tooltipInner_max,o),this.tooltip_min.style[this.stylePos]=a[0]+"%","vertical"===this.options.orientation?this._css(this.tooltip_min,"margin-"+this.stylePos,-this.tooltip_min.offsetHeight/2+"px"):this._css(this.tooltip_min,"margin-"+this.stylePos,-this.tooltip_min.offsetWidth/2+"px"),this.tooltip_max.style[this.stylePos]=a[1]+"%","vertical"===this.options.orientation?this._css(this.tooltip_max,"margin-"+this.stylePos,-this.tooltip_max.offsetHeight/2+"px"):this._css(this.tooltip_max,"margin-"+this.stylePos,-this.tooltip_max.offsetWidth/2+"px")}else m=this.options.formatter(this._state.value[0]),this._setText(this.tooltipInner,m),this.tooltip.style[this.stylePos]=a[0]+"%","vertical"===this.options.orientation?this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetHeight/2+"px"):this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetWidth/2+"px");if("vertical"===this.options.orientation)this.trackLow.style.top="0",this.trackLow.style.height=Math.min(a[0],a[1])+"%",this.trackSelection.style.top=Math.min(a[0],a[1])+"%",this.trackSelection.style.height=Math.abs(a[0]-a[1])+"%",this.trackHigh.style.bottom="0",this.trackHigh.style.height=100-Math.min(a[0],a[1])-Math.abs(a[0]-a[1])+"%";else{"right"===this.stylePos?this.trackLow.style.right="0":this.trackLow.style.left="0",this.trackLow.style.width=Math.min(a[0],a[1])+"%","right"===this.stylePos?this.trackSelection.style.right=Math.min(a[0],a[1])+"%":this.trackSelection.style.left=Math.min(a[0],a[1])+"%",this.trackSelection.style.width=Math.abs(a[0]-a[1])+"%","right"===this.stylePos?this.trackHigh.style.left="0":this.trackHigh.style.right="0",this.trackHigh.style.width=100-Math.min(a[0],a[1])-Math.abs(a[0]-a[1])+"%";var p=this.tooltip_min.getBoundingClientRect(),q=this.tooltip_max.getBoundingClientRect();"bottom"===this.options.tooltip_position?p.right>q.left?(this._removeClass(this.tooltip_max,"bottom"),this._addClass(this.tooltip_max,"top"),this.tooltip_max.style.top="",this.tooltip_max.style.bottom="22px"):(this._removeClass(this.tooltip_max,"top"),this._addClass(this.tooltip_max,"bottom"),this.tooltip_max.style.top=this.tooltip_min.style.top,this.tooltip_max.style.bottom=""):p.right>q.left?(this._removeClass(this.tooltip_max,"top"),this._addClass(this.tooltip_max,"bottom"),this.tooltip_max.style.top="18px"):(this._removeClass(this.tooltip_max,"bottom"),this._addClass(this.tooltip_max,"top"),this.tooltip_max.style.top=this.tooltip_min.style.top)}},_createHighlightRange:function(a,b){return this._isHighlightRange(a,b)?a>b?{start:b,size:a-b}:{start:a,size:b-a}:null},_isHighlightRange:function(a,b){return a>=0&&100>=a&&b>=0&&100>=b?!0:!1},_resize:function(a){this._state.offset=this._offset(this.sliderElem),this._state.size=this.sliderElem[this.sizePos],this._layout()},_removeProperty:function(a,b){a.style.removeProperty?a.style.removeProperty(b):a.style.removeAttribute(b)},_mousedown:function(a){if(!this._state.enabled)return!1;this._state.offset=this._offset(this.sliderElem),this._state.size=this.sliderElem[this.sizePos];var b=this._getPercentage(a);if(this.options.range){var c=Math.abs(this._state.percentage[0]-b),d=Math.abs(this._state.percentage[1]-b);this._state.dragged=d>c?0:1,this._adjustPercentageForRangeSliders(b)}else this._state.dragged=0;this._state.percentage[this._state.dragged]=b,this._layout(),this.touchCapable&&(document.removeEventListener("touchmove",this.mousemove,!1),document.removeEventListener("touchend",this.mouseup,!1)),this.mousemove&&document.removeEventListener("mousemove",this.mousemove,!1),this.mouseup&&document.removeEventListener("mouseup",this.mouseup,!1),this.mousemove=this._mousemove.bind(this),this.mouseup=this._mouseup.bind(this),this.touchCapable&&(document.addEventListener("touchmove",this.mousemove,!1),document.addEventListener("touchend",this.mouseup,!1)),document.addEventListener("mousemove",this.mousemove,!1),document.addEventListener("mouseup",this.mouseup,!1),this._state.inDrag=!0;var e=this._calculateValue();return this._trigger("slideStart",e),this._setDataVal(e),this.setValue(e,!1,!0),a.returnValue=!1,this.options.focus&&this._triggerFocusOnHandle(this._state.dragged),!0},_touchstart:function(a){if(void 0===a.changedTouches)return void this._mousedown(a);var b=a.changedTouches[0];this.touchX=b.pageX,this.touchY=b.pageY},_triggerFocusOnHandle:function(a){0===a&&this.handle1.focus(),1===a&&this.handle2.focus()},_keydown:function(a,b){if(!this._state.enabled)return!1;var c;switch(b.keyCode){case 37:case 40:c=-1;break;case 39:case 38:c=1}if(c){if(this.options.natural_arrow_keys){var d="vertical"===this.options.orientation&&!this.options.reversed,e="horizontal"===this.options.orientation&&this.options.reversed;(d||e)&&(c=-c)}var f=this._state.value[a]+c*this.options.step,g=f/this.options.max*100;if(this._state.keyCtrl=a,this.options.range){this._adjustPercentageForRangeSliders(g);var h=this._state.keyCtrl?this._state.value[0]:f,i=this._state.keyCtrl?f:this._state.value[1];f=[h,i]}return this._trigger("slideStart",f),this._setDataVal(f),this.setValue(f,!0,!0),this._setDataVal(f),this._trigger("slideStop",f),this._layout(),this._pauseEvent(b),delete this._state.keyCtrl,!1}},_pauseEvent:function(a){a.stopPropagation&&a.stopPropagation(),a.preventDefault&&a.preventDefault(),a.cancelBubble=!0,a.returnValue=!1},_mousemove:function(a){if(!this._state.enabled)return!1;var b=this._getPercentage(a);this._adjustPercentageForRangeSliders(b),this._state.percentage[this._state.dragged]=b,this._layout();var c=this._calculateValue(!0);return this.setValue(c,!0,!0),!1},_touchmove:function(a){if(void 0!==a.changedTouches){var b=a.changedTouches[0],c=b.pageX-this.touchX,d=b.pageY-this.touchY;this._state.inDrag||("vertical"===this.options.orientation&&5>=c&&c>=-5&&(d>=15||-15>=d)?this._mousedown(a):5>=d&&d>=-5&&(c>=15||-15>=c)&&this._mousedown(a))}},_adjustPercentageForRangeSliders:function(a){if(this.options.range){var b=this._getNumDigitsAfterDecimalPlace(a);b=b?b-1:0;var c=this._applyToFixedAndParseFloat(a,b);0===this._state.dragged&&this._applyToFixedAndParseFloat(this._state.percentage[1],b)<c?(this._state.percentage[0]=this._state.percentage[1],this._state.dragged=1):1===this._state.dragged&&this._applyToFixedAndParseFloat(this._state.percentage[0],b)>c?(this._state.percentage[1]=this._state.percentage[0],this._state.dragged=0):0===this._state.keyCtrl&&this._state.value[1]/this.options.max*100<a?(this._state.percentage[0]=this._state.percentage[1],this._state.keyCtrl=1,this.handle2.focus()):1===this._state.keyCtrl&&this._state.value[0]/this.options.max*100>a&&(this._state.percentage[1]=this._state.percentage[0],this._state.keyCtrl=0,this.handle1.focus())}},_mouseup:function(){if(!this._state.enabled)return!1;this.touchCapable&&(document.removeEventListener("touchmove",this.mousemove,!1),document.removeEventListener("touchend",this.mouseup,!1)),document.removeEventListener("mousemove",this.mousemove,!1),document.removeEventListener("mouseup",this.mouseup,!1),this._state.inDrag=!1,this._state.over===!1&&this._hideTooltip();var a=this._calculateValue(!0);return this._layout(),this._setDataVal(a),this._trigger("slideStop",a),!1},_calculateValue:function(a){var b;if(this.options.range?(b=[this.options.min,this.options.max],0!==this._state.percentage[0]&&(b[0]=this._toValue(this._state.percentage[0]),b[0]=this._applyPrecision(b[0])),100!==this._state.percentage[1]&&(b[1]=this._toValue(this._state.percentage[1]),b[1]=this._applyPrecision(b[1]))):(b=this._toValue(this._state.percentage[0]),b=parseFloat(b),b=this._applyPrecision(b)),a){for(var c=[b,1/0],d=0;d<this.options.ticks.length;d++){
var e=Math.abs(this.options.ticks[d]-b);e<=c[1]&&(c=[this.options.ticks[d],e])}if(c[1]<=this.options.ticks_snap_bounds)return c[0]}return b},_applyPrecision:function(a){var b=this.options.precision||this._getNumDigitsAfterDecimalPlace(this.options.step);return this._applyToFixedAndParseFloat(a,b)},_getNumDigitsAfterDecimalPlace:function(a){var b=(""+a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return b?Math.max(0,(b[1]?b[1].length:0)-(b[2]?+b[2]:0)):0},_applyToFixedAndParseFloat:function(a,b){var c=a.toFixed(b);return parseFloat(c)},_getPercentage:function(a){!this.touchCapable||"touchstart"!==a.type&&"touchmove"!==a.type||(a=a.touches[0]);var b=a[this.mousePos],c=this._state.offset[this.stylePos],d=b-c;"right"===this.stylePos&&(d=-d);var e=d/this._state.size*100;return e=Math.round(e/this._state.percentage[2])*this._state.percentage[2],this.options.reversed&&(e=100-e),Math.max(0,Math.min(100,e))},_validateInputValue:function(a){if(isNaN(+a)){if(Array.isArray(a))return this._validateArray(a),a;throw new Error(f.formatInvalidInputErrorMsg(a))}return+a},_validateArray:function(a){for(var b=0;b<a.length;b++){var c=a[b];if("number"!=typeof c)throw new Error(f.formatInvalidInputErrorMsg(c))}},_setDataVal:function(a){this.element.setAttribute("data-value",a),this.element.setAttribute("value",a),this.element.value=a},_trigger:function(b,c){c=c||0===c?c:void 0;var d=this.eventToCallbackMap[b];if(d&&d.length)for(var e=0;e<d.length;e++){var f=d[e];f(c)}a&&this._triggerJQueryEvent(b,c)},_triggerJQueryEvent:function(a,b){var c={type:a,value:b};this.$element.trigger(c),this.$sliderElem.trigger(c)},_unbindJQueryEventHandlers:function(){this.$element.off(),this.$sliderElem.off()},_setText:function(a,b){"undefined"!=typeof a.textContent?a.textContent=b:"undefined"!=typeof a.innerText&&(a.innerText=b)},_removeClass:function(a,b){for(var c=b.split(" "),d=a.className,e=0;e<c.length;e++){var f=c[e],g=new RegExp("(?:\\s|^)"+f+"(?:\\s|$)");d=d.replace(g," ")}a.className=d.trim()},_addClass:function(a,b){for(var c=b.split(" "),d=a.className,e=0;e<c.length;e++){var f=c[e],g=new RegExp("(?:\\s|^)"+f+"(?:\\s|$)"),h=g.test(d);h||(d+=" "+f)}a.className=d.trim()},_offsetLeft:function(a){return a.getBoundingClientRect().left},_offsetRight:function(a){return a.getBoundingClientRect().right},_offsetTop:function(a){for(var b=a.offsetTop;(a=a.offsetParent)&&!isNaN(a.offsetTop);)b+=a.offsetTop,"BODY"!==a.tagName&&(b-=a.scrollTop);return b},_offset:function(a){return{left:this._offsetLeft(a),right:this._offsetRight(a),top:this._offsetTop(a)}},_css:function(b,c,d){if(a)a.style(b,c,d);else{var e=c.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(a,b){return b.toUpperCase()});b.style[e]=d}},_toValue:function(a){return this.options.scale.toValue.apply(this,[a])},_toPercentage:function(a){return this.options.scale.toPercentage.apply(this,[a])},_setTooltipPosition:function(){var a=[this.tooltip,this.tooltip_min,this.tooltip_max];if("vertical"===this.options.orientation){var b;b=this.options.tooltip_position?this.options.tooltip_position:this.options.rtl?"left":"right";var c="left"===b?"right":"left";a.forEach(function(a){this._addClass(a,b),a.style[c]="100%"}.bind(this))}else"bottom"===this.options.tooltip_position?a.forEach(function(a){this._addClass(a,"bottom"),a.style.top="22px"}.bind(this)):a.forEach(function(a){this._addClass(a,"top"),a.style.top=-this.tooltip.outerHeight-14+"px"}.bind(this))}},a&&a.fn){var h=void 0;a.fn.slider?(windowIsDefined&&window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."),h=c):(a.bridget(b,d),h=b),a.bridget(c,d),a(function(){a("input[data-provide=slider]")[h]()})}}(a),d});

define('css!../../bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min',[],function(){});
/* Javascript plotting library for jQuery, version 0.8.3.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

*/

// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience

/* Plugin for jQuery for working with colors.
 *
 * Version 1.1.
 *
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() return the same modified object
 * instead of making a new one.
 *
 * V. 1.1: Fix error handling so e.g. parsing an empty string does
 * produce a color rather than just crashing.
 */
(function($){$.color={};$.color.make=function(r,g,b,a){var o={};o.r=r||0;o.g=g||0;o.b=b||0;o.a=a!=null?a:1;o.add=function(c,d){for(var i=0;i<c.length;++i)o[c.charAt(i)]+=d;return o.normalize()};o.scale=function(c,f){for(var i=0;i<c.length;++i)o[c.charAt(i)]*=f;return o.normalize()};o.toString=function(){if(o.a>=1){return"rgb("+[o.r,o.g,o.b].join(",")+")"}else{return"rgba("+[o.r,o.g,o.b,o.a].join(",")+")"}};o.normalize=function(){function clamp(min,value,max){return value<min?min:value>max?max:value}o.r=clamp(0,parseInt(o.r),255);o.g=clamp(0,parseInt(o.g),255);o.b=clamp(0,parseInt(o.b),255);o.a=clamp(0,o.a,1);return o};o.clone=function(){return $.color.make(o.r,o.b,o.g,o.a)};return o.normalize()};$.color.extract=function(elem,css){var c;do{c=elem.css(css).toLowerCase();if(c!=""&&c!="transparent")break;elem=elem.parent()}while(elem.length&&!$.nodeName(elem.get(0),"body"));if(c=="rgba(0, 0, 0, 0)")c="transparent";return $.color.parse(c)};$.color.parse=function(str){var res,m=$.color.make;if(res=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10));if(res=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10),parseFloat(res[4]));if(res=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55);if(res=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55,parseFloat(res[4]));if(res=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))return m(parseInt(res[1],16),parseInt(res[2],16),parseInt(res[3],16));if(res=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))return m(parseInt(res[1]+res[1],16),parseInt(res[2]+res[2],16),parseInt(res[3]+res[3],16));var name=$.trim(str).toLowerCase();if(name=="transparent")return m(255,255,255,0);else{res=lookupColors[name]||[0,0,0];return m(res[0],res[1],res[2])}};var lookupColors={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);

// the actual Flot code
(function($) {

	// Cache the prototype hasOwnProperty for faster access

	var hasOwnProperty = Object.prototype.hasOwnProperty;

    // A shim to provide 'detach' to jQuery versions prior to 1.4.  Using a DOM
    // operation produces the same effect as detach, i.e. removing the element
    // without touching its jQuery data.

    // Do not merge this into Flot 0.9, since it requires jQuery 1.4.4+.

    if (!$.fn.detach) {
        $.fn.detach = function() {
            return this.each(function() {
                if (this.parentNode) {
                    this.parentNode.removeChild( this );
                }
            });
        };
    }

	///////////////////////////////////////////////////////////////////////////
	// The Canvas object is a wrapper around an HTML5 <canvas> tag.
	//
	// @constructor
	// @param {string} cls List of classes to apply to the canvas.
	// @param {element} container Element onto which to append the canvas.
	//
	// Requiring a container is a little iffy, but unfortunately canvas
	// operations don't work unless the canvas is attached to the DOM.

	function Canvas(cls, container) {

		var element = container.children("." + cls)[0];

		if (element == null) {

			element = document.createElement("canvas");
			element.className = cls;

			$(element).css({ direction: "ltr", position: "absolute", left: 0, top: 0 })
				.appendTo(container);

			// If HTML5 Canvas isn't available, fall back to [Ex|Flash]canvas

			if (!element.getContext) {
				if (window.G_vmlCanvasManager) {
					element = window.G_vmlCanvasManager.initElement(element);
				} else {
					throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");
				}
			}
		}

		this.element = element;

		var context = this.context = element.getContext("2d");

		// Determine the screen's ratio of physical to device-independent
		// pixels.  This is the ratio between the canvas width that the browser
		// advertises and the number of pixels actually present in that space.

		// The iPhone 4, for example, has a device-independent width of 320px,
		// but its screen is actually 640px wide.  It therefore has a pixel
		// ratio of 2, while most normal devices have a ratio of 1.

		var devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio =
				context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1;

		this.pixelRatio = devicePixelRatio / backingStoreRatio;

		// Size the canvas to match the internal dimensions of its container

		this.resize(container.width(), container.height());

		// Collection of HTML div layers for text overlaid onto the canvas

		this.textContainer = null;
		this.text = {};

		// Cache of text fragments and metrics, so we can avoid expensively
		// re-calculating them when the plot is re-rendered in a loop.

		this._textCache = {};
	}

	// Resizes the canvas to the given dimensions.
	//
	// @param {number} width New width of the canvas, in pixels.
	// @param {number} width New height of the canvas, in pixels.

	Canvas.prototype.resize = function(width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error("Invalid dimensions for plot, width = " + width + ", height = " + height);
		}

		var element = this.element,
			context = this.context,
			pixelRatio = this.pixelRatio;

		// Resize the canvas, increasing its density based on the display's
		// pixel ratio; basically giving it more pixels without increasing the
		// size of its element, to take advantage of the fact that retina
		// displays have that many more pixels in the same advertised space.

		// Resizing should reset the state (excanvas seems to be buggy though)

		if (this.width != width) {
			element.width = width * pixelRatio;
			element.style.width = width + "px";
			this.width = width;
		}

		if (this.height != height) {
			element.height = height * pixelRatio;
			element.style.height = height + "px";
			this.height = height;
		}

		// Save the context, so we can reset in case we get replotted.  The
		// restore ensure that we're really back at the initial state, and
		// should be safe even if we haven't saved the initial state yet.

		context.restore();
		context.save();

		// Scale the coordinate space to match the display density; so even though we
		// may have twice as many pixels, we still want lines and other drawing to
		// appear at the same size; the extra pixels will just make them crisper.

		context.scale(pixelRatio, pixelRatio);
	};

	// Clears the entire canvas area, not including any overlaid HTML text

	Canvas.prototype.clear = function() {
		this.context.clearRect(0, 0, this.width, this.height);
	};

	// Finishes rendering the canvas, including managing the text overlay.

	Canvas.prototype.render = function() {

		var cache = this._textCache;

		// For each text layer, add elements marked as active that haven't
		// already been rendered, and remove those that are no longer active.

		for (var layerKey in cache) {
			if (hasOwnProperty.call(cache, layerKey)) {

				var layer = this.getTextLayer(layerKey),
					layerCache = cache[layerKey];

				layer.hide();

				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {

								var positions = styleCache[key].positions;

								for (var i = 0, position; position = positions[i]; i++) {
									if (position.active) {
										if (!position.rendered) {
											layer.append(position.element);
											position.rendered = true;
										}
									} else {
										positions.splice(i--, 1);
										if (position.rendered) {
											position.element.detach();
										}
									}
								}

								if (positions.length == 0) {
									delete styleCache[key];
								}
							}
						}
					}
				}

				layer.show();
			}
		}
	};

	// Creates (if necessary) and returns the text overlay container.
	//
	// @param {string} classes String of space-separated CSS classes used to
	//     uniquely identify the text layer.
	// @return {object} The jQuery-wrapped text-layer div.

	Canvas.prototype.getTextLayer = function(classes) {

		var layer = this.text[classes];

		// Create the text layer if it doesn't exist

		if (layer == null) {

			// Create the text layer container, if it doesn't exist

			if (this.textContainer == null) {
				this.textContainer = $("<div class='flot-text'></div>")
					.css({
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						'font-size': "smaller",
						color: "#545454"
					})
					.insertAfter(this.element);
			}

			layer = this.text[classes] = $("<div></div>")
				.addClass(classes)
				.css({
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0
				})
				.appendTo(this.textContainer);
		}

		return layer;
	};

	// Creates (if necessary) and returns a text info object.
	//
	// The object looks like this:
	//
	// {
	//     width: Width of the text's wrapper div.
	//     height: Height of the text's wrapper div.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     positions: Array of positions at which this text is drawn.
	// }
	//
	// The positions array contains objects that look like this:
	//
	// {
	//     active: Flag indicating whether the text should be visible.
	//     rendered: Flag indicating whether the text is currently visible.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     x: X coordinate at which to draw the text.
	//     y: Y coordinate at which to draw the text.
	// }
	//
	// Each position after the first receives a clone of the original element.
	//
	// The idea is that that the width, height, and general 'identity' of the
	// text is constant no matter where it is placed; the placements are a
	// secondary property.
	//
	// Canvas maintains a cache of recently-used text info objects; getTextInfo
	// either returns the cached element or creates a new entry.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {string} text Text string to retrieve info for.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @return {object} a text info object.

	Canvas.prototype.getTextInfo = function(layer, text, font, angle, width) {

		var textStyle, layerCache, styleCache, info;

		// Cast the value to a string, in case we were given a number or such

		text = "" + text;

		// If the font is a font-spec object, generate a CSS font definition

		if (typeof font === "object") {
			textStyle = font.style + " " + font.variant + " " + font.weight + " " + font.size + "px/" + font.lineHeight + "px " + font.family;
		} else {
			textStyle = font;
		}

		// Retrieve (or create) the cache for the text's layer and styles

		layerCache = this._textCache[layer];

		if (layerCache == null) {
			layerCache = this._textCache[layer] = {};
		}

		styleCache = layerCache[textStyle];

		if (styleCache == null) {
			styleCache = layerCache[textStyle] = {};
		}

		info = styleCache[text];

		// If we can't find a matching element in our cache, create a new one

		if (info == null) {

			var element = $("<div></div>").html(text)
				.css({
					position: "absolute",
					'max-width': width,
					top: -9999
				})
				.appendTo(this.getTextLayer(layer));

			if (typeof font === "object") {
				element.css({
					font: textStyle,
					color: font.color
				});
			} else if (typeof font === "string") {
				element.addClass(font);
			}

			info = styleCache[text] = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				element: element,
				positions: []
			};

			element.detach();
		}

		return info;
	};

	// Adds a text string to the canvas text overlay.
	//
	// The text isn't drawn immediately; it is marked as rendering, which will
	// result in its addition to the canvas on the next render pass.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number} x X coordinate at which to draw the text.
	// @param {number} y Y coordinate at which to draw the text.
	// @param {string} text Text string to draw.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @param {string=} halign Horizontal alignment of the text; either "left",
	//     "center" or "right".
	// @param {string=} valign Vertical alignment of the text; either "top",
	//     "middle" or "bottom".

	Canvas.prototype.addText = function(layer, x, y, text, font, angle, width, halign, valign) {

		var info = this.getTextInfo(layer, text, font, angle, width),
			positions = info.positions;

		// Tweak the div's position to match the text's alignment

		if (halign == "center") {
			x -= info.width / 2;
		} else if (halign == "right") {
			x -= info.width;
		}

		if (valign == "middle") {
			y -= info.height / 2;
		} else if (valign == "bottom") {
			y -= info.height;
		}

		// Determine whether this text already exists at this position.
		// If so, mark it for inclusion in the next render pass.

		for (var i = 0, position; position = positions[i]; i++) {
			if (position.x == x && position.y == y) {
				position.active = true;
				return;
			}
		}

		// If the text doesn't exist at this position, create a new entry

		// For the very first position we'll re-use the original element,
		// while for subsequent ones we'll clone it.

		position = {
			active: true,
			rendered: false,
			element: positions.length ? info.element.clone() : info.element,
			x: x,
			y: y
		};

		positions.push(position);

		// Move the element to its final position within the container

		position.element.css({
			top: Math.round(y),
			left: Math.round(x),
			'text-align': halign	// In case the text wraps
		});
	};

	// Removes one or more text strings from the canvas text overlay.
	//
	// If no parameters are given, all text within the layer is removed.
	//
	// Note that the text is not immediately removed; it is simply marked as
	// inactive, which will result in its removal on the next render pass.
	// This avoids the performance penalty for 'clear and redraw' behavior,
	// where we potentially get rid of all text on a layer, but will likely
	// add back most or all of it later, as when redrawing axes, for example.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number=} x X coordinate of the text.
	// @param {number=} y Y coordinate of the text.
	// @param {string=} text Text string to remove.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which the text is rotated, in degrees.
	//     Angle is currently unused, it will be implemented in the future.

	Canvas.prototype.removeText = function(layer, x, y, text, font, angle) {
		if (text == null) {
			var layerCache = this._textCache[layer];
			if (layerCache != null) {
				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {
								var positions = styleCache[key].positions;
								for (var i = 0, position; position = positions[i]; i++) {
									position.active = false;
								}
							}
						}
					}
				}
			}
		} else {
			var positions = this.getTextInfo(layer, text, font, angle).positions;
			for (var i = 0, position; position = positions[i]; i++) {
				if (position.x == x && position.y == y) {
					position.active = false;
				}
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////
	// The top-level container for the entire plot.

    function Plot(placeholder, data_, options_, plugins) {
        // data is on the form:
        //   [ series1, series2 ... ]
        // where series is either just the data as [ [x1, y1], [x2, y2], ... ]
        // or { data: [ [x1, y1], [x2, y2], ... ], label: "some label", ... }

        var series = [],
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1, // number of colums in legend table
                    labelFormatter: null, // fn: string -> string
                    labelBoxBorderColor: "#ccc", // border color for the little label boxes
                    container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                    position: "ne", // position of default legend container within plot
                    margin: 5, // distance from grid edge to default legend container within plot
                    backgroundColor: null, // null means auto-detect
                    backgroundOpacity: 0.85, // set to 0 to avoid background
                    sorted: null    // default to no legend sorting
                },
                xaxis: {
                    show: null, // null = auto-detect, true = always, false = never
                    position: "bottom", // or "top"
                    mode: null, // null or "time"
                    font: null, // null (derived from CSS in placeholder) or object like { size: 11, lineHeight: 13, style: "italic", weight: "bold", family: "sans-serif", variant: "small-caps" }
                    color: null, // base color, labels, ticks
                    tickColor: null, // possibly different color of ticks, e.g. "rgba(0,0,0,0.15)"
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoscaleMargin: null, // margin in % to add if auto-setting min/max
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    labelWidth: null, // size of tick labels in pixels
                    labelHeight: null,
                    reserveSpace: null, // whether to reserve space even if axis isn't shown
                    tickLength: null, // size in pixels of ticks, or "full" for whole line
                    alignTicksWithAxis: null, // axis number or null for no sync
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null // number or [number, "unit"]
                },
                yaxis: {
                    autoscaleMargin: 0.02,
                    position: "left" // or "right"
                },
                xaxes: [],
                yaxes: [],
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle" // or callback
                    },
                    lines: {
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled
                        lineWidth: 2, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                        // Omit 'zero', so we can later default its value to
                        // match that of the 'fill' option.
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        barWidth: 1, // in units of the x axis
                        fill: true,
                        fillColor: null,
                        align: "left", // "left", "right", or "center"
                        horizontal: false,
                        zero: true
                    },
                    shadowSize: 3,
                    highlightColor: null
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454", // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    borderColor: null, // set if different from the grid color
                    tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
                    margin: 0, // distance from the canvas edge to the grid
                    labelMargin: 5, // in pixels
                    axisMargin: 8, // in pixels
                    borderWidth: 2, // in pixels
                    minBorderMargin: null, // in pixels, null means taken from points radius
                    markings: null, // array of ranges or fn: axes -> array of ranges
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    // interactive stuff
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true, // highlight in case mouse is near
                    mouseActiveRadius: 10 // how far the mouse can be away to activate an item
                },
                interaction: {
                    redrawOverlayInterval: 1000/60 // time between updates, -1 means in same flow
                },
                hooks: {}
            },
        surface = null,     // the canvas for the plot itself
        overlay = null,     // canvas for interactive stuff on top of plot
        eventHolder = null, // jQuery object that events should be bound to
        ctx = null, octx = null,
        xaxes = [], yaxes = [],
        plotOffset = { left: 0, right: 0, top: 0, bottom: 0},
        plotWidth = 0, plotHeight = 0,
        hooks = {
            processOptions: [],
            processRawData: [],
            processDatapoints: [],
            processOffset: [],
            drawBackground: [],
            drawSeries: [],
            draw: [],
            bindEvents: [],
            drawOverlay: [],
            shutdown: []
        },
        plot = this;

        // public functions
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() { return placeholder; };
        plot.getCanvas = function() { return surface.element; };
        plot.getPlotOffset = function() { return plotOffset; };
        plot.width = function () { return plotWidth; };
        plot.height = function () { return plotHeight; };
        plot.offset = function () {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function () { return series; };
        plot.getAxes = function () {
            var res = {}, i;
            $.each(xaxes.concat(yaxes), function (_, axis) {
                if (axis)
                    res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis;
            });
            return res;
        };
        plot.getXAxes = function () { return xaxes; };
        plot.getYAxes = function () { return yaxes; };
        plot.c2p = canvasToAxisCoords;
        plot.p2c = axisToCanvasCoords;
        plot.getOptions = function () { return options; };
        plot.highlight = highlight;
        plot.unhighlight = unhighlight;
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return {
                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left, 10),
                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top, 10)
            };
        };
        plot.shutdown = shutdown;
        plot.destroy = function () {
            shutdown();
            placeholder.removeData("plot").empty();

            series = [];
            options = null;
            surface = null;
            overlay = null;
            eventHolder = null;
            ctx = null;
            octx = null;
            xaxes = [];
            yaxes = [];
            hooks = null;
            highlights = [];
            plot = null;
        };
        plot.resize = function () {
        	var width = placeholder.width(),
        		height = placeholder.height();
            surface.resize(width, height);
            overlay.resize(width, height);
        };

        // public attributes
        plot.hooks = hooks;

        // initialize
        initPlugins(plot);
        parseOptions(options_);
        setupCanvases();
        setData(data_);
        setupGrid();
        draw();
        bindEvents();


        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i)
                hook[i].apply(this, args);
        }

        function initPlugins() {

            // References to key classes, allowing plugins to modify them

            var classes = {
                Canvas: Canvas
            };

            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot, classes);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }

        function parseOptions(opts) {

            $.extend(true, options, opts);

            // $.extend merges arrays, rather than replacing them.  When less
            // colors are provided than the size of the default palette, we
            // end up with those colors plus the remaining defaults, which is
            // not expected behavior; avoid it by replacing them here.

            if (opts && opts.colors) {
            	options.colors = opts.colors;
            }

            if (options.xaxis.color == null)
                options.xaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            if (options.yaxis.color == null)
                options.yaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            if (options.xaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.xaxis.tickColor = options.grid.tickColor || options.xaxis.color;
            if (options.yaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.yaxis.tickColor = options.grid.tickColor || options.yaxis.color;

            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            if (options.grid.tickColor == null)
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            // Fill in defaults for axis options, including any unspecified
            // font-spec fields, if a font-spec was provided.

            // If no x/y axis options were provided, create one of each anyway,
            // since the rest of the code assumes that they exist.

            var i, axisOptions, axisCount,
                fontSize = placeholder.css("font-size"),
                fontSizeDefault = fontSize ? +fontSize.replace("px", "") : 13,
                fontDefaults = {
                    style: placeholder.css("font-style"),
                    size: Math.round(0.8 * fontSizeDefault),
                    variant: placeholder.css("font-variant"),
                    weight: placeholder.css("font-weight"),
                    family: placeholder.css("font-family")
                };

            axisCount = options.xaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.xaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.xaxis, axisOptions);
                options.xaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            axisCount = options.yaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.yaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.yaxis, axisOptions);
                options.yaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            // backwards compatibility, to be removed in future
            if (options.xaxis.noTicks && options.xaxis.ticks == null)
                options.xaxis.ticks = options.xaxis.noTicks;
            if (options.yaxis.noTicks && options.yaxis.ticks == null)
                options.yaxis.ticks = options.yaxis.noTicks;
            if (options.x2axis) {
                options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis);
                options.xaxes[1].position = "top";
                // Override the inherit to allow the axis to auto-scale
                if (options.x2axis.min == null) {
                    options.xaxes[1].min = null;
                }
                if (options.x2axis.max == null) {
                    options.xaxes[1].max = null;
                }
            }
            if (options.y2axis) {
                options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis);
                options.yaxes[1].position = "right";
                // Override the inherit to allow the axis to auto-scale
                if (options.y2axis.min == null) {
                    options.yaxes[1].min = null;
                }
                if (options.y2axis.max == null) {
                    options.yaxes[1].max = null;
                }
            }
            if (options.grid.coloredAreas)
                options.grid.markings = options.grid.coloredAreas;
            if (options.grid.coloredAreasColor)
                options.grid.markingsColor = options.grid.coloredAreasColor;
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize != null)
                options.series.shadowSize = options.shadowSize;
            if (options.highlightColor != null)
                options.series.highlightColor = options.highlightColor;

            // save options on axes for future reference
            for (i = 0; i < options.xaxes.length; ++i)
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            for (i = 0; i < options.yaxes.length; ++i)
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];

            // add hooks from options
            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);

            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            series = parseData(d);
            fillInSeriesOptions();
            processData();
        }

        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data != null) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                }
                else
                    s.data = d[i];
                res.push(s);
            }

            return res;
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a == "object") // if we got a real axis, extract number
                a = a.n;
            if (typeof a != "number")
                a = 1; // default to first axis
            return a;
        }

        function allAxes() {
            // return flat array without annoying null entries
            return $.grep(xaxes.concat(yaxes), function (a) { return a; });
        }

        function canvasToAxisCoords(pos) {
            // return an object with x/y corresponding to all used axes
            var res = {}, i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used)
                    res["x" + axis.n] = axis.c2p(pos.left);
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used)
                    res["y" + axis.n] = axis.c2p(pos.top);
            }

            if (res.x1 !== undefined)
                res.x = res.x1;
            if (res.y1 !== undefined)
                res.y = res.y1;

            return res;
        }

        function axisToCanvasCoords(pos) {
            // get canvas coords from the first pair of x/y found in pos
            var res = {}, i, axis, key;

            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "x";

                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "y";

                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            return res;
        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1])
                axes[number - 1] = {
                    n: number, // save the number for future reference
                    direction: axes == xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis)
                };

            return axes[number - 1];
        }

        function fillInSeriesOptions() {

            var neededColors = series.length, maxIndex = -1, i;

            // Subtract the number of series that already have fixed colors or
            // color indexes from the number that we still need to generate.

            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    neededColors--;
                    if (typeof sc == "number" && sc > maxIndex) {
                        maxIndex = sc;
                    }
                }
            }

            // If any of the series have fixed color indexes, then we need to
            // generate at least as many colors as the highest index.

            if (neededColors <= maxIndex) {
                neededColors = maxIndex + 1;
            }

            // Generate all the colors, using first the option colors and then
            // variations on those colors once they're exhausted.

            var c, colors = [], colorPool = options.colors,
                colorPoolSize = colorPool.length, variation = 0;

            for (i = 0; i < neededColors; i++) {

                c = $.color.parse(colorPool[i % colorPoolSize] || "#666");

                // Each time we exhaust the colors in the pool we adjust
                // a scaling factor used to produce more variations on
                // those colors. The factor alternates negative/positive
                // to produce lighter/darker colors.

                // Reset the variation after every few cycles, or else
                // it will end up producing only white or black colors.

                if (i % colorPoolSize == 0 && i) {
                    if (variation >= 0) {
                        if (variation < 0.5) {
                            variation = -variation - 0.2;
                        } else variation = 0;
                    } else variation = -variation;
                }

                colors[i] = c.scale('rgb', 1 + variation);
            }

            // Finalize the series options, filling in their colors

            var colori = 0, s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                }
                else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s)
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }

                // If nothing was provided for lines.zero, default it to match
                // lines.fill, since areas by default should extend to zero.

                if (s.lines.zero == null) {
                    s.lines.zero = !!s.lines.fill;
                }

                // setup axes
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                fakeInfinity = Number.MAX_VALUE,
                i, j, k, m, length,
                s, points, ps, x, y, axis, val, f, p,
                data, format;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min != -fakeInfinity)
                    axis.datamin = min;
                if (max > axis.datamax && max != fakeInfinity)
                    axis.datamax = max;
            }

            $.each(allAxes(), function (_, axis) {
                // init axis
                axis.datamin = topSentry;
                axis.datamax = bottomSentry;
                axis.used = false;
            });

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = { points: [] };

                executeHooks(hooks.processRawData, [ s, s.data, s.datapoints ]);
            }

            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                data = s.data;
                format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({ x: true, number: true, required: true });
                    format.push({ y: true, number: true, required: true });

                    if (s.bars.show || (s.lines.show && s.lines.fill)) {
                        var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                        format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                        if (s.bars.horizontal) {
                            delete format[format.length - 1].y;
                            format[format.length - 1].x = true;
                        }
                    }

                    s.datapoints.format = format;
                }

                if (s.datapoints.pointsize != null)
                    continue; // already filled in

                s.datapoints.pointsize = format.length;

                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                var insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;

                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val))
                                        val = null;
                                    else if (val == Infinity)
                                        val = fakeInfinity;
                                    else if (val == -Infinity)
                                        val = -fakeInfinity;
                                }

                                if (val == null) {
                                    if (f.required)
                                        nullify = true;

                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }

                            points[k + m] = val;
                        }
                    }

                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.autoscale !== false) {
                                    if (f.x) {
                                        updateAxis(s.xaxis, val, val);
                                    }
                                    if (f.y) {
                                        updateAxis(s.yaxis, val, val);
                                    }
                                }
                            }
                            points[k + m] = null;
                        }
                    }
                    else {
                        // a little bit of line specific stuff that
                        // perhaps shouldn't be here, but lacking
                        // better means...
                        if (insertSteps && k > 0
                            && points[k - ps] != null
                            && points[k - ps] != points[k]
                            && points[k - ps + 1] != points[k + 1]) {
                            // copy the point to make room for a middle point
                            for (m = 0; m < ps; ++m)
                                points[k + ps + m] = points[k + m];

                            // middle point has same y
                            points[k + 1] = points[k - ps + 1];

                            // we've added a point, better reflect that
                            k += ps;
                        }
                    }
                }
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                executeHooks(hooks.processDatapoints, [ s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points;
                ps = s.datapoints.pointsize;
                format = s.datapoints.format;

                var xmin = topSentry, ymin = topSentry,
                    xmax = bottomSentry, ymax = bottomSentry;

                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f || f.autoscale === false || val == fakeInfinity || val == -fakeInfinity)
                            continue;

                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }

                if (s.bars.show) {
                    // make sure we got room for the bar on the dancing floor
                    var delta;

                    switch (s.bars.align) {
                        case "left":
                            delta = 0;
                            break;
                        case "right":
                            delta = -s.bars.barWidth;
                            break;
                        default:
                            delta = -s.bars.barWidth / 2;
                    }

                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    }
                    else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }

                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }

            $.each(allAxes(), function (_, axis) {
                if (axis.datamin == topSentry)
                    axis.datamin = null;
                if (axis.datamax == bottomSentry)
                    axis.datamax = null;
            });
        }

        function setupCanvases() {

            // Make sure the placeholder is clear of everything except canvases
            // from a previous plot in this container that we'll try to re-use.

            placeholder.css("padding", 0) // padding messes up the positioning
                .children().filter(function(){
                    return !$(this).hasClass("flot-overlay") && !$(this).hasClass('flot-base');
                }).remove();

            if (placeholder.css("position") == 'static')
                placeholder.css("position", "relative"); // for positioning labels and overlay

            surface = new Canvas("flot-base", placeholder);
            overlay = new Canvas("flot-overlay", placeholder); // overlay canvas for interactive features

            ctx = surface.context;
            octx = overlay.context;

            // define which element we're listening for events on
            eventHolder = $(overlay.element).unbind();

            // If we're re-using a plot object, shut down the old one

            var existing = placeholder.data("plot");

            if (existing) {
                existing.shutdown();
                overlay.clear();
            }

            // save in case we get replotted
            placeholder.data("plot", plot);
        }

        function bindEvents() {
            // bind events
            if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);

                // Use bind, rather than .mouseleave, because we officially
                // still support jQuery 1.2.6, which doesn't define a shortcut
                // for mouseenter or mouseleave.  This was a bug/oversight that
                // was fixed somewhere around 1.3.x.  We can return to using
                // .mouseleave when we drop support for 1.2.6.

                eventHolder.bind("mouseleave", onMouseLeave);
            }

            if (options.grid.clickable)
                eventHolder.click(onClick);

            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function shutdown() {
            if (redrawTimeout)
                clearTimeout(redrawTimeout);

            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);

            executeHooks(hooks.shutdown, [eventHolder]);
        }

        function setTransformationHelpers(axis) {
            // set helper functions on the axis, assumes plot area
            // has been computed already

            function identity(x) { return x; }

            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;

            // precompute how much the axis is scaling a point
            // in canvas space
            if (axis.direction == "x") {
                s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                m = Math.min(t(axis.max), t(axis.min));
            }
            else {
                s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }

            // data point to canvas coordinate
            if (t == identity) // slight optimization
                axis.p2c = function (p) { return (p - m) * s; };
            else
                axis.p2c = function (p) { return (t(p) - m) * s; };
            // canvas coordinate to data point
            if (!it)
                axis.c2p = function (c) { return m + c / s; };
            else
                axis.c2p = function (c) { return it(m + c / s); };
        }

        function measureTickLabels(axis) {

            var opts = axis.options,
                ticks = axis.ticks || [],
                labelWidth = opts.labelWidth || 0,
                labelHeight = opts.labelHeight || 0,
                maxWidth = labelWidth || (axis.direction == "x" ? Math.floor(surface.width / (ticks.length || 1)) : null),
                legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                font = opts.font || "flot-tick-label tickLabel";

            for (var i = 0; i < ticks.length; ++i) {

                var t = ticks[i];

                if (!t.label)
                    continue;

                var info = surface.getTextInfo(layer, t.label, font, null, maxWidth);

                labelWidth = Math.max(labelWidth, info.width);
                labelHeight = Math.max(labelHeight, info.height);
            }

            axis.labelWidth = opts.labelWidth || labelWidth;
            axis.labelHeight = opts.labelHeight || labelHeight;
        }

        function allocateAxisBoxFirstPhase(axis) {
            // find the bounding box of the axis by looking at label
            // widths/heights and ticks, make room by diminishing the
            // plotOffset; this first phase only looks at one
            // dimension per axis, the other dimension depends on the
            // other axes so will have to wait

            var lw = axis.labelWidth,
                lh = axis.labelHeight,
                pos = axis.options.position,
                isXAxis = axis.direction === "x",
                tickLength = axis.options.tickLength,
                axisMargin = options.grid.axisMargin,
                padding = options.grid.labelMargin,
                innermost = true,
                outermost = true,
                first = true,
                found = false;

            // Determine the axis's position in its direction and on its side

            $.each(isXAxis ? xaxes : yaxes, function(i, a) {
                if (a && (a.show || a.reserveSpace)) {
                    if (a === axis) {
                        found = true;
                    } else if (a.options.position === pos) {
                        if (found) {
                            outermost = false;
                        } else {
                            innermost = false;
                        }
                    }
                    if (!found) {
                        first = false;
                    }
                }
            });

            // The outermost axis on each side has no margin

            if (outermost) {
                axisMargin = 0;
            }

            // The ticks for the first axis in each direction stretch across

            if (tickLength == null) {
                tickLength = first ? "full" : 5;
            }

            if (!isNaN(+tickLength))
                padding += +tickLength;

            if (isXAxis) {
                lh += padding;

                if (pos == "bottom") {
                    plotOffset.bottom += lh + axisMargin;
                    axis.box = { top: surface.height - plotOffset.bottom, height: lh };
                }
                else {
                    axis.box = { top: plotOffset.top + axisMargin, height: lh };
                    plotOffset.top += lh + axisMargin;
                }
            }
            else {
                lw += padding;

                if (pos == "left") {
                    axis.box = { left: plotOffset.left + axisMargin, width: lw };
                    plotOffset.left += lw + axisMargin;
                }
                else {
                    plotOffset.right += lw + axisMargin;
                    axis.box = { left: surface.width - plotOffset.right, width: lw };
                }
            }

             // save for future reference
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.box.padding = padding;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
            // now that all axis boxes have been placed in one
            // dimension, we can set the remaining dimension coordinates
            if (axis.direction == "x") {
                axis.box.left = plotOffset.left - axis.labelWidth / 2;
                axis.box.width = surface.width - plotOffset.left - plotOffset.right + axis.labelWidth;
            }
            else {
                axis.box.top = plotOffset.top - axis.labelHeight / 2;
                axis.box.height = surface.height - plotOffset.bottom - plotOffset.top + axis.labelHeight;
            }
        }

        function adjustLayoutForThingsStickingOut() {
            // possibly adjust plot offset to ensure everything stays
            // inside the canvas and isn't clipped off

            var minMargin = options.grid.minBorderMargin,
                axis, i;

            // check stuff from the plot (FIXME: this should just read
            // a value from the series, otherwise it's impossible to
            // customize)
            if (minMargin == null) {
                minMargin = 0;
                for (i = 0; i < series.length; ++i)
                    minMargin = Math.max(minMargin, 2 * (series[i].points.radius + series[i].points.lineWidth/2));
            }

            var margins = {
                left: minMargin,
                right: minMargin,
                top: minMargin,
                bottom: minMargin
            };

            // check axis labels, note we don't check the actual
            // labels but instead use the overall width/height to not
            // jump as much around with replots
            $.each(allAxes(), function (_, axis) {
                if (axis.reserveSpace && axis.ticks && axis.ticks.length) {
                    if (axis.direction === "x") {
                        margins.left = Math.max(margins.left, axis.labelWidth / 2);
                        margins.right = Math.max(margins.right, axis.labelWidth / 2);
                    } else {
                        margins.bottom = Math.max(margins.bottom, axis.labelHeight / 2);
                        margins.top = Math.max(margins.top, axis.labelHeight / 2);
                    }
                }
            });

            plotOffset.left = Math.ceil(Math.max(margins.left, plotOffset.left));
            plotOffset.right = Math.ceil(Math.max(margins.right, plotOffset.right));
            plotOffset.top = Math.ceil(Math.max(margins.top, plotOffset.top));
            plotOffset.bottom = Math.ceil(Math.max(margins.bottom, plotOffset.bottom));
        }

        function setupGrid() {
            var i, axes = allAxes(), showGrid = options.grid.show;

            // Initialize the plot's offset from the edge of the canvas

            for (var a in plotOffset) {
                var margin = options.grid.margin || 0;
                plotOffset[a] = typeof margin == "number" ? margin : margin[a] || 0;
            }

            executeHooks(hooks.processOffset, [plotOffset]);

            // If the grid is visible, add its border width to the offset

            for (var a in plotOffset) {
                if(typeof(options.grid.borderWidth) == "object") {
                    plotOffset[a] += showGrid ? options.grid.borderWidth[a] : 0;
                }
                else {
                    plotOffset[a] += showGrid ? options.grid.borderWidth : 0;
                }
            }

            $.each(axes, function (_, axis) {
                var axisOpts = axis.options;
                axis.show = axisOpts.show == null ? axis.used : axisOpts.show;
                axis.reserveSpace = axisOpts.reserveSpace == null ? axis.show : axisOpts.reserveSpace;
                setRange(axis);
            });

            if (showGrid) {

                var allocatedAxes = $.grep(axes, function (axis) {
                    return axis.show || axis.reserveSpace;
                });

                $.each(allocatedAxes, function (_, axis) {
                    // make the ticks
                    setupTickGeneration(axis);
                    setTicks(axis);
                    snapRangeToTicks(axis, axis.ticks);
                    // find labelWidth/Height for axis
                    measureTickLabels(axis);
                });

                // with all dimensions calculated, we can compute the
                // axis bounding boxes, start from the outside
                // (reverse order)
                for (i = allocatedAxes.length - 1; i >= 0; --i)
                    allocateAxisBoxFirstPhase(allocatedAxes[i]);

                // make sure we've got enough space for things that
                // might stick out
                adjustLayoutForThingsStickingOut();

                $.each(allocatedAxes, function (_, axis) {
                    allocateAxisBoxSecondPhase(axis);
                });
            }

            plotWidth = surface.width - plotOffset.left - plotOffset.right;
            plotHeight = surface.height - plotOffset.bottom - plotOffset.top;

            // now we got the proper plot dimensions, we can compute the scaling
            $.each(axes, function (_, axis) {
                setTransformationHelpers(axis);
            });

            if (showGrid) {
                drawAxisLabels();
            }

            insertLegend();
        }

        function setRange(axis) {
            var opts = axis.options,
                min = +(opts.min != null ? opts.min : axis.datamin),
                max = +(opts.max != null ? opts.max : axis.datamax),
                delta = max - min;

            if (delta == 0.0) {
                // degenerate case
                var widen = max == 0 ? 1 : 0.01;

                if (opts.min == null)
                    min -= widen;
                // always widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (opts.max == null || opts.min != null)
                    max += widen;
            }
            else {
                // consider autoscaling
                var margin = opts.autoscaleMargin;
                if (margin != null) {
                    if (opts.min == null) {
                        min -= delta * margin;
                        // make sure we don't go below zero if all values
                        // are positive
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (opts.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        function setupTickGeneration(axis) {
            var opts = axis.options;

            // estimate number of ticks
            var noTicks;
            if (typeof opts.ticks == "number" && opts.ticks > 0)
                noTicks = opts.ticks;
            else
                // heuristic based on the model a*sqrt(x) fitted to
                // some data points that seemed reasonable
                noTicks = 0.3 * Math.sqrt(axis.direction == "x" ? surface.width : surface.height);

            var delta = (axis.max - axis.min) / noTicks,
                dec = -Math.floor(Math.log(delta) / Math.LN10),
                maxDec = opts.tickDecimals;

            if (maxDec != null && dec > maxDec) {
                dec = maxDec;
            }

            var magn = Math.pow(10, -dec),
                norm = delta / magn, // norm is between 1.0 and 10.0
                size;

            if (norm < 1.5) {
                size = 1;
            } else if (norm < 3) {
                size = 2;
                // special case for 2.5, requires an extra decimal
                if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                    size = 2.5;
                    ++dec;
                }
            } else if (norm < 7.5) {
                size = 5;
            } else {
                size = 10;
            }

            size *= magn;

            if (opts.minTickSize != null && size < opts.minTickSize) {
                size = opts.minTickSize;
            }

            axis.delta = delta;
            axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec);
            axis.tickSize = opts.tickSize || size;

            // Time mode was moved to a plug-in in 0.8, and since so many people use it
            // we'll add an especially friendly reminder to make sure they included it.

            if (opts.mode == "time" && !axis.tickGenerator) {
                throw new Error("Time mode requires the flot.time plugin.");
            }

            // Flot supports base-10 axes; any other mode else is handled by a plug-in,
            // like flot.time.js.

            if (!axis.tickGenerator) {

                axis.tickGenerator = function (axis) {

                    var ticks = [],
                        start = floorInBase(axis.min, axis.tickSize),
                        i = 0,
                        v = Number.NaN,
                        prev;

                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push(v);
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };

				axis.tickFormatter = function (value, axis) {

					var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
					var formatted = "" + Math.round(value * factor) / factor;

					// If tickDecimals was specified, ensure that we have exactly that
					// much precision; otherwise default to the value's own precision.

					if (axis.tickDecimals != null) {
						var decimal = formatted.indexOf(".");
						var precision = decimal == -1 ? 0 : formatted.length - decimal - 1;
						if (precision < axis.tickDecimals) {
							return (precision ? formatted : formatted + ".") + ("" + factor).substr(1, axis.tickDecimals - precision);
						}
					}

                    return formatted;
                };
            }

            if ($.isFunction(opts.tickFormatter))
                axis.tickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis); };

            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis != axis) {
                    // consider snapping min/max to outermost nice ticks
                    var niceTicks = axis.tickGenerator(axis);
                    if (niceTicks.length > 0) {
                        if (opts.min == null)
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        if (opts.max == null && niceTicks.length > 1)
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                    }

                    axis.tickGenerator = function (axis) {
                        // copy ticks, scaled to this axis
                        var ticks = [], v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);
                            ticks.push(v);
                        }
                        return ticks;
                    };

                    // we might need an extra decimal since forced
                    // ticks don't necessarily fit naturally
                    if (!axis.mode && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(axis.delta) / Math.LN10) + 1),
                            ts = axis.tickGenerator(axis);

                        // only proceed if the tick interval rounded
                        // with an extra decimal doesn't give us a
                        // zero at end
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec))))
                            axis.tickDecimals = extraDec;
                    }
                }
            }
        }

        function setTicks(axis) {
            var oticks = axis.options.ticks, ticks = [];
            if (oticks == null || (typeof oticks == "number" && oticks > 0))
                ticks = axis.tickGenerator(axis);
            else if (oticks) {
                if ($.isFunction(oticks))
                    // generate the ticks
                    ticks = oticks(axis);
                else
                    ticks = oticks;
            }

            // clean up/labelify the supplied ticks, copy them over
            var i, v;
            axis.ticks = [];
            for (i = 0; i < ticks.length; ++i) {
                var label = null;
                var t = ticks[i];
                if (typeof t == "object") {
                    v = +t[0];
                    if (t.length > 1)
                        label = t[1];
                }
                else
                    v = +t;
                if (label == null)
                    label = axis.tickFormatter(v, axis);
                if (!isNaN(v))
                    axis.ticks.push({ v: v, label: label });
            }
        }

        function snapRangeToTicks(axis, ticks) {
            if (axis.options.autoscaleMargin && ticks.length > 0) {
                // snap to ticks
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, ticks[0].v);
                if (axis.options.max == null && ticks.length > 1)
                    axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }
        }

        function draw() {

            surface.clear();

            executeHooks(hooks.drawBackground, [ctx]);

            var grid = options.grid;

            // draw background, if any
            if (grid.show && grid.backgroundColor)
                drawBackground();

            if (grid.show && !grid.aboveData) {
                drawGrid();
            }

            for (var i = 0; i < series.length; ++i) {
                executeHooks(hooks.drawSeries, [ctx, series[i]]);
                drawSeries(series[i]);
            }

            executeHooks(hooks.draw, [ctx]);

            if (grid.show && grid.aboveData) {
                drawGrid();
            }

            surface.render();

            // A draw implies that either the axes or data have changed, so we
            // should probably update the overlay highlights as well.

            triggerRedrawOverlay();
        }

        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = allAxes();

            for (var i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function drawBackground() {
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
            ctx.fillRect(0, 0, plotWidth, plotHeight);
            ctx.restore();
        }

        function drawGrid() {
            var i, axes, bw, bc;

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // draw markings
            var markings = options.grid.markings;
            if (markings) {
                if ($.isFunction(markings)) {
                    axes = plot.getAxes();
                    // xmin etc. is backwards compatibility, to be
                    // removed in the future
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;

                    markings = markings(axes);
                }

                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");

                    // fill in missing
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    var xequal = xrange.from === xrange.to,
                        yequal = yrange.from === yrange.to;

                    if (xequal && yequal) {
                        continue;
                    }

                    // then draw
                    xrange.from = Math.floor(xrange.axis.p2c(xrange.from));
                    xrange.to = Math.floor(xrange.axis.p2c(xrange.to));
                    yrange.from = Math.floor(yrange.axis.p2c(yrange.from));
                    yrange.to = Math.floor(yrange.axis.p2c(yrange.to));

                    if (xequal || yequal) {
                        var lineWidth = m.lineWidth || options.grid.markingsLineWidth,
                            subPixel = lineWidth % 2 ? 0.5 : 0;
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = lineWidth;
                        if (xequal) {
                            ctx.moveTo(xrange.to + subPixel, yrange.from);
                            ctx.lineTo(xrange.to + subPixel, yrange.to);
                        } else {
                            ctx.moveTo(xrange.from, yrange.to + subPixel);
                            ctx.lineTo(xrange.to, yrange.to + subPixel);                            
                        }
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to,
                                     xrange.to - xrange.from,
                                     yrange.from - yrange.to);
                    }
                }
            }

            // draw the ticks
            axes = allAxes();
            bw = options.grid.borderWidth;

            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j], box = axis.box,
                    t = axis.tickLength, x, y, xoff, yoff;
                if (!axis.show || axis.ticks.length == 0)
                    continue;

                ctx.lineWidth = 1;

                // find the edges
                if (axis.direction == "x") {
                    x = 0;
                    if (t == "full")
                        y = (axis.position == "top" ? 0 : plotHeight);
                    else
                        y = box.top - plotOffset.top + (axis.position == "top" ? box.height : 0);
                }
                else {
                    y = 0;
                    if (t == "full")
                        x = (axis.position == "left" ? 0 : plotWidth);
                    else
                        x = box.left - plotOffset.left + (axis.position == "left" ? box.width : 0);
                }

                // draw tick bar
                if (!axis.innermost) {
                    ctx.strokeStyle = axis.options.color;
                    ctx.beginPath();
                    xoff = yoff = 0;
                    if (axis.direction == "x")
                        xoff = plotWidth + 1;
                    else
                        yoff = plotHeight + 1;

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x") {
                            y = Math.floor(y) + 0.5;
                        } else {
                            x = Math.floor(x) + 0.5;
                        }
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                    ctx.stroke();
                }

                // draw ticks

                ctx.strokeStyle = axis.options.tickColor;

                ctx.beginPath();
                for (i = 0; i < axis.ticks.length; ++i) {
                    var v = axis.ticks[i].v;

                    xoff = yoff = 0;

                    if (isNaN(v) || v < axis.min || v > axis.max
                        // skip those lying on the axes if we got a border
                        || (t == "full"
                            && ((typeof bw == "object" && bw[axis.position] > 0) || bw > 0)
                            && (v == axis.min || v == axis.max)))
                        continue;

                    if (axis.direction == "x") {
                        x = axis.p2c(v);
                        yoff = t == "full" ? -plotHeight : t;

                        if (axis.position == "top")
                            yoff = -yoff;
                    }
                    else {
                        y = axis.p2c(v);
                        xoff = t == "full" ? -plotWidth : t;

                        if (axis.position == "left")
                            xoff = -xoff;
                    }

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x")
                            x = Math.floor(x) + 0.5;
                        else
                            y = Math.floor(y) + 0.5;
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                }

                ctx.stroke();
            }


            // draw border
            if (bw) {
                // If either borderWidth or borderColor is an object, then draw the border
                // line by line instead of as one rectangle
                bc = options.grid.borderColor;
                if(typeof bw == "object" || typeof bc == "object") {
                    if (typeof bw !== "object") {
                        bw = {top: bw, right: bw, bottom: bw, left: bw};
                    }
                    if (typeof bc !== "object") {
                        bc = {top: bc, right: bc, bottom: bc, left: bc};
                    }

                    if (bw.top > 0) {
                        ctx.strokeStyle = bc.top;
                        ctx.lineWidth = bw.top;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left, 0 - bw.top/2);
                        ctx.lineTo(plotWidth, 0 - bw.top/2);
                        ctx.stroke();
                    }

                    if (bw.right > 0) {
                        ctx.strokeStyle = bc.right;
                        ctx.lineWidth = bw.right;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right / 2, 0 - bw.top);
                        ctx.lineTo(plotWidth + bw.right / 2, plotHeight);
                        ctx.stroke();
                    }

                    if (bw.bottom > 0) {
                        ctx.strokeStyle = bc.bottom;
                        ctx.lineWidth = bw.bottom;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right, plotHeight + bw.bottom / 2);
                        ctx.lineTo(0, plotHeight + bw.bottom / 2);
                        ctx.stroke();
                    }

                    if (bw.left > 0) {
                        ctx.strokeStyle = bc.left;
                        ctx.lineWidth = bw.left;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left/2, plotHeight + bw.bottom);
                        ctx.lineTo(0- bw.left/2, 0);
                        ctx.stroke();
                    }
                }
                else {
                    ctx.lineWidth = bw;
                    ctx.strokeStyle = options.grid.borderColor;
                    ctx.strokeRect(-bw/2, -bw/2, plotWidth + bw, plotHeight + bw);
                }
            }

            ctx.restore();
        }

        function drawAxisLabels() {

            $.each(allAxes(), function (_, axis) {
                var box = axis.box,
                    legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                    layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                    font = axis.options.font || "flot-tick-label tickLabel",
                    tick, x, y, halign, valign;

                // Remove text before checking for axis.show and ticks.length;
                // otherwise plugins, like flot-tickrotor, that draw their own
                // tick labels will end up with both theirs and the defaults.

                surface.removeText(layer);

                if (!axis.show || axis.ticks.length == 0)
                    return;

                for (var i = 0; i < axis.ticks.length; ++i) {

                    tick = axis.ticks[i];
                    if (!tick.label || tick.v < axis.min || tick.v > axis.max)
                        continue;

                    if (axis.direction == "x") {
                        halign = "center";
                        x = plotOffset.left + axis.p2c(tick.v);
                        if (axis.position == "bottom") {
                            y = box.top + box.padding;
                        } else {
                            y = box.top + box.height - box.padding;
                            valign = "bottom";
                        }
                    } else {
                        valign = "middle";
                        y = plotOffset.top + axis.p2c(tick.v);
                        if (axis.position == "left") {
                            x = box.left + box.width - box.padding;
                            halign = "right";
                        } else {
                            x = box.left + box.padding;
                        }
                    }

                    surface.addText(layer, x, y, tick.label, font, null, null, halign, valign);
                }
            });
        }

        function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }

        function drawSeriesLines(series) {
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null, prevy = null;

                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];

                    if (x1 == null || x2 == null)
                        continue;

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue;   // line segment is outside
                        // compute new intersection point
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);

                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    i = 0, top, areaOpen = false,
                    ypos = 1, segmentStart = 0, segmentEnd = 0;

                // we process each segment in two turns, first forward
                // direction to sketch out top, then once we hit the
                // end we go backwards to sketch the bottom
                while (true) {
                    if (ps > 0 && i > points.length + ps)
                        break;

                    i += ps; // ps is negative if going backwards

                    var x1 = points[i - ps],
                        y1 = points[i - ps + ypos],
                        x2 = points[i], y2 = points[i + ypos];

                    if (areaOpen) {
                        if (ps > 0 && x1 != null && x2 == null) {
                            // at turning point
                            segmentEnd = i;
                            ps = -ps;
                            ypos = 2;
                            continue;
                        }

                        if (ps < 0 && i == segmentStart + ps) {
                            // done with the reverse sweep
                            ctx.fill();
                            areaOpen = false;
                            ps = -ps;
                            ypos = 1;
                            i = segmentStart = segmentEnd + ps;
                            continue;
                        }
                    }

                    if (x1 == null || x2 == null)
                        continue;

                    // clip x values

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (!areaOpen) {
                        // open area
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }

                    // now first check the case where both is outside
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        continue;
                    }
                    else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        continue;
                    }

                    // else it's a bit more complicated, there might
                    // be a flat maxed out rectangle first, then a
                    // triangular cutout or reverse; to find these
                    // keep track of the current x values
                    var x1old = x1, x2old = x2;

                    // clip the y values, without shortcutting, we
                    // go through all cases in turn

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // if the x value was changed we got a rectangle
                    // to fill
                    if (x1 != x1old) {
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1));
                        // it goes to (x1, y1), but we fill that below
                    }

                    // fill triangular section, this sometimes result
                    // in redundant points if (x1, y1) hasn't changed
                    // from previous line to, but we just ignore that
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));

                    // fill the other rectangle if it's there
                    if (x2 != x2old) {
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2));
                    }
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";

            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            // FIXME: consider another form of shadow when filling is turned on
            if (lw > 0 && sw > 0) {
                // draw shadow as a thick and thin line with transparency
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                // position shadow at angle from the mid of line
                var angle = Math.PI/18;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw/2;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4), series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }

            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
            function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i], y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;

                    ctx.beginPath();
                    x = axisx.p2c(x);
                    y = axisy.p2c(y) + offset;
                    if (symbol == "circle")
                        ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                    else
                        symbol(ctx, x, y, radius, shadow);
                    ctx.closePath();

                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            var lw = series.points.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius,
                symbol = series.points.symbol;

            // If the user sets the line width to 0, we change it to a very 
            // small value. A line width of 0 seems to force the default of 1.
            // Doing the conditional here allows the shadow setting to still be 
            // optional even with a lineWidth of 0.

            if( lw == 0 )
                lw = 0.0001;

            if (lw > 0 && sw > 0) {
                // draw shadow in two steps
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w/2, true,
                           series.xaxis, series.yaxis, symbol);

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w/2, true,
                           series.xaxis, series.yaxis, symbol);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius,
                       getFillStyle(series.points, series.color), 0, false,
                       series.xaxis, series.yaxis, symbol);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth) {
            var left, right, bottom, top,
                drawLeft, drawRight, drawTop, drawBottom,
                tmp;

            // in horizontal mode, we start the bar from the left
            // instead of from the bottom so it appears to be
            // horizontal rather than vertical
            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;

                // account for negative bars
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            }
            else {
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;

                // account for negative bars
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }

            // clip
            if (right < axisx.min || left > axisx.max ||
                top < axisy.min || bottom > axisy.max)
                return;

            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }

            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }

            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }

            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);

            // fill the bar
            if (fillStyleCallback) {
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fillRect(left, top, right - left, bottom - top)
            }

            // draw outline
            if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
                c.beginPath();

                // FIXME: inline moveTo is buggy with excanvas
                c.moveTo(left, bottom);
                if (drawLeft)
                    c.lineTo(left, top);
                else
                    c.moveTo(left, top);
                if (drawTop)
                    c.lineTo(right, top);
                else
                    c.moveTo(right, top);
                if (drawRight)
                    c.lineTo(right, bottom);
                else
                    c.moveTo(right, bottom);
                if (drawBottom)
                    c.lineTo(left, bottom);
                else
                    c.moveTo(left, bottom);
                c.stroke();
            }
        }

        function drawSeriesBars(series) {
            function plotBars(datapoints, barLeft, barRight, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, series.bars.lineWidth);
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // FIXME: figure out a way to add shadows (for instance along the right edge)
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;

            var barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                default:
                    barLeft = -series.bars.barWidth / 2;
            }

            var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top); } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, fillStyleCallback, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function getFillStyle(filloptions, seriesColor, bottom, top) {
            var fill = filloptions.fill;
            if (!fill)
                return null;

            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);

            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }

        function insertLegend() {

            if (options.legend.container != null) {
                $(options.legend.container).html("");
            } else {
                placeholder.find(".legend").remove();
            }

            if (!options.legend.show) {
                return;
            }

            var fragments = [], entries = [], rowStarted = false,
                lf = options.legend.labelFormatter, s, label;

            // Build a list of legend entries, with each having a label and a color

            for (var i = 0; i < series.length; ++i) {
                s = series[i];
                if (s.label) {
                    label = lf ? lf(s.label, s) : s.label;
                    if (label) {
                        entries.push({
                            label: label,
                            color: s.color
                        });
                    }
                }
            }

            // Sort the legend using either the default or a custom comparator

            if (options.legend.sorted) {
                if ($.isFunction(options.legend.sorted)) {
                    entries.sort(options.legend.sorted);
                } else if (options.legend.sorted == "reverse") {
                	entries.reverse();
                } else {
                    var ascending = options.legend.sorted != "descending";
                    entries.sort(function(a, b) {
                        return a.label == b.label ? 0 : (
                            (a.label < b.label) != ascending ? 1 : -1   // Logical XOR
                        );
                    });
                }
            }

            // Generate markup for the list of entries, in their final order

            for (var i = 0; i < entries.length; ++i) {

                var entry = entries[i];

                if (i % options.legend.noColumns == 0) {
                    if (rowStarted)
                        fragments.push('</tr>');
                    fragments.push('<tr>');
                    rowStarted = true;
                }

                fragments.push(
                    '<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + entry.color + ';overflow:hidden"></div></div></td>' +
                    '<td class="legendLabel">' + entry.label + '</td>'
                );
            }

            if (rowStarted)
                fragments.push('</tr>');

            if (fragments.length == 0)
                return;

            var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + '</table>';
            if (options.legend.container != null)
                $(options.legend.container).html(table);
            else {
                var pos = "",
                    p = options.legend.position,
                    m = options.legend.margin;
                if (m[0] == null)
                    m = [m, m];
                if (p.charAt(0) == "n")
                    pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
                else if (p.charAt(0) == "s")
                    pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
                if (p.charAt(1) == "e")
                    pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
                else if (p.charAt(1) == "w")
                    pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
                var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos +';') + '</div>').appendTo(placeholder);
                if (options.legend.backgroundOpacity != 0.0) {
                    // put in the transparent background
                    // separately to avoid blended labels and
                    // label boxes
                    var c = options.legend.backgroundColor;
                    if (c == null) {
                        c = options.grid.backgroundColor;
                        if (c && typeof c == "string")
                            c = $.color.parse(c);
                        else
                            c = $.color.extract(legend, 'background-color');
                        c.a = 1;
                        c = c.toString();
                    }
                    var div = legend.children();
                    $('<div style="position:absolute;width:' + div.width() + 'px;height:' + div.height() + 'px;' + pos +'background-color:' + c + ';"> </div>').prependTo(legend).css('opacity', options.legend.backgroundOpacity);
                }
            }
        }


        // interactive features

        var highlights = [],
            redrawTimeout = null;

        // returns the data item the mouse is over, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null, foundPoint = false, i, j, ps;

            for (i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(series[i]))
                    continue;

                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;

                ps = s.datapoints.pointsize;
                // with inverse transforms, we can't use the maxx/maxy
                // optimization, sadly
                if (axisx.options.inverseTransform)
                    maxx = Number.MAX_VALUE;
                if (axisy.options.inverseTransform)
                    maxy = Number.MAX_VALUE;

                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1];
                        if (x == null)
                            continue;

                        // For points and lines, the cursor must be within a
                        // certain distance to the data point
                        if (x - mx > maxx || x - mx < -maxx ||
                            y - my > maxy || y - my < -maxy)
                            continue;

                        // We have to calculate distances in pixels, not in
                        // data units, because the scales of the axes may be different
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy; // we save the sqrt

                        // use <= to ensure last point takes precedence
                        // (last generally means on top of)
                        if (dist < smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }

                if (s.bars.show && !item) { // no other point can be nearby

                    var barLeft, barRight;

                    switch (s.bars.align) {
                        case "left":
                            barLeft = 0;
                            break;
                        case "right":
                            barLeft = -s.bars.barWidth;
                            break;
                        default:
                            barLeft = -s.bars.barWidth / 2;
                    }

                    barRight = barLeft + s.bars.barWidth;

                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1], b = points[j + 2];
                        if (x == null)
                            continue;

                        // for a bar graph, the cursor must be inside the bar
                        if (series[i].bars.horizontal ?
                            (mx <= Math.max(b, x) && mx >= Math.min(b, x) &&
                             my >= y + barLeft && my <= y + barRight) :
                            (mx >= x + barLeft && mx <= x + barRight &&
                             my >= Math.min(b, y) && my <= Math.max(b, y)))
                                item = [i, j / ps];
                    }
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;

                return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                         dataIndex: j,
                         series: series[i],
                         seriesIndex: i };
            }

            return null;
        }

        function onMouseMove(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return s["hoverable"] != false; });
        }

        function onMouseLeave(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return false; });
        }

        function onClick(e) {
            triggerClickHoverEvent("plotclick", e,
                                   function (s) { return s["clickable"] != false; });
        }

        // trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = eventHolder.offset(),
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top,
            pos = canvasToAxisCoords({ left: canvasX, top: canvasY });

            pos.pageX = event.pageX;
            pos.pageY = event.pageY;

            var item = findNearbyItem(canvasX, canvasY, seriesFilter);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left, 10);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top, 10);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series &&
                          h.point[0] == item.datapoint[0] &&
                          h.point[1] == item.datapoint[1]))
                        unhighlight(h.series, h.point);
                }

                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }

            placeholder.trigger(eventname, [ pos, item ]);
        }

        function triggerRedrawOverlay() {
            var t = options.interaction.redrawOverlayInterval;
            if (t == -1) {      // skip event queue
                drawOverlay();
                return;
            }

            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, t);
        }

        function drawOverlay() {
            redrawTimeout = null;

            // draw highlights
            octx.save();
            overlay.clear();
            octx.translate(plotOffset.left, plotOffset.top);

            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];

                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();

            executeHooks(hooks.drawOverlay, [octx]);
        }

        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({ series: s, point: point, auto: auto });

                triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
                return;
            }

            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);

                triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0]
                    && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }

        function drawPointHighlight(series, point) {
            var x = point[0], y = point[1],
                axisx = series.xaxis, axisy = series.yaxis,
                highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString();

            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;

            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = highlightColor;
            var radius = 1.5 * pointRadius;
            x = axisx.p2c(x);
            y = axisy.p2c(y);

            octx.beginPath();
            if (series.points.symbol == "circle")
                octx.arc(x, y, radius, 0, 2 * Math.PI, false);
            else
                series.points.symbol(octx, x, y, radius, false);
            octx.closePath();
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            var highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString(),
                fillStyle = highlightColor,
                barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                default:
                    barLeft = -series.bars.barWidth / 2;
            }

            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = highlightColor;

            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth,
                    function () { return fillStyle; }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec == "string")
                return spec;
            else {
                // assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's
                // what we support too
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);

                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null)
                            co = co.scale('rgb', c.brightness);
                        if (c.opacity != null)
                            co.a *= c.opacity;
                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }

                return gradient;
            }
        }
    }

    // Add the plot function to the top level of the jQuery object

    $.plot = function(placeholder, data, options) {
        //var t0 = new Date();
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        //(window.console ? console.log : alert)("time used (msecs): " + ((new Date()).getTime() - t0.getTime()));
        return plot;
    };

    $.plot.version = "0.8.3";

    $.plot.plugins = [];

    // Also add the plot function as a chainable property

    $.fn.plot = function(data, options) {
        return this.each(function() {
            $.plot(this, data, options);
        });
    };

    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

})(jQuery);

define("../../bower_components/flot/jquery.flot.js", function(){});

/* Flot plugin for automatically redrawing plots as the placeholder resizes.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

It works by listening for changes on the placeholder div (through the jQuery
resize event plugin) - if the size changes, it will redraw the plot.

There are no options. If you need to disable the plugin for some plots, you
can just fix the size of their placeholders.

*/

/* Inline dependency:
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,t){"$:nomunge";var i=[],n=$.resize=$.extend($.resize,{}),a,r=false,s="setTimeout",u="resize",m=u+"-special-event",o="pendingDelay",l="activeDelay",f="throttleWindow";n[o]=200;n[l]=20;n[f]=true;$.event.special[u]={setup:function(){if(!n[f]&&this[s]){return false}var e=$(this);i.push(this);e.data(m,{w:e.width(),h:e.height()});if(i.length===1){a=t;h()}},teardown:function(){if(!n[f]&&this[s]){return false}var e=$(this);for(var t=i.length-1;t>=0;t--){if(i[t]==this){i.splice(t,1);break}}e.removeData(m);if(!i.length){if(r){cancelAnimationFrame(a)}else{clearTimeout(a)}a=null}},add:function(e){if(!n[f]&&this[s]){return false}var i;function a(e,n,a){var r=$(this),s=r.data(m)||{};s.w=n!==t?n:r.width();s.h=a!==t?a:r.height();i.apply(this,arguments)}if($.isFunction(e)){i=e;return a}else{i=e.handler;e.handler=a}}};function h(t){if(r===true){r=t||1}for(var s=i.length-1;s>=0;s--){var l=$(i[s]);if(l[0]==e||l.is(":visible")){var f=l.width(),c=l.height(),d=l.data(m);if(d&&(f!==d.w||c!==d.h)){l.trigger(u,[d.w=f,d.h=c]);r=t||true}}else{d=l.data(m);d.w=0;d.h=0}}if(a!==null){if(r&&(t==null||t-r<1e3)){a=e.requestAnimationFrame(h)}else{a=setTimeout(h,n[o]);r=false}}}if(!e.requestAnimationFrame){e.requestAnimationFrame=function(){return e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t,i){return e.setTimeout(function(){t((new Date).getTime())},n[l])}}()}if(!e.cancelAnimationFrame){e.cancelAnimationFrame=function(){return e.webkitCancelRequestAnimationFrame||e.mozCancelRequestAnimationFrame||e.oCancelRequestAnimationFrame||e.msCancelRequestAnimationFrame||clearTimeout}()}})(jQuery,this);

(function ($) {
    var options = { }; // no options

    function init(plot) {
        function onResize() {
            var placeholder = plot.getPlaceholder();

            // somebody might have hidden us and we can't plot
            // when we don't have the dimensions
            if (placeholder.width() == 0 || placeholder.height() == 0)
                return;

            plot.resize();
            plot.setupGrid();
            plot.draw();
        }
        
        function bindEvents(plot, eventHolder) {
            plot.getPlaceholder().resize(onResize);
        }

        function shutdown(plot, eventHolder) {
            plot.getPlaceholder().unbind("resize", onResize);
        }
        
        plot.hooks.bindEvents.push(bindEvents);
        plot.hooks.shutdown.push(shutdown);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'resize',
        version: '1.0'
    });
})(jQuery);

define("../../bower_components/flot/jquery.flot.resize.js", function(){});

/*
Axis Labels Plugin for flot.
http://github.com/markrcote/flot-axislabels

Original code is Copyright (c) 2010 Xuan Luo.
Original code was released under the GPLv3 license by Xuan Luo, September 2010.
Original code was rereleased under the MIT license by Xuan Luo, April 2012.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function ($) {
    var options = {
      axisLabels: {
        show: true
      }
    };

    function canvasSupported() {
        return !!document.createElement('canvas').getContext;
    }

    function canvasTextSupported() {
        if (!canvasSupported()) {
            return false;
        }
        var dummy_canvas = document.createElement('canvas');
        var context = dummy_canvas.getContext('2d');
        return typeof context.fillText == 'function';
    }

    function css3TransitionSupported() {
        var div = document.createElement('div');
        return typeof div.style.MozTransition != 'undefined'    // Gecko
            || typeof div.style.OTransition != 'undefined'      // Opera
            || typeof div.style.webkitTransition != 'undefined' // WebKit
            || typeof div.style.transition != 'undefined';
    }


    function AxisLabel(axisName, position, padding, plot, opts) {
        this.axisName = axisName;
        this.position = position;
        this.padding = padding;
        this.plot = plot;
        this.opts = opts;
        this.width = 0;
        this.height = 0;
    }

    AxisLabel.prototype.cleanup = function() {
    };


    CanvasAxisLabel.prototype = new AxisLabel();
    CanvasAxisLabel.prototype.constructor = CanvasAxisLabel;
    function CanvasAxisLabel(axisName, position, padding, plot, opts) {
        AxisLabel.prototype.constructor.call(this, axisName, position, padding,
                                             plot, opts);
    }

    CanvasAxisLabel.prototype.calculateSize = function() {
        if (!this.opts.axisLabelFontSizePixels)
            this.opts.axisLabelFontSizePixels = 14;
        if (!this.opts.axisLabelFontFamily)
            this.opts.axisLabelFontFamily = 'sans-serif';

        var textWidth = this.opts.axisLabelFontSizePixels + this.padding;
        var textHeight = this.opts.axisLabelFontSizePixels + this.padding;
        if (this.position == 'left' || this.position == 'right') {
            this.width = this.opts.axisLabelFontSizePixels + this.padding;
            this.height = 0;
        } else {
            this.width = 0;
            this.height = this.opts.axisLabelFontSizePixels + this.padding;
        }
    };

    CanvasAxisLabel.prototype.draw = function(box) {
        if (!this.opts.axisLabelColour)
            this.opts.axisLabelColour = 'black';
        var ctx = this.plot.getCanvas().getContext('2d');
        ctx.save();
        ctx.font = this.opts.axisLabelFontSizePixels + 'px ' +
            this.opts.axisLabelFontFamily;
        ctx.fillStyle = this.opts.axisLabelColour;
        var width = ctx.measureText(this.opts.axisLabel).width;
        var height = this.opts.axisLabelFontSizePixels;
        var x, y, angle = 0;
        if (this.position == 'top') {
            x = box.left + box.width/2 - width/2;
            y = box.top + height*0.72;
        } else if (this.position == 'bottom') {
            x = box.left + box.width/2 - width/2;
            y = box.top + box.height - height*0.72;
        } else if (this.position == 'left') {
            x = box.left + height*0.72;
            y = box.height/2 + box.top + width/2;
            angle = -Math.PI/2;
        } else if (this.position == 'right') {
            x = box.left + box.width - height*0.72;
            y = box.height/2 + box.top - width/2;
            angle = Math.PI/2;
        }
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(this.opts.axisLabel, 0, 0);
        ctx.restore();
    };


    HtmlAxisLabel.prototype = new AxisLabel();
    HtmlAxisLabel.prototype.constructor = HtmlAxisLabel;
    function HtmlAxisLabel(axisName, position, padding, plot, opts) {
        AxisLabel.prototype.constructor.call(this, axisName, position,
                                             padding, plot, opts);
        this.elem = null;
    }

    HtmlAxisLabel.prototype.calculateSize = function() {
        var elem = $('<div class="axisLabels" style="position:absolute;">' +
                     this.opts.axisLabel + '</div>');
        this.plot.getPlaceholder().append(elem);
        // store height and width of label itself, for use in draw()
        this.labelWidth = elem.outerWidth(true);
        this.labelHeight = elem.outerHeight(true);
        elem.remove();

        this.width = this.height = 0;
        if (this.position == 'left' || this.position == 'right') {
            this.width = this.labelWidth + this.padding;
        } else {
            this.height = this.labelHeight + this.padding;
        }
    };

    HtmlAxisLabel.prototype.cleanup = function() {
        if (this.elem) {
            this.elem.remove();
        }
    };

    HtmlAxisLabel.prototype.draw = function(box) {
        this.plot.getPlaceholder().find('#' + this.axisName + 'Label').remove();
        this.elem = $('<div id="' + this.axisName +
                      'Label" " class="axisLabels" style="position:absolute;">'
                      + this.opts.axisLabel + '</div>');
        this.plot.getPlaceholder().append(this.elem);
        if (this.position == 'top') {
            this.elem.css('left', box.left + box.width/2 - this.labelWidth/2 +
                          'px');
            this.elem.css('top', box.top + 'px');
        } else if (this.position == 'bottom') {
            this.elem.css('left', box.left + box.width/2 - this.labelWidth/2 +
                          'px');
            this.elem.css('top', box.top + box.height - this.labelHeight +
                          'px');
        } else if (this.position == 'left') {
            this.elem.css('top', box.top + box.height/2 - this.labelHeight/2 +
                          'px');
            this.elem.css('left', box.left + 'px');
        } else if (this.position == 'right') {
            this.elem.css('top', box.top + box.height/2 - this.labelHeight/2 +
                          'px');
            this.elem.css('left', box.left + box.width - this.labelWidth +
                          'px');
        }
    };


    CssTransformAxisLabel.prototype = new HtmlAxisLabel();
    CssTransformAxisLabel.prototype.constructor = CssTransformAxisLabel;
    function CssTransformAxisLabel(axisName, position, padding, plot, opts) {
        HtmlAxisLabel.prototype.constructor.call(this, axisName, position,
                                                 padding, plot, opts);
    }

    CssTransformAxisLabel.prototype.calculateSize = function() {
        HtmlAxisLabel.prototype.calculateSize.call(this);
        this.width = this.height = 0;
        if (this.position == 'left' || this.position == 'right') {
            this.width = this.labelHeight + this.padding;
        } else {
            this.height = this.labelHeight + this.padding;
        }
    };

    CssTransformAxisLabel.prototype.transforms = function(degrees, x, y) {
        var stransforms = {
            '-moz-transform': '',
            '-webkit-transform': '',
            '-o-transform': '',
            '-ms-transform': ''
        };
        if (x != 0 || y != 0) {
            var stdTranslate = ' translate(' + x + 'px, ' + y + 'px)';
            stransforms['-moz-transform'] += stdTranslate;
            stransforms['-webkit-transform'] += stdTranslate;
            stransforms['-o-transform'] += stdTranslate;
            stransforms['-ms-transform'] += stdTranslate;
        }
        if (degrees != 0) {
            var rotation = degrees / 90;
            var stdRotate = ' rotate(' + degrees + 'deg)';
            stransforms['-moz-transform'] += stdRotate;
            stransforms['-webkit-transform'] += stdRotate;
            stransforms['-o-transform'] += stdRotate;
            stransforms['-ms-transform'] += stdRotate;
        }
        var s = 'top: 0; left: 0; ';
        for (var prop in stransforms) {
            if (stransforms[prop]) {
                s += prop + ':' + stransforms[prop] + ';';
            }
        }
        s += ';';
        return s;
    };

    CssTransformAxisLabel.prototype.calculateOffsets = function(box) {
        var offsets = { x: 0, y: 0, degrees: 0 };
        if (this.position == 'bottom') {
            offsets.x = box.left + box.width/2 - this.labelWidth/2;
            offsets.y = box.top + box.height - this.labelHeight;
        } else if (this.position == 'top') {
            offsets.x = box.left + box.width/2 - this.labelWidth/2;
            offsets.y = box.top;
        } else if (this.position == 'left') {
            offsets.degrees = -90;
            offsets.x = box.left - this.labelWidth/2 + this.labelHeight/2;
            offsets.y = box.height/2 + box.top;
        } else if (this.position == 'right') {
            offsets.degrees = 90;
            offsets.x = box.left + box.width - this.labelWidth/2
                        - this.labelHeight/2;
            offsets.y = box.height/2 + box.top;
        }
        offsets.x = Math.round(offsets.x);
        offsets.y = Math.round(offsets.y);

        return offsets;
    };

    CssTransformAxisLabel.prototype.draw = function(box) {
        this.plot.getPlaceholder().find("." + this.axisName + "Label").remove();
        var offsets = this.calculateOffsets(box);
        this.elem = $('<div class="axisLabels ' + this.axisName +
                      'Label" style="position:absolute; ' +
                      this.transforms(offsets.degrees, offsets.x, offsets.y) +
                      '">' + this.opts.axisLabel + '</div>');
        this.plot.getPlaceholder().append(this.elem);
    };


    IeTransformAxisLabel.prototype = new CssTransformAxisLabel();
    IeTransformAxisLabel.prototype.constructor = IeTransformAxisLabel;
    function IeTransformAxisLabel(axisName, position, padding, plot, opts) {
        CssTransformAxisLabel.prototype.constructor.call(this, axisName,
                                                         position, padding,
                                                         plot, opts);
        this.requiresResize = false;
    }

    IeTransformAxisLabel.prototype.transforms = function(degrees, x, y) {
        // I didn't feel like learning the crazy Matrix stuff, so this uses
        // a combination of the rotation transform and CSS positioning.
        var s = '';
        if (degrees != 0) {
            var rotation = degrees/90;
            while (rotation < 0) {
                rotation += 4;
            }
            s += ' filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=' + rotation + '); ';
            // see below
            this.requiresResize = (this.position == 'right');
        }
        if (x != 0) {
            s += 'left: ' + x + 'px; ';
        }
        if (y != 0) {
            s += 'top: ' + y + 'px; ';
        }
        return s;
    };

    IeTransformAxisLabel.prototype.calculateOffsets = function(box) {
        var offsets = CssTransformAxisLabel.prototype.calculateOffsets.call(
                          this, box);
        // adjust some values to take into account differences between
        // CSS and IE rotations.
        if (this.position == 'top') {
            // FIXME: not sure why, but placing this exactly at the top causes
            // the top axis label to flip to the bottom...
            offsets.y = box.top + 1;
        } else if (this.position == 'left') {
            offsets.x = box.left;
            offsets.y = box.height/2 + box.top - this.labelWidth/2;
        } else if (this.position == 'right') {
            offsets.x = box.left + box.width - this.labelHeight;
            offsets.y = box.height/2 + box.top - this.labelWidth/2;
        }
        return offsets;
    };

    IeTransformAxisLabel.prototype.draw = function(box) {
        CssTransformAxisLabel.prototype.draw.call(this, box);
        if (this.requiresResize) {
            this.elem = this.plot.getPlaceholder().find("." + this.axisName +
                                                        "Label");
            // Since we used CSS positioning instead of transforms for
            // translating the element, and since the positioning is done
            // before any rotations, we have to reset the width and height
            // in case the browser wrapped the text (specifically for the
            // y2axis).
            this.elem.css('width', this.labelWidth);
            this.elem.css('height', this.labelHeight);
        }
    };


    function init(plot) {
        plot.hooks.processOptions.push(function (plot, options) {

            if (!options.axisLabels.show)
                return;

            // This is kind of a hack. There are no hooks in Flot between
            // the creation and measuring of the ticks (setTicks, measureTickLabels
            // in setupGrid() ) and the drawing of the ticks and plot box
            // (insertAxisLabels in setupGrid() ).
            //
            // Therefore, we use a trick where we run the draw routine twice:
            // the first time to get the tick measurements, so that we can change
            // them, and then have it draw it again.
            var secondPass = false;

            var axisLabels = {};
            var axisOffsetCounts = { left: 0, right: 0, top: 0, bottom: 0 };

            var defaultPadding = 2;  // padding between axis and tick labels
            plot.hooks.draw.push(function (plot, ctx) {
                var hasAxisLabels = false;
                if (!secondPass) {
                    // MEASURE AND SET OPTIONS
                    $.each(plot.getAxes(), function(axisName, axis) {
                        var opts = axis.options // Flot 0.7
                            || plot.getOptions()[axisName]; // Flot 0.6

                        // Handle redraws initiated outside of this plug-in.
                        if (axisName in axisLabels) {
                            axis.labelHeight = axis.labelHeight -
                                axisLabels[axisName].height;
                            axis.labelWidth = axis.labelWidth -
                                axisLabels[axisName].width;
                            opts.labelHeight = axis.labelHeight;
                            opts.labelWidth = axis.labelWidth;
                            axisLabels[axisName].cleanup();
                            delete axisLabels[axisName];
                        }

                        if (!opts || !opts.axisLabel || !axis.show)
                            return;

                        hasAxisLabels = true;
                        var renderer = null;

                        if (!opts.axisLabelUseHtml &&
                            navigator.appName == 'Microsoft Internet Explorer') {
                            var ua = navigator.userAgent;
                            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null) {
                                rv = parseFloat(RegExp.$1);
                            }
                            if (rv >= 9 && !opts.axisLabelUseCanvas && !opts.axisLabelUseHtml) {
                                renderer = CssTransformAxisLabel;
                            } else if (!opts.axisLabelUseCanvas && !opts.axisLabelUseHtml) {
                                renderer = IeTransformAxisLabel;
                            } else if (opts.axisLabelUseCanvas) {
                                renderer = CanvasAxisLabel;
                            } else {
                                renderer = HtmlAxisLabel;
                            }
                        } else {
                            if (opts.axisLabelUseHtml || (!css3TransitionSupported() && !canvasTextSupported()) && !opts.axisLabelUseCanvas) {
                                renderer = HtmlAxisLabel;
                            } else if (opts.axisLabelUseCanvas || !css3TransitionSupported()) {
                                renderer = CanvasAxisLabel;
                            } else {
                                renderer = CssTransformAxisLabel;
                            }
                        }

                        var padding = opts.axisLabelPadding === undefined ?
                                      defaultPadding : opts.axisLabelPadding;

                        axisLabels[axisName] = new renderer(axisName,
                                                            axis.position, padding,
                                                            plot, opts);

                        // flot interprets axis.labelHeight and .labelWidth as
                        // the height and width of the tick labels. We increase
                        // these values to make room for the axis label and
                        // padding.

                        axisLabels[axisName].calculateSize();

                        // AxisLabel.height and .width are the size of the
                        // axis label and padding.
                        // Just set opts here because axis will be sorted out on
                        // the redraw.

                        opts.labelHeight = axis.labelHeight +
                            axisLabels[axisName].height;
                        opts.labelWidth = axis.labelWidth +
                            axisLabels[axisName].width;
                    });

                    // If there are axis labels, re-draw with new label widths and
                    // heights.

                    if (hasAxisLabels) {
                        secondPass = true;
                        plot.setupGrid();
                        plot.draw();
                    }
                } else {
                    secondPass = false;
                    // DRAW
                    $.each(plot.getAxes(), function(axisName, axis) {
                        var opts = axis.options // Flot 0.7
                            || plot.getOptions()[axisName]; // Flot 0.6
                        if (!opts || !opts.axisLabel || !axis.show)
                            return;

                        axisLabels[axisName].draw(axis.box);
                    });
                }
            });
        });
    }


    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'axisLabels',
        version: '2.0'
    });
})(jQuery);

define("../../bower_components/flot-axislabels/jquery.flot.axislabels.js", function(){});


define('css!../libs/libs-frontend-TSCurve/dist/css/tsCurve.min',[],function(){});


(function($) {

    $.fn.TSCurve = function(options) {

        var $container = $(this);

        var defaults = {
            showApplicationPoints: false,
            motorSelectedIndex: 3,
            rmsPoints: [190, 44],
            peakPoints: [400, 60],
            quadrant: 1,
            sliderLimit: {
                peakMaxSpeed: 800,
                peakMaxTorque: 100,
                rmsMaxSpeed: 800,
                rmsMaxTorque: 100,
                maxTemp: 125,
                maxAltitude: 10000,
                maxVoltage: 10,
                maxTrRatio: 100
            },
            showQuadrantToggle: true,
            showMotorTsCurve: true,
            showMotorSelForm: true,
            showAppPointsForm: true,
            showEnviorForm: true,
            showTransmissionForm: true,
            uniqeId:'1'
        };

        

        var settings = $.extend({}, defaults, options);

        var tsPlot;

        // generates widget container
        var generateTSCurveArea = function() {
            var $tsCruveContainer = $('<div class="tsCruveContainer row m-0"></div>');
            $container.append($tsCruveContainer);
            generateServoMotorTSCurveSection($tsCruveContainer);
        };

        // generates graph plot area container and accordions container
        var generateServoMotorTSCurveSection = function($containerEle) {
          
            var $servoMotorTSCurve = $('<div id="servoMotorTSCurve"></div>');
            $containerEle.append($servoMotorTSCurve);

            
            if(settings.showMotorSelForm || settings.showAppPointsForm || settings.showEnviorForm || settings.showTransmissionForm){
              $servoMotorTSCurve.addClass('col-md-7');
              var $servoMotorArea = $('<div class="col-md-5 row" id="servoMotorArea"></div>');
              $containerEle.append($servoMotorArea);
              generateServoMotorArea($servoMotorArea);
            }
            else{
              $servoMotorTSCurve.addClass('col-md-12 widthMaxLimit');
            }
                        
            generateTSCurvePlotArea($servoMotorTSCurve);           

            generateServoMotorSpec();
        };

        // generates accordion container
        var generateServoMotorArea = function($containerEle) {
            // accordion
            var $motorAreaAccordionContainer = $('<div id="motorAreaAccordionContainer"></div>');
            $containerEle.append($motorAreaAccordionContainer);

            var $panelGroup = $('<div class="panel-group" id="accordion'+settings.uniqeId+'" role="tablist" aria-multiselectable="true"></div>');
            $motorAreaAccordionContainer.append($panelGroup);

            if (!settings.showMotorTsCurve) {
                settings.showMotorSelForm = false;
            }

            if (settings.showMotorSelForm) {
                // motor panel accordion
                generateMotorPanelAccordion($panelGroup);
            }

            if (!settings.showApplicationPoints) {
                settings.showAppPointsForm = false;
            }

            if (settings.showAppPointsForm) {
                // motor ts point sliders accordion
                generateTSPointsAccordion($panelGroup);
            }

            if (settings.showEnviorForm) {
                // environmentalFactors accordion
                generateEnvFactorsAccordion($panelGroup);
            }

            if (settings.showTransmissionForm) {
                // transmission ratio accordion
                generateTransmissionRatioAccordion($panelGroup);
            }
            updateMotorStatus();
        };

        // generates motor selection table accordion
        var generateMotorPanelAccordion = function($containerEle) {
            // motor panel accordion
            var $motorPanel = $('<div class="panelNew panel-defaultNew"></div>');
            $containerEle.append($motorPanel);

            var $motorPanelHeading = $('<div class="panel-heading panelHeadingNew" role="tab" id="headingOne"> <h4 class="panel-title"> <span id="panelHeading"> Solution Selection</span> <span class="accordion-plus-minus  pull-right" aria-hidden="true" style="color: grey;"></span></h4> </div>');
            $motorPanel.append($motorPanelHeading);

            var $motorPanelBodyContainer = $('<div id="collapseOne" class="panel-collapse collapse motorDataOpenPanle" role="tabpanel" aria-labelledby="headingOne"></div>');
            $motorPanel.append($motorPanelBodyContainer);

            var $motorPanelBody = $('<div class="panel-body"></div>')
            $motorPanelBodyContainer.append($motorPanelBody);

            $motorPanel.on('show.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $motorPanel.on('hide.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            generateMotorDataPanelBody($motorPanel);
        };

        // generates motor selection accordion body
        var generateMotorDataPanelBody = function($containerEle) {
            // motor data panel body
            var motorSliderLen = settings.motorData.length;
            var sizeSliderTicks = [];
            for(var loop = 0; loop < motorSliderLen; loop++ ){
                sizeSliderTicks.push(loop);

            }

            var $motorPanelBody = $containerEle.find('#collapseOne .panel-body');
            var $motorDataContainer = $('<div id="motorDataContainer" class="row"></div>');
            $motorPanelBody.append($motorDataContainer);

            var $solutionTitle = $('<div class="col-sm-3 title"><span id="solutionTitle">Solution Size: </sapn></div>');
            $motorDataContainer.append($solutionTitle);

            var $solutionSlider = $('<div class="col-sm-9"><input width="300" id="solutionSliderId" class="span2" type="text" data-slider-id="sizeSlider" data-slider-ticks="['+sizeSliderTicks+']" data-slider-min="0" data-slider-max="'+motorSliderLen+'" data-slider-step="1" data-slider-value="'+settings.motorSelectedIndex +'" data-slider-tooltip="hide"  /></div>');
            $motorDataContainer.append($solutionSlider);

            /*var $solutionValue = $('<div class="col-md-3"><label class="value" id="solutionValue">10 N-m </label></div>');
            $motorDataContainer.append($solutionValue);*/

            var $solutionDivider = $('<div class="col-sm-11 solutionDivider"></div>');
            $motorDataContainer.append($solutionDivider);

            var $solutionInfoTitle = $('<div class="col-sm-12 solutionInfoTitle">Solution Summary</div>');
            $motorDataContainer.append($solutionInfoTitle);

            var $solutionInfoRowOne = $('<div class="col-sm-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowOne);

            var $driveInfo = $('<div class="col-sm-6"><span class="driveTitle">Drive:</span><span class="driveName" id="driveNameId">'+settings.motorData[settings.motorSelectedIndex].drivePartNo+'</span></div>');
            $solutionInfoRowOne.append($driveInfo);

            var $motorInfo = $('<div class="col-sm-6"><span class="motorTitle">Motor:</span><span class="motorName" id="motorNameId">'+settings.motorData[settings.motorSelectedIndex].motorPartNo+'</span></div>');
            $solutionInfoRowOne.append($motorInfo);

            var $solutionInfoRowTwo = $('<div class="col-sm-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowTwo);

            var $voltageInfo = $('<div class="col-sm-6"><span class="voltageTitle">Voltage:</span><span class="voltageName" id="voltageInfoId">'+settings.motorData[settings.motorSelectedIndex].voltage+' V</span></div>');
            $solutionInfoRowTwo.append($voltageInfo);

            var $solutionStatus = $('<div class="col-sm-6"><span class="solutionStatusTitle">Solution Status:</span><span class="solutionStatus motorPass" id="statusValueContainer">Pass</span></div>');
            $solutionInfoRowTwo.append($solutionStatus);

            var solutionSlider = $solutionSlider.find('#solutionSliderId').slider({}).on("change", function(slideEvt) {
                console.log(settings.motorData[slideEvt.value.newValue].drivePartNo);
                $motorDataContainer.find('#driveNameId').text(settings.motorData[slideEvt.value.newValue].drivePartNo);
                $motorDataContainer.find('#motorNameId').text(settings.motorData[slideEvt.value.newValue].motorPartNo);
                $motorDataContainer.find('#voltageInfoId').text(settings.motorData[slideEvt.value.newValue].voltage + ' V');

                settings.motorSelectedIndex = slideEvt.value.newValue;

                $container.find('#tempSlider').slider('setValue', settings.motorData[settings.motorSelectedIndex].temp);
                $container.find("#tempValue").val(settings.motorData[settings.motorSelectedIndex].temp);

                $container.find('#altitudeSlider').slider('setValue', settings.motorData[settings.motorSelectedIndex].altitude);
                $container.find("#altitudeValue").val(settings.motorData[settings.motorSelectedIndex].altitude);

                //settings.defalutMotorContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;

                //settings.defalutMotorContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;

                settings.defaultPeakStallTorque =  settings.motorData[settings.motorSelectedIndex].peakStallTorque;
                settings.defaultRollOffPoint =  settings.motorData[settings.motorSelectedIndex].rollOffPoint;
                settings.defaultRollOffSpeed =  settings.motorData[settings.motorSelectedIndex].rollOffSpeed;
                settings.defaultPeakTorqueAtMaxSpeed =  settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed;
                settings.defaultContinuousStallTorque =  settings.motorData[settings.motorSelectedIndex].continuousStallTorque;
                settings.defaultContinuosTorqueAtMaxSpeed =  settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;
                settings.motorSelectedIndex = slideEvt.value.newValue
                calculateTSCurevePoints();
                updateMotorStatus();
            });

        };

        var updateMotorStatus = function() {

            var motorStatus = checkMotorStatus(settings.motorData[settings.motorSelectedIndex]).status;

            if (settings.showMotorSelForm) {
                var $motorRow = $container.find('#statusValueContainer');

                $motorRow.removeClass('motorPass');
                $motorRow.removeClass('motorFail');
                $motorRow.addClass(motorStatus ? 'motorPass' : 'motorFail');
                $motorRow.text(motorStatus ? 'Pass' : 'Fail');
                //$motorRow.find('.motorStatusIcon').removeClass('glyphicon-remove').removeClass('glyphicon-ok');
                //$motorRow.eq(settings.motorSelectedIndex).find('.motorStatusIcon').addClass(motorStatus ? 'glyphicon-ok' : 'glyphicon-remove');
            }

            if (settings.showAppPointsForm) {
                var $tsSliderMotorStatusContainer = $container.find('#servoMotorArea #tsPointsPanelContainer #statusValueContainer');
                $tsSliderMotorStatusContainer.find('.motorStatusIcon').removeClass('glyphicon-remove').removeClass('glyphicon-ok').addClass(motorStatus ? 'glyphicon-ok' : 'glyphicon-remove');
                $tsSliderMotorStatusContainer.find('#statusValueLabel').text(motorStatus ? 'Motor Pass' : 'Motor Fail');
            }
        };

        // generates TS points slider accordion
        var generateTSPointsAccordion = function($containerEle) {
            var $tsPointsPanel = $('<div class="panel panel-default"></div>');
            $containerEle.append($tsPointsPanel);

            var $tsPointsPanelHeading = $('<div class="panel-heading" role="tab" id="headingTwo"> <h4 class="panel-title"> <a role="button" data-parent="#accordion'+settings.uniqeId+'" data-toggle="collapse"  href="#collapseTwo'+settings.uniqeId+'" aria-controls="collapseTwo" aria-expanded="false"><span>Application Torque Speed Requirements </span><span class="accordion-plus-minus glyphicon pull-right glyphicon-chevron-down fa fa-chevron-down" aria-hidden="true" style="color: grey;"></span> </a> </h4> </div>');
            $tsPointsPanel.append($tsPointsPanelHeading);

            var $tsPointsPanelBodyContainer = $('<div id="collapseTwo'+settings.uniqeId+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo"></div>');
            $tsPointsPanel.append($tsPointsPanelBodyContainer);

            $tsPointsPanel.on('show.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $tsPointsPanel.on('hide.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            if (!settings.showMotorSelForm) {
                $tsPointsPanelBodyContainer.addClass('in');
            }

            generateTSPointsConfigPanel($tsPointsPanelBodyContainer);
        }
        var applicationRequPointsOntextChan = function(appPointType,value) {
            var tsPlotSeries = tsPlot.getData();
            //debugger;
            switch (appPointType) {

                case "PeakSpeed":
                    tsPlotSeries[1].data[0][0] = settings.peakPoints[0] = value;
                    settings.defaultPeakSpeed = value;                    
                   // $container.find("#peakSpeedValue").val($('#peakSpeedSlider').slider('getValue'));
                    $container.find('#peakSpeedSlider').slider('setValue', value);
                    break;

                case "PeakTorque":
                    tsPlotSeries[1].data[0][1] = settings.peakPoints[1] = value;
                    settings.defaultPeakTorque = value;
                    //$container.find("#peakTorqueValue").val($('#peakTorqueSlider').slider('getValue'));
                    $container.find('#peakTorqueSlider').slider('setValue', value);
                    break;

                case "RmsSpeed":
                    tsPlotSeries[3].data[0][0] = settings.rmsPoints[0] = value;
                    settings.defaultRmsSpeed = value;
                    //$container.find("#rmsSpeedValue").val($('#rmsSpeedSlider').slider('getValue'));
                    $container.find('#rmsSpeedSlider').slider('setValue', value);
                    break;

                case "RmsTorque":
                    tsPlotSeries[3].data[0][1] = settings.rmsPoints[1] = value;
                    settings.defaultRmsTorque = value;
                    $container.find('#rmsTorqueSlider').slider('setValue', value);
                    //$container.find("#rmsTorqueValue").val($('#rmsTorqueSlider').slider('getValue'));
                    break;

                case "TransmissionRatio":

                    var tranRatio = value;
                    var tsPlotSeries = tsPlot.getData();

                    tsPlotSeries[1].data[0][0] = settings.peakPoints[0] = (settings.defaultPeakSpeed * tranRatio).toFixed(2);
                    tsPlotSeries[1].data[0][1] = settings.peakPoints[1] = ((settings.defaultPeakTorque / tranRatio).toFixed(2));

                    tsPlotSeries[3].data[0][0] = settings.rmsPoints[0] = (settings.defaultRmsSpeed * tranRatio).toFixed(2);
                    tsPlotSeries[3].data[0][1] = settings.rmsPoints[1] = ((settings.defaultRmsTorque / tranRatio).toFixed(2));


                    if (tsPlotSeries[1].data[0][0] > settings.sliderLimit.peakMaxSpeed) {
                      $container.find('#peakSpeedValue').attr('max', parseInt(tsPlotSeries[1].data[0][0]));
                    }
                    else{
                      $container.find('#peakSpeedValue').attr('max', settings.sliderLimit.peakMaxSpeed); 
                    }
                   

                    if (tsPlotSeries[3].data[0][0] > settings.sliderLimit.rmsMaxSpeed) {
                        $container.find('#rmsSpeedValue').attr('max', parseInt(tsPlotSeries[3].data[0][0]));
                    }
                    else{
                      $container.find('#rmsSpeedValue').attr('max', settings.sliderLimit.rmsMaxSpeed); 
                    }
                   
                    $container.find('#trRatioSlider').slider('setValue', value);
                    $container.find('#peakSpeedSlider').slider('setValue', tsPlotSeries[1].data[0][0]);
                    $container.find('#peakTorqueSlider').slider('setValue', tsPlotSeries[1].data[0][1]);

                    $container.find('#rmsSpeedSlider').slider('setValue', tsPlotSeries[3].data[0][0]);
                    $container.find('#rmsTorqueSlider').slider('setValue', tsPlotSeries[3].data[0][1]);

                    //$container.find('#trRatioValue').val(tranRatio);
                    $container.find("#peakSpeedValue").val(tsPlotSeries[1].data[0][0]);
                    $container.find("#peakTorqueValue").val((tsPlotSeries[1].data[0][1]));
                    $container.find("#rmsSpeedValue").val(tsPlotSeries[3].data[0][0]);
                    $container.find("#rmsTorqueValue").val((tsPlotSeries[3].data[0][1]));

                    break;

            }
            updateTSGraph(tsPlotSeries);
            updateMotorStatus();

        };
        /* call back function of Peak Speed, Peak Torque, RMS Speed, RMS Torque, Transmission Ratio */
        var updateApplicationRequPoints = function(appPointType) {
            var tsPlotSeries = tsPlot.getData();
            switch (appPointType) {

                case "PeakSpeed":
                    tsPlotSeries[1].data[0][0] = settings.peakPoints[0] = $container.find('#peakSpeedSlider').slider('getValue');
                    settings.defaultPeakSpeed = $container.find('#peakSpeedSlider').slider('getValue');
                    $container.find("#peakSpeedValue").val($('#peakSpeedSlider').slider('getValue'));
                    break;

                case "PeakTorque":
                    tsPlotSeries[1].data[0][1] = settings.peakPoints[1] = $container.find('#peakTorqueSlider').slider('getValue');
                    settings.defaultPeakTorque = $container.find('#peakTorqueSlider').slider('getValue');
                    $container.find("#peakTorqueValue").val($('#peakTorqueSlider').slider('getValue'));
                    break;

                case "RmsSpeed":
                    tsPlotSeries[3].data[0][0] = settings.rmsPoints[0] = $container.find('#rmsSpeedSlider').slider('getValue');
                    settings.defaultRmsSpeed = $container.find('#rmsSpeedSlider').slider('getValue');
                    $container.find("#rmsSpeedValue").val($('#rmsSpeedSlider').slider('getValue'));
                    break;

                case "RmsTorque":
                    tsPlotSeries[3].data[0][1] = settings.rmsPoints[1] = $container.find('#rmsTorqueSlider').slider('getValue');
                    settings.defaultRmsTorque = $container.find('#rmsTorqueSlider').slider('getValue');
                    $container.find("#rmsTorqueValue").val($('#rmsTorqueSlider').slider('getValue'));
                    break;

                case "TransmissionRatio":

                    var tranRatio = $container.find('#trRatioSlider').slider('getValue');
                    var tsPlotSeries = tsPlot.getData();

                    tsPlotSeries[1].data[0][0] = settings.peakPoints[0] = (settings.defaultPeakSpeed * tranRatio).toFixed(2);
                    tsPlotSeries[1].data[0][1] = settings.peakPoints[1] = ((settings.defaultPeakTorque / tranRatio).toFixed(2));

                    tsPlotSeries[3].data[0][0] = settings.rmsPoints[0] = (settings.defaultRmsSpeed * tranRatio).toFixed(2);
                    tsPlotSeries[3].data[0][1] = settings.rmsPoints[1] = ((settings.defaultRmsTorque / tranRatio).toFixed(2));


                    if (tsPlotSeries[1].data[0][0] > settings.sliderLimit.peakMaxSpeed) {
                        $container.find('#peakSpeedSlider').slider('setAttribute', 'max', parseInt(tsPlotSeries[1].data[0][0]));
                    }
                    else{
                      $container.find('#peakSpeedSlider').slider('setAttribute', 'max', settings.sliderLimit.peakMaxSpeed); 
                    }
                   

                    if (tsPlotSeries[3].data[0][0] > settings.sliderLimit.rmsMaxSpeed) {
                        $container.find('#rmsSpeedSlider').slider('setAttribute', 'max', parseInt(tsPlotSeries[3].data[0][0]));
                    }
                    else{
                      $container.find('#rmsSpeedSlider').slider('setAttribute', 'max', settings.sliderLimit.rmsMaxSpeed); 
                    }
                   

                    $container.find('#peakSpeedSlider').slider('setValue', tsPlotSeries[1].data[0][0]);
                    $container.find('#peakTorqueSlider').slider('setValue', tsPlotSeries[1].data[0][1]);

                    $container.find('#rmsSpeedSlider').slider('setValue', tsPlotSeries[3].data[0][0]);
                    $container.find('#rmsTorqueSlider').slider('setValue', tsPlotSeries[3].data[0][1]);

                    $container.find('#trRatioValue').val(tranRatio);
                    $container.find("#peakSpeedValue").val(tsPlotSeries[1].data[0][0]);
                    $container.find("#peakTorqueValue").val((tsPlotSeries[1].data[0][1]));
                    $container.find("#rmsSpeedValue").val(tsPlotSeries[3].data[0][0]);
                    $container.find("#rmsTorqueValue").val((tsPlotSeries[3].data[0][1]));

                    break;

            }
            updateTSGraph(tsPlotSeries);
            updateMotorStatus();

        };
        // generates TS points slider accordion body
        var generateTSPointsConfigPanel = function($containerEle) {
            var $tsPointsPanelBody = $('<div class="panel-body"></div>')
            $containerEle.append($tsPointsPanelBody);

            var $tsPointsPanelContainer = $('<div id="tsPointsPanelContainer"></div>');
            $tsPointsPanelBody.append($tsPointsPanelContainer);

            var $peakTorqueSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($peakTorqueSliderContainer);

            var $peakTorqueTitle = $('<div class="col-sm-3 title"><span id="peakTorqueTitle">Peak Torque: </span></div>');
            $peakTorqueSliderContainer.append($peakTorqueTitle);

            var $peakTorqueSlider = $('<div class="col-sm-4"><input id="peakTorqueSlider" data-slider-value="' + settings.peakPoints[1] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $peakTorqueSliderContainer.append($peakTorqueSlider);

            var $peakTorqueInput = $('<div class="col-sm-5"><input type="number" name="quantity" id="peakTorqueValue" min="0" max="'+settings.sliderLimit.peakMaxTorque+'" value="' + settings.peakPoints[1] + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&nbsp;Nm</label></div>');
            $peakTorqueSliderContainer.append($peakTorqueInput);
            //var $peakTorqueValue = $('<div class="col-sm-3"><label class="value" id="peakTorqueValue">' + settings.peakPoints[1] + ' N-m </label></div>');
            //$peakTorqueSliderContainer.append($peakTorqueValue);

            var peakTorqueSlider = $peakTorqueSlider.find('#peakTorqueSlider').slider({
                min: 0,
                max: settings.sliderLimit.peakMaxTorque,
                step: 0.1
            }).on('change', function() {
                if ($peakTorqueSlider.find('#peakTorqueSlider').slider('getValue') < settings.rmsPoints[1]) {
                    $peakTorqueSlider.find('#peakTorqueSlider').slider('setValue', peakTorqueOldValue);
                    setAlertMessage("Peak Torque can not be less than RMS Torque.");
                    return false;
                }
                setAlertMessage("");

                updateApplicationRequPoints("PeakTorque");

                peakTorqueOldValue = $peakTorqueSlider.find('#peakTorqueSlider').slider('getValue');
                //$container.find("#peakTorqueValue").val($peakTorqueSlider.find('#peakTorqueSlider').slider('getValue'));
            });
            var peakTorqueOldValue = $peakTorqueSlider.find('#peakTorqueSlider').slider('getValue');

            $container.find('#peakTorqueValue').on('change',function(e){

                   applicationRequPointsOntextChan("PeakTorque",e.target.value);
            });

            var $peakSpeedSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($peakSpeedSliderContainer);

            var $peakSpeedTitle = $('<div class="col-sm-3 title"><span id="peakSpeedTitle">Peak Speed: </sapn></div>');
            $peakSpeedSliderContainer.append($peakSpeedTitle);

            var $peakSpeedSlider = $('<div class="col-sm-4"><input id="peakSpeedSlider" data-slider-value="' + settings.peakPoints[0] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $peakSpeedSliderContainer.append($peakSpeedSlider);

            var $peakSpeedInput = $('<div class="col-sm-5"><input step="1"  data-wrap="true" type="number" id="peakSpeedValue" name="quantity" min="0" max="'+settings.sliderLimit.peakMaxSpeed+'" value="' + settings.peakPoints[0] + '" class="widgetNumberInput form-control bfh-number form-control bfh-number"><lable class="value">&nbsp;&nbsp;rad/sec</label></div>');
            $peakSpeedSliderContainer.append($peakSpeedInput);

            //var $peakSpeedValue = $('<div class="col-md-3"><label class="value" id="peakSpeedValue">' + settings.peakPoints[0] + ' rad/sec </label></div>');
            //$peakSpeedSliderContainer.append($peakSpeedValue);

            var peakSpeedSlider = $peakSpeedSlider.find('#peakSpeedSlider').slider({
                min: 0,
                max: settings.sliderLimit.peakMaxSpeed,
                step: 1
            }).on('change', function() {
                if ($peakSpeedSlider.find('#peakSpeedSlider').slider('getValue') < settings.rmsPoints[0]) {
                    $peakSpeedSlider.find('#peakSpeedSlider').slider('setValue', settings.rmsPoints[0]);
                    setAlertMessage("Peak Speed can not be less than RMS Speed.");
                    return false;
                }
                setAlertMessage("");

                updateApplicationRequPoints("PeakSpeed");


            });
          
            $container.find('#peakSpeedValue').on('change',function(e){

                   applicationRequPointsOntextChan("PeakSpeed",e.target.value);
            });




            var $rmsTorqueSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($rmsTorqueSliderContainer);

            var $rmsTorqueTitle = $('<div class="col-sm-3 title"><span id="rmsTorqueTitle">RMS Torque: </sapn></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueTitle);



            var $rmsTorqueSlider = $('<div class="col-sm-4"><input id="rmsTorqueSlider" data-slider-value="' + settings.rmsPoints[1] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueSlider);

            var $rmsTorqueInput = $('<div class="col-sm-5"><input type="number" id="rmsTorqueValue" name="quantity" min="0" max="'+settings.sliderLimit.rmsMaxTorque+'" value="' + settings.rmsPoints[1] + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&nbsp;Nm</label></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueInput);

            //var $rmsTorqueValue = $('<div class="col-sm-3"><label class="value" id="rmsTorqueValue">' + settings.rmsPoints[1] + ' N-m </label></div>');
            //$rmsTorqueSliderContainer.append($rmsTorqueValue);

            var rmsTorqueSlider = $rmsTorqueSlider.find('#rmsTorqueSlider').slider({
                min: 0,
                max: settings.sliderLimit.rmsMaxTorque,
                step: 0.1
            }).on('change', function() {
                if ($rmsTorqueSlider.find('#rmsTorqueSlider').slider('getValue') > settings.peakPoints[1]) {
                    $rmsTorqueSlider.find('#rmsTorqueSlider').slider('setValue', settings.peakPoints[1]);
                    setAlertMessage("RMS Torque can not be greater than Peak Torque.");
                    return false;
                } else {
                    setAlertMessage("");
                    updateApplicationRequPoints("RmsTorque");

                }
            });


            $container.find('#rmsTorqueValue').on('change',function(e){

                   applicationRequPointsOntextChan("RmsTorque",e.target.value);
            });
            var $rmsSpeedSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($rmsSpeedSliderContainer);

            var $rmsSpeedTitle = $('<div class="col-sm-3 title"><span id="rmsSpeedTitle">RMS Speed: </span></div>');
            $rmsSpeedSliderContainer.append($rmsSpeedTitle);

            var $rmsSpeedSlider = $('<div class="col-sm-4"><input id="rmsSpeedSlider" data-slider-value="' + settings.rmsPoints[0] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $rmsSpeedSliderContainer.append($rmsSpeedSlider);

            var $rmsSpeedInput = $('<div class="col-sm-5"><input type="number" id="rmsSpeedValue" name="quantity" min="0" max="'+settings.sliderLimit.rmsMaxSpeed+'" value="' + settings.rmsPoints[0] + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&nbsp;rad/sec</label></div>');
            $rmsSpeedSliderContainer.append($rmsSpeedInput);

            //var $rmsSpeedValue = $('<div class="col-sm-3"><label class="value" id="rmsSpeedValue">' + settings.rmsPoints[0] + ' rad/sec </label></div>');
            //$rmsSpeedSliderContainer.append($rmsSpeedValue);

            var rmsSpeedSlider = $rmsSpeedSlider.find('#rmsSpeedSlider').slider({
                min: 0,
                max: settings.sliderLimit.rmsMaxSpeed,
                step: 1
            }).on('change', function() {
                if ($rmsSpeedSlider.find('#rmsSpeedSlider').slider('getValue') > settings.peakPoints[0]) {
                    $rmsSpeedSlider.find('#rmsSpeedSlider').slider('setValue', settings.peakPoints[0]);
                    setAlertMessage("RMS Speed can not be greater than Peak Speed.");
                    return;
                }
                setAlertMessage("");
                updateApplicationRequPoints("RmsSpeed");

            });

            $container.find('#rmsSpeedValue').on('change',function(e){

                   applicationRequPointsOntextChan("RmsSpeed",e.target.value);
            });


            if (settings.showMotorTsCurve) {
                var $statusContainer = $('<div id="sliderContainer" class="row"></div>');
                $tsPointsPanelContainer.append($statusContainer);
            }

            $tsPointsPanelContainer.append('<div id="alertMessageContainer" class="alert alert-warning"><strong>Warning:-&nbsp;&nbsp;</strong><span></span></div>');

            var setAlertMessage = function(alertText) {
                if (alertText === "") {
                    $tsPointsPanelContainer.find('#alertMessageContainer').hide();
                    return;
                }
                $tsPointsPanelContainer.find('#alertMessageContainer').show();
                $tsPointsPanelContainer.find('#alertMessageContainer span').text(alertText);
            };
        };

        // generates Environmental factors slider accordion
        var generateEnvFactorsAccordion = function($containerEle) {
            var $envFactorsPanel = $('<div class="panel panel-default"></div>');
            $containerEle.append($envFactorsPanel);

            var $envFactorsPanelHeading = $('<div class="panel-heading" role="tab" id="headingThree"> <h4 class="panel-title"> <a role="button"  data-parent="#accordion'+settings.uniqeId+'" data-toggle="collapse"  href="#collapseThree'+settings.uniqeId+'" aria-controls="collapseThree" aria-expanded="false"><span> Environmental Factors</span> <span class="accordion-plus-minus glyphicon pull-right glyphicon-chevron-down fa fa-chevron-down" aria-hidden="true" style="color: grey;"></span> </a> </h4> </div>');
            $envFactorsPanel.append($envFactorsPanelHeading);

            var $envFactorsPanelBodyContainer = $('<div id="collapseThree'+settings.uniqeId+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree"></div>');
            $envFactorsPanel.append($envFactorsPanelBodyContainer);

            var $envFactorsPanelBody = $('<div class="panel-body"></div>')
            $envFactorsPanelBodyContainer.append($envFactorsPanelBody);

            $envFactorsPanel.on('show.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $envFactorsPanel.on('hide.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            generateEnvFactorsConfigPanel($envFactorsPanelBody);
        };

        // generates Environmental factors slider accordion body
        var generateEnvFactorsConfigPanel = function($containerEle) {
            var $envFactorsPanelContainer = $('<div id="envFactorsPanelContainer"></div>');
            $containerEle.append($envFactorsPanelContainer);

            var $tempSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $envFactorsPanelContainer.append($tempSliderContainer);

            var $tempTitle = $('<div class="col-sm-3 title"><span id="tempTitle">Temperature: </span></div>');
            $tempSliderContainer.append($tempTitle);

            var $tempSlider = $('<div class="col-sm-4"><input id="tempSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $tempSliderContainer.append($tempSlider);

            var $tempInput = $('<div class="col-sm-5"><input type="number" id="tempValue" name="quantity" min="0" value="' + settings.motorData[settings.motorSelectedIndex].temp + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&deg;C</label></div>');
            $tempSliderContainer.append($tempInput);


            //var $tempValue = $('<div class="col-sm-3"><label class="value" id="tempValue">' + settings.motorData[settings.motorSelectedIndex].temp + '</label><label class="value">&deg;C</label></div>');
            //$tempSliderContainer.append($tempValue);

            var sliderMax = settings.sliderLimit.maxTemp || defaults.sliderLimit.maxTemp;

            settings.defaultPeakStallTorque =  settings.motorData[settings.motorSelectedIndex].peakStallTorque;
            settings.defaultRollOffPoint =  settings.motorData[settings.motorSelectedIndex].rollOffPoint;
            settings.defaultRollOffSpeed =  settings.motorData[settings.motorSelectedIndex].rollOffSpeed;
            settings.defaultPeakTorqueAtMaxSpeed =  settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed;
            settings.defaultContinuousStallTorque =  settings.motorData[settings.motorSelectedIndex].continuousStallTorque;
            settings.defaultContinuosTorqueAtMaxSpeed =  settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;


            $tempSliderContainer.find('#tempSlider').slider({
                value: settings.motorData[settings.motorSelectedIndex].temp,
                min: 0,
                max: sliderMax,
                step: 1,
            }).on('change', function(slideEvt) {

                $container.find("#tempValue").val(slideEvt.value.newValue);

                var deltaTemp = (slideEvt.value.newValue - slideEvt.value.oldValue);

                if (deltaTemp !== 0) {
                    updatePlotDataOnTempChange("peakPlot", slideEvt.value.newValue);
                    updatePlotDataOnTempChange("rmsPlot", slideEvt.value.newValue);

                }

            });
            $container.find('#tempValue').on('change',function(e){
                    $container.find('#tempSlider').slider('setValue', parseInt(e.target.value));
                    updatePlotDataOnTempChange("peakPlot", parseInt(e.target.value));
                    updatePlotDataOnTempChange("rmsPlot", parseInt(e.target.value));

                  
            });
            var updatePlotDataOnTempChange = function(plotType, currentTemp) {

                var tsPlotSeries = tsPlot.getData();

               
                var ta = currentTemp; // Application temperature
                var tr = 40 // Rating ambient (the ambient at which the motor is rated - default 40 degrees)
                var twl = 155 // Limiting winding temperature in degree celcius
                var ts = 25 //Motor specification Temperature
               // var tw = ta + (0.6 * (twl - ta)); //Winding temperature
               var tm =  ta + (0.6*(twl - ta)); //Actual Magnet Temperature
               var tmr= tr + (0.6*(twl - tr)); //Rating Magnet Temperature
               var Km = -0.0015; // is the temperature coefficient of the rotor magnets


                var K1 =  (1-(ta-tr)/(twl-tr)); 
                var K2 = ((ts+234.5)/(tmr+234.5));   
                var K3  = (1+(tm - tmr )* Km);
               //debugger;
                switch (plotType) {
                    case "peakPlot":
                        var peakPlotData = tsPlotSeries[0].data;

                        for (var i = 0; i < peakPlotData.length; i++) {

                            //peakPlotData[i][0] = peakPlotData[i][0] * K3;
                            
                            if (settings.motorData[settings.motorSelectedIndex] != undefined) {
                                if (i == 0 || i == 12 || i == 6) {
                                   
                                    peakPlotData[i][1] = settings.defaultPeakStallTorque * K3;
                                    if(i == 0){
                                        settings.motorData[settings.motorSelectedIndex].peakStallTorque = peakPlotData[i][1];
                                    }
                                    if(i == 6){
                                        peakPlotData[i][1] = -(peakPlotData[i][1]);
                                    }
                                    
                                }
                                if (i == 1 || i == 7) {
                                    
                                    peakPlotData[i][1] = settings.defaultRollOffPoint * K3;
                                    peakPlotData[i][0] = settings.defaultRollOffSpeed / K3;
                                    settings.motorData[settings.motorSelectedIndex].rollOffPoint = peakPlotData[i][1];
                                    settings.motorData[settings.motorSelectedIndex].rollOffSpeed = peakPlotData[i][0];
                                    if(i == 7){
                                        peakPlotData[i][0] = -(peakPlotData[i][0]);
                                        peakPlotData[i][1] = -(peakPlotData[i][1]);
                                    }
                                }
                                if (i == 2 || i == 8) {
                                    
                                    peakPlotData[i][1] = settings.defaultPeakTorqueAtMaxSpeed * K3;
                                    settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed = peakPlotData[i][1];
                                    if(i == 8){
                                        peakPlotData[i][1] = -(peakPlotData[i][1]);
                                    }

                                }                                

                            }
                        }
                        tsPlotSeries[0].data = peakPlotData;
                        break;

                    case "rmsPlot":
                        var rmsPlotData = tsPlotSeries[2].data;

                        for (var i = 0; i < rmsPlotData.length; i++) {

                          

                            if (settings.motorData[settings.motorSelectedIndex] != undefined) {

                                if (i == 0 || i == 10 || i == 5) {
                                    rmsPlotData[i][1] = settings.defaultContinuousStallTorque * (K3 * Math.sqrt(K1 / K2));
                                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[i][1];
                                    //settings.defaultContinuousStallTorque = rmsPlotData[i][1];
                                    if (i == 5){
                                        rmsPlotData[i][1] = -(rmsPlotData[i][1]);
                                    }
                                }
                                if (i == 1 || i == 6) {
                                    rmsPlotData[i][1] = settings.defaultContinuosTorqueAtMaxSpeed * (K3 * Math.sqrt(K1 / K2));
                                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[i][1];
                                    //settings.defalutMotorContinuosTorqueAtMaxSpeed = rmsPlotData[i][1];
                                    if (i == 6){
                                        rmsPlotData[i][1] = -(rmsPlotData[i][1]);
                                    }
                                }
                            }
                        }
                        tsPlotSeries[2].data = rmsPlotData;
                        break;


                }
                updateTSGraph(tsPlotSeries);
                updateMotorStatus();

            }
            var updatePlotDataOnTempChange_copy = function(plotType, delta) {

                var tsPlotSeries = tsPlot.getData();

                var tempContsFactor = '0.2'; // for every 1 degree increase we reduce the curve by 0.2%

                switch (plotType) {

                    case "peakPlot":
                        var peakPlotData = tsPlotSeries[0].data;
                        for (var i = 0; i < peakPlotData.length; i++) {

                            var reducedTorqVal = ((peakPlotData[i][1] * delta * tempContsFactor) / 100);
                            peakPlotData[i][1] = ((peakPlotData[i][1] - reducedTorqVal)).toFixed(2);

                            //var reducedSpeedVal = ((peakPlotData[i][0] * delta * tempContsFactor) / 100); 
                            // peakPlotData[i][0] = ((peakPlotData[i][0] - reducedSpeedVal)).toFixed(2); 

                            if (settings.motorData[settings.motorSelectedIndex] != undefined) {
                                if (i == 0) {
                                    settings.motorData[settings.motorSelectedIndex].peakStallTorque = peakPlotData[i][1];
                                }
                                if (i == 1) {
                                    settings.motorData[settings.motorSelectedIndex].rollOffPoint = peakPlotData[i][1];
                                    //settings.motorData[settings.motorSelectedIndex].rollOffSpeed = peakPlotData[i][0];
                                }
                                if (i == 2) {
                                    settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed = peakPlotData[i][1];
                                }
                                if (i == 3) {
                                    //settings.motorData[settings.motorSelectedIndex].maxSpeed = peakPlotData[i][0];
                                }


                            }
                        }
                        tsPlotSeries[0].data = peakPlotData;
                        break;

                    case "rmsPlot":
                        var rmsPlotData = tsPlotSeries[2].data;

                        for (var i = 0; i < rmsPlotData.length; i++) {

                            var reducedTorqVal = ((rmsPlotData[i][1] * delta * tempContsFactor) / 100);
                            rmsPlotData[i][1] = ((rmsPlotData[i][1] - reducedTorqVal)).toFixed(2);

                            // var reducedSpeedVal = ((rmsPlotData[i][0] * delta * tempContsFactor) / 100); 
                            //rmsPlotData[i][0] = ((rmsPlotData[i][0] - reducedSpeedVal)).toFixed(2); 

                            if (settings.motorData[settings.motorSelectedIndex] != undefined) {
                                if (i == 0) {
                                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[i][1];
                                    //settings.defalutMotorContinuousStallTorque = rmsPlotData[i][1];
                                }
                                if (i == 1) {
                                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[i][1];
                                    //settings.defalutMotorContinuosTorqueAtMaxSpeed = rmsPlotData[i][1];
                                }
                            }
                        }
                        tsPlotSeries[2].data = rmsPlotData;
                        break;

                }

                updateTSGraph(tsPlotSeries);
                updateMotorStatus();

            };


            var $altitudeSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $envFactorsPanelContainer.append($altitudeSliderContainer);

            var $altitudeTitle = $('<div class="col-sm-3 title"><span id="altitudeTitle">Altitude: </span></div>');
            $altitudeSliderContainer.append($altitudeTitle);

            var $altitudeSlider = $('<div class="col-sm-4"><input id="altitudeSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $altitudeSliderContainer.append($altitudeSlider);

            var $altitudeInput = $('<div class="col-sm-5"><input type="number" id="altitudeValue" name="quantity" min="0" value="' + settings.motorData[settings.motorSelectedIndex].altitude + '" class="widgetNumberInput form-control bfh-number"><label class="value">&nbsp;&nbsp;m</label></div>');
            $altitudeSliderContainer.append($altitudeInput);

            //var $altitudeValue = $('<div class="col-sm-3"><label class="value" id="altitudeValue">' + settings.motorData[settings.motorSelectedIndex].altitude + '</label><label class="value">  m</label></div>');
            //$altitudeSliderContainer.append($altitudeValue);

            var sliderMax = settings.sliderLimit.maxAltitude || defaults.sliderLimit.maxAltitude;


            settings.defaultContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;

            settings.defaultContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;

            $altitudeSlider.find('#altitudeSlider').slider({
                value: settings.motorData[settings.motorSelectedIndex].altitude,
                min: 0,
                max: 10000,
                step: 1,
            }).on('change', function(slideEvt) {

                $container.find("#altitudeValue").val(slideEvt.value.newValue);

                var tsPlotSeries = tsPlot.getData();
                var rmsPlotData = tsPlotSeries[2].data;

                if (slideEvt.value.newValue > 1500) {

                    var altitConstant = [1 - (slideEvt.value.newValue - 1500) / 10000];

                    rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.defaultContinuousStallTorque * altitConstant).toFixed(3);

                    rmsPlotData[1][1] = (settings.defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                    tsPlotSeries[2].data = rmsPlotData;
                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];

                }
                else{

                    var altitConstant = 1;

                    rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.defaultContinuousStallTorque * altitConstant).toFixed(3);

                    rmsPlotData[1][1] = (settings.defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                    tsPlotSeries[2].data = rmsPlotData;
                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];
                }
                updateTSGraph(tsPlotSeries);
                updateMotorStatus();
            });

            $container.find('#altitudeValue').on('change',function(e){
                    var currentTextBoxVal = parseInt(e.target.value);
                    //updatePlotDataOnTempChange("peakPlot", parseInt(e.target.value));
                    //updatePlotDataOnTempChange("rmsPlot", parseInt(e.target.value));
                var tsPlotSeries = tsPlot.getData();
                var rmsPlotData = tsPlotSeries[2].data;
                $container.find('#altitudeSlider').slider('setValue', currentTextBoxVal);
                if (currentTextBoxVal > 1500) {

                    var altitConstant = [1 - (currentTextBoxVal - 1500) / 10000];

                    rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.defaultContinuousStallTorque * altitConstant).toFixed(3);

                    rmsPlotData[1][1] = (settings.defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                    tsPlotSeries[2].data = rmsPlotData;
                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];

                }
                else{

                    var altitConstant = 1;

                    rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.defaultContinuousStallTorque * altitConstant).toFixed(3);

                    rmsPlotData[1][1] = (settings.defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                    tsPlotSeries[2].data = rmsPlotData;
                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];
                }
                updateTSGraph(tsPlotSeries);
                updateMotorStatus();

                  
            });


        };

        // generates Transmission Ratio slider accordion
        var generateTransmissionRatioAccordion = function($containerEle) {
            var $trRatioPanel = $('<div class="panel panel-default"></div>');
            $containerEle.append($trRatioPanel);

            var $trRatioPanelHeading = $('<div class="panel-heading" role="tab" id="headingFour"> <h4 class="panel-title"> <a role="button"   data-parent="#accordion'+settings.uniqeId+'"  data-toggle="collapse"  href="#collapseFour'+settings.uniqeId+'" aria-controls="collapseFour" aria-expanded="false"><span> Transmission Ratio</span> <span class="accordion-plus-minus glyphicon pull-right glyphicon-chevron-down fa fa-chevron-down" aria-hidden="true" style="color: grey;"></span> </a> </h4> </div>');
            $trRatioPanel.append($trRatioPanelHeading);

            var $trRatioPanelBodyContainer = $('<div id="collapseFour'+settings.uniqeId+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour"></div>');
            $trRatioPanel.append($trRatioPanelBodyContainer);

            var $trRatioPanelBody = $('<div class="panel-body"></div>')
            $trRatioPanelBodyContainer.append($trRatioPanelBody);

            $trRatioPanel.on('show.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $trRatioPanel.on('hide.bs.collapse', function(e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            generateTransmissionRatioConfigPanel($trRatioPanelBody);
        }

        // generates Transmission Ratio slider accordion body
        var generateTransmissionRatioConfigPanel = function($containerEle) {
            var $transmissionRatioPanelContainer = $('<div id="transmissionRatioPanelContainer"></div>');
            $containerEle.append($transmissionRatioPanelContainer);

            var $trRatioSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $transmissionRatioPanelContainer.append($trRatioSliderContainer);

            var $trRatioTitle = $('<div class="col-sm-3 title"><span id="trRatioTitle">Transmission Ratio: </span></div>');
            $trRatioSliderContainer.append($trRatioTitle);

            var $trRatioSlider = $('<div class="col-sm-4" ><input id="trRatioSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $trRatioSliderContainer.append($trRatioSlider);

            var $trRatioInput = $('<div class="col-sm-5"><input type="number" id="trRatioValue" name="quantity" min="1" max="'+settings.sliderLimit.maxTrRatio+'" value="1" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;: 1</label></div>');
            $trRatioSliderContainer.append($trRatioInput);

            //var $trRatioValue = $('<div class="col-sm-3"><label class="value" id="trRatioValue">' + "1" + '</label><label class="value">:1</label></div>');
            //$trRatioSliderContainer.append($trRatioValue);

            settings.defaultRmsTorque = settings.rmsPoints[1];
            settings.defaultRmsSpeed = settings.rmsPoints[0];
            settings.defaultPeakTorque = settings.peakPoints[1];
            settings.defaultPeakSpeed = settings.peakPoints[0];

            $trRatioSlider.find('#trRatioSlider').slider({
                min: 1,
                value: 1,
                max: settings.sliderLimit.maxTrRatio || defaults.sliderLimit.maxTrRatio,
                step: 1,
            }).on('change', function() {

                updateApplicationRequPoints("TransmissionRatio");

            });
            $container.find('#trRatioValue').on('change',function(e){

                   applicationRequPointsOntextChan("TransmissionRatio",e.target.value);
            });

        };

        var generateSlider = function($containerEle, params) {
            $containerEle.slider(params);
        };

        // generates TS Curve grapgh plot area
        var generateTSCurvePlotArea = function($containerEle) {
            var $tsCurveContainer = $('<div class="tsPlotContainer"></div>');
            $containerEle.append($tsCurveContainer);
            var $tsCurvePlotArea = $('<div class="tsPlotArea"></div>');
            $tsCurveContainer.append($tsCurvePlotArea);

            var $curveConfigContainer = $('<div class="curveConfigContainer row"></div>');
            $containerEle.append($curveConfigContainer);

            if (settings.showQuadrantToggle) {
                generatePlotModeToggleSwitch($curveConfigContainer);
            }

            calculateTSCurevePoints();
        };

        // generates quadrant toggle switch
        var generatePlotModeToggleSwitch = function($containerEle) {
            var $plotModeRadio = $('<div class="plotModeContainer"> <label id="quadrantTitle">Quadrant: &nbsp;&nbsp;&nbsp;</label> <div class="btn-group" id="plotModeToggle"> <button id="1quad" value="1" class="btn btn-default">Single</button> <button id="4quad" value="4" class="btn btn-default">Four</button> </div></div>');
            if (settings.quadrant) {
                $plotModeRadio.find('#' + settings.quadrant + 'quad').addClass('selectedQuad');
            }
            $containerEle.append($plotModeRadio);

            $plotModeRadio.find('#plotModeToggle .btn').click(function() {
                if (!$(this).hasClass('selectedQuad')) {
                    $plotModeRadio.find('.selectedQuad').removeClass('selectedQuad');
                    $(this).addClass('selectedQuad');
                    settings.quadrant = parseInt($(this).val());

                    calculateTSCurevePoints();
                }
            });
        };

        // generates motor spec table container
        var generateServoMotorSpec = function($containerEle) {
            var $motorInfoContainer = $container.find('.tsCruveContainer');
            var $servoMotorInfoContainer = $('<div id="servoMotorInfoContainer" class="tsModal"></div>');
            $motorInfoContainer.append($servoMotorInfoContainer);
            var $servoMotorSpecPanelData = $('<div class="motorSpecTable"></div>');
            updateMotorSpecTable(settings.motorSelectedIndex, $servoMotorSpecPanelData);
            $servoMotorInfoContainer.append($servoMotorSpecPanelData);
        };

        // generates selected motor spec table data 
        var updateMotorSpecTable = function(selectedIndex) {

            var $tableContainer =  $container.find('#servoMotorInfoContainer').find('.motorSpecTable');

            var $tableEle = $tableContainer.find('table');
            if ($tableEle.length > 0) {
                $tableEle.remove();
            }
            var $tableEle = $('<table class="table table-striped"></table>');
            var $tableTitle = $('<caption class="motorTableTitle">Motor Specifications - ' + settings.motorData[selectedIndex].motorPartNo + '<div class="closeButtonStyle">X</div></caption>');
            var $tableHead = $('<thead><tr><th class="leftCol tableTitle">Parameters</th><th class="rightCol tableTitle">Value</th></tr></thead>');
            var $tableBody = $('<tbody></tbody>');

            $tableContainer.append($tableEle);
            $tableEle.append($tableTitle);
            $tableEle.append($tableHead);
            $tableEle.append($tableBody);

            $tableBody.append('<tr> <td class="leftCol"> Frame Size </td><td class="rightCol">' + settings.motorData[selectedIndex].FrameSize + '</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Peak Stall Torque </td><td class="rightCol">' + settings.motorData[selectedIndex].peakStallTorque + ' N-m</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Roll Off Point </td><td class="rightCol">' + settings.motorData[selectedIndex].rollOffPoint + ' N-m</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Roll Off Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].rollOffSpeed + ' rad/sec</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Max Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].maxSpeed + ' rad/sec</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Peak Torque at Max Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].peakTorqueAtMaxSpeed + ' N-m</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Continuous Stall Torque </td><td class="rightCol">' + settings.motorData[selectedIndex].continuousStallTorque + ' N-m</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Continuos Torque at Max Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].continuosTorqueAtMaxSpeed + ' N-m</td></tr>');
        };

        // graph points calculations
        var calculateTSCurevePoints = function() {
            var TSCurveData = [];
            var TSCurveOptions = {
                colors: [settings.graphLineColor.peakTSCurve, settings.graphLineColor.peakTSCurve, settings.graphLineColor.contionusTSCurve, settings.graphLineColor.contionusTSCurve],
                series: {
                    points: {
                        show: true
                    }
                },
                legend: {
                    backgroundOpacity: 0,
                },
                coordinate: {
                    type: 'rectangular'
                },
                axisLabels: {
                    show: true
                },
                xaxis: {
                    axisLabel: "Speed (rad/sec)",

                },
                yaxis: {
                    axisLabel: "Torque (N-m)",
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 1,
                    borderColor: '#D9D9D9',
                    margin: 0,
                    markings: [{
                        yaxis: {
                            from: 0,
                            to: 0
                        },
                        color: "#333"
                    }, {
                        xaxis: {
                            from: 0,
                            to: 0
                        },
                        color: "#333"
                    }],
                },
                tooltip: true,
                tooltipOpts: {
                    cssClass: "tsCurveFlotTip",
                    content: function(label, xval, yval, flotItem) {
                        var title = "";
                        switch (flotItem.seriesIndex) {
                            case 0:
                                switch (flotItem.dataIndex) {
                                    case 0:
                                        title = "Peak Stall Torque <br />";
                                        break;
                                    case 1:
                                        title = "Roll Off Point<br />";
                                        break;
                                    case 2:
                                        title = "Peak Torque at Max Speed <br />";
                                        break;
                                    case 3:
                                        title = "Max Speed at Zero Torque <br />";
                                        break;
                                }
                                break;
                            case 1:
                                title = "Peak T/S Point <br />";
                                break;
                            case 2:
                                switch (flotItem.dataIndex) {
                                    case 0:
                                        title = "Continuous Stall Torque <br />";
                                        break;
                                    case 1:
                                        title = "Continuous Stall Torque at Max Speed <br />";
                                        break;
                                    case 2:
                                        title = "Max Speed Point <br />";
                                        break;
                                }
                                break;
                            case 3:
                                title = "RMS T/S Point <br />";
                                break;
                        }
                        return title + "Speed: " + xval + ", Torque: " + yval;
                    },
                    defaultTheme: false,
                    shifts: {
                        x: 0,
                        y: 20
                    }
                }
            };

            if (settings.quadrant == 1) {
                TSCurveOptions.xaxis.min = 0;
                TSCurveOptions.yaxis.min = 0;
            }

            var peakTorqueGraphData = [];
            var contTorqueGraphData = [];

            var applicationElementGraphData = [];
            var applicationRMSGraphData = [];

            var positiveVelocityPointsPeakTorque = [];
            var negativeVelocityPointsPeakTorque = [];

            var positiveVelocityPointsContTorque = [];
            var negativeVelocityPointsContTorque = []

            var resetData = function() {
                peakTorqueGraphData = [];
                contTorqueGraphData = [];
                applicationElementGraphData = [];
                applicationRMSGraphData = [];

                positiveVelocityPointsPeakTorque = [];
                negativeVelocityPointsPeakTorque = [];

                positiveVelocityPointsContTorque = [];
                negativeVelocityPointsContTorque = [];
            };

            var interpolatePositiveVelocityDataPoints = function(motorPoints) {
                var maxPositiveVelocity = motorPoints.maxSpeed;
                positiveVelocityPointsPeakTorque = [
                    [0, motorPoints.peakStallTorque],
                    [motorPoints.rollOffSpeed, motorPoints.rollOffPoint],
                    [maxPositiveVelocity, motorPoints.peakTorqueAtMaxSpeed],
                    [maxPositiveVelocity, 0]
                ];

                positiveVelocityPointsContTorque = [
                    [0, motorPoints.continuousStallTorque],
                    [maxPositiveVelocity, motorPoints.continuosTorqueAtMaxSpeed],
                    [maxPositiveVelocity, 0]
                ];
            };

            var interpolateNegativeVelocityDataPoints = function(motorPoints) {
                var maxNegativeVelocity = -1 * motorPoints.maxSpeed;
                negativeVelocityPointsPeakTorque = [
                    [maxNegativeVelocity, 0],
                    [maxNegativeVelocity + 1, motorPoints.peakStallTorque]
                ];

                negativeVelocityPointsContTorque = [
                    [maxNegativeVelocity, 0],
                    [maxNegativeVelocity + 1, motorPoints.continuousStallTorque]
                ];
            };

            var updatefirstQadrant = function(motorPoints) {
                peakTorqueGraphData = peakTorqueGraphData.concat(positiveVelocityPointsPeakTorque);

                contTorqueGraphData = contTorqueGraphData.concat(positiveVelocityPointsContTorque);
            };

            var updatefourthQuadrant = function(motorPoints) {
                var fourthQuadPointsPeakTorque = [];
                var fourthQuadPointsContTorque = [];

                if (negativeVelocityPointsPeakTorque.length > 0) {
                    negativeVelocityPointsPeakTorque.forEach(function(element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        fourthQuadPointsPeakTorque[index] = currentElement;
                    });
                }
                peakTorqueGraphData = peakTorqueGraphData.concat(fourthQuadPointsPeakTorque);

                if (negativeVelocityPointsContTorque.length > 0) {
                    negativeVelocityPointsContTorque.forEach(function(element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        fourthQuadPointsContTorque[index] = currentElement;
                    });
                }

                contTorqueGraphData = contTorqueGraphData.concat(fourthQuadPointsContTorque);
            };

            var updateThirdQuadrant = function(motorPoints) {
                var thirdQuadPointsPeakTorque = [];
                var thirdQuadPointsContTorque = [];

                if (positiveVelocityPointsPeakTorque.length > 0) {
                    positiveVelocityPointsPeakTorque.forEach(function(element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        thirdQuadPointsPeakTorque[index] = currentElement;
                    });
                }
                peakTorqueGraphData = peakTorqueGraphData.concat(thirdQuadPointsPeakTorque);

                if (positiveVelocityPointsContTorque.length > 0) {
                    positiveVelocityPointsContTorque.forEach(function(element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        thirdQuadPointsContTorque[index] = currentElement;
                    });
                }
                contTorqueGraphData = contTorqueGraphData.concat(thirdQuadPointsContTorque);
            };

            var updateSecondQuadrant = function(motorPoints) {
                peakTorqueGraphData = peakTorqueGraphData.concat(negativeVelocityPointsPeakTorque);

                contTorqueGraphData = contTorqueGraphData.concat(negativeVelocityPointsContTorque);
            };

            var coCOMPeteCycle = function(motorPoints) {
                peakTorqueGraphData.push([0, motorPoints.peakStallTorque]);

                contTorqueGraphData.push([0, motorPoints.continuousStallTorque]);
            };
            var addTempEffectOnMotorData = function(motorPoints){
              var ta = motorPoints.temp; // Application temperature
              var tr = 40 // Rating ambient (the ambient at which the motor is rated - default 40 degrees)
              var twl = 155 // Limiting winding temperature in degree celcius
              var ts = 25 //Motor specification Temperature
               
              var tm =  ta + (0.6*(twl - ta)); //Actual Magnet Temperature
              var tmr= tr + (0.6*(twl - tr)); //Rating Magnet Temperature
              var Km = -0.0015; // is the temperature coefficient of the rotor magnets


                var K1 =  (1-(ta-tr)/(twl-tr)); 
                var K2 = ((ts+234.5)/(tmr+234.5));   
                var K3  = (1+(tm - tmr )* Km);

                motorPoints.peakStallTorque = (motorPoints.peakStallTorque * K3).toFixed(2);
                motorPoints.rollOffPoint = (motorPoints.rollOffPoint * K3).toFixed(2);
                motorPoints.rollOffSpeed = (motorPoints.rollOffSpeed / K3).toFixed(2);
                motorPoints.continuousStallTorque = (motorPoints.continuousStallTorque * (K3 * Math.sqrt(K1 / K2))).toFixed(2);
                motorPoints.continuosTorqueAtMaxSpeed = (motorPoints.continuosTorqueAtMaxSpeed * (K3 * Math.sqrt(K1 / K2))).toFixed(2);


                //settings.defaultPeakStallTorque =  motorPoints.peakStallTorque;
                //settings.defaultRollOffPoint =  motorPoints.rollOffPoint;
                //settings.defaultRollOffSpeed =  motorPoints.rollOffSpeed;
                //settings.defaultPeakTorqueAtMaxSpeed =  motorPoints.peakTorqueAtMaxSpeed;
                //settings.defaultContinuousStallTorque =  motorPoints.continuousStallTorque;
                //settings.defaultContinuosTorqueAtMaxSpeed =  motorPoints.continuosTorqueAtMaxSpeed;
               

              return motorPoints;

            }

            var updateFourQuadrantData = function(motorPoints) {
                // 1st Quadrant, starting from (0,0)
                updatefirstQadrant(motorPoints);
                updatefourthQuadrant(motorPoints);
                updateThirdQuadrant(motorPoints);
                updateSecondQuadrant(motorPoints);
                coCOMPeteCycle(motorPoints);
            };

            var updateDataforTorqueGraph = function(motorPoints) {
                resetData();
                var motorNewPoints = addTempEffectOnMotorData(motorPoints);
                interpolatePositiveVelocityDataPoints(motorNewPoints);
                interpolateNegativeVelocityDataPoints(motorNewPoints);

                updateFourQuadrantData(motorNewPoints);

            };

            if (settings.showMotorTsCurve) {
                updateDataforTorqueGraph(settings.motorData[settings.motorSelectedIndex]);
            }

            if (settings.showApplicationPoints) {
                applicationElementGraphData.push(settings.peakPoints);
                applicationRMSGraphData.push(settings.rmsPoints);
            }

            TSCurveData.push({
                data: peakTorqueGraphData,
                label: 'Peak T-S Curve',
                lines: {
                    lineWidth: 2,
                    show: true,
                },
            }, {
                data: applicationElementGraphData,
                label: '',
                points: {
                    show: true,
                    fillColor: settings.graphLineColor.peakTSCurve,
                    radius: 4
                }
            }, {
                data: contTorqueGraphData,
                label: 'Continous T-S Curve',
                lines: {
                    lineWidth: 2,
                    show: true,
                },
            }, {
                data: applicationRMSGraphData,
                label: '',
                points: {
                    show: true,
                    fillColor: settings.graphLineColor.contionusTSCurve,
                    radius: 4
                }
            });

            if (!tsPlot) { // graph plotted already
                plotTSGraph(TSCurveData, TSCurveOptions);
            } else {
                updateTSGraph(TSCurveData, TSCurveOptions);
            }
        };

        // check for motor pass/fail status
        var checkMotorStatus = function(selectedMotorData) {

               var motorData = selectedMotorData;
               var elementData = settings.peakPoints;
               var rmsData = settings.rmsPoints;
            var motorPoints = {
                "PeakStallPoint": {
                    "x": 0,
                    "y": motorData.peakStallTorque
                },
                "RollOffPoint": {
                    "x": motorData.rollOffSpeed,
                    "y": motorData.rollOffPoint
                },
                "PeakTarqueAtMaxSpeedPoint": {
                    "x": motorData.maxSpeed,
                    "y": motorData.peakTorqueAtMaxSpeed
                },
                "ContinuousStallTorquePoint": {
                    "x": 0,
                    "y": motorData.continuousStallTorque
                },
                "ContinuousStallTorqueMaxSpeedPoint": {
                    "x": motorData.maxSpeed,
                    "y": motorData.continuosTorqueAtMaxSpeed
                }
            };

            var passStatus = 0; // 0 for nutral, 1 for pass, -1 for fail.
            var status = null;
            var torqueUtilizationArray = [];
            var speedUtilizationArray = [];
            var averagePowerArray = [];
            var torqueUtilization = null;
            var speedUtilization = null;
            var avgPower = null;
            var obj = {
                "status": status,
                "torqueUtilization": torqueUtilization,
                "speedUtilization": speedUtilization,
                "avgPower": avgPower
            };

            // RMS torque point
            var rmsVelocity = rmsData[0];
            var rmsTorque = rmsData[1];

            var peakVelocity = elementData[0];
            var peakTorque = elementData[1];
            var initialVelocity = 0;
            var initialTorque = 0;

            var peakTSPointCheck = false;
            var rmsTorquePointCheck = false;

            var pointA = null;
            var pointB = null;
            var pointC = null;


            // for continuous torque.
            if (rmsVelocity <= motorData.maxSpeed /* && rmsTorque <= motorData.continuousStallTorque*/ ) {
                pointA = [motorPoints.ContinuousStallTorquePoint.x, motorPoints.ContinuousStallTorquePoint.y];
                pointB = [motorPoints.ContinuousStallTorqueMaxSpeedPoint.x, motorPoints.ContinuousStallTorqueMaxSpeedPoint.y];
                pointC = [rmsVelocity, rmsTorque];
                rmsTorquePointCheck = drawLine(pointA, pointB, pointC, true); // boolean variable is passed as true which tells that we have to calculate the power utilization when we are calling drawLine() function.
            } else {
                // Point is beyond the max speed point.
                passStatus = -1;
                calculatePowerUtilization([rmsVelocity, rmsTorque]);
            }

            // for peak values
            if (peakTorque <= motorData.peakStallTorque && peakVelocity <= motorData.maxSpeed) {
                if (peakVelocity <= motorPoints.RollOffPoint.x) {
                    pointA = [motorPoints.PeakStallPoint.x, motorPoints.PeakStallPoint.y];
                    pointB = [motorPoints.RollOffPoint.x, motorPoints.RollOffPoint.y];
                    pointC = [peakVelocity, peakTorque];
                    peakTSPointCheck = drawLine(pointA, pointB, pointC, false);
                } else {
                    pointA = [motorPoints.RollOffPoint.x, motorPoints.RollOffPoint.y];
                    pointB = [motorPoints.PeakTarqueAtMaxSpeedPoint.x, motorPoints.PeakTarqueAtMaxSpeedPoint.y];
                    pointC = [peakVelocity, peakTorque];
                    peakTSPointCheck = drawLine(pointA, pointB, pointC, false);
                }
            } else {
                // Point is beyond the max speed point.
                passStatus = -1;
                calculateTorqueSpeedUtilization([peakVelocity, peakTorque]);
            }

            if (passStatus == -1 || peakTSPointCheck == false || rmsTorquePointCheck == false) {
                passStatus = -1;
            }

            if (passStatus == -1) {
                obj.status = false
            } else if (passStatus == 0) {
                obj.status = true;
            }

            obj.torqueUtilization = Math.max.apply(Math, torqueUtilizationArray);
            obj.speedUtilization = Math.max.apply(Math, speedUtilizationArray);
            obj.avgPower = Math.max.apply(Math, averagePowerArray);

            // pointC is the point for which we are checking the value of equation of line.
            function drawLine(pointA, pointB, pointC, forPower) {

                var pointStatus = false;

                // equation of line "mx-y-(mx1-y1)" so m = y-y1/x-x1
                var m = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0]);
                var c = pointA[1] - m * pointA[0];
                var b = -1;

                var valueAtPointC = m * pointC[0] - pointC[1] + c;
                if ((valueAtPointC == 0) || (valueAtPointC > 0 && b < 0) || (valueAtPointC < 0 && b > 0)) {
                    pointStatus = true;
                } else {
                    pointStatus = false;
                }

                if (!forPower) {
                    // calculation for Torque and Speed utilization.
                    var peakTorqueUtilization = (pointC[1] * 100) / (m * pointC[0] + c);
                    var peakSpeedUtilization = (pointC[0] * 100) / motorData.maxSpeed;
                    torqueUtilizationArray.push(peakTorqueUtilization);
                    speedUtilizationArray.push(peakSpeedUtilization);
                } else {
                    // calculation for average power utilization. formula: power = speed * torque.
                    var powerOfApp = pointC[0] * pointC[1];
                    var powerOfMotor = pointC[0] * (m * pointC[0] + c);
                    var avgPower = (powerOfApp * 100) / powerOfMotor;
                    averagePowerArray.push(avgPower);
                }

                return pointStatus;
            }

            function calculateTorqueSpeedUtilization(pointC) {
                var peakTorqueUtilization = (pointC[1] * 100) / motorData.peakStallTorque;
                var peakSpeedUtilization = (pointC[0] * 100) / motorData.maxSpeed;
                torqueUtilizationArray.push(peakTorqueUtilization);
                speedUtilizationArray.push(peakSpeedUtilization);
            }

            function calculatePowerUtilization(pointC) {
                var powerOfApp = pointC[0] * pointC[1];
                var powerOfMotor = pointC[0] * motorData.continuousStallTorque;
                var avgPower = (powerOfApp * 100) / powerOfMotor;
                averagePowerArray.push(avgPower);
            }

            return obj;
        };

        var updatePlotMaxMinValues = function() {
            // var tsPlotAxes = tsPlot.getAxes();

            // if (settings.showMotorTsCurve) {
            // 	var maxX = Math.max(settings.peakPoints[0] + 50, settings.rmsPoints[0] + 50, 600);
            // 	var maxY = Math.max(settings.peakPoints[1] + 10, settings.rmsPoints[1] + 10, 200);

            // 	if (tsPlotAxes.xaxis.datamax < maxX) {
            // 		tsPlot.getOptions().xaxes[0].max = maxX;
            // 	} else {
            // 		tsPlot.getOptions().xaxes[0].max = tsPlotAxes.xaxis.datamax + 50;
            // 	}

            // 	if (tsPlotAxes.yaxis.datamax < maxY) {
            // 		tsPlot.getOptions().yaxes[0].max = maxY;
            // 	} else {
            // 		tsPlot.getOptions().yaxes[0].max = tsPlotAxes.yaxis.datamax + 20;
            // 	}


            // 	if (settings.quadrant === 4) {
            // 		// tsPlot.getOptions().yaxes[0].min = -1 * maxX;
            // 		// tsPlot.getOptions().xaxes[0].min = -1 * maxY;

            // 		// if (tsPlotAxes.xaxis.min < -1 * maxX) {
            // 		// 	tsPlot.getOptions().xaxes[0].min = -1 * maxX;
            // 		// }

            // 		// if (tsPlotAxes.yaxis.min < -1 * maxY) {
            // 		// 	tsPlot.getOptions().yaxes[0].min = -1 * maxY;
            // 		// }

            // 		if (tsPlotAxes.xaxis.datamin < -1*maxX) {
            // 			tsPlot.getOptions().xaxes[0].min = -1*maxX;
            // 		} else {
            // 			tsPlot.getOptions().xaxes[0].min = tsPlotAxes.xaxis.datamin - 50;
            // 		}

            // 		if (tsPlotAxes.yaxis.datamin < -1*maxY) {
            // 			tsPlot.getOptions().yaxes[0].min = -1*maxY;
            // 		} else {
            // 			tsPlot.getOptions().yaxes[0].min = tsPlotAxes.yaxis.datamin - 20;
            // 		}
            // 	}
            // }

            if (!settings.showMotorTsCurve) {
                var maxX = Math.max(settings.peakPoints[0] + 50, settings.rmsPoints[0] + 50, 200);
                var maxY = Math.max(settings.peakPoints[1] + 10, settings.rmsPoints[1] + 10, 50);
                tsPlot.getOptions().yaxes[0].max = maxY;
                tsPlot.getOptions().xaxes[0].max = maxX;
                if (settings.quadrant === 4) {
                    tsPlot.getOptions().yaxes[0].min = -1 * maxY;
                    tsPlot.getOptions().xaxes[0].min = -1 * maxX;
                }
            }
        };

        var modifyTSPlot = function() {
            if (settings.quadrant == 4) {
                tsPlot.getOptions().grid.markings[0].color = "#bdbdbd";
                tsPlot.getOptions().grid.markings[1].color = "#bdbdbd"
            } else {
                tsPlot.getOptions().grid.markings[0].color = "#333";
                tsPlot.getOptions().grid.markings[1].color = "#333"
            }
            updatePlotMaxMinValues();
            tsPlot.setupGrid();
            tsPlot.draw();
        };

        var plotTSGraph = function(data, options) {
        
            setTimeout(function() {
                tsPlot = $.plot( $container.find(".tsPlotArea"), data, options);
                modifyTSPlot();
            }, 0);
        };

        var updateTSGraph = function(data, options) {
            if (options) {
                if (options.xaxis.min != undefined && options.yaxis.min != undefined) {
                    tsPlot.getOptions().yaxes[0].min = options.yaxis.min;
                    tsPlot.getOptions().xaxes[0].min = options.xaxis.min;
                } else {
                    tsPlot.getOptions().yaxes[0].min = null;
                    tsPlot.getOptions().xaxes[0].min = null;
                }
            }
            tsPlot.setData(data);
            modifyTSPlot();
            assessmentNotifier();
        };

        var assessmentNotifier = function () {
            if (settings.assessmentMode && settings.assessmentCallback) {
                settings.assessmentCallback({
                    "peakTorque": {
                        "value": $container.find('#peakTorqueValue').val(),
                        "unit": "Nm"
                    },
                    "peakSpeed": {
                        "value": $container.find('#peakSpeedValue').val(),
                        "unit": "rad/sec"
                    },
                    "rmsTorque": {
                        "value": $container.find('#rmsTorqueValue').val(),
                        "unit": "Nm"
                    },
                    "rmsSpeed": {
                        "value": $container.find('#rmsSpeedValue').val(),
                        "unit": "rad/sec"
                    },
                    "temperature": {
                        "value": $container.find("#tempValue").val(),
                        "unit": "C"
                    },
                    "altitude": {
                        "value": $container.find('#altitudeValue').val(),
                        "unit": "m"
                    },
                    "transmissionRatio": {
                        "value": $container.find('#trRatioValue').val(),
                        "unit": ""
                    },
                    "status": {
                        "value": checkMotorStatus(settings.motorData[settings.motorSelectedIndex]).status,
                        "unit": ""
                    }
                });
            }
        }
        var updateInputs = function (params) {
            if (params.peakTorque) {
                // TODO
            }
            if (params.peakSpeed) {
                
            }
            if (params.rmsTorque) {
               
            }
            if (params.rmsSpeed) {
                
            }
            if (params.temperature) {
                $container.find('#tempSlider').slider('setValue', params.temperature);
                $container.find("#tempValue").val(params.temperature);
            }
            if (params.altitude) {
                $container.find('#altitudeSlider').slider('setValue', params.altitude);
                $container.find("#altitudeValue").val(params.altitude);
            }
            if (params.transmissionRatio) {
                
            }
            
        }

        var markAnswers = function (params) {
            var cssClass;
            if (params.peakTorque) {
                cssClass = params.peakTorque.status ? 'correct' : 'incorrect';
                $container.find('#peakTorqueValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
            if (params.peakSpeed) {
                cssClass = params.peakSpeed.status ? 'correct' : 'incorrect';
                $container.find('#peakSpeedValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
            if (params.rmsTorque) {
                cssClass = params.rmsTorque.status ? 'correct' : 'incorrect';
                $container.find('#rmsTorqueValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
            if (params.rmsSpeed) {
                cssClass = params.rmsSpeed.status ? 'correct' : 'incorrect';
                $container.find('#rmsSpeedValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
            if (params.temperature) {
                cssClass = params.temperature.status ? 'correct' : 'incorrect';
                $container.find('#tempValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
            if (params.altitude) {
                cssClass = params.altitude.status ? 'correct' : 'incorrect';
                $container.find('#altitudeValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
            if (params.transmissionRatio) {
                cssClass = params.transmissionRatio.status ? 'correct' : 'incorrect';
                $container.find('#trRatioValue').addClass(cssClass)
                // $peakTorqueInput.data('unitsComboBox').update({
                //     "enable": {
                //         "textbox": "false",
                //         "comboBox": "true"
                //     }
                // });
            }
        }

        generateTSCurveArea();

        return {
            ref: this,
            updateInputs: updateInputs,
            markAnswers: markAnswers
        };
    }

})(jQuery);
define("../libs/libs-frontend-TSCurve/dist/js/tsCurve.js", function(){});

/*
 * -------------
 * Engine Module
 * -------------
 * 
 * Item Type: cosmatttsc Single Choice Quesion engine
 * Code: cosmatttsc
 * Interface: ENGINE
 
 *  ENGINE Interface public functions
 *  {
 *          init(),
 *          getStatus(),
 *          getConfig()
 *  }
 * 
 *
 * This engine is designed to be loaded dynamical by other applications (or  platforms). At the starte the function [ engine.init() ] will be called  with necessary configuration paramters and a reference to platform "Adapter"  which allows subsequent communuication with the platform.
 *
 * The function [ engine.getStatus() ] may be called to check if SUBMIT has been pressed or not - the response from the engine is used to enable / disable appropriate platform controls.
 *
 * The function engine.getConfig() is called to request SIZE information - the response from the engine is used to resize & display the container iframe.
 *
 *
 * EXTERNAL JS DEPENDENCIES : ->
 * Following are shared/common dependencies and assumed to loaded via the platform. The engine code can use/reference these as needed
 * 1. JQuery (2.1.1)
 * 2. Boostrap (TODO: version) 
 */

// 8:23 22/06/2017
define('cosmatttsc',[
    'css!../css/cosmatttsc.css', //Custom styles of the engine (applied over bootstrap & front-end-core)
    '../../bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
    'css!../../bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
    '../../bower_components/flot/jquery.flot.js',
    '../../bower_components/flot/jquery.flot.resize.js',
    '../../bower_components/flot-axislabels/jquery.flot.axislabels.js',
    'css!../libs/libs-frontend-TSCurve/dist/css/tsCurve.min.css',
    '../libs/libs-frontend-TSCurve/dist/js/tsCurve.js'
  ], //Required by Rivets
  function(cosmatttscTemplateRef) {


    cosmatttsc = function() {

      "use strict";

      /*
       * Reference to platform's activity adaptor (initialized during init() ).
       */
      var activityAdaptor;

      /*
       * Internal Engine Config.
       */
      var __config = {
        MAX_RETRIES: 10,
        /* Maximum number of retries for sending results to platform for a particular activity. */
        RESIZE_MODE: "auto",
        /* Possible values - "manual"/"auto". Default value is "auto". */
        RESIZE_HEIGHT: "580" /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
          /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
      };

      /*
       * Internal Engine State.
       */
      var __state = {
        currentTries: 0,
        /* Current try of sending results to platform */
        activityPariallySubmitted: false,
        /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
        activitySubmitted: false,
        /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
        radioButtonClicked: false /* State whether radio button is clicked.  Possible Values: true/false(Boolean) */
      };

      /*
       * Content (loaded / initialized during init() ).
       */
      var __content = {
        instructionText: "",
        score: {},
        appData: {},
        questionText: "",
        /* Contains the question obtained from content JSON. */
        optionsJSON: {},
        /* Contains all the options for a particular question obtained from content JSON. */
        answersJSON: {},
        /* Contains the answer for a particular question obtained from content JSON. */
        userAnswersJSON: {},
        /* Contains the user answer for a particular question. */
        activityType: null /* Type of FIB activity. Possible Values :- FIBPassage.  */
      };

      /*
       * Constants.
       */
      var __constants = {
        /* CONSTANT for PLATFORM Save Status NO ERROR */
        STATUS_NOERROR: "NO_ERROR",
        /* CONSTANTS for activity status */
        ACTIVITY_NOT_ATTEMPTED: "not_attempted",
        /* Activity not yet Attempted. */
        ACTIVITY_IN_PROGRESS: "in_progress",
        /* In Progress Activity. */
        ACTIVITY_PARTIALLY_CORRECT: "partially_correct",
        /* Partially Correct Activity. */
        ACTIVITY_CORRECT: "correct",
        /* Correct Activity. */
        ACTIVITY_INCORRECT: "incorrect",
        /* Incorrect Activity. */

        TEMPLATES: {
          /* Regular cosmatttsc Layout */
          cosmatttsc: cosmatttscTemplateRef
        }
      };
      // Array of all interaction tags in question
      var __interactionIds = [];
      var __processedJsonContent;
      var __feedback = {
        'correct': false,
        'incorrect': false,
        'empty': false
      };

      var __pluginInstance;

      /********************************************************/
      /*                  ENGINE-SHELL INIT FUNCTION
          
          "elRoot" :->        DOM Element reference where the engine should paint itself.                                                     
          "params" :->        Startup params passed by platform. Include the following sets of parameters:
                          (a) State (Initial launch / Resume / Gradebook mode ).
                          (b) TOC parameters (videoRoot, contentFile, keyframe, layout, etc.).
          "adaptor" :->        An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
          "htmlLayout" :->    Activity HTML layout (as defined in the TOC LINK paramter). 
          "jsonContent" :->    Activity JSON content (as defined in the TOC LINK paramter).
          "callback" :->      To inform the shell that init is complete.
      */
      /********************************************************/
      function init(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {

        /* ---------------------- BEGIN OF INIT ---------------------------------*/
        //Store the adaptor  
        activityAdaptor = adaptor;

        //Clone the JSON so that original is preserved.
        var jsonContent = jQuery.extend(true, {}, jsonContentObj);

        __processedJsonContent = __parseAndUpdateJSONContent(jsonContent, params, htmlLayout);


        /* ------ VALIDATION BLOCK END -------- */
        var $questionContainer = $('<div class="row cosmatttsc-engine"></div>');
        var $questionArea = $('<p class="col-sm-12 text-primary question-text"></p>');
        var $pluginArea = $('<div class="col-sm-12"></div>');

        $questionArea.html(__content.questionText);

        //add callback function to appData
        __content.appData.options.data.assessmentCallback = userResponseHandler;
        __pluginInstance = $pluginArea.TSCurve(__content.appData.options.data);

        $questionContainer.append($questionArea);
        $questionContainer.append($pluginArea);

        $(elRoot).html($questionContainer);

        /* ---------------------- SETUP EVENTHANDLER STARTS----------------------------*/

        // $('input[id^=option]').change(__handleRadioButtonClick);

        // $(document).bind('userAnswered', function(e, value) {
        //   __saveResults(false);
        // });

        /* ---------------------- SETUP EVENTHANDLER ENDS------------------------------*/

        /* Inform the shell that init is complete */
        if (callback) {
          callback();
        }

        /* ---------------------- END OF INIT ---------------------------------*/
      } /* init() Ends. */
      /* ---------------------- PUBLIC FUNCTIONS --------------------------------*/
      /**
       * ENGINE-SHELL Interface
       *
       * Return configuration
       */
      function getConfig() {
        return __config;
      }

      function userResponseHandler(callbackValue) {
        for (var property in callbackValue) {
          if (callbackValue.hasOwnProperty(property)) {
            var interactionMinScore = __content.score.min;
            var optionsCount = Object.keys(__content.optionsJSON).length;
            var interactionMaxScore = __content.score.max / optionsCount;

            var interactionId = getInteractionId(property);
            if (interactionId != '') {
              __content.userAnswersJSON[interactionId] = {};
              __content.userAnswersJSON[interactionId].answer = callbackValue[property].value.toString();
              if (callbackValue[property].unit != undefined) __content.userAnswersJSON[interactionId].unit = callbackValue[property].unit.toString();
              __content.userAnswersJSON[interactionId].correctanswer = __content.answersJSON[interactionId].correct.toString();
              __content.userAnswersJSON[interactionId].maxscore = interactionMaxScore;


              if (Math.round(parseFloat(callbackValue[property].value) * 100) / 100 == parseFloat(__content.answersJSON[interactionId].correct)) {
                __content.userAnswersJSON[interactionId].score = interactionMaxScore;
                __content.userAnswersJSON[interactionId].status = 'correct';
              } else {
                __content.userAnswersJSON[interactionId].score = interactionMinScore;
                __content.userAnswersJSON[interactionId].status = 'incorrect';
              }
            }
          }
        }
        // $(document).triggerHandler('userAnswered', callbackValue);
        __saveResults(false);
      }

      function getInteractionId(interactionField) {
        var interactions = __content.optionsJSON;
        var interactionId = '';
        for (interactionId in interactions) {
          if (interactions[interactionId].type === interactionField) {
            return interactionId;
          }
        }
        return '';
      }
      /**
       * ENGINE-SHELL Interface
       *
       * Return the current state (Activity Submitted/ Partial Save State.) of activity.
       */
      function getStatus() {
        return __state.activitySubmitted || __state.activityPariallySubmitted;
      }

      /**
       * Bound to click of Activity submit button.
       */
      function handleSubmit(event) {
        /* Saving Answer. */
        __saveResults(true);

        /* Marking Answers. */
        if (activityAdaptor.showAnswers) {
          __markAnswers();
        }

        //$('input[id^=option]').attr("disabled", true);
      }

      /**
       * Function to show user grades.
       */
      function showGrades(savedAnswer, reviewAttempt) {
        /* Show last saved answers. */
        // updateLastSavedResults(savedAnswer);
        /* Mark answers. */
        __markAnswers();
        //$('input[id^=option]').attr("disabled", true);
      }

      /**
       * Function to display last result saved in LMS.
       */
      function updateLastSavedResults(lastResults) {
        var updatePluginVals = {};
        $.each(lastResults.interactions, function(num, value) {
          var interactionMinScore = __content.score.min;
          var optionsCount = Object.keys(__content.optionsJSON).length;
          var interactionMaxScore = __content.score.max / optionsCount;

          var interactionId = value.id;

          __content.userAnswersJSON[interactionId] = {};
          __content.userAnswersJSON[interactionId].answer = value.answer.toString();
          __content.userAnswersJSON[interactionId].correctanswer = __content.answersJSON[interactionId].correct.toString();
          __content.userAnswersJSON[interactionId].maxscore = interactionMaxScore;

          if (Math.round(parseFloat(value.answer) * 100) / 100 == parseFloat(__content.answersJSON[interactionId].correct)) {
            __content.userAnswersJSON[interactionId].score = interactionMaxScore;
            __content.userAnswersJSON[interactionId].status = 'correct';
          } else {
            __content.userAnswersJSON[interactionId].score = interactionMinScore;
            __content.userAnswersJSON[interactionId].status = 'incorrect';
          }
          updatePluginVals[__content.optionsJSON[value.id].type] = {
            value: value.answer
          };
          if (value.unit) updatePluginVals[__content.optionsJSON[value.id].type].unit = value.unit;
        });
        __pluginInstance.updateInputs(updatePluginVals);

      }
      /* ---------------------- PUBLIC FUNCTIONS END ----------------------------*/


      /* ---------------------- PRIVATE FUNCTIONS -------------------------------*/

      /* ---------------------- JSON PROCESSING FUNCTIONS START ---------------------------------*/
      /**
       * Parse and Update JSON based on cosmatttsc specific requirements.
       */
      function __parseAndUpdateJSONContent(jsonContent, params, htmlLayout) {

        jsonContent.content.displaySubmit = activityAdaptor.displaySubmit;

        __content.activityType = params.engineType;
        __content.layoutType = jsonContent.content.canvas.layout;

        /* Activity Instructions. */
        var tagName = jsonContent.content.instructions[0].tag;
        __content.instructionText = jsonContent.content.instructions[0][tagName];
        __content.appData = jsonContent["app-data"];
        __content.score = jsonContent.meta.score;
        /* Put directions in JSON. */
        //jsonContent.content.directions = __content.directionsJSON;
        // $.each(jsonContent.content.stimulus, function (i) {
        //     if (this.tag === "image") {
        //         jsonContent.content.stimulus.mediaContent = params.questionMediaBasePath + this.image;
        //     }
        // });
        var questionText = jsonContent.content.canvas.data.questiondata[0].text;

        var interactionId = [];
        var interactionTag = [];
        /* String present in href of interaction tag. */
        var interactionReferenceString = "http://www.comprodls.com/m1.0/interaction/cosmatttsc";
        /* Parse questiontext as HTML to get HTML tags. */
        var parsedQuestionArray = $.parseHTML(jsonContent.content.canvas.data.questiondata[0].text);
        var j = 0;
        $.each(parsedQuestionArray, function(i, el) {
          if (this.href === interactionReferenceString) {
            interactionId[j] = this.childNodes[0].nodeValue.trim();
            __interactionIds.push(interactionId[j]);
            interactionTag[j] = this.outerHTML.replace(/"/g, "'");
            j++;
          }
        });

        $.each(interactionId, function(i) {
          var interactionId = this;
          //var id = __config.ENTRY_BOX_PREFIX +  __content.answersXML.length;
          /*
           * Add entry box.
           */
          questionText = questionText.replace(interactionTag[i], "");
          __content.answersJSON[interactionId] = jsonContent.responses[interactionId];
          __content.optionsJSON[interactionId] = jsonContent.content.interactions[interactionId];
        });
        /* Replace interaction tag with blank string. */
        // jsonContent.content.canvas.data.questiondata[0].text = jsonContent.content.canvas.data.questiondata[0].text.replace(interactionTag, "");
        // var questionText = "1.  " + jsonContent.content.canvas.data.questiondata[0].text;
        // var correctAnswerNumber = jsonContent.responses[interactionId].correct;
        // var interactionType = jsonContent.content.interactions[interactionId].type;
        // var optionCount = jsonContent.content.interactions[interactionId][interactionType].length;

        // /* Make optionsJSON and answerJSON from JSON. */
        // for (var i = 0; i < optionCount; i++) {
        //     var optionObject = jsonContent.content.interactions[interactionId][interactionType][i];
        //     var option = optionObject[Object.keys(optionObject)].replace(/^\s+|\s+$/g, '');
        //     __content.optionsJSON.push(__getHTMLEscapeValue(option));
        //     optionObject[Object.keys(optionObject)] = option;
        //     /* Update JSON after updating option. */
        //     jsonContent.content.interactions[interactionId][interactionType][i] = optionObject;
        //     if (Object.keys(optionObject) == correctAnswerNumber) {
        //         __content.answersJSON[0] = optionObject[Object.keys(optionObject)];
        //     }
        // }
        __content.questionText = questionText;

        /* Returning processed JSON. */
        return jsonContent;
      }


      /**
       * Parse and Update Question Set type JSON based on  cosmatttsc specific requirements.
       */
      // function __parseAndUpdateQuestionSetTypeJSON(jsonContent) {

      //     /* Extract interaction id's and tags from question text. */
      //     var interactionId = "";
      //     var interactionTag = "";
      //     /* String present in href of interaction tag. */
      //     var interactionReferenceString = "http://www.comprodls.com/m1.0/interaction/cosmatttsc";
      //     /* Parse questiontext as HTML to get HTML tags. */
      //     var parsedQuestionArray = $.parseHTML(jsonContent.content.canvas.data.questiondata[0].text);
      //     $.each(parsedQuestionArray, function (i, el) {
      //         if (this.href === interactionReferenceString) {
      //             interactionId = this.childNodes[0].nodeValue.trim();
      //             __interactionIds.push(interactionId);
      //             interactionTag = this.outerHTML;
      //             interactionTag = interactionTag.replace(/"/g, "'");
      //         }
      //     });
      //     /* Replace interaction tag with blank string. */
      //     jsonContent.content.canvas.data.questiondata[0].text = jsonContent.content.canvas.data.questiondata[0].text.replace(interactionTag, "");
      //     var questionText = "1.  " + jsonContent.content.canvas.data.questiondata[0].text;
      //     var correctAnswerNumber = jsonContent.responses[interactionId].correct;
      //     var interactionType = jsonContent.content.interactions[interactionId].type;
      //     var optionCount = jsonContent.content.interactions[interactionId][interactionType].length;

      //     /* Make optionsJSON and answerJSON from JSON. */
      //     for (var i = 0; i < optionCount; i++) {
      //         var optionObject = jsonContent.content.interactions[interactionId][interactionType][i];
      //         var option = optionObject[Object.keys(optionObject)].replace(/^\s+|\s+$/g, '');
      //         __content.optionsJSON.push(__getHTMLEscapeValue(option));
      //         optionObject[Object.keys(optionObject)] = option;
      //         /* Update JSON after updating option. */
      //         jsonContent.content.interactions[interactionId][interactionType][i] = optionObject;
      //         if (Object.keys(optionObject) == correctAnswerNumber) {
      //             __content.answersJSON[0] = optionObject[Object.keys(optionObject)];
      //         }
      //     }
      //     __content.questionsJSON[0] = questionText + " ^^ " + __content.optionsJSON.toString() + " ^^ " + interactionId;
      // }

      /**
       * Escaping HTML codes from String.
       */
      // function __getHTMLEscapeValue(content) {
      //     var tempDiv = $("<div></div>");
      //     $(tempDiv).html(content);
      //     $("body").append(tempDiv);
      //     content = $(tempDiv).html();
      //     $(tempDiv).remove();
      //     return content;
      // }

      /***
             * Function to modify question JSON for easy iteration in template
             * 
             * Original JSON Object
             * ---------------------
             * 
             * "cosmatttsc": [
                  {
                    "choiceA": "She has the flu." 
                  },
                  {
                    "choiceB": "She has the measles."
                  }  
                ]
        
                Modified JSON Object
                ----------------------
        
                "cosmatttsc": [
                  {
                      "customAttribs" : {
                            "key" : "choiceA",
                            "value" : "She has the flu.",
                            "isEdited" : false,
                            "index" : 0
                            "isCorrect" : false
                      } 
                  },
                   {
                      "customAttribs" : {
                            "key" : "choiceB",
                            "value" : "She has the measles.",
                            "isEdited" : false,
                            "index" : 1
                            "isCorrect" : true
                      } 
                  }  
                ]
             */
      // function __parseAndUpdateJSONForRivets(jsonContent) {
      //     var processedArray = [];
      //     for (var i = 0; i < __interactionIds.length; i++) {
      //         jsonContent.content.interactions[__interactionIds[i]].cosmatttsc.forEach(function (obj, index) {
      //             var processedObj = {};
      //             processedObj.customAttribs = {};
      //             Object.keys(obj).forEach(function (key) {
      //                 processedObj.customAttribs.key = key;
      //                 processedObj.customAttribs.value = obj[key];
      //             });
      //             processedArray.push(processedObj);
      //         });
      //         jsonContent.content.interactions[__interactionIds[i]].cosmatttsc = processedArray;
      //     }
      // }

      /*------------------------RIVET INITIALIZATION & BINDINGS -------------------------------*/
      // function __initRivets() {
      //     /* Formatter to transform object into object having 'key' property with value key
      //      * and 'value' with the value of the object
      //      * Example:
      //      * var obj = {'choiceA' : 'She has flu.'} to
      //      * obj= { 'key' : 'choiceA', 'value' : 'She has flu.'}
      //      * This is done to access the key and value of object in the template using rivets.
      //      */
      //     rivets.formatters.propertyList = function (obj) {
      //         return (function () {
      //             var properties = [];
      //             for (var key in obj) {
      //                 properties.push({ key: key, value: obj[key] })
      //             }
      //             return properties
      //         })();
      //     }

      //     /* This formatter is used to append interaction property to the object
      //      * and return text of the question for particular interaction
      //      */
      //     rivets.formatters.appendInteraction = function (obj, interaction, cosmatttsc) {
      //         return obj[interaction].text;
      //     }

      //     /* This formatter is used to return the array of options for a particular
      //      * interaction so that rivets can iterate over it.
      //      */
      //     rivets.formatters.getArray = function (obj, interaction) {
      //         return obj[interaction].cosmatttsc;
      //     }

      //     var isMCQImageEngine = false;
      //     /* Find if layout is of type MCQ_IMG*/
      //     if (__content.layoutType == 'MCQ_IMG') {
      //         isMCQImageEngine = true;
      //     }

      //     /*Bind the data to template using rivets*/
      //     rivets.bind($('#cosmatttsc-engine'), {
      //         content: __processedJsonContent.content,
      //         isMCQImageEngine: isMCQImageEngine,
      //         feedback: __processedJsonContent.feedback,
      //         showFeedback: __feedback
      //     });
      // }

      /*------------------------RIVETS END-------------------------------*/

      /* ---------------------- JQUERY BINDINGS ---------------------------------*/
      /**
       * Function to handle radio button click.
       */
      // function __handleRadioButtonClick(event) {
      //     /*
      //      * Soft save here
      //      */
      //     var currentTarget = event.currentTarget;

      //     $("label.radio").parent().removeClass("highlight");
      //     $(currentTarget).parent().parent("li").addClass("highlight");

      //     var newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');

      //     /* Save new Answer in memory. */
      //     __content.userAnswersJSON[0] = newAnswer.replace(/^\s+|\s+$/g, '');

      //     __state.radioButtonClicked = true;

      //     var interactionId = __content.questionsJSON[0].split("^^")[2].trim();

      //     $(document).triggerHandler('userAnswered');
      // }

      /**
       * Function called to send result JSON to adaptor (partial save OR submit).
       * Parameters:
       * 1. bSumbit (Boolean): true: for Submit, false: for Partial Save.
       */
      function __saveResults(bSubmit) {

        var uniqueId = activityAdaptor.getId();

        /*Getting answer in JSON format*/
        var answerJSON = __getAnswersJSON(false);

        if (bSubmit === true) { /*Hard Submit*/

          /*Send Results to platform*/
          activityAdaptor.submitResults(answerJSON, uniqueId, function(data, status) {
            if (status === __constants.STATUS_NOERROR) {
              __state.activitySubmitted = true;
              /*Close platform's session*/
              activityAdaptor.closeActivity();
              __state.currentTries = 0;
            } else {
              /* There was an error during platform communication, so try again (till MAX_RETRIES) */
              if (__state.currentTries < __config.MAX_RETRIES) {
                __state.currentTries++;
                __saveResults(bSubmit);
              }

            }

          });
        } else { /*Soft Submit*/
          /*Send Results to platform*/
          activityAdaptor.savePartialResults(answerJSON, uniqueId, function(data, status) {
            if (status === __constants.STATUS_NOERROR) {
              __state.activityPariallySubmitted = true;
            } else {
              /* There was an error during platform communication, do nothing for partial saves */
            }
          });
        }
      }

      /*------------------------OTHER PRIVATE FUNCTIONS------------------------*/

      /**
       * Function to show correct Answers to User, called on click of Show Answers Button.
       */
      function __markAnswers() {
        var markAnswerObj = {};
        var userAnswers = __content.userAnswersJSON;
        var options = __content.optionsJSON;
        var interactions = Object.keys(__content.optionsJSON);
        interactions.forEach(function(element, index) {
          if (userAnswers[element] && userAnswers[element].status) {
            if (userAnswers[element].status == "correct") {
              markAnswerObj[options[element].type] = { status: true };
            } else {
              markAnswerObj[options[element].type] = { status: false };
            }
          } else {
            markAnswerObj[options[element].type] = { status: false };
          }

        });
        __pluginInstance.markAnswers(markAnswerObj);



        // var radioNo = "";
        // /* Looping through answers to show correct answer. */
        // for (var i = 0; i < __content.optionsJSON.length; i++) {
        //     radioNo = "" + i;
        //     __markRadio(radioNo, __content.answersJSON[0], __content.optionsJSON[i]);
        // }
        // __generateFeedback();
      }
      /* Add correct or wrong answer classes*/
      // function __markRadio(optionNo, correctAnswer, userAnswer) {
      //     if (userAnswer.trim() === correctAnswer.trim()) {
      //         $($(".answer")[optionNo]).removeClass("wrong");
      //         $($(".answer")[optionNo]).addClass("correct");
      //         $($(".answer")[optionNo]).parent().addClass("state-success");
      //     } else {
      //         $($(".answer")[optionNo]).removeClass("correct");
      //         $($(".answer")[optionNo]).addClass("wrong");
      //         $($(".answer")[optionNo]).parent().addClass("state-error");
      //     }
      //     $(".answer" + optionNo).removeClass("invisible");
      // }

      function __generateFeedback() {
        for (var prop in __feedback) {
          __feedback[prop] = false;
        }
        if (!__content.userAnswersJSON[0]) {
          __feedback.empty = true;
        } else if (__content.answersJSON[0] === __content.userAnswersJSON[0]) {
          __feedback.correct = true;
        } else {
          __feedback.incorrect = true;
        }
      }

      /**
       *  Function used to create JSON from user Answers for submit(soft/hard).
       *  Called by :-
       *   1. __saveResults (internal).
       *   2. Multi-item-handler (external).
       */
      function __getAnswersJSON(skipQuestion) {
        var answers = "";
        /*Setup results array */
        var interactionArray = [];
        /* Split questionJSON to get interactionId. */

        var statusProgress = __constants.ACTIVITY_NOT_ATTEMPTED;
        var statusEvaluation = __constants.ACTIVITY_INCORRECT;
        var partiallyCorrect = false;
        var correct = false;

        if (skipQuestion) {
          answers = "Not Answered";
        } else {
          answers = __content.userAnswersJSON;
          /* Calculating scores.*/
          for (var answerID in answers) {
            var interaction = {};
            interaction.id = answerID;
            interaction.answer = answers[answerID].answer;
            interaction.maxscore = answers[answerID].maxscore;
            interaction.score = answers[answerID].score;
            interaction.unit = answers[answerID].unit;
            interactionArray.push(interaction);
          }
        }

        var interactions = Object.keys(__content.optionsJSON);
        partiallyCorrect = interactions.some(function(element, index) {
          if (answers[element] && answers[element].status == "correct") {
            return true;
          }
        });

        correct = interactions.every(function(element, index) {
          if (answers[element] && answers[element].status == "correct") {
            return true;
          }
        });

        if (partiallyCorrect) {
          statusEvaluation = __constants.ACTIVITY_PARTIALLY_CORRECT;
        }

        if (correct) {
          statusEvaluation = __constants.ACTIVITY_CORRECT;
        }

        var response = {
          "interactions": interactionArray
        };

        if (!skipQuestion) {
          statusProgress = __constants.ACTIVITY_IN_PROGRESS;
        }

        response.statusProgress = statusProgress;
        response.statusEvaluation = statusEvaluation;

        return {
          response: response
        };
      }

      return {
        /*Engine-Shell Interface*/
        "init": init,
        /* Shell requests the engine intialized and render itself. */
        "getStatus": getStatus,
        /* Shell requests a gradebook status from engine, based on its current state. */
        "getConfig": getConfig,
        /* Shell requests a engines config settings.  */
        "handleSubmit": handleSubmit,
        "showGrades": showGrades,
        "updateLastSavedResults": updateLastSavedResults
      };
    };
  });

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('/*******************************************************\r\n * \r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * CSS which is necessary for a default rendering of an\r\n * MCQSC activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid MCQSC layout HTML and/or dynamically\r\n * created by the MCQSC engine JS)\r\n *\r\n *\r\n *******************************************************/\r\n.cosmatttsc-engine .question-text{\r\n    color: #366894;\r\n    font-size: 1.286em;\r\n\r\n}/*! =======================================================\n                      VERSION  9.8.1              \n========================================================= */\n/*! =========================================================\n * bootstrap-slider.js\n *\n * Maintainers:\n *\t\tKyle Kemp\n *\t\t\t- Twitter: @seiyria\n *\t\t\t- Github:  seiyria\n *\t\tRohit Kalkur\n *\t\t\t- Twitter: @Rovolutionary\n *\t\t\t- Github:  rovolution\n *\n * =========================================================\n  *\n * bootstrap-slider is released under the MIT License\n * Copyright (c) 2017 Kyle Kemp, Rohit Kalkur, and contributors\n * \n * Permission is hereby granted, free of charge, to any person\n * obtaining a copy of this software and associated documentation\n * files (the \"Software\"), to deal in the Software without\n * restriction, including without limitation the rights to use,\n * copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the\n * Software is furnished to do so, subject to the following\n * conditions:\n * \n * The above copyright notice and this permission notice shall be\n * included in all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\n * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES\n * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\n * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT\n * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\n * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR\n * OTHER DEALINGS IN THE SOFTWARE.\n *\n * ========================================================= */.slider{display:inline-block;vertical-align:middle;position:relative}.slider.slider-horizontal{width:210px;height:20px}.slider.slider-horizontal .slider-track{height:10px;width:100%;margin-top:-5px;top:50%;left:0}.slider.slider-horizontal .slider-selection,.slider.slider-horizontal .slider-track-low,.slider.slider-horizontal .slider-track-high{height:100%;top:0;bottom:0}.slider.slider-horizontal .slider-tick,.slider.slider-horizontal .slider-handle{margin-left:-10px}.slider.slider-horizontal .slider-tick.triangle,.slider.slider-horizontal .slider-handle.triangle{position:relative;top:50%;transform:translateY(-50%);border-width:0 10px 10px 10px;width:0;height:0;border-bottom-color:#0480be;margin-top:0}.slider.slider-horizontal .slider-tick-container{white-space:nowrap;position:absolute;top:0;left:0;width:100%}.slider.slider-horizontal .slider-tick-label-container{white-space:nowrap;margin-top:20px}.slider.slider-horizontal .slider-tick-label-container .slider-tick-label{padding-top:4px;display:inline-block;text-align:center}.slider.slider-horizontal.slider-rtl .slider-track{left:initial;right:0}.slider.slider-horizontal.slider-rtl .slider-tick,.slider.slider-horizontal.slider-rtl .slider-handle{margin-left:initial;margin-right:-10px}.slider.slider-horizontal.slider-rtl .slider-tick-container{left:initial;right:0}.slider.slider-vertical{height:210px;width:20px}.slider.slider-vertical .slider-track{width:10px;height:100%;left:25%;top:0}.slider.slider-vertical .slider-selection{width:100%;left:0;top:0;bottom:0}.slider.slider-vertical .slider-track-low,.slider.slider-vertical .slider-track-high{width:100%;left:0;right:0}.slider.slider-vertical .slider-tick,.slider.slider-vertical .slider-handle{margin-top:-10px}.slider.slider-vertical .slider-tick.triangle,.slider.slider-vertical .slider-handle.triangle{border-width:10px 0 10px 10px;width:1px;height:1px;border-left-color:#0480be;border-right-color:#0480be;margin-left:0;margin-right:0}.slider.slider-vertical .slider-tick-label-container{white-space:nowrap}.slider.slider-vertical .slider-tick-label-container .slider-tick-label{padding-left:4px}.slider.slider-vertical.slider-rtl .slider-track{left:initial;right:25%}.slider.slider-vertical.slider-rtl .slider-selection{left:initial;right:0}.slider.slider-vertical.slider-rtl .slider-tick.triangle,.slider.slider-vertical.slider-rtl .slider-handle.triangle{border-width:10px 10px 10px 0}.slider.slider-vertical.slider-rtl .slider-tick-label-container .slider-tick-label{padding-left:initial;padding-right:4px}.slider.slider-disabled .slider-handle{background-image:-webkit-linear-gradient(top,#dfdfdf 0,#bebebe 100%);background-image:-o-linear-gradient(top,#dfdfdf 0,#bebebe 100%);background-image:linear-gradient(to bottom,#dfdfdf 0,#bebebe 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffdfdfdf\',endColorstr=\'#ffbebebe\',GradientType=0)}.slider.slider-disabled .slider-track{background-image:-webkit-linear-gradient(top,#e5e5e5 0,#e9e9e9 100%);background-image:-o-linear-gradient(top,#e5e5e5 0,#e9e9e9 100%);background-image:linear-gradient(to bottom,#e5e5e5 0,#e9e9e9 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffe5e5e5\',endColorstr=\'#ffe9e9e9\',GradientType=0);cursor:not-allowed}.slider input{display:none}.slider .tooltip.top{margin-top:-36px}.slider .tooltip-inner{white-space:nowrap;max-width:none}.slider .hide{display:none}.slider-track{position:absolute;cursor:pointer;background-image:-webkit-linear-gradient(top,#f5f5f5 0,#f9f9f9 100%);background-image:-o-linear-gradient(top,#f5f5f5 0,#f9f9f9 100%);background-image:linear-gradient(to bottom,#f5f5f5 0,#f9f9f9 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#fff5f5f5\',endColorstr=\'#fff9f9f9\',GradientType=0);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);border-radius:4px}.slider-selection{position:absolute;background-image:-webkit-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:-o-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:linear-gradient(to bottom,#f9f9f9 0,#f5f5f5 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#fff9f9f9\',endColorstr=\'#fff5f5f5\',GradientType=0);-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-radius:4px}.slider-selection.tick-slider-selection{background-image:-webkit-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:-o-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:linear-gradient(to bottom,#89cdef 0,#81bfde 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ff89cdef\',endColorstr=\'#ff81bfde\',GradientType=0)}.slider-track-low,.slider-track-high{position:absolute;background:transparent;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-radius:4px}.slider-handle{position:absolute;top:0;width:20px;height:20px;background-color:#337ab7;background-image:-webkit-linear-gradient(top,#149bdf 0,#0480be 100%);background-image:-o-linear-gradient(top,#149bdf 0,#0480be 100%);background-image:linear-gradient(to bottom,#149bdf 0,#0480be 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ff149bdf\',endColorstr=\'#ff0480be\',GradientType=0);filter:none;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);border:0 solid transparent}.slider-handle.round{border-radius:50%}.slider-handle.triangle{background:transparent none}.slider-handle.custom{background:transparent none}.slider-handle.custom::before{line-height:20px;font-size:20px;content:\'\\2605\';color:#726204}.slider-tick{position:absolute;width:20px;height:20px;background-image:-webkit-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:-o-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:linear-gradient(to bottom,#f9f9f9 0,#f5f5f5 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#fff9f9f9\',endColorstr=\'#fff5f5f5\',GradientType=0);-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;filter:none;opacity:.8;border:0 solid transparent}.slider-tick.round{border-radius:50%}.slider-tick.triangle{background:transparent none}.slider-tick.custom{background:transparent none}.slider-tick.custom::before{line-height:20px;font-size:20px;content:\'\\2605\';color:#726204}.slider-tick.in-selection{background-image:-webkit-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:-o-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:linear-gradient(to bottom,#89cdef 0,#81bfde 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ff89cdef\',endColorstr=\'#ff81bfde\',GradientType=0);opacity:1}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorStatusCell,.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable thead tr .statusHead{text-align:center}.tsCruveContainer{margin:30px 3%}.tsCruveContainer .curveConfigContainer{margin-right:0;margin-left:0}.tsCruveContainer #servoMotorTSCurve{margin:0 auto}.tsCruveContainer #servoMotorTSCurve.rightBorder{border-right:solid #d3d3d3 1px}.tsCruveContainer #servoMotorArea{margin-left:10px;padding-top:7px}#servoMotorTSCurve.widthMaxLimit{max-width:870px}.tsCruveContainer #servoMotorArea #servoMotorInfoContainer .table{margin-bottom:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer{min-width:325px;padding-left:5px;padding-right:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable{cursor:pointer;margin-bottom:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable tr td{vertical-align:middle}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorSelected{background-color:#F5F5F5}.tsCruveContainer #servoMotorArea #motorAreaAccordionContainer .motorStatusIcon.glyphicon-ok{color:green}.tsCruveContainer #servoMotorArea #motorAreaAccordionContainer .motorStatusIcon.glyphicon-remove{color:red}.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer #statusValueContainer div{padding-left:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell{padding-bottom:3px;padding-top:3px}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell .btn-info{padding-top:4px;padding-bottom:4px}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell #motorDetailsButton{display:none}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell #motorDetailsButton.btn-info-visible{display:block}.tsCruveContainer .tsPlotArea{min-height:460px}.tsCruveContainer .curveConfigContainer{min-height:40px;margin-bottom:25px;margin-top:15px}.tsCruveContainer .curveConfigContainer .tableDDContainer .tableSelectDDMenu{height:30px}.tsCruveContainer .curveConfigContainer .motorSpecContainer #motorButton{padding:2px 0 0 2px}.tsCruveContainer .curveConfigContainer .motorSpecContainer #motorButton #motorSpecButton{height:26px;width:33px}.tsCruveContainer .curveConfigContainer .plotModeContainer #plotModeToggle .selectedQuad{background-color:#E6E6E4}.tsCruveContainer .curveConfigContainer .plotModeContainer #quadrantTitle{font-weight:700}.tsCruveContainer .curveConfigContainer .plotModeContainer #quadRadioContainer{margin:12px 3px 11px}.tsCruveContainer .curveConfigContainer .plotModeContainer label{font-weight:400;cursor:pointer}.tsCruveContainer .curveConfigContainer .plotModeContainer label#quadrantTitle{font-weight:700}.tsCruveContainer .accordion-plus-minus{color:grey}.tsCruveContainer #motorStatus{padding-right:0;padding-left:0}.tsCurveFlotTip{padding:4px 10px;background-color:rgba(0,0,0,.8)!important;border:1px solid #000!important;z-index:100;font-size:12px;color:#fff;border-radius:5px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .tableRow{min-height:30px;padding:5px;margin-right:0;margin-left:0;border-bottom:solid #d3d3d3 1px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .tableHeading{min-height:30px;padding:3px;margin-right:0;margin-left:0;font-weight:700;font-size:18px;border-bottom:solid #d3d3d3 1px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .leftCol{border-right:solid #d3d3d3 1px;max-width:80px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .rightCol{max-width:80px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable{background-color:#fefefe;margin:auto;border:5px solid #888;width:40%;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.28);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.28);box-shadow:0 0 10px 5px rgba(0,0,0,.28)}.tsCruveContainer .motorSpecTable table{margin-bottom:0}.tsCruveContainer .motorSpecTable .motorTableTitle{text-align:center;color:#000;font-size:16px;font-weight:700;border-bottom:solid 2px #d3d3d3}.tsCruveContainer #motorInfoContainer{height:5px;width:1px}.tsCruveContainer #feedbackContainer #feedbackTitle{font-weight:700;padding-left:5px;font-size:18px}.tsCruveContainer #feedbackContainer .motorStatusContainer{margin-right:0}.tsCruveContainer #feedbackContainer .motorStatusContainer #motorStatusIcon{height:20px;width:20px;margin-left:5px;margin-top:1px;margin-right:10px;padding-right:0}.tsCruveContainer #feedbackContainer .motorStatusContainer #motorStatus{font-size:17px}#editConfigBtnContainer{width:100%;padding-right:30px;bottom:0;z-index:100;height:60px;position:absolute;right:0}.tsCruveContainer #motorSpecTableModal .modal-body{padding:0;border:4px solid #c3c3c3}.tsCruveContainer #servoMotorInfoContainer{display:none;width:100%;height:100%;position:absolute;z-index:101;padding-top:100px;left:0;top:0}.tsCruveContainer #servoMotorArea #motorSlider{margin-right:3px}.tsCruveContainer .tsPlotArea .legendLabel{padding:5px}.tsCruveContainer .tsPlotArea .legend table{pointer-events:none;margin:0!important;width:initial}.tsCruveContainer .tsPlotArea .legend table tr{background-color:transparent!important;border-width:0!important;margin:2px 0}.tsCruveContainer .tsPlotArea .legend table tr td{border-width:0!important;padding-top:0!important;vertical-align:middle;text-align:left!important}.slider.slider-horizontal{width:92%}.tsCruveContainer .slider-handle{width:10px;height:10px;cursor:pointer}.tsCruveContainer .slider-horizontal{cursor:pointer}.tsCruveContainer .slider.slider-horizontal .slider-track{height:2px}.tsCruveContainer .slider-tick{width:10px;height:10px}.tsCruveContainer span{font-size:11px}lable.value{font-size:10px}.solutionInfoTitle{font-size:11px}@media (min-width:1440px){.tsCruveContainer .slider-handle{width:12px;height:12px;cursor:pointer}#collapseOne .slider-tick{width:12px;height:12px}#collapseOne .slider.slider-horizontal .slider-track{height:3px}.solutionInfoTitle,.tsCruveContainer span,lable.value{font-size:14px}}@media (max-width:1024px){#servoMotorArea,#servoMotorTSCurve{width:100%;flex:inherit;max-width:100%}#collapseOne .slider-handle{width:12px;height:12px;cursor:pointer}#collapseOne .slider-tick{width:12px;height:12px}#collapseOne .slider.slider-horizontal .slider-track{height:3px}#motorAreaAccordionContainer lable.value,.solutionInfoTitle,.tsCruveContainer label.value,.tsCruveContainer span{font-size:12px}}#envFactorsPanelContainer .ui-slider,#transmissionRatioPanelContainer .ui-slider,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer .ui-slider{margin-top:4px}.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer #alertMessageContainer{display:none;margin-bottom:0}#envFactorsPanelContainer .title,#motorDataContainer .title,#transmissionRatioPanelContainer .title,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer .title{padding-right:1px;font-size:12px}#envFactorsPanelContainer label.value,#transmissionRatioPanelContainer label.value,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer label.value{font-weight:400;font-size:12px}#envFactorsPanelContainer #sliderContainer,#transmissionRatioPanelContainer #sliderContainer,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer #sliderContainer{padding-top:5px}.tsCruveContainer .motorTableTitle .closeButtonStyle{color:#333;cursor:pointer;display:inline;float:right;height:20px;margin-right:11px;text-align:center;width:20px}.tsCruveContainer .motorTableTitle .closeButtonStyle:hover{background-color:#ddd}.tsCruveContainer #motorAreaAccordionContainer .panel-heading a:hover,a:focus{text-decoration:none}.tsCruveContainer #motorAreaAccordionContainer .panel-default{margin-bottom:5px;border:1px solid #ddd;border-radius:4px}.tsCruveContainer #motorAreaAccordionContainer .panel-heading .panel-title{font-weight:500;font-size:16px;color:#000;margin-bottom:0}.tsCruveContainer #motorAreaAccordionContainer .panel-heading .panel-title a{color:#000;display:block;padding:10px 15px;margin:-10px -15px}.tsCruveContainer #sizeSlider .slider-selection{background:#BABABA}.tsCruveContainer .solutionDivider{border:1px solid #ddd;margin:20px}.tsCruveContainer .solutionInfoContainer{padding-top:8px;font-size:12px}.motorName,.solutionStatus,.tsCruveContainer .driveName,.voltageName{padding:10px}.tsCruveContainer .panelNew{background-color:#fff;border:1px solid transparent;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05);margin-bottom:0;border-radius:4px}.tsCruveContainer .panel-group .panelNew{margin-bottom:5px;border-radius:4px}.tsCruveContainer .panel-defaultNew{border-color:#ddd}.tsCruveContainer #motorAreaAccordionContainer .panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd;cursor:default}.tsCruveContainer .solutionStatus{color:#fff;font-size:10px;padding:1px 10px;margin-left:7px}.tsCruveContainer .motorPass{background-color:#64BD63}.tsCruveContainer .motorFail{background-color:#DD5826}.tsCruveContainer .accordion-plus-minus,.tsCruveContainer .accordion-plus-plus{font-size:9px}.tsCruveContainer .motorDataOpenPanle{display:block;visibility:visible}.tsCruveContainer .widgetNumberInput{height:20px;width:55%;display:inline-block;padding:0;max-width:95px}.tsCruveContainer .correct{background-color:#f0fff0;border-color:#7DC27D}.tsCruveContainer .incorrect{background-color:#fff0f0;border-color:#A90329}');

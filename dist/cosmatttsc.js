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


define('css!../../node_modules/font-awesome/css/font-awesome.min',[],function(){});

define('css!../../node_modules/bootstrap/dist/css/bootstrap.min',[],function(){});

define('css!../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min',[],function(){});

define('css!../libs/Foliojs/dist/css/Folio',[],function(){});

define('css!../libs/libs-frontend-unitLabelControl/dist/css/unitLabelControl.min',[],function(){});

define('css!../libs/libs-frontend-unitcombobox/dist/css/unitComboBox.min',[],function(){});
;
define("jquery", function(){});

/*! =======================================================
                      VERSION  9.7.1              
========================================================= */
var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},windowIsDefined="object"===("undefined"==typeof window?"undefined":_typeof(window));!function(a){if("function"==typeof define&&define.amd)define('../../node_modules/bootstrap-slider/dist/bootstrap-slider.min.js',["jquery"],a);else if("object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports){var b;try{b=require("jquery")}catch(c){b=null}module.exports=a(b)}else window&&(window.Slider=a(window.jQuery))}(function(a){var b="slider",c="bootstrapSlider";windowIsDefined&&!window.console&&(window.console={}),windowIsDefined&&!window.console.log&&(window.console.log=function(){}),windowIsDefined&&!window.console.warn&&(window.console.warn=function(){});var d;return function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l&&l!==k)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}var m=this.map(function(){var d=a.data(this,b);return d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d)),a(this)});return!m||m.length>1?m:m[0]}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;c(a)}(a),function(a){function e(b,c){function d(a,b){var c="data-slider-"+b.replace(/_/g,"-"),d=a.getAttribute(c);try{return JSON.parse(d)}catch(e){return d}}this._state={value:null,enabled:null,offset:null,size:null,percentage:null,inDrag:!1,over:!1},this.ticksCallbackMap={},this.handleCallbackMap={},"string"==typeof b?this.element=document.querySelector(b):b instanceof HTMLElement&&(this.element=b),c=c?c:{};for(var e=Object.keys(this.defaultOptions),f=0;f<e.length;f++){var h=e[f],i=c[h];i="undefined"!=typeof i?i:d(this.element,h),i=null!==i?i:this.defaultOptions[h],this.options||(this.options={}),this.options[h]=i}"auto"===this.options.rtl&&(this.options.rtl="rtl"===window.getComputedStyle(this.element).direction),"vertical"!==this.options.orientation||"top"!==this.options.tooltip_position&&"bottom"!==this.options.tooltip_position?"horizontal"!==this.options.orientation||"left"!==this.options.tooltip_position&&"right"!==this.options.tooltip_position||(this.options.tooltip_position="top"):this.options.rtl?this.options.tooltip_position="left":this.options.tooltip_position="right";var j,k,l,m,n,o=this.element.style.width,p=!1,q=this.element.parentNode;if(this.sliderElem)p=!0;else{this.sliderElem=document.createElement("div"),this.sliderElem.className="slider";var r=document.createElement("div");if(r.className="slider-track",k=document.createElement("div"),k.className="slider-track-low",j=document.createElement("div"),j.className="slider-selection",l=document.createElement("div"),l.className="slider-track-high",m=document.createElement("div"),m.className="slider-handle min-slider-handle",m.setAttribute("role","slider"),m.setAttribute("aria-valuemin",this.options.min),m.setAttribute("aria-valuemax",this.options.max),n=document.createElement("div"),n.className="slider-handle max-slider-handle",n.setAttribute("role","slider"),n.setAttribute("aria-valuemin",this.options.min),n.setAttribute("aria-valuemax",this.options.max),r.appendChild(k),r.appendChild(j),r.appendChild(l),this.rangeHighlightElements=[],Array.isArray(this.options.rangeHighlights)&&this.options.rangeHighlights.length>0)for(var s=0;s<this.options.rangeHighlights.length;s++){var t=document.createElement("div");t.className="slider-rangeHighlight slider-selection",this.rangeHighlightElements.push(t),r.appendChild(t)}var u=Array.isArray(this.options.labelledby);if(u&&this.options.labelledby[0]&&m.setAttribute("aria-labelledby",this.options.labelledby[0]),u&&this.options.labelledby[1]&&n.setAttribute("aria-labelledby",this.options.labelledby[1]),!u&&this.options.labelledby&&(m.setAttribute("aria-labelledby",this.options.labelledby),n.setAttribute("aria-labelledby",this.options.labelledby)),this.ticks=[],Array.isArray(this.options.ticks)&&this.options.ticks.length>0){for(this.ticksContainer=document.createElement("div"),this.ticksContainer.className="slider-tick-container",f=0;f<this.options.ticks.length;f++){var v=document.createElement("div");if(v.className="slider-tick",this.options.ticks_tooltip){var w=this._addTickListener(),x=w.addMouseEnter(this,v,f),y=w.addMouseLeave(this,v);this.ticksCallbackMap[f]={mouseEnter:x,mouseLeave:y}}this.ticks.push(v),this.ticksContainer.appendChild(v)}j.className+=" tick-slider-selection"}if(this.tickLabels=[],Array.isArray(this.options.ticks_labels)&&this.options.ticks_labels.length>0)for(this.tickLabelContainer=document.createElement("div"),this.tickLabelContainer.className="slider-tick-label-container",f=0;f<this.options.ticks_labels.length;f++){var z=document.createElement("div"),A=0===this.options.ticks_positions.length,B=this.options.reversed&&A?this.options.ticks_labels.length-(f+1):f;z.className="slider-tick-label",z.innerHTML=this.options.ticks_labels[B],this.tickLabels.push(z),this.tickLabelContainer.appendChild(z)}var C=function(a){var b=document.createElement("div");b.className="tooltip-arrow";var c=document.createElement("div");c.className="tooltip-inner",a.appendChild(b),a.appendChild(c)},D=document.createElement("div");D.className="tooltip tooltip-main",D.setAttribute("role","presentation"),C(D);var E=document.createElement("div");E.className="tooltip tooltip-min",E.setAttribute("role","presentation"),C(E);var F=document.createElement("div");F.className="tooltip tooltip-max",F.setAttribute("role","presentation"),C(F),this.sliderElem.appendChild(r),this.sliderElem.appendChild(D),this.sliderElem.appendChild(E),this.sliderElem.appendChild(F),this.tickLabelContainer&&this.sliderElem.appendChild(this.tickLabelContainer),this.ticksContainer&&this.sliderElem.appendChild(this.ticksContainer),this.sliderElem.appendChild(m),this.sliderElem.appendChild(n),q.insertBefore(this.sliderElem,this.element),this.element.style.display="none"}if(a&&(this.$element=a(this.element),this.$sliderElem=a(this.sliderElem)),this.eventToCallbackMap={},this.sliderElem.id=this.options.id,this.touchCapable="ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch,this.touchX=0,this.touchY=0,this.tooltip=this.sliderElem.querySelector(".tooltip-main"),this.tooltipInner=this.tooltip.querySelector(".tooltip-inner"),this.tooltip_min=this.sliderElem.querySelector(".tooltip-min"),this.tooltipInner_min=this.tooltip_min.querySelector(".tooltip-inner"),this.tooltip_max=this.sliderElem.querySelector(".tooltip-max"),this.tooltipInner_max=this.tooltip_max.querySelector(".tooltip-inner"),g[this.options.scale]&&(this.options.scale=g[this.options.scale]),p===!0&&(this._removeClass(this.sliderElem,"slider-horizontal"),this._removeClass(this.sliderElem,"slider-vertical"),this._removeClass(this.sliderElem,"slider-rtl"),this._removeClass(this.tooltip,"hide"),this._removeClass(this.tooltip_min,"hide"),this._removeClass(this.tooltip_max,"hide"),["left","right","top","width","height"].forEach(function(a){this._removeProperty(this.trackLow,a),this._removeProperty(this.trackSelection,a),this._removeProperty(this.trackHigh,a)},this),[this.handle1,this.handle2].forEach(function(a){this._removeProperty(a,"left"),this._removeProperty(a,"right"),this._removeProperty(a,"top")},this),[this.tooltip,this.tooltip_min,this.tooltip_max].forEach(function(a){this._removeProperty(a,"left"),this._removeProperty(a,"right"),this._removeProperty(a,"top"),this._removeProperty(a,"margin-left"),this._removeProperty(a,"margin-right"),this._removeProperty(a,"margin-top"),this._removeClass(a,"right"),this._removeClass(a,"left"),this._removeClass(a,"top")},this)),"vertical"===this.options.orientation?(this._addClass(this.sliderElem,"slider-vertical"),this.stylePos="top",this.mousePos="pageY",this.sizePos="offsetHeight"):(this._addClass(this.sliderElem,"slider-horizontal"),this.sliderElem.style.width=o,this.options.orientation="horizontal",this.options.rtl?this.stylePos="right":this.stylePos="left",this.mousePos="pageX",this.sizePos="offsetWidth"),this.options.rtl&&this._addClass(this.sliderElem,"slider-rtl"),this._setTooltipPosition(),Array.isArray(this.options.ticks)&&this.options.ticks.length>0&&(this.options.max=Math.max.apply(Math,this.options.ticks),this.options.min=Math.min.apply(Math,this.options.ticks)),Array.isArray(this.options.value)?(this.options.range=!0,this._state.value=this.options.value):this.options.range?this._state.value=[this.options.value,this.options.max]:this._state.value=this.options.value,this.trackLow=k||this.trackLow,this.trackSelection=j||this.trackSelection,this.trackHigh=l||this.trackHigh,"none"===this.options.selection?(this._addClass(this.trackLow,"hide"),this._addClass(this.trackSelection,"hide"),this._addClass(this.trackHigh,"hide")):("after"===this.options.selection||"before"===this.options.selection)&&(this._removeClass(this.trackLow,"hide"),this._removeClass(this.trackSelection,"hide"),this._removeClass(this.trackHigh,"hide")),this.handle1=m||this.handle1,this.handle2=n||this.handle2,p===!0)for(this._removeClass(this.handle1,"round triangle"),this._removeClass(this.handle2,"round triangle hide"),f=0;f<this.ticks.length;f++)this._removeClass(this.ticks[f],"round triangle hide");var G=["round","triangle","custom"],H=-1!==G.indexOf(this.options.handle);if(H)for(this._addClass(this.handle1,this.options.handle),this._addClass(this.handle2,this.options.handle),f=0;f<this.ticks.length;f++)this._addClass(this.ticks[f],this.options.handle);if(this._state.offset=this._offset(this.sliderElem),this._state.size=this.sliderElem[this.sizePos],this.setValue(this._state.value),this.handle1Keydown=this._keydown.bind(this,0),this.handle1.addEventListener("keydown",this.handle1Keydown,!1),this.handle2Keydown=this._keydown.bind(this,1),this.handle2.addEventListener("keydown",this.handle2Keydown,!1),this.mousedown=this._mousedown.bind(this),this.touchstart=this._touchstart.bind(this),this.touchmove=this._touchmove.bind(this),this.touchCapable){var I=!1;try{var J=Object.defineProperty({},"passive",{get:function(){I=!0}});window.addEventListener("test",null,J)}catch(K){}var L=I?{passive:!0}:!1;this.sliderElem.addEventListener("touchstart",this.touchstart,L),this.sliderElem.addEventListener("touchmove",this.touchmove,L)}if(this.sliderElem.addEventListener("mousedown",this.mousedown,!1),this.resize=this._resize.bind(this),window.addEventListener("resize",this.resize,!1),"hide"===this.options.tooltip)this._addClass(this.tooltip,"hide"),this._addClass(this.tooltip_min,"hide"),this._addClass(this.tooltip_max,"hide");else if("always"===this.options.tooltip)this._showTooltip(),this._alwaysShowTooltip=!0;else{if(this.showTooltip=this._showTooltip.bind(this),this.hideTooltip=this._hideTooltip.bind(this),this.options.ticks_tooltip){var M=this._addTickListener(),N=M.addMouseEnter(this,this.handle1),O=M.addMouseLeave(this,this.handle1);this.handleCallbackMap.handle1={mouseEnter:N,mouseLeave:O},N=M.addMouseEnter(this,this.handle2),O=M.addMouseLeave(this,this.handle2),this.handleCallbackMap.handle2={mouseEnter:N,mouseLeave:O}}else this.sliderElem.addEventListener("mouseenter",this.showTooltip,!1),this.sliderElem.addEventListener("mouseleave",this.hideTooltip,!1);this.handle1.addEventListener("focus",this.showTooltip,!1),this.handle1.addEventListener("blur",this.hideTooltip,!1),this.handle2.addEventListener("focus",this.showTooltip,!1),this.handle2.addEventListener("blur",this.hideTooltip,!1)}this.options.enabled?this.enable():this.disable()}var f={formatInvalidInputErrorMsg:function(a){return"Invalid input value '"+a+"' passed in"},callingContextNotSliderInstance:"Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"},g={linear:{toValue:function(a){var b=a/100*(this.options.max-this.options.min),c=!0;if(this.options.ticks_positions.length>0){for(var d,e,f,g=0,h=1;h<this.options.ticks_positions.length;h++)if(a<=this.options.ticks_positions[h]){d=this.options.ticks[h-1],f=this.options.ticks_positions[h-1],e=this.options.ticks[h],g=this.options.ticks_positions[h];break}var i=(a-f)/(g-f);b=d+i*(e-d),c=!1}var j=c?this.options.min:0,k=j+Math.round(b/this.options.step)*this.options.step;return k<this.options.min?this.options.min:k>this.options.max?this.options.max:k},toPercentage:function(a){if(this.options.max===this.options.min)return 0;if(this.options.ticks_positions.length>0){for(var b,c,d,e=0,f=0;f<this.options.ticks.length;f++)if(a<=this.options.ticks[f]){b=f>0?this.options.ticks[f-1]:0,d=f>0?this.options.ticks_positions[f-1]:0,c=this.options.ticks[f],e=this.options.ticks_positions[f];break}if(f>0){var g=(a-b)/(c-b);return d+g*(e-d)}}return 100*(a-this.options.min)/(this.options.max-this.options.min)}},logarithmic:{toValue:function(a){var b=0===this.options.min?0:Math.log(this.options.min),c=Math.log(this.options.max),d=Math.exp(b+(c-b)*a/100);return d=this.options.min+Math.round((d-this.options.min)/this.options.step)*this.options.step,d<this.options.min?this.options.min:d>this.options.max?this.options.max:d},toPercentage:function(a){if(this.options.max===this.options.min)return 0;var b=Math.log(this.options.max),c=0===this.options.min?0:Math.log(this.options.min),d=0===a?0:Math.log(a);return 100*(d-c)/(b-c)}}};d=function(a,b){return e.call(this,a,b),this},d.prototype={_init:function(){},constructor:d,defaultOptions:{id:"",min:0,max:10,step:1,precision:0,orientation:"horizontal",value:5,range:!1,selection:"before",tooltip:"show",tooltip_split:!1,handle:"round",reversed:!1,rtl:"auto",enabled:!0,formatter:function(a){return Array.isArray(a)?a[0]+" : "+a[1]:a},natural_arrow_keys:!1,ticks:[],ticks_positions:[],ticks_labels:[],ticks_snap_bounds:0,ticks_tooltip:!1,scale:"linear",focus:!1,tooltip_position:null,labelledby:null,rangeHighlights:[]},getElement:function(){return this.sliderElem},getValue:function(){return this.options.range?this._state.value:this._state.value[0]},setValue:function(a,b,c){a||(a=0);var d=this.getValue();this._state.value=this._validateInputValue(a);var e=this._applyPrecision.bind(this);this.options.range?(this._state.value[0]=e(this._state.value[0]),this._state.value[1]=e(this._state.value[1]),this._state.value[0]=Math.max(this.options.min,Math.min(this.options.max,this._state.value[0])),this._state.value[1]=Math.max(this.options.min,Math.min(this.options.max,this._state.value[1]))):(this._state.value=e(this._state.value),this._state.value=[Math.max(this.options.min,Math.min(this.options.max,this._state.value))],this._addClass(this.handle2,"hide"),"after"===this.options.selection?this._state.value[1]=this.options.max:this._state.value[1]=this.options.min),this.options.max>this.options.min?this._state.percentage=[this._toPercentage(this._state.value[0]),this._toPercentage(this._state.value[1]),100*this.options.step/(this.options.max-this.options.min)]:this._state.percentage=[0,0,100],this._layout();var f=this.options.range?this._state.value:this._state.value[0];return this._setDataVal(f),b===!0&&this._trigger("slide",f),d!==f&&c===!0&&this._trigger("change",{oldValue:d,newValue:f}),this},destroy:function(){this._removeSliderEventHandlers(),this.sliderElem.parentNode.removeChild(this.sliderElem),this.element.style.display="",this._cleanUpEventCallbacksMap(),this.element.removeAttribute("data"),a&&(this._unbindJQueryEventHandlers(),this.$element.removeData("slider"))},disable:function(){return this._state.enabled=!1,this.handle1.removeAttribute("tabindex"),this.handle2.removeAttribute("tabindex"),this._addClass(this.sliderElem,"slider-disabled"),this._trigger("slideDisabled"),this},enable:function(){return this._state.enabled=!0,this.handle1.setAttribute("tabindex",0),this.handle2.setAttribute("tabindex",0),this._removeClass(this.sliderElem,"slider-disabled"),this._trigger("slideEnabled"),this},toggle:function(){return this._state.enabled?this.disable():this.enable(),this},isEnabled:function(){return this._state.enabled},on:function(a,b){return this._bindNonQueryEventHandler(a,b),this},off:function(b,c){a?(this.$element.off(b,c),this.$sliderElem.off(b,c)):this._unbindNonQueryEventHandler(b,c)},getAttribute:function(a){return a?this.options[a]:this.options},setAttribute:function(a,b){return this.options[a]=b,this},refresh:function(){return this._removeSliderEventHandlers(),e.call(this,this.element,this.options),a&&a.data(this.element,"slider",this),this},relayout:function(){return this._resize(),this._layout(),this},_removeSliderEventHandlers:function(){if(this.handle1.removeEventListener("keydown",this.handle1Keydown,!1),this.handle2.removeEventListener("keydown",this.handle2Keydown,!1),this.options.ticks_tooltip){for(var a=this.ticksContainer.getElementsByClassName("slider-tick"),b=0;b<a.length;b++)a[b].removeEventListener("mouseenter",this.ticksCallbackMap[b].mouseEnter,!1),a[b].removeEventListener("mouseleave",this.ticksCallbackMap[b].mouseLeave,!1);this.handle1.removeEventListener("mouseenter",this.handleCallbackMap.handle1.mouseEnter,!1),this.handle2.removeEventListener("mouseenter",this.handleCallbackMap.handle2.mouseEnter,!1),this.handle1.removeEventListener("mouseleave",this.handleCallbackMap.handle1.mouseLeave,!1),this.handle2.removeEventListener("mouseleave",this.handleCallbackMap.handle2.mouseLeave,!1)}this.handleCallbackMap=null,this.ticksCallbackMap=null,this.showTooltip&&(this.handle1.removeEventListener("focus",this.showTooltip,!1),this.handle2.removeEventListener("focus",this.showTooltip,!1)),this.hideTooltip&&(this.handle1.removeEventListener("blur",this.hideTooltip,!1),this.handle2.removeEventListener("blur",this.hideTooltip,!1)),this.showTooltip&&this.sliderElem.removeEventListener("mouseenter",this.showTooltip,!1),this.hideTooltip&&this.sliderElem.removeEventListener("mouseleave",this.hideTooltip,!1),this.sliderElem.removeEventListener("touchstart",this.touchstart,!1),this.sliderElem.removeEventListener("touchmove",this.touchmove,!1),this.sliderElem.removeEventListener("mousedown",this.mousedown,!1),window.removeEventListener("resize",this.resize,!1)},_bindNonQueryEventHandler:function(a,b){void 0===this.eventToCallbackMap[a]&&(this.eventToCallbackMap[a]=[]),this.eventToCallbackMap[a].push(b)},_unbindNonQueryEventHandler:function(a,b){var c=this.eventToCallbackMap[a];if(void 0!==c)for(var d=0;d<c.length;d++)if(c[d]===b){c.splice(d,1);break}},_cleanUpEventCallbacksMap:function(){for(var a=Object.keys(this.eventToCallbackMap),b=0;b<a.length;b++){var c=a[b];delete this.eventToCallbackMap[c]}},_showTooltip:function(){this.options.tooltip_split===!1?(this._addClass(this.tooltip,"in"),this.tooltip_min.style.display="none",this.tooltip_max.style.display="none"):(this._addClass(this.tooltip_min,"in"),this._addClass(this.tooltip_max,"in"),this.tooltip.style.display="none"),this._state.over=!0},_hideTooltip:function(){this._state.inDrag===!1&&this.alwaysShowTooltip!==!0&&(this._removeClass(this.tooltip,"in"),this._removeClass(this.tooltip_min,"in"),this._removeClass(this.tooltip_max,"in")),this._state.over=!1},_setToolTipOnMouseOver:function(a){function b(a,b){return b?[100-a.percentage[0],this.options.range?100-a.percentage[1]:a.percentage[1]]:[a.percentage[0],a.percentage[1]]}var c=this.options.formatter(a?a.value[0]:this._state.value[0]),d=a?b(a,this.options.reversed):b(this._state,this.options.reversed);this._setText(this.tooltipInner,c),this.tooltip.style[this.stylePos]=d[0]+"%","vertical"===this.options.orientation?this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetHeight/2+"px"):this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetWidth/2+"px")},_addTickListener:function(){return{addMouseEnter:function(a,b,c){var d=function(){var b=a._state,d=c>=0?c:this.attributes["aria-valuenow"].value,e=parseInt(d,10);b.value[0]=e,b.percentage[0]=a.options.ticks_positions[e],a._setToolTipOnMouseOver(b),a._showTooltip()};return b.addEventListener("mouseenter",d,!1),d},addMouseLeave:function(a,b){var c=function(){a._hideTooltip()};return b.addEventListener("mouseleave",c,!1),c}}},_layout:function(){var a;if(a=this.options.reversed?[100-this._state.percentage[0],this.options.range?100-this._state.percentage[1]:this._state.percentage[1]]:[this._state.percentage[0],this._state.percentage[1]],this.handle1.style[this.stylePos]=a[0]+"%",this.handle1.setAttribute("aria-valuenow",this._state.value[0]),isNaN(this.options.formatter(this._state.value[0]))&&this.handle1.setAttribute("aria-valuetext",this.options.formatter(this._state.value[0])),this.handle2.style[this.stylePos]=a[1]+"%",this.handle2.setAttribute("aria-valuenow",this._state.value[1]),isNaN(this.options.formatter(this._state.value[1]))&&this.handle2.setAttribute("aria-valuetext",this.options.formatter(this._state.value[1])),this.rangeHighlightElements.length>0&&Array.isArray(this.options.rangeHighlights)&&this.options.rangeHighlights.length>0)for(var b=0;b<this.options.rangeHighlights.length;b++){var c=this._toPercentage(this.options.rangeHighlights[b].start),d=this._toPercentage(this.options.rangeHighlights[b].end);if(this.options.reversed){var e=100-d;d=100-c,c=e}var f=this._createHighlightRange(c,d);f?"vertical"===this.options.orientation?(this.rangeHighlightElements[b].style.top=f.start+"%",this.rangeHighlightElements[b].style.height=f.size+"%"):(this.options.rtl?this.rangeHighlightElements[b].style.right=f.start+"%":this.rangeHighlightElements[b].style.left=f.start+"%",this.rangeHighlightElements[b].style.width=f.size+"%"):this.rangeHighlightElements[b].style.display="none"}if(Array.isArray(this.options.ticks)&&this.options.ticks.length>0){var g,h="vertical"===this.options.orientation?"height":"width";g="vertical"===this.options.orientation?"marginTop":this.options.rtl?"marginRight":"marginLeft";var i=this._state.size/(this.options.ticks.length-1);if(this.tickLabelContainer){var j=0;if(0===this.options.ticks_positions.length)"vertical"!==this.options.orientation&&(this.tickLabelContainer.style[g]=-i/2+"px"),j=this.tickLabelContainer.offsetHeight;else for(k=0;k<this.tickLabelContainer.childNodes.length;k++)this.tickLabelContainer.childNodes[k].offsetHeight>j&&(j=this.tickLabelContainer.childNodes[k].offsetHeight);"horizontal"===this.options.orientation&&(this.sliderElem.style.marginBottom=j+"px")}for(var k=0;k<this.options.ticks.length;k++){var l=this.options.ticks_positions[k]||this._toPercentage(this.options.ticks[k]);this.options.reversed&&(l=100-l),this.ticks[k].style[this.stylePos]=l+"%",this._removeClass(this.ticks[k],"in-selection"),this.options.range?l>=a[0]&&l<=a[1]&&this._addClass(this.ticks[k],"in-selection"):"after"===this.options.selection&&l>=a[0]?this._addClass(this.ticks[k],"in-selection"):"before"===this.options.selection&&l<=a[0]&&this._addClass(this.ticks[k],"in-selection"),this.tickLabels[k]&&(this.tickLabels[k].style[h]=i+"px","vertical"!==this.options.orientation&&void 0!==this.options.ticks_positions[k]?(this.tickLabels[k].style.position="absolute",this.tickLabels[k].style[this.stylePos]=l+"%",this.tickLabels[k].style[g]=-i/2+"px"):"vertical"===this.options.orientation&&(this.options.rtl?this.tickLabels[k].style.marginRight=this.sliderElem.offsetWidth+"px":this.tickLabels[k].style.marginLeft=this.sliderElem.offsetWidth+"px",this.tickLabelContainer.style[g]=this.sliderElem.offsetWidth/2*-1+"px"))}}var m;if(this.options.range){m=this.options.formatter(this._state.value),this._setText(this.tooltipInner,m),this.tooltip.style[this.stylePos]=(a[1]+a[0])/2+"%","vertical"===this.options.orientation?this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetHeight/2+"px"):this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetWidth/2+"px");var n=this.options.formatter(this._state.value[0]);this._setText(this.tooltipInner_min,n);var o=this.options.formatter(this._state.value[1]);this._setText(this.tooltipInner_max,o),this.tooltip_min.style[this.stylePos]=a[0]+"%","vertical"===this.options.orientation?this._css(this.tooltip_min,"margin-"+this.stylePos,-this.tooltip_min.offsetHeight/2+"px"):this._css(this.tooltip_min,"margin-"+this.stylePos,-this.tooltip_min.offsetWidth/2+"px"),this.tooltip_max.style[this.stylePos]=a[1]+"%","vertical"===this.options.orientation?this._css(this.tooltip_max,"margin-"+this.stylePos,-this.tooltip_max.offsetHeight/2+"px"):this._css(this.tooltip_max,"margin-"+this.stylePos,-this.tooltip_max.offsetWidth/2+"px")}else m=this.options.formatter(this._state.value[0]),this._setText(this.tooltipInner,m),this.tooltip.style[this.stylePos]=a[0]+"%","vertical"===this.options.orientation?this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetHeight/2+"px"):this._css(this.tooltip,"margin-"+this.stylePos,-this.tooltip.offsetWidth/2+"px");if("vertical"===this.options.orientation)this.trackLow.style.top="0",this.trackLow.style.height=Math.min(a[0],a[1])+"%",this.trackSelection.style.top=Math.min(a[0],a[1])+"%",this.trackSelection.style.height=Math.abs(a[0]-a[1])+"%",this.trackHigh.style.bottom="0",this.trackHigh.style.height=100-Math.min(a[0],a[1])-Math.abs(a[0]-a[1])+"%";else{"right"===this.stylePos?this.trackLow.style.right="0":this.trackLow.style.left="0",this.trackLow.style.width=Math.min(a[0],a[1])+"%","right"===this.stylePos?this.trackSelection.style.right=Math.min(a[0],a[1])+"%":this.trackSelection.style.left=Math.min(a[0],a[1])+"%",this.trackSelection.style.width=Math.abs(a[0]-a[1])+"%","right"===this.stylePos?this.trackHigh.style.left="0":this.trackHigh.style.right="0",this.trackHigh.style.width=100-Math.min(a[0],a[1])-Math.abs(a[0]-a[1])+"%";var p=this.tooltip_min.getBoundingClientRect(),q=this.tooltip_max.getBoundingClientRect();"bottom"===this.options.tooltip_position?p.right>q.left?(this._removeClass(this.tooltip_max,"bottom"),this._addClass(this.tooltip_max,"top"),this.tooltip_max.style.top="",this.tooltip_max.style.bottom="22px"):(this._removeClass(this.tooltip_max,"top"),this._addClass(this.tooltip_max,"bottom"),this.tooltip_max.style.top=this.tooltip_min.style.top,this.tooltip_max.style.bottom=""):p.right>q.left?(this._removeClass(this.tooltip_max,"top"),this._addClass(this.tooltip_max,"bottom"),this.tooltip_max.style.top="18px"):(this._removeClass(this.tooltip_max,"bottom"),this._addClass(this.tooltip_max,"top"),this.tooltip_max.style.top=this.tooltip_min.style.top)}},_createHighlightRange:function(a,b){return this._isHighlightRange(a,b)?a>b?{start:b,size:a-b}:{start:a,size:b-a}:null},_isHighlightRange:function(a,b){return a>=0&&100>=a&&b>=0&&100>=b?!0:!1},_resize:function(a){this._state.offset=this._offset(this.sliderElem),this._state.size=this.sliderElem[this.sizePos],this._layout()},_removeProperty:function(a,b){a.style.removeProperty?a.style.removeProperty(b):a.style.removeAttribute(b)},_mousedown:function(a){if(!this._state.enabled)return!1;this._state.offset=this._offset(this.sliderElem),this._state.size=this.sliderElem[this.sizePos];var b=this._getPercentage(a);if(this.options.range){var c=Math.abs(this._state.percentage[0]-b),d=Math.abs(this._state.percentage[1]-b);this._state.dragged=d>c?0:1,this._adjustPercentageForRangeSliders(b)}else this._state.dragged=0;this._state.percentage[this._state.dragged]=b,this._layout(),this.touchCapable&&(document.removeEventListener("touchmove",this.mousemove,!1),document.removeEventListener("touchend",this.mouseup,!1)),this.mousemove&&document.removeEventListener("mousemove",this.mousemove,!1),this.mouseup&&document.removeEventListener("mouseup",this.mouseup,!1),this.mousemove=this._mousemove.bind(this),this.mouseup=this._mouseup.bind(this),this.touchCapable&&(document.addEventListener("touchmove",this.mousemove,!1),document.addEventListener("touchend",this.mouseup,!1)),document.addEventListener("mousemove",this.mousemove,!1),document.addEventListener("mouseup",this.mouseup,!1),this._state.inDrag=!0;var e=this._calculateValue();return this._trigger("slideStart",e),this._setDataVal(e),this.setValue(e,!1,!0),a.returnValue=!1,this.options.focus&&this._triggerFocusOnHandle(this._state.dragged),!0},_touchstart:function(a){if(void 0===a.changedTouches)return void this._mousedown(a);var b=a.changedTouches[0];this.touchX=b.pageX,this.touchY=b.pageY},_triggerFocusOnHandle:function(a){0===a&&this.handle1.focus(),1===a&&this.handle2.focus()},_keydown:function(a,b){if(!this._state.enabled)return!1;var c;switch(b.keyCode){case 37:case 40:c=-1;break;case 39:case 38:c=1}if(c){if(this.options.natural_arrow_keys){var d="vertical"===this.options.orientation&&!this.options.reversed,e="horizontal"===this.options.orientation&&this.options.reversed;(d||e)&&(c=-c)}var f=this._state.value[a]+c*this.options.step;return this.options.range&&(f=[a?this._state.value[0]:f,a?f:this._state.value[1]]),this._trigger("slideStart",f),this._setDataVal(f),this.setValue(f,!0,!0),this._setDataVal(f),this._trigger("slideStop",f),this._layout(),this._pauseEvent(b),!1}},_pauseEvent:function(a){a.stopPropagation&&a.stopPropagation(),a.preventDefault&&a.preventDefault(),a.cancelBubble=!0,a.returnValue=!1},_mousemove:function(a){if(!this._state.enabled)return!1;var b=this._getPercentage(a);this._adjustPercentageForRangeSliders(b),this._state.percentage[this._state.dragged]=b,this._layout();var c=this._calculateValue(!0);return this.setValue(c,!0,!0),!1},_touchmove:function(a){if(void 0!==a.changedTouches){var b=a.changedTouches[0],c=b.pageX-this.touchX,d=b.pageY-this.touchY;this._state.inDrag||("vertical"===this.options.orientation&&5>=c&&c>=-5&&(d>=15||-15>=d)?this._mousedown(a):5>=d&&d>=-5&&(c>=15||-15>=c)&&this._mousedown(a))}},_adjustPercentageForRangeSliders:function(a){if(this.options.range){var b=this._getNumDigitsAfterDecimalPlace(a);b=b?b-1:0;var c=this._applyToFixedAndParseFloat(a,b);0===this._state.dragged&&this._applyToFixedAndParseFloat(this._state.percentage[1],b)<c?(this._state.percentage[0]=this._state.percentage[1],this._state.dragged=1):1===this._state.dragged&&this._applyToFixedAndParseFloat(this._state.percentage[0],b)>c&&(this._state.percentage[1]=this._state.percentage[0],this._state.dragged=0)}},_mouseup:function(){if(!this._state.enabled)return!1;this.touchCapable&&(document.removeEventListener("touchmove",this.mousemove,!1),document.removeEventListener("touchend",this.mouseup,!1)),document.removeEventListener("mousemove",this.mousemove,!1),document.removeEventListener("mouseup",this.mouseup,!1),this._state.inDrag=!1,this._state.over===!1&&this._hideTooltip();var a=this._calculateValue(!0);return this._layout(),this._setDataVal(a),this._trigger("slideStop",a),!1},_calculateValue:function(a){var b;if(this.options.range?(b=[this.options.min,this.options.max],0!==this._state.percentage[0]&&(b[0]=this._toValue(this._state.percentage[0]),b[0]=this._applyPrecision(b[0])),100!==this._state.percentage[1]&&(b[1]=this._toValue(this._state.percentage[1]),b[1]=this._applyPrecision(b[1]))):(b=this._toValue(this._state.percentage[0]),b=parseFloat(b),b=this._applyPrecision(b)),a){for(var c=[b,1/0],d=0;d<this.options.ticks.length;d++){var e=Math.abs(this.options.ticks[d]-b);e<=c[1]&&(c=[this.options.ticks[d],e])}if(c[1]<=this.options.ticks_snap_bounds)return c[0]}return b},_applyPrecision:function(a){var b=this.options.precision||this._getNumDigitsAfterDecimalPlace(this.options.step);return this._applyToFixedAndParseFloat(a,b)},_getNumDigitsAfterDecimalPlace:function(a){var b=(""+a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return b?Math.max(0,(b[1]?b[1].length:0)-(b[2]?+b[2]:0)):0},_applyToFixedAndParseFloat:function(a,b){
var c=a.toFixed(b);return parseFloat(c)},_getPercentage:function(a){!this.touchCapable||"touchstart"!==a.type&&"touchmove"!==a.type||(a=a.touches[0]);var b=a[this.mousePos],c=this._state.offset[this.stylePos],d=b-c;"right"===this.stylePos&&(d=-d);var e=d/this._state.size*100;return e=Math.round(e/this._state.percentage[2])*this._state.percentage[2],this.options.reversed&&(e=100-e),Math.max(0,Math.min(100,e))},_validateInputValue:function(a){if(isNaN(+a)){if(Array.isArray(a))return this._validateArray(a),a;throw new Error(f.formatInvalidInputErrorMsg(a))}return+a},_validateArray:function(a){for(var b=0;b<a.length;b++){var c=a[b];if("number"!=typeof c)throw new Error(f.formatInvalidInputErrorMsg(c))}},_setDataVal:function(a){this.element.setAttribute("data-value",a),this.element.setAttribute("value",a),this.element.value=a},_trigger:function(b,c){c=c||0===c?c:void 0;var d=this.eventToCallbackMap[b];if(d&&d.length)for(var e=0;e<d.length;e++){var f=d[e];f(c)}a&&this._triggerJQueryEvent(b,c)},_triggerJQueryEvent:function(a,b){var c={type:a,value:b};this.$element.trigger(c),this.$sliderElem.trigger(c)},_unbindJQueryEventHandlers:function(){this.$element.off(),this.$sliderElem.off()},_setText:function(a,b){"undefined"!=typeof a.textContent?a.textContent=b:"undefined"!=typeof a.innerText&&(a.innerText=b)},_removeClass:function(a,b){for(var c=b.split(" "),d=a.className,e=0;e<c.length;e++){var f=c[e],g=new RegExp("(?:\\s|^)"+f+"(?:\\s|$)");d=d.replace(g," ")}a.className=d.trim()},_addClass:function(a,b){for(var c=b.split(" "),d=a.className,e=0;e<c.length;e++){var f=c[e],g=new RegExp("(?:\\s|^)"+f+"(?:\\s|$)"),h=g.test(d);h||(d+=" "+f)}a.className=d.trim()},_offsetLeft:function(a){return a.getBoundingClientRect().left},_offsetRight:function(a){return a.getBoundingClientRect().right},_offsetTop:function(a){for(var b=a.offsetTop;(a=a.offsetParent)&&!isNaN(a.offsetTop);)b+=a.offsetTop,"BODY"!==a.tagName&&(b-=a.scrollTop);return b},_offset:function(a){return{left:this._offsetLeft(a),right:this._offsetRight(a),top:this._offsetTop(a)}},_css:function(b,c,d){if(a)a.style(b,c,d);else{var e=c.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(a,b){return b.toUpperCase()});b.style[e]=d}},_toValue:function(a){return this.options.scale.toValue.apply(this,[a])},_toPercentage:function(a){return this.options.scale.toPercentage.apply(this,[a])},_setTooltipPosition:function(){var a=[this.tooltip,this.tooltip_min,this.tooltip_max];if("vertical"===this.options.orientation){var b;b=this.options.tooltip_position?this.options.tooltip_position:this.options.rtl?"left":"right";var c="left"===b?"right":"left";a.forEach(function(a){this._addClass(a,b),a.style[c]="100%"}.bind(this))}else"bottom"===this.options.tooltip_position?a.forEach(function(a){this._addClass(a,"bottom"),a.style.top="22px"}.bind(this)):a.forEach(function(a){this._addClass(a,"top"),a.style.top=-this.tooltip.outerHeight-14+"px"}.bind(this))}},a&&a.fn&&!function(){var e=void 0;a.fn.slider?(windowIsDefined&&window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."),e=c):(a.bridget(b,d),e=b),a.bridget(c,d),a(function(){a("input[data-provide=slider]")[e]()})}()}(a),d});
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

define("../../node_modules/jquery-flot/jquery.flot.js", function(){});

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

define("../../node_modules/jquery-flot/jquery.flot.resize.js", function(){});

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

define("../../node_modules/flot-axislabels/jquery.flot.axislabels.js", function(){});

/*
 * jquery.flot.tooltip
 * 
 * description: easy-to-use tooltips for Flot charts
 * version: 0.9.0
 * authors: Krzysztof Urbas @krzysu [myviews.pl],Evan Steinkerchner @Roundaround
 * website: https://github.com/krzysu/flot.tooltip
 * 
 * build on 2016-07-26
 * released under MIT License, 2012
*/ 
(function ($) {
    // plugin options, default values
    var defaultOptions = {
        tooltip: {
            show: false,
            cssClass: "flotTip",
            content: "%s | X: %x | Y: %y",
            // allowed templates are:
            // %s -> series label,
            // %c -> series color,
            // %lx -> x axis label (requires flot-axislabels plugin https://github.com/markrcote/flot-axislabels),
            // %ly -> y axis label (requires flot-axislabels plugin https://github.com/markrcote/flot-axislabels),
            // %x -> X value,
            // %y -> Y value,
            // %x.2 -> precision of X value,
            // %p -> percent
            // %n -> value (not percent) of pie chart
            xDateFormat: null,
            yDateFormat: null,
            monthNames: null,
            dayNames: null,
            shifts: {
                x: 10,
                y: 20
            },
            defaultTheme: true,
            snap: true,
            lines: false,
            clickTips: false,

            // callbacks
            onHover: function (flotItem, $tooltipEl) {},

            $compat: false
        }
    };

    // dummy default options object for legacy code (<0.8.5) - is deleted later
    defaultOptions.tooltipOpts = defaultOptions.tooltip;

    // object
    var FlotTooltip = function (plot) {
        // variables
        this.tipPosition = {x: 0, y: 0};

        this.init(plot);
    };

    // main plugin function
    FlotTooltip.prototype.init = function (plot) {
        var that = this;

        // detect other flot plugins
        var plotPluginsLength = $.plot.plugins.length;
        this.plotPlugins = [];

        if (plotPluginsLength) {
            for (var p = 0; p < plotPluginsLength; p++) {
                this.plotPlugins.push($.plot.plugins[p].name);
            }
        }

        plot.hooks.bindEvents.push(function (plot, eventHolder) {

            // get plot options
            that.plotOptions = plot.getOptions();

            // for legacy (<0.8.5) implementations
            if (typeof(that.plotOptions.tooltip) === 'boolean') {
                that.plotOptions.tooltipOpts.show = that.plotOptions.tooltip;
                that.plotOptions.tooltip = that.plotOptions.tooltipOpts;
                delete that.plotOptions.tooltipOpts;
            }

            // if not enabled return
            if (that.plotOptions.tooltip.show === false || typeof that.plotOptions.tooltip.show === 'undefined') return;

            // shortcut to access tooltip options
            that.tooltipOptions = that.plotOptions.tooltip;

            if (that.tooltipOptions.$compat) {
                that.wfunc = 'width';
                that.hfunc = 'height';
            } else {
                that.wfunc = 'innerWidth';
                that.hfunc = 'innerHeight';
            }

            // create tooltip DOM element
            var $tip = that.getDomElement();

            // bind event
            $( plot.getPlaceholder() ).bind("plothover", plothover);
            if (that.tooltipOptions.clickTips) {
                $( plot.getPlaceholder() ).bind("plotclick", plotclick);
            }
            that.clickmode = false;

            $(eventHolder).bind('mousemove', mouseMove);
        });

        plot.hooks.shutdown.push(function (plot, eventHolder){
            $(plot.getPlaceholder()).unbind("plothover", plothover);
            $(plot.getPlaceholder()).unbind("plotclick", plotclick);
            plot.removeTooltip();
            $(eventHolder).unbind("mousemove", mouseMove);
        });

        function mouseMove(e){
            var pos = {};
            pos.x = e.pageX;
            pos.y = e.pageY;
            plot.setTooltipPosition(pos);
        }

        /**
         *  open the tooltip (if not already open) and freeze it on the current position till the next click
         */
        function plotclick(event, pos, item) {
            if (! that.clickmode) {
                // it is the click activating the clicktip
                plothover(event, pos, item);
                if (that.getDomElement().is(":visible")) {
                    $(plot.getPlaceholder()).unbind("plothover", plothover);
                    that.clickmode = true;
                }
            } else {
                // it is the click deactivating the clicktip
                $( plot.getPlaceholder() ).bind("plothover", plothover);
                plot.hideTooltip();
                that.clickmode = false;
            }
        }

        function plothover(event, pos, item) {
            // Simple distance formula.
            var lineDistance = function (p1x, p1y, p2x, p2y) {
                return Math.sqrt((p2x - p1x) * (p2x - p1x) + (p2y - p1y) * (p2y - p1y));
            };

            // Here is some voodoo magic for determining the distance to a line form a given point {x, y}.
            var dotLineLength = function (x, y, x0, y0, x1, y1, o) {
                if (o && !(o =
                    function (x, y, x0, y0, x1, y1) {
                        if (typeof x0 !== 'undefined') return { x: x0, y: y };
                        else if (typeof y0 !== 'undefined') return { x: x, y: y0 };

                        var left,
                            tg = -1 / ((y1 - y0) / (x1 - x0));

                        return {
                            x: left = (x1 * (x * tg - y + y0) + x0 * (x * -tg + y - y1)) / (tg * (x1 - x0) + y0 - y1),
                            y: tg * left - tg * x + y
                        };
                    } (x, y, x0, y0, x1, y1),
                    o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))
                ) {
                    var l1 = lineDistance(x, y, x0, y0), l2 = lineDistance(x, y, x1, y1);
                    return l1 > l2 ? l2 : l1;
                } else {
                    var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
                    return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
                }
            };

            if (item) {
                plot.showTooltip(item, that.tooltipOptions.snap ? item : pos);
            } else if (that.plotOptions.series.lines.show && that.tooltipOptions.lines === true) {
                var maxDistance = that.plotOptions.grid.mouseActiveRadius;

                var closestTrace = {
                    distance: maxDistance + 1
                };

                var ttPos = pos;

                $.each(plot.getData(), function (i, series) {
                    var xBeforeIndex = 0,
                        xAfterIndex = -1;

                    // Our search here assumes our data is sorted via the x-axis.
                    // TODO: Improve efficiency somehow - search smaller sets of data.
                    for (var j = 1; j < series.data.length; j++) {
                        if (series.data[j - 1][0] <= pos.x && series.data[j][0] >= pos.x) {
                            xBeforeIndex = j - 1;
                            xAfterIndex = j;
                        }
                    }

                    if (xAfterIndex === -1) {
                        plot.hideTooltip();
                        return;
                    }

                    var pointPrev = { x: series.data[xBeforeIndex][0], y: series.data[xBeforeIndex][1] },
                        pointNext = { x: series.data[xAfterIndex][0], y: series.data[xAfterIndex][1] };

                    var distToLine = dotLineLength(series.xaxis.p2c(pos.x), series.yaxis.p2c(pos.y), series.xaxis.p2c(pointPrev.x),
                        series.yaxis.p2c(pointPrev.y), series.xaxis.p2c(pointNext.x), series.yaxis.p2c(pointNext.y), false);

                    if (distToLine < closestTrace.distance) {

                        var closestIndex = lineDistance(pointPrev.x, pointPrev.y, pos.x, pos.y) <
                            lineDistance(pos.x, pos.y, pointNext.x, pointNext.y) ? xBeforeIndex : xAfterIndex;

                        var pointSize = series.datapoints.pointsize;

                        // Calculate the point on the line vertically closest to our cursor.
                        var pointOnLine = [
                            pos.x,
                            pointPrev.y + ((pointNext.y - pointPrev.y) * ((pos.x - pointPrev.x) / (pointNext.x - pointPrev.x)))
                        ];

                        var item = {
                            datapoint: pointOnLine,
                            dataIndex: closestIndex,
                            series: series,
                            seriesIndex: i
                        };

                        closestTrace = {
                            distance: distToLine,
                            item: item
                        };

                        if (that.tooltipOptions.snap) {
                            ttPos = {
                                pageX: series.xaxis.p2c(pointOnLine[0]),
                                pageY: series.yaxis.p2c(pointOnLine[1])
                            };
                        }
                    }
                });

                if (closestTrace.distance < maxDistance + 1)
                    plot.showTooltip(closestTrace.item, ttPos);
                else
                    plot.hideTooltip();
            } else {
                plot.hideTooltip();
            }
        }

        // Quick little function for setting the tooltip position.
        plot.setTooltipPosition = function (pos) {
            var $tip = that.getDomElement();

            var totalTipWidth = $tip.outerWidth() + that.tooltipOptions.shifts.x;
            var totalTipHeight = $tip.outerHeight() + that.tooltipOptions.shifts.y;
            if ((pos.x - $(window).scrollLeft()) > ($(window)[that.wfunc]() - totalTipWidth)) {
                pos.x -= totalTipWidth;
                pos.x = Math.max(pos.x, 0);
            }
            if ((pos.y - $(window).scrollTop()) > ($(window)[that.hfunc]() - totalTipHeight)) {
                pos.y -= totalTipHeight;
            }

	    /*
	       The section applies the new positioning ONLY if pos.x and pos.y
	       are numbers. If they are undefined or not a number, use the last
	       known numerical position. This hack fixes a bug that kept pie
	       charts from keeping their tooltip positioning.
	     */

            if (isNaN(pos.x)) {
		that.tipPosition.x = that.tipPosition.xPrev;
	    }
	    else {
		that.tipPosition.x = pos.x;
		that.tipPosition.xPrev = pos.x;
	    }
	    if (isNaN(pos.y)) {
		that.tipPosition.y = that.tipPosition.yPrev;
	    }
	    else {
		that.tipPosition.y = pos.y;
		that.tipPosition.yPrev = pos.y;
	    }

        };

        // Quick little function for showing the tooltip.
        plot.showTooltip = function (target, position, targetPosition) {
            var $tip = that.getDomElement();

            // convert tooltip content template to real tipText
            var tipText = that.stringFormat(that.tooltipOptions.content, target);
            if (tipText === '')
                return;

            $tip.html(tipText);
            plot.setTooltipPosition({ x: that.tipPosition.x, y: that.tipPosition.y });
            $tip.css({
                left: that.tipPosition.x + that.tooltipOptions.shifts.x,
                top: that.tipPosition.y + that.tooltipOptions.shifts.y
            }).show();

            // run callback
            if (typeof that.tooltipOptions.onHover === 'function') {
                that.tooltipOptions.onHover(target, $tip);
            }
        };

        // Quick little function for hiding the tooltip.
        plot.hideTooltip = function () {
            that.getDomElement().hide().html('');
        };

        plot.removeTooltip = function() {
            that.getDomElement().remove();
        };
    };

    /**
     * get or create tooltip DOM element
     * @return jQuery object
     */
    FlotTooltip.prototype.getDomElement = function () {
        var $tip = $('<div>');
        if (this.tooltipOptions && this.tooltipOptions.cssClass) {
            $tip = $('.' + this.tooltipOptions.cssClass);

            if( $tip.length === 0 ){
                $tip = $('<div />').addClass(this.tooltipOptions.cssClass);
                $tip.appendTo('body').hide().css({position: 'absolute'});

                if(this.tooltipOptions.defaultTheme) {
                    $tip.css({
                        'background': '#fff',
                        'z-index': '1040',
                        'padding': '0.4em 0.6em',
                        'border-radius': '0.5em',
                        'font-size': '0.8em',
                        'border': '1px solid #111',
                        'display': 'none',
                        'white-space': 'nowrap'
                    });
                }
            }
        }

        return $tip;
    };

    /**
     * core function, create tooltip content
     * @param  {string} content - template with tooltip content
     * @param  {object} item - Flot item
     * @return {string} real tooltip content for current item
     */
    FlotTooltip.prototype.stringFormat = function (content, item) {
        var percentPattern = /%p\.{0,1}(\d{0,})/;
        var seriesPattern = /%s/;
        var colorPattern = /%c/;
        var xLabelPattern = /%lx/; // requires flot-axislabels plugin https://github.com/markrcote/flot-axislabels, will be ignored if plugin isn't loaded
        var yLabelPattern = /%ly/; // requires flot-axislabels plugin https://github.com/markrcote/flot-axislabels, will be ignored if plugin isn't loaded
        var xPattern = /%x\.{0,1}(\d{0,})/;
        var yPattern = /%y\.{0,1}(\d{0,})/;
        var xPatternWithoutPrecision = "%x";
        var yPatternWithoutPrecision = "%y";
        var customTextPattern = "%ct";
	var nPiePattern = "%n";

        var x, y, customText, p, n;

        // for threshold plugin we need to read data from different place
        if (typeof item.series.threshold !== "undefined") {
            x = item.datapoint[0];
            y = item.datapoint[1];
            customText = item.datapoint[2];
	}

	// for CurvedLines plugin we need to read data from different place
	    else if (typeof item.series.curvedLines !== "undefined") {
		x = item.datapoint[0];
		y = item.datapoint[1];
	    }

        else if (typeof item.series.lines !== "undefined" && item.series.lines.steps) {
            x = item.series.datapoints.points[item.dataIndex * 2];
            y = item.series.datapoints.points[item.dataIndex * 2 + 1];
            // TODO: where to find custom text in this variant?
            customText = "";
        } else {
            x = item.series.data[item.dataIndex][0];
            y = item.series.data[item.dataIndex][1];
            customText = item.series.data[item.dataIndex][2];
        }

        // I think this is only in case of threshold plugin
        if (item.series.label === null && item.series.originSeries) {
            item.series.label = item.series.originSeries.label;
        }

        // if it is a function callback get the content string
        if (typeof(content) === 'function') {
            content = content(item.series.label, x, y, item);
        }

        // the case where the passed content is equal to false
        if (typeof(content) === 'boolean' && !content) {
            return '';
        }

        /* replacement of %ct and other multi-character templates must
           precede the replacement of single-character templates
           to avoid conflict between '%c' and '%ct'  and similar substrings
        */
        if (customText) {
            content = content.replace(customTextPattern, customText);
        }

        // percent match for pie charts and stacked percent
        if (typeof (item.series.percent) !== 'undefined') {
            p = item.series.percent;
        } else if (typeof (item.series.percents) !== 'undefined') {
            p = item.series.percents[item.dataIndex];
        }
        if (typeof p === 'number') {
            content = this.adjustValPrecision(percentPattern, content, p);
        }

        // replace %n with number of items represented by slice in pie charts
        if (item.series.hasOwnProperty('pie')) {
            if (typeof item.series.data[0][1] !== 'undefined') {
                n = item.series.data[0][1];
            }
        }
        if (typeof n === 'number') {
            content = content.replace(nPiePattern, n);
        }

        // series match
        if (typeof(item.series.label) !== 'undefined') {
            content = content.replace(seriesPattern, item.series.label);
        } else {
            //remove %s if label is undefined
            content = content.replace(seriesPattern, "");
        }

        // color match
        if (typeof(item.series.color) !== 'undefined') {
            content = content.replace(colorPattern, item.series.color);
        } else {
            //remove %s if color is undefined
            content = content.replace(colorPattern, "");
        }

        // x axis label match
        if (this.hasAxisLabel('xaxis', item)) {
            content = content.replace(xLabelPattern, item.series.xaxis.options.axisLabel);
        } else {
            //remove %lx if axis label is undefined or axislabels plugin not present
            content = content.replace(xLabelPattern, "");
        }

        // y axis label match
        if (this.hasAxisLabel('yaxis', item)) {
            content = content.replace(yLabelPattern, item.series.yaxis.options.axisLabel);
        } else {
            //remove %ly if axis label is undefined or axislabels plugin not present
            content = content.replace(yLabelPattern, "");
        }

        // time mode axes with custom dateFormat
        if (this.isTimeMode('xaxis', item) && this.isXDateFormat(item)) {
            content = content.replace(xPattern, this.timestampToDate(x, this.tooltipOptions.xDateFormat, item.series.xaxis.options));
        }
        if (this.isTimeMode('yaxis', item) && this.isYDateFormat(item)) {
            content = content.replace(yPattern, this.timestampToDate(y, this.tooltipOptions.yDateFormat, item.series.yaxis.options));
        }

        // set precision if defined
        if (typeof x === 'number') {
            content = this.adjustValPrecision(xPattern, content, x);
        }
        if (typeof y === 'number') {
            content = this.adjustValPrecision(yPattern, content, y);
        }

        // change x from number to given label, if given
        if (typeof item.series.xaxis.ticks !== 'undefined') {

            var ticks;
            if (this.hasRotatedXAxisTicks(item)) {
                // xaxis.ticks will be an empty array if tickRotor is being used, but the values are available in rotatedTicks
                ticks = 'rotatedTicks';
            } else {
                ticks = 'ticks';
            }

            // see https://github.com/krzysu/flot.tooltip/issues/65
            var tickIndex = item.dataIndex + item.seriesIndex;

            for (var xIndex in item.series.xaxis[ticks]) {
                if (item.series.xaxis[ticks].hasOwnProperty(tickIndex) && !this.isTimeMode('xaxis', item)) {
                    var valueX = (this.isCategoriesMode('xaxis', item)) ? item.series.xaxis[ticks][tickIndex].label : item.series.xaxis[ticks][tickIndex].v;
                    if (valueX === x) {
                        content = content.replace(xPattern, item.series.xaxis[ticks][tickIndex].label.replace(/\$/g, '$$$$'));
                    }
                }
            }
        }

        // change y from number to given label, if given
        if (typeof item.series.yaxis.ticks !== 'undefined') {
            for (var yIndex in item.series.yaxis.ticks) {
                if (item.series.yaxis.ticks.hasOwnProperty(yIndex)) {
                    var valueY = (this.isCategoriesMode('yaxis', item)) ? item.series.yaxis.ticks[yIndex].label : item.series.yaxis.ticks[yIndex].v;
                    if (valueY === y) {
                        content = content.replace(yPattern, item.series.yaxis.ticks[yIndex].label.replace(/\$/g, '$$$$'));
                    }
                }
            }
        }

        // if no value customization, use tickFormatter by default
        if (typeof item.series.xaxis.tickFormatter !== 'undefined') {
            //escape dollar
            content = content.replace(xPatternWithoutPrecision, item.series.xaxis.tickFormatter(x, item.series.xaxis).replace(/\$/g, '$$'));
        }
        if (typeof item.series.yaxis.tickFormatter !== 'undefined') {
            //escape dollar
            content = content.replace(yPatternWithoutPrecision, item.series.yaxis.tickFormatter(y, item.series.yaxis).replace(/\$/g, '$$'));
        }

        return content;
    };

    // helpers just for readability
    FlotTooltip.prototype.isTimeMode = function (axisName, item) {
        return (typeof item.series[axisName].options.mode !== 'undefined' && item.series[axisName].options.mode === 'time');
    };

    FlotTooltip.prototype.isXDateFormat = function (item) {
        return (typeof this.tooltipOptions.xDateFormat !== 'undefined' && this.tooltipOptions.xDateFormat !== null);
    };

    FlotTooltip.prototype.isYDateFormat = function (item) {
        return (typeof this.tooltipOptions.yDateFormat !== 'undefined' && this.tooltipOptions.yDateFormat !== null);
    };

    FlotTooltip.prototype.isCategoriesMode = function (axisName, item) {
        return (typeof item.series[axisName].options.mode !== 'undefined' && item.series[axisName].options.mode === 'categories');
    };

    //
    FlotTooltip.prototype.timestampToDate = function (tmst, dateFormat, options) {
        var theDate = $.plot.dateGenerator(tmst, options);
        return $.plot.formatDate(theDate, dateFormat, this.tooltipOptions.monthNames, this.tooltipOptions.dayNames);
    };

    //
    FlotTooltip.prototype.adjustValPrecision = function (pattern, content, value) {

        var precision;
        var matchResult = content.match(pattern);
        if( matchResult !== null ) {
            if(RegExp.$1 !== '') {
                precision = RegExp.$1;
                value = value.toFixed(precision);

                // only replace content if precision exists, in other case use thickformater
                content = content.replace(pattern, value);
            }
        }
        return content;
    };

    // other plugins detection below

    // check if flot-axislabels plugin (https://github.com/markrcote/flot-axislabels) is used and that an axis label is given
    FlotTooltip.prototype.hasAxisLabel = function (axisName, item) {
        return ($.inArray('axisLabels', this.plotPlugins) !== -1 && typeof item.series[axisName].options.axisLabel !== 'undefined' && item.series[axisName].options.axisLabel.length > 0);
    };

    // check whether flot-tickRotor, a plugin which allows rotation of X-axis ticks, is being used
    FlotTooltip.prototype.hasRotatedXAxisTicks = function (item) {
        return ($.inArray('tickRotor',this.plotPlugins) !== -1 && typeof item.series.xaxis.rotatedTicks !== 'undefined');
    };

    //
    var init = function (plot) {
      new FlotTooltip(plot);
    };

    // define Flot plugin
    $.plot.plugins.push({
        init: init,
        options: defaultOptions,
        name: 'tooltip',
        version: '0.8.5'
    });

})(jQuery);

define("../../node_modules/jquery.flot.tooltip/js/jquery.flot.tooltip.js", function(){});

// Wrap Source - https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
// Added window and document support. Made undefined alter-secured (not need in ES6).
;(function (factory, undefined) {
    if (typeof define === 'function' && define.amd) {
        define('../libs/Foliojs/dist/js/Folio.js',['jquery'], function ($) {
            factory($, window, document, undefined);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery, window, document, undefined);
            return jQuery;
        };
    } else {
        factory(jQuery, window, document, undefined);
    }
}(function ($, w, d, undefined) {
    'use strict';
    var defaults = {
            // Keep plugin default options here.
            // Also keep the on-the-fly DOM elements which will be created by the plugin here. For eg. if you plugin uses
            // a container element - <div class="FolioContainer"><!--[More internal elements]--></div>
            // Then should keep it as an object of the defaults if you want to give end user the ability to
            // alter them (Note: It might be dangerous to do so, and documentation should include a warning regarding
            // the consequences of altering the DOM Cache Elements (DOMCE :P).). With this your plugin won't have to
            // create a jQuery DOM element again and again which might costlier, you can use $.fn.clone() method to clone
            // these caches for you plugin instance.
            useHTMLOptions: true,
            infiniteScrolling: false,
            totalPages: 0,
            maxPages: 9,
            activePage: 1,
            nextClass: '',
            previousClass: '',
            onUpdate: $.noop,
            disableInitialOnUpdate: false
        },
        folioCount = 0,
        // Our plugin's constructor function.
        Folio = function (element, options) {
            this.id = ++folioCount;
            /** @type jQuery */
            this.$element = $(element);
            // Note: We don't do -
            // this.properties = defaults;
            // Because we don't want to alter our defaults every time new options are passed and hence we will
            // loose our default options. That's why we take an empty object as target. For every $.extend on
            // this.properties from now on we already have a fresh javascript object to work on.
            // All of the options are available in this.properties and different properties that we might need which are
            // local to this instance are extended in the this.properties object. This encapsulates everything into one
            // manageable javascript object.
            this.properties = $.extend({}, defaults);
            this.setOptions(options);
            if (this.properties.useHTMLOptions) {
                privates.applyHTMLOptions.apply(this);
            }
            this.links = {};
            this.initialize();
        },
        privates = {
            // All of our plugin's private methods go here.
            // Note: They will not have this as an instance of Folio, as a workaround we can do -
            // privates.METHOD_NAME.apply(this);
            // Where this should be an instance of Folio from public methods.
            // Alternatively you can append '_' in front of your methods in Folio.prototype to mark them as private.
            // Note: They will still be available to the End User, it's just a convention.

            // Cache the costly jQuery element creation operation initially and then just clone them when needed.
            $pageCache: $('<span class="FolioPage"></span>'),
            $folioCache: $('<div class="Folio"><span class="FolioControl FolioPrevious"></span><span class="FolioPages"></span><span class="FolioControl FolioNext"></span></div>'),

            // This function extends the plugin instance options with the HTML data attribute based options as -
            // data-OPTION="VALUE" -> OPTION: "VALUE"
            applyHTMLOptions: function () {
                var properties = this.properties,
                    $element = this.$element,
                    htmlOptions = {};
                for (var option in defaults) {
                    if (defaults.hasOwnProperty(option)) {
                        htmlOptions[option] = $element.data(option) || undefined;
                    }
                }
                $.extend(properties, htmlOptions);
                privates.sanitizeOptions.apply(this);
            },

            // Sanitizes the options set by the user. This function is automatically called in
            // privates.applyHTMLOptions() and this.setOptions() functions.
            sanitizeOptions: function () {
                var properties = this.properties;
                // The lower bound for this.properties.maxPages is 5. This is because the tightest possible case is
                // as follows: 1 ... 5 ... 10, which are 5 pages including ellipsis.
                if (properties.maxPages < 5) {
                    properties.maxPages = 5;
                }
                // Sanitize the this.properties.activePage value so that it is valid.
                if (properties.activePage < 1) {
                    properties.activePage = 1;
                }
                if (properties.activePage > properties.totalPages) {
                    properties.activePage = properties.totalPages;
                }
                // Sanitize the this.properties.onUpdate() function, to check if it is a function or not.
                // We do not this every time in this.update() function to remove unnecessary overhead.
                if (!$.isFunction(properties.onUpdate)) {
                    if (typeof properties.onUpdate === 'string') {
                        var onUpdate = w[properties.onUpdate];
                        properties.onUpdate = $.isFunction(onUpdate) ? onUpdate : $.noop;
                    } else {
                        properties.onUpdate = $.noop;
                    }
                }
            }
        };
    // All of our plugin's public methods go here.
    // End user can access these methods as - $element.data('Folio').METHOD_NAME();
    // Note: $.data(element, 'Folio'); is much faster than $element.data('Folio');
    Folio.prototype = {
        /**
         * Creates a new Object from the defaults and extends it with the options Object provided.
         * @param {Object} options - Object of the options to be extended from the defaults.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        setOptions: function (options) {
            this.properties = $.extend(this.properties, options);
            privates.sanitizeOptions.apply(this);
            return this;
        },
        /**
         * Sets the onUpdate() function to be called each time the this.update() function is called. This is just
         * an added utility function, since same can be achieved using this.setOptions() function as used in it.
         * @param {Function} callback - The onUpdate() function to be used.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        onUpdate: function (callback) {
            return this.setOptions({
                onUpdate: callback
            });
        },
        /**
         * Generates the HTML elements of page numbers in the .Folio .FolioPages element corresponding to the maximum
         * elements it can have and store them in a jQuery object array (Note: DOM Elements are mapped to their
         * jQuery objects for faster operations later on.) i.e., this.$pageArray. Initially each element is given
         * numbering from 1 to this.properties.maxPages. Also it clears the .FolioPages elements HTML content before
         * appending page number elements.
         * Note: This function should not be called many times in succession because it is very costly operation and
         * is only automatically called during initialization.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        generate: function () {
            var properties = this.properties,
                totalPages = properties.totalPages,
                maxPages = properties.maxPages,
                // We detach our .FolioPages element first to increase performance while appending elements.
                $pages = this.$pages.detach(),
                $pageCache = privates.$pageCache,
                pageCount = 1;
            $pages.html('');
            if (totalPages >= maxPages) {
                while (pageCount <= maxPages) {
                    $pages.append($pageCache.clone().text(pageCount));
                    pageCount++;
                }
            } else {
                while (pageCount <= totalPages) {
                    $pages.append($pageCache.clone().text(pageCount));
                    pageCount++;
                }
            }
            // Cache the jQuery object equivalent of the children of the .FolioPages to increase performance later.
            this.$pageArray = $pages.children().map(function (index, domElement) {
                return $(domElement);
            });
            // Reattach the .FolioPages element to the .Folio element at the right place.
            $pages.insertBefore(this.$next);
            return this;
        },
        /**
         * Updates the .FolioPages page numbering corresponding to the current activePage. No new element is
         * created and only the numbers(text) of the existing page number elements is updated using the cached
         * .FolioPages .FolioPage jQuery object array i.e., this.$pageArray. Also updates(Either removes or adds
         * the .Disabled class based on the condition.) the next and previous buttons .Disabled class.
         * Note: It also calls the this.properties.onUpdate() function automatically.
         * @param {boolean} [disableOnUpdate] - If true then onUpdate is not called. Default is false.
         * @param {boolean} [disableSync] - If true then synchronisation is not done i.e., setActivePage(activePage)
         * is not called for the linked Folio objects. Default is false.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        update: function (disableOnUpdate, disableSync) {
            var properties = this.properties,
                totalPages = properties.totalPages,
                activePage = properties.activePage,
                maxPages = properties.maxPages,
                pageCount = 1,
                pageIndex = 0,
                links = this.links;
            /** @type jQuery[] */
            var $pageArray = this.$pageArray;

            // Internal function to update page. Since this code required a lot of time it has been encapsulated
            // into a self containing module as it is never needed in the global space.
            function updatePage(index, count) {
                if (activePage === count) {
                    $pageArray[index]
                        .text(count)
                        .removeClass('Ellipsis')
                        .addClass('Active');
                } else {
                    $pageArray[index]
                        .text(count)
                        .removeClass('Ellipsis')
                        .removeClass('Active');
                }
            }

            if (totalPages > maxPages) {
                var leftLastCount = maxPages - 2,
                    rightFirstCount = totalPages - leftLastCount + 1;
                if (activePage < leftLastCount) {
                    for (pageCount = 1; pageCount <= leftLastCount; pageCount++) {
                        updatePage(pageIndex++, pageCount);
                    }
                    $pageArray[pageIndex++]
                    // Unicode for ellipsis character.
                        .html('...')
                        .addClass('Ellipsis')
                        .removeClass('Active');
                    updatePage(pageIndex, totalPages);
                } else if (activePage >= leftLastCount && activePage <= rightFirstCount) {
                    updatePage(pageIndex++, 1);
                    $pageArray[pageIndex++]
                        .html('...')
                        .addClass('Ellipsis')
                        .removeClass('Active');
                    var middlePageCount = maxPages - 4,
                        middleFirstCount = activePage - Math.ceil(middlePageCount / 2) + 1,
                        middleLastCount = middleFirstCount + middlePageCount - 1;
                    for (pageCount = middleFirstCount; pageCount <= middleLastCount; pageCount++) {
                        updatePage(pageIndex++, pageCount);
                    }
                    $pageArray[pageIndex++]
                        .html('...')
                        .addClass('Ellipsis')
                        .removeClass('Active');
                    updatePage(pageIndex, totalPages);
                } else {
                    updatePage(pageIndex++, 1);
                    $pageArray[pageIndex++]
                        .html('...')
                        .addClass('Ellipsis')
                        .removeClass('Active');
                    for (pageCount = rightFirstCount; pageCount <= totalPages; pageCount++) {
                        updatePage(pageIndex++, pageCount);
                    }
                }
            } else {
                for (pageCount = 1; pageCount <= totalPages; pageCount++) {
                    updatePage(pageIndex++, pageCount);
                }
            }
            if (!properties.infiniteScrolling && (activePage === 1)) {
                this.$previous.addClass('Disabled');
            } else {
                this.$previous.removeClass('Disabled');
            }
            if (!properties.infiniteScrolling && (activePage === totalPages)) {
                this.$next.addClass('Disabled');
            } else {
                this.$next.removeClass('Disabled');
            }
            if ((disableOnUpdate || false) === false) {
                properties.onUpdate(activePage);
            }
            if ((disableSync || false) === false) {
                for (var folioID in links) {
                    if (links.hasOwnProperty(folioID)) {
                        links[folioID].setActivePage(activePage, true, true);
                    }
                }
            }
            return this;
        },
        /**
         * Sets the Active Page of the pagination to the given page number and also calls update() function
         * automatically.
         * @param {int} page - Page Number to set the Active Page to.
         * @param {boolean} [disableOnUpdate] - If true then onUpdate is not called. Default is false.
         * @param {boolean} [disableSync] - If true then synchronisation is not done i.e., setActivePage(page)
         * is not called for the linked Folio objects. Default is false.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        setActivePage: function (page, disableOnUpdate, disableSync) {
            var properties = this.properties;
            if ((page >= 1) && (page <= properties.totalPages)) {
                properties.activePage = page;
                this.update((disableOnUpdate || false), (disableSync || false));
            }
            return this;
        },
        /**
         * Increments the active page number. If this.properties.infiniteScrolling is enabled it jumps to 1st page
         * if called when the active page is the last page.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        nextPage: function () {
            var properties = this.properties;
            if (properties.activePage < properties.totalPages) {
                properties.activePage++;
                this.update();
            } else if (properties.infiniteScrolling) {
                properties.activePage = 1;
                this.update();
            }
            return this;
        },
        /**
         * Decrements the active page number. If this.properties.infiniteScrolling is enabled it jumps to last page
         * if called when the active page is the 1st page.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        previousPage: function () {
            var properties = this.properties;
            if (properties.activePage > 1) {
                properties.activePage--;
                this.update();
            } else if (properties.infiniteScrolling) {
                properties.activePage = properties.totalPages;
                this.update();
            }
            return this;
        },
        /**
         * Links this Folio object to the one passed as a parameter. Both the Folios should have equal number of pages.
         * But the max pages can be different. The onUpdate function for all the Folio objects being linked are set
         * to the onUpdate function of this Folio object (one being linked to).
         * @param {Folio} folio - Folio object to link this one with.
         * @param {boolean} [disableBackLinking] - If true then setActivePage(activePage) and link(this) is not called
         * for the linking Folio object. Default is false.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        link: function (folio, disableBackLinking) {
            var properties = this.properties,
                links = this.links;
            if ((folio.properties.totalPages === properties.totalPages) && !links.hasOwnProperty(folio.id)) {
                links[folio.id] = folio;
                folio.properties.onUpdate = properties.onUpdate;
                if ((disableBackLinking || false) === false) {
                    folio.setActivePage(properties.activePage, true);
                    folio.link(this, true);
                }
            }
            return this;
        },
        /**
         * Initializer function for the plugin.
         * @return {Folio} - Returns the Folio object to maintain chaining.
         */
        initialize: function () {
            var $element = this.$element,
                $folio = this.$folio = privates.$folioCache.clone();
            this.$previous = $folio.find('.FolioPrevious').addClass(this.properties.previousClass);
            this.$pages = $folio.find('.FolioPages');
            this.$next = $folio.find('.FolioNext').addClass(this.properties.nextClass);
            $element
                .empty()
                .append($folio);
            this.generate();
            this.update(this.properties.disableInitialOnUpdate);
            return this;
        }
    };
    // Global plugin to alter the defaults, inspiration from here -
    // https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Handling-plugin-defaults-and-predefinitions
    $.Folio = function (defaultOptions) {
        return $.extend(defaultOptions, defaults);
    };
    // Attach our plugin to jQuery
    $.fn.Folio = function (options) {
        return this.each(function () {
            // Check if the plugin is already attached to this element and whether it is an instance of plugin or not.
            if (!($.data(this, 'Folio') instanceof Folio)) {
                $.data(this, 'Folio', new Folio(this, options));
            }
        });
    };
    /**
     * A plugin extension to retrieve the Folio object attached with the given jQuery object or array of objects.
     * @return {undefined|Folio|jQuery}
     */
    $.fn.GetFolio = function () {
        var folio;
        if (this.length > 1) {
            var folioArray = [];
            this.each(function () {
                folio = $.data(this, 'Folio');
                if ((folio !== undefined) && (folio instanceof Folio)) {
                    folioArray.push(folio);
                }
            });
            return $(folioArray);
        } else if (this.length === 1) {
            folio = $.data(this[0], 'Folio');
            if ((folio !== undefined) && (folio instanceof Folio)) {
                return folio;
            }
        }
    };
    // Make our plugin global by attaching it to the window object.
    w.Folio = Folio;
    // Bind events to Folio pages and controls.
    $(d)
        .on('click', '.FolioPage:not(.Ellipsis)', function () {
            // Our element is the third parent of our current Folio Page element which has a reference to the Folio
            // object stuck to it.
            /** @type Folio */
            var folio = $.data($(this).parent().parent().parent()[0], 'Folio');
            var page = parseInt(this.innerText);
            if (folio.properties.activePage !== page) {
                folio.setActivePage(page);
            }
        })
        .on('click', '.FolioPrevious:not(.Disabled)', function () {
            /** @type Folio */
            var folio = $.data($(this).parent().parent()[0], 'Folio');
            folio.previousPage();
        })
        .on('click', '.FolioNext:not(.Disabled)', function () {
            /** @type Folio */
            var folio = $.data($(this).parent().parent()[0], 'Folio');
            folio.nextPage();
        });
    // Auto apply plugin to the elements with attribute - data-Folio present.
    $(function () {
        $('[data-Folio]', d).Folio();
    });
}));

var Cosmatt =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_SIGNIFICANT_DIGITS = 3;
var DEFAULT_MAX_POSITIVE_EXPONENT = 6;
var DEFAULT_MIN_NEGATIVE_EXPONENT = -4;
var NumberFormatter = /** @class */ (function () {
    function NumberFormatter(settings) {
        this.superscripts = {
            "0": "⁰",
            "1": "¹",
            "2": "²",
            "3": "³",
            "4": "⁴",
            "5": "⁵",
            "6": "⁶",
            "7": "⁷",
            "8": "⁸",
            "9": "⁹",
            "-": "⁻"
        };
        this.options = {};
        if (!settings) {
            settings = {};
        }
        this.options["significantDigits"] = settings.significantDigits || DEFAULT_SIGNIFICANT_DIGITS;
        this.options["maxPositiveExponent"] = settings.maxPositiveExponent || DEFAULT_MAX_POSITIVE_EXPONENT;
        this.options["minNegativeExponent"] = settings.minNegativeExponent || DEFAULT_MIN_NEGATIVE_EXPONENT;
        this.isNaNPolyfill();
        this.includesPolyFill();
    }
    NumberFormatter.prototype.format = function (originalInput, isEditable) {
        if (isEditable === void 0) { isEditable = false; }
        // convert to number as input can be a number string
        var input = parseFloat(originalInput);
        if (Number.isNaN(input) || input === 0) {
            return originalInput;
        }
        // Rule #1: if absolute value of number is greater than 10^p
        if (Math.abs(input) >= Math.pow(10, this.options.maxPositiveExponent)) {
            var exponent_1 = input.toExponential(this.options.significantDigits - 1);
            return this.toSuperscript(exponent_1);
        }
        // Rule #3: if absolute value of number is  between  10^p and 10^s and value is displayed in editable field, then on blur
        if (isEditable && Math.abs(input) < Math.pow(10, this.options.maxPositiveExponent) && Math.abs(input) >= Math.pow(10, this.options.significantDigits)) {
            return Math.round(input).toString();
        }
        // Rule #3: if absolute value of number is  between  10^p and 10^n
        if ((Math.abs(input) > Math.pow(10, this.options.minNegativeExponent))) {
            input = input.toPrecision(this.options.significantDigits);
            return parseFloat(input).toString();
        }
        // Rule #4: if absolute value of number is  less than 10^n
        var exponent = input.toExponential(this.options.significantDigits - 1);
        return this.toSuperscript(exponent);
    };
    NumberFormatter.prototype.toSuperscript = function (exponent) {
        var parts;
        if (exponent.includes("e+")) {
            parts = exponent.split("e+");
        }
        else if (exponent.includes("e-")) {
            parts = exponent.split("e");
        }
        else {
            return exponent;
        }
        var superExponent = "";
        for (var _i = 0, _a = parts[1]; _i < _a.length; _i++) {
            var char = _a[_i];
            superExponent += this.superscripts[char];
        }
        parts[1] = superExponent;
        return parts.join("x10");
    };
    NumberFormatter.prototype.isNaNPolyfill = function () {
        Number.isNaN = Number.isNaN || function (value) {
            return value !== value;
        };
    };
    NumberFormatter.prototype.includesPolyFill = function () {
        if (!String.prototype.includes) {
            String.prototype.includes = function (search, start) {
                if (typeof start !== 'number') {
                    start = 0;
                }
                if (start + search.length > this.length) {
                    return false;
                }
                else {
                    return this.indexOf(search, start) !== -1;
                }
            };
        }
    };
    return NumberFormatter;
}());
exports.NumberFormatter = NumberFormatter;


/***/ })
/******/ ]);
define("../libs/number-formatter/dist/cosmatt-number-formatter.js", function(){});

var unitData = {"unitType": {
            "LINEARDISTANCE": {
                "unit": [{
                    "symbol": "m",
                    "name": "meter",
                    "conversionFactor": 0.0254,
                    "id": "meter",
                    "isSI": true
                }, {
                    "symbol": "cm",
                    "name": "centimeter",
                    "conversionFactor": 2.54,
                    "id": "centimeter"
                }, {
                    "symbol": "mm",
                    "name": "millimeter",
                    "conversionFactor": 25.4,
                    "id": "millimeter",
                    "isMetric": true
                }, {
                    "symbol": "in",
                    "name": "inch",
                    "conversionFactor": 1,
                    "id": "inch",
                    "isImperial": true
                }, {
                    "symbol": "ft",
                    "name": "feet",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feet"
                }, {
                    "symbol": "Km",
                    "name": "kilometer",
                    "conversionFactor": 0.0000254,
                    "id": "kilometer"
                }]
            },
            "ANGULARDISTANCE": {
                "unit": [{
                    "symbol": "rad",
                    "name": "radian",
                    "conversionFactor": 6.28318530717958,
                    "id": "radian",
                    "isSI": true
                }, {
                    "symbol": "deg",
                    "name": "degree",
                    "conversionFactor": 360,
                    "id": "degree"
                }, {
                    "symbol": "rev",
                    "name": "revolution",
                    "conversionFactor": 1,
                    "id": "revolution",
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "min",
                    "name": "minute",
                    "conversionFactor": 21600,
                    "id": "minute"
                }]
            },
            "VELOCITY": {
                "unit": [{
                    "symbol": "m/sec",
                    "name": "meter/second",
                    "conversionFactor": 0.0254,
                    "id": "meterpersecond",
                    "isSI": true
                }, {
                    "symbol": "cm/sec",
                    "name": "centimeter/second",
                    "conversionFactor": 2.54,
                    "id": "centimeterpersecond"
                }, {
                    "symbol": "mm/sec",
                    "name": "millimeter/second",
                    "conversionFactor": 25.4,
                    "id": "millimeterpersecond",
                    "isMetric": true
                }, {
                    "symbol": "in/sec",
                    "name": "inch/second",
                    "conversionFactor": 1,
                    "id": "inchpersecond",
                    "isImperial": true
                }, {
                    "symbol": "ft/sec",
                    "name": "feet/second",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feetpersecond"
                }, {
                    "symbol": "ft/min",
                    "name": "feet/minute",
                    "conversionFactor": 5,
                    "id": "feetperminute"
                }]
            },
            "ANGULARVELOCITY": {
                "unit": [{
                    "symbol": "rad/sec",
                    "name": "radian/second",
                    "conversionFactor": 1,                    
                    "isSI": true,
                    "id": "radianpersecond"
                    
                }, {
                    "symbol": "deg/sec",
                    "name": "degree/second",
                    "conversionFactor": 57.2957795130823,
                    "id": "degreepersecond"
                }, {
                    "symbol": "rev/sec",
                    "name": "revolution/second",
                    "conversionFactor": 0.159154943091895,
                    "id": "revolutionpersecond"
                }, {
                    "symbol": "rpm",
                    "name": "revolutions/minute",
                    "conversionFactor": 9.54929658551372,
                    "id": "revolutionsperminute",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "ACCELERATION": {
                "unit": [{
                    "symbol": "m/sec&sup2;",
                    "name": "meter/second²",
                    "conversionFactor": 0.0254,
                    "id": "meterpersecondsquare",
                    "isSI": true
                }, {
                    "symbol": "cm/sec&sup2;",
                    "name": "centimeter/second²",
                    "conversionFactor": 2.54,
                    "id": "centimeterpersecondsquare"
                }, {
                    "symbol": "mm/sec&sup2;",
                    "name": "millimeter/second²",
                    "conversionFactor": 25.4,
                    "id": "millimeterpersecondsquare",
                    "isMetric": true
                }, {
                    "symbol": "in/sec&sup2;",
                    "name": "inch/second²",
                    "conversionFactor": 1,
                    "id": "inchpersecondsquare",
                    "isImperial": true
                }, {
                    "symbol": "ft/sec&sup2;",
                    "name": "feet/second²",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feetpersecondsquare"
                }, {
                    "symbol": "g",
                    "name": "gravity acceleration",
                    "conversionFactor": 0.00259007914966232,
                    "id": "gravityacceleration"
                }]
            },
            "ANGULARACCELERATION": {
                "unit": [{
                    "symbol": "rad/sec&sup2;",
                    "name": "radian/second²",
                    "conversionFactor": 1,
                    "id": "radianpersecondsquare",
                    "isSI": true
                }, {
                    "symbol": "deg/sec&sup2;",
                    "name": "degree/second²",
                    "conversionFactor": 57.2957795130823,
                    "id": "degreepersecondsquare"
                }, {
                    "symbol": "rev/sec&sup2;",
                    "name": "revolutions/second²",
                    "conversionFactor": 0.159154943091895,
                    "id": "revolutionspersecondsquare"
                }, {
                    "symbol": "rpm/sec",
                    "name": "revolutions per minute/second",
                    "conversionFactor": 9.54929658551372,
                    "id": "revolutionsperminutepersecond",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "TIME": {
                "unit": [{
                    "symbol": "sec",
                    "name": "second",
                    "conversionFactor": 60,
                    "id": "second",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "min",
                    "name": "minute",
                    "conversionFactor": 1,
                    "id": "minute"
                }, {
                    "symbol": "msec",
                    "name": "millisecond",
                    "conversionFactor": 60000,
                    "id": "millisecond"
                }]
            },
            "MASS": {
                "unit": [{
                    "symbol": "kg",
                    "name": "kilogram",
                    "conversionFactor": 0.0283495199999999,
                    "id": "kilogram",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "gm",
                    "name": "gram",
                    "conversionFactor": 28.3495199999999,
                    "id": "gram"
                }, {
                    "symbol": "oz",
                    "name": "ounce",
                    "conversionFactor": 1,
                    "id": "ounce"
                }, {
                    "symbol": "lb",
                    "name": "pound",
                    "conversionFactor": 0.0625,
                    "id": "pound",
                    "isImperial": true
                }]
            },
            "FORCE": {
                "unit": [{
                    "symbol": "N",
                    "name": "newton",
                    "conversionFactor": 4.4482216153,
                    "id": "newton",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kgf",
                    "name": "kilogram-force",
                    "conversionFactor": 0.45359237,
                    "id": "kilogramforce"
                }, {
                    "symbol": "lbf",
                    "name": "pound-force",
                    "conversionFactor": 1,
                    "id": "poundforce",
                    "isImperial": true
                }, {
                    "symbol": "dyne",
                    "name": "dyne",
                    "conversionFactor": 444822.161526051,
                    "id": "dyne"
                }]
            },
            "TORQUE": {
                "unit": [{
                    "symbol": "N-m",
                    "name": "newton-meter",
                    "conversionFactor": 0.007061552,
                    "id": "newtonmeter",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "oz-in",
                    "name": "ounce-inch",
                    "conversionFactor": 1,
                    "id": "ounceinch"
                }, {
                    "symbol": "lb-in",
                    "name": "pound-inch",
                    "conversionFactor": 0.0625,
                    "id": "poundinch",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft",
                    "name": "pound-feet",
                    "conversionFactor": 0.00520833333333333,
                    "id": "poundfeet"
                }]
            },
            "INERTIA": {
                "unit": [{
                    "symbol": "kg-m&sup2;",
                    "name": "kilogram-meter²",
                    "conversionFactor": 0.00001828997852042,
                    "id": "kilogrammetersquare",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kg-cm&sup2;",
                    "name": "kilogram-centimeter²",
                    "conversionFactor": 0.1828997852042,
                    "id": "kilogramcentimetersquare"
                }, {
                    "symbol": "Nm-s&sup2;",
                    "name": "newton-meter-second²",
                    "conversionFactor": 0.00001828997852042,
                    "id": "newtonmetersecondsquare"
                }, {
                    "symbol": "oz-in-s&sup2;",
                    "name": "ounce-inch-second²",
                    "conversionFactor": 0.002590079179883,
                    "id": "ounceinchsecondsquare"
                }, {
                    "symbol": "lb-in-s&sup2;",
                    "name": "pound-inch-second²",
                    "conversionFactor": 0.0001618799487976,
                    "id": "poundinchsecondsquare",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft-s&sup2;",
                    "name": "pound-feet-second²",
                    "conversionFactor": 0.00001348999573283,
                    "id": "poundfeetsecondsquare"
                }, {
                    "symbol": "oz-in&sup2;",
                    "name": "ounce-inch²",
                    "conversionFactor": 1,
                    "id": "ounceinchsquare"
                }, {
                    "symbol": "lb-in&sup2;",
                    "name": "pound-inch²",
                    "conversionFactor": 0.06250000061883,
                    "id": "INERTIA_8"
                }, {
                    "symbol": "lb-ft&sup2;",
                    "name": "pound-feet²",
                    "conversionFactor": 0.0004340277820752,
                    "id": "poundfeetsquare"
                }, {
                    "symbol": "gm-mm&sup2;",
                    "name": "gram-millimeter²",
                    "conversionFactor": 18289.97852042,
                    "id": "grammillimetersquare"
                }, {
                    "symbol": "Kg-mm&sup2;",
                    "name": "kilogram-millimeter²",
                    "conversionFactor": 18.28997852042,
                    "id": "kilogrammillimetersquare"
                }]
            },
            "POWER": {
                "unit": [{
                    "symbol": "watts",
                    "name": "watts",
                    "conversionFactor": 746,
                    "id": "watts",
                    "isSI": true
                }, {
                    "symbol": "HP",
                    "name": "horsepower",
                    "conversionFactor": 1,
                    "id": "horsepower",
                    "isImperial": true
                }, {
                    "symbol": "kW",
                    "name": "kilo-watt",
                    "conversionFactor": 0.746,
                    "id": "kilowatt",
                    "isMetric": true
                }]
            },
            "TEMPERATURE": {
                "unit": [{
                    "symbol": "&#176;C",
                    "name": "celsius",
                    "conversionFactor": 1,
                    "id": "celsius",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "&#176;F",
                    "name": "fahrenheit",
                    "conversionFactor": 1,
                    "id": "fahrenheit",
                    "isImperial": true
                }]
            },
            "TORQUECONSTANT": {
                "unit": [{
                    "symbol": "Nm/A",
                    "name": "newton-meter/ampere",
                    "conversionFactor": 1,
                    "id": "newtonmeterperampere",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kg-m/A",
                    "name": "kilogram-meter/ampere",
                    "conversionFactor": 0.101971621296887,
                    "id": "kilogrammeterperampere"
                }, {
                    "symbol": "kg-cm/A",
                    "name": "kilogram-cm/ampere",
                    "conversionFactor": 10.1971621296887,
                    "id": "kilogramcmperampere"
                }, {
                    "symbol": "gm-cm/A",
                    "name": "gram-centimeter/ampere",
                    "conversionFactor": 10197.1621296887,
                    "id": "gramcentimeterperampere"
                }, {
                    "symbol": "oz-in/A",
                    "name": "ounce-inch/ampere",
                    "conversionFactor": 141.61193228,
                    "id": "ounceinchperampere"
                }, {
                    "symbol": "lb-in/A",
                    "name": "pound-inch/ampere",
                    "conversionFactor": 8.85074577,
                    "id": "poundinchampere",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft/A",
                    "name": "pound-feet/ampere",
                    "conversionFactor": 0.73756215,
                    "id": "poundfeetperampere"
                }]
            },
            "DAMPINGCONSTANT": {
                "unit": [{
                    "symbol": "Nm/krpm",
                    "name": "newton-meter/krpm",
                    "conversionFactor": 1,
                    "id": "newtonmeterperkrpm"
                }, {
                    "symbol": "kg-m/krpm",
                    "name": "kilogram-meter/krpm",
                    "conversionFactor": 0.101971621296887,
                    "id": "kilogrammeterperkrpm"
                }, {
                    "symbol": "kg-cm/krpm",
                    "name": "kilogram-centimeter/krpm",
                    "conversionFactor": 10.1971621296887,
                    "id": "kilogramcentimeterperkrpm"
                }, {
                    "symbol": "gm-cm/krpm",
                    "name": "gram-centimeter/krpm",
                    "conversionFactor": 10197.1621296887,
                    "id": "gramcentimeterperkrpm"
                }, {
                    "symbol": "oz-in/krpm",
                    "name": "ounce-inch/krpm",
                    "conversionFactor": 141.61193228,
                    "id": "ounceinchperkrpm"
                }, {
                    "symbol": "lb-in/krpm",
                    "name": "pound-inch/krpm",
                    "conversionFactor": 8.85074577,
                    "id": "poundinchperkrpm",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft/krpm",
                    "name": "pound-feet/krpm",
                    "conversionFactor": 0.73756215,
                    "id": "poundfeetperkrpm"
                }, {
                    "symbol": "Nm/rad/sec",
                    "name": "newton-meter/radian/second",
                    "conversionFactor": 0.00954929658551372,
                    "id": "newtonmeterperradianpersecond",
                    "isSI": true,
                    "isMetric": true
                }]
            },
            "THERMALRESISTANCE": {
                "unit": [{
                    "symbol": "ºC/Watt",
                    "name": "celsius/watt",
                    "conversionFactor": 1,
                    "id": "celsiusperwatt",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "RESISTANCE": {
                "unit": [{
                    "symbol": "Ohms",
                    "name": "ohms",
                    "conversionFactor": 1,
                    "id": "ohms",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "INDUCTANCE": {
                "unit": [{
                    "symbol": "H",
                    "name": "henry",
                    "conversionFactor": 1,
                    "id": "henry",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "CURRENT": {
                "unit": [{
                    "symbol": "A(0-pk)",
                    "name": "ampere(0 to peak)",
                    "conversionFactor": 1,
                    "id": "amperezerotopeak",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "A(RMS)",
                    "name": "ampere(root mean square)",
                    "conversionFactor": 0.707106781186547,
                    "id": "ampererootmeansquare"
                }]
            },
            "TEMPERATURECOFFICIENT": {
                "unit": [{
                    "symbol": "/ºC",
                    "name": "/celsius",
                    "conversionFactor": 1,
                    "id": "percelsius",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "%/ºC",
                    "name": "%/celsius",
                    "conversionFactor": 100,
                    "id": "percentagepercelsius",
                    "isImperial": true
                }]
            },
            "CAPACITANCE": {
                "unit": [{
                    "symbol": "F",
                    "name": "farad",
                    "conversionFactor": 1,
                    "id": "farad",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "µF",
                    "name": "micro-farad",
                    "conversionFactor": 1000000,
                    "id": "microfarad"
                }]
            },
            "VOLTAGE": {
                "unit": [{
                    "symbol": "Volts",
                    "name": "volts",
                    "conversionFactor": 1,
                    "id": "volts",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "DENSITY": {
                "unit": [{
                    "symbol": "Kg/m&sup3",
                    "name": "kilogram/meter³",
                    "conversionFactor": 27679.9047,
                    "id": "kilogrampermetercube",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "Kg/cm&sup3",
                    "name": "kilogram/centimeter³",
                    "conversionFactor": 0.0276799047,
                    "id": "kilogrampercentimetercube"
                }, {
                    "symbol": "gm/m&sup3",
                    "name": "gram/meter³",
                    "conversionFactor": 27679904.7,
                    "id": "grampermetercube"
                }, {
                    "symbol": "lb/in&sup3",
                    "name": "pound/inch³",
                    "conversionFactor": 1,
                    "id": "poundperinchcube",
                    "isImperial": true
                }, {
                    "symbol": "lb/ft&sup3",
                    "name": "pound/feet³",
                    "conversionFactor": 1728,
                    "id": "poundperfeetcube"
                }, {
                    "symbol": "gm/cm&sup3",
                    "name": "gram/centimeter³",
                    "conversionFactor": 27.6799047,
                    "id": "grampercentimetercube",
                    "isMetric": true
                }]
            },
            "ROLLOFF": {
                "unit": [{
                    "symbol": "Nm/(rad/sec)&sup2",
                    "name": "newton-meter/(radian/second)²",
                    "conversionFactor": 1,
                    "id": "newtonmeterperradianpersecondsquare",
                    "isSI": true,
                    "isMetric": true
                }]
            },
            "MAGNETTEMPCOFFICIENT": {
                "unit": []
            },
            "LEAD": {
                "unit": [{
                    "symbol": "mm/rev",
                    "name": "millimeter/revolution",
                    "conversionFactor": 1,
                    "id": "millimeterperrevolution",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "in/rev",
                    "name": "inch/revolution",
                    "conversionFactor": 0.03937007874016,
                    "id": "inchperrevolution",
                    "isImperial": true
                }]
            },
            "INCLINATION": {
                "unit": [{
                    "symbol": "rad",
                    "name": "radian",
                    "conversionFactor": 0.0174532925199433,
                    "id": "radian",
                    "isSI": true
                }, {
                    "symbol": "deg",
                    "name": "radian",
                    "conversionFactor": 1,
                    "id": "radian",
                    "isMetric": true
                }]
            },
            "DIAMETER": {
                "unit": [{
                    "symbol": "mm",
                    "name": "millimeter",
                    "conversionFactor": 25.4,
                    "id": "millimeter",
                    "isMetric": true
                }, {
                    "symbol": "cm",
                    "name": "centimeter",
                    "conversionFactor": 2.54,
                    "id": "centimeter"
                }, {
                    "symbol": "m",
                    "name": "meter",
                    "conversionFactor": 0.0254,
                    "id": "meter",
                    "isSI": true
                }, {
                    "symbol": "in",
                    "name": "inch",
                    "conversionFactor": 1,
                    "id": "inch",
                    "isImperial": true
                }, {
                    "symbol": "ft",
                    "name": "feet",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feet"
                }]
            },
            "FORCECONSTANT": {
                "unit": [{
                    "symbol": "N/A",
                    "name": "newton/ampere",
                    "conversionFactor": 1,
                    "id": "newtonperampere",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kg/A",
                    "name": "kilogram/ampere",
                    "conversionFactor": 0.101971621296887,
                    "id": "kilogramperampere"
                }, {
                    "symbol": "gm/A",
                    "name": "gram/ampere",
                    "conversionFactor": 101.971621296887,
                    "id": "gramperampere"
                }, {
                    "symbol": "oz/A",
                    "name": "ounce/ampere",
                    "conversionFactor": 3.59694,
                    "id": "ounceperampere"
                }, {
                    "symbol": "lb/A",
                    "name": "pound/ampere",
                    "conversionFactor": 0.224809,
                    "id": "poundperampere",
                    "isImperial": true
                }]
            },
            "ENERGY": {
                "unit": [{
                    "symbol": "J",
                    "name": "joules",
                    "conversionFactor": 1,
                    "id": "joules",
                    "isSI": true
                }]
            },
            "LIFE": {
                "unit": [{
                    "symbol": "Year",
                    "name": "year",
                    "conversionFactor": 1,
                    "id": "year",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "Days",
                    "name": "days",
                    "conversionFactor": 365,
                    "id": "days"
                }, {
                    "symbol": "Weeks",
                    "name": "weeks",
                    "conversionFactor": 52.1428571428571,
                    "id": "weeks"
                }]
            },
            "ALTITUDE": {
                "unit": [{
                    "symbol": "m",
                    "name": "meter",
                    "conversionFactor": 0.0254,
                    "id": "meter",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "cm",
                    "name": "centimeter",
                    "conversionFactor": 2.54,
                    "id": "centimeter"
                }, {
                    "symbol": "mm",
                    "name": "millimeter",
                    "conversionFactor": 25.4,
                    "id": "millimeter"
                }, {
                    "symbol": "in",
                    "name": "inch",
                    "conversionFactor": 1,
                    "id": "inch"
                }, {
                    "symbol": "ft",
                    "name": "feet",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feet",
                    "isImperial": true
                }, {
                    "symbol": "Km",
                    "name": "kilometer",
                    "conversionFactor": 0.0000254,
                    "id": "kilometer"
                }]
            },
            "LINEARDAMPING": {
                "unit": [{
                    "symbol": "N/m/s",
                    "name": "newton/meter/second",
                    "conversionFactor": 175.126818058489,
                    "id": "newtonpermeterpersecond",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kgf/m/s",
                    "name": "kilogram-force/meter/second",
                    "conversionFactor": 17.8579653543307,
                    "id": "kilogramforcepermeterpersecond"
                }, {
                    "symbol": "lbf/in/s",
                    "name": "pound-force/inch/second",
                    "conversionFactor": 1,
                    "id": "poundforceperinchpersecond",
                    "isImperial": true
                }]
            },
            "CURRENCY": {
                "unit": [{
                    "symbol": "$(USD)",
                    "name": "dollar",
                    "conversionFactor": 1,
                    "id": "dollar",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "EUR",
                    "name": "euro",
                    "conversionFactor": 0.703,
                    "id": "euro"
                }, {
                    "symbol": "GBP",
                    "name": "great british pound",
                    "conversionFactor": 0.491,
                    "id": "greatbritishpound",
                    "isImperial": true
                }]
            },
            "JERK": {
                "unit": [{
                    "symbol": "m/sec&sup3",
                    "name": "meter/second³",
                    "conversionFactor": 0.0254,
                    "id": "meterpersecondcube",
                    "isSI": true
                }, {
                    "symbol": "cm/sec&sup3",
                    "name": "centimeter/second³",
                    "conversionFactor": 2.54,
                    "id": "centimeterpersecondcube"
                }, {
                    "symbol": "mm/sec&sup3",
                    "name": "millimeter/second³",
                    "conversionFactor": 25.4,
                    "id": "millimeterpersecondcube",
                    "isMetric": true
                }, {
                    "symbol": "in/sec&sup3",
                    "name": "inches/second³",
                    "conversionFactor": 1,
                    "id": "inchespersecondcube",
                    "isImperial": true
                }, {
                    "symbol": "ft/sec&sup3",
                    "name": "feet/second³",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feetpersecondcube"
                }]
            },
            "VOLUME": {
                "unit": [{
                    "symbol": "m&sup3",
                    "name": "meter³",
                    "conversionFactor": 0.000016387064,
                    "id": "metercube",
                    "isSI": true
                }, {
                    "symbol": "cm&sup3",
                    "name": "centimeter³",
                    "conversionFactor": 16.387064,
                    "id": "centimetercube"
                }, {
                    "symbol": "mm&sup3",
                    "name": "millimeter³",
                    "conversionFactor": 16387.064,
                    "id": "millimetercube"
                }, {
                    "symbol": "in&sup3",
                    "name": "inch³",
                    "conversionFactor": 1,
                    "id": "inchcube",
                    "isImperial": true
                }, {
                    "symbol": "ft&sup3",
                    "name": "feet³",
                    "conversionFactor": 0.000578704,
                    "id": "feetcube"
                }]
            },
            "AREA": {
                "unit": [{
                    "symbol": "m&sup2",
                    "name": "meter²",
                    "conversionFactor": 0.000645159999999949,
                    "id": "metersquare",
                    "isSI": true
                }, {
                    "symbol": "cm&sup2",
                    "name": "centimeter²",
                    "conversionFactor": 6.4516,
                    "id": "centimetersquare"
                }, {
                    "symbol": "mm&sup2",
                    "name": "millimeter²",
                    "conversionFactor": 645.16,
                    "id": "millimetersquare"
                }, {
                    "symbol": "in&sup2",
                    "name": "inch²",
                    "conversionFactor": 1,
                    "id": "inchsquare",
                    "isImperial": true
                }, {
                    "symbol": "ft&sup2",
                    "name": "feet²",
                    "conversionFactor": 0.00694444444444438,
                    "id": "feetsquare"
                }]
            },
            "ANGULARJERK": {
                "unit": [{
                    "symbol": "rad/sec&sup3",
                    "name": "radian/second³",
                    "conversionFactor": 1,
                    "id": "radianpersecondcube",
                    "isSI": true
                }, {
                    "symbol": "deg/sec&sup3",
                    "name": "degree/second³",
                    "conversionFactor": 57.2957795130823,
                    "id": "degreepersecondcube"
                }, {
                    "symbol": "rev/sec&sup3",
                    "name": "revolution/second³",
                    "conversionFactor": 0.159154943091895,
                    "id": "revolutionpersecondcube"
                }, {
                    "symbol": "rpm/sec&sup2",
                    "name": "revolution-per-minute/second²",
                    "conversionFactor": 9.54929658551372,
                    "id": "revolutionperminutepersecondsquare",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "MOMENT": {
                "unit": [{
                    "symbol": "N-m",
                    "name": "newton-meter",
                    "conversionFactor": 0.007061552,
                    "id": "newtonpermeter",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "oz-in",
                    "name": "ounce-inch",
                    "conversionFactor": 1,
                    "id": "ounceinch"
                }, {
                    "symbol": "lb-in",
                    "name": "pound-inch",
                    "conversionFactor": 0.0625,
                    "id": "poundinch",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft",
                    "name": "pound-feet",
                    "conversionFactor": 0.00520833333333333,
                    "id": "poundfeet"
                }]
            },
            "BANDWIDTH": {
                "unit": [{
                    "symbol": "1/sec",
                    "name": "1/second",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "onepersecond",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "INTEGRAL": {
                "unit": [{
                    "symbol": "1/ms-s",
                    "name": "1/ms-s",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "onepermss",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "STIFFNESSROTARY": {
                "unit": [{
                    "symbol": "Nm/deg",
                    "name": "newton-meter/degree",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "newtonmeterperdegree",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "BACKLASH": {
                "unit": [{
                    "symbol": "arc min",
                    "name": "arc minute",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "arcminute",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "FREQUENCY": {
                "unit": [{
                    "symbol": "Hz",
                    "name": "hertz",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "hertz",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "PRESSURE": {
                "unit": [{
                    "symbol": "GPa",
                    "name": "giga-pascal",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "gigapascal",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "THERMALMASS": {
                "unit": [{
                    "symbol": "J/ºC",
                    "name": "joules/celsius",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "joulespercelsius"
                }]
            },
            "STIFFNESSLINEAR": {
                "unit": [{
                    "symbol": "N/mm",
                    "name": "newton/millimeter",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "newtonpermillimeter",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "PERCENTAGE": {
                "unit": [{
                    "symbol": "%",
                    "name": "percentage",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "percentage",
                    "isMetric": true,
                    "isImperial": true
                }]
            }
        }
}
; //Setup Namspace
window.COSMATT = window.COSMATT || {};

COSMATT.UNITCONVERTER = (function() {

  //loading unitData.json from some external url
  /*  $.ajax({
            dataType: "text",
            url: '../libs-frontend-unitcombobox/src/data/unitData.json',
            async: false,
            success: function(data) {
             
                unitData = $.parseJSON(data);
            },
            error: function(error) {
                console.error("Json is not loaded");
            }
        });
*/



  /*  convertedValue function return converted value based on provided inputs
   * unitType can be: Time or ANGULARACCELERATION or MASS etc  
   * value : input box current value
   * unitFrom : combo box current selected unit name
   * unitTo : combo box changed unit name
   */
  var convertedValue = function(unitType, value, unitFrom, unitTo) {
    try {
      var convertedValue = "";
      if(unitType === 'TEMPERATURE'){
        convertedValue = temperatureConversion (value, unitFrom, unitTo);
      }
      else{
        var unitFromConverionFactor = "";
        var unitToConverionFactor = "";
        unitNode = unitData.unitType[unitType].unit;
        for (var loop = 0; loop < unitNode.length; loop++) {
          if (unitNode[loop].id == unitFrom) {
            unitFromConverionFactor = (unitNode[loop].conversionFactor);
          }
          if (unitNode[loop].id == unitTo) {
            unitToConverionFactor = (unitNode[loop].conversionFactor);
          }
        }
        convertedValue = (unitToConverionFactor / unitFromConverionFactor) * value;
      }
      
      return (convertedValue);
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };


 /*  Function to convert tempertature from celsius to fahrenheit and vise versa
   * value : input box current value
   * unitFrom : combo box current selected unit name
   * unitTo : combo box changed unit name
   */
  var temperatureConversion = function(value, unitFrom, unitTo){
      var convertedValue = '';
      switch (unitFrom) {
        case "celsius":            
          convertedValue = (value * 9 / 5 ) + 32;
        break;
        case "fahrenheit":
          convertedValue = (value - 32) * 5 / 9;
        break;
      }
      return convertedValue;
  };

  /*  units function return array of units.
   * input vaulue is string of unitType 
   * unitType can be: Time or ANGULARACCELERATION or MASS etc  
   */
  var units = function(unitType) {
    try {
      var units = [];
      var unitNode = [];
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        units.push(unitNode[loop].symbol);
      }
      return units;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }


  };
  var unitsAndIds = function(unitType) {
    try {
      var units = [];
      var unitNode = [];

      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        var unitsObj = {};
        unitsObj['name'] = unitNode[loop].symbol;
        unitsObj['id'] = unitNode[loop].id;
        units.push(unitsObj);
      }

      return units;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }


  };
  /*  SIUnit function return unitType SI unit name
   * input vaulue is string of unitType 
   * Example :unitType = 'TIME' 
   * function will return 'sec'
   */
  var SIUnit = function(unitType) {
    try {
      var SIUnitObj = {};
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].isSI != undefined && unitNode[loop].isSI == true) {
          SIUnitObj.name = unitNode[loop].symbol;
          SIUnitObj.id = unitNode[loop].id;
        }
      }
      return SIUnitObj;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };

  var SIValue = function(unitType, selectedUnit, value) {
    try {
      var SIUnitIndex;
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].isSI != undefined && unitNode[loop].isSI == true) {
          SIUnitIndex = loop;
          break;
        }
      }
      if (SIUnitIndex === selectedUnit) {
        return value;
      }
      return (value * conversionRatio(unitType, selectedUnit, SIUnitIndex));
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };
  /* conversionFactor function return value of conversion factor for each unit type
   * input vaulue is string of unitType and unitName
   * Example :unitType = 'TIME',  unitName = 'msec'
   * function will return '60000'
   */
  var conversionFactor = function(unitType, unitName) {
    try {
      var conversionFactor = '';
      unitNode = unitData.unitType[unitType].unit;

      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].id == unitName) {
          conversionFactor = unitNode[loop].conversionFactor;
        }


      }
      return conversionFactor;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };

  /* conversionFactor function return value of conversion factor for each unit type
   * input vaulue is string of unitType and unitName
   * Example :unitType = 'TIME',  unitName = 'msec'
   * function will return '60000'
   */
  var conversionRatio = function(unitType, prevIndex, newIndex) {
    try {
      var prevConversionFactor = 1;
      var newConversionFactor = 1;
      unitNode = unitData.unitType[unitType].unit;

      for (var loop = 0; loop < unitNode.length; loop++) {
        if (loop == prevIndex) {
          prevConversionFactor = unitNode[loop].conversionFactor;
        }
        if (loop == newIndex) {
          newConversionFactor = unitNode[loop].conversionFactor;
        }
      }
      return newConversionFactor / prevConversionFactor;
    } catch (errorMessage) {
      console.log('Error : ' + errorMessage);
    }

  };

  /* conversionFactor function return value of conversion factor for each unit type
   * input vaulue is string of unitType and unitName
   * Example :unitType = 'TIME',  unitName = 'msec'
   * function will return '60000'
   */
  var conversionRatioById = function(unitType, unitFrom, UnitTo) {
    try {
      var prevConversionFactor = 1;
      var newConversionFactor = 1;
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitFrom == "SI" && unitNode[loop].isSI) {
          prevConversionFactor = unitNode[loop].conversionFactor;
        } else if (unitNode[loop].id == unitFrom) {
          prevConversionFactor = unitNode[loop].conversionFactor;
        }

        if (UnitTo == "SI" && unitNode[loop].isSI) {
          newConversionFactor = unitNode[loop].conversionFactor;
        } else if (unitNode[loop].id == UnitTo) {
          newConversionFactor = unitNode[loop].conversionFactor;
        }
      }
      return newConversionFactor / prevConversionFactor;
    } catch (errorMessage) {
      console.log('Error : ' + errorMessage);
    }

  };

  var unitDetails = function(unitType, unit) {
    try {
      var unitNode = [];

      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].id == unit) {
          return (unitNode[loop]);
        }
      }
      return null;
    } catch (errorMessage) {
      console.log('Error : ' + errorMessage);
    }
  }


  /* PUBLIC METHODS */
  return {
    // Exposed functions
    getUnits: units,
    getunitsAndIds: unitsAndIds,
    getSIUnit: SIUnit,
    getSIValue: SIValue,
    getUnitConvertedValue: convertedValue,
    getConversionFactor: conversionFactor,
    getConversionRatio: conversionRatio,
    getConversionRatioById: conversionRatioById,
    getUnitDetails: unitDetails

  };

}());
(function ($) {

    // add the plugin to the jQuery.fn object
    $.fn.unitsComboBox = function (options) {
        // default values 
        var defaults = {
            "unitType": "",
            "unit": "",
            "roundOfNumber": "",
            "value": "",
            "show": "true",
            "enable": {
                "textbox": "true",
                "comboBox": "true"
            },
            "comboBoxWidthRatio": {
                "textBox": "60%",
                "comboBox": "40%"
            },
            "step": "0.1",
            "dataRule": "currency",
            "userEnteredValue":"",
            "userEnteredUnit":"",
            "numberFormatterOptions": {
            },
            callBackFn: function () { }
        }

        // current instance of the object
        var plugin = this;
        var timerId = 0;
        plugin.settings = {}
        var $element = $(this); // reference to the jQuery version of DOM element  
        // the plugin's final properties are the merged default and
        plugin.settings = $.extend({}, defaults, options);
        var numberFormatter = new Cosmatt.NumberFormatter(plugin.settings.numberFormatterOptions);

        // the "constructor" method that gets called when the object is created
        plugin.init = function () {

            // function is called to intialze dom element
            createComboBox(plugin.settings.unitType);

        }

        /** public function to update plugin contols based on inputs  **/
        plugin.update = function (options) {
            var newOptions = $.extend({}, plugin.settings, options);

            $element.find('.cosmatt-unitComboBox')[newOptions.show == 'true' ? 'show' : 'hide']();

            newOptions.enable.textbox == 'true' ? $element.find('.cosmatt-unitComboBox').find('input').removeAttr('disabled') :
                $element.find('.cosmatt-unitComboBox').find('input').attr('disabled', 'disabled');

            newOptions.enable.comboBox == 'true' ? $element.find('.cosmatt-unitComboBox').find('.btn-group').find('button').removeAttr('disabled') :
                $element.find('.cosmatt-unitComboBox').find('.btn-group').find('button').attr('disabled', 'disabled');

            $element.find('.cosmatt-unitComboBox').find('.unitTextBox')[newOptions.showComboBoxOnly == 'true' ? 'hide' : 'show']();

            $element.find('.cosmatt-unitComboBox').find('.unitComboBox')[newOptions.showTextBoxOnly == 'true' ? 'hide' : 'show']();
        };

        /** public function return SI value for provided unit type **/
        plugin.getSIValue = function () {

            var textboxValue = 0;
            var SIUnitObj = '';
            if (typeof COSMATT.UNITCONVERTER === 'object') {
                SIUnitObj = COSMATT.UNITCONVERTER.getSIUnit(plugin.settings.unitType);

                //textboxValue = $element.find(".amount_" + plugin.settings.unitType).val();
                var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, plugin.settings.value, plugin.settings.unit, SIUnitObj.id);

                return convertedVal;
            }
        };

        /** public function return value in selected unit type from dropdown **/
        plugin.getValueInSelectedUnit = function (siVal) {



            // var textboxValue = 0;
            var SIUnitObj = '';
            if (typeof COSMATT.UNITCONVERTER === 'object') {
                SIUnitObj = COSMATT.UNITCONVERTER.getSIUnit(plugin.settings.unitType);

                // textboxValue = $element.find(".amount_" + plugin.settings.unitType).val();
                var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, siVal, SIUnitObj.id, plugin.settings.unit);
                return convertedVal;
            }
        };

        /** public function return SI value for provided unit type **/
        plugin.getConversionFactor = function () {

            var textboxValue = 0;
            var conversionfactor = '';
            if (typeof COSMATT.UNITCONVERTER === 'object') {
                conversionfactor = COSMATT.UNITCONVERTER.getConversionFactor(plugin.settings.unitType, plugin.settings.unit);

            }
            return conversionfactor;
        };
        /** public function set DropBox Item **/
        plugin.setDropBoxItem = function (optionId) {

            $element.find('.dropdown-menu a').filter(function (ele, option) {
                $element.find('a.selected').removeClass('selected');
                return $(option).data('id') == optionId;
            }).addClass("selected");

            $element.find('button.boxSelectedVal').text($element.find('a.selected').text());


            var textboxValue = 0;
            textboxValue = plugin.settings.value;
            if (textboxValue === '') {
                plugin.setTextBoxValue(textboxValue);
                plugin.settings.unit = $element.find('a.selected').data('id');
                return;
            }

            if (plugin.settings.showComboBoxOnly == 'true') {
                var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, 1, plugin.settings.unit, $element.find('a.selected').data('id'));
            } else {
                var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, textboxValue, plugin.settings.unit, $element.find('a.selected').data('id'));
            }

            // conversionfactor = COSMATT.UNITCONVERTER.getConversionFactor(plugin.settings.unitType, $(this).val());

            plugin.settings.unit = $element.find('a.selected').data('id');
            plugin.settings.userEnteredUnit = plugin.settings.unit; 
            plugin.setTextBoxValue(convertedVal);
        }
        /** public function to set Value in SI unit **/
        plugin.setSIValue = function (value) {
            var SIUnit = COSMATT.UNITCONVERTER.getSIUnit(plugin.settings.unitType);
            var currentValue = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, value, SIUnit.id, plugin.settings.unit);

            plugin.setTextBoxValue(currentValue);
        }
        /** public function set TextboxValue **/
        plugin.setTextBoxValue = function (value) {

            var stringToNum;

            if (value === '') {
                stringToNum = value;
            } else {
                stringToNum = Number(value);
            }
            plugin.settings.value = value;

            /** Update the stored values if we update dynamically textbox value from x to y **/
            if(plugin.settings.userEnteredUnit === plugin.settings.unit){
                saveUserEnteredData();
            }
            

            plugin.formatTextBoxValue(value);
            // if (plugin.settings.roundOfNumber !== '' && stringToNum !== '') {
            //   // stringToNum = (stringToNum).toFixed(plugin.settings.roundOfNumber);
            //   // stringToNum = (stringToNum).toFixed(plugin.settings.roundOfNumber);
            //   var decimalPlaces = Math.pow(10, plugin.settings.roundOfNumber);
            //   stringToNum = Math.round(stringToNum * decimalPlaces) / decimalPlaces;
            // }

            //$element.find(".amount_" + plugin.settings.unitType).val(stringToNum);
            //$element.find(".amount_" + plugin.settings.unitType).attr('title', plugin.settings.value);
        };
        plugin.formatTextBoxValue = function (value) {
            if ($element.find(".unitTextBox input").is(":focus")) {
                console.log("input has focus, don't format")
                return;
            }
            if (numberFormatter) {
                value = numberFormatter.format(value, true);
            }
            $element.find(".amount_" + plugin.settings.unitType).val(value);
        };
        /* private method
         *  createComboBox functions is responsible to create dopdown,textbox and attache event handler 
         *  input value TIME or ANGULARACCELERATION or MASS etc 
         */
        var createComboBox = function (unitType) {

            var callbackData = {};
            try {
                if (typeof COSMATT.UNITCONVERTER === 'object' && unitType != '') {
                    var dropDownOptions = COSMATT.UNITCONVERTER.getunitsAndIds(unitType);
                    //var UNITSI = COSMATT.UNITCONVERTER.getSIUnit(unitType);

                    var $unitWrapper = $('<div class="cosmatt-unitComboBox"></div>');
                    $element.append($unitWrapper);


                    var $textboxContainer = $('<div class="unitTextBox"></div>');
                    $unitWrapper.append($textboxContainer);


                    var $spinControlWrap = $('<div class="input-group unitComboBoxGrp"></div>');
                    $textboxContainer.append($spinControlWrap);


                    if (plugin.settings.mode == 'spin') {

                        $spinControlWrap.addClass("spinner");

                        $spinControlWrap.attr('data-trigger', 'spinner');

                        var $inputBox = $('<input type="text" class="form-control text-left spin-control amount_' + plugin.settings.unitType + '" value="" data-rule="' + plugin.settings.dataRule + '"></div>');
                        $spinControlWrap.append($inputBox);

                        $inputBox.attr('data-step', plugin.settings.step);
                        var $inputGroup = $('<div class="input-group-addon"></div>');
                        $spinControlWrap.append($inputGroup);

                        var $spinUp = $('<a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a>');
                        $inputGroup.append($spinUp);

                        var $spinDown = $(' <a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a>');
                        $inputGroup.append($spinDown);

                    }
                    else {
                        $spinControlWrap.addClass("defaultTextBox");

                        var $inputBox = $('<input type="text" class="form-control text-left input-control amount_' + plugin.settings.unitType + '" value="" data-rule="' + plugin.settings.dataRule + '"></div>');
                        $spinControlWrap.append($inputBox);
                    }

                    plugin.setTextBoxValue(plugin.settings.value);

                    if (plugin.settings.max != undefined) {
                        $inputBox.attr('max', plugin.settings.max);
                    }
                    else {
                        $inputBox.attr('max', '9999999999');
                    }
                    if (plugin.settings.min != undefined) {
                        $inputBox.attr('min', plugin.settings.min);
                    }
                    else {
                        $inputBox.attr('min', '0');
                    }

                    /***********************Drop Box*************************/
                    for (var loop1 = 0; loop1 < dropDownOptions.length; loop1++) {
                        if (plugin.settings.unit == dropDownOptions[loop1].id) {
                            var selectedUnit = dropDownOptions[loop1].name;
                            var selectedUnitId = dropDownOptions[loop1].id;
                        }
                    }

                    var $unitDropDown = $('<div class="unitComboBox"></div>');
                    $unitWrapper.append($unitDropDown);

                    var $buttonGrp = $('<div class="btn-group"></div>');
                    $unitDropDown.append($buttonGrp);

                    var $btnSecondary = $('<button type="button" data-toggle="dropdown" class="btn btn-default boxSelectedVal" id="comboBox' + plugin.settings.unitType + '">' + selectedUnit + '</button>');
                    $buttonGrp.append($btnSecondary);

                    var $toggleButton = $('<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>');
                    $buttonGrp.append($toggleButton);

                    var $menuItems = $('<ul class="dropdown-menu"></ul>');
                    $buttonGrp.append($menuItems);

                    for (var loop = 0; loop < dropDownOptions.length; loop++) {
                        var $list = $('<li></li>');
                        $menuItems.append($list);
                        var option = $('<a class="dropdown-item">' + dropDownOptions[loop].name + '</a>');
                        option.data('id', dropDownOptions[loop].id);
                        $list.append(option);
                    }

                    $textboxContainer.css('width', plugin.settings.comboBoxWidthRatio.textBox);
                    $unitDropDown.css('width', plugin.settings.comboBoxWidthRatio.comboBox);

                    $element.find('.dropdown-menu a').filter(function (ele, option) {
                        return $(option).data('id') == plugin.settings.unit;
                    }).addClass("selected");


                    plugin.settings.unit = selectedUnitId;
                    initializeComboBoxControl();
                    initializeTextBoxControl();
                    plugin.update({});
                    plugin.settings.SIValue = plugin.getSIValue({});
                    if (typeof plugin.settings.callBackFn == 'function') { // make sure the callback is a function    

                        callbackData.unit = plugin.settings.unit;
                        callbackData.SIValue = plugin.settings.SIValue;
                        plugin.settings.callBackFn.call(callbackData); // brings the scope to the callback
                    }
                }
            } catch (errorMessage) {
                console.log('Error : ' + errorMessage);
            }
        };


        /** Combo box event handler **/

        var initializeComboBoxControl = function () {
            var textboxValue = 0;
            var callbackData = {};

            $element.find('.dropdown-menu a').bind("mousedown", function (event) {

                textboxValue = plugin.settings.value;

                if (textboxValue === '') {
                    plugin.setTextBoxValue(textboxValue);
                    plugin.settings.unit = $(this).data('id');
                    return;
                }

                if (plugin.settings.showComboBoxOnly == 'true') {
                    var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, 1, plugin.settings.unit, $(this).data('id'));
                }
                else {                    
                    /**Added a check if stored unit is equal to current selected unit to fixed the issue COSMATT-1479 **/                   
                    if(plugin.settings.userEnteredUnit === $(this).data('id')){
                      plugin.setTextBoxValue(plugin.settings.userEnteredValue);
                    }
                    else{
                      var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, textboxValue, plugin.settings.unit, $(this).data('id'));
                    }  
                    
                }

                plugin.settings.unit = $(this).data('id');

                $element.find('button.boxSelectedVal').text($(this).text());
                if (convertedVal != undefined) {
                    plugin.setTextBoxValue(convertedVal);
                }


                if (typeof plugin.settings.callBackFn == 'function') { // make sure the callback is a function    


                    callbackData.unit = plugin.settings.unit;
                    callbackData.value = plugin.settings.value;
                    callbackData.SIValue = plugin.getSIValue({});
                    callbackData.type = "dropdown";
                    plugin.settings.callBackFn.call(callbackData); // brings the scope to the callback
                }
            });

        }

        var saveUserEnteredData = function(){
            
            plugin.settings.userEnteredValue = plugin.settings.value;
            plugin.settings.userEnteredUnit = plugin.settings.unit; 
        }

        /** Text box event handler **/

        var initializeTextBoxControl = function () {

            /** Stored the textbox value and selected unit when unitcombo box is initialized **/
            saveUserEnteredData();

            $element.find(".unitTextBox input").on('focus', function () {

                $(this).val(plugin.settings.value)
            });
            $element.find(".unitTextBox input").on('blur', function () {

                plugin.setTextBoxValue(plugin.settings.value);
            });
            $element.find(".unitTextBox input.input-control").on('input', function () {

                var self = this;
                plugin.settings.value = $(self).val();
                /** Update the stored values if user trying to change tetxbox value from x to y **/
                saveUserEnteredData();

                var $pluginObj = $element
                var callbackData = {};

                if (timerId > 0) {
                    clearTimeout(timerId);
                }

                timerId = setTimeout((function () {

                    if (typeof plugin.settings.callBackFn == 'function') { // make sure the callback is a function    

                        callbackData.value = plugin.settings.value;
                        callbackData.unit = plugin.settings.unit;
                        callbackData.type = "textbox";
                        callbackData.SIValue = plugin.getSIValue();

                        plugin.settings.callBackFn.call(callbackData); // brings the scope to the callback
                    }

                }), 800);


            });
            if (plugin.settings.mode == 'spin') {
                $element.find(".unitComboBoxGrp").spinner('changing', function (e, newVal, oldVal) {

                    var self = this;
                    plugin.settings.value = newVal;                  
                    /** Update the stored values if user trying to change spin control value from x to y **/
                    saveUserEnteredData();                 
                    var $pluginObj = $element
                    var callbackData = {};

                    if (typeof plugin.settings.callBackFn == 'function') { // make sure the callback is a function
                        callbackData.value = plugin.settings.value;
                        callbackData.unit = plugin.settings.unit;
                        callbackData.type = "textbox";
                        callbackData.SIValue = plugin.getSIValue();

                        plugin.settings.callBackFn.call(callbackData); // brings the scope to the callback
                    }
                });

            }


        };


        // call the "constructor" method
        plugin.init();
        $(this).data('unitsComboBox', plugin);
    }

})(jQuery);
/*!
 * jquery.spinner v0.2.1 (https://vsn4ik.github.io/jquery.spinner/)
 * Copyright 2013-2017 xixilive
 * Licensed under the MIT license
 */


(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('../libs/libs-frontend-unitcombobox/dist/js/unitComboBox.js',['jquery'], factory);
  }
  else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  }
  else {
    // Browser globals
    factory(jQuery);
  }
})(function($) {
  var spinningTimer;
  var Spinner;
  var Spinning = function($element, options) {
    this.$el = $element;
    this.options = $.extend({}, Spinning.rules.defaults, Spinning.rules[options.rule] || {}, options);
    this.min = Number(this.options.min) || 0;
    this.max = Number(this.options.max) || 0;

    this.$el.on({
      'focus.spinner': $.proxy(function(e) {
        e.preventDefault();
        $(document).trigger('mouseup.spinner');
        this.oldValue = this.value();
      }, this),
      'change.spinner': $.proxy(function(e) {
        e.preventDefault();
        this.value(this.$el.val());
      }, this),
      'keydown.spinner': $.proxy(function(e) {
        var dir = {
          38: 'up',
          40: 'down'
        }[e.which];

        if (dir) {
          e.preventDefault();
          this.spin(dir);
        }
      }, this)
    });

    //init input value
    this.oldValue = this.value();
    this.value(this.$el.val());
    return this;
  };

  Spinning.rules = {
    defaults: { min: null, max: null, step: 1, precision: 0 },
    currency: { min: 0.00, max: null, step: 0.01, precision: 2 },
    quantity: { min: 1, max: 999, step: 1, precision: 0 },
    percent:  { min: 1, max: 100, step: 1, precision: 0 },
    month:    { min: 1, max: 12, step: 1, precision: 0 },
    day:      { min: 1, max: 31, step: 1, precision: 0 },
    hour:     { min: 0, max: 23, step: 1, precision: 0 },
    minute:   { min: 1, max: 59, step: 1, precision: 0 },
    second:   { min: 1, max: 59, step: 1, precision: 0 }
  };

  Spinning.prototype = {
    spin: function(dir) {
      if (this.$el.prop('disabled')) {
        return;
      }

      this.oldValue = this.value();
      var step = $.isFunction(this.options.step) ? this.options.step.call(this, dir) : this.options.step;
      var multipler = dir === 'up' ? 1 : -1;
      

      //this.value(this.oldValue + Number(step) * multipler); /*** Commented line to fix JIRA issue COSMATT-1538 ***/
      this.value(Math.round((this.oldValue + step * multipler) * 1e12 ) / 1e12);
    },

    value: function(v) {
      if (v === null || v === undefined) {
        return this.numeric(this.$el.val());
      }
      v = this.numeric(v);

      var valid = this.validate(v);
      if (valid !== 0) {
        v = (valid === -1) ? this.min : this.max;
      }
      //this.$el.val(v.toFixed(this.options.precision));
      this.$el.val(v);

      if (this.oldValue !== this.value()) {
        // changing.spinner
        this.$el.trigger('changing.spinner', [this.value(), this.oldValue]);

        // lazy changed.spinner
        clearTimeout(spinningTimer);
        spinningTimer = setTimeout($.proxy(function() {
          this.$el.trigger('changed.spinner', [this.value(), this.oldValue]);
        }, this), Spinner.delay);
      }
    },

    numeric: function(v) {
      v = this.options.precision > 0 ? parseFloat(v, 10) : parseInt(v, 10);

      // If the variable is a number
      if (isFinite(v)) {
        return v;
      }

      return v || this.options.min || 0;
    },

    validate: function(val) {
      if (this.options.min !== null && val < this.min) {
        return -1;
      }

      if (this.options.max !== null && val > this.max) {
        return 1;
      }

      return 0;
    }
  };

  Spinner = function(element, options) {
    this.$el = $(element);
    this.$spinning = this.$el.find('[data-spin="spinner"]');

    if (this.$spinning.length === 0) {
      this.$spinning = this.$el.find(':input[type="text"]');
    }

    options = $.extend({}, options, this.$spinning.data());

    this.spinning = new Spinning(this.$spinning, options);

    this.$el
      .on('click.spinner', '[data-spin="up"], [data-spin="down"]', $.proxy(this, 'spin'))
      .on('mousedown.spinner', '[data-spin="up"], [data-spin="down"]', $.proxy(this, 'spin'));

    $(document).on('mouseup.spinner', $.proxy(function() {
      clearTimeout(this.spinTimeout);
      clearInterval(this.spinInterval);
    }, this));

    if (options.delay) {
      this.delay(options.delay);
    }

    if (options.changed) {
      this.changed(options.changed);
    }

    if (options.changing) {
      this.changing(options.changing);
    }
  };

  Spinner.delay = 500;

  Spinner.prototype = {
    constructor: Spinner,

    spin: function(e) {
      var dir = $(e.currentTarget).data('spin');

      switch (e.type) {
        case 'click':
          e.preventDefault();
          this.spinning.spin(dir);
          break;
        case 'mousedown':
          if (e.which === 1) {
            this.spinTimeout = setTimeout($.proxy(this, 'beginSpin', dir), 300);
          }
          break;
      }
    },

    delay: function(ms) {
      var delay = Number(ms);

      if (delay >= 0) {
        this.constructor.delay = delay + 100;
      }
    },

    value: function() {
      return this.spinning.value();
    },

    changed: function(fn) {
      this.bindHandler('changed.spinner', fn);
    },

    changing: function(fn) {
      this.bindHandler('changing.spinner', fn);
    },

    bindHandler: function(t, fn) {
      if ($.isFunction(fn)) {
        this.$spinning.on(t, fn);
      }
      else {
        this.$spinning.off(t);
      }
    },

    beginSpin: function(dir) {
      this.spinInterval = setInterval($.proxy(this.spinning, 'spin', dir), 100);
    }
  };

  var old = $.fn.spinner;

  $.fn.spinner = function(options, value) {
    return this.each(function() {
      var data = $.data(this, 'spinner');

      if (!data) {
        data = new Spinner(this, options);

        $.data(this, 'spinner', data);
      }
      if (options === 'delay' || options === 'changed' || options === 'changing') {
        data[options](value);
      }
      else if (options === 'step' && value) {
        data.spinning.step = value;
      }
      else if (options === 'spin' && value) {
        data.spinning.spin(value);
      }
    });
  };

  $.fn.spinner.Constructor = Spinner;
  $.fn.spinner.noConflict = function() {
    $.fn.spinner = old;
    return this;
  };

  $(function() {
    $('[data-trigger="spinner"]').spinner();
  });

  return $.fn.spinner;
});

var unitData = {"unitType": {
            "LINEARDISTANCE": {
                "unit": [{
                    "symbol": "m",
                    "name": "meter",
                    "conversionFactor": 0.0254,
                    "id": "meter",
                    "isSI": true
                }, {
                    "symbol": "cm",
                    "name": "centimeter",
                    "conversionFactor": 2.54,
                    "id": "centimeter"
                }, {
                    "symbol": "mm",
                    "name": "millimeter",
                    "conversionFactor": 25.4,
                    "id": "millimeter",
                    "isMetric": true
                }, {
                    "symbol": "in",
                    "name": "inch",
                    "conversionFactor": 1,
                    "id": "inch",
                    "isImperial": true
                }, {
                    "symbol": "ft",
                    "name": "feet",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feet"
                }, {
                    "symbol": "Km",
                    "name": "kilometer",
                    "conversionFactor": 0.0000254,
                    "id": "kilometer"
                }]
            },
            "ANGULARDISTANCE": {
                "unit": [{
                    "symbol": "rad",
                    "name": "radian",
                    "conversionFactor": 6.28318530717958,
                    "id": "radian",
                    "isSI": true
                }, {
                    "symbol": "deg",
                    "name": "degree",
                    "conversionFactor": 360,
                    "id": "degree"
                }, {
                    "symbol": "rev",
                    "name": "revolution",
                    "conversionFactor": 1,
                    "id": "revolution",
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "min",
                    "name": "minute",
                    "conversionFactor": 21600,
                    "id": "minute"
                }]
            },
            "VELOCITY": {
                "unit": [{
                    "symbol": "m/sec",
                    "name": "meter/second",
                    "conversionFactor": 0.0254,
                    "id": "meterpersecond",
                    "isSI": true
                }, {
                    "symbol": "cm/sec",
                    "name": "centimeter/second",
                    "conversionFactor": 2.54,
                    "id": "centimeterpersecond"
                }, {
                    "symbol": "mm/sec",
                    "name": "millimeter/second",
                    "conversionFactor": 25.4,
                    "id": "millimeterpersecond",
                    "isMetric": true
                }, {
                    "symbol": "in/sec",
                    "name": "inch/second",
                    "conversionFactor": 1,
                    "id": "inchpersecond",
                    "isImperial": true
                }, {
                    "symbol": "ft/sec",
                    "name": "feet/second",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feetpersecond"
                }, {
                    "symbol": "ft/min",
                    "name": "feet/minute",
                    "conversionFactor": 5,
                    "id": "feetperminute"
                }]
            },
            "ANGULARVELOCITY": {
                "unit": [{
                    "symbol": "rad/sec",
                    "name": "radian/second",
                    "conversionFactor": 1,
                    "id": "radianpersecond",
                    "isSI": true
                }, {
                    "symbol": "deg/sec",
                    "name": "degree/second",
                    "conversionFactor": 57.2957795130823,
                    "id": "degreepersecond"
                }, {
                    "symbol": "rev/sec",
                    "name": "revolution/second",
                    "conversionFactor": 0.159154943091895,
                    "id": "revolutionpersecond"
                }, {
                    "symbol": "rpm",
                    "name": "revolutions/minute",
                    "conversionFactor": 9.54929658551372,
                    "id": "revolutionsperminute",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "ACCELERATION": {
                "unit": [{
                    "symbol": "m/sec&sup2;",
                    "name": "meter/second²",
                    "conversionFactor": 0.0254,
                    "id": "meterpersecondsquare",
                    "isSI": true
                }, {
                    "symbol": "cm/sec&sup2;",
                    "name": "centimeter/second²",
                    "conversionFactor": 2.54,
                    "id": "centimeterpersecondsquare"
                }, {
                    "symbol": "mm/sec&sup2;",
                    "name": "millimeter/second²",
                    "conversionFactor": 25.4,
                    "id": "millimeterpersecondsquare",
                    "isMetric": true
                }, {
                    "symbol": "in/sec&sup2;",
                    "name": "inch/second²",
                    "conversionFactor": 1,
                    "id": "inchpersecondsquare",
                    "isImperial": true
                }, {
                    "symbol": "ft/sec&sup2;",
                    "name": "feet/second²",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feetpersecondsquare"
                }, {
                    "symbol": "g",
                    "name": "gravity acceleration",
                    "conversionFactor": 0.00259007914966232,
                    "id": "gravityacceleration"
                }]
            },
            "ANGULARACCELERATION": {
                "unit": [{
                    "symbol": "rad/sec&sup2;",
                    "name": "radian/second²",
                    "conversionFactor": 1,
                    "id": "radianpersecondsquare",
                    "isSI": true
                }, {
                    "symbol": "deg/sec&sup2;",
                    "name": "degree/second²",
                    "conversionFactor": 57.2957795130823,
                    "id": "degreepersecondsquare"
                }, {
                    "symbol": "rev/sec&sup2;",
                    "name": "revolutions/second²",
                    "conversionFactor": 0.159154943091895,
                    "id": "revolutionspersecondsquare"
                }, {
                    "symbol": "rpm/sec",
                    "name": "revolutions per minute/second",
                    "conversionFactor": 9.54929658551372,
                    "id": "revolutionsperminutepersecond",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "TIME": {
                "unit": [{
                    "symbol": "sec",
                    "name": "second",
                    "conversionFactor": 60,
                    "id": "second",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "min",
                    "name": "minute",
                    "conversionFactor": 1,
                    "id": "minute"
                }, {
                    "symbol": "msec",
                    "name": "millisecond",
                    "conversionFactor": 60000,
                    "id": "millisecond"
                }]
            },
            "MASS": {
                "unit": [{
                    "symbol": "kg",
                    "name": "kilogram",
                    "conversionFactor": 0.0283495199999999,
                    "id": "kilogram",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "gm",
                    "name": "gram",
                    "conversionFactor": 28.3495199999999,
                    "id": "gram"
                }, {
                    "symbol": "oz",
                    "name": "ounce",
                    "conversionFactor": 1,
                    "id": "ounce"
                }, {
                    "symbol": "lb",
                    "name": "pound",
                    "conversionFactor": 0.0625,
                    "id": "pound",
                    "isImperial": true
                }]
            },
            "FORCE": {
                "unit": [{
                    "symbol": "N",
                    "name": "newton",
                    "conversionFactor": 4.4482216153,
                    "id": "newton",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kgf",
                    "name": "kilogram-force",
                    "conversionFactor": 0.45359237,
                    "id": "kilogramforce"
                }, {
                    "symbol": "lbf",
                    "name": "pound-force",
                    "conversionFactor": 1,
                    "id": "poundforce",
                    "isImperial": true
                }, {
                    "symbol": "dyne",
                    "name": "dyne",
                    "conversionFactor": 444822.161526051,
                    "id": "dyne"
                }]
            },
            "TORQUE": {
                "unit": [{
                    "symbol": "N-m",
                    "name": "newton-meter",
                    "conversionFactor": 0.007061552,
                    "id": "newtonmeter",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "oz-in",
                    "name": "ounce-inch",
                    "conversionFactor": 1,
                    "id": "ounceinch"
                }, {
                    "symbol": "lb-in",
                    "name": "pound-inch",
                    "conversionFactor": 0.0625,
                    "id": "poundinch",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft",
                    "name": "pound-feet",
                    "conversionFactor": 0.00520833333333333,
                    "id": "poundfeet"
                }]
            },
            "INERTIA": {
                "unit": [{
                    "symbol": "kg-m&sup2;",
                    "name": "kilogram-meter²",
                    "conversionFactor": 0.0000182997852,
                    "id": "kilogrammetersquare",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kg-cm&sup2;",
                    "name": "kilogram-centimeter²",
                    "conversionFactor": 0.182997852,
                    "id": "kilogramcentimetersquare"
                }, {
                    "symbol": "Nm-s&sup2;",
                    "name": "newton-meter-second²",
                    "conversionFactor": 0.0000182997852,
                    "id": "newtonmetersecondsquare"
                }, {
                    "symbol": "oz-in-s&sup2;",
                    "name": "pound-inch-second²",
                    "conversionFactor": 0.00259008,
                    "id": "poundinchsecondsquare"
                }, {
                    "symbol": "lb-in-s&sup2;",
                    "name": "pound-inch-second²",
                    "conversionFactor": 0.00016188,
                    "id": "poundinchsecondsquare",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft-s&sup2;",
                    "name": "pound-feet-second²",
                    "conversionFactor": 0.00001349,
                    "id": "poundfeetsecondsquare"
                }, {
                    "symbol": "oz-in&sup2;",
                    "name": "ounce-inch²",
                    "conversionFactor": 1,
                    "id": "ounceinchsquare"
                }, {
                    "symbol": "lb-in&sup2;",
                    "name": "pound-inch²",
                    "conversionFactor": 0.0625,
                    "id": "INERTIA_8"
                }, {
                    "symbol": "lb-ft&sup2;",
                    "name": "pound-feet²",
                    "conversionFactor": 0.000434028,
                    "id": "poundfeetsquare"
                }, {
                    "symbol": "gm-mm&sup2;",
                    "name": "gram-millimeter²",
                    "conversionFactor": 18299.7852,
                    "id": "grammillimetersquare"
                }, {
                    "symbol": "Kg-mm&sup2;",
                    "name": "kilogram-millimeter²",
                    "conversionFactor": 18.2997852,
                    "id": "kilogrammillimetersquare"
                }]
            },
            "POWER": {
                "unit": [{
                    "symbol": "watts",
                    "name": "watts",
                    "conversionFactor": 746,
                    "id": "watts",
                    "isSI": true
                }, {
                    "symbol": "HP",
                    "name": "horsepower",
                    "conversionFactor": 1,
                    "id": "horsepower",
                    "isImperial": true
                }, {
                    "symbol": "kW",
                    "name": "kilo-watt",
                    "conversionFactor": 0.746,
                    "id": "kilowatt",
                    "isMetric": true
                }]
            },
            "TEMPERATURE": {
                "unit": [{
                    "symbol": "&#176;C",
                    "name": "celsius",
                    "conversionFactor": 1,
                    "id": "celsius",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "&#176;F",
                    "name": "fahrenheit",
                    "conversionFactor": 1,
                    "id": "fahrenheit",
                    "isImperial": true
                }]
            },
            "TORQUECONSTANT": {
                "unit": [{
                    "symbol": "Nm/A",
                    "name": "newton-meter/ampere",
                    "conversionFactor": 1,
                    "id": "newtonmeterperampere",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kg-m/A",
                    "name": "kilogram-meter/ampere",
                    "conversionFactor": 0.101971621296887,
                    "id": "kilogrammeterperampere"
                }, {
                    "symbol": "kg-cm/A",
                    "name": "kilogram-cm/ampere",
                    "conversionFactor": 10.1971621296887,
                    "id": "kilogramcmperampere"
                }, {
                    "symbol": "gm-cm/A",
                    "name": "gram-centimeter/ampere",
                    "conversionFactor": 10197.1621296887,
                    "id": "gramcentimeterperampere"
                }, {
                    "symbol": "oz-in/A",
                    "name": "ounce-inch/ampere",
                    "conversionFactor": 141.61193228,
                    "id": "ounceinchperampere"
                }, {
                    "symbol": "lb-in/A",
                    "name": "pound-inch/ampere",
                    "conversionFactor": 8.85074577,
                    "id": "poundinchampere",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft/A",
                    "name": "pound-feet/ampere",
                    "conversionFactor": 0.73756215,
                    "id": "poundfeetperampere"
                }]
            },
            "DAMPINGCONSTANT": {
                "unit": [{
                    "symbol": "Nm/krpm",
                    "name": "newton-meter/krpm",
                    "conversionFactor": 1,
                    "id": "newtonmeterperkrpm"
                }, {
                    "symbol": "kg-m/krpm",
                    "name": "kilogram-meter/krpm",
                    "conversionFactor": 0.101971621296887,
                    "id": "kilogrammeterperkrpm"
                }, {
                    "symbol": "kg-cm/krpm",
                    "name": "kilogram-centimeter/krpm",
                    "conversionFactor": 10.1971621296887,
                    "id": "kilogramcentimeterperkrpm"
                }, {
                    "symbol": "gm-cm/krpm",
                    "name": "gram-centimeter/krpm",
                    "conversionFactor": 10197.1621296887,
                    "id": "gramcentimeterperkrpm"
                }, {
                    "symbol": "oz-in/krpm",
                    "name": "ounce-inch/krpm",
                    "conversionFactor": 141.61193228,
                    "id": "ounceinchperkrpm"
                }, {
                    "symbol": "lb-in/krpm",
                    "name": "pound-inch/krpm",
                    "conversionFactor": 8.85074577,
                    "id": "poundinchperkrpm",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft/krpm",
                    "name": "pound-feet/krpm",
                    "conversionFactor": 0.73756215,
                    "id": "poundfeetperkrpm"
                }, {
                    "symbol": "Nm/rad/sec",
                    "name": "newton-meter/radian/second",
                    "conversionFactor": 0.00954929658551372,
                    "id": "newtonmeterperradianpersecond",
                    "isSI": true,
                    "isMetric": true
                }]
            },
            "THERMALRESISTANCE": {
                "unit": [{
                    "symbol": "ºC/Watt",
                    "name": "celsius/watt",
                    "conversionFactor": 1,
                    "id": "celsiusperwatt",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "RESISTANCE": {
                "unit": [{
                    "symbol": "Ohms",
                    "name": "ohms",
                    "conversionFactor": 1,
                    "id": "ohms",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "INDUCTANCE": {
                "unit": [{
                    "symbol": "H",
                    "name": "henry",
                    "conversionFactor": 1,
                    "id": "henry",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "CURRENT": {
                "unit": [{
                    "symbol": "A(0-pk)",
                    "name": "ampere(0 to peak)",
                    "conversionFactor": 1,
                    "id": "amperezerotopeak",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "A(RMS)",
                    "name": "ampere(root mean square)",
                    "conversionFactor": 0.707106781186547,
                    "id": "ampererootmeansquare"
                }]
            },
            "TEMPERATURECOFFICIENT": {
                "unit": [{
                    "symbol": "/ºC",
                    "name": "/celsius",
                    "conversionFactor": 1,
                    "id": "percelsius",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "%/ºC",
                    "name": "%/celsius",
                    "conversionFactor": 100,
                    "id": "percentagepercelsius",
                    "isImperial": true
                }]
            },
            "CAPACITANCE": {
                "unit": [{
                    "symbol": "F",
                    "name": "farad",
                    "conversionFactor": 1,
                    "id": "farad",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "µF",
                    "name": "micro-farad",
                    "conversionFactor": 1000000,
                    "id": "microfarad"
                }]
            },
            "VOLTAGE": {
                "unit": [{
                    "symbol": "Volts",
                    "name": "volts",
                    "conversionFactor": 1,
                    "id": "volts",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "DENSITY": {
                "unit": [{
                    "symbol": "Kg/m&sup3",
                    "name": "kilogram/meter³",
                    "conversionFactor": 27679.9047,
                    "id": "kilogrampermetercube",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "Kg/cm&sup3",
                    "name": "kilogram/centimeter³",
                    "conversionFactor": 0.0276799047,
                    "id": "kilogrampercentimetercube"
                }, {
                    "symbol": "gm/m&sup3",
                    "name": "gram/meter³",
                    "conversionFactor": 27679904.7,
                    "id": "grampermetercube"
                }, {
                    "symbol": "lb/in&sup3",
                    "name": "pound/inch³",
                    "conversionFactor": 1,
                    "id": "poundperinchcube",
                    "isImperial": true
                }, {
                    "symbol": "lb/ft&sup3",
                    "name": "pound/feet³",
                    "conversionFactor": 1728,
                    "id": "poundperfeetcube"
                }, {
                    "symbol": "gm/cm&sup3",
                    "name": "gram/centimeter³",
                    "conversionFactor": 27.6799047,
                    "id": "grampercentimetercube",
                    "isSI": true,
                    "isMetric": true
                }]
            },
            "ROLLOFF": {
                "unit": [{
                    "symbol": "Nm/(rad/sec)&sup2",
                    "name": "newton-meter/(radian/second)²",
                    "conversionFactor": 1,
                    "id": "newtonmeterperradianpersecondsquare",
                    "isSI": true,
                    "isMetric": true
                }]
            },
            "MAGNETTEMPCOFFICIENT": {
                "unit": []
            },
            "LEAD": {
                "unit": [{
                    "symbol": "mm/rev",
                    "name": "millimeter/revolution",
                    "conversionFactor": 1,
                    "id": "millimeterperrevolution",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "in/rev",
                    "name": "inch/revolution",
                    "conversionFactor": 0.03937007874016,
                    "id": "inchperrevolution",
                    "isImperial": true
                }]
            },
            "INCLINATION": {
                "unit": [{
                    "symbol": "rad",
                    "name": "radian",
                    "conversionFactor": 0.0174532925199433,
                    "id": "radian",
                    "isSI": true
                }, {
                    "symbol": "deg",
                    "name": "radian",
                    "conversionFactor": 1,
                    "id": "radian",
                    "isMetric": true
                }]
            },
            "DIAMETER": {
                "unit": [{
                    "symbol": "mm",
                    "name": "millimeter",
                    "conversionFactor": 25.4,
                    "id": "millimeter",
                    "isMetric": true
                }, {
                    "symbol": "cm",
                    "name": "centimeter",
                    "conversionFactor": 2.54,
                    "id": "centimeter"
                }, {
                    "symbol": "m",
                    "name": "meter",
                    "conversionFactor": 0.0254,
                    "id": "meter",
                    "isSI": true
                }, {
                    "symbol": "in",
                    "name": "inch",
                    "conversionFactor": 1,
                    "id": "inch",
                    "isImperial": true
                }, {
                    "symbol": "ft",
                    "name": "feet",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feet"
                }]
            },
            "FORCECONSTANT": {
                "unit": [{
                    "symbol": "N/A",
                    "name": "newton/ampere",
                    "conversionFactor": 1,
                    "id": "newtonperampere",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kg/A",
                    "name": "kilogram/ampere",
                    "conversionFactor": 0.101971621296887,
                    "id": "kilogramperampere"
                }, {
                    "symbol": "gm/A",
                    "name": "gram/ampere",
                    "conversionFactor": 101.971621296887,
                    "id": "gramperampere"
                }, {
                    "symbol": "oz/A",
                    "name": "ounce/ampere",
                    "conversionFactor": 3.59694,
                    "id": "ounceperampere"
                }, {
                    "symbol": "lb/A",
                    "name": "pound/ampere",
                    "conversionFactor": 0.224809,
                    "id": "poundperampere",
                    "isImperial": true
                }]
            },
            "ENERGY": {
                "unit": [{
                    "symbol": "J",
                    "name": "joules",
                    "conversionFactor": 1,
                    "id": "joules",
                    "isSI": true
                }]
            },
            "LIFE": {
                "unit": [{
                    "symbol": "Year",
                    "name": "year",
                    "conversionFactor": 1,
                    "id": "year",
                    "isSI": true,
                    "isMetric": true,
                    "isImperial": true
                }, {
                    "symbol": "Days",
                    "name": "days",
                    "conversionFactor": 365,
                    "id": "days"
                }, {
                    "symbol": "Weeks",
                    "name": "weeks",
                    "conversionFactor": 52.1428571428571,
                    "id": "weeks"
                }]
            },
            "ALTITUDE": {
                "unit": [{
                    "symbol": "m",
                    "name": "meter",
                    "conversionFactor": 0.0254,
                    "id": "meter",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "cm",
                    "name": "centimeter",
                    "conversionFactor": 2.54,
                    "id": "centimeter"
                }, {
                    "symbol": "mm",
                    "name": "millimeter",
                    "conversionFactor": 25.4,
                    "id": "millimeter"
                }, {
                    "symbol": "in",
                    "name": "inch",
                    "conversionFactor": 1,
                    "id": "inch"
                }, {
                    "symbol": "ft",
                    "name": "feet",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feet",
                    "isImperial": true
                }, {
                    "symbol": "Km",
                    "name": "kilometer",
                    "conversionFactor": 0.0000254,
                    "id": "kilometer"
                }]
            },
            "LINEARDAMPING": {
                "unit": [{
                    "symbol": "N/m/s",
                    "name": "newton/meter/second",
                    "conversionFactor": 175.126818058489,
                    "id": "newtonpermeterpersecond",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "kgf/m/s",
                    "name": "kilogram-force/meter/second",
                    "conversionFactor": 17.8579653543307,
                    "id": "kilogramforcepermeterpersecond"
                }, {
                    "symbol": "lbf/in/s",
                    "name": "pound-force/inch/second",
                    "conversionFactor": 1,
                    "id": "poundforceperinchpersecond",
                    "isImperial": true
                }]
            },
            "CURRENCY": {
                "unit": [{
                    "symbol": "$(USD)",
                    "name": "dollar",
                    "conversionFactor": 1,
                    "id": "dollar",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "EUR",
                    "name": "euro",
                    "conversionFactor": 0.703,
                    "id": "euro"
                }, {
                    "symbol": "GBP",
                    "name": "great british pound",
                    "conversionFactor": 0.491,
                    "id": "greatbritishpound",
                    "isImperial": true
                }]
            },
            "JERK": {
                "unit": [{
                    "symbol": "m/sec&sup3",
                    "name": "meter/second³",
                    "conversionFactor": 0.0254,
                    "id": "meterpersecondcube",
                    "isSI": true
                }, {
                    "symbol": "cm/sec&sup3",
                    "name": "centimeter/second³",
                    "conversionFactor": 2.54,
                    "id": "centimeterpersecondcube"
                }, {
                    "symbol": "mm/sec&sup3",
                    "name": "millimeter/second³",
                    "conversionFactor": 25.4,
                    "id": "millimeterpersecondcube",
                    "isMetric": true
                }, {
                    "symbol": "in/sec&sup3",
                    "name": "inches/second³",
                    "conversionFactor": 1,
                    "id": "inchespersecondcube",
                    "isImperial": true
                }, {
                    "symbol": "ft/sec&sup3",
                    "name": "feet/second³",
                    "conversionFactor": 0.0833333333333333,
                    "id": "feetpersecondcube"
                }]
            },
            "VOLUME": {
                "unit": [{
                    "symbol": "m&sup3",
                    "name": "meter³",
                    "conversionFactor": 0.000016387064,
                    "id": "metercube",
                    "isSI": true
                }, {
                    "symbol": "cm&sup3",
                    "name": "centimeter³",
                    "conversionFactor": 16.387064,
                    "id": "centimetercube"
                }, {
                    "symbol": "mm&sup3",
                    "name": "millimeter³",
                    "conversionFactor": 16387.064,
                    "id": "millimetercube"
                }, {
                    "symbol": "in&sup3",
                    "name": "inch³",
                    "conversionFactor": 1,
                    "id": "inchcube",
                    "isImperial": true
                }, {
                    "symbol": "ft&sup3",
                    "name": "feet³",
                    "conversionFactor": 0.000578704,
                    "id": "feetcube"
                }]
            },
            "AREA": {
                "unit": [{
                    "symbol": "m&sup2",
                    "name": "meter²",
                    "conversionFactor": 0.000645159999999949,
                    "id": "metersquare",
                    "isSI": true
                }, {
                    "symbol": "cm&sup2",
                    "name": "centimeter²",
                    "conversionFactor": 6.4516,
                    "id": "centimetersquare"
                }, {
                    "symbol": "mm&sup2",
                    "name": "millimeter²",
                    "conversionFactor": 645.16,
                    "id": "millimetersquare"
                }, {
                    "symbol": "in&sup2",
                    "name": "inch²",
                    "conversionFactor": 1,
                    "id": "inchsquare",
                    "isImperial": true
                }, {
                    "symbol": "ft&sup2",
                    "name": "feet²",
                    "conversionFactor": 0.00694444444444438,
                    "id": "feetsquare"
                }]
            },
            "ANGULARJERK": {
                "unit": [{
                    "symbol": "rad/sec&sup3",
                    "name": "radian/second³",
                    "conversionFactor": 1,
                    "id": "radianpersecondcube",
                    "isSI": true
                }, {
                    "symbol": "deg/sec&sup3",
                    "name": "degree/second³",
                    "conversionFactor": 57.2957795130823,
                    "id": "degreepersecondcube"
                }, {
                    "symbol": "rev/sec&sup3",
                    "name": "revolution/second³",
                    "conversionFactor": 0.159154943091895,
                    "id": "revolutionpersecondcube"
                }, {
                    "symbol": "rpm/sec&sup2",
                    "name": "revolution-per-minute/second²",
                    "conversionFactor": 9.54929658551372,
                    "id": "revolutionperminutepersecondsquare",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "MOMENT": {
                "unit": [{
                    "symbol": "N-m",
                    "name": "newton-meter",
                    "conversionFactor": 0.007061552,
                    "id": "newtonpermeter",
                    "isSI": true,
                    "isMetric": true
                }, {
                    "symbol": "oz-in",
                    "name": "ounce-inch",
                    "conversionFactor": 1,
                    "id": "ounceinch"
                }, {
                    "symbol": "lb-in",
                    "name": "pound-inch",
                    "conversionFactor": 0.0625,
                    "id": "poundinch",
                    "isImperial": true
                }, {
                    "symbol": "lb-ft",
                    "name": "pound-feet",
                    "conversionFactor": 0.00520833333333333,
                    "id": "poundfeet"
                }]
            },
            "BANDWIDTH": {
                "unit": [{
                    "symbol": "1/sec",
                    "name": "1/second",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "onepersecond",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "INTEGRAL": {
                "unit": [{
                    "symbol": "1/ms-s",
                    "name": "1/ms-s",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "onepermss",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "STIFFNESSROTARY": {
                "unit": [{
                    "symbol": "Nm/deg",
                    "name": "newton-meter/degree",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "newtonmeterperdegree",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "BACKLASH": {
                "unit": [{
                    "symbol": "arc min",
                    "name": "arc minute",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "arcminute",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "FREQUENCY": {
                "unit": [{
                    "symbol": "Hz",
                    "name": "hertz",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "hertz",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "PRESSURE": {
                "unit": [{
                    "symbol": "GPa",
                    "name": "giga-pascal",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "gigapascal",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "THERMALMASS": {
                "unit": [{
                    "symbol": "J/ºC",
                    "name": "joules/celsius",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "joulespercelsius"
                }]
            },
            "STIFFNESSLINEAR": {
                "unit": [{
                    "symbol": "N/mm",
                    "name": "newton/millimeter",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "newtonpermillimeter",
                    "isMetric": true,
                    "isImperial": true
                }]
            },
            "PERCENTAGE": {
                "unit": [{
                    "symbol": "%",
                    "name": "percentage",
                    "conversionFactor": 1,
                    "isSI": true,
                    "id": "percentage",
                    "isMetric": true,
                    "isImperial": true
                }]
            }
        }
}
; //Setup Namspace
window.COSMATT = window.COSMATT || {};

COSMATT.UNITCONVERTER = (function() {

  //loading unitData.json from some external url
  /*  $.ajax({
            dataType: "text",
            url: '../libs-frontend-unitcombobox/src/data/unitData.json',
            async: false,
            success: function(data) {
             
                unitData = $.parseJSON(data);
            },
            error: function(error) {
                console.error("Json is not loaded");
            }
        });
*/



  /*  convertedValue function return converted value based on provided inputs
   * unitType can be: Time or ANGULARACCELERATION or MASS etc  
   * value : input box current value
   * unitFrom : combo box current selected unit name
   * unitTo : combo box changed unit name
   */
  var convertedValue = function(unitType, value, unitFrom, unitTo) {
    try {
      var convertedValue = "";
      var unitFromConverionFactor = "";
      var unitToConverionFactor = "";
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].id == unitFrom) {
          unitFromConverionFactor = (unitNode[loop].conversionFactor);
        }
        if (unitNode[loop].id == unitTo) {
          unitToConverionFactor = (unitNode[loop].conversionFactor);
        }
      }
      convertedValue = (unitToConverionFactor / unitFromConverionFactor) * value;
      return (convertedValue);
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };

  /*  units function return array of units.
   * input vaulue is string of unitType 
   * unitType can be: Time or ANGULARACCELERATION or MASS etc  
   */
  var units = function(unitType) {
    try {
      var units = [];
      var unitNode = [];
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        units.push(unitNode[loop].symbol);
      }
      return units;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }


  };
  var unitsAndIds = function(unitType) {
    try {
      var units = [];
      var unitNode = [];

      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        var unitsObj = {};
        unitsObj['name'] = unitNode[loop].symbol;
        unitsObj['id'] = unitNode[loop].id;
        units.push(unitsObj);
      }

      return units;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }


  };
  /*  SIUnit function return unitType SI unit name
   * input vaulue is string of unitType 
   * Example :unitType = 'TIME' 
   * function will return 'sec'
   */
  var SIUnit = function(unitType) {
    try {
      var SIUnitObj = {};
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].isSI != undefined && unitNode[loop].isSI == true) {
          SIUnitObj.name = unitNode[loop].symbol;
          SIUnitObj.id = unitNode[loop].id;
        }
      }
      return SIUnitObj;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };

  var SIValue = function(unitType, selectedUnit, value) {
    try {
      var SIUnitIndex;
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].isSI != undefined && unitNode[loop].isSI == true) {
          SIUnitIndex = loop;
          break;
        }
      }
      if (SIUnitIndex === selectedUnit) {
        return value;
      }
      return (value * conversionRatio(unitType, selectedUnit, SIUnitIndex));
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };
  /* conversionFactor function return value of conversion factor for each unit type
   * input vaulue is string of unitType and unitName
   * Example :unitType = 'TIME',  unitName = 'msec'
   * function will return '60000'
   */
  var conversionFactor = function(unitType, unitName) {
    try {
      var conversionFactor = '';
      unitNode = unitData.unitType[unitType].unit;

      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].id == unitName) {
          conversionFactor = unitNode[loop].conversionFactor;
        }


      }
      return conversionFactor;
    } catch (errorMessage) {

      console.log('Error : ' + errorMessage);

    }

  };

  /* conversionFactor function return value of conversion factor for each unit type
   * input vaulue is string of unitType and unitName
   * Example :unitType = 'TIME',  unitName = 'msec'
   * function will return '60000'
   */
  var conversionRatio = function(unitType, prevIndex, newIndex) {
    try {
      var prevConversionFactor = 1;
      var newConversionFactor = 1;
      unitNode = unitData.unitType[unitType].unit;

      for (var loop = 0; loop < unitNode.length; loop++) {
        if (loop == prevIndex) {
          prevConversionFactor = unitNode[loop].conversionFactor;
        }
        if (loop == newIndex) {
          newConversionFactor = unitNode[loop].conversionFactor;
        }
      }
      return newConversionFactor / prevConversionFactor;
    } catch (errorMessage) {
      console.log('Error : ' + errorMessage);
    }

  };

  /* conversionFactor function return value of conversion factor for each unit type
   * input vaulue is string of unitType and unitName
   * Example :unitType = 'TIME',  unitName = 'msec'
   * function will return '60000'
   */
  var conversionRatioById = function(unitType, unitFrom, UnitTo) {
    try {
      var prevConversionFactor = 1;
      var newConversionFactor = 1;
      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitFrom == "SI" && unitNode[loop].isSI) {
          prevConversionFactor = unitNode[loop].conversionFactor;
        } else if (unitNode[loop].id == unitFrom) {
          prevConversionFactor = unitNode[loop].conversionFactor;
        }

        if (UnitTo == "SI" && unitNode[loop].isSI) {
          newConversionFactor = unitNode[loop].conversionFactor;
        } else if (unitNode[loop].id == UnitTo) {
          newConversionFactor = unitNode[loop].conversionFactor;
        }
      }
      return newConversionFactor / prevConversionFactor;
    } catch (errorMessage) {
      console.log('Error : ' + errorMessage);
    }

  };

  var unitDetails = function(unitType, unit) {
    try {
      var unitNode = [];

      unitNode = unitData.unitType[unitType].unit;
      for (var loop = 0; loop < unitNode.length; loop++) {
        if (unitNode[loop].id == unit) {
          return (unitNode[loop]);
        }
      }
      return null;
    } catch (errorMessage) {
      console.log('Error : ' + errorMessage);
    }
  }


  /* PUBLIC METHODS */
  return {
    // Exposed functions
    getUnits: units,
    getunitsAndIds: unitsAndIds,
    getSIUnit: SIUnit,
    getSIValue: SIValue,
    getUnitConvertedValue: convertedValue,
    getConversionFactor: conversionFactor,
    getConversionRatio: conversionRatio,
    getConversionRatioById: conversionRatioById,
    getUnitDetails: unitDetails

  };

}());
(function ($) {

  // add the plugin to the jQuery.fn object
  $.fn.unitsLabelControl = function (options) {
    // default values 
    var defaults = {
      "unitType": "",
      "unit": "",
      "roundOfNumber": "",
      "value": "",
      "show": "true",
      "enable": {
        "textbox": "true",
        "comboBox": "true"
      },
      "comboBoxWidthRatio": {
        "textBox": "60%",
        "comboBox": "40%"
      },
      "numberFormatterOptions": {
      },
      callBackFn: function () { }
    }

    // current instance of the object
    var plugin = this;
    var timerId = 0;
    plugin.settings = {}
    var $element = $(this); // reference to the jQuery version of DOM element  
    // the plugin's final properties are the merged default and
    plugin.settings = $.extend({}, defaults, options);       
    var numberFormatter = new Cosmatt.NumberFormatter(plugin.settings.numberFormatterOptions);
    
    // the "constructor" method that gets called when the object is created
    plugin.init = function () {      
      // function is called to intialze dom element
      createComboBox(plugin.settings.unitType);      
    }
    plugin.setSIValue = function (value) {
      var SIUnit = COSMATT.UNITCONVERTER.getSIUnit(plugin.settings.unitType);
      var currentValue = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType,value,SIUnit.id,plugin.settings.unit);     
      plugin.setTextBoxValue(currentValue);
    }
    /** public function return SI value for provided unit type **/
    plugin.getSIValue = function () {

      var textboxValue = 0;
      var SIUnitObj = '';
      if (typeof COSMATT.UNITCONVERTER === 'object') {
        SIUnitObj = COSMATT.UNITCONVERTER.getSIUnit(plugin.settings.unitType);

        //textboxValue = $element.find(".amount_" + plugin.settings.unitType).val();
        var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, plugin.settings.value, plugin.settings.unit, SIUnitObj.id);
       
        return convertedVal;
      }
    };

    /** public function return value in selected unit type from dropdown **/
    plugin.getValueInSelectedUnit = function (siVal) {
      var SIUnitObj = '';
      if (typeof COSMATT.UNITCONVERTER === 'object') {
        SIUnitObj = COSMATT.UNITCONVERTER.getSIUnit(plugin.settings.unitType);

        // textboxValue = $element.find(".amount_" + plugin.settings.unitType).val();
        var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, siVal, SIUnitObj.id, plugin.settings.unit);
        return convertedVal;
      }
    };

    /** public function return SI value for provided unit type **/
    plugin.getConversionFactor = function () {

      var textboxValue = 0;
      var conversionfactor = '';
      if (typeof COSMATT.UNITCONVERTER === 'object') {
        conversionfactor = COSMATT.UNITCONVERTER.getConversionFactor(plugin.settings.unitType, plugin.settings.unit);

      }
      return conversionfactor;
    };
    /** public function set DropBox Item **/

    plugin.setDropBoxItem = function (optionId) {

       var dropDownOptions = COSMATT.UNITCONVERTER.getunitsAndIds(plugin.settings.unitType);      

        for (var loop1 = 0; loop1 < dropDownOptions.length; loop1++) {
            if (optionId == dropDownOptions[loop1].id) {
              var selectedUnit = dropDownOptions[loop1].name;
              var selectedUnitId = dropDownOptions[loop1].id;           
            }
        }
      $element.find('.unitLabel').html(selectedUnit);  
      var textboxValue = 0;
      textboxValue = plugin.settings.value;        

      var convertedVal = COSMATT.UNITCONVERTER.getUnitConvertedValue(plugin.settings.unitType, textboxValue, plugin.settings.unit,selectedUnitId);

      plugin.settings.unit = selectedUnitId;
      plugin.setTextBoxValue(convertedVal);
    }
   
    /** public function set TextboxValue **/
    plugin.setTextBoxValue = function (value) {

      var stringToNum;

      if (value === '') {
        stringToNum = value;
      } else {
        stringToNum = Number(value);
      }
      plugin.settings.value = value;
    
      plugin.formatTextBoxValue(value);
    
    };
     plugin.formatTextBoxValue = function (value) {
      
      if (value.toString().trim() !== '') {
        if(numberFormatter) {
          value = numberFormatter.format(value, true);
        }
        $element.find(".amount_" + plugin.settings.unitType).text(value);
      }
    };
    /* private method
     *  createComboBox functions is responsible to create dopdown,textbox and attache event handler 
     *  input value TIME or ANGULARACCELERATION or MASS etc 
     */
      var createComboBox = function (unitType) {

      var callbackData = {};
      try {
        if (typeof COSMATT.UNITCONVERTER === 'object' && unitType != '') {
          var dropDownOptions = COSMATT.UNITCONVERTER.getunitsAndIds(unitType);
         

          var $unitWrapper = $('<div class="cosmatt-unitLabelControl"></div>');
          $element.append($unitWrapper);

          var $inputLabel = $('<div class="unitInputLabel text-left amount_' + plugin.settings.unitType + '"></div>');
          $unitWrapper.append($inputLabel);

          plugin.setTextBoxValue(plugin.settings.value);

          for (var loop1 = 0; loop1 < dropDownOptions.length; loop1++) {
            if (plugin.settings.unit == dropDownOptions[loop1].id) {
              var selectedUnit = dropDownOptions[loop1].name;
              var selectedUnitId = dropDownOptions[loop1].id;
            }
          }

          var $unitLabel = $('<div class="unitLabel" id="unitLabel' + plugin.settings.unitType + '">'+selectedUnit+'</div>');
          $unitWrapper.append($unitLabel);

          $inputLabel.css('width', plugin.settings.comboBoxWidthRatio.textBox);
          $unitLabel.css('width', plugin.settings.comboBoxWidthRatio.comboBox);
         
        }
      } catch (errorMessage) {
        console.log('Error : ' + errorMessage);
      }
    }; 
   
  
    // call the "constructor" method
    plugin.init();
    $(this).data('unitsComboBox', plugin);
  }

})(jQuery);
define("../libs/libs-frontend-unitLabelControl/dist/js/unitLabelControl.js", function(){});


define('css!../libs/malihu-custom-scrollbar-plugin-master/jquery.mCustomScrollbar',[],function(){});

define('css!../libs/libs-frontend-TSCurve/dist/css/tsCurve.min',[],function(){});

define('css!../css/cosmatttsc',[],function(){});
/*
== malihu jquery custom scrollbar plugin == 
Version: 3.1.5 
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

(function(factory){
	if(typeof define==="function" && define.amd){
		define('../libs/malihu-custom-scrollbar-plugin-master/jquery.mCustomScrollbar.js',["jquery"],factory);
	}else if(typeof module!=="undefined" && module.exports){
		module.exports=factory;
	}else{
		factory(jQuery,window,document);
	}
}(function($){
(function(init){
	var _rjs=typeof define==="function" && define.amd, /* RequireJS */
		_njs=typeof module !== "undefined" && module.exports, /* NodeJS */
		_dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
		_url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
	if(!_rjs){
		if(_njs){
			require("jquery-mousewheel")($);
		}else{
			/* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS 
			(works when mCustomScrollbar fn is called on window load) */
			$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
		}
	}
	init();
}(function(){
	
	/* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
	
	var pluginNS="mCustomScrollbar",
		pluginPfx="mCS",
		defaultSelector=".mCustomScrollbar",
	
	
		
	
	
	/* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
	
		defaults={
			/*
			set element/content width/height programmatically 
			values: boolean, pixels, percentage 
				option						default
				-------------------------------------
				setWidth					false
				setHeight					false
			*/
			/*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setTop:0,
			/*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setLeft:0,
			/* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
			axis:"y",
			/*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
			scrollbarPosition:"inside",
			/*
			scrolling inertia
			values: integer (milliseconds)
			*/
			scrollInertia:950,
			/* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
			autoDraggerLength:true,
			/*
			auto-hide scrollbar when idle 
			values: boolean
				option						default
				-------------------------------------
				autoHideScrollbar			false
			*/
			/*
			auto-expands scrollbar on mouse-over and dragging
			values: boolean
				option						default
				-------------------------------------
				autoExpandScrollbar			false
			*/
			/*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
			*/
			alwaysShowScrollbar:0,
			/*
			scrolling always snaps to a multiple of this number in pixels
			values: integer, array ([y,x])
				option						default
				-------------------------------------
				snapAmount					null
			*/
			/*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
			snapOffset:0,
			/* 
			mouse-wheel scrolling
			*/
			mouseWheel:{
				/* 
				enable mouse-wheel scrolling
				values: boolean
				*/
				enable:true,
				/* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto",
				/* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
				axis:"y",
				/* 
				prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
				values: boolean
					option						default
					-------------------------------------
					preventDefault				null
				*/
				/*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
				deltaFactor:"auto",
				/*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
					option						default
					-------------------------------------
					normalizeDelta				null
				*/
				/*
				invert mouse-wheel scrolling direction 
				values: boolean
					option						default
					-------------------------------------
					invert						null
				*/
				/*
				the tags that disable mouse-wheel when cursor is over them
				*/
				disableOver:["select","option","keygen","datalist","textarea"]
			},
			/* 
			scrollbar buttons
			*/
			scrollButtons:{ 
				/*
				enable scrollbar buttons
				values: boolean
					option						default
					-------------------------------------
					enable						null
				*/
				/*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
				/*
				tabindex of the scrollbar buttons
				values: false, integer
					option						default
					-------------------------------------
					tabindex					null
				*/
			},
			/* 
			keyboard scrolling
			*/
			keyboard:{ 
				/*
				enable scrolling via keyboard
				values: boolean
				*/
				enable:true,
				/*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
			contentTouchScroll:25,
			/*
			enable/disable document (default) touch-swipe scrolling 
			*/
			documentTouchScroll:true,
			/*
			advanced option parameters
			*/
			advanced:{
				/*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
					option						default
					-------------------------------------
					autoExpandHorizontalScroll	null
				*/
				/*
				auto-scroll to elements with focus
				*/
				autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
				/*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
				updateOnContentResize:true,
				/*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: "auto", boolean
				*/
				updateOnImageLoad:"auto",
				/*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
					option						default
					-------------------------------------
					updateOnSelectorChange		null
				*/
				/*
				extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					extraDraggableSelectors		null
				*/
				/*
				extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					releaseDraggableSelectors	null
				*/
				/*
				auto-update timeout 
				values: integer (milliseconds)
				*/
				autoUpdateTimeout:60
			},
			/* 
			scrollbar theme 
			values: string (see CSS/plugin URI for a list of ready-to-use themes)
			*/
			theme:"light",
			/*
			user defined callback functions
			*/
			callbacks:{
				/*
				Available callbacks: 
					callback					default
					-------------------------------------
					onCreate					null
					onInit						null
					onScrollStart				null
					onScroll					null
					onTotalScroll				null
					onTotalScrollBack			null
					whileScrolling				null
					onOverflowY					null
					onOverflowX					null
					onOverflowYNone				null
					onOverflowXNone				null
					onImageLoad					null
					onSelectorChange			null
					onBeforeUpdate				null
					onUpdate					null
				*/
				onTotalScrollOffset:0,
				onTotalScrollBackOffset:0,
				alwaysTriggerOffsets:true
			}
			/*
			add scrollbar(s) on all elements matching the current selector, now and in the future 
			values: boolean, string 
			string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
			liveSelector values: string (selector)
				option						default
				-------------------------------------
				live						false
				liveSelector				null
			*/
		},
	
	
	
	
	
	/* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
	
		totalInstances=0, /* plugin instances amount */
		liveTimers={}, /* live option timers */
		oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
		touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
		/* general plugin classes */
		classes=[
			"mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
			"mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
			"mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
		],
		
	
	
	
	
	/* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
	
		methods={
			
			/* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
			
			init:function(options){
				
				var options=$.extend(true,{},defaults,options),
					selector=_selector.call(this); /* validate selector */
					
				
				/* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
				if(options.live){
					var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
						$liveSelector=$(liveSelector); /* live selector(s) as jquery object */
					if(options.live==="off"){
						/* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
						removeLiveTimers(liveSelector);
						return;
					}
					liveTimers[liveSelector]=setTimeout(function(){
						/* call mCustomScrollbar fn on live selector(s) every half-second */
						$liveSelector.mCustomScrollbar(options);
						if(options.live==="once" && $liveSelector.length){
							/* disable live after first invocation */
							removeLiveTimers(liveSelector);
						}
					},500);
				}else{
					removeLiveTimers(liveSelector);
				}
				
				/* options backward compatibility (for versions < 3.0.0) and normalization */
				options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
				options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
				options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
				options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
				if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
					options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
				}
				options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
				options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
				options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType); 
				
				_theme(options); /* theme-specific options */
				
				/* plugin constructor */
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */
					
						/* store options and create objects in jquery data */
						$this.data(pluginPfx,{
							idx:++totalInstances, /* instance index */
							opt:options, /* options */
							scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
							overflowed:null, /* overflowed axis */
							contentReset:{y:null,x:null}, /* object to check when content resets */
							bindEvents:false, /* object to check if events are bound */
							tweenRunning:false, /* object to check if tween is running */
							sequential:{}, /* sequential scrolling object */
							langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
							cbOffsets:null, /* object to check whether callback offsets always trigger */
							/* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
							trigger:null,
							/* 
							object to check for changes in elements in order to call the update method automatically 
							*/
							poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}
						});
						
						var d=$this.data(pluginPfx),o=d.opt,
							/* HTML data attributes */
							htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");
						 
						if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
						if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
						if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
							o.theme=htmlDataTheme;
							_theme(o); /* theme-specific options */
						}
						
						_pluginMarkup.call(this); /* add plugin markup */
						
						if(d && o.callbacks.onCreate && typeof o.callbacks.onCreate==="function"){o.callbacks.onCreate.call(this);} /* callbacks: onCreate */
						
						$("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */
						
						methods.update.call(null,$this); /* call the update method */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
			
			update:function(el,cb){
				
				var selector=el || _selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt,
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
						
						if(!mCSB_container.length){return;}
						
						if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */
						
						if(cb && d && o.callbacks.onBeforeUpdate && typeof o.callbacks.onBeforeUpdate==="function"){o.callbacks.onBeforeUpdate.call(this);} /* callbacks: onBeforeUpdate */
						
						/* if element was disabled or destroyed, remove class(es) */
						if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
						if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}
						
						/* css flexbox fix, detect/set max-height */
						mCustomScrollBox.css("max-height","none");
						if(mCustomScrollBox.height()!==$this.height()){mCustomScrollBox.css("max-height",$this.height());}
						
						_expandContentHorizontally.call(this); /* expand content horizontally */
						
						if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
							mCSB_container.css("width",_contentWidth(mCSB_container));
						}
						
						d.overflowed=_overflowed.call(this); /* determine if scrolling is required */
						
						_scrollbarVisibility.call(this); /* show/hide scrollbar(s) */
						
						/* auto-adjust scrollbar dragger length analogous to content */
						if(o.autoDraggerLength){_setDraggerLength.call(this);}
						
						_scrollRatio.call(this); /* calculate and store scrollbar to content ratio */
						
						_bindEvents.call(this); /* bind scrollbar events */
						
						/* reset scrolling position and/or events */
						var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
						if(o.axis!=="x"){ /* y/yx axis */
							if(!d.overflowed[0]){ /* y scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="y"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[1]){
									_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* y scrolling is required */
								_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								d.contentReset.y=null;
							}
						}
						if(o.axis!=="y"){ /* x/yx axis */
							if(!d.overflowed[1]){ /* x scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="x"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[0]){
									_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* x scrolling is required */
								_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								d.contentReset.x=null;
							}
						}
						
						/* callbacks: onImageLoad, onSelectorChange, onUpdate */
						if(cb && d){
							if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
								o.callbacks.onImageLoad.call(this);
							}else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
								o.callbacks.onSelectorChange.call(this);
							}else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
								o.callbacks.onUpdate.call(this);
							}
						}
						
						_autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
		
			scrollTo:function(val,options){
				
				/* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
				if(typeof val=="undefined" || val==null){return;}
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							/* method default options */
							methodDefaults={
								trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
								scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
								scrollEasing:"mcsEaseInOut", /* animation easing */
								moveDragger:false, /* move dragger instead of content */
								timeout:60, /* scroll-to delay */
								callbacks:true, /* enable/disable callbacks */
								onStart:true,
								onUpdate:true,
								onComplete:true
							},
							methodOptions=$.extend(true,{},methodDefaults,options),
							to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;
						
						/* translate yx values to actual scroll-to positions */
						to[0]=_to.call(this,to[0],"y");
						to[1]=_to.call(this,to[1],"x");
						
						/* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
						if(methodOptions.moveDragger){
							to[0]*=d.scrollRatio.y;
							to[1]*=d.scrollRatio.x;
						}
						
						methodOptions.dur=_isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden
						
						setTimeout(function(){ 
							/* do the scrolling */
							if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
								methodOptions.dir="y";
								methodOptions.overwrite="all";
								_scrollTo($this,to[0].toString(),methodOptions);
							}
							if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
								methodOptions.dir="x";
								methodOptions.overwrite="none";
								_scrollTo($this,to[1].toString(),methodOptions);
							}
						},methodOptions.timeout);
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
			stop:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
										
						_stop($this);
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
			disable:function(r){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx);
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						if(r){_resetContentPosition.call(this);} /* reset content position */
						
						_scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */
						
						$this.addClass(classes[3]); /* add disable class */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
			destroy:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							scrollbar=$(".mCSB_"+d.idx+"_scrollbar");
					
						if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						_resetContentPosition.call(this); /* reset content position */
						
						$this.removeData(pluginPfx); /* remove plugin data object */
						
						_delete(this,"mcs"); /* delete callbacks object */
						
						/* remove plugin markup */
						scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
						mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
						mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
						/* remove plugin classes from the element and add destroy class */
						$this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);
					
					}
					
				});
				
			}
			/* ---------------------------------------- */
			
		},
	
	
	
	
		
	/* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
	
		/* validates selector (if selector is invalid or undefined uses the default one) */
		_selector=function(){
			return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
		},
		/* -------------------- */
		
		
		/* changes options according to theme */
		_theme=function(obj){
			var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
				nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
				disabledScrollButtonsThemes=["minimal","minimal-dark"],
				enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
				scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
			obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
			obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
			obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
			obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
			obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
		},
		/* -------------------- */
		
		
		/* live option timers removal */
		removeLiveTimers=function(selector){
			if(liveTimers[selector]){
				clearTimeout(liveTimers[selector]);
				_delete(liveTimers,selector);
			}
		},
		/* -------------------- */
		
		
		/* normalizes axis option to valid values: "y", "x", "yx" */
		_findAxis=function(val){
			return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
		},
		/* -------------------- */
		
		
		/* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
		_findScrollButtonsType=function(val){
			return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
		},
		/* -------------------- */
		
		
		/* generates plugin markup */
		_pluginMarkup=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
				scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
				wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
				scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
				contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
				autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
				scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
			if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
			if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
			o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
			$this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir='"+d.langDir+"' /></div>");
			var mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
				mCSB_container.css("width",_contentWidth(mCSB_container));
			}
			if(o.scrollbarPosition==="outside"){
				if($this.css("position")==="static"){ /* requires elements with non-static position */
					$this.css("position","relative");
				}
				$this.css("overflow","visible");
				mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
			}else{
				mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
				mCSB_container.wrap(contentWrapper);
			}
			_scrollButtons.call(this); /* add scrollbar buttons */
			/* minimum dragger length */
			var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
			mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
		},
		/* -------------------- */
		
		
		/* calculates content width */
		_contentWidth=function(el){
			var val=[el[0].scrollWidth,Math.max.apply(Math,el.children().map(function(){return $(this).outerWidth(true);}).get())],w=el.parent().width();
			return val[0]>w ? val[0] : val[1]>w ? val[1] : "100%";
		},
		/* -------------------- */
		
		
		/* expands content horizontally */
		_expandContentHorizontally=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
				/* calculate scrollWidth */
				mCSB_container.css({"width":"auto","min-width":0,"overflow-x":"scroll"});
				var w=Math.ceil(mCSB_container[0].scrollWidth);
				if(o.advanced.autoExpandHorizontalScroll===3 || (o.advanced.autoExpandHorizontalScroll!==2 && w>mCSB_container.parent().width())){
					mCSB_container.css({"width":w,"min-width":"100%","overflow-x":"inherit"});
				}else{
					/* 
					wrap content with an infinite width div and set its position to absolute and width to auto. 
					Setting width to auto before calculating the actual width is important! 
					We must let the browser set the width as browser zoom values are impossible to calculate.
					*/
					mCSB_container.css({"overflow-x":"inherit","position":"absolute"})
						.wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
						.css({ /* set actual width, original position and un-wrap */
							/* 
							get the exact width (with decimals) and then round-up. 
							Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
							*/
							"width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
							"min-width":"100%",
							"position":"relative"
						}).unwrap();
				}
			}
		},
		/* -------------------- */
		
		
		/* adds scrollbar buttons */
		_scrollButtons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
				tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
				btnHTML=[
					"<a href='#' class='"+classes[13]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[14]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[15]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[16]+"' "+tabindex+" />"
				],
				btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
			if(o.scrollButtons.enable){
				mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
			}
		},
		/* -------------------- */
		
		
		/* auto-adjusts scrollbar dragger length */
		_setDraggerLength=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
				l=[
					parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
					parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
				],
				h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
			mCSB_dragger[0].css({
				"height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
			}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
			mCSB_dragger[1].css({
				"width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
			});
		},
		/* -------------------- */
		
		
		/* calculates scrollbar to content ratio */
		_scrollRatio=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
				ratio=[
					scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
					scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
				];
			d.scrollRatio={y:ratio[0],x:ratio[1]};
		},
		/* -------------------- */
		
		
		/* toggles scrolling classes */
		_onDragClasses=function(el,action,xpnd){
			var expandClass=xpnd ? classes[0]+"_expanded" : "",
				scrollbar=el.closest(".mCSB_scrollTools");
			if(action==="active"){
				el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]); 
				el[0]._draggable=el[0]._draggable ? 0 : 1;
			}else{
				if(!el[0]._draggable){
					if(action==="hide"){
						el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
					}else{
						el.addClass(classes[0]); scrollbar.addClass(classes[1]);
					}
				}
			}
		},
		/* -------------------- */
		
		
		/* checks if content overflows its container to determine if scrolling is required */
		_overflowed=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
				contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false),
				h=mCSB_container[0].scrollHeight,w=mCSB_container[0].scrollWidth;
			if(h>contentHeight){contentHeight=h;}
			if(w>contentWidth){contentWidth=w;}
			return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
		},
		/* -------------------- */
		
		
		/* resets content position to 0 */
		_resetContentPosition=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			_stop($this); /* stop any current scrolling before resetting */
			if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
				mCSB_dragger[0].add(mCSB_container).css("top",0);
				_scrollTo($this,"_resetY");
			}
			if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
				var cx=dx=0;
				if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
					cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
					dx=Math.abs(cx/d.scrollRatio.x);
				}
				mCSB_container.css("left",cx);
				mCSB_dragger[1].css("left",dx);
				_scrollTo($this,"_resetX");
			}
		},
		/* -------------------- */
		
		
		/* binds scrollbar events */
		_bindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
			if(!d.bindEvents){ /* check if events are already bound */
				_draggable.call(this);
				if(o.contentTouchScroll){_contentDraggable.call(this);}
				_selectable.call(this);
				if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
					function _mwt(){
						mousewheelTimeout=setTimeout(function(){
							if(!$.event.special.mousewheel){
								_mwt();
							}else{
								clearTimeout(mousewheelTimeout);
								_mousewheel.call($this[0]);
							}
						},100);
					}
					var mousewheelTimeout;
					_mwt();
				}
				_draggerRail.call(this);
				_wrapperScroll.call(this);
				if(o.advanced.autoScrollOnFocus){_focus.call(this);}
				if(o.scrollButtons.enable){_buttons.call(this);}
				if(o.keyboard.enable){_keyboard.call(this);}
				d.bindEvents=true;
			}
		},
		/* -------------------- */
		
		
		/* unbinds scrollbar events */
		_unbindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				sb=".mCSB_"+d.idx+"_scrollbar",
				sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
			if(o.advanced.extraDraggableSelectors){sel.add($(o.advanced.extraDraggableSelectors));}
			if(d.bindEvents){ /* check if events are bound */
				/* unbind namespaced events from document/selectors */
				$(document).add($(!_canAccessIFrame() || top.document)).unbind("."+namespace);
				sel.each(function(){
					$(this).unbind("."+namespace);
				});
				/* clear and delete timeouts/objects */
				clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
				clearTimeout(d.sequential.step); _delete(d.sequential,"step");
				clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
				d.bindEvents=false;
			}
		},
		/* -------------------- */
		
		
		/* toggles scrollbar visibility */
		_scrollbarVisibility=function(disabled){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
				content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
				scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
				mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
			if(o.axis!=="x"){
				if(d.overflowed[0] && !disabled){
					scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
					content.removeClass(classes[8]+" "+classes[10]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
						content.removeClass(classes[10]);
					}else{
						scrollbar[0].css("display","none");
						content.addClass(classes[10]);
					}
					content.addClass(classes[8]);
				}
			}
			if(o.axis!=="y"){
				if(d.overflowed[1] && !disabled){
					scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
					content.removeClass(classes[9]+" "+classes[11]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
						content.removeClass(classes[11]);
					}else{
						scrollbar[1].css("display","none");
						content.addClass(classes[11]);
					}
					content.addClass(classes[9]);
				}
			}
			if(!d.overflowed[0] && !d.overflowed[1]){
				$this.addClass(classes[5]);
			}else{
				$this.removeClass(classes[5]);
			}
		},
		/* -------------------- */
		
		
		/* returns input coordinates of pointer, touch and mouse events (relative to document) */
		_coordinates=function(e){
			var t=e.type,o=e.target.ownerDocument!==document && frameElement!==null ? [$(frameElement).offset().top,$(frameElement).offset().left] : null,
				io=_canAccessIFrame() && e.target.ownerDocument!==top.document && frameElement!==null ? [$(e.view.frameElement).offset().top,$(e.view.frameElement).offset().left] : [0,0];
			switch(t){
				case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
					return o ? [e.originalEvent.pageY-o[0]+io[0],e.originalEvent.pageX-o[1]+io[1],false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
					break;
				case "touchstart": case "touchmove": case "touchend":
					var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
						touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
					return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
					break;
				default:
					return o ? [e.pageY-o[0]+io[0],e.pageX-o[1]+io[1],false] : [e.pageY,e.pageX,false];
			}
		},
		/* -------------------- */
		
		
		/* 
		SCROLLBAR DRAG EVENTS
		scrolls content via scrollbar dragging 
		*/
		_draggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
				draggable,dragY,dragX,
				rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger,
				eds=o.advanced.extraDraggableSelectors ? $(!_canAccessIFrame() || top.document).add($(o.advanced.extraDraggableSelectors)) : $(!_canAccessIFrame() || top.document);
			mCSB_dragger.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				touchActive=true;
				if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
				_iframe.call(mCSB_container,false); /* enable scrollbar dragging over iframes by disabling their events */
				_stop($this);
				draggable=$(this);
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
					h=draggable.height()+offset.top,w=draggable.width()+offset.left;
				if(y<h && y>0 && x<w && x>0){
					dragY=y; 
					dragX=x;
				}
				_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
			}).bind("touchmove."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				_drag(dragY,dragX,y,x);
			});
			$(document).add(eds).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
				if(draggable){
					var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
					if(dragY===y && dragX===x){return;} /* has it really moved? */
					_drag(dragY,dragX,y,x);
				}
			}).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				if(draggable){
					_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
					draggable=null;
				}
				touchActive=false;
				if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
				_iframe.call(mCSB_container,true); /* enable iframes events */
			});
			function _drag(dragY,dragX,y,x){
				mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
				if(draggable.attr("id")===draggerId[1]){
					var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
				}else{
					var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
				}
				_scrollTo($this,to.toString(),{dir:dir,drag:true});
			}
		},
		/* -------------------- */
		
		
		/* 
		TOUCH SWIPE EVENTS
		scrolls content via touch swipe 
		Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
		*/
		_contentDraggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				draggable,dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
				durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
				iframe=mCSB_container.find("iframe"),
				events=[
					"touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
					"touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
					"touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
				],
				touchAction=document.body.style.touchAction!==undefined && document.body.style.touchAction!=="";
			mCSB_container.bind(events[0],function(e){
				_onTouchstart(e);
			}).bind(events[1],function(e){
				_onTouchmove(e);
			});
			mCustomScrollBox.bind(events[0],function(e){
				_onTouchstart2(e);
			}).bind(events[2],function(e){
				_onTouchend(e);
			});
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onTouchstart(e);
								_onTouchstart2(e);
							}).bind(events[1],function(e){
								_onTouchmove(e);
							}).bind(events[2],function(e){
								_onTouchend(e);
							});
						}
					});
				});
			}
			function _onTouchstart(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1; touchDrag=0; docDrag=0; draggable=1;
				$this.removeClass("mCS_touch_action");
				var offset=mCSB_container.offset();
				dragY=_coordinates(e)[0]-offset.top;
				dragX=_coordinates(e)[1]-offset.left;
				touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
			}
			function _onTouchmove(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				if(!o.documentTouchScroll){e.preventDefault();} 
				e.stopImmediatePropagation();
				if(docDrag && !touchDrag){return;}
				if(draggable){
					runningTime=_getTime();
					var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
						easing="mcsLinearOut";
					touchMoveY.push(y);
					touchMoveX.push(x);
					touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
					if(d.overflowed[0]){
						var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
							prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
					}
					if(d.overflowed[1]){
						var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
							preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
					}
					if(prevent || preventX){ /* prevent native document scrolling */
						if(!touchAction){e.preventDefault();} 
						touchDrag=1;
					}else{
						docDrag=1;
						$this.addClass("mCS_touch_action");
					}
					if(touchAction){e.preventDefault();} 
					amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
					mCSB_container[0].idleTimer=250;
					if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
					if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
				}
			}
			function _onTouchstart2(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1;
				e.stopImmediatePropagation();
				_stop($this);
				startTime=_getTime();
				var offset=mCustomScrollBox.offset();
				touchStartY=_coordinates(e)[0]-offset.top;
				touchStartX=_coordinates(e)[1]-offset.left;
				touchMoveY=[]; touchMoveX=[];
			}
			function _onTouchend(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				draggable=0;
				e.stopImmediatePropagation();
				touchDrag=0; docDrag=0;
				endTime=_getTime();
				var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				if((endTime-runningTime)>30){return;}
				speed=1000/(endTime-startTime);
				var easing="mcsEaseOut",slow=speed<2.5,
					diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
				distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
				var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
				speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
				var a=[
					Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
					Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
				];
				amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
				durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
				var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
				amount[0]=absDistance[0]>md ? amount[0] : 0;
				amount[1]=absDistance[1]>md ? amount[1] : 0;
				if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
				if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
			}
			function _m(ds,s){
				var r=[s*1.5,s*2,s/1.5,s/2];
				if(ds>90){
					return s>4 ? r[0] : r[3];
				}else if(ds>60){
					return s>3 ? r[3] : r[2];
				}else if(ds>30){
					return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
				}else{
					return s>8 ? s : r[3];
				}
			}
			function _drag(amount,dur,easing,dir,overwrite,drag){
				if(!amount){return;}
				_scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
			}
		},
		/* -------------------- */
		
		
		/* 
		SELECT TEXT EVENTS 
		scrolls content when text is selected 
		*/
		_selectable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				action;
			mCSB_container.bind("mousedown."+namespace,function(e){
				if(touchable){return;}
				if(!action){action=1; touchActive=true;}
			}).add(document).bind("mousemove."+namespace,function(e){
				if(!touchable && action && _sel()){
					var offset=mCSB_container.offset(),
						y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
					if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
						if(seq.step){_seq("off",null,"stepped");}
					}else{
						if(o.axis!=="x" && d.overflowed[0]){
							if(y<0){
								_seq("on",38);
							}else if(y>wrapper.height()){
								_seq("on",40);
							}
						}
						if(o.axis!=="y" && d.overflowed[1]){
							if(x<0){
								_seq("on",37);
							}else if(x>wrapper.width()){
								_seq("on",39);
							}
						}
					}
				}
			}).bind("mouseup."+namespace+" dragend."+namespace,function(e){
				if(touchable){return;}
				if(action){action=0; _seq("off",null);}
				touchActive=false;
			});
			function _sel(){
				return 	window.getSelection ? window.getSelection().toString() : 
						document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
			}
			function _seq(a,c,s){
				seq.type=s && action ? "stepped" : "stepless";
				seq.scrollAmount=10;
				_sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
			}
		},
		/* -------------------- */
		
		
		/* 
		MOUSE WHEEL EVENT
		scrolls content via mouse-wheel 
		via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
		*/
		_mousewheel=function(){
			if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
								_onMousewheel(e,delta);
							});
						}
					});
				});
			}
			mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
				_onMousewheel(e,delta);
			});
			function _onMousewheel(e,delta){
				_stop($this);
				if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
				var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100,
					dur=o.scrollInertia;
				if(o.axis==="x" || o.mouseWheel.axis==="x"){
					var dir="x",
						px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
						draggerPos=mCSB_dragger[1][0].offsetLeft,
						limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
						dlt=o.mouseWheel.axis==="y" ? (e.deltaY || delta) : e.deltaX;
				}else{
					var dir="y",
						px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
						draggerPos=mCSB_dragger[0][0].offsetTop,
						limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
						dlt=e.deltaY || delta;
				}
				if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
				if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
				if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
				if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
				if(e.deltaFactor<5 && !o.mouseWheel.normalizeDelta){
					//very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
					amount=e.deltaFactor; dur=17;
				}
				_scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir,dur:dur});
			}
		},
		/* -------------------- */
		
		
		/* checks if iframe can be accessed */
		_canAccessIFrameCache=new Object(),
		_canAccessIFrame=function(iframe){
		    var result=false,cacheKey=false,html=null;
		    if(iframe===undefined){
				cacheKey="#empty";
		    }else if($(iframe).attr("id")!==undefined){
				cacheKey=$(iframe).attr("id");
		    }
			if(cacheKey!==false && _canAccessIFrameCache[cacheKey]!==undefined){
				return _canAccessIFrameCache[cacheKey];
			}
			if(!iframe){
				try{
					var doc=top.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}else{
				try{
					var doc=iframe.contentDocument || iframe.contentWindow.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}
			if(cacheKey!==false){_canAccessIFrameCache[cacheKey]=result;}
			return result;
		},
		/* -------------------- */
		
		
		/* switches iframe's pointer-events property (drag, mousewheel etc. over cross-domain iframes) */
		_iframe=function(evt){
			var el=this.find("iframe");
			if(!el.length){return;} /* check if content contains iframes */
			var val=!evt ? "none" : "auto";
			el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
		},
		/* -------------------- */
		
		
		/* disables mouse-wheel when hovering specific elements like select, datalist etc. */
		_disableMousewheel=function(el,target){
			var tag=target.nodeName.toLowerCase(),
				tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
				/* elements that require focus */
				focusTags=["select","textarea"];
			return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
		},
		/* -------------------- */
		
		
		/* 
		DRAGGER RAIL CLICK EVENT
		scrolls content via dragger rail 
		*/
		_draggerRail=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]),
				clickable;
			mCSB_draggerContainer.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				touchActive=true;
				if(!$(e.target).hasClass("mCSB_dragger")){clickable=1;}
			}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				touchActive=false;
			}).bind("click."+namespace,function(e){
				if(!clickable){return;}
				clickable=0;
				if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
					_stop($this);
					var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
					if(el.parent(".mCSB_scrollTools_horizontal").length>0){
						if(!d.overflowed[1]){return;}
						var dir="x",
							clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
							//to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9)); // removed the 0.9 multiplication to fixed the 1 diff issue on jump 
							to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()));
					}else{
						if(!d.overflowed[0]){return;}
						var dir="y",
							clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
							//to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
							to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()));
					}
					_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		FOCUS EVENT
		scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
		*/
		_focus=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent();
			mCSB_container.bind("focusin."+namespace,function(e){
				var el=$(document.activeElement),
					nested=mCSB_container.find(".mCustomScrollBox").length,
					dur=0;
				if(!el.is(o.advanced.autoScrollOnFocus)){return;}
				_stop($this);
				clearTimeout($this[0]._focusTimeout);
				$this[0]._focusTimer=nested ? (dur+17)*nested : 0;
				$this[0]._focusTimeout=setTimeout(function(){
					var	to=[_childPos(el)[0],_childPos(el)[1]],
						contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
						isVisible=[
							(contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
							(contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
						],
						overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
					if(o.axis!=="x" && !isVisible[0]){
						_scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
					if(o.axis!=="y" && !isVisible[1]){
						_scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
				},$this[0]._focusTimer);
			});
		},
		/* -------------------- */
		
		
		/* sets content wrapper scrollTop/scrollLeft always to 0 */
		_wrapperScroll=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				wrapper=$("#mCSB_"+d.idx+"_container").parent();
			wrapper.bind("scroll."+namespace,function(e){
				if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
					$(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		BUTTONS EVENTS
		scrolls content via up, down, left and right buttons 
		*/
		_buttons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				sel=".mCSB_"+d.idx+"_scrollbar",
				btn=$(sel+">a");
	
			seq.mouseDownTimeOut = 0;
			btn.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+"  MSPointerOut."+namespace+" click."+namespace,function(e){
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				var btnClass=$(this).attr("class");
				seq.type=o.scrollButtons.scrollType;
		
				var endTime;
				switch(e.type){
					case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
						//if(seq.type==="stepped"){return;}					

						if(e.type == 'mousedown'){
							seq.startTime = new Date().getTime();							
						}
						seq.mouseIsDown = true;
						touchActive=true;
						d.tweenRunning=false;
						
						clearTimeout(seq.mouseDownTimeOut);
						seq.mouseDownTimeOut=setTimeout(function(){					
							_seq("on",btnClass);
						},150);

						break;
					case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
					case "mouseout": case "pointerout": case "MSPointerOut":
						//if(seq.type==="stepped"){return;}
						touchActive=false;
						if(e.type == 'mouseup'){
							endTime = new Date().getTime();
					        if (endTime - seq.startTime < 250) {
					            seq.mouseIsDown = false;					         
					        } else if (endTime - seq.startTime >= 300) {
					            seq.mouseIsDown = true;					           
					        }			    
						}
						if(seq.dir){_seq("off",btnClass);}
						break;
					case "click":
					 (seq.mouseIsDown) ?  e.preventDefault() : "";
						if(seq.type!=="stepped" || d.tweenRunning){return;}
						//_seq("on",btnClass);
						break;
				}
				function _seq(a,c){					
					seq.scrollAmount=o.scrollButtons.scrollAmount;
					_sequentialScroll($this,a,c);
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		KEYBOARD EVENTS
		scrolls content via keyboard 
		Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
		*/
		_keyboard=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
				iframe=mCSB_container.find("iframe"),
				events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onKeyboard(e);
							});
						}
					});
				});
			}
			mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
				_onKeyboard(e);
			});
			function _onKeyboard(e){
				switch(e.type){
					case "blur":
						if(d.tweenRunning && seq.dir){_seq("off",null);}
						break;
					case "keydown": case "keyup":
						var code=e.keyCode ? e.keyCode : e.which,action="on";
						if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
							/* up (38), down (40), left (37), right (39) arrows */
							if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
							if(e.type==="keyup"){action="off";}
							if(!$(document.activeElement).is(editables)){
								e.preventDefault();
								e.stopImmediatePropagation();
								_seq(action,code);
							}
						}else if(code===33 || code===34){
							/* PgUp (33), PgDn (34) */
							if(d.overflowed[0] || d.overflowed[1]){
								e.preventDefault();
								e.stopImmediatePropagation();
							}
							if(e.type==="keyup"){
								_stop($this);
								var keyboardDir=code===34 ? -1 : 1;
								if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
									var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
								}else{
									var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
								}
								_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
							}
						}else if(code===35 || code===36){
							/* End (35), Home (36) */
							if(!$(document.activeElement).is(editables)){
								if(d.overflowed[0] || d.overflowed[1]){
									e.preventDefault();
									e.stopImmediatePropagation();
								}
								if(e.type==="keyup"){
									if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
										var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
									}else{
										var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
									}
									_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
								}
							}
						}
						break;
				}
				function _seq(a,c){
					seq.type=o.keyboard.scrollType;
					seq.scrollAmount=o.keyboard.scrollAmount;
					//if(seq.type==="stepped" && d.tweenRunning){return;}
					_sequentialScroll($this,a,c);
				}
			}
		},
		/* -------------------- */
		
		
		/* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
		_sequentialScroll=function(el,action,trigger,e,s){
			var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				once=seq.type==="stepped" ? false : false,
				steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
				steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
				
				if(seq.mouseIsDown || seq.mouseIsDown === undefined){once = false;}
				else{once = true;}
			
			switch(action){
				case "on":
					seq.dir=[
						(trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
						(trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
					];
					_stop(el);
					//if(_isNumeric(trigger) && seq.type==="stepped"){return;}
					_on(once);
					break;
				case "off":
					_off();
					if(once || (d.tweenRunning && seq.dir)){
						_on(true);
					}
					break;
			}
			
			/* starts sequence */
			function _on(once){
			

				if(o.snapAmount){seq.scrollAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : seq.dir[0]==="x" ? o.snapAmount[1] : o.snapAmount[0];} /* scrolling snapping */
				var c=seq.type!=="stepped", /* continuous scrolling */
					t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
					m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
					contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
					ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
					amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
					px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
					to=seq.scrollAmount!=="auto" ? px : amount,
					easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
					onComplete=!once ? false : true;
				if(once && t<17){
					to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
				}				
				_scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});

				if(once){
					seq.dir=false;
					return;
				}
				clearTimeout(seq.step);
				seq.step=setTimeout(function(){					
					_on();
				},t);
			}
			/* stops sequence */
			function _off(){
				clearTimeout(seq.step);
				_delete(seq,"step");
				_stop(el);
			}
		},
		/* -------------------- */
		
		
		/* returns a yx array from value */
		_arr=function(val){
			var o=$(this).data(pluginPfx).opt,vals=[];
			if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
			/* check if value is object or array, its length and create an array with yx values */
			if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
				vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
				vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
			}else{ /* array value (e.g. [100,100]) */
				vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
			}
			/* check if array values are anonymous functions */
			if(typeof vals[0]==="function"){vals[0]=vals[0]();}
			if(typeof vals[1]==="function"){vals[1]=vals[1]();}
			return vals;
		},
		/* -------------------- */
		
		
		/* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
		_to=function(val,dir){
			if(val==null || typeof val=="undefined"){return;}
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				t=typeof val;
			if(!dir){dir=o.axis==="x" ? "x" : "y";}
			var contentLength=dir==="x" ? mCSB_container.outerWidth(false)-wrapper.width() : mCSB_container.outerHeight(false)-wrapper.height(),
				contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
				cssProp=dir==="x" ? "left" : "top";
			switch(t){
				case "function": /* this currently is not used. Consider removing it */
					return val();
					break;
				case "object": /* js/jquery object */
					var obj=val.jquery ? val : $(val);
					if(!obj.length){return;}
					return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
					break;
				case "string": case "number":
					if(_isNumeric(val)){ /* numeric value */
						return Math.abs(val);
					}else if(val.indexOf("%")!==-1){ /* percentage value */
						return Math.abs(contentLength*parseInt(val)/100);
					}else if(val.indexOf("-=")!==-1){ /* decrease value */
						return Math.abs(contentPos-parseInt(val.split("-=")[1]));
					}else if(val.indexOf("+=")!==-1){ /* inrease value */
						var p=(contentPos+parseInt(val.split("+=")[1]));
						return p>=0 ? 0 : Math.abs(p);
					}else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
						return Math.abs(val.split("px")[0]);
					}else{
						if(val==="top" || val==="left"){ /* special strings */
							return 0;
						}else if(val==="bottom"){
							return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
						}else if(val==="right"){
							return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
						}else if(val==="first" || val==="last"){
							var obj=mCSB_container.find(":"+val);
							return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
						}else{
							if($(val).length){ /* jquery selector */
								return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
							}else{ /* other values (e.g. "100em") */
								mCSB_container.css(cssProp,val);
								methods.update.call(null,$this[0]);
								return;
							}
						}
					}
					break;
			}
		},
		/* -------------------- */
		
		
		/* calls the update method automatically */
		_autoUpdate=function(rem){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(rem){
				/* 
				removes autoUpdate timer 
				usage: _autoUpdate.call(this,"remove");
				*/
				clearTimeout(mCSB_container[0].autoUpdate);
				_delete(mCSB_container[0],"autoUpdate");
				return;
			}
			upd();
			function upd(){
				clearTimeout(mCSB_container[0].autoUpdate);
				if($this.parents("html").length===0){
					/* check element in dom tree */
					$this=null;
					return;
				}
				mCSB_container[0].autoUpdate=setTimeout(function(){
					/* update on specific selector(s) length and size change */
					if(o.advanced.updateOnSelectorChange){
						d.poll.change.n=sizesSum();
						if(d.poll.change.n!==d.poll.change.o){
							d.poll.change.o=d.poll.change.n;
							doUpd(3);
							return;
						}
					}
					/* update on main element and scrollbar size changes */
					if(o.advanced.updateOnContentResize){
						d.poll.size.n=$this[0].scrollHeight+$this[0].scrollWidth+mCSB_container[0].offsetHeight+$this[0].offsetHeight+$this[0].offsetWidth;
						if(d.poll.size.n!==d.poll.size.o){
							d.poll.size.o=d.poll.size.n;
							doUpd(1);
							return;
						}
					}
					/* update on image load */
					if(o.advanced.updateOnImageLoad){
						if(!(o.advanced.updateOnImageLoad==="auto" && o.axis==="y")){ //by default, it doesn't run on vertical content
							d.poll.img.n=mCSB_container.find("img").length;
							if(d.poll.img.n!==d.poll.img.o){
								d.poll.img.o=d.poll.img.n;
								mCSB_container.find("img").each(function(){
									imgLoader(this);
								});
								return;
							}
						}
					}
					if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
				},o.advanced.autoUpdateTimeout);
			}
			/* a tiny image loader */
			function imgLoader(el){
				if($(el).hasClass(classes[2])){doUpd(); return;}
				var img=new Image();
				function createDelegate(contextObject,delegateMethod){
					return function(){return delegateMethod.apply(contextObject,arguments);}
				}
				function imgOnLoad(){
					this.onload=null;
					$(el).addClass(classes[2]);
					doUpd(2);
				}
				img.onload=createDelegate(img,imgOnLoad);
				img.src=el.src;
			}
			/* returns the total height and width sum of all elements matching the selector */
			function sizesSum(){
				if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
				var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
				if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=this.offsetHeight+this.offsetWidth;});}
				return total;
			}
			/* calls the update method */
			function doUpd(cb){
				clearTimeout(mCSB_container[0].autoUpdate);
				methods.update.call(null,$this[0],cb);
			}
		},
		/* -------------------- */
		
		
		/* snaps scrolling to a multiple of a pixels number */
		_snapAmount=function(to,amount,offset){
			return (Math.round(to/amount)*amount-offset); 
		},
		/* -------------------- */
		
		
		/* stops content and scrollbar animations */
		_stop=function(el){
			var d=el.data(pluginPfx),
				sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
			sel.each(function(){
				_stopTween.call(this);
			});
		},
		/* -------------------- */
		
		
		/* 
		ANIMATES CONTENT 
		This is where the actual scrolling happens
		*/
		_scrollTo=function(el,to,options){
			var d=el.data(pluginPfx),o=d.opt,
				defaults={
					trigger:"internal",
					dir:"y",
					scrollEasing:"mcsEaseOut",
					drag:false,
					dur:o.scrollInertia,
					overwrite:"all",
					callbacks:true,
					onStart:true,
					onUpdate:true,
					onComplete:true
				},
				options=$.extend(defaults,options),
				dur=[options.dur,(options.drag ? 0 : options.dur)],
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
				totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
			d.trigger=options.trigger;
			if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
				$(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
				wrapper.scrollTop(0).scrollLeft(0);
			}
			if(to==="_resetY" && !d.contentReset.y){
				/* callbacks: onOverflowYNone */
				if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
				d.contentReset.y=1;
			}
			if(to==="_resetX" && !d.contentReset.x){
				/* callbacks: onOverflowXNone */
				if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
				d.contentReset.x=1;
			}
			if(to==="_resetY" || to==="_resetX"){return;}
			if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
				/* callbacks: onOverflowY */
				if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
				d.contentReset.x=null;
			}
			if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
				/* callbacks: onOverflowX */
				if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
				d.contentReset.x=null;
			}
			if(o.snapAmount){ /* scrolling snapping */
				var snapAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : options.dir==="x" ? o.snapAmount[1] : o.snapAmount[0];
				to=_snapAmount(to,snapAmount,o.snapOffset);
			}
			switch(options.dir){
				case "x":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
						property="left",
						contentPos=mCSB_container[0].offsetLeft,
						limit=[
							mCustomScrollBox.width()-mCSB_container.outerWidth(false),
							mCSB_dragger.parent().width()-mCSB_dragger.width()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
						tso=totalScrollOffsets[1],
						tsbo=totalScrollBackOffsets[1],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
					break;
				case "y":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
						property="top",
						contentPos=mCSB_container[0].offsetTop,
						limit=[
							mCustomScrollBox.height()-mCSB_container.outerHeight(false),
							mCSB_dragger.parent().height()-mCSB_dragger.height()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
						tso=totalScrollOffsets[0],
						tsbo=totalScrollBackOffsets[0],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
					break;
			}
			if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
				scrollTo=[0,0];
			}else if(scrollTo[1]>=limit[1]){
				scrollTo=[limit[0],limit[1]];
			}else{
				scrollTo[0]=-scrollTo[0];
			}
			if(!el[0].mcs){
				_mcs();  /* init mcs object (once) to make it available before callbacks */
				if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
			}
			clearTimeout(mCSB_container[0].onCompleteTimeout);
			_tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
			if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
			_tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
				onStart:function(){
					if(options.callbacks && options.onStart && !d.tweenRunning){
						/* callbacks: onScrollStart */
						if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
						d.tweenRunning=true;
						_onDragClasses(mCSB_dragger);
						d.cbOffsets=_cbOffsets();
					}
				},onUpdate:function(){
					if(options.callbacks && options.onUpdate){
						/* callbacks: whileScrolling */
						if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
					}
				},onComplete:function(){
					if(options.callbacks && options.onComplete){
						if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
						var t=mCSB_container[0].idleTimer || 0;
						mCSB_container[0].onCompleteTimeout=setTimeout(function(){
							/* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
							if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
							if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
							if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
							d.tweenRunning=false;
							mCSB_container[0].idleTimer=0;
							_onDragClasses(mCSB_dragger,"hide");
						},t);
					}
				}
			});
			/* checks if callback function exists */
			function _cb(cb){
				return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
			}
			/* checks whether callback offsets always trigger */
			function _cbOffsets(){
				return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
			}
			/* 
			populates object with useful values for the user 
			values: 
				content: this.mcs.content
				content top position: this.mcs.top 
				content left position: this.mcs.left 
				dragger top position: this.mcs.draggerTop 
				dragger left position: this.mcs.draggerLeft 
				scrolling y percentage: this.mcs.topPct 
				scrolling x percentage: this.mcs.leftPct 
				scrolling direction: this.mcs.direction
			*/
			function _mcs(){

				var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
					dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
					cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
					pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
					//debugger;
					//console.log("mCSB_container[0].offsetLeft",mCSB_container[0].offsetLeft);
					//console.log("cp[1]",cp[1]);
					//console.log("cl[1]",cl[1]);
					//console.log("pl[1]",pl[1]);
				el[0].mcs={
					content:mCSB_container, /* original content wrapper as jquery object */
					top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
					topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
					direction:options.dir
				};
				/* 
				this refers to the original element containing the scrollbar(s)
				usage: this.mcs.top, this.mcs.leftPct etc. 
				*/
			}
		},
		/* -------------------- */
		
		
		/* 
		CUSTOM JAVASCRIPT ANIMATION TWEEN 
		Lighter and faster than jquery animate() and css transitions 
		Animates top/left properties and includes easings 
		*/
		_tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
				startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			tobj.stop=0;
			if(overwrite!=="none"){_cancelTween();}
			_startTween();
			function _step(){
				if(tobj.stop){return;}
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=tobj.time){
					tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
					if(tobj.time<progress+1){tobj.time=progress+1;}
				}
				if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
					elStyle[prop]=Math.round(tobj.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				tobj.time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				tobj.id=_request(_step);
			}
			function _cancelTween(){
				if(tobj.id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(tobj.id);
				}else{window.cancelAnimationFrame(tobj.id);}
				tobj.id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear": case "mcsLinear":
						return c*t/d + b;
						break;
					case "mcsLinearOut":
						t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeInOutSmooth":
						t/=d/2;
						if(t<1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeInOutStrong":
						t/=d/2;
						if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
						t--;
						return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
						break;
					case "easeInOut": case "mcsEaseInOut":
						t/=d/2;
						if(t<1) return c/2*t*t*t + b;
						t-=2;
						return c/2*(t*t*t + 2) + b;
						break;
					case "easeOutSmooth":
						t/=d; t--;
						return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutStrong":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "easeOut": case "mcsEaseOut": default:
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
				}
			}
		},
		/* -------------------- */
		
		
		/* returns current time */
		_getTime=function(){
			if(window.performance && window.performance.now){
				return window.performance.now();
			}else{
				if(window.performance && window.performance.webkitNow){
					return window.performance.webkitNow();
				}else{
					if(Date.now){return Date.now();}else{return new Date().getTime();}
				}
			}
		},
		/* -------------------- */
		
		
		/* stops a tween */
		_stopTween=function(){
			var el=this;
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var props=["top","left"];
			for(var i=0; i<props.length; i++){
				var prop=props[i];
				if(el._mTween[prop].id){
					if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
					}else{window.cancelAnimationFrame(el._mTween[prop].id);}
					el._mTween[prop].id=null;
					el._mTween[prop].stop=1;
				}
			}
		},
		/* -------------------- */
		
		
		/* deletes a property (avoiding the exception thrown by IE) */
		_delete=function(c,m){
			try{delete c[m];}catch(e){c[m]=null;}
		},
		/* -------------------- */
		
		
		/* detects left mouse button */
		_mouseBtnLeft=function(e){
			return !(e.which && e.which!==1);
		},
		/* -------------------- */
		
		
		/* detects if pointer type event is touch */
		_pointerTouch=function(e){
			var t=e.originalEvent.pointerType;
			return !(t && t!=="touch" && t!==2);
		},
		/* -------------------- */
		
		
		/* checks if value is numeric */
		_isNumeric=function(val){
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		/* -------------------- */
		
		
		/* returns element position according to content */
		_childPos=function(el){
			var p=el.parents(".mCSB_container");
			return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
		},
		/* -------------------- */
		
		
		/* checks if browser tab is hidden/inactive via Page Visibility API */
		_isTabHidden=function(){
			var prop=_getHiddenProp();
			if(!prop) return false;
			return document[prop];
			function _getHiddenProp(){
				var pfx=["webkit","moz","ms","o"];
				if("hidden" in document) return "hidden"; //natively supported
				for(var i=0; i<pfx.length; i++){ //prefixed
				    if((pfx[i]+"Hidden") in document) 
				        return pfx[i]+"Hidden";
				}
				return null; //not supported
			}
		};
		/* -------------------- */
		
	
	
	
	
	/* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
	
	/* plugin constructor functions */
	$.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	$[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	
	/* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
	$[pluginNS].defaults=defaults;
	
	/* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
	window[pluginNS]=true;
	
	$(window).bind("load",function(){
		
		$(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */
		
		/* extend jQuery expressions */
		$.extend($.expr[":"],{
			/* checks if element is within scrollable viewport */
			mcsInView:$.expr[":"].mcsInView || function(el){
				var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
				if(!content.length){return;}
				wrapper=content.parent();
				cPos=[content[0].offsetTop,content[0].offsetLeft];
				return 	cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) && 
						cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
			},
			/* checks if element or part of element is in view of scrollable viewport */
			mcsInSight:$.expr[":"].mcsInSight || function(el,i,m){
				var $el=$(el),elD,content=$el.parents(".mCSB_container"),wrapperView,pos,wrapperViewPct,
					pctVals=m[3]==="exact" ? [[1,0],[1,0]] : [[0.9,0.1],[0.6,0.4]];
				if(!content.length){return;}
				elD=[$el.outerHeight(false),$el.outerWidth(false)];
				pos=[content[0].offsetTop+_childPos($el)[0],content[0].offsetLeft+_childPos($el)[1]];
				wrapperView=[content.parent()[0].offsetHeight,content.parent()[0].offsetWidth];
				wrapperViewPct=[elD[0]<wrapperView[0] ? pctVals[0] : pctVals[1],elD[1]<wrapperView[1] ? pctVals[0] : pctVals[1]];
				return 	pos[0]-(wrapperView[0]*wrapperViewPct[0][0])<0 && pos[0]+elD[0]-(wrapperView[0]*wrapperViewPct[0][1])>=0 && 
						pos[1]-(wrapperView[1]*wrapperViewPct[1][0])<0 && pos[1]+elD[1]-(wrapperView[1]*wrapperViewPct[1][1])>=0;
			},
			/* checks if element is overflowed having visible scrollbar(s) */
			mcsOverflow:$.expr[":"].mcsOverflow || function(el){
				var d=$(el).data(pluginPfx);
				if(!d){return;}
				return d.overflowed[0] || d.overflowed[1];
			}
		});
	
	});

}))}));


(function ($) {

    $.fn.TSCurve = function (options) {

        var $container = $(this);

        var defaults = {
            showApplicationPoints: false,
            motorSelectedIndex: 3,
            rmsPoints: [1200, 5.9],
            peakPoints: [1200, 9.4],
            peakAcceData: 1478,
            rmsAcceData: 1097,
            quadrant: 1,
            transmissionRaioVal: 1,
            openAppReqPanel: false,
            openTransmPanel: true,
            temperature: 40,
            altitude: 0,
            sliderLimit: {
                peakMaxSpeed: 800,
                peakMaxTorque: 100,
                rmsMaxSpeed: 800,
                rmsMaxTorque: 100,
                maxTemp: 125,
                maxAltitude: 10000,
                maxVoltage: 10,
                maxTrRatio: 1000
            },
            showQuadrantToggle: true,
            showMotorTsCurve: true,
            showMotorSelForm: true,
            showAppPointsForm: true,
            showEnviorForm: true,
            showTransmissionForm: true,
            uniqeId: '1',
            xaxisMaxVale: 12000000,
            sequenceIndex: '0',
            transmTextChange: false,
            graphLineColor: {
                "peakTSCurve": "#FF0808",
                "contionusTSCurve": "#9ADC54"
            },
            motorCheckedIndex: [],
            motorData: [{
                "motorPartNo": "CPB-1-01",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 1.0,
                "peakStallTorque": 2.70,
                "rollOffPoint": 2.70,
                "peakTorqueAtMaxSpeed": 1.8,
                "continuosTorqueAtMaxSpeed": 0.72,
                "rollOffSpeed": 3200,
                "maxSpeed": 4500,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.00001
            }, {
                "motorPartNo": "CPB-1-02",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 1.7,
                "peakStallTorque": 4.40,
                "rollOffPoint": 4.40,
                "peakTorqueAtMaxSpeed": 2.4,
                "continuosTorqueAtMaxSpeed": 1.302,
                "rollOffSpeed": 3300,
                "maxSpeed": 5000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.000015
            }, {
                "motorPartNo": "CPB-1-03",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 2.3,
                "peakStallTorque": 7.50,
                "rollOffPoint": 7.50,
                "peakTorqueAtMaxSpeed": 4.2,
                "continuosTorqueAtMaxSpeed": 1.71,
                "rollOffSpeed": 3100,
                "maxSpeed": 4500,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.000025
            }, {
                "motorPartNo": "CPB-2-01",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 2.0,
                "peakStallTorque": 3.8,
                "rollOffPoint": 3.8,
                "peakTorqueAtMaxSpeed": 2.0,
                "continuosTorqueAtMaxSpeed": 1.7,
                "rollOffSpeed": 4000,
                "maxSpeed": 6000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.000065
            }, {
                "motorPartNo": "CPB-2-02",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 3.4,
                "peakStallTorque": 7.8,
                "rollOffPoint": 7.8,
                "peakTorqueAtMaxSpeed": 4.0,
                "continuosTorqueAtMaxSpeed": 3.09,
                "rollOffSpeed": 4400,
                "maxSpeed": 6000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.00008
            }, {
                "motorPartNo": "CPB-2-03",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 4.2,
                "peakStallTorque": 11.0,
                "rollOffPoint": 11.0,
                "peakTorqueAtMaxSpeed": 6.0,
                "continuosTorqueAtMaxSpeed": 2.9,
                "rollOffSpeed": 3100,
                "maxSpeed": 5000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.00012
            }, {
                "motorPartNo": "CPB-3-01",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 9.0,
                "peakStallTorque": 21.0,
                "rollOffPoint": 21.0,
                "peakTorqueAtMaxSpeed": 13.0,
                "continuosTorqueAtMaxSpeed": 6.3,
                "rollOffSpeed": 3200,
                "maxSpeed": 4000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.0004
            }, {
                "motorPartNo": "CPB-3-02",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 10.0,
                "peakStallTorque": 29.0,
                "rollOffPoint": 29.0,
                "peakTorqueAtMaxSpeed": 16.0,
                "continuosTorqueAtMaxSpeed": 6.91,
                "rollOffSpeed": 2500,
                "maxSpeed": 3500,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.0006
            }, {
                "motorPartNo": "CPB-4-01",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 20.0,
                "peakStallTorque": 50.0,
                "rollOffPoint": 50.0,
                "peakTorqueAtMaxSpeed": 25.0,
                "continuosTorqueAtMaxSpeed": 15.3,
                "rollOffSpeed": 1800,
                "maxSpeed": 3000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.0015
            }, {
                "motorPartNo": "CPB-4-02",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 25.0,
                "peakStallTorque": 68.0,
                "rollOffPoint": 68.0,
                "peakTorqueAtMaxSpeed": 30.0,
                "continuosTorqueAtMaxSpeed": 17.53,
                "rollOffSpeed": 1900,
                "maxSpeed": 3000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.0022
            }, {
                "motorPartNo": "CPB-4-03",
                "drivePartNo": "CB-250",
                "voltage": "480",
                "continuousStallTorque": 32.0,
                "peakStallTorque": 75.0,
                "rollOffPoint": 75.0,
                "peakTorqueAtMaxSpeed": 32.0,
                "continuosTorqueAtMaxSpeed": 22.8,
                "rollOffSpeed": 2100,
                "maxSpeed": 3000,
                "temp": 40,
                "altitude": 1,
                "motorInertia": 0.0029
            }],
            "numberFormatterOptions": {
                "significantDigits": 3,
                "maxPositiveExponent": 6,
                "minNegativeExponent": -4,
            },
            notifyIOData: function () { }

        };



        var settings = $.extend({}, defaults, options);
        var numberFormatter = new Cosmatt.NumberFormatter(settings.numberFormatterOptions);
        settings.selectIndex = (settings.motorSelectedIndex - 1);

        var tickFormatter = function (value, axis) {
            if (value.toString().trim() === '') {
                return value;
            }
            return numberFormatter.format(value);
        }



        var tsPlot;

        // generates widget container
        var generateTSCurveArea = function () {
            var $tsCruveContainer = $('<div class="tsCruveContainer row m-0"></div>');
            $container.append($tsCruveContainer);
            generateServoMotorTSCurveSection($tsCruveContainer);
        };

        // generates graph plot area container and accordions container
        var generateServoMotorTSCurveSection = function ($containerEle) {

            // $containerEle.append($('<div class="col-md-1"></div>'));
            var $servoMotorTSCurve = $('<div id="servoMotorTSCurve"></div>');
            $containerEle.append($servoMotorTSCurve);




            if (settings.showMotorSelForm || settings.showAppPointsForm || settings.showEnviorForm || settings.showTransmissionForm) {
                $servoMotorTSCurve.addClass('col-xs-6 col-6');

                // $containerEle.append($('<div class="col-md-1"></div>'));
                var $servoMotorArea = $('<div class="col-xs-6 col-6" id="servoMotorArea"></div>');
                $containerEle.append($servoMotorArea);



                generateServoMotorArea($servoMotorArea);
            }
            else {
                $servoMotorTSCurve.addClass('col-xs-12 col-12');
                $container.find('.tsCruveContainer').addClass('widthMaxLimit')
            }

            generateTSCurvePlotArea($servoMotorTSCurve);

            //generateServoMotorSpec();
        };

        // generates accordion container
        var generateServoMotorArea = function ($containerEle) {
            // accordion
            var $motorAreaAccordionContainer = $('<div id="motorAreaAccordionContainer"></div>');
            $containerEle.append($motorAreaAccordionContainer);

            var $panelGroup = $('<div class="panel-group" id="accordion' + settings.uniqeId + '" role="tablist" aria-multiselectable="true"></div>');
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

            if (settings.showTransmissionForm) {
                // transmission ratio accordion
                generateTransmissionRatioAccordion($panelGroup);
            }
            if (settings.showEnviorForm) {
                // environmentalFactors accordion
                generateEnvFactorsAccordion($panelGroup);
            }


            updateMotorStatus();
        };

        // generates motor selection table accordion
        var generateMotorPanelAccordion = function ($containerEle) {
            // motor panel accordion
            var $motorPanel = $('<div class="panelNew panel-defaultNew"></div>');
            $containerEle.append($motorPanel);

            var $motorPanelHeading = $('<div class="panel-heading panelHeadingNew" role="tab" id="headingOne"> <div id="PaginationDiv" class="Pagination"></div><span class="accordion-plus-minus  pull-right" aria-hidden="true" style="color: grey;"></span> </div>');
            $motorPanel.append($motorPanelHeading);

            var $motorPanelBodyContainer = $('<div id="collapseOne" class="panel-collapse collapse motorDataOpenPanle" role="tabpanel" aria-labelledby="headingOne"></div>');
            $motorPanel.append($motorPanelBodyContainer);

            var $motorPanelBody = $('<div class="panel-body"></div>')
            $motorPanelBodyContainer.append($motorPanelBody);

            $motorPanel.on('show.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $motorPanel.on('hide.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            /***********************************************/


            var $motorPanelBody = $motorPanel.find('#collapseOne .panel-body');
            var $motorDataContainer = $('<div id="motorDataContainer" class="row"></div>');
            $motorPanelBody.append($motorDataContainer);


            var $solutionInfoTitle = $('<div class="col-xs-12 col-12 solutionInfoTitle">Selected Motor: <div id="solutionTitle"></div>&nbsp;<div id="motorName"></div> <div class="statusContainer"><div class="solutionStatus motorPass" id="statusValueContainer">Pass</div></div></div>');
            $motorDataContainer.append($solutionInfoTitle);
            var $selectedMotorStatus = $('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');
            $solutionInfoTitle.append($selectedMotorStatus);


            var $solutionInfoRowOne = $('<div class="col-xs-12 col-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowOne);

            var $driveInfo = $('<div class="col-xs-6 col-6 padding-right-zero"><span class="maxSpeedTitle">Maximum Speed:&nbsp;</span><span class="maxSpeedValue" id="driveNameId">' + settings.motorData[settings.motorSelectedIndex - 1].maxSpeed + '</span><span class="unitStyle">&nbsp;rpm</span></div>');
            $solutionInfoRowOne.append($driveInfo);

            var $motorInfo = $('<div class="col-xs-6 col-6 padding-left-right-zero"><span class="inertiaTitle">Inertia:&nbsp;</span><span class="inertiaValue" id="voltageInfoId">' + settings.motorData[settings.motorSelectedIndex - 1].motorInertia + '</span><div class="display-inline unitStyle">&nbsp;kg-m<sup>2</sup></div></div>');
            $solutionInfoRowOne.append($motorInfo);

            var $solutionInfoRowthree = $('<div class="col-xs-12 col-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowthree);

            var $peakStallTorque = $('<div class="col-xs-6 col-6 padding-right-zero"><span class="pkStallTorqueTitle">Peak Stall Torque:&nbsp;</span><span class="peakStaTorqueVal" id="peakStallTorque">' + settings.motorData[settings.motorSelectedIndex - 1].peakStallTorque + '</span><span class="unitStyle">&nbsp;N-m</span></div>');
            $solutionInfoRowthree.append($peakStallTorque);

            var $contStallTorque = $('<div class="col-xs-6 col-6 padding-left-right-zero"><div class="contStallTorqueTitle">Continuous Stall Torque:&nbsp;</div><div class="continuousStaTorqueVal" id="continuousStallTorque">' + settings.motorData[settings.motorSelectedIndex - 1].continuousStallTorque + '</div><div class="unitStyle">&nbsp;N-m</div></div>');
            $solutionInfoRowthree.append($contStallTorque);




            $motorPanelHeading.find('#PaginationDiv').Folio({
                totalPages: settings.motorData.length,
                maxPages: 9,
                activePage: settings.motorSelectedIndex,
                previousClass: 'fa fa-chevron-left',
                nextClass: 'fa fa-chevron-right',
                onUpdate: function (index) {
                    settings.sequenceIndex = index;
                    updateMotorData(index);
                }
            })

        };
        function updateMotorData(motorIndex) {

            var motorIndex = (motorIndex - 1);


            //console.log(settings.motorData[motorIndex].drivePartNo);
            $container.find('#driveNameId').text(numberFormatter.format(settings.motorData[motorIndex].maxSpeed));
            $container.find('#motorNameId').text('(' + settings.motorData[motorIndex].motorPartNo + ')');
            $container.find('#voltageInfoId').text(numberFormatter.format(settings.motorData[motorIndex].motorInertia));
            $container.find('#peakStallTorque').text(numberFormatter.format(settings.motorData[motorIndex].peakStallTorque));
            $container.find('#continuousStallTorque').text(numberFormatter.format(settings.motorData[motorIndex].continuousStallTorque));
            $container.find('#solutionTitle').text('#' + (motorIndex + 1));
            $container.find('#motorName').text('(' + settings.motorData[motorIndex].motorPartNo + ')');
            $container.find('#tsMotorName').text('Motor T-S Curve : ' + settings.motorData[motorIndex].motorPartNo);



            settings.motorSelectedIndex = motorIndex;

            settings.motorInertia = settings.motorData[motorIndex].motorInertia;

            $container.find('#tempSlider').slider('setValue', settings.temperature);
            $container.find(".amount_TEMPERATURE").val(settings.temperature);

            $container.find('#altitudeSlider').slider('setValue', settings.altitude);
            $container.find(".amount_ALTITUDE").val(settings.altitude);

            //settings.defalutMotorContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;

            //settings.defalutMotorContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;

            settings.defaultPeakStallTorque = settings.motorData[settings.motorSelectedIndex].peakStallTorque;
            settings.defaultRollOffPoint = settings.motorData[settings.motorSelectedIndex].rollOffPoint;
            settings.defaultRollOffSpeed = settings.motorData[settings.motorSelectedIndex].rollOffSpeed;
            settings.defaultPeakTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed;
            settings.defaultContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;
            settings.defaultContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;

            if (settings.motorCheckedIndex.indexOf(settings.motorSelectedIndex) == -1) {
                settings.motorCheckedIndex.push(settings.motorSelectedIndex);
                settings.motorData[settings.motorSelectedIndex].defaultContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;
                settings.motorData[settings.motorSelectedIndex].defaultContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;
            }

            settings.motorSelectedIndex = motorIndex;
            settings.peakMotorData = [];
            settings.rmsMotorData = [];

            if(settings.showAppPointsForm == false){
                settings.peakPoints[0] = COSMATT.UNITCONVERTER.getUnitConvertedValue("ANGULARVELOCITY", settings.peakPoints[0],  "radianpersecond", "revolutionsperminute");
                settings.peakMotorData[0] = (settings.peakPoints[0] * settings.transmissionRaioVal);
            }
            

            settings.peakAcceMotor = (settings.peakAcceData * settings.transmissionRaioVal);



            settings.peakMotorData[0] = (settings.peakPoints[0] * settings.transmissionRaioVal);

            settings.peakMotorData[1] = ((parseFloat(settings.peakPoints[1]) / settings.transmissionRaioVal) + (settings.peakAcceMotor * settings.motorInertia));


            settings.rmsAcceMotor = (settings.rmsAcceData * settings.transmissionRaioVal);

            settings.rmsMotorData[0] = settings.peakMotorData[0];
            settings.rmsMotorData[1] = ((parseFloat(settings.rmsPoints[1]) / settings.transmissionRaioVal) + (settings.rmsAcceMotor * settings.motorInertia));

            if ($container.find('.cosmatt-unitComboBox').length > 0) {

                if ($container.find('.peakTorqueMotorSide').find('.cosmatt-unitLabelControl').length > 0) {
                    $container.find('.peakTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[1]);
                }
                if ($container.find('.rmsTorqueMotorSide').find('.cosmatt-unitLabelControl').length > 0) {
                    $container.find('.rmsTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsMotorData[1]);
                }
                if ($container.find('.peakSpeedMotorSide').find('.cosmatt-unitLabelControl').length > 0) {
                    $container.find('.peakSpeedMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[0]);
                }
                if ($container.find('.rmsAccelerationMotorSide').find('.cosmatt-unitLabelControl').length > 0) {
                    $container.find('.rmsAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsAcceMotor);
                }
                if ($container.find('.peakAccelerationMotorSide').find('.cosmatt-unitLabelControl').length > 0) {
                    $container.find('.peakAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakAcceMotor);
                }
            }

            updateMotorStatus();

            if ($container.find(".altitude-unit-combobox").length > 0) {
                altitudeImpactOnTSCurve(settings.altitude);
            }


            calculateTSCurevePoints();

        }
        var checkContainerWidth = function () {

            var $containerWidth = $container.find('.tsCruveContainer');            

            if (($containerWidth.width() < 1041 && $( window ).width() < 1263 ) ) {
                $containerWidth.find('#servoMotorArea').addClass('resizeWidth');
                $containerWidth.find('#servoMotorTSCurve').addClass('resizeWidth');
            }
            else if(($containerWidth.width() < 1013 && $( window ).width() < 1583 ) ) {
                $containerWidth.find('#servoMotorArea').addClass('resizeWidth');
                $containerWidth.find('#servoMotorTSCurve').addClass('resizeWidth');
            }
            else {
                $containerWidth.find('#servoMotorArea').removeClass('resizeWidth');
                $containerWidth.find('#servoMotorTSCurve').removeClass('resizeWidth');
            }
        };
        var updateMotorOperatingPoints = function (OperatingPointType, trnsRatio) {

            var tsPlotSeries = tsPlot.getData();
            settings.transmissionRaioVal = parseFloat(trnsRatio);

            switch (OperatingPointType) {

                case "PeakTorque":

                    settings.peakMotorData[1] = ((parseFloat(settings.peakPoints[1]) / settings.transmissionRaioVal) + (settings.peakAcceMotor * settings.motorInertia));
                    tsPlotSeries[1].data[0][1] = settings.peakMotorData[1];
                    $container.find('.peakTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[1]);

                    break;
                case "RmsTorque":

                    settings.rmsMotorData[1] = ((parseFloat(settings.rmsPoints[1]) / settings.transmissionRaioVal) + (settings.rmsAcceMotor * settings.motorInertia));
                    tsPlotSeries[3].data[0][1] = settings.rmsMotorData[1];
                    $container.find('.rmsTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsMotorData[1]);

                    break;
                case "PeakSpeed":
                    settings.rmsMotorData[0] = settings.peakMotorData[0] = (settings.peakPoints[0] * settings.transmissionRaioVal);
                    $container.find('.peakSpeedMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[0]);
                    tsPlotSeries[1].data[0][0] = tsPlotSeries[3].data[0][0] = settings.rmsMotorData[0] = settings.peakMotorData[0] = settings.peakSpeedRpm * settings.transmissionRaioVal;

                    break;
                case "RmsAcceleration":

                    settings.rmsAcceMotor = (settings.rmsAcceData * settings.transmissionRaioVal);
                    settings.rmsMotorData[1] = ((parseFloat(settings.rmsPoints[1]) / settings.transmissionRaioVal) + (settings.rmsAcceMotor * settings.motorInertia));
                    tsPlotSeries[3].data[0][1] = settings.rmsMotorData[1];
                    $container.find('.rmsTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsMotorData[1]);
                    $container.find('.rmsAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsAcceMotor);

                    break;
                case "PeakAcceleration":

                    settings.peakAcceMotor = (settings.peakAcceData * settings.transmissionRaioVal);
                    settings.peakMotorData[1] = ((parseFloat(settings.peakPoints[1]) / settings.transmissionRaioVal) + (settings.peakAcceMotor * settings.motorInertia));
                    tsPlotSeries[1].data[0][1] = settings.peakMotorData[1];
                    $container.find('.peakTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[1]);

                    $container.find('.peakAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakAcceMotor);

                    break;
                case "TransmissionRatio":

                    settings.peakAcceMotor = (settings.peakAcceData * settings.transmissionRaioVal);
                    settings.rmsAcceMotor = (settings.rmsAcceData * settings.transmissionRaioVal);

                    tsPlotSeries[1].data[0][0] = tsPlotSeries[3].data[0][0] = settings.rmsMotorData[0] = settings.peakMotorData[0] = (settings.peakPoints[0] * settings.transmissionRaioVal);
                    tsPlotSeries[1].data[0][1] = settings.peakMotorData[1] = ((settings.peakPoints[1] / settings.transmissionRaioVal) + (settings.peakAcceMotor * settings.motorInertia));

                    tsPlotSeries[3].data[0][1] = settings.rmsMotorData[1] = ((settings.rmsPoints[1] / settings.transmissionRaioVal) + (settings.rmsAcceMotor * settings.motorInertia));

                    /*if(tsPlotSeries[1].data[0][0] > settings.xaxisMaxVale){                     
                        tsPlot.getOptions().grid.markings[2].xaxis.to = '#fff';                     
                    }*/


                    if ($container.find('.cosmatt-unitComboBox').length > 0) {

                        if ($container.find('.peakTorqueMotorSide').find('.cosmatt-unitComboBox')) {
                            $container.find('.peakTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[1]);
                        }
                        if ($container.find('.rmsTorqueMotorSide').find('.cosmatt-unitComboBox')) {
                            $container.find('.rmsTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsMotorData[1]);
                        }
                        if ($container.find('.peakSpeedMotorSide').find('.cosmatt-unitComboBox')) {
                            $container.find('.peakSpeedMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[0]);
                        }
                        if ($container.find('.rmsAccelerationMotorSide').find('.cosmatt-unitComboBox')) {
                            $container.find('.rmsAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsAcceMotor);
                        }
                        if ($container.find('.peakAccelerationMotorSide').find('.cosmatt-unitComboBox')) {
                            $container.find('.peakAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakAcceMotor);
                        }
                    }

                    break;

            }


            updateTSGraph(tsPlotSeries);
            updateMotorStatus();

        };


        var updateMotorStatus = function () {

            var motorStatus = checkMotorStatus(settings.motorData[settings.motorSelectedIndex]).status;
            settings.motorStatus = motorStatus;
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
        var generateTSPointsAccordion = function ($containerEle) {
            var $tsPointsPanel = $('<div class="panel panel-default"></div>');
            $containerEle.append($tsPointsPanel);

            var $tsPointsPanelHeading = $('<div class="panel-heading" role="tab" id="headingTwo"> <h4 class="panel-title"> <a role="button"  data-toggle="collapse"  href="#collapseTwo' + settings.uniqeId + '" aria-controls="collapseTwo" aria-expanded="true"><span>Application Torque Speed Requirements </span><span class="accordion-plus-minus glyphicon pull-right glyphicon-chevron-down fa fa-chevron-down" aria-hidden="true" style="color: grey;"></span> </a> </h4> </div>');
            $tsPointsPanel.append($tsPointsPanelHeading);
            var openAppPanelDefault = '';
            if (settings.openAppReqPanel == true) {
                openAppPanelDefault = 'show'
            }

            var $tsPointsPanelBodyContainer = $('<div id="collapseTwo' + settings.uniqeId + '" class="panel-collapse collapse in ' + openAppPanelDefault + '" role="tabpanel" aria-labelledby="headingTwo"></div>');
            $tsPointsPanel.append($tsPointsPanelBodyContainer);

            $tsPointsPanel.on('show.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $tsPointsPanel.on('hide.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            if (!settings.showMotorSelForm) {
                $tsPointsPanelBodyContainer.addClass('in');
            }

            generateTSPointsConfigPanel($tsPointsPanelBodyContainer);
        }
        var applicationRequPointsOntextChan = function (appPointType, value) {
            var tsPlotSeries = tsPlot.getData();

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
                        $container.find('#peakSpeedValue').attr('data-max', parseInt(tsPlotSeries[1].data[0][0]));
                    }
                    else {
                        $container.find('#peakSpeedValue').attr('data-max', settings.sliderLimit.peakMaxSpeed);
                    }


                    if (tsPlotSeries[3].data[0][0] > settings.sliderLimit.rmsMaxSpeed) {
                        $container.find('#rmsSpeedValue').attr('data-max', parseInt(tsPlotSeries[3].data[0][0]));
                    }
                    else {
                        $container.find('#rmsSpeedValue').attr('data-max', settings.sliderLimit.rmsMaxSpeed);
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
        var updateApplicationRequPoints = function (appPointType) {
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
                    else {
                        $container.find('#peakSpeedSlider').slider('setAttribute', 'max', settings.sliderLimit.peakMaxSpeed);
                    }


                    if (tsPlotSeries[3].data[0][0] > settings.sliderLimit.rmsMaxSpeed) {
                        $container.find('#rmsSpeedSlider').slider('setAttribute', 'max', parseInt(tsPlotSeries[3].data[0][0]));
                    }
                    else {
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
        var generateTSPointsConfigPanel = function ($containerEle) {
            var $tsPointsPanelBody = $('<div class="panel-body"></div>')
            $containerEle.append($tsPointsPanelBody);

            var $tsPointsPanelContainer = $('<div id="tsPointsPanelContainer"></div>');
            $tsPointsPanelBody.append($tsPointsPanelContainer);

            var $operatingPointTitle = $('<div class="row vertical-divider" ></div>');
            $tsPointsPanelContainer.append($operatingPointTitle);

            var $operatingPointLevel = $('<div class="col-xs-3 col-3 title"></div>');
            $operatingPointTitle.append($operatingPointLevel);

            var $operatingPointTitle1 = $('<div class="col-xs-5 col-5"><div class="titleTextLoad ">Load Side</div><div class="loadSideImg"></div></div>');
            $operatingPointTitle.append($operatingPointTitle1);

            var $operatingPointTitle2 = $('<div class="col-xs-4 col-4 padding-right-zero"><div class="titleTextMotor">Motor Side</div><div class="motorSideImg"></div></div>');
            $operatingPointTitle.append($operatingPointTitle2);


            var $peakTorqueSliderContainer = $('<div  class="row greyClass vertical-divider"></div>');
            $tsPointsPanelContainer.append($peakTorqueSliderContainer);

            var $peakTorqueTitle = $('<div class="col-xs-3 col-3 title">Peak Torque:</div>');
            $peakTorqueSliderContainer.append($peakTorqueTitle);


            var $peakTorqueDataSide = $('<div class="col-xs-5 col-5  peakTorqueDataSide appComboBox"></div>');
            $peakTorqueSliderContainer.append($peakTorqueDataSide);

            var $peakTorqueMotorSide = $('<div class="col-xs-4 col-4  peakTorqueMotorSide"> </div>')
            $peakTorqueSliderContainer.append($peakTorqueMotorSide);

            var pkTextboxEnable = 'true';
            var pkComboBoxEnable = 'true';

            if (settings.disableControls && settings.disableControls.peakTorqueTextBox) {
                pkTextboxEnable = 'false';
                pkComboBoxEnable = 'false';
            }


            $peakTorqueDataSide.unitsComboBox({
                "unitType": "TORQUE",
                "unit": 'newtonmeter',
                "mode": 'spin',
                "step": '.1',
                "dataRule": "currency",
                "min": 0,
                "enable": { "textbox": pkTextboxEnable, "comboBox": pkComboBoxEnable },
                "value": settings.peakPoints[1],
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {

                    if (this.type == 'dropdown') {
                        $container.find('.peakTorqueMotorSide').data('unitsComboBox').setDropBoxItem(this.unit);
                    }

                    if (this.type != undefined && this.type != 'dropdown') {

                        if (this.value < settings.rmsPoints[1]) {
                            $container.find('.peakTorqueDataSide').data('unitsComboBox').setTextBoxValue(settings.peakPoints[1]);
                            setAlertMessage("Peak Torque can not be less than RMS Torque.");
                            return false;
                        }
                        setAlertMessage("");
                        settings.peakPoints[1] = this.SIValue;
                        updateMotorOperatingPoints('PeakTorque', settings.transmissionRaioVal);
                    }
                }
            });

            $peakTorqueDataSide.setSIValue(settings.peakPoints[1]);
            $peakTorqueMotorSide.unitsLabelControl({
                "unitType": "TORQUE",
                "unit": 'newtonmeter',
                "value": settings.peakMotorData[1],
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                }
            });
            $peakTorqueMotorSide.setSIValue(settings.peakMotorData[1]);
            $peakTorqueDataSide.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            //$peakTorqueMotorSide.find('.cosmatt-unitLabelControl').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');
            /* var peakTorqueSlider = $peakTorqueSlider.find('#peakTorqueSlider').slider({
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
             if(settings.disableControls && settings.disableControls.peakTorqueSlider){
                 peakTorqueSlider.slider("disable");
             }
             var peakTorqueOldValue = $peakTorqueSlider.find('#peakTorqueSlider').slider('getValue');
 
             
             $container.find('#peakTorqueSpinner').spinner('changed',function(e, newVal, oldVal){
                
 
                 $(this).data('oldValue', oldVal);
               
                  if (newVal < settings.rmsPoints[1]) {                    
                     $container.find('#peakTorqueValue').val($(this).data('oldValue'));
                     setAlertMessage("Peak Torque can not be less than RMS Torque.");                    
                     return false;
                 }
                 
                 setAlertMessage("");
 
                 var minValue =  parseInt($(this).attr('data-min'));
                 var maxValue =  parseInt($(this).attr('data-max')); 
                 var valueCurrent = ($(this).val());   
 
                 if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                     $(this).data('oldValue', $(this).val());
                     applicationRequPointsOntextChan("PeakTorque",newVal);
                 }             
                 else{
 
                     $(this).val($peakTorqueSlider.find('#peakTorqueSlider').slider('getValue'));
                     return;
                 } 
             });*/
            /*$container.find('#peakTorqueValue').on('focusin',function(e){
              $(this).data('oldValue', $(this).val());
            });
            $container.find('#peakTorqueValue').on('change',function(e){

                if (e.target.value < settings.rmsPoints[1]) {                    
                    $container.find('#peakTorqueValue').val($(this).data('oldValue'));
                    setAlertMessage("Peak Torque can not be less than RMS Torque.");                    
                    return false;
                }
                
                setAlertMessage("");

                var minValue =  parseInt($(this).attr('min'));
                var maxValue =  parseInt($(this).attr('max')); 
                var valueCurrent = ($(this).val());   

                if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                    $(this).data('oldValue', $(this).val());
                    applicationRequPointsOntextChan("PeakTorque",e.target.value);
                }             
                else{

                    $(this).val($peakTorqueSlider.find('#peakTorqueSlider').slider('getValue'));
                    return;
                } 
               
            });
*/


            var $rmsTorqueSliderContainer = $('<div class="row vertical-divider"></div>');
            $tsPointsPanelContainer.append($rmsTorqueSliderContainer);

            var $rmsTorqueTitle = $('<div class="col-xs-3 col-3 title"><span id="rmsTorqueTitle" title="RMS Torque">RMS Torque: </sapn></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueTitle);



            /*var $rmsTorqueSlider = $('<div class="col-xs-5 col-5  "><input id="rmsTorqueSlider" data-slider-value="' + settings.rmsPoints[1] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueSlider);

            var $rmsTorqueInput = $('<div class="col-xs-5 col-5   display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="rmsTorqueSpinner"><input id="rmsTorqueValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.rmsMaxTorque+'" data-min="0" data-step="0.1"  value="' + settings.rmsPoints[1] + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;Nm</div>');
            $rmsTorqueSliderContainer.append($rmsTorqueInput);*/

            var $rmsTorqueLoadSide = $('<div class="col-xs-5 col-5  rmsTorqueLoadSide appComboBox"></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueLoadSide);

            var $rmsTorqueMotorSide = $('<div class="col-xs-4 col-4  rmsTorqueMotorSide"> </div>');
            $rmsTorqueSliderContainer.append($rmsTorqueMotorSide);

            var rmsTextboxEnable = 'true';
            var rmsComboBoxEnable = 'true';

            if (settings.disableControls && settings.disableControls.rmsTorqueTextBox) {
                rmsTextboxEnable = 'false';
                rmsComboBoxEnable = 'false';
            }
            $rmsTorqueLoadSide.unitsComboBox({
                "unitType": "TORQUE",
                "unit": 'newtonmeter',
                "mode": 'spin',
                "step": '.1',
                "dataRule": "currency",
                "enable": { "textbox": rmsTextboxEnable, "comboBox": rmsComboBoxEnable },
                "min": 0,
                "value": settings.rmsPoints[1],
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {
                    if (this.type != undefined && this.type != 'dropdown') {
                        if (this.value > settings.peakPoints[1]) {
                            $container.find('.rmsTorqueLoadSide').data('unitsComboBox').setTextBoxValue(settings.rmsPoints[1]);
                            setAlertMessage("RMS Torque can not be greater than Peak Torque.");
                            return false;
                        }
                        setAlertMessage("");
                        settings.rmsPoints[1] = this.SIValue;
                        updateMotorOperatingPoints('RmsTorque', settings.transmissionRaioVal);
                    }
                    if (this.type == 'dropdown') {
                        $container.find('.rmsTorqueMotorSide').data('unitsComboBox').setDropBoxItem(this.unit);
                    }

                }
            });

            $rmsTorqueLoadSide.setSIValue(settings.rmsPoints[1]);
            $rmsTorqueMotorSide.unitsLabelControl({
                "unitType": "TORQUE",
                "unit": 'newtonmeter',
                "value": settings.rmsMotorData[1],
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                }
            });
            $rmsTorqueMotorSide.setSIValue(settings.rmsMotorData[1]);
            $rmsTorqueLoadSide.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            //$rmsTorqueMotorSide.find('.cosmatt-unitLabelControl').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');
            /*var rmsTorqueSlider = $rmsTorqueSlider.find('#rmsTorqueSlider').slider({
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

            if(settings.disableControls && settings.disableControls.rmsTorqueSlider){
                rmsTorqueSlider.slider("disable");
            }

            $container.find('#rmsTorqueSpinner').spinner('changed',function(e, newVal, oldVal){
       

                $(this).data('oldValue', oldVal);
              
                if (newVal > settings.peakPoints[1]) {
                        $container.find('#rmsTorqueValue').val($(this).data('oldValue'));
                        setAlertMessage("RMS Torque can not be greater than Peak Torque.");
                        return false;
                } else {
                        setAlertMessage("");

                        var minValue =  parseInt($(this).attr('data-min'));
                        var maxValue =  parseInt($(this).attr('data-max')); 
                        var valueCurrent = ($(this).val());                
                        if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                            $(this).data('oldValue', $(this).val());
                            applicationRequPointsOntextChan("RmsTorque",e.target.value);
                        } 
                        else{

                            $(this).val($rmsTorqueSlider.find('#rmsTorqueSlider').slider('getValue'));
                            return;
                        } 
                    
                }
            });*/

            /* $container.find('#rmsTorqueValue').on('focusin',function(e){
               $(this).data('oldValue', $(this).val());
             });
             $container.find('#rmsTorqueValue').on('change',function(e){
 
                 if (e.target.value > settings.peakPoints[1]) {
                         $container.find('#rmsTorqueValue').val($(this).data('oldValue'));
                         setAlertMessage("RMS Torque can not be greater than Peak Torque.");
                         return false;
                 } else {
                         setAlertMessage("");
 
                         var minValue =  parseInt($(this).attr('min'));
                         var maxValue =  parseInt($(this).attr('max')); 
                         var valueCurrent = ($(this).val());                
                         if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                             $(this).data('oldValue', $(this).val());
                             applicationRequPointsOntextChan("RmsTorque",e.target.value);
                         } 
                         else{
 
                             $(this).val($rmsTorqueSlider.find('#rmsTorqueSlider').slider('getValue'));
                             return;
                         } 
                     
                 }
 
                
             });*/


            var $peakSpeedSliderContainer = $('<div  class="row greyClass vertical-divider"></div>');
            $tsPointsPanelContainer.append($peakSpeedSliderContainer);

            var $peakSpeedTitle = $('<div class="col-xs-3 col-3 title"><span id="peakSpeedTitle" title="Peak Speed">Peak Speed: </sapn></div>');
            $peakSpeedSliderContainer.append($peakSpeedTitle);

            /*var $peakSpeedSlider = $('<div class="col-xs-5 col-5  "><input id="peakSpeedSlider" data-slider-value="' + settings.peakPoints[0] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $peakSpeedSliderContainer.append($peakSpeedSlider);

            var $peakSpeedInput = $('<div class="col-xs-5 col-5   display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="peakSpeedSpinner"><input id="peakSpeedValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.peakMaxSpeed+'" data-min="0" data-step="1"  value="' + settings.peakPoints[0] + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;rad/sec</div>')
            $peakSpeedSliderContainer.append($peakSpeedInput);*/

            var $peakSpeedLoadSide = $('<div class="col-xs-5 col-5  peakSpeedLoadSide appComboBox"></div>');
            $peakSpeedSliderContainer.append($peakSpeedLoadSide);

            var $peakSpeedMotorSide = $('<div class="col-xs-4 col-4  peakSpeedMotorSide"></div>')
            $peakSpeedSliderContainer.append($peakSpeedMotorSide);

            var pksTextboxEnable = 'true';
            var pksComboBoxEnable = 'true';

            if (settings.disableControls && settings.disableControls.peakSpeedTextBox) {
                pksTextboxEnable = 'false';
                pksComboBoxEnable = 'false';
            }
            settings.peakPoints[0] = COSMATT.UNITCONVERTER.getUnitConvertedValue("ANGULARVELOCITY", settings.peakPoints[0],  "radianpersecond", "revolutionsperminute");
            settings.peakMotorData[0] = (settings.peakPoints[0] * settings.transmissionRaioVal);
            $peakSpeedLoadSide.unitsComboBox({
                "unitType": "ANGULARVELOCITY",
                "unit": 'revolutionsperminute',
                "mode": "spin",
                "step": '1',
                "dataRule": "currency",
                "min": 0,
                "enable": { "textbox": pksTextboxEnable, "comboBox": pksComboBoxEnable },
                "value": settings.peakPoints[0],
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {

                    if (this.type != undefined && this.type != 'dropdown') {

                        settings.peakPoints[0] = this.value;

                        settings.peakSpeedRpm = COSMATT.UNITCONVERTER.getUnitConvertedValue('ANGULARVELOCITY', this.value, this.unit, 'revolutionsperminute');

                        updateMotorOperatingPoints('PeakSpeed', settings.transmissionRaioVal);


                    }
                    if (this.type == 'dropdown') {

                        $container.find('.peakSpeedMotorSide').data('unitsComboBox').setDropBoxItem(this.unit);
                    }
                }
            });

            $peakSpeedMotorSide.unitsLabelControl({
                "unitType": "ANGULARVELOCITY",
                "unit": 'revolutionsperminute',
                "value": settings.peakMotorData[0],
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {

                }
            });

           // $peakSpeedMotorSide.setSIValue(settings.peakPoints[0]);
            $peakSpeedLoadSide.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            //$peakSpeedMotorSide.find('.cosmatt-unitLabelControl').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');
            /*var peakSpeedSlider = $peakSpeedSlider.find('#peakSpeedSlider').slider({
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

            if(settings.disableControls && settings.disableControls.peakSpeedSlider){
                peakSpeedSlider.slider("disable");
            }
            
            $container.find('#peakSpeedSpinner').spinner('changed',function(e, newVal, oldVal){
       

                $(this).data('oldValue', oldVal);
              
                if (newVal < settings.rmsPoints[0]) {
                    console.log("$(this).data('oldValue'): ",$(this).data('oldValue'));
                    $container.find('#peakSpeedValue').val($(this).data('oldValue'));
                    setAlertMessage("Peak Speed can not be less than RMS Speed.");
                    return false;
                }
                setAlertMessage("");
                 
                var minValue =  parseInt($(this).attr('data-min'));
                var maxValue =  parseInt($(this).attr('data-max')); 
                var valueCurrent = ($(this).val());                
                if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                    $(this).data('oldValue', $(this).val()); 
                    applicationRequPointsOntextChan("PeakSpeed",e.target.value);
                } 
                else{

                    $(this).val($peakSpeedSlider.find('#peakSpeedSlider').slider('getValue'));
                    return;
                }     

            });*/
            /* $container.find('#peakSpeedValue').on('focusin',function(e){
               $(this).data('oldValue', $(this).val());
             });
             $container.find('#peakSpeedValue').on('change',function(e){
 
                 if (e.target.value < settings.rmsPoints[0]) {
                     console.log("$(this).data('oldValue'): ",$(this).data('oldValue'));
                     $container.find('#peakSpeedValue').val($(this).data('oldValue'));
                     setAlertMessage("Peak Speed can not be less than RMS Speed.");
                     return false;
                 }
                 setAlertMessage("");
                  
                 var minValue =  parseInt($(this).attr('min'));
                 var maxValue =  parseInt($(this).attr('max')); 
                 var valueCurrent = ($(this).val());                
                 if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                     $(this).data('oldValue', $(this).val()); 
                     applicationRequPointsOntextChan("PeakSpeed",e.target.value);
                 } 
                 else{
 
                     $(this).val($peakSpeedSlider.find('#peakSpeedSlider').slider('getValue'));
                     return;
                 }     
 
                 
             });
 */

            /* if(settings.disableControls && settings.disableControls.peakSpeedTextBox){
                 $container.find('#peakSpeedValue').attr("disabled",true);
             }*/




            var $peakAccContainer = $('<div  class="row vertical-divider"></div>');
            $tsPointsPanelContainer.append($peakAccContainer);

            var $peakAccTitle = $('<div class="col-xs-3 col-3 title"><div title="Peak Acceleration" class="peakAccele">Peak Acceleration: </div></div>');
            $peakAccContainer.append($peakAccTitle);

            var $peakAccelerationLoadSide = $('<div class="col-xs-5 col-5  peakAccelerationLoadSide appComboBox"></div>');
            $peakAccContainer.append($peakAccelerationLoadSide);

            var $peakAccelerationMotorSide = $('<div class="col-xs-4 col-4  peakAccelerationMotorSide"></div>');
            $peakAccContainer.append($peakAccelerationMotorSide);

            var pkacTextboxEnable = 'true';
            var pkacComboBoxEnable = 'true';

            if (settings.disableControls && settings.disableControls.peakAcceleration) {
                pkacTextboxEnable = 'false';
                pkacComboBoxEnable = 'false';
            }

            $peakAccelerationLoadSide.unitsComboBox({
                "unitType": "ANGULARACCELERATION",
                "unit": 'radianpersecondsquare',
                "mode": 'spin',
                "step": '1',
                "dataRule": "currency",
                "enable": { "textbox": pkacTextboxEnable, "comboBox": pkacComboBoxEnable },
                "value": settings.peakAcceData,
                "min": 0,
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {
                    if (this.type != undefined && this.type != 'dropdown') {

                        if (this.value < settings.rmsAcceData) {
                            $container.find('.peakAccelerationLoadSide').data('unitsComboBox').setTextBoxValue(settings.peakAcceData);
                            setAlertMessage("Peak Acceleration can not be less than RMS Acceleration.");
                            return false;
                        }
                        setAlertMessage("");
                        settings.peakAcceData = this.SIValue;
                        updateMotorOperatingPoints('PeakAcceleration', settings.transmissionRaioVal);
                    }
                    if (this.type == 'dropdown') {
                        $container.find('.peakAccelerationMotorSide').data('unitsComboBox').setDropBoxItem(this.unit);
                    }

                }
            });
            $peakAccelerationLoadSide.setSIValue(settings.peakAcceData);
            $peakAccelerationMotorSide.unitsLabelControl({
                "unitType": "ANGULARACCELERATION",
                "unit": 'radianpersecondsquare',
                "value": settings.peakAcceMotor,
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {

                }
            });

            $peakAccelerationMotorSide.setSIValue(settings.peakAcceMotor);
            $peakAccelerationLoadSide.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            //$peakAccelerationMotorSide.find('.cosmatt-unitLabelControl').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');


            /* var rmsSpeedSlider = $rmsSpeedSlider.find('#rmsSpeedSlider').slider({
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
 
             if(settings.disableControls && settings.disableControls.rmsSpeedSlider){
                 rmsSpeedSlider.slider("disable");
             }
 
             $container.find('#rmsSpeedSpinner').spinner('changed',function(e, newVal, oldVal){
        
 
                 $(this).data('oldValue', oldVal);
               
                 if (newVal > settings.peakPoints[0]) {
                     $container.find('#rmsSpeedValue').val($(this).data('oldValue'));
                     setAlertMessage("RMS Speed can not be greater than Peak Speed.");
                     return;
                 }
                 setAlertMessage("");
 
                 var minValue =  parseInt($(this).attr('data-min'));
                 var maxValue =  parseInt($(this).attr('data-max')); 
                 var valueCurrent = ($(this).val());                
                 if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                     $(this).data('oldValue', $(this).val());
                     applicationRequPointsOntextChan("RmsSpeed",newVal);
                 } 
                 else{
 
                     $(this).val($rmsSpeedSlider.find('#rmsSpeedSlider').slider('getValue'));
                     return;
                 } 
             });*/
            /*$container.find('#rmsSpeedValue').on('focusin',function(e){
              $(this).data('oldValue', $(this).val());
            });
            $container.find('#rmsSpeedValue').on('change',function(e){
                if (e.target.value > settings.peakPoints[0]) {
                    $container.find('#rmsSpeedValue').val($(this).data('oldValue'));
                    setAlertMessage("RMS Speed can not be greater than Peak Speed.");
                    return;
                }
                setAlertMessage("");

                var minValue =  parseInt($(this).attr('min'));
                var maxValue =  parseInt($(this).attr('max')); 
                var valueCurrent = ($(this).val());                
                if(valueCurrent >= minValue && valueCurrent <= maxValue) {
                    $(this).data('oldValue', $(this).val());
                    applicationRequPointsOntextChan("RmsSpeed",e.target.value);
                } 
                else{

                    $(this).val($rmsSpeedSlider.find('#rmsSpeedSlider').slider('getValue'));
                    return;
                } 

                
                
            });*/
            var $rmsAccContainer = $('<div  class="row greyClass vertical-divider"></div>');
            $tsPointsPanelContainer.append($rmsAccContainer);

            var $rmsSpeedTitle = $('<div class="col-xs-3 col-3 title"><div id="rmsSpeedTitle" title="RMS Acceleration" class="rmsAccele">RMS Acceleration: </div></div>');
            $rmsAccContainer.append($rmsSpeedTitle);


            var $rmsAccelerationLoadSide = $('<div class="col-xs-5 col-5  rmsAccelerationLoadSide appComboBox"></div>');
            $rmsAccContainer.append($rmsAccelerationLoadSide);

            var $rmsAccelerationMotorSide = $('<div class="col-xs-4 col-4  rmsAccelerationMotorSide"></div>');
            $rmsAccContainer.append($rmsAccelerationMotorSide);

            var rmsacTextboxEnable = 'true';
            var rmsacComboBoxEnable = 'true';

            if (settings.disableControls && settings.disableControls.rmsAcceleration) {
                rmsacTextboxEnable = 'false';
                rmsacComboBoxEnable = 'false';
            }

            $rmsAccelerationLoadSide.unitsComboBox({
                "unitType": "ANGULARACCELERATION",
                "unit": 'radianpersecondsquare',
                "mode": 'spin',
                "step": '1',
                "dataRule": "currency",
                "enable": { "textbox": rmsacTextboxEnable, "comboBox": rmsacComboBoxEnable },
                "min": 0,
                "value": settings.rmsAcceData,
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {
                    if (this.type != undefined && this.type != 'dropdown') {

                        if (this.value > settings.peakAcceData) {
                            $container.find('.rmsAccelerationLoadSide').data('unitsComboBox').setTextBoxValue(settings.rmsAcceData);
                            setAlertMessage("RMS Acceleration can not be greater than Peak Acceleration.");
                            return false;
                        }
                        setAlertMessage("");
                        settings.rmsAcceData = this.SIValue;
                        updateMotorOperatingPoints('RmsAcceleration', settings.transmissionRaioVal);
                    }

                    if (this.type == 'dropdown') {
                        $container.find('.rmsAccelerationMotorSide').data('unitsComboBox').setDropBoxItem(this.unit);
                    }
                }
            });
            $rmsAccelerationLoadSide.setSIValue(settings.rmsAcceData);
            $rmsAccelerationMotorSide.unitsLabelControl({
                "unitType": "ANGULARACCELERATION",
                "unit": 'radianpersecondsquare',
                "value": settings.rmsAcceMotor,
                "comboBoxWidthRatio": {
                    "textBox": "50%",
                    "comboBox": "50%"
                },
                callBackFn: function () {

                }
            });
            $rmsAccelerationMotorSide.setSIValue(settings.rmsAcceMotor);
            $rmsAccelerationLoadSide.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            //$rmsAccelerationMotorSide.find('.cosmatt-unitLabelControl').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');
            if (settings.disableControls && settings.disableControls.rmsSpeedTextBox) {
                $container.find('#rmsSpeedValue').attr("disabled", true);
            }

            if (settings.showMotorTsCurve) {
                var $statusContainer = $('<div  class="row"></div>');
                $tsPointsPanelContainer.append($statusContainer);
            }

            $tsPointsPanelContainer.append('<div id="alertMessageContainer" class="alert alert-warning"><strong>Warning:-&nbsp;&nbsp;</strong><span></span></div>');

            var setAlertMessage = function (alertText) {
                if (alertText === "") {
                    $tsPointsPanelContainer.find('#alertMessageContainer').hide();
                    return;
                }

                $tsPointsPanelContainer.find('#alertMessageContainer span').text(alertText);

                $tsPointsPanelContainer.find('#alertMessageContainer').show();

                setTimeout(function () {
                    $tsPointsPanelContainer.find('#alertMessageContainer').fadeOut("slow");
                }, 3000)
            };
        };

        // generates Environmental factors slider accordion
        var generateEnvFactorsAccordion = function ($containerEle) {
            var $envFactorsPanel = $('<div class="panel panel-default"></div>');
            $containerEle.append($envFactorsPanel);

            var $envFactorsPanelHeading = $('<div class="panel-heading" role="tab" id="headingThree"> <h4 class="panel-title"> <a role="button"   data-toggle="collapse"  href="#collapseThree' + settings.uniqeId + '" aria-controls="collapseThree" aria-expanded="false"><span> Environmental Factors</span> <span class="accordion-plus-minus glyphicon pull-right glyphicon-chevron-down fa fa-chevron-down" aria-hidden="true" style="color: grey;"></span> </a> </h4> </div>');
            $envFactorsPanel.append($envFactorsPanelHeading);

            var $envFactorsPanelBodyContainer = $('<div id="collapseThree' + settings.uniqeId + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree"></div>');
            $envFactorsPanel.append($envFactorsPanelBodyContainer);

            var $envFactorsPanelBody = $('<div class="panel-body"></div>')
            $envFactorsPanelBodyContainer.append($envFactorsPanelBody);

            $envFactorsPanel.on('show.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $envFactorsPanel.on('hide.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            generateEnvFactorsConfigPanel($envFactorsPanelBody);
        };

        // generates Environmental factors slider accordion body
        var generateEnvFactorsConfigPanel = function ($containerEle) {
            var $envFactorsPanelContainer = $('<div id="envFactorsPanelContainer"></div>');
            $containerEle.append($envFactorsPanelContainer);

            var $tempSliderContainer = $('<div  class="row"></div>');
            $envFactorsPanelContainer.append($tempSliderContainer);

            var $tempTitle = $('<div class="col-xs-3 col-3 title"><span id="tempTitle">Temperature: </span></div>');
            $tempSliderContainer.append($tempTitle);

            var $tempSlider = $('<div class="col-xs-3 col-3  "><input id="tempSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $tempSliderContainer.append($tempSlider);

            /*var $tempInput = $('<div class="col-sm-5  "><input type="number" id="tempValue" name="quantity" min="0" value="' + settings.motorData[settings.motorSelectedIndex].temp + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&deg;C</label></div>');
            $tempSliderContainer.append($tempInput);*/
            var sliderMax = settings.sliderLimit.maxTemp || defaults.sliderLimit.maxTemp;

            var $tempInput = $('<div class="col-xs-6 col-6  temp-unit-dropdown display-flex margin-bottom"></label></div>');
            $tempSliderContainer.append($tempInput);

            //var $tempValue = $('<div class="col-sm-3"><label class="value" id="tempValue">' + settings.motorData[settings.motorSelectedIndex].temp + '</label><label class="value">&deg;C</label></div>');
            //$tempSliderContainer.append($tempValue);



            settings.defaultPeakStallTorque = settings.motorData[settings.motorSelectedIndex].peakStallTorque;
            settings.defaultRollOffPoint = settings.motorData[settings.motorSelectedIndex].rollOffPoint;
            settings.defaultRollOffSpeed = settings.motorData[settings.motorSelectedIndex].rollOffSpeed;
            settings.defaultPeakTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed;
            settings.defaultContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;
            settings.defaultContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;


            $tempSliderContainer.find('#tempSlider').slider({
                value: settings.temperature,
                min: 0,
                max: sliderMax,
                step: 1,
            }).on('change', function (slideEvt) {

                $(".temp-unit-dropdown").data('unitsComboBox').setTextBoxValue(slideEvt.value.newValue);
                settings.temperature = slideEvt.value.newValue;
                var deltaTemp = (slideEvt.value.newValue - slideEvt.value.oldValue);

                if (deltaTemp !== 0) {
                    tempImpactOnTScurve(slideEvt.value.newValue);
                }

            });

            if (settings.disableControls && settings.disableControls.tempSlider) {
                $tempSliderContainer.find('#tempSlider').slider("disable");
            }


            $tempInput.unitsComboBox({
                "unitType": "TEMPERATURE",
                "unit": 'celsius',
                "mode": 'spin',
                "step": '1',
                "dataRule": "currency",
                "min": 0,
                "value": settings.temperature,
                "comboBoxWidthRatio": {
                    "textBox": "45%",
                    "comboBox": "35%"
                },
                callBackFn: function () {

                    if (this.type != undefined && this.type != 'dropdown' ) {
                        settings.temperature = this.SIValue;
                        $container.find('#tempSlider').slider('setValue', parseInt(this.value));
                        tempImpactOnTScurve(this.value);
                    }

                }
            });
            $tempInput.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');


            if (settings.disableControls && settings.disableControls.tempTextBox) {
                $container.find('.amount_TEMPERATURE').attr("disabled", true);
            }

            var tempImpactOnTScurve = function (changedValue) {
                updatePlotDataOnTempChange("peakPlot", parseInt(changedValue));
                updatePlotDataOnTempChange("rmsPlot", parseInt(changedValue));
            }

            var updatePlotDataOnTempChange = function (plotType, currentTemp) {

                var tsPlotSeries = tsPlot.getData();


                var ta = currentTemp; // Application temperature
                var tr = 40 // Rating ambient (the ambient at which the motor is rated - default 40 degrees)
                var twl = 155 // Limiting winding temperature in degree celcius
                var ts = 25 //Motor specification Temperature
                // var tw = ta + (0.6 * (twl - ta)); //Winding temperature
                var tm = ta + (0.6 * (twl - ta)); //Actual Magnet Temperature
                var tmr = tr + (0.6 * (twl - tr)); //Rating Magnet Temperature
                var Km = -0.0015; // is the temperature coefficient of the rotor magnets


                var K1 = (1 - (ta - tr) / (twl - tr));
                var K2 = ((ts + 234.5) / (tmr + 234.5));
                var K3 = (1 + (tm - tmr) * Km);

                switch (plotType) {
                    case "peakPlot":
                        var peakPlotData = tsPlotSeries[0].data;

                        for (var i = 0; i < peakPlotData.length; i++) {

                            //peakPlotData[i][0] = peakPlotData[i][0] * K3;

                            if (settings.motorData[settings.motorSelectedIndex] != undefined) {
                                if (i == 0 || i == 12 || i == 6) {

                                    peakPlotData[i][1] = settings.defaultPeakStallTorque * K3;
                                    if (i == 0) {
                                        settings.motorData[settings.motorSelectedIndex].peakStallTorque = peakPlotData[i][1];
                                    }
                                    if (i == 6) {
                                        peakPlotData[i][1] = -(peakPlotData[i][1]);
                                    }

                                }
                                if (i == 1 || i == 7) {

                                    peakPlotData[i][1] = settings.defaultRollOffPoint * K3;
                                    peakPlotData[i][0] = settings.defaultRollOffSpeed / K3;
                                    settings.motorData[settings.motorSelectedIndex].rollOffPoint = peakPlotData[i][1];
                                    settings.motorData[settings.motorSelectedIndex].rollOffSpeed = peakPlotData[i][0];
                                    if (i == 7) {
                                        peakPlotData[i][0] = -(peakPlotData[i][0]);
                                        peakPlotData[i][1] = -(peakPlotData[i][1]);
                                    }
                                }
                                if (i == 2 || i == 8) {

                                    peakPlotData[i][1] = settings.defaultPeakTorqueAtMaxSpeed * K3;
                                    settings.motorData[settings.motorSelectedIndex].peakTorqueAtMaxSpeed = peakPlotData[i][1];
                                    if (i == 8) {
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
                                    if (i == 5) {
                                        rmsPlotData[i][1] = -(rmsPlotData[i][1]);
                                    }
                                }
                                if (i == 1 || i == 6) {
                                    rmsPlotData[i][1] = settings.defaultContinuosTorqueAtMaxSpeed * (K3 * Math.sqrt(K1 / K2));
                                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[i][1];
                                    //settings.defalutMotorContinuosTorqueAtMaxSpeed = rmsPlotData[i][1];
                                    if (i == 6) {
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
            var updatePlotDataOnTempChange_copy = function (plotType, delta) {

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


            var $altitudeSliderContainer = $('<div  class="row"></div>');
            $envFactorsPanelContainer.append($altitudeSliderContainer);

            var $altitudeTitle = $('<div class="col-xs-3 col-3 title"><span id="altitudeTitle">Altitude: </span></div>');
            $altitudeSliderContainer.append($altitudeTitle);

            var $altitudeSlider = $('<div class="col-xs-3 col-3  "><input id="altitudeSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $altitudeSliderContainer.append($altitudeSlider);

            /*var $altitudeInput = $('<div class="col-sm-5  "><input type="number" id="altitudeValue" name="quantity" min="0" value="' + settings.motorData[settings.motorSelectedIndex].altitude + '" class="widgetNumberInput form-control bfh-number"><label class="value">&nbsp;&nbsp;m</label></div>');
            $altitudeSliderContainer.append($altitudeInput);*/
            var sliderMax = settings.sliderLimit.maxAltitude || defaults.sliderLimit.maxAltitude;

            var $altitudeInput = $('<div class="col-xs-6 col-6 altitude-unit-combobox display-flex margin-bottom"> </div>');
            $altitudeSliderContainer.append($altitudeInput);

            settings.defaultContinuousStallTorque = settings.motorData[settings.motorSelectedIndex].continuousStallTorque;

            settings.defaultContinuosTorqueAtMaxSpeed = settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed;

            $altitudeSlider.find('#altitudeSlider').slider({
                value: settings.altitude,
                min: 0,
                max: 10000,
                step: 1,
            }).on('change', function (slideEvt) {
                altitudeImpactOnTSCurve(slideEvt.value.newValue);
            });

            if (settings.disableControls && settings.disableControls.altitudeSlider) {
                $altitudeSlider.find('#altitudeSlider').slider("disable");
            }

            $altitudeInput.unitsComboBox({

                "unitType": "ALTITUDE",
                "unit": 'meter',
                "mode": 'spin',
                "step": '1',
                "dataRule": "currency",
                "min": 0,
                "value": settings.altitude,
                "comboBoxWidthRatio": {
                    "textBox": "45%",
                    "comboBox": "35%"

                },
                callBackFn: function () {
                    if (this.type != undefined && this.type != 'dropdown') {
                        settings.altitude = this.value;
                        $container.find('#altitudeSlider').slider('setValue', this.value);
                        altitudeImpactOnTSCurve(parseInt(this.value));
                    }
                }
            });

            /*$container.find('#altitudeSpinner').spinner('changed', function (e, newVal, oldVal) {

                var currentTextBoxVal = parseInt(newVal);

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
                else {

                    var altitConstant = 1;

                    rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.defaultContinuousStallTorque * altitConstant).toFixed(3);

                    rmsPlotData[1][1] = (settings.defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                    tsPlotSeries[2].data = rmsPlotData;
                    settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                    settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];
                }
                updateTSGraph(tsPlotSeries);
                updateMotorStatus();

            });*/

            $altitudeInput.find('.cosmatt-unitComboBox').append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            /*$container.find('#altitudeValue').on('change',function(e){
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

                  
            });*/



            if (settings.disableControls && settings.disableControls.altitudeTextBox) {
                $container.find('.amount_ALTITUDE').attr("disabled", true);
            }


        };

        var altitudeImpactOnTSCurve = function (changedValue) {

            if (tsPlot == undefined) {
                return;
            }
            $container.find(".altitude-unit-combobox").data('unitsComboBox').setTextBoxValue(changedValue);
            var tsPlotSeries = tsPlot.getData();
            var rmsPlotData = tsPlotSeries[2].data;
            settings.altitude = changedValue;

            if (changedValue > 1500) {

                var altitConstant = [1 - (changedValue - 1500) / 10000];

                rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.motorData[settings.motorSelectedIndex].defaultContinuousStallTorque * altitConstant).toFixed(3);

                rmsPlotData[1][1] = (settings.motorData[settings.motorSelectedIndex].defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                tsPlotSeries[2].data = rmsPlotData;
                settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];

            }
            else {

                var altitConstant = 1;

                rmsPlotData[0][1] = rmsPlotData[10][1] = (settings.defaultContinuousStallTorque * altitConstant).toFixed(3);

                rmsPlotData[1][1] = (settings.defaultContinuosTorqueAtMaxSpeed * altitConstant).toFixed(3);

                tsPlotSeries[2].data = rmsPlotData;
                settings.motorData[settings.motorSelectedIndex].continuousStallTorque = rmsPlotData[0][1];
                settings.motorData[settings.motorSelectedIndex].continuosTorqueAtMaxSpeed = rmsPlotData[1][1];
            }
            updateTSGraph(tsPlotSeries);
            updateMotorStatus();

        }
        // generates Transmission Ratio slider accordion
        var generateTransmissionRatioAccordion = function ($containerEle) {
            var $trRatioPanel = $('<div class="panel panel-default"></div>');
            $containerEle.append($trRatioPanel);

            var $trRatioPanelHeading = $('<div class="panel-heading" role="tab" id="headingFour"> <h4 class="panel-title"> <a role="button"  data-toggle="collapse"  href="#collapseFour' + settings.uniqeId + '" aria-controls="collapseFour" aria-expanded="false"><span> Transmission Ratio</span> <span class="accordion-plus-minus glyphicon pull-right glyphicon-chevron-down fa fa-chevron-down" aria-hidden="true" style="color: grey;"></span> </a> </h4> </div>');
            $trRatioPanel.append($trRatioPanelHeading);
            var transmissionPane = 'show';
            if (settings.openTransmPanel == false) {
                transmissionPane = 'in';
            }

            var $trRatioPanelBodyContainer = $('<div id="collapseFour' + settings.uniqeId + '" class="panel-collapse collapse in ' + transmissionPane + '" role="tabpanel" aria-labelledby="headingFour"></div>');
            $trRatioPanel.append($trRatioPanelBodyContainer);

            var $trRatioPanelBody = $('<div class="panel-body"></div>')
            $trRatioPanelBodyContainer.append($trRatioPanelBody);

            $trRatioPanel.on('show.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-down fa fa-chevron-down').addClass('glyphicon-chevron-up fa fa-chevron-up');
            });
            $trRatioPanel.on('hide.bs.collapse', function (e) {
                $(this).find('.accordion-plus-minus').removeClass('glyphicon-chevron-up fa fa-chevron-up').addClass('glyphicon-chevron-down fa fa-chevron-down');
            });

            generateTransmissionRatioConfigPanel($trRatioPanelBody);
        }

        // generates Transmission Ratio slider accordion body
        var generateTransmissionRatioConfigPanel = function ($containerEle) {
            var $transmissionRatioPanelContainer = $('<div id="transmissionRatioPanelContainer"></div>');
            $containerEle.append($transmissionRatioPanelContainer);

            var $trRatioSliderContainer = $('<div  class="row"></div>');
            $transmissionRatioPanelContainer.append($trRatioSliderContainer);

            var $trRatioTitle = $('<div class="col-xs-3 col-3 title"><span id="trRatioTitle">Transmission Ratio: </span></div>');
            $trRatioSliderContainer.append($trRatioTitle);

            /*var $trRatioSlider = $('<div class="col-xs-4 col-4  " ><input id="trRatioSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $trRatioSliderContainer.append($trRatioSlider);*/

            var $trRatioslider = $('<div class="col-xs-6 col-6 trRatioSlider"></div>');
            $trRatioSliderContainer.append($trRatioslider);

            var $transmContainer = $('<div class="transmContainer"><div class="transmInnerContainer"></div></div>');
            $trRatioslider.append($transmContainer);

            var $transmLabel = $('<div class="transmLabel"><ul><li class="firstLi">1:1</li><li class="secondLi">10:1</li><li class="thirdLi">100:1</li><li class="fourthLi">1000:1</li></ul></div>');
            $trRatioslider.append($transmLabel);

            var $trRatioInput = $('<div class="col-xs-3 col-3 trRatioValue"><input type="text" value="' + settings.transmissionRaioVal + '" class="transInputBox form-control text-left input-control" id="transInputBox"/> </div>');
            $trRatioSliderContainer.append($trRatioInput);

            settings.defaultRmsTorque = settings.rmsMotorData[1];
            settings.defaultRmsSpeed = settings.rmsMotorData[0];
            settings.defaultPeakTorque = settings.peakMotorData[1];
            settings.defaultPeakSpeed = settings.peakMotorData[0];


            var transmissionTxtEnable = 'true';
            var transmissionComboBoxEnable = 'true';

            var setTransmSliderPointer = function (value) {
                settings.transmTextChange = true;
                settings.sliderVal = Math.log(value) / Math.log('1.071519305');
                $trRatioslider.find(".transmContainer").mCustomScrollbar('scrollTo', settings.sliderVal + '%');

            };

            if (settings.disableControls && settings.disableControls.transmission) {
                transmissionTxtEnable = 'false';
                transmissionComboBoxEnable = 'false';
            }

            var $containerWidth = $container.find('.tsCruveContainer').find('#transmissionRatioPanelContainer');

            if ($containerWidth.width() <= 502) {
                $containerWidth.find(".transmContainer").css('width', '210px');
                $containerWidth.find(".transmInnerContainer").css('width', '2310px');
                $containerWidth.find(".transmLabel").find('li.firstLi').css('left', '35px');
                $containerWidth.find(".transmLabel").find('li.secondLi').css('left', '83px');
                $containerWidth.find(".transmLabel").find('li.thirdLi').css('left', '132px');
                $containerWidth.find(".transmLabel").find('li.fourthLi').css('left', '182px');
                setTimeout(function () {
                    generateTransmSlider('21', '21');
                }, 500);

            } else {
                setTimeout(function () {
                    generateTransmSlider('26', '26');
                }, 50);
            }

            var timerId = 0;
            var formatTextBoxValue = function (value) {

                if ($container.find("input.transInputBox").is(":focus")) {

                    console.log("input has focus, don't format")
                    return;
                }

                if (numberFormatter) {
                    value = numberFormatter.format(value, true);
                }
                $container.find("input.transInputBox").val(value);

            }

            var transmTextboxEventHandler = function () {
                $container.find("input.transInputBox").on('focus', function () {

                    $(this).val(settings.transmissionRaioVal);
                });

                $container.find("input.transInputBox").on('blur', function () {

                    formatTextBoxValue(this.value);
                });
                $container.find("input.transInputBox").on('input', function () {

                    var self = this;
                    settings.value = $(self).val();
                    if (timerId > 0) {
                        clearTimeout(timerId);
                    }

                    timerId = setTimeout((function () {

                        if (self.value > 1000) {
                            $(self).val(settings.transmissionRaioVal);
                            setAlertMessage("Transmission ratio value can not be greater than 1000.");
                            return false;
                        }

                        if (self.value <= 0) {
                            $(self).val(settings.transmissionRaioVal);
                            setAlertMessage("Transmission ratio value can not be less than 1.");
                            return false;
                        }
                        setAlertMessage("");
                        settings.transmissionRaioVal = $(self).val();
                        setTransmSliderPointer($(self).val());
                        updateMotorOperatingPoints('TransmissionRatio', $(self).val());

                    }), 800);


                });
            }
            transmTextboxEventHandler();

            var $traioLabel = $('<div class="transmissionRaioVal">&nbsp;: 1</div>');
            $trRatioInput.append($traioLabel);

            $trRatioInput.append('<div class="response-status"><span class="fa"></span><span class="correct-answer"></span></div>');

            if (settings.disableControls && settings.disableControls.transmRatioSlider) {
             
                $container.find(".trRatioSlider").addClass('pointer-events-none');
                
            }         

            if (settings.disableControls && settings.disableControls.transmRatioTextBox) {
                $container.find('.trRatioValue').find('.transInputBox ').attr("disabled", true);
            }

            $transmissionRatioPanelContainer.append('<div id="alertMessageContainer" class="alert alert-warning"><strong>Warning:-&nbsp;&nbsp;</strong><span></span></div>');
            $(".mCSB_buttonRight, .mCSB_buttonLeft, .mCSB_draggerContainer, #mCSB_1_dragger_horizontal").click(function (e) {

                settings.transmTextChange = false;

            });
            $("#mCSB_1_dragger_horizontal").mouseenter(function () {
                settings.transmTextChange = false;
            });

            var setAlertMessage = function (alertText) {
                if (alertText === "") {
                    $transmissionRatioPanelContainer.find('#alertMessageContainer').hide();
                    return;
                }

                $transmissionRatioPanelContainer.find('#alertMessageContainer span').text(alertText);

                $transmissionRatioPanelContainer.find('#alertMessageContainer').show();

                setTimeout(function () {
                    $transmissionRatioPanelContainer.find('#alertMessageContainer').fadeOut("slow");
                }, 5000)
            };

        };


        var generateTransmSlider = function (scrollAmount, snapAmount) {

            var timerId = 0;
            $container.find(".transmContainer").mCustomScrollbar({
                axis: "x",
                theme: "rounded-dark",
                scrollButtons: { enable: true, scrollAmount: scrollAmount, scrollType: "stepped" },
                keyboard: { enable: false },
                mouseWheel: { enable: false },
                scrollInertia: 10,
                snapAmount: snapAmount,
                snapOffset: 0,
                advanced: { autoExpandHorizontalScroll: 2, updateOnContentResize: true },
                callbacks: {
                    whileScrolling: function () {
                        console.log('onScroll', this.mcs.leftPct);
                        if (settings.transmTextChange == false) {
                            calculteSliderLogVal(this.mcs.leftPct);
                        }
                    }
                }
            });

            settings.transmTextChange = true;
            settings.sliderVal = Math.log(settings.transmissionRaioVal) / Math.log('1.071519305');
            $container.find(".transmContainer").mCustomScrollbar('scrollTo', settings.sliderVal + '%', {
                timeout: 1000
            });


            var calculteSliderLogVal = function (value) {

                var logVal = Math.pow(1.07151930525057, (value));
                logVal = numberFormatter.format(logVal);
                if (logVal > 12) {
                    logVal = Math.round(logVal);
                }
                settings.transmissionRaioVal = logVal;
                $container.find('.transInputBox').val(logVal);
                updateMotorOperatingPoints('TransmissionRatio', logVal);

            };
            $(".mCSB_buttonRight, .mCSB_buttonLeft, .mCSB_draggerContainer, #mCSB_1_dragger_horizontal").click(function (e) {

                settings.transmTextChange = false;

            });
            $("#mCSB_1_dragger_horizontal, .mCSB_dragger").mouseenter(function () {

                settings.transmTextChange = false;
            });

        };

        var generateSlider = function ($containerEle, params) {
            $containerEle.slider(params);
        };

        // generates TS Curve grapgh plot area
        var generateTSCurvePlotArea = function ($containerEle) {

            var $titleSection = $('<div class="titleSection" id="tsMotorName">Motor T-S Curve : ' + settings.motorData[settings.motorSelectedIndex].motorPartNo + '</div>');
            $containerEle.append($titleSection);

            var $tsCurveContainer = $('<div class="tsPlotContainer"></div>');
            $containerEle.append($tsCurveContainer);
            var $tsCurvePlotArea = $('<div class="tsPlotArea"></div>');
            $tsCurveContainer.append($tsCurvePlotArea);

            /*var $curveConfigContainer = $('<div class="curveConfigContainer row"></div>');
            $containerEle.append($curveConfigContainer);

            if (settings.showQuadrantToggle) {
                generatePlotModeToggleSwitch($curveConfigContainer);
            }*/

            updateMotorData(settings.motorSelectedIndex + 1);
            calculateTSCurevePoints();
        };

        // generates quadrant toggle switch
        var generatePlotModeToggleSwitch = function ($containerEle) {
            var $plotModeRadio = $('<div class="plotModeContainer"> <label id="quadrantTitle">Quadrant: &nbsp;&nbsp;&nbsp;</label> <div class="btn-group" id="plotModeToggle"> <button id="1quad" value="1" class="btn btn-default">Single</button> <button id="4quad" value="4" class="btn btn-default">Four</button> </div></div>');
            if (settings.quadrant) {
                $plotModeRadio.find('#' + settings.quadrant + 'quad').addClass('selectedQuad');
            }
            $containerEle.append($plotModeRadio);

            $plotModeRadio.find('#plotModeToggle .btn').click(function () {
                if (!$(this).hasClass('selectedQuad')) {
                    $plotModeRadio.find('.selectedQuad').removeClass('selectedQuad');
                    $(this).addClass('selectedQuad');
                    settings.quadrant = parseInt($(this).val());

                    calculateTSCurevePoints();
                }
            });
        };

        // generates motor spec table container
        var generateServoMotorSpec = function ($containerEle) {
            var $motorInfoContainer = $container.find('.tsCruveContainer');
            var $servoMotorInfoContainer = $('<div id="servoMotorInfoContainer" class="tsModal"></div>');
            $motorInfoContainer.append($servoMotorInfoContainer);
            var $servoMotorSpecPanelData = $('<div class="motorSpecTable"></div>');
            updateMotorSpecTable(settings.motorSelectedIndex, $servoMotorSpecPanelData);
            $servoMotorInfoContainer.append($servoMotorSpecPanelData);
        };

        // generates selected motor spec table data 
        var updateMotorSpecTable = function (selectedIndex) {

            var $tableContainer = $container.find('#servoMotorInfoContainer').find('.motorSpecTable');

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
            $tableBody.append('<tr> <td class="leftCol"> Roll Off Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].rollOffSpeed + ' rpm</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Max Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].maxSpeed + ' rpm</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Peak Torque at Max Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].peakTorqueAtMaxSpeed + ' N-m</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Continuous Stall Torque </td><td class="rightCol">' + settings.motorData[selectedIndex].continuousStallTorque + ' N-m</td></tr>');
            $tableBody.append('<tr> <td class="leftCol"> Continuos Torque at Max Speed </td><td class="rightCol">' + settings.motorData[selectedIndex].continuosTorqueAtMaxSpeed + ' N-m</td></tr>');
        };

        // graph points calculations
        var calculateTSCurevePoints = function () {
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
                    axisLabel: "Speed (rpm)",
                    tickFormatter: tickFormatter


                },
                yaxis: {
                    axisLabel: "Torque (N-m)",
                    tickFormatter: tickFormatter

                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    // borderWidth: 1, Removed duplicate property.
                    borderColor: '#333',
                    borderWidth: {
                        top: 0,
                        right: 0,
                        bottom: 1,
                        left: 1
                    },
                    margin: 0,
                    markings: [{
                        yaxis: {
                            from: 0,
                            to: 0,
                            tickFormatter: tickFormatter
                        },
                        color: "#333"
                    },
                    { xaxis: { from: 0, to: 0 }, color: "#333" },
                    { xaxis: { from: 0, to: settings.xaxisMaxVale, tickFormatter: tickFormatter }, color: "#fff", }
                    ],
                },
                tooltip: true,
                tooltipOpts: {
                    cssClass: "tsCurveFlotTip",
                    content: function (label, xval, yval, flotItem) {
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
                        return title + "Speed: " + numberFormatter.format(xval, true) + ", Torque: " + numberFormatter.format(yval, true);
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

            var resetData = function () {
                peakTorqueGraphData = [];
                contTorqueGraphData = [];
                applicationElementGraphData = [];
                applicationRMSGraphData = [];

                positiveVelocityPointsPeakTorque = [];
                negativeVelocityPointsPeakTorque = [];

                positiveVelocityPointsContTorque = [];
                negativeVelocityPointsContTorque = [];
            };

            var interpolatePositiveVelocityDataPoints = function (motorPoints) {
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

            var interpolateNegativeVelocityDataPoints = function (motorPoints) {
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

            var updatefirstQadrant = function (motorPoints) {

                peakTorqueGraphData = peakTorqueGraphData.concat(positiveVelocityPointsPeakTorque);

                contTorqueGraphData = contTorqueGraphData.concat(positiveVelocityPointsContTorque);
            };

            var updatefourthQuadrant = function (motorPoints) {
                var fourthQuadPointsPeakTorque = [];
                var fourthQuadPointsContTorque = [];

                if (negativeVelocityPointsPeakTorque.length > 0) {
                    negativeVelocityPointsPeakTorque.forEach(function (element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        fourthQuadPointsPeakTorque[index] = currentElement;
                    });
                }
                peakTorqueGraphData = peakTorqueGraphData.concat(fourthQuadPointsPeakTorque);

                if (negativeVelocityPointsContTorque.length > 0) {
                    negativeVelocityPointsContTorque.forEach(function (element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        fourthQuadPointsContTorque[index] = currentElement;
                    });
                }

                contTorqueGraphData = contTorqueGraphData.concat(fourthQuadPointsContTorque);
            };

            var updateThirdQuadrant = function (motorPoints) {
                var thirdQuadPointsPeakTorque = [];
                var thirdQuadPointsContTorque = [];

                if (positiveVelocityPointsPeakTorque.length > 0) {
                    positiveVelocityPointsPeakTorque.forEach(function (element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        thirdQuadPointsPeakTorque[index] = currentElement;
                    });
                }
                peakTorqueGraphData = peakTorqueGraphData.concat(thirdQuadPointsPeakTorque);

                if (positiveVelocityPointsContTorque.length > 0) {
                    positiveVelocityPointsContTorque.forEach(function (element, index, array) {
                        var currentElement = [];
                        currentElement[0] = -1 * element[0];
                        currentElement[1] = -1 * element[1];
                        thirdQuadPointsContTorque[index] = currentElement;
                    });
                }
                contTorqueGraphData = contTorqueGraphData.concat(thirdQuadPointsContTorque);
            };

            var updateSecondQuadrant = function (motorPoints) {
                peakTorqueGraphData = peakTorqueGraphData.concat(negativeVelocityPointsPeakTorque);

                contTorqueGraphData = contTorqueGraphData.concat(negativeVelocityPointsContTorque);
            };

            var coCOMPeteCycle = function (motorPoints) {

                peakTorqueGraphData.push([0, (motorPoints.peakStallTorque)]);

                contTorqueGraphData.push([0, motorPoints.continuousStallTorque]);
            };
            var addTempEffectOnMotorData = function (motorPoints) {
                var ta = motorPoints.temp; // Application temperature
                var tr = 40 // Rating ambient (the ambient at which the motor is rated - default 40 degrees)
                var twl = 155 // Limiting winding temperature in degree celcius
                var ts = 25 //Motor specification Temperature

                var tm = ta + (0.6 * (twl - ta)); //Actual Magnet Temperature
                var tmr = tr + (0.6 * (twl - tr)); //Rating Magnet Temperature
                var Km = -0.0015; // is the temperature coefficient of the rotor magnets


                var K1 = (1 - (ta - tr) / (twl - tr));
                var K2 = ((ts + 234.5) / (tmr + 234.5));
                var K3 = (1 + (tm - tmr) * Km);


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

            var updateFourQuadrantData = function (motorPoints) {
                // 1st Quadrant, starting from (0,0)
                updatefirstQadrant(motorPoints);
                updatefourthQuadrant(motorPoints);
                updateThirdQuadrant(motorPoints);
                updateSecondQuadrant(motorPoints);
                coCOMPeteCycle(motorPoints);
            };

            var updateDataforTorqueGraph = function (motorPoints) {

                resetData();
                interpolatePositiveVelocityDataPoints(motorPoints);
                interpolateNegativeVelocityDataPoints(motorPoints);
                updateFourQuadrantData(motorPoints);

            };

            if (settings.showMotorTsCurve) {
                updateDataforTorqueGraph(settings.motorData[settings.motorSelectedIndex]);
            }

            if (settings.showApplicationPoints) {
               
                settings.peakMotorData[0] = (settings.peakMotorData[0]);
                settings.peakMotorData[1] = (settings.peakMotorData[1]);
                settings.rmsMotorData[0] = (settings.rmsMotorData[0]);
                settings.rmsMotorData[1] = (settings.rmsMotorData[1]);
                applicationElementGraphData.push(settings.peakMotorData);
                applicationRMSGraphData.push(settings.rmsMotorData);
            }

            TSCurveData.push({
                data: peakTorqueGraphData,
                label: 'Peak',
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
                    label: 'Continous',
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

            var inputData = {
                "peakTorque": settings.peakPoints[1],
                "peakSpeed": settings.peakPoints[0],
                "rmsTorque": settings.rmsPoints[1],
                "peakAcceleration": settings.peakAcceData,
                "rmsAcceleration": settings.rmsAcceData,
                "temperature":settings.temperature,
                "altitude": settings.altitude,
                "motorIndex": settings.motorSelectedIndex
            }

            var outputData = {
                "motorInertia": settings.motorInertia,
                "motorStatus": settings.motorStatus,
                "temperature":settings.temperature,
                "altitude": settings.altitude,
                "transmissionRatio": settings.transmissionRaioVal,
                "peakTorqueMotorSide":settings.peakMotorData[1],
                "rmsTorqueMotorSide":settings.rmsMotorData[1],
                "peakSpeedMotorSide": settings.peakMotorData[0],
                "peakAccelerationMotorSide": settings.peakAcceMotor,
                "rmsAccelerationMotorSide":settings.rmsAcceMotor,
                "selectedMotor": settings.motorData[settings.motorSelectedIndex].motorPartNo,
                "maxSpeed": settings.motorData[settings.motorSelectedIndex].maxSpeed,
                "contStallTorque": settings.motorData[settings.motorSelectedIndex].continuousStallTorque,
                "peakStallTorque": settings.motorData[settings.motorSelectedIndex].peakStallTorque
            };

            if (settings.notifyIOData && typeof settings.notifyIOData == "function") {
                settings.notifyIOData({ "inputs": inputData, "output": outputData });
            }

            if (!tsPlot) { // graph plotted already
                plotTSGraph(TSCurveData, TSCurveOptions);
            } else {
                updateTSGraph(TSCurveData, TSCurveOptions);
            }
        };

        // check for motor pass/fail status
        var checkMotorStatus = function (selectedMotorData) {

            var motorData = selectedMotorData;
            var elementData = settings.peakMotorData;
            var rmsData = settings.rmsMotorData;
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
            if (rmsVelocity <= motorData.maxSpeed /* && rmsTorque <= motorData.continuousStallTorque*/) {
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

        var updatePlotMaxMinValues = function () {
            var tsPlotAxes = tsPlot.getAxes();

            /* if (settings.showMotorTsCurve) {
                 var maxY = Math.max(settings.peakMotorData[1] + 1, settings.rmsMotorData[1] + 1, 35);
 
                 if (tsPlotAxes.yaxis.datamax < maxY) {
                     tsPlot.getOptions().yaxes[0].max = maxY;
                 } else {
 
                     tsPlot.getOptions().yaxes[0].max = (tsPlotAxes.yaxis.datamax + 30);
                 }
 
             }*/
            // var tsPlotAxes = tsPlot.getAxes();

            // if (settings.showMotorTsCurve) {
            //  var maxX = Math.max(settings.peakPoints[0] + 50, settings.rmsPoints[0] + 50, 600);
            //  var maxY = Math.max(settings.peakPoints[1] + 10, settings.rmsPoints[1] + 10, 200);

            //  if (tsPlotAxes.xaxis.datamax < maxX) {
            //      tsPlot.getOptions().xaxes[0].max = maxX;
            //  } else {
            //      tsPlot.getOptions().xaxes[0].max = tsPlotAxes.xaxis.datamax + 50;
            //  }

            //  if (tsPlotAxes.yaxis.datamax < maxY) {
            //      tsPlot.getOptions().yaxes[0].max = maxY;
            //  } else {
            //      tsPlot.getOptions().yaxes[0].max = tsPlotAxes.yaxis.datamax + 20;
            //  }


            //  if (settings.quadrant === 4) {
            //      // tsPlot.getOptions().yaxes[0].min = -1 * maxX;
            //      // tsPlot.getOptions().xaxes[0].min = -1 * maxY;

            //      // if (tsPlotAxes.xaxis.min < -1 * maxX) {
            //      //  tsPlot.getOptions().xaxes[0].min = -1 * maxX;
            //      // }

            //      // if (tsPlotAxes.yaxis.min < -1 * maxY) {
            //      //  tsPlot.getOptions().yaxes[0].min = -1 * maxY;
            //      // }

            //      if (tsPlotAxes.xaxis.datamin < -1*maxX) {
            //          tsPlot.getOptions().xaxes[0].min = -1*maxX;
            //      } else {
            //          tsPlot.getOptions().xaxes[0].min = tsPlotAxes.xaxis.datamin - 50;
            //      }

            //      if (tsPlotAxes.yaxis.datamin < -1*maxY) {
            //          tsPlot.getOptions().yaxes[0].min = -1*maxY;
            //      } else {
            //          tsPlot.getOptions().yaxes[0].min = tsPlotAxes.yaxis.datamin - 20;
            //      }
            //  }
            // }

            if (!settings.showMotorTsCurve) {
                var maxX = Math.max(settings.peakMotorData[0] + 50, settings.rmsMotorData[0] + 50, 200);
                var maxY = Math.max(settings.peakMotorData[1] + 10, settings.rmsMotorData[1] + 10, 150);
                tsPlot.getOptions().yaxes[0].max = maxY;
                tsPlot.getOptions().xaxes[0].max = maxX;
                if (settings.quadrant === 4) {
                    tsPlot.getOptions().yaxes[0].min = -1 * maxY;
                    tsPlot.getOptions().xaxes[0].min = -1 * maxX;
                }
            }
        };

        var modifyTSPlot = function () {

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

        var plotTSGraph = function (data, options) {



            setTimeout(function () {
                tsPlot = $.plot($container.find(".tsPlotArea"), data, options);
                modifyTSPlot();
                attachResizeToPlots();
                checkContainerWidth();
            }, 0);


        };

        var attachResizeToPlots = function () {

            $container.find('.tsCruveContainer').resize(function (e) {
                var ele = $(this);
               
                if (ele.find('#transmissionRatioPanelContainer').width() <= 502) {
                    ele.find(".transmContainer").css('width', '210px');
                    ele.find(".transmInnerContainer").css('width', '2310px');
                    // $container.find(".transmContainer").mCustomScrollbar("destroy");

                    setTimeout(function () {
                        generateTransmSlider('21', '21');
                    }, 500);
                    // $container.find(".transmContainer").mCustomScrollbar("update");


                    ele.find(".transmLabel").find('li.firstLi').css('left', '35px');
                    ele.find(".transmLabel").find('li.secondLi').css('left', '83px');
                    ele.find(".transmLabel").find('li.thirdLi').css('left', '132px');
                    ele.find(".transmLabel").find('li.fourthLi').css('left', '182px');
                }
                else {

                    ele.find(".transmContainer").css('width', '260px');
                    ele.find(".transmInnerContainer").css('width', '2860px');
                    //$container.find(".transmContainer").mCustomScrollbar("destroy");

                    setTimeout(function () {
                        generateTransmSlider('26', '26');
                    }, 500);

                    //$container.find(".transmContainer").mCustomScrollbar("update");


                    ele.find(".transmLabel").find('li.firstLi').css('left', '28px');
                    ele.find(".transmLabel").find('li.secondLi').css('left', '94px');
                    ele.find(".transmLabel").find('li.thirdLi').css('left', '160px');
                    ele.find(".transmLabel").find('li.fourthLi').css('left', '230px');

                }

                if ((ele.width() < 1041  && $( window ).width() < 1263 ) ) {
                    ele.find('#servoMotorArea').addClass('resizeWidth');
                    ele.find('#servoMotorTSCurve').addClass('resizeWidth');
                    ele.find('#servoMotorArea').find('.response-status').find('.correct-answer').css('width', '88%');
                }
                else if((ele.width() < 1013 && $( window ).width() < 1583 ) ) {
                    ele.find('#servoMotorArea').addClass('resizeWidth');
                    ele.find('#servoMotorTSCurve').addClass('resizeWidth');
                    ele.find('#servoMotorArea').find('.response-status').find('.correct-answer').css('width', '88%');
                }
                else {
                    ele.find('#servoMotorArea').removeClass('resizeWidth');
                    ele.find('#servoMotorTSCurve').removeClass('resizeWidth');
                    ele.find('#servoMotorArea').find('#envFactorsPanelContainer').find('.response-status').find('.correct-answer').css('width', 'auto');
                }
                ele.find('.tsPlotArea').css('min-height', ele.find('.tsPlotArea').width());                

                if (settings.autoResizer) {
                    settings.autoResizer();
                }



            });

        };

        var updateTSGraph = function (data, options) {
            var inputData = {
                "peakTorque": settings.peakPoints[1],
                "peakSpeed": settings.peakPoints[0],
                "rmsTorque": settings.rmsPoints[1],
                "peakAcceleration": settings.peakAcceData,
                "rmsAcceleration": settings.rmsAcceData,
                "temperature":settings.temperature,
                "altitude": settings.altitude,
                "motorIndex": settings.motorSelectedIndex
            }
            var outputData = {
                "motorInertia": settings.motorInertia,
                "motorStatus": settings.motorStatus,
                "temperature":settings.temperature,
                "altitude": settings.altitude,
                "transmissionRatio": settings.transmissionRaioVal,
                "peakTorqueMotorSide":settings.peakMotorData[1],
                "rmsTorqueMotorSide":settings.rmsMotorData[1],
                "peakSpeedMotorSide": settings.peakMotorData[0],
                "peakAccelerationMotorSide": settings.peakAcceMotor,
                "rmsAccelerationMotorSide":settings.rmsAcceMotor,
                "selectedMotor": settings.motorData[settings.motorSelectedIndex].motorPartNo,
                "maxSpeed": settings.motorData[settings.motorSelectedIndex].maxSpeed,
                "contStallTorque": settings.motorData[settings.motorSelectedIndex].continuousStallTorque,
                "peakStallTorque": settings.motorData[settings.motorSelectedIndex].peakStallTorque
            };

            if (settings.notifyIOData && typeof settings.notifyIOData == "function") {
                settings.notifyIOData({ "inputs": inputData, "output": outputData });
            }
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
                        "value": settings.peakPoints[1],
                        "unit": "Nm"
                    },
                    "peakSpeed": {
                        "value": settings.peakPoints[0],
                        "unit": "rad/sec"
                    },
                    "rmsTorque": {
                        "value": settings.rmsPoints[1],
                        "unit": "Nm"
                    },
                    "peakAcceData": {
                        "value": settings.peakAcceData,
                        "unit": "rad/sec2"
                    },
                    "rmsAcceData": {
                        "value": settings.rmsAcceData,
                        "unit": "rad/sec2"
                    },
                    "temperature": {
                        "value": settings.temperature,
                        "unit": "C"
                    },
                    "altitude": {
                        "value": settings.altitude,
                        "unit": "m"
                    },
                    "transmissionRatio": {
                        "value": settings.transmissionRaioVal,
                        "unit": ""
                    },
                    "motorSelectedIndex": {
                        "value": settings.motorSelectedIndex,
                        "unit": ""
                    }
                });
            }
        }


        var updateInputs = function (params) {
            if (params.peakTorque) {
                settings.peakPoints[1] = params.peakTorque.value;
                $container.find('.peakTorqueDataSide').data('unitsComboBox').setSIValue(params.peakTorque.value);
                $container.find('.peakTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[1]);
               
            }
            if (params.peakSpeed) {
                settings.peakPoints[0] = params.peakSpeed.value;
                $container.find('.peakSpeedLoadSide').data('unitsComboBox').setTextBoxValue(params.peakSpeed.value);
                $container.find('.peakSpeedMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[0]);
            }
            if (params.rmsTorque) {
                settings.rmsPoints[1] = params.rmsTorque.value;
                $container.find('.rmsTorqueLoadSide').data('unitsComboBox').setSIValue(params.rmsTorque.value);
                $container.find('.rmsTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsMotorData[1]);                
            }
            if (params.peakAcceData) {
                settings.peakAcceData = params.peakAcceData.value;
                $container.find('.peakAccelerationLoadSide').data('unitsComboBox').setSIValue(params.peakAcceData.value);
                $container.find('.peakTorqueMotorSide').data('unitsComboBox').setTextBoxValue(settings.peakMotorData[1]);
            }
            if (params.rmsAcceData) {
                settings.rmsAcceData = params.rmsAcceData.value;
                $container.find('.rmsAccelerationLoadSide').data('unitsComboBox').setSIValue(params.rmsAcceData.value);
                $container.find('.rmsAccelerationMotorSide').data('unitsComboBox').setTextBoxValue(settings.rmsAcceMotor);
            }
            if (params.temperature) {
                $container.find('#tempSlider').slider('setValue', params.temperature.value);
                $container.find(".temp-unit-dropdown").data('unitsComboBox').setTextBoxValue(params.temperature.value);
            }
            if (params.altitude) {
                $container.find('#altitudeSlider').slider('setValue', params.altitude.value);
                $container.find(".altitude-unit-combobox").data('unitsComboBox').setTextBoxValue(params.altitude.value);

            }
            if (params.transmissionRatio) {
                settings.sliderVal = Math.log(params.transmissionRatio.value) / Math.log('1.071519305');
                $container.find(".transmContainer").mCustomScrollbar('scrollTo', settings.sliderVal + '%');
                $container.find('.transInputBox').val(params.transmissionRatio.value);
                updateMotorOperatingPoints('TransmissionRatio', params.transmissionRatio.value);
            }
            if (params.motorSelectedIndex) {
                var selectedMotor = parseInt(parseInt(params.motorSelectedIndex.value) + 1);
                $container.find('#PaginationDiv').GetFolio().setActivePage(selectedMotor);
            }
        }

        var markAnswers = function (params) {
            var cssClass;

            if (params.peakTorque) {
                cssClass = params.peakTorque.status ? 'correct' : 'incorrect';
                $container.find('.peakTorqueDataSide').find('input.amount_TORQUE').addClass(cssClass);
                cssClass = params.peakTorque.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('.peakTorqueDataSide').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });
                $container.find('.peakTorqueDataSide').find('.response-status').find('span.fa').addClass(cssClass);
                var correctAns = params.peakTorque.status ? '' : '(' + params.peakTorque.correctAnswer + ')';
                $container.find('.peakTorqueDataSide').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('.peakTorqueDataSide').find('.response-status').find('.correct-answer').attr('title',correctAns);

                // disable slider and input
                $container.find('.peakTorqueDataSide').data('unitsComboBox').update({
                    "enable": {"textbox" : "false","comboBox" : "false" }
                });
            }
            if (params.peakSpeed) {
                cssClass = params.peakSpeed.status ? 'correct' : 'incorrect';
                $container.find('.peakSpeedLoadSide').find('input.amount_ANGULARVELOCITY').addClass(cssClass);
                cssClass = params.peakSpeed.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('.peakSpeedLoadSide').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });
                $container.find('.peakSpeedLoadSide').find('.response-status').find('span.fa').addClass(cssClass);
                var correctAns = params.peakSpeed.status ? '' : '(' + params.peakSpeed.correctAnswer + ')';
                $container.find('.peakSpeedLoadSide').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('.peakSpeedLoadSide').find('.response-status').find('.correct-answer').attr('title',correctAns);

                $container.find('.peakSpeedLoadSide').data('unitsComboBox').update({
                    "enable": {"textbox" : "false","comboBox" : "false" }
                });
            }
            if (params.rmsTorque) {
                cssClass = params.rmsTorque.status ? 'correct' : 'incorrect';
                $container.find('.rmsTorqueLoadSide').find('input.amount_TORQUE').addClass(cssClass);
                cssClass = params.rmsTorque.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('.rmsTorqueLoadSide').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });

                $container.find('.rmsTorqueLoadSide').find('.response-status').find('span.fa').addClass(cssClass);
                var correctAns = params.rmsTorque.status ? '' : '(' + params.rmsTorque.correctAnswer + ')';
                $container.find('.rmsTorqueLoadSide').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('.rmsTorqueLoadSide').find('.response-status').find('.correct-answer').attr('title',correctAns);

                // disable slider and input
                $container.find('.rmsTorqueLoadSide').data('unitsComboBox').update({
                    "enable": {"textbox" : "false","comboBox" : "false" }
                });
            }
            if (params.peakAcceData) {
                cssClass = params.peakAcceData.status ? 'correct' : 'incorrect';
                $container.find('.peakAccelerationLoadSide').find('input.amount_ANGULARACCELERATION').addClass(cssClass);
                cssClass = params.peakAcceData.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('.peakAccelerationLoadSide').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });
                $container.find('.peakAccelerationLoadSide').find('.response-status').find('span.fa').addClass(cssClass);

                var correctAns = params.peakAcceData.status ? '' : '(' + params.peakAcceData.correctAnswer + ')';
                $container.find('.peakAccelerationLoadSide').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('.peakAccelerationLoadSide').find('.response-status').find('.correct-answer').attr('title',correctAns);

                // disable slider and input

                $container.find('.peakAccelerationLoadSide').data('unitsComboBox').update({
                    "enable": {"textbox" : "false","comboBox" : "false" }
                });
            }
            if (params.rmsAcceData) {
                cssClass = params.rmsAcceData.status ? 'correct' : 'incorrect';
                $container.find('.rmsAccelerationLoadSide').find('input.amount_ANGULARACCELERATION').addClass(cssClass);
                cssClass = params.rmsAcceData.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('.rmsAccelerationLoadSide').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });
                $container.find('.rmsAccelerationLoadSide').find('.response-status').find('span.fa').addClass(cssClass);
                var correctAns = params.rmsAcceData.status ? '' : '(' + params.rmsAcceData.correctAnswer + ')';
                $container.find('.rmsAccelerationLoadSide').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('.rmsAccelerationLoadSide').find('.response-status').find('.correct-answer').attr('title',correctAns);

                $container.find('.rmsAccelerationLoadSide').data('unitsComboBox').update({
                    "enable": {"textbox" : "false","comboBox" : "false" }
                });
            }
            if (params.temperature) {

                cssClass = params.temperature.status ? 'correct' : 'incorrect';
                $container.find('.amount_TEMPERATURE').addClass(cssClass);
                cssClass = params.temperature.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('#envFactorsPanelContainer').find('.temp-unit-dropdown').find('.response-status').css({
                    'display': 'flex',
                    'align-items': 'center'
                });
                $container.find('#envFactorsPanelContainer').find('.temp-unit-dropdown').find('.response-status').find('span.fa').addClass(cssClass);
                var correctAns = params.temperature.status ? '' : '(' + params.temperature.correctAnswer + ' &#176;C' + ')';
                $container.find('#envFactorsPanelContainer').find('.temp-unit-dropdown').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('#envFactorsPanelContainer').find('#tempSlider').slider("disable");
                $container.find('#envFactorsPanelContainer').find('.amount_TEMPERATURE').attr("disabled", true);
            }
            if (params.altitude) {

                cssClass = params.altitude.status ? 'correct' : 'incorrect';
                $container.find('.amount_ALTITUDE').addClass(cssClass)
                cssClass = params.altitude.status ? 'fa-check correct' : 'fa-times incorrect';

                $container.find('#envFactorsPanelContainer').find('.altitude-unit-combobox').find('.response-status').css({
                    'display': 'flex',
                    'align-items': 'center'
                });
                $container.find('#envFactorsPanelContainer').find('.altitude-unit-combobox').find('.response-status').find('span.fa').addClass(cssClass);
                var correctAns = params.altitude.status ? '' : '(' + params.altitude.correctAnswer + ' m)';
                $container.find('#envFactorsPanelContainer').find('.altitude-unit-combobox').find('.response-status').find('.correct-answer').append(correctAns);
                $container.find('#envFactorsPanelContainer').find('#altitudeSlider').slider("disable");
                $container.find('#envFactorsPanelContainer').find('.amount_ALTITUDE').attr("disabled", true);
                // disable slider and input
            }
            if (params.transmissionRatio) {
                cssClass = params.transmissionRatio.status ? 'correct' : 'incorrect';
                $container.find('.transInputBox').addClass(cssClass);
                cssClass = params.transmissionRatio.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('#transmissionRatioPanelContainer').find('.trRatioValue').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });
                $container.find(".trRatioSlider").addClass('pointer-events-none');
                $container.find('.transInputBox').css('width', '40%');
                $container.find('.transInputBox').attr('disabled', 'disabled');
                $container.find('#transmissionRatioPanelContainer').find('.trRatioValue').find('.response-status').find('span.fa').addClass(cssClass);

                var correctAns = params.transmissionRatio.status ? '' : '(' + params.transmissionRatio.correctAnswer + ' : 1)';
                $container.find('#transmissionRatioPanelContainer').find('.trRatioValue').find('.response-status').find('.correct-answer').append(correctAns);
            }
            if (params.motorSelectedIndex) {

                cssClass = params.motorSelectedIndex.status ? 'fa-check correct' : 'fa-times incorrect';
                $container.find('.solutionInfoTitle').find('.response-status').css({
                    'display': 'inline',
                    'align-items': 'center'
                });
                $container.find('.solutionInfoTitle').find('.response-status').find('span.fa').addClass(cssClass);
                $container.find('#PaginationDiv .Folio').addClass('pointer-events-none');
                $container.find('#PaginationDiv .Folio .FolioPages, #PaginationDiv .Folio span.FolioPage').addClass('gray-background');

                var correctAns = params.motorSelectedIndex.status ? '' : '(#' + (params.motorSelectedIndex.correctAnswer + 1) + ' : ' + settings.motorData[params.motorSelectedIndex.correctAnswer].motorPartNo + ')';
                $container.find('.solutionInfoTitle').find('.response-status').find('.correct-answer').append(correctAns);

            }
        };

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
    'css!../../node_modules/font-awesome/css/font-awesome.min.css',
    'css!../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    'css!../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css',
     /*"css!../../node_modules/jquery.spinner/dist/css/bootstrap-spinner.css",*/
     'css!../libs/Foliojs/dist/css/Folio.css',
     'css!../libs/libs-frontend-unitLabelControl/dist/css/unitLabelControl.min.css',
     'css!../libs/libs-frontend-unitcombobox/dist/css/unitComboBox.min.css',
    '../../node_modules/bootstrap-slider/dist/bootstrap-slider.min.js',   
    '../../node_modules/jquery-flot/jquery.flot.js',
    '../../node_modules/jquery-flot/jquery.flot.resize.js',
    '../../node_modules/flot-axislabels/jquery.flot.axislabels.js',
    '../../node_modules/jquery.flot.tooltip/js/jquery.flot.tooltip.js',    
    "../libs/Foliojs/dist/js/Folio.js", 
    '../libs/number-formatter/dist/cosmatt-number-formatter.js',  
    '../libs/libs-frontend-unitcombobox/dist/js/unitComboBox.js',
    '../libs/libs-frontend-unitLabelControl/dist/js/unitLabelControl.js',
   /* "../../node_modules/jquery.spinner/dist/js/jquery.spinner.min.js",*/
   'css!../libs/malihu-custom-scrollbar-plugin-master/jquery.mCustomScrollbar.css',
   'css!../libs/libs-frontend-TSCurve/dist/css/tsCurve.min.css',
   'css!../css/cosmatttsc.css', //Custom styles of the engine (applied over bootstrap & front-end-core)
   '../libs/malihu-custom-scrollbar-plugin-master/jquery.mCustomScrollbar.js',
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
        __content.appData.options.data.autoResizer = autoResizeEngine;
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
      function autoResizeEngine() {
        activityAdaptor.autoResizeActivityIframe();
      }
      function userResponseHandler(callbackValue) {
        for (var property in callbackValue) {
          if (callbackValue.hasOwnProperty(property) && callbackValue[property].value  !== undefined) {
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


              if (Math.round(parseFloat(callbackValue[property].value) * 1000) / 1000 == parseFloat(__content.answersJSON[interactionId].correct)) {
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
        var answers = __content.answersJSON;

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
          markAnswerObj[options[element].type].correctAnswer = answers[element].correct;

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
('/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */@font-face{font-family:\'FontAwesome\';src:url(\'../src/js/../../node_modules/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0\');src:url(\'../src/js/../../node_modules/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0\') format(\'embedded-opentype\'),url(\'../src/js/../../node_modules/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0\') format(\'woff2\'),url(\'../src/js/../../node_modules/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0\') format(\'woff\'),url(\'../src/js/../../node_modules/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0\') format(\'truetype\'),url(\'../src/js/../../node_modules/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular\') format(\'svg\');font-weight:normal;font-style:normal}.fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.fa-lg{font-size:1.33333333em;line-height:.75em;vertical-align:-15%}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-fw{width:1.28571429em;text-align:center}.fa-ul{padding-left:0;margin-left:2.14285714em;list-style-type:none}.fa-ul>li{position:relative}.fa-li{position:absolute;left:-2.14285714em;width:2.14285714em;top:.14285714em;text-align:center}.fa-li.fa-lg{left:-1.85714286em}.fa-border{padding:.2em .25em .15em;border:solid .08em #eee;border-radius:.1em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left{margin-right:.3em}.fa.fa-pull-right{margin-left:.3em}.pull-right{float:right}.pull-left{float:left}.fa.pull-left{margin-right:.3em}.fa.pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.fa-rotate-90{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";-webkit-transform:scale(-1, 1);-ms-transform:scale(-1, 1);transform:scale(-1, 1)}.fa-flip-vertical{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";-webkit-transform:scale(1, -1);-ms-transform:scale(1, -1);transform:scale(1, -1)}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical{filter:none}.fa-stack{position:relative;display:inline-block;width:2em;height:2em;line-height:2em;vertical-align:middle}.fa-stack-1x,.fa-stack-2x{position:absolute;left:0;width:100%;text-align:center}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:#fff}.fa-glass:before{content:\"\\f000\"}.fa-music:before{content:\"\\f001\"}.fa-search:before{content:\"\\f002\"}.fa-envelope-o:before{content:\"\\f003\"}.fa-heart:before{content:\"\\f004\"}.fa-star:before{content:\"\\f005\"}.fa-star-o:before{content:\"\\f006\"}.fa-user:before{content:\"\\f007\"}.fa-film:before{content:\"\\f008\"}.fa-th-large:before{content:\"\\f009\"}.fa-th:before{content:\"\\f00a\"}.fa-th-list:before{content:\"\\f00b\"}.fa-check:before{content:\"\\f00c\"}.fa-remove:before,.fa-close:before,.fa-times:before{content:\"\\f00d\"}.fa-search-plus:before{content:\"\\f00e\"}.fa-search-minus:before{content:\"\\f010\"}.fa-power-off:before{content:\"\\f011\"}.fa-signal:before{content:\"\\f012\"}.fa-gear:before,.fa-cog:before{content:\"\\f013\"}.fa-trash-o:before{content:\"\\f014\"}.fa-home:before{content:\"\\f015\"}.fa-file-o:before{content:\"\\f016\"}.fa-clock-o:before{content:\"\\f017\"}.fa-road:before{content:\"\\f018\"}.fa-download:before{content:\"\\f019\"}.fa-arrow-circle-o-down:before{content:\"\\f01a\"}.fa-arrow-circle-o-up:before{content:\"\\f01b\"}.fa-inbox:before{content:\"\\f01c\"}.fa-play-circle-o:before{content:\"\\f01d\"}.fa-rotate-right:before,.fa-repeat:before{content:\"\\f01e\"}.fa-refresh:before{content:\"\\f021\"}.fa-list-alt:before{content:\"\\f022\"}.fa-lock:before{content:\"\\f023\"}.fa-flag:before{content:\"\\f024\"}.fa-headphones:before{content:\"\\f025\"}.fa-volume-off:before{content:\"\\f026\"}.fa-volume-down:before{content:\"\\f027\"}.fa-volume-up:before{content:\"\\f028\"}.fa-qrcode:before{content:\"\\f029\"}.fa-barcode:before{content:\"\\f02a\"}.fa-tag:before{content:\"\\f02b\"}.fa-tags:before{content:\"\\f02c\"}.fa-book:before{content:\"\\f02d\"}.fa-bookmark:before{content:\"\\f02e\"}.fa-print:before{content:\"\\f02f\"}.fa-camera:before{content:\"\\f030\"}.fa-font:before{content:\"\\f031\"}.fa-bold:before{content:\"\\f032\"}.fa-italic:before{content:\"\\f033\"}.fa-text-height:before{content:\"\\f034\"}.fa-text-width:before{content:\"\\f035\"}.fa-align-left:before{content:\"\\f036\"}.fa-align-center:before{content:\"\\f037\"}.fa-align-right:before{content:\"\\f038\"}.fa-align-justify:before{content:\"\\f039\"}.fa-list:before{content:\"\\f03a\"}.fa-dedent:before,.fa-outdent:before{content:\"\\f03b\"}.fa-indent:before{content:\"\\f03c\"}.fa-video-camera:before{content:\"\\f03d\"}.fa-photo:before,.fa-image:before,.fa-picture-o:before{content:\"\\f03e\"}.fa-pencil:before{content:\"\\f040\"}.fa-map-marker:before{content:\"\\f041\"}.fa-adjust:before{content:\"\\f042\"}.fa-tint:before{content:\"\\f043\"}.fa-edit:before,.fa-pencil-square-o:before{content:\"\\f044\"}.fa-share-square-o:before{content:\"\\f045\"}.fa-check-square-o:before{content:\"\\f046\"}.fa-arrows:before{content:\"\\f047\"}.fa-step-backward:before{content:\"\\f048\"}.fa-fast-backward:before{content:\"\\f049\"}.fa-backward:before{content:\"\\f04a\"}.fa-play:before{content:\"\\f04b\"}.fa-pause:before{content:\"\\f04c\"}.fa-stop:before{content:\"\\f04d\"}.fa-forward:before{content:\"\\f04e\"}.fa-fast-forward:before{content:\"\\f050\"}.fa-step-forward:before{content:\"\\f051\"}.fa-eject:before{content:\"\\f052\"}.fa-chevron-left:before{content:\"\\f053\"}.fa-chevron-right:before{content:\"\\f054\"}.fa-plus-circle:before{content:\"\\f055\"}.fa-minus-circle:before{content:\"\\f056\"}.fa-times-circle:before{content:\"\\f057\"}.fa-check-circle:before{content:\"\\f058\"}.fa-question-circle:before{content:\"\\f059\"}.fa-info-circle:before{content:\"\\f05a\"}.fa-crosshairs:before{content:\"\\f05b\"}.fa-times-circle-o:before{content:\"\\f05c\"}.fa-check-circle-o:before{content:\"\\f05d\"}.fa-ban:before{content:\"\\f05e\"}.fa-arrow-left:before{content:\"\\f060\"}.fa-arrow-right:before{content:\"\\f061\"}.fa-arrow-up:before{content:\"\\f062\"}.fa-arrow-down:before{content:\"\\f063\"}.fa-mail-forward:before,.fa-share:before{content:\"\\f064\"}.fa-expand:before{content:\"\\f065\"}.fa-compress:before{content:\"\\f066\"}.fa-plus:before{content:\"\\f067\"}.fa-minus:before{content:\"\\f068\"}.fa-asterisk:before{content:\"\\f069\"}.fa-exclamation-circle:before{content:\"\\f06a\"}.fa-gift:before{content:\"\\f06b\"}.fa-leaf:before{content:\"\\f06c\"}.fa-fire:before{content:\"\\f06d\"}.fa-eye:before{content:\"\\f06e\"}.fa-eye-slash:before{content:\"\\f070\"}.fa-warning:before,.fa-exclamation-triangle:before{content:\"\\f071\"}.fa-plane:before{content:\"\\f072\"}.fa-calendar:before{content:\"\\f073\"}.fa-random:before{content:\"\\f074\"}.fa-comment:before{content:\"\\f075\"}.fa-magnet:before{content:\"\\f076\"}.fa-chevron-up:before{content:\"\\f077\"}.fa-chevron-down:before{content:\"\\f078\"}.fa-retweet:before{content:\"\\f079\"}.fa-shopping-cart:before{content:\"\\f07a\"}.fa-folder:before{content:\"\\f07b\"}.fa-folder-open:before{content:\"\\f07c\"}.fa-arrows-v:before{content:\"\\f07d\"}.fa-arrows-h:before{content:\"\\f07e\"}.fa-bar-chart-o:before,.fa-bar-chart:before{content:\"\\f080\"}.fa-twitter-square:before{content:\"\\f081\"}.fa-facebook-square:before{content:\"\\f082\"}.fa-camera-retro:before{content:\"\\f083\"}.fa-key:before{content:\"\\f084\"}.fa-gears:before,.fa-cogs:before{content:\"\\f085\"}.fa-comments:before{content:\"\\f086\"}.fa-thumbs-o-up:before{content:\"\\f087\"}.fa-thumbs-o-down:before{content:\"\\f088\"}.fa-star-half:before{content:\"\\f089\"}.fa-heart-o:before{content:\"\\f08a\"}.fa-sign-out:before{content:\"\\f08b\"}.fa-linkedin-square:before{content:\"\\f08c\"}.fa-thumb-tack:before{content:\"\\f08d\"}.fa-external-link:before{content:\"\\f08e\"}.fa-sign-in:before{content:\"\\f090\"}.fa-trophy:before{content:\"\\f091\"}.fa-github-square:before{content:\"\\f092\"}.fa-upload:before{content:\"\\f093\"}.fa-lemon-o:before{content:\"\\f094\"}.fa-phone:before{content:\"\\f095\"}.fa-square-o:before{content:\"\\f096\"}.fa-bookmark-o:before{content:\"\\f097\"}.fa-phone-square:before{content:\"\\f098\"}.fa-twitter:before{content:\"\\f099\"}.fa-facebook-f:before,.fa-facebook:before{content:\"\\f09a\"}.fa-github:before{content:\"\\f09b\"}.fa-unlock:before{content:\"\\f09c\"}.fa-credit-card:before{content:\"\\f09d\"}.fa-feed:before,.fa-rss:before{content:\"\\f09e\"}.fa-hdd-o:before{content:\"\\f0a0\"}.fa-bullhorn:before{content:\"\\f0a1\"}.fa-bell:before{content:\"\\f0f3\"}.fa-certificate:before{content:\"\\f0a3\"}.fa-hand-o-right:before{content:\"\\f0a4\"}.fa-hand-o-left:before{content:\"\\f0a5\"}.fa-hand-o-up:before{content:\"\\f0a6\"}.fa-hand-o-down:before{content:\"\\f0a7\"}.fa-arrow-circle-left:before{content:\"\\f0a8\"}.fa-arrow-circle-right:before{content:\"\\f0a9\"}.fa-arrow-circle-up:before{content:\"\\f0aa\"}.fa-arrow-circle-down:before{content:\"\\f0ab\"}.fa-globe:before{content:\"\\f0ac\"}.fa-wrench:before{content:\"\\f0ad\"}.fa-tasks:before{content:\"\\f0ae\"}.fa-filter:before{content:\"\\f0b0\"}.fa-briefcase:before{content:\"\\f0b1\"}.fa-arrows-alt:before{content:\"\\f0b2\"}.fa-group:before,.fa-users:before{content:\"\\f0c0\"}.fa-chain:before,.fa-link:before{content:\"\\f0c1\"}.fa-cloud:before{content:\"\\f0c2\"}.fa-flask:before{content:\"\\f0c3\"}.fa-cut:before,.fa-scissors:before{content:\"\\f0c4\"}.fa-copy:before,.fa-files-o:before{content:\"\\f0c5\"}.fa-paperclip:before{content:\"\\f0c6\"}.fa-save:before,.fa-floppy-o:before{content:\"\\f0c7\"}.fa-square:before{content:\"\\f0c8\"}.fa-navicon:before,.fa-reorder:before,.fa-bars:before{content:\"\\f0c9\"}.fa-list-ul:before{content:\"\\f0ca\"}.fa-list-ol:before{content:\"\\f0cb\"}.fa-strikethrough:before{content:\"\\f0cc\"}.fa-underline:before{content:\"\\f0cd\"}.fa-table:before{content:\"\\f0ce\"}.fa-magic:before{content:\"\\f0d0\"}.fa-truck:before{content:\"\\f0d1\"}.fa-pinterest:before{content:\"\\f0d2\"}.fa-pinterest-square:before{content:\"\\f0d3\"}.fa-google-plus-square:before{content:\"\\f0d4\"}.fa-google-plus:before{content:\"\\f0d5\"}.fa-money:before{content:\"\\f0d6\"}.fa-caret-down:before{content:\"\\f0d7\"}.fa-caret-up:before{content:\"\\f0d8\"}.fa-caret-left:before{content:\"\\f0d9\"}.fa-caret-right:before{content:\"\\f0da\"}.fa-columns:before{content:\"\\f0db\"}.fa-unsorted:before,.fa-sort:before{content:\"\\f0dc\"}.fa-sort-down:before,.fa-sort-desc:before{content:\"\\f0dd\"}.fa-sort-up:before,.fa-sort-asc:before{content:\"\\f0de\"}.fa-envelope:before{content:\"\\f0e0\"}.fa-linkedin:before{content:\"\\f0e1\"}.fa-rotate-left:before,.fa-undo:before{content:\"\\f0e2\"}.fa-legal:before,.fa-gavel:before{content:\"\\f0e3\"}.fa-dashboard:before,.fa-tachometer:before{content:\"\\f0e4\"}.fa-comment-o:before{content:\"\\f0e5\"}.fa-comments-o:before{content:\"\\f0e6\"}.fa-flash:before,.fa-bolt:before{content:\"\\f0e7\"}.fa-sitemap:before{content:\"\\f0e8\"}.fa-umbrella:before{content:\"\\f0e9\"}.fa-paste:before,.fa-clipboard:before{content:\"\\f0ea\"}.fa-lightbulb-o:before{content:\"\\f0eb\"}.fa-exchange:before{content:\"\\f0ec\"}.fa-cloud-download:before{content:\"\\f0ed\"}.fa-cloud-upload:before{content:\"\\f0ee\"}.fa-user-md:before{content:\"\\f0f0\"}.fa-stethoscope:before{content:\"\\f0f1\"}.fa-suitcase:before{content:\"\\f0f2\"}.fa-bell-o:before{content:\"\\f0a2\"}.fa-coffee:before{content:\"\\f0f4\"}.fa-cutlery:before{content:\"\\f0f5\"}.fa-file-text-o:before{content:\"\\f0f6\"}.fa-building-o:before{content:\"\\f0f7\"}.fa-hospital-o:before{content:\"\\f0f8\"}.fa-ambulance:before{content:\"\\f0f9\"}.fa-medkit:before{content:\"\\f0fa\"}.fa-fighter-jet:before{content:\"\\f0fb\"}.fa-beer:before{content:\"\\f0fc\"}.fa-h-square:before{content:\"\\f0fd\"}.fa-plus-square:before{content:\"\\f0fe\"}.fa-angle-double-left:before{content:\"\\f100\"}.fa-angle-double-right:before{content:\"\\f101\"}.fa-angle-double-up:before{content:\"\\f102\"}.fa-angle-double-down:before{content:\"\\f103\"}.fa-angle-left:before{content:\"\\f104\"}.fa-angle-right:before{content:\"\\f105\"}.fa-angle-up:before{content:\"\\f106\"}.fa-angle-down:before{content:\"\\f107\"}.fa-desktop:before{content:\"\\f108\"}.fa-laptop:before{content:\"\\f109\"}.fa-tablet:before{content:\"\\f10a\"}.fa-mobile-phone:before,.fa-mobile:before{content:\"\\f10b\"}.fa-circle-o:before{content:\"\\f10c\"}.fa-quote-left:before{content:\"\\f10d\"}.fa-quote-right:before{content:\"\\f10e\"}.fa-spinner:before{content:\"\\f110\"}.fa-circle:before{content:\"\\f111\"}.fa-mail-reply:before,.fa-reply:before{content:\"\\f112\"}.fa-github-alt:before{content:\"\\f113\"}.fa-folder-o:before{content:\"\\f114\"}.fa-folder-open-o:before{content:\"\\f115\"}.fa-smile-o:before{content:\"\\f118\"}.fa-frown-o:before{content:\"\\f119\"}.fa-meh-o:before{content:\"\\f11a\"}.fa-gamepad:before{content:\"\\f11b\"}.fa-keyboard-o:before{content:\"\\f11c\"}.fa-flag-o:before{content:\"\\f11d\"}.fa-flag-checkered:before{content:\"\\f11e\"}.fa-terminal:before{content:\"\\f120\"}.fa-code:before{content:\"\\f121\"}.fa-mail-reply-all:before,.fa-reply-all:before{content:\"\\f122\"}.fa-star-half-empty:before,.fa-star-half-full:before,.fa-star-half-o:before{content:\"\\f123\"}.fa-location-arrow:before{content:\"\\f124\"}.fa-crop:before{content:\"\\f125\"}.fa-code-fork:before{content:\"\\f126\"}.fa-unlink:before,.fa-chain-broken:before{content:\"\\f127\"}.fa-question:before{content:\"\\f128\"}.fa-info:before{content:\"\\f129\"}.fa-exclamation:before{content:\"\\f12a\"}.fa-superscript:before{content:\"\\f12b\"}.fa-subscript:before{content:\"\\f12c\"}.fa-eraser:before{content:\"\\f12d\"}.fa-puzzle-piece:before{content:\"\\f12e\"}.fa-microphone:before{content:\"\\f130\"}.fa-microphone-slash:before{content:\"\\f131\"}.fa-shield:before{content:\"\\f132\"}.fa-calendar-o:before{content:\"\\f133\"}.fa-fire-extinguisher:before{content:\"\\f134\"}.fa-rocket:before{content:\"\\f135\"}.fa-maxcdn:before{content:\"\\f136\"}.fa-chevron-circle-left:before{content:\"\\f137\"}.fa-chevron-circle-right:before{content:\"\\f138\"}.fa-chevron-circle-up:before{content:\"\\f139\"}.fa-chevron-circle-down:before{content:\"\\f13a\"}.fa-html5:before{content:\"\\f13b\"}.fa-css3:before{content:\"\\f13c\"}.fa-anchor:before{content:\"\\f13d\"}.fa-unlock-alt:before{content:\"\\f13e\"}.fa-bullseye:before{content:\"\\f140\"}.fa-ellipsis-h:before{content:\"\\f141\"}.fa-ellipsis-v:before{content:\"\\f142\"}.fa-rss-square:before{content:\"\\f143\"}.fa-play-circle:before{content:\"\\f144\"}.fa-ticket:before{content:\"\\f145\"}.fa-minus-square:before{content:\"\\f146\"}.fa-minus-square-o:before{content:\"\\f147\"}.fa-level-up:before{content:\"\\f148\"}.fa-level-down:before{content:\"\\f149\"}.fa-check-square:before{content:\"\\f14a\"}.fa-pencil-square:before{content:\"\\f14b\"}.fa-external-link-square:before{content:\"\\f14c\"}.fa-share-square:before{content:\"\\f14d\"}.fa-compass:before{content:\"\\f14e\"}.fa-toggle-down:before,.fa-caret-square-o-down:before{content:\"\\f150\"}.fa-toggle-up:before,.fa-caret-square-o-up:before{content:\"\\f151\"}.fa-toggle-right:before,.fa-caret-square-o-right:before{content:\"\\f152\"}.fa-euro:before,.fa-eur:before{content:\"\\f153\"}.fa-gbp:before{content:\"\\f154\"}.fa-dollar:before,.fa-usd:before{content:\"\\f155\"}.fa-rupee:before,.fa-inr:before{content:\"\\f156\"}.fa-cny:before,.fa-rmb:before,.fa-yen:before,.fa-jpy:before{content:\"\\f157\"}.fa-ruble:before,.fa-rouble:before,.fa-rub:before{content:\"\\f158\"}.fa-won:before,.fa-krw:before{content:\"\\f159\"}.fa-bitcoin:before,.fa-btc:before{content:\"\\f15a\"}.fa-file:before{content:\"\\f15b\"}.fa-file-text:before{content:\"\\f15c\"}.fa-sort-alpha-asc:before{content:\"\\f15d\"}.fa-sort-alpha-desc:before{content:\"\\f15e\"}.fa-sort-amount-asc:before{content:\"\\f160\"}.fa-sort-amount-desc:before{content:\"\\f161\"}.fa-sort-numeric-asc:before{content:\"\\f162\"}.fa-sort-numeric-desc:before{content:\"\\f163\"}.fa-thumbs-up:before{content:\"\\f164\"}.fa-thumbs-down:before{content:\"\\f165\"}.fa-youtube-square:before{content:\"\\f166\"}.fa-youtube:before{content:\"\\f167\"}.fa-xing:before{content:\"\\f168\"}.fa-xing-square:before{content:\"\\f169\"}.fa-youtube-play:before{content:\"\\f16a\"}.fa-dropbox:before{content:\"\\f16b\"}.fa-stack-overflow:before{content:\"\\f16c\"}.fa-instagram:before{content:\"\\f16d\"}.fa-flickr:before{content:\"\\f16e\"}.fa-adn:before{content:\"\\f170\"}.fa-bitbucket:before{content:\"\\f171\"}.fa-bitbucket-square:before{content:\"\\f172\"}.fa-tumblr:before{content:\"\\f173\"}.fa-tumblr-square:before{content:\"\\f174\"}.fa-long-arrow-down:before{content:\"\\f175\"}.fa-long-arrow-up:before{content:\"\\f176\"}.fa-long-arrow-left:before{content:\"\\f177\"}.fa-long-arrow-right:before{content:\"\\f178\"}.fa-apple:before{content:\"\\f179\"}.fa-windows:before{content:\"\\f17a\"}.fa-android:before{content:\"\\f17b\"}.fa-linux:before{content:\"\\f17c\"}.fa-dribbble:before{content:\"\\f17d\"}.fa-skype:before{content:\"\\f17e\"}.fa-foursquare:before{content:\"\\f180\"}.fa-trello:before{content:\"\\f181\"}.fa-female:before{content:\"\\f182\"}.fa-male:before{content:\"\\f183\"}.fa-gittip:before,.fa-gratipay:before{content:\"\\f184\"}.fa-sun-o:before{content:\"\\f185\"}.fa-moon-o:before{content:\"\\f186\"}.fa-archive:before{content:\"\\f187\"}.fa-bug:before{content:\"\\f188\"}.fa-vk:before{content:\"\\f189\"}.fa-weibo:before{content:\"\\f18a\"}.fa-renren:before{content:\"\\f18b\"}.fa-pagelines:before{content:\"\\f18c\"}.fa-stack-exchange:before{content:\"\\f18d\"}.fa-arrow-circle-o-right:before{content:\"\\f18e\"}.fa-arrow-circle-o-left:before{content:\"\\f190\"}.fa-toggle-left:before,.fa-caret-square-o-left:before{content:\"\\f191\"}.fa-dot-circle-o:before{content:\"\\f192\"}.fa-wheelchair:before{content:\"\\f193\"}.fa-vimeo-square:before{content:\"\\f194\"}.fa-turkish-lira:before,.fa-try:before{content:\"\\f195\"}.fa-plus-square-o:before{content:\"\\f196\"}.fa-space-shuttle:before{content:\"\\f197\"}.fa-slack:before{content:\"\\f198\"}.fa-envelope-square:before{content:\"\\f199\"}.fa-wordpress:before{content:\"\\f19a\"}.fa-openid:before{content:\"\\f19b\"}.fa-institution:before,.fa-bank:before,.fa-university:before{content:\"\\f19c\"}.fa-mortar-board:before,.fa-graduation-cap:before{content:\"\\f19d\"}.fa-yahoo:before{content:\"\\f19e\"}.fa-google:before{content:\"\\f1a0\"}.fa-reddit:before{content:\"\\f1a1\"}.fa-reddit-square:before{content:\"\\f1a2\"}.fa-stumbleupon-circle:before{content:\"\\f1a3\"}.fa-stumbleupon:before{content:\"\\f1a4\"}.fa-delicious:before{content:\"\\f1a5\"}.fa-digg:before{content:\"\\f1a6\"}.fa-pied-piper-pp:before{content:\"\\f1a7\"}.fa-pied-piper-alt:before{content:\"\\f1a8\"}.fa-drupal:before{content:\"\\f1a9\"}.fa-joomla:before{content:\"\\f1aa\"}.fa-language:before{content:\"\\f1ab\"}.fa-fax:before{content:\"\\f1ac\"}.fa-building:before{content:\"\\f1ad\"}.fa-child:before{content:\"\\f1ae\"}.fa-paw:before{content:\"\\f1b0\"}.fa-spoon:before{content:\"\\f1b1\"}.fa-cube:before{content:\"\\f1b2\"}.fa-cubes:before{content:\"\\f1b3\"}.fa-behance:before{content:\"\\f1b4\"}.fa-behance-square:before{content:\"\\f1b5\"}.fa-steam:before{content:\"\\f1b6\"}.fa-steam-square:before{content:\"\\f1b7\"}.fa-recycle:before{content:\"\\f1b8\"}.fa-automobile:before,.fa-car:before{content:\"\\f1b9\"}.fa-cab:before,.fa-taxi:before{content:\"\\f1ba\"}.fa-tree:before{content:\"\\f1bb\"}.fa-spotify:before{content:\"\\f1bc\"}.fa-deviantart:before{content:\"\\f1bd\"}.fa-soundcloud:before{content:\"\\f1be\"}.fa-database:before{content:\"\\f1c0\"}.fa-file-pdf-o:before{content:\"\\f1c1\"}.fa-file-word-o:before{content:\"\\f1c2\"}.fa-file-excel-o:before{content:\"\\f1c3\"}.fa-file-powerpoint-o:before{content:\"\\f1c4\"}.fa-file-photo-o:before,.fa-file-picture-o:before,.fa-file-image-o:before{content:\"\\f1c5\"}.fa-file-zip-o:before,.fa-file-archive-o:before{content:\"\\f1c6\"}.fa-file-sound-o:before,.fa-file-audio-o:before{content:\"\\f1c7\"}.fa-file-movie-o:before,.fa-file-video-o:before{content:\"\\f1c8\"}.fa-file-code-o:before{content:\"\\f1c9\"}.fa-vine:before{content:\"\\f1ca\"}.fa-codepen:before{content:\"\\f1cb\"}.fa-jsfiddle:before{content:\"\\f1cc\"}.fa-life-bouy:before,.fa-life-buoy:before,.fa-life-saver:before,.fa-support:before,.fa-life-ring:before{content:\"\\f1cd\"}.fa-circle-o-notch:before{content:\"\\f1ce\"}.fa-ra:before,.fa-resistance:before,.fa-rebel:before{content:\"\\f1d0\"}.fa-ge:before,.fa-empire:before{content:\"\\f1d1\"}.fa-git-square:before{content:\"\\f1d2\"}.fa-git:before{content:\"\\f1d3\"}.fa-y-combinator-square:before,.fa-yc-square:before,.fa-hacker-news:before{content:\"\\f1d4\"}.fa-tencent-weibo:before{content:\"\\f1d5\"}.fa-qq:before{content:\"\\f1d6\"}.fa-wechat:before,.fa-weixin:before{content:\"\\f1d7\"}.fa-send:before,.fa-paper-plane:before{content:\"\\f1d8\"}.fa-send-o:before,.fa-paper-plane-o:before{content:\"\\f1d9\"}.fa-history:before{content:\"\\f1da\"}.fa-circle-thin:before{content:\"\\f1db\"}.fa-header:before{content:\"\\f1dc\"}.fa-paragraph:before{content:\"\\f1dd\"}.fa-sliders:before{content:\"\\f1de\"}.fa-share-alt:before{content:\"\\f1e0\"}.fa-share-alt-square:before{content:\"\\f1e1\"}.fa-bomb:before{content:\"\\f1e2\"}.fa-soccer-ball-o:before,.fa-futbol-o:before{content:\"\\f1e3\"}.fa-tty:before{content:\"\\f1e4\"}.fa-binoculars:before{content:\"\\f1e5\"}.fa-plug:before{content:\"\\f1e6\"}.fa-slideshare:before{content:\"\\f1e7\"}.fa-twitch:before{content:\"\\f1e8\"}.fa-yelp:before{content:\"\\f1e9\"}.fa-newspaper-o:before{content:\"\\f1ea\"}.fa-wifi:before{content:\"\\f1eb\"}.fa-calculator:before{content:\"\\f1ec\"}.fa-paypal:before{content:\"\\f1ed\"}.fa-google-wallet:before{content:\"\\f1ee\"}.fa-cc-visa:before{content:\"\\f1f0\"}.fa-cc-mastercard:before{content:\"\\f1f1\"}.fa-cc-discover:before{content:\"\\f1f2\"}.fa-cc-amex:before{content:\"\\f1f3\"}.fa-cc-paypal:before{content:\"\\f1f4\"}.fa-cc-stripe:before{content:\"\\f1f5\"}.fa-bell-slash:before{content:\"\\f1f6\"}.fa-bell-slash-o:before{content:\"\\f1f7\"}.fa-trash:before{content:\"\\f1f8\"}.fa-copyright:before{content:\"\\f1f9\"}.fa-at:before{content:\"\\f1fa\"}.fa-eyedropper:before{content:\"\\f1fb\"}.fa-paint-brush:before{content:\"\\f1fc\"}.fa-birthday-cake:before{content:\"\\f1fd\"}.fa-area-chart:before{content:\"\\f1fe\"}.fa-pie-chart:before{content:\"\\f200\"}.fa-line-chart:before{content:\"\\f201\"}.fa-lastfm:before{content:\"\\f202\"}.fa-lastfm-square:before{content:\"\\f203\"}.fa-toggle-off:before{content:\"\\f204\"}.fa-toggle-on:before{content:\"\\f205\"}.fa-bicycle:before{content:\"\\f206\"}.fa-bus:before{content:\"\\f207\"}.fa-ioxhost:before{content:\"\\f208\"}.fa-angellist:before{content:\"\\f209\"}.fa-cc:before{content:\"\\f20a\"}.fa-shekel:before,.fa-sheqel:before,.fa-ils:before{content:\"\\f20b\"}.fa-meanpath:before{content:\"\\f20c\"}.fa-buysellads:before{content:\"\\f20d\"}.fa-connectdevelop:before{content:\"\\f20e\"}.fa-dashcube:before{content:\"\\f210\"}.fa-forumbee:before{content:\"\\f211\"}.fa-leanpub:before{content:\"\\f212\"}.fa-sellsy:before{content:\"\\f213\"}.fa-shirtsinbulk:before{content:\"\\f214\"}.fa-simplybuilt:before{content:\"\\f215\"}.fa-skyatlas:before{content:\"\\f216\"}.fa-cart-plus:before{content:\"\\f217\"}.fa-cart-arrow-down:before{content:\"\\f218\"}.fa-diamond:before{content:\"\\f219\"}.fa-ship:before{content:\"\\f21a\"}.fa-user-secret:before{content:\"\\f21b\"}.fa-motorcycle:before{content:\"\\f21c\"}.fa-street-view:before{content:\"\\f21d\"}.fa-heartbeat:before{content:\"\\f21e\"}.fa-venus:before{content:\"\\f221\"}.fa-mars:before{content:\"\\f222\"}.fa-mercury:before{content:\"\\f223\"}.fa-intersex:before,.fa-transgender:before{content:\"\\f224\"}.fa-transgender-alt:before{content:\"\\f225\"}.fa-venus-double:before{content:\"\\f226\"}.fa-mars-double:before{content:\"\\f227\"}.fa-venus-mars:before{content:\"\\f228\"}.fa-mars-stroke:before{content:\"\\f229\"}.fa-mars-stroke-v:before{content:\"\\f22a\"}.fa-mars-stroke-h:before{content:\"\\f22b\"}.fa-neuter:before{content:\"\\f22c\"}.fa-genderless:before{content:\"\\f22d\"}.fa-facebook-official:before{content:\"\\f230\"}.fa-pinterest-p:before{content:\"\\f231\"}.fa-whatsapp:before{content:\"\\f232\"}.fa-server:before{content:\"\\f233\"}.fa-user-plus:before{content:\"\\f234\"}.fa-user-times:before{content:\"\\f235\"}.fa-hotel:before,.fa-bed:before{content:\"\\f236\"}.fa-viacoin:before{content:\"\\f237\"}.fa-train:before{content:\"\\f238\"}.fa-subway:before{content:\"\\f239\"}.fa-medium:before{content:\"\\f23a\"}.fa-yc:before,.fa-y-combinator:before{content:\"\\f23b\"}.fa-optin-monster:before{content:\"\\f23c\"}.fa-opencart:before{content:\"\\f23d\"}.fa-expeditedssl:before{content:\"\\f23e\"}.fa-battery-4:before,.fa-battery:before,.fa-battery-full:before{content:\"\\f240\"}.fa-battery-3:before,.fa-battery-three-quarters:before{content:\"\\f241\"}.fa-battery-2:before,.fa-battery-half:before{content:\"\\f242\"}.fa-battery-1:before,.fa-battery-quarter:before{content:\"\\f243\"}.fa-battery-0:before,.fa-battery-empty:before{content:\"\\f244\"}.fa-mouse-pointer:before{content:\"\\f245\"}.fa-i-cursor:before{content:\"\\f246\"}.fa-object-group:before{content:\"\\f247\"}.fa-object-ungroup:before{content:\"\\f248\"}.fa-sticky-note:before{content:\"\\f249\"}.fa-sticky-note-o:before{content:\"\\f24a\"}.fa-cc-jcb:before{content:\"\\f24b\"}.fa-cc-diners-club:before{content:\"\\f24c\"}.fa-clone:before{content:\"\\f24d\"}.fa-balance-scale:before{content:\"\\f24e\"}.fa-hourglass-o:before{content:\"\\f250\"}.fa-hourglass-1:before,.fa-hourglass-start:before{content:\"\\f251\"}.fa-hourglass-2:before,.fa-hourglass-half:before{content:\"\\f252\"}.fa-hourglass-3:before,.fa-hourglass-end:before{content:\"\\f253\"}.fa-hourglass:before{content:\"\\f254\"}.fa-hand-grab-o:before,.fa-hand-rock-o:before{content:\"\\f255\"}.fa-hand-stop-o:before,.fa-hand-paper-o:before{content:\"\\f256\"}.fa-hand-scissors-o:before{content:\"\\f257\"}.fa-hand-lizard-o:before{content:\"\\f258\"}.fa-hand-spock-o:before{content:\"\\f259\"}.fa-hand-pointer-o:before{content:\"\\f25a\"}.fa-hand-peace-o:before{content:\"\\f25b\"}.fa-trademark:before{content:\"\\f25c\"}.fa-registered:before{content:\"\\f25d\"}.fa-creative-commons:before{content:\"\\f25e\"}.fa-gg:before{content:\"\\f260\"}.fa-gg-circle:before{content:\"\\f261\"}.fa-tripadvisor:before{content:\"\\f262\"}.fa-odnoklassniki:before{content:\"\\f263\"}.fa-odnoklassniki-square:before{content:\"\\f264\"}.fa-get-pocket:before{content:\"\\f265\"}.fa-wikipedia-w:before{content:\"\\f266\"}.fa-safari:before{content:\"\\f267\"}.fa-chrome:before{content:\"\\f268\"}.fa-firefox:before{content:\"\\f269\"}.fa-opera:before{content:\"\\f26a\"}.fa-internet-explorer:before{content:\"\\f26b\"}.fa-tv:before,.fa-television:before{content:\"\\f26c\"}.fa-contao:before{content:\"\\f26d\"}.fa-500px:before{content:\"\\f26e\"}.fa-amazon:before{content:\"\\f270\"}.fa-calendar-plus-o:before{content:\"\\f271\"}.fa-calendar-minus-o:before{content:\"\\f272\"}.fa-calendar-times-o:before{content:\"\\f273\"}.fa-calendar-check-o:before{content:\"\\f274\"}.fa-industry:before{content:\"\\f275\"}.fa-map-pin:before{content:\"\\f276\"}.fa-map-signs:before{content:\"\\f277\"}.fa-map-o:before{content:\"\\f278\"}.fa-map:before{content:\"\\f279\"}.fa-commenting:before{content:\"\\f27a\"}.fa-commenting-o:before{content:\"\\f27b\"}.fa-houzz:before{content:\"\\f27c\"}.fa-vimeo:before{content:\"\\f27d\"}.fa-black-tie:before{content:\"\\f27e\"}.fa-fonticons:before{content:\"\\f280\"}.fa-reddit-alien:before{content:\"\\f281\"}.fa-edge:before{content:\"\\f282\"}.fa-credit-card-alt:before{content:\"\\f283\"}.fa-codiepie:before{content:\"\\f284\"}.fa-modx:before{content:\"\\f285\"}.fa-fort-awesome:before{content:\"\\f286\"}.fa-usb:before{content:\"\\f287\"}.fa-product-hunt:before{content:\"\\f288\"}.fa-mixcloud:before{content:\"\\f289\"}.fa-scribd:before{content:\"\\f28a\"}.fa-pause-circle:before{content:\"\\f28b\"}.fa-pause-circle-o:before{content:\"\\f28c\"}.fa-stop-circle:before{content:\"\\f28d\"}.fa-stop-circle-o:before{content:\"\\f28e\"}.fa-shopping-bag:before{content:\"\\f290\"}.fa-shopping-basket:before{content:\"\\f291\"}.fa-hashtag:before{content:\"\\f292\"}.fa-bluetooth:before{content:\"\\f293\"}.fa-bluetooth-b:before{content:\"\\f294\"}.fa-percent:before{content:\"\\f295\"}.fa-gitlab:before{content:\"\\f296\"}.fa-wpbeginner:before{content:\"\\f297\"}.fa-wpforms:before{content:\"\\f298\"}.fa-envira:before{content:\"\\f299\"}.fa-universal-access:before{content:\"\\f29a\"}.fa-wheelchair-alt:before{content:\"\\f29b\"}.fa-question-circle-o:before{content:\"\\f29c\"}.fa-blind:before{content:\"\\f29d\"}.fa-audio-description:before{content:\"\\f29e\"}.fa-volume-control-phone:before{content:\"\\f2a0\"}.fa-braille:before{content:\"\\f2a1\"}.fa-assistive-listening-systems:before{content:\"\\f2a2\"}.fa-asl-interpreting:before,.fa-american-sign-language-interpreting:before{content:\"\\f2a3\"}.fa-deafness:before,.fa-hard-of-hearing:before,.fa-deaf:before{content:\"\\f2a4\"}.fa-glide:before{content:\"\\f2a5\"}.fa-glide-g:before{content:\"\\f2a6\"}.fa-signing:before,.fa-sign-language:before{content:\"\\f2a7\"}.fa-low-vision:before{content:\"\\f2a8\"}.fa-viadeo:before{content:\"\\f2a9\"}.fa-viadeo-square:before{content:\"\\f2aa\"}.fa-snapchat:before{content:\"\\f2ab\"}.fa-snapchat-ghost:before{content:\"\\f2ac\"}.fa-snapchat-square:before{content:\"\\f2ad\"}.fa-pied-piper:before{content:\"\\f2ae\"}.fa-first-order:before{content:\"\\f2b0\"}.fa-yoast:before{content:\"\\f2b1\"}.fa-themeisle:before{content:\"\\f2b2\"}.fa-google-plus-circle:before,.fa-google-plus-official:before{content:\"\\f2b3\"}.fa-fa:before,.fa-font-awesome:before{content:\"\\f2b4\"}.fa-handshake-o:before{content:\"\\f2b5\"}.fa-envelope-open:before{content:\"\\f2b6\"}.fa-envelope-open-o:before{content:\"\\f2b7\"}.fa-linode:before{content:\"\\f2b8\"}.fa-address-book:before{content:\"\\f2b9\"}.fa-address-book-o:before{content:\"\\f2ba\"}.fa-vcard:before,.fa-address-card:before{content:\"\\f2bb\"}.fa-vcard-o:before,.fa-address-card-o:before{content:\"\\f2bc\"}.fa-user-circle:before{content:\"\\f2bd\"}.fa-user-circle-o:before{content:\"\\f2be\"}.fa-user-o:before{content:\"\\f2c0\"}.fa-id-badge:before{content:\"\\f2c1\"}.fa-drivers-license:before,.fa-id-card:before{content:\"\\f2c2\"}.fa-drivers-license-o:before,.fa-id-card-o:before{content:\"\\f2c3\"}.fa-quora:before{content:\"\\f2c4\"}.fa-free-code-camp:before{content:\"\\f2c5\"}.fa-telegram:before{content:\"\\f2c6\"}.fa-thermometer-4:before,.fa-thermometer:before,.fa-thermometer-full:before{content:\"\\f2c7\"}.fa-thermometer-3:before,.fa-thermometer-three-quarters:before{content:\"\\f2c8\"}.fa-thermometer-2:before,.fa-thermometer-half:before{content:\"\\f2c9\"}.fa-thermometer-1:before,.fa-thermometer-quarter:before{content:\"\\f2ca\"}.fa-thermometer-0:before,.fa-thermometer-empty:before{content:\"\\f2cb\"}.fa-shower:before{content:\"\\f2cc\"}.fa-bathtub:before,.fa-s15:before,.fa-bath:before{content:\"\\f2cd\"}.fa-podcast:before{content:\"\\f2ce\"}.fa-window-maximize:before{content:\"\\f2d0\"}.fa-window-minimize:before{content:\"\\f2d1\"}.fa-window-restore:before{content:\"\\f2d2\"}.fa-times-rectangle:before,.fa-window-close:before{content:\"\\f2d3\"}.fa-times-rectangle-o:before,.fa-window-close-o:before{content:\"\\f2d4\"}.fa-bandcamp:before{content:\"\\f2d5\"}.fa-grav:before{content:\"\\f2d6\"}.fa-etsy:before{content:\"\\f2d7\"}.fa-imdb:before{content:\"\\f2d8\"}.fa-ravelry:before{content:\"\\f2d9\"}.fa-eercast:before{content:\"\\f2da\"}.fa-microchip:before{content:\"\\f2db\"}.fa-snowflake-o:before{content:\"\\f2dc\"}.fa-superpowers:before{content:\"\\f2dd\"}.fa-wpexplorer:before{content:\"\\f2de\"}.fa-meetup:before{content:\"\\f2e0\"}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}\n/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n *//*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{margin:.67em 0;font-size:2em}mark{color:#000;background:#ff0}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{height:0;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{margin:0;font:inherit;color:inherit}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}input{line-height:normal}input[type=checkbox],input[type=radio]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-appearance:textfield}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{padding:.35em .625em .75em;margin:0 2px;border:1px solid silver}legend{padding:0;border:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-spacing:0;border-collapse:collapse}td,th{padding:0}/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */@media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;-webkit-box-shadow:none!important;box-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href) \")\"}abbr[title]:after{content:\" (\" attr(title) \")\"}a[href^=\"javascript:\"]:after,a[href^=\"#\"]:after{content:\"\"}blockquote,pre{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}img{max-width:100%!important}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}.navbar{display:none}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000!important}.label{border:1px solid #000}.table{border-collapse:collapse!important}.table td,.table th{background-color:#fff!important}.table-bordered td,.table-bordered th{border:1px solid #ddd!important}}@font-face{font-family:\'Glyphicons Halflings\';src:url(../src/js/../../node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot);src:url(../src/js/../../node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot?#iefix) format(\'embedded-opentype\'),url(../src/js/../../node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2) format(\'woff2\'),url(../src/js/../../node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff) format(\'woff\'),url(../src/js/../../node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf) format(\'truetype\'),url(../src/js/../../node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular) format(\'svg\')}.glyphicon{position:relative;top:1px;display:inline-block;font-family:\'Glyphicons Halflings\';font-style:normal;font-weight:400;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.glyphicon-asterisk:before{content:\"\\002a\"}.glyphicon-plus:before{content:\"\\002b\"}.glyphicon-eur:before,.glyphicon-euro:before{content:\"\\20ac\"}.glyphicon-minus:before{content:\"\\2212\"}.glyphicon-cloud:before{content:\"\\2601\"}.glyphicon-envelope:before{content:\"\\2709\"}.glyphicon-pencil:before{content:\"\\270f\"}.glyphicon-glass:before{content:\"\\e001\"}.glyphicon-music:before{content:\"\\e002\"}.glyphicon-search:before{content:\"\\e003\"}.glyphicon-heart:before{content:\"\\e005\"}.glyphicon-star:before{content:\"\\e006\"}.glyphicon-star-empty:before{content:\"\\e007\"}.glyphicon-user:before{content:\"\\e008\"}.glyphicon-film:before{content:\"\\e009\"}.glyphicon-th-large:before{content:\"\\e010\"}.glyphicon-th:before{content:\"\\e011\"}.glyphicon-th-list:before{content:\"\\e012\"}.glyphicon-ok:before{content:\"\\e013\"}.glyphicon-remove:before{content:\"\\e014\"}.glyphicon-zoom-in:before{content:\"\\e015\"}.glyphicon-zoom-out:before{content:\"\\e016\"}.glyphicon-off:before{content:\"\\e017\"}.glyphicon-signal:before{content:\"\\e018\"}.glyphicon-cog:before{content:\"\\e019\"}.glyphicon-trash:before{content:\"\\e020\"}.glyphicon-home:before{content:\"\\e021\"}.glyphicon-file:before{content:\"\\e022\"}.glyphicon-time:before{content:\"\\e023\"}.glyphicon-road:before{content:\"\\e024\"}.glyphicon-download-alt:before{content:\"\\e025\"}.glyphicon-download:before{content:\"\\e026\"}.glyphicon-upload:before{content:\"\\e027\"}.glyphicon-inbox:before{content:\"\\e028\"}.glyphicon-play-circle:before{content:\"\\e029\"}.glyphicon-repeat:before{content:\"\\e030\"}.glyphicon-refresh:before{content:\"\\e031\"}.glyphicon-list-alt:before{content:\"\\e032\"}.glyphicon-lock:before{content:\"\\e033\"}.glyphicon-flag:before{content:\"\\e034\"}.glyphicon-headphones:before{content:\"\\e035\"}.glyphicon-volume-off:before{content:\"\\e036\"}.glyphicon-volume-down:before{content:\"\\e037\"}.glyphicon-volume-up:before{content:\"\\e038\"}.glyphicon-qrcode:before{content:\"\\e039\"}.glyphicon-barcode:before{content:\"\\e040\"}.glyphicon-tag:before{content:\"\\e041\"}.glyphicon-tags:before{content:\"\\e042\"}.glyphicon-book:before{content:\"\\e043\"}.glyphicon-bookmark:before{content:\"\\e044\"}.glyphicon-print:before{content:\"\\e045\"}.glyphicon-camera:before{content:\"\\e046\"}.glyphicon-font:before{content:\"\\e047\"}.glyphicon-bold:before{content:\"\\e048\"}.glyphicon-italic:before{content:\"\\e049\"}.glyphicon-text-height:before{content:\"\\e050\"}.glyphicon-text-width:before{content:\"\\e051\"}.glyphicon-align-left:before{content:\"\\e052\"}.glyphicon-align-center:before{content:\"\\e053\"}.glyphicon-align-right:before{content:\"\\e054\"}.glyphicon-align-justify:before{content:\"\\e055\"}.glyphicon-list:before{content:\"\\e056\"}.glyphicon-indent-left:before{content:\"\\e057\"}.glyphicon-indent-right:before{content:\"\\e058\"}.glyphicon-facetime-video:before{content:\"\\e059\"}.glyphicon-picture:before{content:\"\\e060\"}.glyphicon-map-marker:before{content:\"\\e062\"}.glyphicon-adjust:before{content:\"\\e063\"}.glyphicon-tint:before{content:\"\\e064\"}.glyphicon-edit:before{content:\"\\e065\"}.glyphicon-share:before{content:\"\\e066\"}.glyphicon-check:before{content:\"\\e067\"}.glyphicon-move:before{content:\"\\e068\"}.glyphicon-step-backward:before{content:\"\\e069\"}.glyphicon-fast-backward:before{content:\"\\e070\"}.glyphicon-backward:before{content:\"\\e071\"}.glyphicon-play:before{content:\"\\e072\"}.glyphicon-pause:before{content:\"\\e073\"}.glyphicon-stop:before{content:\"\\e074\"}.glyphicon-forward:before{content:\"\\e075\"}.glyphicon-fast-forward:before{content:\"\\e076\"}.glyphicon-step-forward:before{content:\"\\e077\"}.glyphicon-eject:before{content:\"\\e078\"}.glyphicon-chevron-left:before{content:\"\\e079\"}.glyphicon-chevron-right:before{content:\"\\e080\"}.glyphicon-plus-sign:before{content:\"\\e081\"}.glyphicon-minus-sign:before{content:\"\\e082\"}.glyphicon-remove-sign:before{content:\"\\e083\"}.glyphicon-ok-sign:before{content:\"\\e084\"}.glyphicon-question-sign:before{content:\"\\e085\"}.glyphicon-info-sign:before{content:\"\\e086\"}.glyphicon-screenshot:before{content:\"\\e087\"}.glyphicon-remove-circle:before{content:\"\\e088\"}.glyphicon-ok-circle:before{content:\"\\e089\"}.glyphicon-ban-circle:before{content:\"\\e090\"}.glyphicon-arrow-left:before{content:\"\\e091\"}.glyphicon-arrow-right:before{content:\"\\e092\"}.glyphicon-arrow-up:before{content:\"\\e093\"}.glyphicon-arrow-down:before{content:\"\\e094\"}.glyphicon-share-alt:before{content:\"\\e095\"}.glyphicon-resize-full:before{content:\"\\e096\"}.glyphicon-resize-small:before{content:\"\\e097\"}.glyphicon-exclamation-sign:before{content:\"\\e101\"}.glyphicon-gift:before{content:\"\\e102\"}.glyphicon-leaf:before{content:\"\\e103\"}.glyphicon-fire:before{content:\"\\e104\"}.glyphicon-eye-open:before{content:\"\\e105\"}.glyphicon-eye-close:before{content:\"\\e106\"}.glyphicon-warning-sign:before{content:\"\\e107\"}.glyphicon-plane:before{content:\"\\e108\"}.glyphicon-calendar:before{content:\"\\e109\"}.glyphicon-random:before{content:\"\\e110\"}.glyphicon-comment:before{content:\"\\e111\"}.glyphicon-magnet:before{content:\"\\e112\"}.glyphicon-chevron-up:before{content:\"\\e113\"}.glyphicon-chevron-down:before{content:\"\\e114\"}.glyphicon-retweet:before{content:\"\\e115\"}.glyphicon-shopping-cart:before{content:\"\\e116\"}.glyphicon-folder-close:before{content:\"\\e117\"}.glyphicon-folder-open:before{content:\"\\e118\"}.glyphicon-resize-vertical:before{content:\"\\e119\"}.glyphicon-resize-horizontal:before{content:\"\\e120\"}.glyphicon-hdd:before{content:\"\\e121\"}.glyphicon-bullhorn:before{content:\"\\e122\"}.glyphicon-bell:before{content:\"\\e123\"}.glyphicon-certificate:before{content:\"\\e124\"}.glyphicon-thumbs-up:before{content:\"\\e125\"}.glyphicon-thumbs-down:before{content:\"\\e126\"}.glyphicon-hand-right:before{content:\"\\e127\"}.glyphicon-hand-left:before{content:\"\\e128\"}.glyphicon-hand-up:before{content:\"\\e129\"}.glyphicon-hand-down:before{content:\"\\e130\"}.glyphicon-circle-arrow-right:before{content:\"\\e131\"}.glyphicon-circle-arrow-left:before{content:\"\\e132\"}.glyphicon-circle-arrow-up:before{content:\"\\e133\"}.glyphicon-circle-arrow-down:before{content:\"\\e134\"}.glyphicon-globe:before{content:\"\\e135\"}.glyphicon-wrench:before{content:\"\\e136\"}.glyphicon-tasks:before{content:\"\\e137\"}.glyphicon-filter:before{content:\"\\e138\"}.glyphicon-briefcase:before{content:\"\\e139\"}.glyphicon-fullscreen:before{content:\"\\e140\"}.glyphicon-dashboard:before{content:\"\\e141\"}.glyphicon-paperclip:before{content:\"\\e142\"}.glyphicon-heart-empty:before{content:\"\\e143\"}.glyphicon-link:before{content:\"\\e144\"}.glyphicon-phone:before{content:\"\\e145\"}.glyphicon-pushpin:before{content:\"\\e146\"}.glyphicon-usd:before{content:\"\\e148\"}.glyphicon-gbp:before{content:\"\\e149\"}.glyphicon-sort:before{content:\"\\e150\"}.glyphicon-sort-by-alphabet:before{content:\"\\e151\"}.glyphicon-sort-by-alphabet-alt:before{content:\"\\e152\"}.glyphicon-sort-by-order:before{content:\"\\e153\"}.glyphicon-sort-by-order-alt:before{content:\"\\e154\"}.glyphicon-sort-by-attributes:before{content:\"\\e155\"}.glyphicon-sort-by-attributes-alt:before{content:\"\\e156\"}.glyphicon-unchecked:before{content:\"\\e157\"}.glyphicon-expand:before{content:\"\\e158\"}.glyphicon-collapse-down:before{content:\"\\e159\"}.glyphicon-collapse-up:before{content:\"\\e160\"}.glyphicon-log-in:before{content:\"\\e161\"}.glyphicon-flash:before{content:\"\\e162\"}.glyphicon-log-out:before{content:\"\\e163\"}.glyphicon-new-window:before{content:\"\\e164\"}.glyphicon-record:before{content:\"\\e165\"}.glyphicon-save:before{content:\"\\e166\"}.glyphicon-open:before{content:\"\\e167\"}.glyphicon-saved:before{content:\"\\e168\"}.glyphicon-import:before{content:\"\\e169\"}.glyphicon-export:before{content:\"\\e170\"}.glyphicon-send:before{content:\"\\e171\"}.glyphicon-floppy-disk:before{content:\"\\e172\"}.glyphicon-floppy-saved:before{content:\"\\e173\"}.glyphicon-floppy-remove:before{content:\"\\e174\"}.glyphicon-floppy-save:before{content:\"\\e175\"}.glyphicon-floppy-open:before{content:\"\\e176\"}.glyphicon-credit-card:before{content:\"\\e177\"}.glyphicon-transfer:before{content:\"\\e178\"}.glyphicon-cutlery:before{content:\"\\e179\"}.glyphicon-header:before{content:\"\\e180\"}.glyphicon-compressed:before{content:\"\\e181\"}.glyphicon-earphone:before{content:\"\\e182\"}.glyphicon-phone-alt:before{content:\"\\e183\"}.glyphicon-tower:before{content:\"\\e184\"}.glyphicon-stats:before{content:\"\\e185\"}.glyphicon-sd-video:before{content:\"\\e186\"}.glyphicon-hd-video:before{content:\"\\e187\"}.glyphicon-subtitles:before{content:\"\\e188\"}.glyphicon-sound-stereo:before{content:\"\\e189\"}.glyphicon-sound-dolby:before{content:\"\\e190\"}.glyphicon-sound-5-1:before{content:\"\\e191\"}.glyphicon-sound-6-1:before{content:\"\\e192\"}.glyphicon-sound-7-1:before{content:\"\\e193\"}.glyphicon-copyright-mark:before{content:\"\\e194\"}.glyphicon-registration-mark:before{content:\"\\e195\"}.glyphicon-cloud-download:before{content:\"\\e197\"}.glyphicon-cloud-upload:before{content:\"\\e198\"}.glyphicon-tree-conifer:before{content:\"\\e199\"}.glyphicon-tree-deciduous:before{content:\"\\e200\"}.glyphicon-cd:before{content:\"\\e201\"}.glyphicon-save-file:before{content:\"\\e202\"}.glyphicon-open-file:before{content:\"\\e203\"}.glyphicon-level-up:before{content:\"\\e204\"}.glyphicon-copy:before{content:\"\\e205\"}.glyphicon-paste:before{content:\"\\e206\"}.glyphicon-alert:before{content:\"\\e209\"}.glyphicon-equalizer:before{content:\"\\e210\"}.glyphicon-king:before{content:\"\\e211\"}.glyphicon-queen:before{content:\"\\e212\"}.glyphicon-pawn:before{content:\"\\e213\"}.glyphicon-bishop:before{content:\"\\e214\"}.glyphicon-knight:before{content:\"\\e215\"}.glyphicon-baby-formula:before{content:\"\\e216\"}.glyphicon-tent:before{content:\"\\26fa\"}.glyphicon-blackboard:before{content:\"\\e218\"}.glyphicon-bed:before{content:\"\\e219\"}.glyphicon-apple:before{content:\"\\f8ff\"}.glyphicon-erase:before{content:\"\\e221\"}.glyphicon-hourglass:before{content:\"\\231b\"}.glyphicon-lamp:before{content:\"\\e223\"}.glyphicon-duplicate:before{content:\"\\e224\"}.glyphicon-piggy-bank:before{content:\"\\e225\"}.glyphicon-scissors:before{content:\"\\e226\"}.glyphicon-bitcoin:before{content:\"\\e227\"}.glyphicon-btc:before{content:\"\\e227\"}.glyphicon-xbt:before{content:\"\\e227\"}.glyphicon-yen:before{content:\"\\00a5\"}.glyphicon-jpy:before{content:\"\\00a5\"}.glyphicon-ruble:before{content:\"\\20bd\"}.glyphicon-rub:before{content:\"\\20bd\"}.glyphicon-scale:before{content:\"\\e230\"}.glyphicon-ice-lolly:before{content:\"\\e231\"}.glyphicon-ice-lolly-tasted:before{content:\"\\e232\"}.glyphicon-education:before{content:\"\\e233\"}.glyphicon-option-horizontal:before{content:\"\\e234\"}.glyphicon-option-vertical:before{content:\"\\e235\"}.glyphicon-menu-hamburger:before{content:\"\\e236\"}.glyphicon-modal-window:before{content:\"\\e237\"}.glyphicon-oil:before{content:\"\\e238\"}.glyphicon-grain:before{content:\"\\e239\"}.glyphicon-sunglasses:before{content:\"\\e240\"}.glyphicon-text-size:before{content:\"\\e241\"}.glyphicon-text-color:before{content:\"\\e242\"}.glyphicon-text-background:before{content:\"\\e243\"}.glyphicon-object-align-top:before{content:\"\\e244\"}.glyphicon-object-align-bottom:before{content:\"\\e245\"}.glyphicon-object-align-horizontal:before{content:\"\\e246\"}.glyphicon-object-align-left:before{content:\"\\e247\"}.glyphicon-object-align-vertical:before{content:\"\\e248\"}.glyphicon-object-align-right:before{content:\"\\e249\"}.glyphicon-triangle-right:before{content:\"\\e250\"}.glyphicon-triangle-left:before{content:\"\\e251\"}.glyphicon-triangle-bottom:before{content:\"\\e252\"}.glyphicon-triangle-top:before{content:\"\\e253\"}.glyphicon-console:before{content:\"\\e254\"}.glyphicon-superscript:before{content:\"\\e255\"}.glyphicon-subscript:before{content:\"\\e256\"}.glyphicon-menu-left:before{content:\"\\e257\"}.glyphicon-menu-right:before{content:\"\\e258\"}.glyphicon-menu-down:before{content:\"\\e259\"}.glyphicon-menu-up:before{content:\"\\e260\"}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}a{color:#337ab7;text-decoration:none}a:focus,a:hover{color:#23527c;text-decoration:underline}a:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.carousel-inner>.item>a>img,.carousel-inner>.item>img,.img-responsive,.thumbnail a>img,.thumbnail>img{display:block;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{display:inline-block;max-width:100%;height:auto;padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.img-circle{border-radius:50%}hr{margin-top:20px;margin-bottom:20px;border:0;border-top:1px solid #eee}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}[role=button]{cursor:pointer}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-weight:400;line-height:1;color:#777}.h1,.h2,.h3,h1,h2,h3{margin-top:20px;margin-bottom:10px}.h1 .small,.h1 small,.h2 .small,.h2 small,.h3 .small,.h3 small,h1 .small,h1 small,h2 .small,h2 small,h3 .small,h3 small{font-size:65%}.h4,.h5,.h6,h4,h5,h6{margin-top:10px;margin-bottom:10px}.h4 .small,.h4 small,.h5 .small,.h5 small,.h6 .small,.h6 small,h4 .small,h4 small,h5 .small,h5 small,h6 .small,h6 small{font-size:75%}.h1,h1{font-size:36px}.h2,h2{font-size:30px}.h3,h3{font-size:24px}.h4,h4{font-size:18px}.h5,h5{font-size:14px}.h6,h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}.small,small{font-size:85%}.mark,mark{padding:.2em;background-color:#fcf8e3}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#337ab7}a.text-primary:focus,a.text-primary:hover{color:#286090}.text-success{color:#3c763d}a.text-success:focus,a.text-success:hover{color:#2b542c}.text-info{color:#31708f}a.text-info:focus,a.text-info:hover{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:focus,a.text-warning:hover{color:#66512c}.text-danger{color:#a94442}a.text-danger:focus,a.text-danger:hover{color:#843534}.bg-primary{color:#fff;background-color:#337ab7}a.bg-primary:focus,a.bg-primary:hover{background-color:#286090}.bg-success{background-color:#dff0d8}a.bg-success:focus,a.bg-success:hover{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:focus,a.bg-info:hover{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:focus,a.bg-warning:hover{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:focus,a.bg-danger:hover{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ol,ul{margin-top:0;margin-bottom:10px}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;margin-left:-5px;list-style:none}.list-inline>li{display:inline-block;padding-right:5px;padding-left:5px}dl{margin-top:0;margin-bottom:20px}dd,dt{line-height:1.42857143}dt{font-weight:700}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[data-original-title],abbr[title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote ol:last-child,blockquote p:last-child,blockquote ul:last-child{margin-bottom:0}blockquote .small,blockquote footer,blockquote small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote .small:before,blockquote footer:before,blockquote small:before{content:\'\\2014 \\00A0\'}.blockquote-reverse,blockquote.pull-right{padding-right:15px;padding-left:0;text-align:right;border-right:5px solid #eee;border-left:0}.blockquote-reverse .small:before,.blockquote-reverse footer:before,.blockquote-reverse small:before,blockquote.pull-right .small:before,blockquote.pull-right footer:before,blockquote.pull-right small:before{content:\'\'}.blockquote-reverse .small:after,.blockquote-reverse footer:after,.blockquote-reverse small:after,blockquote.pull-right .small:after,blockquote.pull-right footer:after,blockquote.pull-right small:after{content:\'\\00A0 \\2014\'}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,\"Courier New\",monospace}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}kbd{padding:2px 4px;font-size:90%;color:#fff;background-color:#333;border-radius:3px;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.25);box-shadow:inset 0 -1px 0 rgba(0,0,0,.25)}kbd kbd{padding:0;font-size:100%;font-weight:700;-webkit-box-shadow:none;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;color:#333;word-break:break-all;word-wrap:break-word;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width:768px){.container{width:750px}}@media (min-width:992px){.container{width:970px}}@media (min-width:1200px){.container{width:1170px}}.container-fluid{padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}.row{margin-right:-15px;margin-left:-15px}.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{position:relative;min-height:1px;padding-right:15px;padding-left:15px}.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}caption{padding-top:8px;padding-bottom:8px;color:#777;text-align:left}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>tbody>tr>td,.table>tbody>tr>th,.table>tfoot>tr>td,.table>tfoot>tr>th,.table>thead>tr>td,.table>thead>tr>th{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>td,.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>td,.table>thead:first-child>tr:first-child>th{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>tbody>tr>td,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>td,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>thead>tr>th{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border:1px solid #ddd}.table-bordered>thead>tr>td,.table-bordered>thead>tr>th{border-bottom-width:2px}.table-striped>tbody>tr:nth-of-type(odd){background-color:#f9f9f9}.table-hover>tbody>tr:hover{background-color:#f5f5f5}table col[class*=col-]{position:static;display:table-column;float:none}table td[class*=col-],table th[class*=col-]{position:static;display:table-cell;float:none}.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>thead>tr>td.active,.table>thead>tr>th.active{background-color:#f5f5f5}.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr.active:hover>th,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover{background-color:#e8e8e8}.table>tbody>tr.success>td,.table>tbody>tr.success>th,.table>tbody>tr>td.success,.table>tbody>tr>th.success,.table>tfoot>tr.success>td,.table>tfoot>tr.success>th,.table>tfoot>tr>td.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>thead>tr.success>th,.table>thead>tr>td.success,.table>thead>tr>th.success{background-color:#dff0d8}.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr.success:hover>th,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover{background-color:#d0e9c6}.table>tbody>tr.info>td,.table>tbody>tr.info>th,.table>tbody>tr>td.info,.table>tbody>tr>th.info,.table>tfoot>tr.info>td,.table>tfoot>tr.info>th,.table>tfoot>tr>td.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>thead>tr.info>th,.table>thead>tr>td.info,.table>thead>tr>th.info{background-color:#d9edf7}.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr.info:hover>th,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover{background-color:#c4e3f3}.table>tbody>tr.warning>td,.table>tbody>tr.warning>th,.table>tbody>tr>td.warning,.table>tbody>tr>th.warning,.table>tfoot>tr.warning>td,.table>tfoot>tr.warning>th,.table>tfoot>tr>td.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>thead>tr.warning>th,.table>thead>tr>td.warning,.table>thead>tr>th.warning{background-color:#fcf8e3}.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover{background-color:#faf2cc}.table>tbody>tr.danger>td,.table>tbody>tr.danger>th,.table>tbody>tr>td.danger,.table>tbody>tr>th.danger,.table>tfoot>tr.danger>td,.table>tfoot>tr.danger>th,.table>tfoot>tr>td.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>thead>tr.danger>th,.table>thead>tr>td.danger,.table>thead>tr>th.danger{background-color:#f2dede}.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr.danger:hover>th,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover{background-color:#ebcccc}.table-responsive{min-height:.01%;overflow-x:auto}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>td,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>thead>tr>th{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}}fieldset{min-width:0;padding:0;margin:0;border:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:21px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:700}input[type=search]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type=checkbox],input[type=radio]{margin:4px 0 0;margin-top:1px\\9;line-height:normal}input[type=file]{display:block}input[type=range]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type=file]:focus,input[type=checkbox]:focus,input[type=radio]:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)}.form-control::-moz-placeholder{color:#999;opacity:1}.form-control:-ms-input-placeholder{color:#999}.form-control::-webkit-input-placeholder{color:#999}.form-control::-ms-expand{background-color:transparent;border:0}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{background-color:#eee;opacity:1}.form-control[disabled],fieldset[disabled] .form-control{cursor:not-allowed}textarea.form-control{height:auto}input[type=search]{-webkit-appearance:none}@media screen and (-webkit-min-device-pixel-ratio:0){input[type=date].form-control,input[type=time].form-control,input[type=datetime-local].form-control,input[type=month].form-control{line-height:34px}.input-group-sm input[type=date],.input-group-sm input[type=time],.input-group-sm input[type=datetime-local],.input-group-sm input[type=month],input[type=date].input-sm,input[type=time].input-sm,input[type=datetime-local].input-sm,input[type=month].input-sm{line-height:30px}.input-group-lg input[type=date],.input-group-lg input[type=time],.input-group-lg input[type=datetime-local],.input-group-lg input[type=month],input[type=date].input-lg,input[type=time].input-lg,input[type=datetime-local].input-lg,input[type=month].input-lg{line-height:46px}}.form-group{margin-bottom:15px}.checkbox,.radio{position:relative;display:block;margin-top:10px;margin-bottom:10px}.checkbox label,.radio label{min-height:20px;padding-left:20px;margin-bottom:0;font-weight:400;cursor:pointer}.checkbox input[type=checkbox],.checkbox-inline input[type=checkbox],.radio input[type=radio],.radio-inline input[type=radio]{position:absolute;margin-top:4px\\9;margin-left:-20px}.checkbox+.checkbox,.radio+.radio{margin-top:-5px}.checkbox-inline,.radio-inline{position:relative;display:inline-block;padding-left:20px;margin-bottom:0;font-weight:400;vertical-align:middle;cursor:pointer}.checkbox-inline+.checkbox-inline,.radio-inline+.radio-inline{margin-top:0;margin-left:10px}fieldset[disabled] input[type=checkbox],fieldset[disabled] input[type=radio],input[type=checkbox].disabled,input[type=checkbox][disabled],input[type=radio].disabled,input[type=radio][disabled]{cursor:not-allowed}.checkbox-inline.disabled,.radio-inline.disabled,fieldset[disabled] .checkbox-inline,fieldset[disabled] .radio-inline{cursor:not-allowed}.checkbox.disabled label,.radio.disabled label,fieldset[disabled] .checkbox label,fieldset[disabled] .radio label{cursor:not-allowed}.form-control-static{min-height:34px;padding-top:7px;padding-bottom:7px;margin-bottom:0}.form-control-static.input-lg,.form-control-static.input-sm{padding-right:0;padding-left:0}.input-sm{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}select[multiple].input-sm,textarea.input-sm{height:auto}.form-group-sm .form-control{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.form-group-sm select.form-control{height:30px;line-height:30px}.form-group-sm select[multiple].form-control,.form-group-sm textarea.form-control{height:auto}.form-group-sm .form-control-static{height:30px;min-height:32px;padding:6px 10px;font-size:12px;line-height:1.5}.input-lg{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-lg{height:46px;line-height:46px}select[multiple].input-lg,textarea.input-lg{height:auto}.form-group-lg .form-control{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.form-group-lg select.form-control{height:46px;line-height:46px}.form-group-lg select[multiple].form-control,.form-group-lg textarea.form-control{height:auto}.form-group-lg .form-control-static{height:46px;min-height:38px;padding:11px 16px;font-size:18px;line-height:1.3333333}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:0;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center;pointer-events:none}.form-group-lg .form-control+.form-control-feedback,.input-group-lg+.form-control-feedback,.input-lg+.form-control-feedback{width:46px;height:46px;line-height:46px}.form-group-sm .form-control+.form-control-feedback,.input-group-sm+.form-control-feedback,.input-sm+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .checkbox,.has-success .checkbox-inline,.has-success .control-label,.has-success .help-block,.has-success .radio,.has-success .radio-inline,.has-success.checkbox label,.has-success.checkbox-inline label,.has-success.radio label,.has-success.radio-inline label{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;background-color:#dff0d8;border-color:#3c763d}.has-success .form-control-feedback{color:#3c763d}.has-warning .checkbox,.has-warning .checkbox-inline,.has-warning .control-label,.has-warning .help-block,.has-warning .radio,.has-warning .radio-inline,.has-warning.checkbox label,.has-warning.checkbox-inline label,.has-warning.radio label,.has-warning.radio-inline label{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;background-color:#fcf8e3;border-color:#8a6d3b}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .checkbox,.has-error .checkbox-inline,.has-error .control-label,.has-error .help-block,.has-error .radio,.has-error .radio-inline,.has-error.checkbox label,.has-error.checkbox-inline label,.has-error.radio label,.has-error.radio-inline label{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;background-color:#f2dede;border-color:#a94442}.has-error .form-control-feedback{color:#a94442}.has-feedback label~.form-control-feedback{top:25px}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-static{display:inline-block}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .form-control,.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .checkbox,.form-inline .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .checkbox label,.form-inline .radio label{padding-left:0}.form-inline .checkbox input[type=checkbox],.form-inline .radio input[type=radio]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .checkbox,.form-horizontal .checkbox-inline,.form-horizontal .radio,.form-horizontal .radio-inline{padding-top:7px;margin-top:0;margin-bottom:0}.form-horizontal .checkbox,.form-horizontal .radio{min-height:27px}.form-horizontal .form-group{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.form-horizontal .control-label{padding-top:7px;margin-bottom:0;text-align:right}}.form-horizontal .has-feedback .form-control-feedback{right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:11px;font-size:18px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px;font-size:12px}}.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.btn.active.focus,.btn.active:focus,.btn.focus,.btn:active.focus,.btn:active:focus,.btn:focus{outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn.focus,.btn:focus,.btn:hover{color:#333;text-decoration:none}.btn.active,.btn:active{background-image:none;outline:0;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none;opacity:.65}a.btn.disabled,fieldset[disabled] a.btn{pointer-events:none}.btn-default{color:#333;background-color:#fff;border-color:#ccc}.btn-default.focus,.btn-default:focus{color:#333;background-color:#e6e6e6;border-color:#8c8c8c}.btn-default:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default.active.focus,.btn-default.active:focus,.btn-default.active:hover,.btn-default:active.focus,.btn-default:active:focus,.btn-default:active:hover,.open>.dropdown-toggle.btn-default.focus,.open>.dropdown-toggle.btn-default:focus,.open>.dropdown-toggle.btn-default:hover{color:#333;background-color:#d4d4d4;border-color:#8c8c8c}.btn-default.active,.btn-default:active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled.focus,.btn-default.disabled:focus,.btn-default.disabled:hover,.btn-default[disabled].focus,.btn-default[disabled]:focus,.btn-default[disabled]:hover,fieldset[disabled] .btn-default.focus,fieldset[disabled] .btn-default:focus,fieldset[disabled] .btn-default:hover{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#333}.btn-primary{color:#fff;background-color:#337ab7;border-color:#2e6da4}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#286090;border-color:#122b40}.btn-primary:hover{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#286090;border-color:#204d74}.btn-primary.active.focus,.btn-primary.active:focus,.btn-primary.active:hover,.btn-primary:active.focus,.btn-primary:active:focus,.btn-primary:active:hover,.open>.dropdown-toggle.btn-primary.focus,.open>.dropdown-toggle.btn-primary:focus,.open>.dropdown-toggle.btn-primary:hover{color:#fff;background-color:#204d74;border-color:#122b40}.btn-primary.active,.btn-primary:active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled.focus,.btn-primary.disabled:focus,.btn-primary.disabled:hover,.btn-primary[disabled].focus,.btn-primary[disabled]:focus,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary.focus,fieldset[disabled] .btn-primary:focus,fieldset[disabled] .btn-primary:hover{background-color:#337ab7;border-color:#2e6da4}.btn-primary .badge{color:#337ab7;background-color:#fff}.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#449d44;border-color:#255625}.btn-success:hover{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}.btn-success.active.focus,.btn-success.active:focus,.btn-success.active:hover,.btn-success:active.focus,.btn-success:active:focus,.btn-success:active:hover,.open>.dropdown-toggle.btn-success.focus,.open>.dropdown-toggle.btn-success:focus,.open>.dropdown-toggle.btn-success:hover{color:#fff;background-color:#398439;border-color:#255625}.btn-success.active,.btn-success:active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled.focus,.btn-success.disabled:focus,.btn-success.disabled:hover,.btn-success[disabled].focus,.btn-success[disabled]:focus,.btn-success[disabled]:hover,fieldset[disabled] .btn-success.focus,fieldset[disabled] .btn-success:focus,fieldset[disabled] .btn-success:hover{background-color:#5cb85c;border-color:#4cae4c}.btn-success .badge{color:#5cb85c;background-color:#fff}.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#31b0d5;border-color:#1b6d85}.btn-info:hover{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info.active.focus,.btn-info.active:focus,.btn-info.active:hover,.btn-info:active.focus,.btn-info:active:focus,.btn-info:active:hover,.open>.dropdown-toggle.btn-info.focus,.open>.dropdown-toggle.btn-info:focus,.open>.dropdown-toggle.btn-info:hover{color:#fff;background-color:#269abc;border-color:#1b6d85}.btn-info.active,.btn-info:active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled.focus,.btn-info.disabled:focus,.btn-info.disabled:hover,.btn-info[disabled].focus,.btn-info[disabled]:focus,.btn-info[disabled]:hover,fieldset[disabled] .btn-info.focus,fieldset[disabled] .btn-info:focus,fieldset[disabled] .btn-info:hover{background-color:#5bc0de;border-color:#46b8da}.btn-info .badge{color:#5bc0de;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning.focus,.btn-warning:focus{color:#fff;background-color:#ec971f;border-color:#985f0d}.btn-warning:hover{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning.active.focus,.btn-warning.active:focus,.btn-warning.active:hover,.btn-warning:active.focus,.btn-warning:active:focus,.btn-warning:active:hover,.open>.dropdown-toggle.btn-warning.focus,.open>.dropdown-toggle.btn-warning:focus,.open>.dropdown-toggle.btn-warning:hover{color:#fff;background-color:#d58512;border-color:#985f0d}.btn-warning.active,.btn-warning:active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled.focus,.btn-warning.disabled:focus,.btn-warning.disabled:hover,.btn-warning[disabled].focus,.btn-warning[disabled]:focus,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning.focus,fieldset[disabled] .btn-warning:focus,fieldset[disabled] .btn-warning:hover{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c9302c;border-color:#761c19}.btn-danger:hover{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger.active.focus,.btn-danger.active:focus,.btn-danger.active:hover,.btn-danger:active.focus,.btn-danger:active:focus,.btn-danger:active:hover,.open>.dropdown-toggle.btn-danger.focus,.open>.dropdown-toggle.btn-danger:focus,.open>.dropdown-toggle.btn-danger:hover{color:#fff;background-color:#ac2925;border-color:#761c19}.btn-danger.active,.btn-danger:active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled.focus,.btn-danger.disabled:focus,.btn-danger.disabled:hover,.btn-danger[disabled].focus,.btn-danger[disabled]:focus,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger.focus,fieldset[disabled] .btn-danger:focus,fieldset[disabled] .btn-danger:hover{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{font-weight:400;color:#337ab7;border-radius:0}.btn-link,.btn-link.active,.btn-link:active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:active,.btn-link:focus,.btn-link:hover{border-color:transparent}.btn-link:focus,.btn-link:hover{color:#23527c;text-decoration:underline;background-color:transparent}.btn-link[disabled]:focus,.btn-link[disabled]:hover,fieldset[disabled] .btn-link:focus,fieldset[disabled] .btn-link:hover{color:#777;text-decoration:none}.btn-group-lg>.btn,.btn-lg{padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}.btn-group-sm>.btn,.btn-sm{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type=button].btn-block,input[type=reset].btn-block,input[type=submit].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition-timing-function:ease;-o-transition-timing-function:ease;transition-timing-function:ease;-webkit-transition-duration:.35s;-o-transition-duration:.35s;transition-duration:.35s;-webkit-transition-property:height,visibility;-o-transition-property:height,visibility;transition-property:height,visibility}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px dashed;border-top:4px solid\\9;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown,.dropup{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175)}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:focus,.dropdown-menu>li>a:hover{color:#262626;text-decoration:none;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:focus,.dropdown-menu>.active>a:hover{color:#fff;text-decoration:none;background-color:#337ab7;outline:0}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{color:#777}.dropdown-menu>.disabled>a:focus,.dropdown-menu>.disabled>a:hover{text-decoration:none;cursor:not-allowed;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false)}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{right:0;left:auto}.dropdown-menu-left{right:auto;left:0}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}.dropdown-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{content:\"\";border-top:0;border-bottom:4px dashed;border-bottom:4px solid\\9}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:2px}@media (min-width:768px){.navbar-right .dropdown-menu{right:0;left:auto}.navbar-right .dropdown-menu-left{right:auto;left:0}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group-vertical>.btn,.btn-group>.btn{position:relative;float:left}.btn-group-vertical>.btn.active,.btn-group-vertical>.btn:active,.btn-group-vertical>.btn:focus,.btn-group-vertical>.btn:hover,.btn-group>.btn.active,.btn-group>.btn:active,.btn-group>.btn:focus,.btn-group>.btn:hover{z-index:2}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn,.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-bottom-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-right:8px;padding-left:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-right:12px;padding-left:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,.125);box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-left-radius:0;border-top-right-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{display:table-cell;float:none;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle=buttons]>.btn input[type=checkbox],[data-toggle=buttons]>.btn input[type=radio],[data-toggle=buttons]>.btn-group>.btn input[type=checkbox],[data-toggle=buttons]>.btn-group>.btn input[type=radio]{position:absolute;clip:rect(0,0,0,0);pointer-events:none}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*=col-]{float:none;padding-right:0;padding-left:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group .form-control:focus{z-index:3}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.3333333;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn,textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn,textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn{height:auto}.input-group .form-control,.input-group-addon,.input-group-btn{display:table-cell}.input-group .form-control:not(:first-child):not(:last-child),.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:400;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type=checkbox],.input-group-addon input[type=radio]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn-group:not(:last-child)>.btn,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:first-child>.btn-group:not(:first-child)>.btn,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle{border-top-left-radius:0;border-bottom-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:active,.input-group-btn>.btn:focus,.input-group-btn>.btn:hover{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{z-index:2;margin-left:-1px}.nav{padding-left:0;margin-bottom:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:focus,.nav>li>a:hover{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:focus,.nav>li.disabled>a:hover{color:#777;text-decoration:none;cursor:not-allowed;background-color:transparent}.nav .open>a,.nav .open>a:focus,.nav .open>a:hover{background-color:#eee;border-color:#337ab7}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:focus,.nav-tabs>li.active>a:hover{color:#555;cursor:default;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:focus,.nav-tabs.nav-justified>.active>a:hover{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:4px}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:focus,.nav-pills>li.active>a:hover{color:#fff;background-color:#337ab7}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{margin-bottom:5px;text-align:center}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:focus,.nav-tabs-justified>.active>a:hover{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:4px}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{padding-right:15px;padding-left:15px;overflow-x:visible;-webkit-overflow-scrolling:touch;border-top:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;-webkit-box-shadow:none;box-shadow:none}.navbar-collapse.collapse{display:block!important;height:auto!important;padding-bottom:0;overflow:visible!important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse{padding-right:0;padding-left:0}}.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:340px}@media (max-device-width:480px) and (orientation:landscape){.navbar-fixed-bottom .navbar-collapse,.navbar-fixed-top .navbar-collapse{max-height:200px}}.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container-fluid>.navbar-collapse,.container-fluid>.navbar-header,.container>.navbar-collapse,.container>.navbar-header{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-bottom,.navbar-fixed-top{position:fixed;right:0;left:0;z-index:1030}@media (min-width:768px){.navbar-fixed-bottom,.navbar-fixed-top{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;height:50px;padding:15px 15px;font-size:18px;line-height:20px}.navbar-brand:focus,.navbar-brand:hover{text-decoration:none}.navbar-brand>img{display:block}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;padding:9px 10px;margin-top:8px;margin-right:15px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:7.5px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;-webkit-box-shadow:none;box-shadow:none}.navbar-nav .open .dropdown-menu .dropdown-header,.navbar-nav .open .dropdown-menu>li>a{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:focus,.navbar-nav .open .dropdown-menu>li>a:hover{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}}.navbar-form{padding:10px 15px;margin-top:8px;margin-right:-15px;margin-bottom:8px;margin-left:-15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.1)}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .form-control-static{display:inline-block}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .form-control,.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .checkbox,.navbar-form .radio{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .checkbox label,.navbar-form .radio label{padding-left:0}.navbar-form .checkbox input[type=checkbox],.navbar-form .radio input[type=radio]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}.navbar-form .form-group:last-child{margin-bottom:0}}@media (min-width:768px){.navbar-form{width:auto;padding-top:0;padding-bottom:0;margin-right:0;margin-left:0;border:0;-webkit-box-shadow:none;box-shadow:none}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-left-radius:0;border-top-right-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{margin-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:8px;margin-bottom:8px}.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.navbar-text{margin-top:15px;margin-bottom:15px}@media (min-width:768px){.navbar-text{float:left;margin-right:15px;margin-left:15px}}@media (min-width:768px){.navbar-left{float:left!important}.navbar-right{float:right!important;margin-right:-15px}.navbar-right~.navbar-right{margin-right:0}}.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}.navbar-default .navbar-brand{color:#777}.navbar-default .navbar-brand:focus,.navbar-default .navbar-brand:hover{color:#5e5e5e;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#777}.navbar-default .navbar-nav>li>a:focus,.navbar-default .navbar-nav>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:focus,.navbar-default .navbar-nav>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:focus,.navbar-default .navbar-nav>.disabled>a:hover{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:focus,.navbar-default .navbar-toggle:hover{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:focus,.navbar-default .navbar-nav>.open>a:hover{color:#555;background-color:#e7e7e7}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#777}.navbar-default .navbar-link:hover{color:#333}.navbar-default .btn-link{color:#777}.navbar-default .btn-link:focus,.navbar-default .btn-link:hover{color:#333}.navbar-default .btn-link[disabled]:focus,.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:focus,fieldset[disabled] .navbar-default .btn-link:hover{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#9d9d9d}.navbar-inverse .navbar-brand:focus,.navbar-inverse .navbar-brand:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav>li>a:focus,.navbar-inverse .navbar-nav>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:focus,.navbar-inverse .navbar-nav>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:focus,.navbar-inverse .navbar-nav>.disabled>a:hover{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:focus,.navbar-inverse .navbar-toggle:hover{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:focus,.navbar-inverse .navbar-nav>.open>a:hover{color:#fff;background-color:#080808}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#9d9d9d}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#9d9d9d}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#9d9d9d}.navbar-inverse .btn-link:focus,.navbar-inverse .btn-link:hover{color:#fff}.navbar-inverse .btn-link[disabled]:focus,.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:focus,fieldset[disabled] .navbar-inverse .btn-link:hover{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{padding:0 5px;color:#ccc;content:\"/\\00a0\"}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;margin-left:-1px;line-height:1.42857143;color:#337ab7;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{z-index:2;color:#23527c;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:3;color:#fff;cursor:default;background-color:#337ab7;border-color:#337ab7}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.pager{padding-left:0;margin:20px 0;text-align:center;list-style:none}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:focus,.pager li>a:hover{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:focus,.pager .disabled>a:hover,.pager .disabled>span{color:#777;cursor:not-allowed;background-color:#fff}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:focus,a.label:hover{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:focus,.label-default[href]:hover{background-color:#5e5e5e}.label-primary{background-color:#337ab7}.label-primary[href]:focus,.label-primary[href]:hover{background-color:#286090}.label-success{background-color:#5cb85c}.label-success[href]:focus,.label-success[href]:hover{background-color:#449d44}.label-info{background-color:#5bc0de}.label-info[href]:focus,.label-info[href]:hover{background-color:#31b0d5}.label-warning{background-color:#f0ad4e}.label-warning[href]:focus,.label-warning[href]:hover{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:focus,.label-danger[href]:hover{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:middle;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-group-xs>.btn .badge,.btn-xs .badge{top:0;padding:1px 5px}a.badge:focus,a.badge:hover{color:#fff;text-decoration:none;cursor:pointer}.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#337ab7;background-color:#fff}.list-group-item>.badge{float:right}.list-group-item>.badge+.badge{margin-right:5px}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding-top:30px;padding-bottom:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron .h1,.jumbotron h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron,.container-fluid .jumbotron{padding-right:15px;padding-left:15px;border-radius:6px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron,.container-fluid .jumbotron{padding-right:60px;padding-left:60px}.jumbotron .h1,.jumbotron h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:border .2s ease-in-out;-o-transition:border .2s ease-in-out;transition:border .2s ease-in-out}.thumbnail a>img,.thumbnail>img{margin-right:auto;margin-left:auto}a.thumbnail.active,a.thumbnail:focus,a.thumbnail:hover{border-color:#337ab7}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:700}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@-o-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{height:20px;margin-bottom:20px;overflow:hidden;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,.1);box-shadow:inset 0 1px 2px rgba(0,0,0,.1)}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#337ab7;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-bar-striped,.progress-striped .progress-bar{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);-webkit-background-size:40px 40px;background-size:40px 40px}.progress-bar.active,.progress.active .progress-bar{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-info{background-color:#5bc0de}.progress-striped .progress-bar-info{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-warning{background-color:#f0ad4e}.progress-striped .progress-bar-warning{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.progress-bar-danger{background-color:#d9534f}.progress-striped .progress-bar-danger{background-image:-webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:-o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)}.media{margin-top:15px}.media:first-child{margin-top:0}.media,.media-body{overflow:hidden;zoom:1}.media-body{width:10000px}.media-object{display:block}.media-object.img-thumbnail{max-width:none}.media-right,.media>.pull-right{padding-left:10px}.media-left,.media>.pull-left{padding-right:10px}.media-body,.media-left,.media-right{display:table-cell;vertical-align:top}.media-middle{vertical-align:middle}.media-bottom{vertical-align:bottom}.media-heading{margin-top:0;margin-bottom:5px}.media-list{padding-left:0;list-style:none}.list-group{padding-left:0;margin-bottom:20px}.list-group-item{position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.list-group-item:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.list-group-item:last-child{margin-bottom:0;border-bottom-right-radius:4px;border-bottom-left-radius:4px}a.list-group-item,button.list-group-item{color:#555}a.list-group-item .list-group-item-heading,button.list-group-item .list-group-item-heading{color:#333}a.list-group-item:focus,a.list-group-item:hover,button.list-group-item:focus,button.list-group-item:hover{color:#555;text-decoration:none;background-color:#f5f5f5}button.list-group-item{width:100%;text-align:left}.list-group-item.disabled,.list-group-item.disabled:focus,.list-group-item.disabled:hover{color:#777;cursor:not-allowed;background-color:#eee}.list-group-item.disabled .list-group-item-heading,.list-group-item.disabled:focus .list-group-item-heading,.list-group-item.disabled:hover .list-group-item-heading{color:inherit}.list-group-item.disabled .list-group-item-text,.list-group-item.disabled:focus .list-group-item-text,.list-group-item.disabled:hover .list-group-item-text{color:#777}.list-group-item.active,.list-group-item.active:focus,.list-group-item.active:hover{z-index:2;color:#fff;background-color:#337ab7;border-color:#337ab7}.list-group-item.active .list-group-item-heading,.list-group-item.active .list-group-item-heading>.small,.list-group-item.active .list-group-item-heading>small,.list-group-item.active:focus .list-group-item-heading,.list-group-item.active:focus .list-group-item-heading>.small,.list-group-item.active:focus .list-group-item-heading>small,.list-group-item.active:hover .list-group-item-heading,.list-group-item.active:hover .list-group-item-heading>.small,.list-group-item.active:hover .list-group-item-heading>small{color:inherit}.list-group-item.active .list-group-item-text,.list-group-item.active:focus .list-group-item-text,.list-group-item.active:hover .list-group-item-text{color:#c7ddef}.list-group-item-success{color:#3c763d;background-color:#dff0d8}a.list-group-item-success,button.list-group-item-success{color:#3c763d}a.list-group-item-success .list-group-item-heading,button.list-group-item-success .list-group-item-heading{color:inherit}a.list-group-item-success:focus,a.list-group-item-success:hover,button.list-group-item-success:focus,button.list-group-item-success:hover{color:#3c763d;background-color:#d0e9c6}a.list-group-item-success.active,a.list-group-item-success.active:focus,a.list-group-item-success.active:hover,button.list-group-item-success.active,button.list-group-item-success.active:focus,button.list-group-item-success.active:hover{color:#fff;background-color:#3c763d;border-color:#3c763d}.list-group-item-info{color:#31708f;background-color:#d9edf7}a.list-group-item-info,button.list-group-item-info{color:#31708f}a.list-group-item-info .list-group-item-heading,button.list-group-item-info .list-group-item-heading{color:inherit}a.list-group-item-info:focus,a.list-group-item-info:hover,button.list-group-item-info:focus,button.list-group-item-info:hover{color:#31708f;background-color:#c4e3f3}a.list-group-item-info.active,a.list-group-item-info.active:focus,a.list-group-item-info.active:hover,button.list-group-item-info.active,button.list-group-item-info.active:focus,button.list-group-item-info.active:hover{color:#fff;background-color:#31708f;border-color:#31708f}.list-group-item-warning{color:#8a6d3b;background-color:#fcf8e3}a.list-group-item-warning,button.list-group-item-warning{color:#8a6d3b}a.list-group-item-warning .list-group-item-heading,button.list-group-item-warning .list-group-item-heading{color:inherit}a.list-group-item-warning:focus,a.list-group-item-warning:hover,button.list-group-item-warning:focus,button.list-group-item-warning:hover{color:#8a6d3b;background-color:#faf2cc}a.list-group-item-warning.active,a.list-group-item-warning.active:focus,a.list-group-item-warning.active:hover,button.list-group-item-warning.active,button.list-group-item-warning.active:focus,button.list-group-item-warning.active:hover{color:#fff;background-color:#8a6d3b;border-color:#8a6d3b}.list-group-item-danger{color:#a94442;background-color:#f2dede}a.list-group-item-danger,button.list-group-item-danger{color:#a94442}a.list-group-item-danger .list-group-item-heading,button.list-group-item-danger .list-group-item-heading{color:inherit}a.list-group-item-danger:focus,a.list-group-item-danger:hover,button.list-group-item-danger:focus,button.list-group-item-danger:hover{color:#a94442;background-color:#ebcccc}a.list-group-item-danger.active,a.list-group-item-danger.active:focus,a.list-group-item-danger.active:hover,button.list-group-item-danger.active,button.list-group-item-danger.active:focus,button.list-group-item-danger.active:hover{color:#fff;background-color:#a94442;border-color:#a94442}.list-group-item-heading{margin-top:0;margin-bottom:5px}.list-group-item-text{margin-bottom:0;line-height:1.3}.panel{margin-bottom:20px;background-color:#fff;border:1px solid transparent;border-radius:4px;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05)}.panel-body{padding:15px}.panel-heading{padding:10px 15px;border-bottom:1px solid transparent;border-top-left-radius:3px;border-top-right-radius:3px}.panel-heading>.dropdown .dropdown-toggle{color:inherit}.panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.panel-title>.small,.panel-title>.small>a,.panel-title>a,.panel-title>small,.panel-title>small>a{color:inherit}.panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.list-group,.panel>.panel-collapse>.list-group{margin-bottom:0}.panel>.list-group .list-group-item,.panel>.panel-collapse>.list-group .list-group-item{border-width:1px 0;border-radius:0}.panel>.list-group:first-child .list-group-item:first-child,.panel>.panel-collapse>.list-group:first-child .list-group-item:first-child{border-top:0;border-top-left-radius:3px;border-top-right-radius:3px}.panel>.list-group:last-child .list-group-item:last-child,.panel>.panel-collapse>.list-group:last-child .list-group-item:last-child{border-bottom:0;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.panel-heading+.panel-collapse>.list-group .list-group-item:first-child{border-top-left-radius:0;border-top-right-radius:0}.panel-heading+.list-group .list-group-item:first-child{border-top-width:0}.list-group+.panel-footer{border-top-width:0}.panel>.panel-collapse>.table,.panel>.table,.panel>.table-responsive>.table{margin-bottom:0}.panel>.panel-collapse>.table caption,.panel>.table caption,.panel>.table-responsive>.table caption{padding-right:15px;padding-left:15px}.panel>.table-responsive:first-child>.table:first-child,.panel>.table:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child,.panel>.table:first-child>thead:first-child>tr:first-child{border-top-left-radius:3px;border-top-right-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:first-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:first-child,.panel>.table:first-child>thead:first-child>tr:first-child td:first-child,.panel>.table:first-child>thead:first-child>tr:first-child th:first-child{border-top-left-radius:3px}.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table-responsive:first-child>.table:first-child>thead:first-child>tr:first-child th:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child td:last-child,.panel>.table:first-child>tbody:first-child>tr:first-child th:last-child,.panel>.table:first-child>thead:first-child>tr:first-child td:last-child,.panel>.table:first-child>thead:first-child>tr:first-child th:last-child{border-top-right-radius:3px}.panel>.table-responsive:last-child>.table:last-child,.panel>.table:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child{border-bottom-right-radius:3px;border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:first-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:first-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:first-child{border-bottom-left-radius:3px}.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table-responsive:last-child>.table:last-child>tfoot:last-child>tr:last-child th:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child td:last-child,.panel>.table:last-child>tbody:last-child>tr:last-child th:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child td:last-child,.panel>.table:last-child>tfoot:last-child>tr:last-child th:last-child{border-bottom-right-radius:3px}.panel>.panel-body+.table,.panel>.panel-body+.table-responsive,.panel>.table+.panel-body,.panel>.table-responsive+.panel-body{border-top:1px solid #ddd}.panel>.table>tbody:first-child>tr:first-child td,.panel>.table>tbody:first-child>tr:first-child th{border-top:0}.panel>.table-bordered,.panel>.table-responsive>.table-bordered{border:0}.panel>.table-bordered>tbody>tr>td:first-child,.panel>.table-bordered>tbody>tr>th:first-child,.panel>.table-bordered>tfoot>tr>td:first-child,.panel>.table-bordered>tfoot>tr>th:first-child,.panel>.table-bordered>thead>tr>td:first-child,.panel>.table-bordered>thead>tr>th:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:first-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:first-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:first-child,.panel>.table-responsive>.table-bordered>thead>tr>td:first-child,.panel>.table-responsive>.table-bordered>thead>tr>th:first-child{border-left:0}.panel>.table-bordered>tbody>tr>td:last-child,.panel>.table-bordered>tbody>tr>th:last-child,.panel>.table-bordered>tfoot>tr>td:last-child,.panel>.table-bordered>tfoot>tr>th:last-child,.panel>.table-bordered>thead>tr>td:last-child,.panel>.table-bordered>thead>tr>th:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>td:last-child,.panel>.table-responsive>.table-bordered>tbody>tr>th:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>td:last-child,.panel>.table-responsive>.table-bordered>tfoot>tr>th:last-child,.panel>.table-responsive>.table-bordered>thead>tr>td:last-child,.panel>.table-responsive>.table-bordered>thead>tr>th:last-child{border-right:0}.panel>.table-bordered>tbody>tr:first-child>td,.panel>.table-bordered>tbody>tr:first-child>th,.panel>.table-bordered>thead>tr:first-child>td,.panel>.table-bordered>thead>tr:first-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:first-child>th,.panel>.table-responsive>.table-bordered>thead>tr:first-child>td,.panel>.table-responsive>.table-bordered>thead>tr:first-child>th{border-bottom:0}.panel>.table-bordered>tbody>tr:last-child>td,.panel>.table-bordered>tbody>tr:last-child>th,.panel>.table-bordered>tfoot>tr:last-child>td,.panel>.table-bordered>tfoot>tr:last-child>th,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>td,.panel>.table-responsive>.table-bordered>tbody>tr:last-child>th,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>td,.panel>.table-responsive>.table-bordered>tfoot>tr:last-child>th{border-bottom:0}.panel>.table-responsive{margin-bottom:0;border:0}.panel-group{margin-bottom:20px}.panel-group .panel{margin-bottom:0;border-radius:4px}.panel-group .panel+.panel{margin-top:5px}.panel-group .panel-heading{border-bottom:0}.panel-group .panel-heading+.panel-collapse>.list-group,.panel-group .panel-heading+.panel-collapse>.panel-body{border-top:1px solid #ddd}.panel-group .panel-footer{border-top:0}.panel-group .panel-footer+.panel-collapse .panel-body{border-bottom:1px solid #ddd}.panel-default{border-color:#ddd}.panel-default>.panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd}.panel-default>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ddd}.panel-default>.panel-heading .badge{color:#f5f5f5;background-color:#333}.panel-default>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ddd}.panel-primary{border-color:#337ab7}.panel-primary>.panel-heading{color:#fff;background-color:#337ab7;border-color:#337ab7}.panel-primary>.panel-heading+.panel-collapse>.panel-body{border-top-color:#337ab7}.panel-primary>.panel-heading .badge{color:#337ab7;background-color:#fff}.panel-primary>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#337ab7}.panel-success{border-color:#d6e9c6}.panel-success>.panel-heading{color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6}.panel-success>.panel-heading+.panel-collapse>.panel-body{border-top-color:#d6e9c6}.panel-success>.panel-heading .badge{color:#dff0d8;background-color:#3c763d}.panel-success>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#d6e9c6}.panel-info{border-color:#bce8f1}.panel-info>.panel-heading{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}.panel-info>.panel-heading+.panel-collapse>.panel-body{border-top-color:#bce8f1}.panel-info>.panel-heading .badge{color:#d9edf7;background-color:#31708f}.panel-info>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#bce8f1}.panel-warning{border-color:#faebcc}.panel-warning>.panel-heading{color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc}.panel-warning>.panel-heading+.panel-collapse>.panel-body{border-top-color:#faebcc}.panel-warning>.panel-heading .badge{color:#fcf8e3;background-color:#8a6d3b}.panel-warning>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#faebcc}.panel-danger{border-color:#ebccd1}.panel-danger>.panel-heading{color:#a94442;background-color:#f2dede;border-color:#ebccd1}.panel-danger>.panel-heading+.panel-collapse>.panel-body{border-top-color:#ebccd1}.panel-danger>.panel-heading .badge{color:#f2dede;background-color:#a94442}.panel-danger>.panel-footer+.panel-collapse>.panel-body{border-bottom-color:#ebccd1}.embed-responsive{position:relative;display:block;height:0;padding:0;overflow:hidden}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-16by9{padding-bottom:56.25%}.embed-responsive-4by3{padding-bottom:75%}.well{min-height:20px;padding:19px;margin-bottom:20px;background-color:#f5f5f5;border:1px solid #e3e3e3;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);box-shadow:inset 0 1px 1px rgba(0,0,0,.05)}.well blockquote{border-color:#ddd;border-color:rgba(0,0,0,.15)}.well-lg{padding:24px;border-radius:6px}.well-sm{padding:9px;border-radius:3px}.close{float:right;font-size:21px;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;filter:alpha(opacity=20);opacity:.2}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer;filter:alpha(opacity=50);opacity:.5}button.close{-webkit-appearance:none;padding:0;cursor:pointer;background:0 0;border:0}.modal-open{overflow:hidden}.modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:hidden;-webkit-overflow-scrolling:touch;outline:0}.modal.fade .modal-dialog{-webkit-transition:-webkit-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out;-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);-o-transform:translate(0,-25%);transform:translate(0,-25%)}.modal.in .modal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);-o-transform:translate(0,0);transform:translate(0,0)}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal-dialog{position:relative;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.modal-backdrop.fade{filter:alpha(opacity=0);opacity:0}.modal-backdrop.in{filter:alpha(opacity=50);opacity:.5}.modal-header{padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.42857143}.modal-body{position:relative;padding:15px}.modal-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer .btn+.btn{margin-bottom:0;margin-left:5px}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);box-shadow:0 5px 15px rgba(0,0,0,.5)}.modal-sm{width:300px}}@media (min-width:992px){.modal-lg{width:900px}}.tooltip{position:absolute;z-index:1070;display:block;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:12px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;filter:alpha(opacity=0);opacity:0;line-break:auto}.tooltip.in{filter:alpha(opacity=90);opacity:.9}.tooltip.top{padding:5px 0;margin-top:-3px}.tooltip.right{padding:0 5px;margin-left:3px}.tooltip.bottom{padding:5px 0;margin-top:3px}.tooltip.left{padding:0 5px;margin-left:-3px}.tooltip-inner{max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:4px}.tooltip-arrow{position:absolute;width:0;height:0;border-color:transparent;border-style:solid}.tooltip.top .tooltip-arrow{bottom:0;left:50%;margin-left:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-left .tooltip-arrow{right:5px;bottom:0;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.top-right .tooltip-arrow{bottom:0;left:5px;margin-bottom:-5px;border-width:5px 5px 0;border-top-color:#000}.tooltip.right .tooltip-arrow{top:50%;left:0;margin-top:-5px;border-width:5px 5px 5px 0;border-right-color:#000}.tooltip.left .tooltip-arrow{top:50%;right:0;margin-top:-5px;border-width:5px 0 5px 5px;border-left-color:#000}.tooltip.bottom .tooltip-arrow{top:0;left:50%;margin-left:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-left .tooltip-arrow{top:0;right:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.tooltip.bottom-right .tooltip-arrow{top:0;left:5px;margin-top:-5px;border-width:0 5px 5px;border-bottom-color:#000}.popover{position:absolute;top:0;left:0;z-index:1060;display:none;max-width:276px;padding:1px;font-family:\"Helvetica Neue\",Helvetica,Arial,sans-serif;font-size:14px;font-style:normal;font-weight:400;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,.2);box-shadow:0 5px 10px rgba(0,0,0,.2);line-break:auto}.popover.top{margin-top:-10px}.popover.right{margin-left:10px}.popover.bottom{margin-top:10px}.popover.left{margin-left:-10px}.popover-title{padding:8px 14px;margin:0;font-size:14px;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-radius:5px 5px 0 0}.popover-content{padding:9px 14px}.popover>.arrow,.popover>.arrow:after{position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid}.popover>.arrow{border-width:11px}.popover>.arrow:after{content:\"\";border-width:10px}.popover.top>.arrow{bottom:-11px;left:50%;margin-left:-11px;border-top-color:#999;border-top-color:rgba(0,0,0,.25);border-bottom-width:0}.popover.top>.arrow:after{bottom:1px;margin-left:-10px;content:\" \";border-top-color:#fff;border-bottom-width:0}.popover.right>.arrow{top:50%;left:-11px;margin-top:-11px;border-right-color:#999;border-right-color:rgba(0,0,0,.25);border-left-width:0}.popover.right>.arrow:after{bottom:-10px;left:1px;content:\" \";border-right-color:#fff;border-left-width:0}.popover.bottom>.arrow{top:-11px;left:50%;margin-left:-11px;border-top-width:0;border-bottom-color:#999;border-bottom-color:rgba(0,0,0,.25)}.popover.bottom>.arrow:after{top:1px;margin-left:-10px;content:\" \";border-top-width:0;border-bottom-color:#fff}.popover.left>.arrow{top:50%;right:-11px;margin-top:-11px;border-right-width:0;border-left-color:#999;border-left-color:rgba(0,0,0,.25)}.popover.left>.arrow:after{right:1px;bottom:-10px;content:\" \";border-right-width:0;border-left-color:#fff}.carousel{position:relative}.carousel-inner{position:relative;width:100%;overflow:hidden}.carousel-inner>.item{position:relative;display:none;-webkit-transition:.6s ease-in-out left;-o-transition:.6s ease-in-out left;transition:.6s ease-in-out left}.carousel-inner>.item>a>img,.carousel-inner>.item>img{line-height:1}@media all and (transform-3d),(-webkit-transform-3d){.carousel-inner>.item{-webkit-transition:-webkit-transform .6s ease-in-out;-o-transition:-o-transform .6s ease-in-out;transition:transform .6s ease-in-out;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-perspective:1000px;perspective:1000px}.carousel-inner>.item.active.right,.carousel-inner>.item.next{left:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.carousel-inner>.item.active.left,.carousel-inner>.item.prev{left:0;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.carousel-inner>.item.active,.carousel-inner>.item.next.left,.carousel-inner>.item.prev.right{left:0;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.carousel-inner>.active,.carousel-inner>.next,.carousel-inner>.prev{display:block}.carousel-inner>.active{left:0}.carousel-inner>.next,.carousel-inner>.prev{position:absolute;top:0;width:100%}.carousel-inner>.next{left:100%}.carousel-inner>.prev{left:-100%}.carousel-inner>.next.left,.carousel-inner>.prev.right{left:0}.carousel-inner>.active.left{left:-100%}.carousel-inner>.active.right{left:100%}.carousel-control{position:absolute;top:0;bottom:0;left:0;width:15%;font-size:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6);background-color:rgba(0,0,0,0);filter:alpha(opacity=50);opacity:.5}.carousel-control.left{background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,.0001)));background-image:linear-gradient(to right,rgba(0,0,0,.5) 0,rgba(0,0,0,.0001) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#80000000\', endColorstr=\'#00000000\', GradientType=1);background-repeat:repeat-x}.carousel-control.right{right:0;left:auto;background-image:-webkit-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-o-linear-gradient(left,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.0001)),to(rgba(0,0,0,.5)));background-image:linear-gradient(to right,rgba(0,0,0,.0001) 0,rgba(0,0,0,.5) 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#00000000\', endColorstr=\'#80000000\', GradientType=1);background-repeat:repeat-x}.carousel-control:focus,.carousel-control:hover{color:#fff;text-decoration:none;filter:alpha(opacity=90);outline:0;opacity:.9}.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{position:absolute;top:50%;z-index:5;display:inline-block;margin-top:-10px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{left:50%;margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{right:50%;margin-right:-10px}.carousel-control .icon-next,.carousel-control .icon-prev{width:20px;height:20px;font-family:serif;line-height:1}.carousel-control .icon-prev:before{content:\'\\2039\'}.carousel-control .icon-next:before{content:\'\\203a\'}.carousel-indicators{position:absolute;bottom:10px;left:50%;z-index:15;width:60%;padding-left:0;margin-left:-30%;text-align:center;list-style:none}.carousel-indicators li{display:inline-block;width:10px;height:10px;margin:1px;text-indent:-999px;cursor:pointer;background-color:#000\\9;background-color:rgba(0,0,0,0);border:1px solid #fff;border-radius:10px}.carousel-indicators .active{width:12px;height:12px;margin:0;background-color:#fff}.carousel-caption{position:absolute;right:15%;bottom:20px;left:15%;z-index:10;padding-top:20px;padding-bottom:20px;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.6)}.carousel-caption .btn{text-shadow:none}@media screen and (min-width:768px){.carousel-control .glyphicon-chevron-left,.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next,.carousel-control .icon-prev{width:30px;height:30px;margin-top:-10px;font-size:30px}.carousel-control .glyphicon-chevron-left,.carousel-control .icon-prev{margin-left:-10px}.carousel-control .glyphicon-chevron-right,.carousel-control .icon-next{margin-right:-10px}.carousel-caption{right:20%;left:20%;padding-bottom:30px}.carousel-indicators{bottom:20px}}.btn-group-vertical>.btn-group:after,.btn-group-vertical>.btn-group:before,.btn-toolbar:after,.btn-toolbar:before,.clearfix:after,.clearfix:before,.container-fluid:after,.container-fluid:before,.container:after,.container:before,.dl-horizontal dd:after,.dl-horizontal dd:before,.form-horizontal .form-group:after,.form-horizontal .form-group:before,.modal-footer:after,.modal-footer:before,.modal-header:after,.modal-header:before,.nav:after,.nav:before,.navbar-collapse:after,.navbar-collapse:before,.navbar-header:after,.navbar-header:before,.navbar:after,.navbar:before,.pager:after,.pager:before,.panel-body:after,.panel-body:before,.row:after,.row:before{display:table;content:\" \"}.btn-group-vertical>.btn-group:after,.btn-toolbar:after,.clearfix:after,.container-fluid:after,.container:after,.dl-horizontal dd:after,.form-horizontal .form-group:after,.modal-footer:after,.modal-header:after,.nav:after,.navbar-collapse:after,.navbar-header:after,.navbar:after,.pager:after,.panel-body:after,.row:after{clear:both}.center-block{display:block;margin-right:auto;margin-left:auto}.pull-right{float:right!important}.pull-left{float:left!important}.hide{display:none!important}.show{display:block!important}.invisible{visibility:hidden}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.hidden{display:none!important}.affix{position:fixed}@-ms-viewport{width:device-width}.visible-lg,.visible-md,.visible-sm,.visible-xs{display:none!important}.visible-lg-block,.visible-lg-inline,.visible-lg-inline-block,.visible-md-block,.visible-md-inline,.visible-md-inline-block,.visible-sm-block,.visible-sm-inline,.visible-sm-inline-block,.visible-xs-block,.visible-xs-inline,.visible-xs-inline-block{display:none!important}@media (max-width:767px){.visible-xs{display:block!important}table.visible-xs{display:table!important}tr.visible-xs{display:table-row!important}td.visible-xs,th.visible-xs{display:table-cell!important}}@media (max-width:767px){.visible-xs-block{display:block!important}}@media (max-width:767px){.visible-xs-inline{display:inline!important}}@media (max-width:767px){.visible-xs-inline-block{display:inline-block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm{display:block!important}table.visible-sm{display:table!important}tr.visible-sm{display:table-row!important}td.visible-sm,th.visible-sm{display:table-cell!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-block{display:block!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline{display:inline!important}}@media (min-width:768px) and (max-width:991px){.visible-sm-inline-block{display:inline-block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md{display:block!important}table.visible-md{display:table!important}tr.visible-md{display:table-row!important}td.visible-md,th.visible-md{display:table-cell!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-block{display:block!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline{display:inline!important}}@media (min-width:992px) and (max-width:1199px){.visible-md-inline-block{display:inline-block!important}}@media (min-width:1200px){.visible-lg{display:block!important}table.visible-lg{display:table!important}tr.visible-lg{display:table-row!important}td.visible-lg,th.visible-lg{display:table-cell!important}}@media (min-width:1200px){.visible-lg-block{display:block!important}}@media (min-width:1200px){.visible-lg-inline{display:inline!important}}@media (min-width:1200px){.visible-lg-inline-block{display:inline-block!important}}@media (max-width:767px){.hidden-xs{display:none!important}}@media (min-width:768px) and (max-width:991px){.hidden-sm{display:none!important}}@media (min-width:992px) and (max-width:1199px){.hidden-md{display:none!important}}@media (min-width:1200px){.hidden-lg{display:none!important}}.visible-print{display:none!important}@media print{.visible-print{display:block!important}table.visible-print{display:table!important}tr.visible-print{display:table-row!important}td.visible-print,th.visible-print{display:table-cell!important}}.visible-print-block{display:none!important}@media print{.visible-print-block{display:block!important}}.visible-print-inline{display:none!important}@media print{.visible-print-inline{display:inline!important}}.visible-print-inline-block{display:none!important}@media print{.visible-print-inline-block{display:inline-block!important}}@media print{.hidden-print{display:none!important}}\n/*# sourceMappingURL=bootstrap.min.css.map *//*! =======================================================\n                      VERSION  9.7.1              \n========================================================= */\n/*! =========================================================\n * bootstrap-slider.js\n *\n * Maintainers:\n *\t\tKyle Kemp\n *\t\t\t- Twitter: @seiyria\n *\t\t\t- Github:  seiyria\n *\t\tRohit Kalkur\n *\t\t\t- Twitter: @Rovolutionary\n *\t\t\t- Github:  rovolution\n *\n * =========================================================\n  *\n * bootstrap-slider is released under the MIT License\n * Copyright (c) 2017 Kyle Kemp, Rohit Kalkur, and contributors\n * \n * Permission is hereby granted, free of charge, to any person\n * obtaining a copy of this software and associated documentation\n * files (the \"Software\"), to deal in the Software without\n * restriction, including without limitation the rights to use,\n * copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the\n * Software is furnished to do so, subject to the following\n * conditions:\n * \n * The above copyright notice and this permission notice shall be\n * included in all copies or substantial portions of the Software.\n * \n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\n * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES\n * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\n * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT\n * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\n * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR\n * OTHER DEALINGS IN THE SOFTWARE.\n *\n * ========================================================= */.slider{display:inline-block;vertical-align:middle;position:relative}.slider.slider-horizontal{width:210px;height:20px}.slider.slider-horizontal .slider-track{height:10px;width:100%;margin-top:-5px;top:50%;left:0}.slider.slider-horizontal .slider-selection,.slider.slider-horizontal .slider-track-low,.slider.slider-horizontal .slider-track-high{height:100%;top:0;bottom:0}.slider.slider-horizontal .slider-tick,.slider.slider-horizontal .slider-handle{margin-left:-10px}.slider.slider-horizontal .slider-tick.triangle,.slider.slider-horizontal .slider-handle.triangle{position:relative;top:50%;transform:translateY(-50%);border-width:0 10px 10px 10px;width:0;height:0;border-bottom-color:#0480be;margin-top:0}.slider.slider-horizontal .slider-tick-container{white-space:nowrap;position:absolute;top:0;left:0;width:100%}.slider.slider-horizontal .slider-tick-label-container{white-space:nowrap;margin-top:20px}.slider.slider-horizontal .slider-tick-label-container .slider-tick-label{padding-top:4px;display:inline-block;text-align:center}.slider.slider-horizontal.slider-rtl .slider-track{left:initial;right:0}.slider.slider-horizontal.slider-rtl .slider-tick,.slider.slider-horizontal.slider-rtl .slider-handle{margin-left:initial;margin-right:-10px}.slider.slider-horizontal.slider-rtl .slider-tick-container{left:initial;right:0}.slider.slider-vertical{height:210px;width:20px}.slider.slider-vertical .slider-track{width:10px;height:100%;left:25%;top:0}.slider.slider-vertical .slider-selection{width:100%;left:0;top:0;bottom:0}.slider.slider-vertical .slider-track-low,.slider.slider-vertical .slider-track-high{width:100%;left:0;right:0}.slider.slider-vertical .slider-tick,.slider.slider-vertical .slider-handle{margin-top:-10px}.slider.slider-vertical .slider-tick.triangle,.slider.slider-vertical .slider-handle.triangle{border-width:10px 0 10px 10px;width:1px;height:1px;border-left-color:#0480be;border-right-color:#0480be;margin-left:0;margin-right:0}.slider.slider-vertical .slider-tick-label-container{white-space:nowrap}.slider.slider-vertical .slider-tick-label-container .slider-tick-label{padding-left:4px}.slider.slider-vertical.slider-rtl .slider-track{left:initial;right:25%}.slider.slider-vertical.slider-rtl .slider-selection{left:initial;right:0}.slider.slider-vertical.slider-rtl .slider-tick.triangle,.slider.slider-vertical.slider-rtl .slider-handle.triangle{border-width:10px 10px 10px 0}.slider.slider-vertical.slider-rtl .slider-tick-label-container .slider-tick-label{padding-left:initial;padding-right:4px}.slider.slider-disabled .slider-handle{background-image:-webkit-linear-gradient(top,#dfdfdf 0,#bebebe 100%);background-image:-o-linear-gradient(top,#dfdfdf 0,#bebebe 100%);background-image:linear-gradient(to bottom,#dfdfdf 0,#bebebe 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffdfdfdf\',endColorstr=\'#ffbebebe\',GradientType=0)}.slider.slider-disabled .slider-track{background-image:-webkit-linear-gradient(top,#e5e5e5 0,#e9e9e9 100%);background-image:-o-linear-gradient(top,#e5e5e5 0,#e9e9e9 100%);background-image:linear-gradient(to bottom,#e5e5e5 0,#e9e9e9 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffe5e5e5\',endColorstr=\'#ffe9e9e9\',GradientType=0);cursor:not-allowed}.slider input{display:none}.slider .tooltip.top{margin-top:-36px}.slider .tooltip-inner{white-space:nowrap;max-width:none}.slider .hide{display:none}.slider-track{position:absolute;cursor:pointer;background-image:-webkit-linear-gradient(top,#f5f5f5 0,#f9f9f9 100%);background-image:-o-linear-gradient(top,#f5f5f5 0,#f9f9f9 100%);background-image:linear-gradient(to bottom,#f5f5f5 0,#f9f9f9 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#fff5f5f5\',endColorstr=\'#fff9f9f9\',GradientType=0);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);border-radius:4px}.slider-selection{position:absolute;background-image:-webkit-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:-o-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:linear-gradient(to bottom,#f9f9f9 0,#f5f5f5 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#fff9f9f9\',endColorstr=\'#fff5f5f5\',GradientType=0);-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-radius:4px}.slider-selection.tick-slider-selection{background-image:-webkit-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:-o-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:linear-gradient(to bottom,#89cdef 0,#81bfde 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ff89cdef\',endColorstr=\'#ff81bfde\',GradientType=0)}.slider-track-low,.slider-track-high{position:absolute;background:transparent;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;border-radius:4px}.slider-handle{position:absolute;top:0;width:20px;height:20px;background-color:#337ab7;background-image:-webkit-linear-gradient(top,#149bdf 0,#0480be 100%);background-image:-o-linear-gradient(top,#149bdf 0,#0480be 100%);background-image:linear-gradient(to bottom,#149bdf 0,#0480be 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ff149bdf\',endColorstr=\'#ff0480be\',GradientType=0);filter:none;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);border:0 solid transparent}.slider-handle.round{border-radius:50%}.slider-handle.triangle{background:transparent none}.slider-handle.custom{background:transparent none}.slider-handle.custom::before{line-height:20px;font-size:20px;content:\'\\2605\';color:#726204}.slider-tick{position:absolute;width:20px;height:20px;background-image:-webkit-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:-o-linear-gradient(top,#f9f9f9 0,#f5f5f5 100%);background-image:linear-gradient(to bottom,#f9f9f9 0,#f5f5f5 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#fff9f9f9\',endColorstr=\'#fff5f5f5\',GradientType=0);-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;filter:none;opacity:.8;border:0 solid transparent}.slider-tick.round{border-radius:50%}.slider-tick.triangle{background:transparent none}.slider-tick.custom{background:transparent none}.slider-tick.custom::before{line-height:20px;font-size:20px;content:\'\\2605\';color:#726204}.slider-tick.in-selection{background-image:-webkit-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:-o-linear-gradient(top,#89cdef 0,#81bfde 100%);background-image:linear-gradient(to bottom,#89cdef 0,#81bfde 100%);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ff89cdef\',endColorstr=\'#ff81bfde\',GradientType=0);opacity:1}.Folio {\r\n  font-family: Consolas, monospace;\r\n  -webkit-box-shadow: 0 2px 5px rgba(0,0,0,0.15);\r\n  box-shadow: 0 2px 5px rgba(0,0,0,0.15);\r\n  border-radius: 3px;\r\n  background-color: #f4f4f4;\r\n  -webkit-transition: all ease-in-out 0.5s;\r\n  -moz-transition: all ease-in-out 0.5s;\r\n  -o-transition: all ease-in-out 0.5s;\r\n  -ms-transition: all ease-in-out 0.5s;\r\n  transition: all ease-in-out 0.5s;\r\n  padding: 5px;\r\n  border: solid 1px #ccc;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n.FolioPage {\r\n  padding: 5px;\r\n  cursor: pointer;\r\n  font-size: 16px;\r\n  position: relative;\r\n  top: -2px;\r\n}\r\n.FolioPage:hover {\r\n  font-weight: 600;\r\n}\r\n.FolioPage.Active {\r\n  font-weight: 600;\r\n}\r\n.FolioControl {\r\n  padding: 5px;\r\n  cursor: pointer;\r\n  color: #555;\r\n}\r\n.FolioControl:hover {\r\n  color: #222;\r\n}\r\n.FolioControl.Disabled {\r\n  padding: 5px;\r\n  cursor: default;\r\n  color: #888;\r\n}\r\n\r\n.cosmatt-unitLabelControl{width:100%;height:100%;display:inline-block}.cosmatt-unitLabelControl .unitInputLabel{display:inline;padding:5px}.cosmatt-unitLabelControl .unitLabel{display:inline;padding:5px;color:#cb3434}.spinner.input-group .input-group-addon .spin-down,.spinner.input-group .input-group-addon .spin-up{height:10px;width:10px;overflow:hidden;display:block;text-align:center;color:#999}.spinner.input-group .input-group-addon .spin-down:hover,.spinner.input-group .input-group-addon .spin-up:hover{color:#555}.spinner.input-group .input-group-addon .spin-down .fa,.spinner.input-group .input-group-addon .spin-up .fa{margin-top:-8px;vertical-align:middle}.spinner.input-group .input-group-addon .spin-down .glyphicon,.spinner.input-group .input-group-addon .spin-up .glyphicon{font-size:10px;top:-2px}.spinner.input-group .input-group-addon a.spin-down,.spinner.input-group .input-group-addon a.spin-up{text-decoration:none}.spinner.input-group .input-group-addon button.spin-down,.spinner.input-group .input-group-addon button.spin-up{background:0 0;border:none;padding:0}.spinner.input-group.input-group-sm .input-group-addon .spin-down,.spinner.input-group.input-group-sm .input-group-addon .spin-up{height:8px}.spinner.input-group.input-group-sm .input-group-addon .spin-down .fa,.spinner.input-group.input-group-sm .input-group-addon .spin-up .fa{margin-top:-12px}.spinner.input-group.input-group-sm .input-group-addon .spin-down .glyphicon,.spinner.input-group.input-group-sm .input-group-addon .spin-up .glyphicon{font-size:8px;top:-5px}.spinner.input-group.input-group-lg .input-group-addon .spin-down,.spinner.input-group.input-group-lg .input-group-addon .spin-up{height:12px;width:12px}.spinner.input-group.input-group-lg .input-group-addon .spin-down .fa,.spinner.input-group.input-group-lg .input-group-addon .spin-up .fa{margin-top:-16px}.spinner.input-group.input-group-lg .input-group-addon .spin-down .glyphicon,.spinner.input-group.input-group-lg .input-group-addon .spin-up .glyphicon{font-size:12px;top:-6px}.cosmatt-unitComboBox{width:100%;height:100%;display:inline-flex}.cosmatt-unitComboBox .form-control{display:block;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-border-radius:4px}.cosmatt-unitComboBox .unitComboBox,.cosmatt-unitComboBox .unitTextBox{display:inline-block;max-width:135px}.cosmatt-unitComboBox .unitComboBox{margin-left:10px}.cosmatt-unitComboBox .form-control[disabled],.cosmatt-unitComboBox .form-control[readonly]{background-color:#eee;opacity:1}.cosmatt-unitComboBox .input-group-addon{height:28px;padding:0 4px 4px}.cosmatt-unitComboBox .unitTextBox .defaultTextBox.input-group input.input-control,.cosmatt-unitComboBox .unitTextBox .spinner.input-group input.input-control{height:28px;min-width:56px;border-radius:4px!important;padding:4px 10px}.cosmatt-unitComboBox .unitTextBox .defaultTextBox.input-group input.spin-control,.cosmatt-unitComboBox .unitTextBox .spinner.input-group input.spin-control{height:28px;min-width:56px;border-top-left-radius:4px!important;border-bottom-left-radius:4px!important;padding:4px 10px}.cosmatt-unitComboBox .btn-secondary{padding-top:3px;padding-bottom:3px}.cosmatt-unitComboBox .btn-group>.btn:first-child{max-width:135px;text-align:left;width:100%;color:#cb3434;min-width:56px;border-top-left-radius:4px!important;border-bottom-left-radius:4px!important;font-size:14px;padding:3px 10px}.cosmatt-unitComboBox .dropdown-item{padding-left:10px;font-size:14px!important}.cosmatt-unitComboBox .disabledContent{cursor:not-allowed;background-color:#eee;opacity:1}.cosmatt-unitComboBox .btn+.dropdown-toggle-split{background-color:#eceeef}.cosmatt-unitComboBox .defaultTextBox.input-group .input-group-addon .spin-up,.cosmatt-unitComboBox .spinner.input-group .input-group-addon .spin-up,.defaultTextBox.input-group .input-group-addon .spin-down,.spinner.input-group .input-group-addon .spin-down{font-size:14px}.cosmatt-unitComboBox .defaultTextBox.input-group .input-group-addon .spin-up .fa,.cosmatt-unitComboBox .spinner.input-group .input-group-addon .spin-up .fa,.defaultTextBox.input-group .input-group-addon .spin-down .fa,.spinner.input-group .input-group-addon .spin-down .fa{margin-top:0;vertical-align:initial}.cosmatt-unitComboBox .btn-group{display:inline-flex!important;width:100%;height:28px}.cosmatt-unitComboBox .btn-group>.btn+.dropdown-toggle{background-color:#eceeef;padding-left:4px;padding-right:4px;padding-top:3px;border-top-right-radius:4px!important;border-bottom-right-radius:4px!important}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-top-left-radius:0!important;border-bottom-left-radius:0!important}.cosmatt-unitComboBox .btn-group>.btn:first-child:hover{background-color:#fff!important}.dropdown-menu>li>a:focus,.dropdown-menu>li>a:hover{color:#262626!important;text-decoration:none;background-color:#f5f5f5!important}.cosmatt-unitComboBox .caret{color:#93918F!important}/*\n== malihu jquery custom scrollbar plugin ==\nPlugin URI: http://manos.malihu.gr/jquery-custom-content-scroller\n*/\n\n\n\n/*\nCONTENTS: \n\t1. BASIC STYLE - Plugin\'s basic/essential CSS properties (normally, should not be edited). \n\t2. VERTICAL SCROLLBAR - Positioning and dimensions of vertical scrollbar. \n\t3. HORIZONTAL SCROLLBAR - Positioning and dimensions of horizontal scrollbar.\n\t4. VERTICAL AND HORIZONTAL SCROLLBARS - Positioning and dimensions of 2-axis scrollbars. \n\t5. TRANSITIONS - CSS3 transitions for hover events, auto-expanded and auto-hidden scrollbars. \n\t6. SCROLLBAR COLORS, OPACITY AND BACKGROUNDS \n\t\t6.1 THEMES - Scrollbar colors, opacity, dimensions, backgrounds etc. via ready-to-use themes.\n*/\n\n\n\n/* \n------------------------------------------------------------------------------------------------------------------------\n1. BASIC STYLE  \n------------------------------------------------------------------------------------------------------------------------\n*/\n\n\t.mCustomScrollbar{ -ms-touch-action: pinch-zoom; touch-action: pinch-zoom; /* direct pointer events to js */ }\n\t.mCustomScrollbar.mCS_no_scrollbar, .mCustomScrollbar.mCS_touch_action{ -ms-touch-action: auto; touch-action: auto; }\n\t\n\t.mCustomScrollBox{ /* contains plugin\'s markup */\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t\theight: 100%;\n\t\tmax-width: 100%;\n\t\toutline: none;\n\t\tdirection: ltr;\n\t}\n\n\t.mCSB_container{ /* contains the original content */\n\t\toverflow: hidden;\n\t\twidth: auto;\n\t\theight: auto;\n\t}\n\n\n\n/* \n------------------------------------------------------------------------------------------------------------------------\n2. VERTICAL SCROLLBAR \ny-axis\n------------------------------------------------------------------------------------------------------------------------\n*/\n\n\t.mCSB_inside > .mCSB_container{ margin-right: 30px; }\n\n\t.mCSB_container.mCS_no_scrollbar_y.mCS_y_hidden{ margin-right: 0; } /* non-visible scrollbar */\n\t\n\t.mCS-dir-rtl > .mCSB_inside > .mCSB_container{ /* RTL direction/left-side scrollbar */\n\t\tmargin-right: 0;\n\t\tmargin-left: 30px;\n\t}\n\t\n\t.mCS-dir-rtl > .mCSB_inside > .mCSB_container.mCS_no_scrollbar_y.mCS_y_hidden{ margin-left: 0; } /* RTL direction/left-side scrollbar */\n\n\t.mCSB_scrollTools{ /* contains scrollbar markup (draggable element, dragger rail, buttons etc.) */\n\t\tposition: absolute;\n\t\twidth: 16px;\n\t\theight: auto;\n\t\tleft: auto;\n\t\ttop: 0;\n\t\tright: 0;\n\t\tbottom: 0;\n\t}\n\n\t.mCSB_outside + .mCSB_scrollTools{ right: -26px; } /* scrollbar position: outside */\n\t\n\t.mCS-dir-rtl > .mCSB_inside > .mCSB_scrollTools, \n\t.mCS-dir-rtl > .mCSB_outside + .mCSB_scrollTools{ /* RTL direction/left-side scrollbar */\n\t\tright: auto;\n\t\tleft: 0;\n\t}\n\t\n\t.mCS-dir-rtl > .mCSB_outside + .mCSB_scrollTools{ left: -26px; } /* RTL direction/left-side scrollbar (scrollbar position: outside) */\n\n\t.mCSB_scrollTools .mCSB_draggerContainer{ /* contains the draggable element and dragger rail markup */\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tbottom: 0;\n\t\tright: 0; \n\t\theight: auto;\n\t}\n\n\t.mCSB_scrollTools a + .mCSB_draggerContainer{ margin: 20px 0; }\n\n\t.mCSB_scrollTools .mCSB_draggerRail{\n\t\twidth: 2px;\n\t\theight: 100%;\n\t\tmargin: 0 auto;\n\t\t-webkit-border-radius: 16px; -moz-border-radius: 16px; border-radius: 16px;\n\t}\n\n\t.mCSB_scrollTools .mCSB_dragger{ /* the draggable element */\n\t\tcursor: pointer;\n\t\twidth: 100%;\n\t\theight: 30px; /* minimum dragger height */\n\t\tz-index: 1;\n\t}\n\n\t.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ /* the dragger element */\n\t\tposition: relative;\n\t\twidth: 4px;\n\t\theight: 100%;\n\t\tmargin: 0 auto;\n\t\t-webkit-border-radius: 16px; -moz-border-radius: 16px; border-radius: 16px;\n\t\ttext-align: center;\n\t}\n\t\n\t.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded .mCSB_dragger_bar, \n\t.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_dragger .mCSB_dragger_bar{ width: 12px; /* auto-expanded scrollbar */ }\n\t\n\t.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail{ width: 8px; /* auto-expanded scrollbar */ }\n\n\t.mCSB_scrollTools .mCSB_buttonUp,\n\t.mCSB_scrollTools .mCSB_buttonDown{\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\theight: 20px;\n\t\twidth: 100%;\n\t\toverflow: hidden;\n\t\tmargin: 0 auto;\n\t\tcursor: pointer;\n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonDown{ bottom: 0; }\n\n\n\n/* \n------------------------------------------------------------------------------------------------------------------------\n3. HORIZONTAL SCROLLBAR \nx-axis\n------------------------------------------------------------------------------------------------------------------------\n*/\n\n\t.mCSB_horizontal.mCSB_inside > .mCSB_container{\n\t\tmargin-right: 0;\n\t\tmargin-bottom: 30px;\n\t}\n\t\n\t.mCSB_horizontal.mCSB_outside > .mCSB_container{ min-height: 100%; }\n\n\t.mCSB_horizontal > .mCSB_container.mCS_no_scrollbar_x.mCS_x_hidden{ margin-bottom: 0; } /* non-visible scrollbar */\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal{\n\t\twidth: auto;\n\t\theight: 16px;\n\t\ttop: auto;\n\t\tright: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t}\n\n\t.mCustomScrollBox + .mCSB_scrollTools.mCSB_scrollTools_horizontal,\n\t.mCustomScrollBox + .mCSB_scrollTools + .mCSB_scrollTools.mCSB_scrollTools_horizontal{ bottom: -26px; } /* scrollbar position: outside */\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal a + .mCSB_draggerContainer{ margin: 0 20px; }\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\twidth: 100%;\n\t\theight: 2px;\n\t\tmargin: 7px 0;\n\t}\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_dragger{\n\t\twidth: 30px; /* minimum dragger width */\n\t\theight: 100%;\n\t\tleft: 0;\n\t}\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 100%;\n\t\theight: 4px;\n\t\tmargin: 6px auto;\n\t}\n\t\n\t.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded .mCSB_dragger_bar, \n\t.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_dragger .mCSB_dragger_bar{\n\t\theight: 12px; /* auto-expanded scrollbar */\n\t\tmargin: 2px auto;\n\t}\n\t\n\t.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail{\n\t\theight: 8px; /* auto-expanded scrollbar */\n\t\tmargin: 4px 0;\n\t}\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonLeft,\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonRight{\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\twidth: 20px;\n\t\theight: 100%;\n\t\toverflow: hidden;\n\t\tmargin: 0 auto;\n\t\tcursor: pointer;\n\t}\n\t\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonLeft{ left: 0; }\n\n\t.mCSB_scrollTools.mCSB_scrollTools_horizontal .mCSB_buttonRight{ right: 0; }\n\n\n\n/* \n------------------------------------------------------------------------------------------------------------------------\n4. VERTICAL AND HORIZONTAL SCROLLBARS \nyx-axis \n------------------------------------------------------------------------------------------------------------------------\n*/\n\n\t.mCSB_container_wrapper{\n\t\tposition: absolute;\n\t\theight: auto;\n\t\twidth: auto;\n\t\toverflow: hidden;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t\tbottom: 0;\n\t\tmargin-right: 30px;\n\t\tmargin-bottom: 30px;\n\t}\n\t\n\t.mCSB_container_wrapper > .mCSB_container{\n\t\tpadding-right: 30px;\n\t\tpadding-bottom: 30px;\n\t\t-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;\n\t}\n\t\n\t.mCSB_vertical_horizontal > .mCSB_scrollTools.mCSB_scrollTools_vertical{ bottom: 20px; }\n\t\n\t.mCSB_vertical_horizontal > .mCSB_scrollTools.mCSB_scrollTools_horizontal{ right: 20px; }\n\t\n\t/* non-visible horizontal scrollbar */\n\t.mCSB_container_wrapper.mCS_no_scrollbar_x.mCS_x_hidden + .mCSB_scrollTools.mCSB_scrollTools_vertical{ bottom: 0; }\n\t\n\t/* non-visible vertical scrollbar/RTL direction/left-side scrollbar */\n\t.mCSB_container_wrapper.mCS_no_scrollbar_y.mCS_y_hidden + .mCSB_scrollTools ~ .mCSB_scrollTools.mCSB_scrollTools_horizontal, \n\t.mCS-dir-rtl > .mCustomScrollBox.mCSB_vertical_horizontal.mCSB_inside > .mCSB_scrollTools.mCSB_scrollTools_horizontal{ right: 0; }\n\t\n\t/* RTL direction/left-side scrollbar */\n\t.mCS-dir-rtl > .mCustomScrollBox.mCSB_vertical_horizontal.mCSB_inside > .mCSB_scrollTools.mCSB_scrollTools_horizontal{ left: 20px; }\n\t\n\t/* non-visible scrollbar/RTL direction/left-side scrollbar */\n\t.mCS-dir-rtl > .mCustomScrollBox.mCSB_vertical_horizontal.mCSB_inside > .mCSB_container_wrapper.mCS_no_scrollbar_y.mCS_y_hidden + .mCSB_scrollTools ~ .mCSB_scrollTools.mCSB_scrollTools_horizontal{ left: 0; }\n\t\n\t.mCS-dir-rtl > .mCSB_inside > .mCSB_container_wrapper{ /* RTL direction/left-side scrollbar */\n\t\tmargin-right: 0;\n\t\tmargin-left: 30px;\n\t}\n\t\n\t.mCSB_container_wrapper.mCS_no_scrollbar_y.mCS_y_hidden > .mCSB_container{ padding-right: 0; }\n\t\n\t.mCSB_container_wrapper.mCS_no_scrollbar_x.mCS_x_hidden > .mCSB_container{ padding-bottom: 0; }\n\t\n\t.mCustomScrollBox.mCSB_vertical_horizontal.mCSB_inside > .mCSB_container_wrapper.mCS_no_scrollbar_y.mCS_y_hidden{\n\t\tmargin-right: 0; /* non-visible scrollbar */\n\t\tmargin-left: 0;\n\t}\n\t\n\t/* non-visible horizontal scrollbar */\n\t.mCustomScrollBox.mCSB_vertical_horizontal.mCSB_inside > .mCSB_container_wrapper.mCS_no_scrollbar_x.mCS_x_hidden{ margin-bottom: 0; }\n\n\n\n/* \n------------------------------------------------------------------------------------------------------------------------\n5. TRANSITIONS  \n------------------------------------------------------------------------------------------------------------------------\n*/\n\n\t.mCSB_scrollTools, \n\t.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCSB_scrollTools .mCSB_buttonUp,\n\t.mCSB_scrollTools .mCSB_buttonDown,\n\t.mCSB_scrollTools .mCSB_buttonLeft,\n\t.mCSB_scrollTools .mCSB_buttonRight{\n\t\t-webkit-transition: opacity .2s ease-in-out, background-color .2s ease-in-out;\n\t\t-moz-transition: opacity .2s ease-in-out, background-color .2s ease-in-out;\n\t\t-o-transition: opacity .2s ease-in-out, background-color .2s ease-in-out;\n\t\ttransition: opacity .2s ease-in-out, background-color .2s ease-in-out;\n\t}\n\t\n\t.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger_bar, /* auto-expanded scrollbar */\n\t.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerRail, \n\t.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger_bar, \n\t.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerRail{\n\t\t-webkit-transition: width .2s ease-out .2s, height .2s ease-out .2s, \n\t\t\t\t\tmargin-left .2s ease-out .2s, margin-right .2s ease-out .2s, \n\t\t\t\t\tmargin-top .2s ease-out .2s, margin-bottom .2s ease-out .2s,\n\t\t\t\t\topacity .2s ease-in-out, background-color .2s ease-in-out; \n\t\t-moz-transition: width .2s ease-out .2s, height .2s ease-out .2s, \n\t\t\t\t\tmargin-left .2s ease-out .2s, margin-right .2s ease-out .2s, \n\t\t\t\t\tmargin-top .2s ease-out .2s, margin-bottom .2s ease-out .2s,\n\t\t\t\t\topacity .2s ease-in-out, background-color .2s ease-in-out; \n\t\t-o-transition: width .2s ease-out .2s, height .2s ease-out .2s, \n\t\t\t\t\tmargin-left .2s ease-out .2s, margin-right .2s ease-out .2s, \n\t\t\t\t\tmargin-top .2s ease-out .2s, margin-bottom .2s ease-out .2s,\n\t\t\t\t\topacity .2s ease-in-out, background-color .2s ease-in-out; \n\t\ttransition: width .2s ease-out .2s, height .2s ease-out .2s, \n\t\t\t\t\tmargin-left .2s ease-out .2s, margin-right .2s ease-out .2s, \n\t\t\t\t\tmargin-top .2s ease-out .2s, margin-bottom .2s ease-out .2s,\n\t\t\t\t\topacity .2s ease-in-out, background-color .2s ease-in-out; \n\t}\n\n\n\n/* \n------------------------------------------------------------------------------------------------------------------------\n6. SCROLLBAR COLORS, OPACITY AND BACKGROUNDS  \n------------------------------------------------------------------------------------------------------------------------\n*/\n\n\t/* \n\t----------------------------------------\n\t6.1 THEMES \n\t----------------------------------------\n\t*/\n\t\n\t/* default theme (\"light\") */\n\n\t.mCSB_scrollTools{ opacity: 0.75; filter: \"alpha(opacity=75)\"; -ms-filter: \"alpha(opacity=75)\"; }\n\t\n\t.mCS-autoHide > .mCustomScrollBox > .mCSB_scrollTools,\n\t.mCS-autoHide > .mCustomScrollBox ~ .mCSB_scrollTools{ opacity: 0; filter: \"alpha(opacity=0)\"; -ms-filter: \"alpha(opacity=0)\"; }\n\t\n\t.mCustomScrollbar > .mCustomScrollBox > .mCSB_scrollTools.mCSB_scrollTools_onDrag,\n\t.mCustomScrollbar > .mCustomScrollBox ~ .mCSB_scrollTools.mCSB_scrollTools_onDrag,\n\t.mCustomScrollBox:hover > .mCSB_scrollTools,\n\t.mCustomScrollBox:hover ~ .mCSB_scrollTools,\n\t.mCS-autoHide:hover > .mCustomScrollBox > .mCSB_scrollTools,\n\t.mCS-autoHide:hover > .mCustomScrollBox ~ .mCSB_scrollTools{ opacity: 1; filter: \"alpha(opacity=100)\"; -ms-filter: \"alpha(opacity=100)\"; }\n\n\t.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.4);\n\t\tfilter: \"alpha(opacity=40)\"; -ms-filter: \"alpha(opacity=40)\"; \n\t}\n\n\t.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.75);\n\t\tfilter: \"alpha(opacity=75)\"; -ms-filter: \"alpha(opacity=75)\"; \n\t}\n\n\t.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.85);\n\t\tfilter: \"alpha(opacity=85)\"; -ms-filter: \"alpha(opacity=85)\"; \n\t}\n\t.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.9);\n\t\tfilter: \"alpha(opacity=90)\"; -ms-filter: \"alpha(opacity=90)\"; \n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonUp,\n\t.mCSB_scrollTools .mCSB_buttonDown,\n\t.mCSB_scrollTools .mCSB_buttonLeft,\n\t.mCSB_scrollTools .mCSB_buttonRight{\n\t\tbackground-image: url(/assets/malihu-custom-scrollbar-plugin-master/mCSB_buttons.png?v1); /* css sprites */\n\t\tbackground-repeat: no-repeat;\n\t\topacity: 0.4; filter: \"alpha(opacity=40)\"; -ms-filter: \"alpha(opacity=40)\"; \n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonUp{\n\t\tbackground-position: 0 0;\n\t\t/* \n\t\tsprites locations \n\t\tlight: 0 0, -16px 0, -32px 0, -48px 0, 0 -72px, -16px -72px, -32px -72px\n\t\tdark: -80px 0, -96px 0, -112px 0, -128px 0, -80px -72px, -96px -72px, -112px -72px\n\t\t*/\n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonDown{\n\t\tbackground-position: 0 -20px;\n\t\t/* \n\t\tsprites locations\n\t\tlight: 0 -20px, -16px -20px, -32px -20px, -48px -20px, 0 -92px, -16px -92px, -32px -92px\n\t\tdark: -80px -20px, -96px -20px, -112px -20px, -128px -20px, -80px -92px, -96px -92px, -112 -92px\n\t\t*/\n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonLeft{\n\t\tbackground-position: 0 -40px;\n\t\t/* \n\t\tsprites locations \n\t\tlight: 0 -40px, -20px -40px, -40px -40px, -60px -40px, 0 -112px, -20px -112px, -40px -112px\n\t\tdark: -80px -40px, -100px -40px, -120px -40px, -140px -40px, -80px -112px, -100px -112px, -120px -112px\n\t\t*/\n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonRight{\n\t\tbackground-position: 0 -56px;\n\t\t/* \n\t\tsprites locations \n\t\tlight: 0 -56px, -20px -56px, -40px -56px, -60px -56px, 0 -128px, -20px -128px, -40px -128px\n\t\tdark: -80px -56px, -100px -56px, -120px -56px, -140px -56px, -80px -128px, -100px -128px, -120px -128px\n\t\t*/\n\t}\n\n\t.mCSB_scrollTools .mCSB_buttonUp:hover,\n\t.mCSB_scrollTools .mCSB_buttonDown:hover,\n\t.mCSB_scrollTools .mCSB_buttonLeft:hover,\n\t.mCSB_scrollTools .mCSB_buttonRight:hover{ opacity: 0.75; filter: \"alpha(opacity=75)\"; -ms-filter: \"alpha(opacity=75)\"; }\n\n\t.mCSB_scrollTools .mCSB_buttonUp:active,\n\t.mCSB_scrollTools .mCSB_buttonDown:active,\n\t.mCSB_scrollTools .mCSB_buttonLeft:active,\n\t.mCSB_scrollTools .mCSB_buttonRight:active{ opacity: 0.9; filter: \"alpha(opacity=90)\"; -ms-filter: \"alpha(opacity=90)\"; }\n\t\n\n\t/* theme: \"dark\" */\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_draggerRail{ background-color: #000; background-color: rgba(0,0,0,0.15); }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.75); }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: rgba(0,0,0,0.85); }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: rgba(0,0,0,0.9); }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_buttonUp{ background-position: -80px 0; }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_buttonDown{ background-position: -80px -20px; }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -80px -40px; }\n\n\t.mCS-dark.mCSB_scrollTools .mCSB_buttonRight{ background-position: -80px -56px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\n\n\t/* theme: \"light-2\", \"dark-2\" */\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-dark-2.mCSB_scrollTools .mCSB_draggerRail{\n\t\twidth: 4px;\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.1);\n\t\t-webkit-border-radius: 1px; -moz-border-radius: 1px; border-radius: 1px;\n\t}\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-2.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 4px;\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.75);\n\t\t-webkit-border-radius: 1px; -moz-border-radius: 1px; border-radius: 1px;\n\t}\n\n\t.mCS-light-2.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-dark-2.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-light-2.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-2.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 100%;\n\t\theight: 4px;\n\t\tmargin: 6px auto;\n\t}\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.85); }\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-light-2.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.9); }\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_buttonUp{ background-position: -32px 0; }\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_buttonDown{\tbackground-position: -32px -20px; }\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_buttonLeft{\tbackground-position: -40px -40px; }\n\n\t.mCS-light-2.mCSB_scrollTools .mCSB_buttonRight{ background-position: -40px -56px; }\n\t\n\t\n\t/* theme: \"dark-2\" */\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.1);\n\t\t-webkit-border-radius: 1px; -moz-border-radius: 1px; border-radius: 1px;\n\t}\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.75);\n\t\t-webkit-border-radius: 1px; -moz-border-radius: 1px; border-radius: 1px;\n\t}\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_buttonUp{ background-position: -112px 0; }\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_buttonDown{ background-position: -112px -20px; }\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -120px -40px; }\n\n\t.mCS-dark-2.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -120px -56px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\n\n\t/* theme: \"light-thick\", \"dark-thick\" */\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_draggerRail{\n\t\twidth: 4px;\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.1);\n\t\t-webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px;\n\t}\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 6px;\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.75);\n\t\t-webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px;\n\t}\n\n\t.mCS-light-thick.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-dark-thick.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\twidth: 100%;\n\t\theight: 4px;\n\t\tmargin: 6px 0;\n\t}\n\n\t.mCS-light-thick.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-thick.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 100%;\n\t\theight: 6px;\n\t\tmargin: 5px auto;\n\t}\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.85); }\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.9); }\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_buttonUp{ background-position: -16px 0; }\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_buttonDown{\tbackground-position: -16px -20px; }\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_buttonLeft{\tbackground-position: -20px -40px; }\n\n\t.mCS-light-thick.mCSB_scrollTools .mCSB_buttonRight{ background-position: -20px -56px; }\n\n\n\t/* theme: \"dark-thick\" */\n\t\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.1);\n\t\t-webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px;\n\t}\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.75);\n\t\t-webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px;\n\t}\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_buttonUp{ background-position: -96px 0; }\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_buttonDown{ background-position: -96px -20px; }\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -100px -40px; }\n\n\t.mCS-dark-thick.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -100px -56px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\n\n\t/* theme: \"light-thin\", \"dark-thin\" */\n\t\n\t.mCS-light-thin.mCSB_scrollTools .mCSB_draggerRail{ background-color: #fff; background-color: rgba(255,255,255,0.1); }\n\n\t.mCS-light-thin.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ width: 2px; }\n\n\t.mCS-light-thin.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-dark-thin.mCSB_scrollTools_horizontal .mCSB_draggerRail{ width: 100%; }\n\n\t.mCS-light-thin.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-thin.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 100%;\n\t\theight: 2px;\n\t\tmargin: 7px auto;\n\t}\n\n\n\t/* theme \"dark-thin\" */\n\t\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_draggerRail{ background-color: #000; background-color: rgba(0,0,0,0.15); }\n\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.75); }\n\t\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\t\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\t\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_buttonUp{\tbackground-position: -80px 0; }\n\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_buttonDown{ background-position: -80px -20px; }\n\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -80px -40px; }\n\n\t.mCS-dark-thin.mCSB_scrollTools .mCSB_buttonRight{ background-position: -80px -56px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\t\n\t\n\t/* theme \"rounded\", \"rounded-dark\", \"rounded-dots\", \"rounded-dots-dark\" */\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_draggerRail{ background-color: #fff; background-color: rgba(255,255,255,0.15); }\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_dragger, \n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_dragger, \n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_dragger, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_dragger{ height: 14px; }\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 14px;\n\t\tmargin: 0 1px;\n\t}\n\t\n\t.mCS-rounded.mCSB_scrollTools_horizontal .mCSB_dragger, \n\t.mCS-rounded-dark.mCSB_scrollTools_horizontal .mCSB_dragger, \n\t.mCS-rounded-dots.mCSB_scrollTools_horizontal .mCSB_dragger, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools_horizontal .mCSB_dragger{ width: 14px; }\n\t\n\t.mCS-rounded.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dots.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\theight: 14px;\n\t\tmargin: 1px 0;\n\t}\n\t\n\t.mCS-rounded.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded .mCSB_dragger_bar, \n\t.mCS-rounded.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dark.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded .mCSB_dragger_bar, \n\t.mCS-rounded-dark.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 16px; /* auto-expanded scrollbar */\n\t\theight: 16px;\n\t\tmargin: -1px 0;\n\t}\n\t\n\t.mCS-rounded.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-rounded.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail, \n\t.mCS-rounded-dark.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-rounded-dark.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail{ width: 4px; /* auto-expanded scrollbar */ }\n\t\n\t.mCS-rounded.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded .mCSB_dragger_bar, \n\t.mCS-rounded.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dark.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded .mCSB_dragger_bar, \n\t.mCS-rounded-dark.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_dragger .mCSB_dragger_bar{\n\t\theight: 16px; /* auto-expanded scrollbar */\n\t\twidth: 16px;\n\t\tmargin: 0 -1px;\n\t}\n\t\n\t.mCS-rounded.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-rounded.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail, \n\t.mCS-rounded-dark.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-rounded-dark.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail{\n\t\theight: 4px; /* auto-expanded scrollbar */\n\t\tmargin: 6px 0;\n\t}\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_buttonUp{ background-position: 0 -72px; }\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_buttonDown{ background-position: 0 -92px; }\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_buttonLeft{ background-position: 0 -112px; }\n\t\n\t.mCS-rounded.mCSB_scrollTools .mCSB_buttonRight{ background-position: 0 -128px; }\n\t\n\t\n\t/* theme \"rounded-dark\", \"rounded-dots-dark\" */\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.75); }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_draggerRail{ background-color: #000; background-color: rgba(0,0,0,0.15); }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_buttonUp{ background-position: -80px -72px; }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_buttonDown{ background-position: -80px -92px; }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -80px -112px; }\n\t\n\t.mCS-rounded-dark.mCSB_scrollTools .mCSB_buttonRight{ background-position: -80px -128px; }\n\t\n\t\n\t/* theme \"rounded-dots\", \"rounded-dots-dark\" */\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools_vertical .mCSB_draggerRail, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools_vertical .mCSB_draggerRail{ width: 4px; }\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-rounded-dots.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\tbackground-color: transparent;\n\t\tbackground-position: center;\n\t}\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAANElEQVQYV2NkIAAYiVbw//9/Y6DiM1ANJoyMjGdBbLgJQAX/kU0DKgDLkaQAvxW4HEvQFwCRcxIJK1XznAAAAABJRU5ErkJggg==\");\n\t\tbackground-repeat: repeat-y;\n\t\topacity: 0.3;\n\t\tfilter: \"alpha(opacity=30)\"; -ms-filter: \"alpha(opacity=30)\"; \n\t}\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-rounded-dots-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\theight: 4px;\n\t\tmargin: 6px 0;\n\t\tbackground-repeat: repeat-x;\n\t}\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_buttonUp{ background-position: -16px -72px; }\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_buttonDown{ background-position: -16px -92px; }\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -20px -112px; }\n\t\n\t.mCS-rounded-dots.mCSB_scrollTools .mCSB_buttonRight{ background-position: -20px -128px; }\n\t\n\t\n\t/* theme \"rounded-dots-dark\" */\n\t\n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAALElEQVQYV2NkIAAYSVFgDFR8BqrBBEifBbGRTfiPZhpYjiQFBK3A6l6CvgAAE9kGCd1mvgEAAAAASUVORK5CYII=\");\n\t}\n\t\n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_buttonUp{ background-position: -96px -72px; }\n\t\n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_buttonDown{ background-position: -96px -92px; }\n\t\n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -100px -112px; }\n\t\n\t.mCS-rounded-dots-dark.mCSB_scrollTools .mCSB_buttonRight{ background-position: -100px -128px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\t\n\t\n\t/* theme \"3d\", \"3d-dark\", \"3d-thick\", \"3d-thick-dark\" */\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-repeat: repeat-y;\n\t\tbackground-image: -moz-linear-gradient(left, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);\n\t\tbackground-image: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,0.5)), color-stop(100%,rgba(255,255,255,0)));\n\t\tbackground-image: -webkit-linear-gradient(left, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t\tbackground-image: -o-linear-gradient(left, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t\tbackground-image: -ms-linear-gradient(left, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t\tbackground-image: linear-gradient(to right, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t}\n\t\n\t.mCS-3d.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-repeat: repeat-x;\n\t\tbackground-image: -moz-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);\n\t\tbackground-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0.5)), color-stop(100%,rgba(255,255,255,0)));\n\t\tbackground-image: -webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t\tbackground-image: -o-linear-gradient(top, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t\tbackground-image: -ms-linear-gradient(top, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t\tbackground-image: linear-gradient(to bottom, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%);\n\t}\n\t\n\t\n\t/* theme \"3d\", \"3d-dark\" */\n\t\n\t.mCS-3d.mCSB_scrollTools_vertical .mCSB_dragger, \n\t.mCS-3d-dark.mCSB_scrollTools_vertical .mCSB_dragger{ height: 70px; }\n\t\n\t.mCS-3d.mCSB_scrollTools_horizontal .mCSB_dragger, \n\t.mCS-3d-dark.mCSB_scrollTools_horizontal .mCSB_dragger{ width: 70px; }\n\t\n\t.mCS-3d.mCSB_scrollTools, \n\t.mCS-3d-dark.mCSB_scrollTools{\n\t\topacity: 1;\n\t\tfilter: \"alpha(opacity=30)\"; -ms-filter: \"alpha(opacity=30)\"; \n\t}\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ -webkit-border-radius: 16px; -moz-border-radius: 16px; border-radius: 16px; }\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_draggerRail{\n\t\twidth: 8px;\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.2);\n\t\tbox-shadow: inset 1px 0 1px rgba(0,0,0,0.5), inset -1px 0 1px rgba(255,255,255,0.2);\n\t}\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \t \n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #555; }\n\n\t.mCS-3d.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ width: 8px; }\n\n\t.mCS-3d.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-3d-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\twidth: 100%;\n\t\theight: 8px;\n\t\tmargin: 4px 0;\n\t\tbox-shadow: inset 0 1px 1px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.2);\n\t}\n\n\t.mCS-3d.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\twidth: 100%;\n\t\theight: 8px;\n\t\tmargin: 4px auto;\n\t}\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_buttonUp{ background-position: -32px -72px; }\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_buttonDown{ background-position: -32px -92px; }\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -40px -112px; }\n\t\n\t.mCS-3d.mCSB_scrollTools .mCSB_buttonRight{ background-position: -40px -128px; }\n\t\n\t\n\t/* theme \"3d-dark\" */\n\t\n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.1);\n\t\tbox-shadow: inset 1px 0 1px rgba(0,0,0,0.1);\n\t}\n\t\n\t.mCS-3d-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail{ box-shadow: inset 0 1px 1px rgba(0,0,0,0.1); }\n\t\n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_buttonUp{ background-position: -112px -72px; }\n\n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_buttonDown{ background-position: -112px -92px; }\n\n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -120px -112px; }\n\n\t.mCS-3d-dark.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -120px -128px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\t\n\t\n\t/* theme: \"3d-thick\", \"3d-thick-dark\" */\n\t\n\t.mCS-3d-thick.mCSB_scrollTools, \n\t.mCS-3d-thick-dark.mCSB_scrollTools{\n\t\topacity: 1;\n\t\tfilter: \"alpha(opacity=30)\"; -ms-filter: \"alpha(opacity=30)\"; \n\t}\n\t\n\t.mCS-3d-thick.mCSB_scrollTools, \n\t.mCS-3d-thick-dark.mCSB_scrollTools, \n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_draggerContainer, \n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_draggerContainer{ -webkit-border-radius: 7px; -moz-border-radius: 7px; border-radius: 7px; }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; }\n\t\n\t.mCSB_inside + .mCS-3d-thick.mCSB_scrollTools_vertical, \n\t.mCSB_inside + .mCS-3d-thick-dark.mCSB_scrollTools_vertical{ right: 1px; }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools_vertical, \n\t.mCS-3d-thick-dark.mCSB_scrollTools_vertical{ box-shadow: inset 1px 0 1px rgba(0,0,0,0.1), inset 0 0 14px rgba(0,0,0,0.5); }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools_horizontal, \n\t.mCS-3d-thick-dark.mCSB_scrollTools_horizontal{\n\t\tbottom: 1px;\n\t\tbox-shadow: inset 0 1px 1px rgba(0,0,0,0.1), inset 0 0 14px rgba(0,0,0,0.5);\n\t}\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbox-shadow: inset 1px 0 0 rgba(255,255,255,0.4);\n\t\twidth: 12px;\n\t\tmargin: 2px;\n\t\tposition: absolute;\n\t\theight: auto;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t}\n\t\n\t.mCS-3d-thick.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{ box-shadow: inset 0 1px 0 rgba(255,255,255,0.4); }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar,  \n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #555; }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\theight: 12px;\n\t\twidth: auto;\n\t}\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_draggerContainer{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.05);\n\t\tbox-shadow: inset 1px 1px 16px rgba(0,0,0,0.1);\n\t}\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_draggerRail{ background-color: transparent; }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_buttonUp{ background-position: -32px -72px; }\n\t\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_buttonDown{ background-position: -32px -92px; }\n\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -40px -112px; }\n\n\t.mCS-3d-thick.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -40px -128px; }\n\t\n\t\n\t/* theme: \"3d-thick-dark\" */\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools{ box-shadow: inset 0 0 14px rgba(0,0,0,0.2); }\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools_horizontal{ box-shadow: inset 0 1px 1px rgba(0,0,0,0.1), inset 0 0 14px rgba(0,0,0,0.2); }\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ box-shadow: inset 1px 0 0 rgba(255,255,255,0.4), inset -1px 0 0 rgba(0,0,0,0.2); }\n\t \n\t.mCS-3d-thick-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{ box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2); }\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar,  \n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #777; }\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_draggerContainer{\n\t\tbackground-color: #fff; background-color: rgba(0,0,0,0.05);\n\t\tbox-shadow: inset 1px 1px 16px rgba(0,0,0,0.1);\n\t}\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_draggerRail{ background-color: transparent; }\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_buttonUp{ background-position: -112px -72px; }\n\t\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_buttonDown{ background-position: -112px -92px; }\n\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -120px -112px; }\n\n\t.mCS-3d-thick-dark.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -120px -128px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\t\n\t\n\t/* theme: \"minimal\", \"minimal-dark\" */\n\t\n\t.mCSB_outside + .mCS-minimal.mCSB_scrollTools_vertical, \n\t.mCSB_outside + .mCS-minimal-dark.mCSB_scrollTools_vertical{\n\t\tright: 0; \n\t\tmargin: 12px 0; \n\t}\n\t\n\t.mCustomScrollBox.mCS-minimal + .mCSB_scrollTools.mCSB_scrollTools_horizontal, \n\t.mCustomScrollBox.mCS-minimal + .mCSB_scrollTools + .mCSB_scrollTools.mCSB_scrollTools_horizontal, \n\t.mCustomScrollBox.mCS-minimal-dark + .mCSB_scrollTools.mCSB_scrollTools_horizontal, \n\t.mCustomScrollBox.mCS-minimal-dark + .mCSB_scrollTools + .mCSB_scrollTools.mCSB_scrollTools_horizontal{\n\t\tbottom: 0; \n\t\tmargin: 0 12px; \n\t}\n\t\n\t/* RTL direction/left-side scrollbar */\n\t.mCS-dir-rtl > .mCSB_outside + .mCS-minimal.mCSB_scrollTools_vertical, \n\t.mCS-dir-rtl > .mCSB_outside + .mCS-minimal-dark.mCSB_scrollTools_vertical{\n\t\tleft: 0; \n\t\tright: auto;\n\t}\n\t\n\t.mCS-minimal.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-minimal-dark.mCSB_scrollTools .mCSB_draggerRail{ background-color: transparent; }\n\t\n\t.mCS-minimal.mCSB_scrollTools_vertical .mCSB_dragger, \n\t.mCS-minimal-dark.mCSB_scrollTools_vertical .mCSB_dragger{ height: 50px; }\n\t\n\t.mCS-minimal.mCSB_scrollTools_horizontal .mCSB_dragger, \n\t.mCS-minimal-dark.mCSB_scrollTools_horizontal .mCSB_dragger{ width: 50px; }\n\t\n\t.mCS-minimal.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.2);\n\t\tfilter: \"alpha(opacity=20)\"; -ms-filter: \"alpha(opacity=20)\"; \n\t}\n\t\n\t.mCS-minimal.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-minimal.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{\n\t\tbackground-color: #fff; background-color: rgba(255,255,255,0.5);\n\t\tfilter: \"alpha(opacity=50)\"; -ms-filter: \"alpha(opacity=50)\"; \n\t}\n\t\n\t\n\t/* theme: \"minimal-dark\" */\n\t\n\t.mCS-minimal-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.2);\n\t\tfilter: \"alpha(opacity=20)\"; -ms-filter: \"alpha(opacity=20)\"; \n\t}\n\t\n\t.mCS-minimal-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-minimal-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.5);\n\t\tfilter: \"alpha(opacity=50)\"; -ms-filter: \"alpha(opacity=50)\"; \n\t}\n\t\n\t/* ---------------------------------------- */\n\t\n\t\n\t\n\t/* theme \"light-3\", \"dark-3\" */\n\t\n\t.mCS-light-3.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-dark-3.mCSB_scrollTools .mCSB_draggerRail{\n\t\twidth: 6px;\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.2);\n\t}\n\n\t.mCS-light-3.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-3.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ width: 6px; }\n\n\t.mCS-light-3.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-dark-3.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-light-3.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-dark-3.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\twidth: 100%;\n\t\theight: 6px;\n\t\tmargin: 5px 0;\n\t}\n\t\n\t.mCS-light-3.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-light-3.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail, \n\t.mCS-dark-3.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-dark-3.mCSB_scrollTools_vertical.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail{\n\t\twidth: 12px;\n\t}\n\t\n\t.mCS-light-3.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-light-3.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail, \n\t.mCS-dark-3.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_dragger.mCSB_dragger_onDrag_expanded + .mCSB_draggerRail, \n\t.mCS-dark-3.mCSB_scrollTools_horizontal.mCSB_scrollTools_onDrag_expand .mCSB_draggerContainer:hover .mCSB_draggerRail{\n\t\theight: 12px;\n\t\tmargin: 2px 0;\n\t}\n\t\n\t.mCS-light-3.mCSB_scrollTools .mCSB_buttonUp{ background-position: -32px -72px; }\n\t\n\t.mCS-light-3.mCSB_scrollTools .mCSB_buttonDown{ background-position: -32px -92px; }\n\t\n\t.mCS-light-3.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -40px -112px; }\n\t\n\t.mCS-light-3.mCSB_scrollTools .mCSB_buttonRight{ background-position: -40px -128px; }\n\t\n\t\n\t/* theme \"dark-3\" */\n\t\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.75); }\n\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\t\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_draggerRail{ background-color: #000; background-color: rgba(0,0,0,0.1); }\n\t\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_buttonUp{ background-position: -112px -72px; }\n\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_buttonDown{ background-position: -112px -92px; }\n\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -120px -112px; }\n\n\t.mCS-dark-3.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -120px -128px; }\n\t\n\t/* ---------------------------------------- */\n\t\n\t\n\t\n\t/* theme \"inset\", \"inset-dark\", \"inset-2\", \"inset-2-dark\", \"inset-3\", \"inset-3-dark\" */\n\t\n\t.mCS-inset.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-2.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-3.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_draggerRail{\n\t\twidth: 12px;\n\t\tbackground-color: #000; background-color: rgba(0,0,0,0.2);\n\t}\n\n\t.mCS-inset.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-2.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-3.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ \n\t\twidth: 6px;\n\t\tmargin: 3px 5px;\n\t\tposition: absolute;\n\t\theight: auto;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t}\n\n\t.mCS-inset.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-2.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-2-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-3.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-3-dark.mCSB_scrollTools_horizontal .mCSB_dragger .mCSB_dragger_bar{\n\t\theight: 6px;\n\t\tmargin: 5px 3px;\n\t\tposition: absolute;\n\t\twidth: auto;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t}\n\t\n\t.mCS-inset.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-inset-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-inset-2.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-inset-2-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-inset-3.mCSB_scrollTools_horizontal .mCSB_draggerRail, \n\t.mCS-inset-3-dark.mCSB_scrollTools_horizontal .mCSB_draggerRail{\n\t\twidth: 100%;\n\t\theight: 12px;\n\t\tmargin: 2px 0;\n\t}\n\t\n\t.mCS-inset.mCSB_scrollTools .mCSB_buttonUp, \n\t.mCS-inset-2.mCSB_scrollTools .mCSB_buttonUp, \n\t.mCS-inset-3.mCSB_scrollTools .mCSB_buttonUp{ background-position: -32px -72px; }\n\t\n\t.mCS-inset.mCSB_scrollTools .mCSB_buttonDown, \n\t.mCS-inset-2.mCSB_scrollTools .mCSB_buttonDown, \n\t.mCS-inset-3.mCSB_scrollTools .mCSB_buttonDown{ background-position: -32px -92px; }\n\t\n\t.mCS-inset.mCSB_scrollTools .mCSB_buttonLeft, \n\t.mCS-inset-2.mCSB_scrollTools .mCSB_buttonLeft, \n\t.mCS-inset-3.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -40px -112px; }\n\t\n\t.mCS-inset.mCSB_scrollTools .mCSB_buttonRight, \n\t.mCS-inset-2.mCSB_scrollTools .mCSB_buttonRight, \n\t.mCS-inset-3.mCSB_scrollTools .mCSB_buttonRight{ background-position: -40px -128px; }\n\t\n\t\n\t/* theme \"inset-dark\", \"inset-2-dark\", \"inset-3-dark\" */\n\t\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.75); }\n\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\t\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_draggerRail{ background-color: #000; background-color: rgba(0,0,0,0.1); }\n\t\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_buttonUp, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_buttonUp, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_buttonUp{ background-position: -112px -72px; }\n\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_buttonDown, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_buttonDown, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_buttonDown{ background-position: -112px -92px; }\n\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_buttonLeft, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_buttonLeft, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_buttonLeft{ background-position: -120px -112px; }\n\n\t.mCS-inset-dark.mCSB_scrollTools .mCSB_buttonRight, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_buttonRight, \n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_buttonRight{\tbackground-position: -120px -128px; }\n\t\n\t\n\t/* theme \"inset-2\", \"inset-2-dark\" */\n\t\n\t.mCS-inset-2.mCSB_scrollTools .mCSB_draggerRail, \n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_draggerRail{\n\t\tbackground-color: transparent;\n\t\tborder-width: 1px;\n\t\tborder-style: solid;\n\t\tborder-color: #fff;\n\t\tborder-color: rgba(255,255,255,0.2);\n\t\t-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;\n\t}\n\t\n\t.mCS-inset-2-dark.mCSB_scrollTools .mCSB_draggerRail{ border-color: #000; border-color: rgba(0,0,0,0.2); }\n\t\n\t\n\t/* theme \"inset-3\", \"inset-3-dark\" */\n\t\n\t.mCS-inset-3.mCSB_scrollTools .mCSB_draggerRail{ background-color: #fff; background-color: rgba(255,255,255,0.6); }\n\t\n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_draggerRail{ background-color: #000; background-color: rgba(0,0,0,0.6); }\n\t\n\t.mCS-inset-3.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.75); }\n\t\n\t.mCS-inset-3.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.85); }\n\t\n\t.mCS-inset-3.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-inset-3.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #000; background-color: rgba(0,0,0,0.9); }\n\t\n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.75); }\n\t\n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.85); }\n\t\n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,\n\t.mCS-inset-3-dark.mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar{ background-color: #fff; background-color: rgba(255,255,255,0.9); }\n\t\n\t/* ---------------------------------------- */\n.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorStatusCell,.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable thead tr .statusHead{text-align:center}#motorAreaAccordionContainer #PaginationDiv .pointer-events-none,#transmissionRatioPanelContainer .pointer-events-none{pointer-events:none}.tsCruveContainer #servoMotorTSCurve{background-color:#f3f3f3;margin-bottom:10px}.tsCruveContainer #servoMotorTSCurve.rightBorder{border-right:solid #d3d3d3 1px}.tsCruveContainer .display-inline{display:inline-block}.tsCruveContainer #servoMotorArea #servoMotorInfoContainer .table{margin-bottom:0}.tsCruveContainer #servoMotorArea #motorAreaAccordionContainer{width:100%}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer{min-width:325px;padding-left:5px;padding-right:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable{cursor:pointer;margin-bottom:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable tr td{vertical-align:middle}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorSelected{background-color:#F5F5F5}.tsCruveContainer #servoMotorArea #motorAreaAccordionContainer .motorStatusIcon.glyphicon-ok{color:green}.tsCruveContainer #servoMotorArea #motorAreaAccordionContainer .motorStatusIcon.glyphicon-remove{color:red}.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer #statusValueContainer div{padding-left:0}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell{padding-bottom:3px;padding-top:3px}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell .btn-info{padding-top:4px;padding-bottom:4px}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell #motorDetailsButton{display:none}.tsCruveContainer #servoMotorArea #motorSelectionTableContainer #motorSelectionTable .motorDetailsCell #motorDetailsButton.btn-info-visible{display:block}.tsCruveContainer .curveConfigContainer{min-height:40px;margin:15px 0 25px}.tsCruveContainer .curveConfigContainer .tableDDContainer .tableSelectDDMenu{height:30px}.tsCruveContainer .curveConfigContainer .motorSpecContainer #motorButton{padding:2px 0 0 2px}.tsCruveContainer .curveConfigContainer .motorSpecContainer #motorButton #motorSpecButton{height:26px;width:33px}.tsCruveContainer .curveConfigContainer .plotModeContainer #plotModeToggle .selectedQuad{background-color:#E6E6E4}.tsCruveContainer .curveConfigContainer .plotModeContainer #quadrantTitle{font-weight:700}.tsCruveContainer .curveConfigContainer .plotModeContainer #quadRadioContainer{margin:12px 3px 11px}.tsCruveContainer .curveConfigContainer .plotModeContainer label{font-weight:400;cursor:pointer}.tsCruveContainer .curveConfigContainer .plotModeContainer label#quadrantTitle{font-weight:700}.tsCruveContainer .accordion-plus-minus{color:grey}.tsCruveContainer #motorStatus{padding-right:0;padding-left:0}.tsCurveFlotTip{padding:4px 10px;background-color:rgba(0,0,0,.8)!important;border:1px solid #000!important;z-index:100;font-size:12px;color:#fff;border-radius:5px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .tableRow{min-height:30px;padding:5px;margin-right:0;margin-left:0;border-bottom:solid #d3d3d3 1px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .tableHeading{min-height:30px;padding:3px;margin-right:0;margin-left:0;font-weight:700;font-size:18px;border-bottom:solid #d3d3d3 1px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .leftCol{border-right:solid #d3d3d3 1px;max-width:80px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable .rightCol{max-width:80px}.tsCruveContainer #servoMotorInfoContainer .motorSpecTable{background-color:#fefefe;margin:auto;border:5px solid #888;width:40%;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.28);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.28);box-shadow:0 0 10px 5px rgba(0,0,0,.28)}.tsCruveContainer .motorSpecTable table{margin-bottom:0}.tsCruveContainer .motorSpecTable .motorTableTitle{text-align:center;color:#000;font-size:16px;font-weight:700;border-bottom:solid 2px #d3d3d3}.tsCruveContainer #motorInfoContainer{height:5px;width:1px}.tsCruveContainer #feedbackContainer #feedbackTitle{font-weight:700;padding-left:5px;font-size:18px}.tsCruveContainer #feedbackContainer .motorStatusContainer{margin-right:0}.tsCruveContainer #feedbackContainer .motorStatusContainer #motorStatusIcon{height:20px;width:20px;margin-left:5px;margin-top:1px;margin-right:10px;padding-right:0}.tsCruveContainer #feedbackContainer .motorStatusContainer #motorStatus{font-size:17px}#editConfigBtnContainer{width:100%;padding-right:30px;bottom:0;z-index:100;height:60px;position:absolute;right:0}.tsCruveContainer #motorSpecTableModal .modal-body{padding:0;border:4px solid #c3c3c3}.tsCruveContainer #servoMotorInfoContainer{display:none;width:100%;height:100%;position:absolute;z-index:101;padding-top:100px;left:0;top:0}.tsCruveContainer #servoMotorArea #motorSlider{margin-right:3px}.tsCruveContainer .tsPlotArea .legendLabel{padding:5px}.tsCruveContainer .tsPlotArea .legend table{pointer-events:none;margin:0!important;width:auto}.tsCruveContainer .tsPlotArea .legend table tr{background-color:transparent!important;border-width:0!important;margin:2px 0}.tsCruveContainer .tsPlotArea .legend table tr td{border-width:0!important;vertical-align:middle;text-align:left!important}.tsCruveContainer .tsPlotArea .legend td.legendColorBox>div>div{border-radius:initial;box-sizing:inherit}.slider.slider-horizontal{width:92%;padding-top:0;margin-top:7.5px}.tsCruveContainer .slider-handle{width:12px;height:12px;cursor:pointer}.tsCruveContainer .slider-horizontal{cursor:pointer}.tsCruveContainer .slider.slider-horizontal .slider-track{height:2px}.tsCruveContainer .slider-tick{width:10px;height:10px}.tsCruveContainer .resizeWidth{width:100%;flex:inherit;max-width:100%}#envFactorsPanelContainer .ui-slider,#transmissionRatioPanelContainer .ui-slider,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer .ui-slider{margin-top:4px}#transmissionRatioPanelContainer #alertMessageContainer,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer #alertMessageContainer{display:none;margin-bottom:0}.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer .title{font:Bold 14px Open Sans;color:#474747;padding-right:1px;align-self:center;padding-left:25px}.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer .appComboBox{align-self:center}#envFactorsPanelContainer .title,#motorDataContainer .title,#transmissionRatioPanelContainer .title{font:Bold 14px Open Sans;color:#474747;padding-right:1px;padding-left:25px}.tsCruveContainer .titleTextLoad,.tsCruveContainer .titleTextMotor{font-family:Open Sans;font-size:14px;color:#6f6f6f;max-width:100px;text-align:center;display:inline-block;font-weight:700}#tsPointsPanelContainer .cosmatt-unitComboBox{padding-top:9px;padding-bottom:9px}#tsPointsPanelContainer .peakAccelerationMotorSide,#tsPointsPanelContainer .peakSpeedMotorSide,#tsPointsPanelContainer .peakTorqueMotorSide,#tsPointsPanelContainer .rmsAccelerationMotorSide,#tsPointsPanelContainer .rmsTorqueMotorSide{align-self:center}#tsPointsPanelContainer .peakAccelerationMotorSide .response-status,#tsPointsPanelContainer .peakSpeedMotorSide .response-status,#tsPointsPanelContainer .peakTorqueMotorSide .response-status,#tsPointsPanelContainer .rmsAccelerationMotorSide .response-status,#tsPointsPanelContainer .rmsTorqueMotorSide .response-status{display:inline}#tsPointsPanelContainer .peakAccele,#tsPointsPanelContainer .peakTorque,#tsPointsPanelContainer .rmsAccele{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#envFactorsPanelContainer label.value,#transmissionRatioPanelContainer label.value,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer label.value{font-weight:400;font-size:12px}.tsCruveContainer .panel-body.operatingPointsCont{max-width:500px}#motorAreaAccordionContainer{width:100%}.tsCruveContainer .motorTableTitle .closeButtonStyle{color:#333;cursor:pointer;display:inline;float:right;height:20px;margin-right:11px;text-align:center;width:20px}.tsCruveContainer .motorTableTitle .closeButtonStyle:hover{background-color:#ddd}.tsCruveContainer #motorAreaAccordionContainer .panel-heading a:hover,a:focus{text-decoration:none}.tsCruveContainer #motorAreaAccordionContainer .panel-default{margin-bottom:10px;border:1px solid #ddd;border-radius:4px}.tsCruveContainer #motorAreaAccordionContainer .panel-heading .panel-title{font-size:16px;color:#000;margin-bottom:0;font-family:open Sans;font-weight:400}.tsCruveContainer #motorAreaAccordionContainer .panel-heading .panel-title a{color:#000;display:block;padding:10px 15px;margin:-10px -15px}.tsCruveContainer #sizeSlider .slider-selection{background:#BABABA}.tsCruveContainer .solutionDivider{border:1px dashed #ddd;margin:5px}.tsCruveContainer .solutionInfoTitle{font-family:Open Sans;font-size:16px;color:#000}.tsCruveContainer .solutionInfoContainer{padding-top:8px;font-family:Arial;font-size:14px;color:#474747;padding-right:2px;margin-left:-5px}.tsCruveContainer .padding-right-zero,.tsCruveContainer .solutionInfoContainer .padding-right-zero{padding-right:0}.tsCruveContainer .solutionInfoContainer .padding-left-right-zero{padding-right:0;padding-left:0}.motorName,.solutionStatus,.tsCruveContainer .driveName,.voltageName{padding:5px}.tsCruveContainer .panelNew{background-color:#fff;border:1px solid transparent;-webkit-box-shadow:0 1px 1px rgba(0,0,0,.05);box-shadow:0 1px 1px rgba(0,0,0,.05);margin-bottom:0;border-radius:4px}.tsCruveContainer .panel-group .panelNew{margin-bottom:10px;border-radius:4px}.tsCruveContainer .panel-defaultNew{border-color:#ddd}.tsCruveContainer #motorAreaAccordionContainer .panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd;cursor:default}.tsCruveContainer .solutionStatus{color:#fff;font-size:12px;padding:1px 12px;border-radius:5px}.tsCruveContainer .motorPass{background-color:#64BD63}.tsCruveContainer .motorFail{background-color:#DD5826}.tsCruveContainer .accordion-plus-minus,.tsCruveContainer .accordion-plus-plus{font-size:12px}.tsCruveContainer .motorDataOpenPanle{display:block;visibility:visible}.tsCruveContainer .widgetNumberInput{height:20px;width:55%;display:inline-block;padding:6px;max-width:95px}.tsCruveContainer #servoMotorTSCurve .tsPlotArea{max-width:530px;min-height:460px;margin:0 auto}.tsCruveContainer .correct{background-color:#f0fff0!important;border-color:#7DC27D;color:#7DC27D}.tsCruveContainer .incorrect{background-color:#fff0f0!important;border-color:#A90329;color:#da1a33}.pagination-container{margin:.5rem}#motorAreaAccordionContainer #PaginationDiv .Folio{padding:0;margin:0;border:none;box-shadow:unset;background-color:#fff;position:relative;display:flex;flex-direction:row;justify-content:center;flex-wrap:nowrap}#motorAreaAccordionContainer #PaginationDiv span.FolioPage,span.FolioControl{line-height:1.25;text-decoration:none;display:inline-block;margin-left:-1px;box-shadow:unset;color:#0886C7;background-color:#fff;border:1px solid #ddd;top:0;bottom:0}#motorAreaAccordionContainer #PaginationDiv span.FolioPages{flex-grow:2;display:flex;flex-direction:row}#motorAreaAccordionContainer #PaginationDiv span.FolioPage{flex-grow:1;text-align:center;font-family:Arial;font-style:normal;font-size:14px;color:#0988c8;background-color:#fff;padding-top:8px}#motorAreaAccordionContainer #PaginationDiv span.FolioControl{position:relative;margin:0;flex-grow:.1;text-align:center}#motorAreaAccordionContainer #PaginationDiv span.FolioPrevious{border-right-width:0;background-color:#f3f3f3}#motorAreaAccordionContainer #PaginationDiv span.FolioControl.Disabled{cursor:not-allowed}#motorAreaAccordionContainer #PaginationDiv span.FolioPage.Disabled{padding:5px;color:#888;cursor:not-allowed}#motorAreaAccordionContainer #PaginationDiv span.FolioNext{border-left-width:0;background-color:#f3f3f3}#motorAreaAccordionContainer #PaginationDiv .FolioPage.Active{background-color:#0988C8;color:#fff;border-top-color:#0988C8;border-bottom-color:#0988C8;font-weight:700}#motorAreaAccordionContainer .panel-group .panelHeadingNew{padding:0}#motorAreaAccordionContainer .panel-group .widget-textbox-height{height:26px;text-align:left!important;padding-left:6px}#motorAreaAccordionContainer .display-flex{display:-webkit-box}#motorAreaAccordionContainer #PaginationDiv span.FolioPage.Ellipsis{cursor:text;opacity:.4;font-size:14px;font-family:\"Open Sans\";color:#0988C8}#motorAreaAccordionContainer .FolioPage.Ellipsis:hover{font-weight:400}#motorAreaAccordionContainer .fa-chevron-left,#motorAreaAccordionContainer .fa-chevron-right{padding-top:9px}#motorAreaAccordionContainer .margin-bottom{margin-bottom:10px}#motorAreaAccordionContainer #envFactorsPanelContainer .response-status{padding-left:8px;font-size:12px;display:none}#motorAreaAccordionContainer #envFactorsPanelContainer .response-status .incorrect{font-size:14px;color:#da1a33;display:inline-block;width:12%}#motorAreaAccordionContainer #envFactorsPanelContainer .response-status .correct{font-size:14px;color:#7DC27D;display:inline-block;width:12%}#tsPointsPanelContainer .response-status .correct-answer{color:#388e3c;font-weight:700;padding-left:10px;font-size:12px}#motorAreaAccordionContainer #envFactorsPanelContainer .response-status .correct-answer{display:inline-block;color:#388e3c;padding-left:10px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:88%;line-height:1}#motorAreaAccordionContainer .solutionInfoTitle .response-status{padding-left:8px;font-size:12px;display:none}#motorAreaAccordionContainer .solutionInfoTitle .response-status .incorrect{font-size:14px;color:#da1a33;display:inline-block}#motorAreaAccordionContainer .solutionInfoTitle .response-status .correct{font-size:14px;color:#388e3c;display:inline-block}#motorAreaAccordionContainer .solutionInfoTitle .response-status .correct-answer{display:inline;color:#388e3c;padding-left:10px;font-weight:700;width:88%}#servoMotorTSCurve .titleSection{margin:13px auto 4px;display:table;padding:5px;color:#343434;font:400 18px Open Sans}#motorAreaAccordionContainer #motorName,#motorAreaAccordionContainer #solutionTitle,#motorAreaAccordionContainer .tansmComboBox{display:inline-block}#servoMotorArea .titleSection{padding:15px;font-size:16px}#motorAreaAccordionContainer .statusContainer{display:inline-block;vertical-align:middle;margin-bottom:3px;margin-left:5px}@media (min-width:1024px) and (max-width:1440px){.tsCruveContainer,.tsCruveContainer .solutionInfoContainer{font-size:12px}.tsCruveContainer #motorAreaAccordionContainer .panel-heading .panel-title{font-size:14px}}@media (min-width:768px) and (max-width:1204px){.tsCruveContainer #servoMotorArea,.tsCruveContainer #servoMotorTSCurve{width:100%;flex:inherit;max-width:100%}}#tsPointsPanelContainer .loadSideImg,#tsPointsPanelContainer .motorSideImg{background-repeat:no-repeat;background-size:contain;width:49px;height:23px;margin-left:10px;display:inline-block;vertical-align:middle;margin-top:-8px}#tsPointsPanelContainer .loadSideImg{background-image:url(/assets/load_side.png)}#tsPointsPanelContainer .motorSideImg{background-image:url(/assets/motor_side.png)}.tsCruveContainer #sliderContainer .titleTextLoad,.tsCruveContainer #sliderContainer .titleTextMotor{font-family:Open Sans;font-size:14px;color:#6f6f6f;max-width:100px;text-align:center;display:inline-block;font-weight:700;vertical-align:middle;margin-top:-8px}.tsCruveContainer .greyClass{background-color:#f8f8f8}#motorDataContainer .contStallTorqueTitle,#motorDataContainer .inertiaTitle,#motorDataContainer .maxSpeedTitle,#motorDataContainer .pkStallTorqueTitle{font:Bold 14px Open Sans;color:#474747;display:inline}#motorDataContainer .continuousStaTorqueVal,#motorDataContainer .inertiaValue,#motorDataContainer .maxSpeedValue,#motorDataContainer .peakStaTorqueVal{font:400 14px Open Sans;color:#474747;display:inline}#motorDataContainer .unitStyle{font:400 14px Open Sans;color:#cb3434;display:inline}#tsPointsPanelContainer .unitInputLabel{color:#868686;font-size:14px}#tsPointsPanelContainer .unitLabel{font:400 14px Open Sans;color:#cb3434}#envFactorsPanelContainer input.form-control,#transmissionRatioPanelContainer input.form-control,#tsPointsPanelContainer input.form-control{font-size:14px}#motorAreaAccordionContainer #PaginationDiv span.gray-background{background-color:#eee}#transmissionRatioPanelContainer .trRatioValue{padding-left:0;padding-right:0}#transmissionRatioPanelContainer .trRatioValue .response-status{padding-left:8px;font-size:12px}#transmissionRatioPanelContainer .trRatioValue .response-status .incorrect{font-size:14px;color:#da1a33;display:inline-block}#transmissionRatioPanelContainer .trRatioValue .response-status .correct-answer{display:inline;color:#388e3c;padding-left:10px;font-weight:700;width:88%}#transmissionRatioPanelContainer .trRatioValue .response-status .correct{font-size:14px;color:#7DC27D;display:inline-block;width:12%}#transmissionRatioPanelContainer .trRatioSlider{margin-top:5px}#transmissionRatioPanelContainer .trRatioSlider .transmContainer{height:15px;width:260px;background-color:#fff}#transmissionRatioPanelContainer .trRatioSlider .transmInnerContainer{width:2860px}#transmissionRatioPanelContainer .trRatioSlider .transmLabel{height:20px;width:260px;background-color:#fff}#transmissionRatioPanelContainer .trRatioSlider .transmLabel li{display:inline;font-weight:700;font-size:11px}#transmissionRatioPanelContainer .trRatioSlider .transmLabel li.fourthLi{position:absolute;min-width:14px;left:230px}#transmissionRatioPanelContainer .trRatioSlider .transmLabel li.thirdLi{position:absolute;min-width:14px;left:160px}#transmissionRatioPanelContainer .trRatioSlider .transmLabel li.secondLi{position:absolute;min-width:14px;left:94px}#transmissionRatioPanelContainer .trRatioSlider .transmLabel li.firstLi{position:absolute;min-width:14px;left:28px}#tsPointsPanelContainer .row{display:flex;justify-content:center}#tsPointsPanelContainer .fa,.tsCruveContainer #transmissionRatioPanelContainer .transmissionRaioVal{display:inline}.tsCruveContainer .cosmatt-unitComboBox .btn-group{font-family:Open sans-serif}.tsCruveContainer .cosmatt-unitComboBox .btn-group>.btn+.dropdown-toggle{padding-top:3px}.tsCruveContainer .cosmatt-unitComboBox .btn-group>.btn:first-child{font-family:Open Sans;min-width:60px;padding-right:5px;text-overflow:ellipsis;padding-left:10px;overflow:hidden;width:79px}.tsCruveContainer .cosmatt-unitComboBox .dropdown-item{font-family:Open Sans}.cosmatt-unitComboBox .unitTextBox .spinner.input-group input{min-width:60px}.tsCruveContainer .row.vertical-divider>div[class^=col-]{border-right:1px solid #DDD}.tsCruveContainer .row.vertical-divider div[class^=col-]:first-child{border-left:none;border-right:none}.tsCruveContainer .row.vertical-divider div[class^=col-]:last-child{border-right:none}.tsCruveContainer .row.vertical-divider.row-height{height:46px}.tsCruveContainer #collapseTwo1 .panel-body{padding-top:20px}.transmContainer .mCSB_scrollTools.mCSB_scrollTools_horizontal{top:0}.trRatioValue .transInputBox{width:60%;height:28px;display:inline;border-radius:4px!important}.tsCruveContainer .trRatioSlider .mCS-rounded-dark.mCSB_scrollTools .mCSB_buttonLeft,.tsCruveContainer .trRatioSlider .mCS-rounded-dark.mCSB_scrollTools .mCSB_buttonRight,.tsCruveContainer .trRatioSlider .mCSB_scrollTools{opacity:initial}.tsCruveContainer .trRatioSlider .mCSB_dragger .mCSB_dragger_bar{width:12px;height:12px;margin-top:2px;background:linear-gradient(#1799db,#0683c2)}.tsCruveContainer .trRatioSlider .mCSB_dragger .mCSB_dragger_bar:hover{background:linear-gradient(#1276a9,#056596)}.tsCruveContainer .trRatioSlider .mCSB_scrollTools .mCSB_buttonLeft{background-position:0 -113px}.tsCruveContainer .trRatioSlider .mCSB_scrollTools .mCSB_buttonRight{background-position:0 -129px}.tsCruveContainer .trRatioSlider .mCSB_scrollTools .mCSB_buttonLeft:hover{background-position:-80px -113px}.tsCruveContainer .trRatioSlider .mCSB_scrollTools .mCSB_buttonRight:hover{background-position:-80px -129px}#tsPointsPanelContainer .response-status{padding-left:5px;min-width:50px;text-overflow:ellipsis;overflow:hidden;align-self:center;width:80px}@media (min-width:1024px) and (max-width:1280px){.tsCruveContainer .solutionInfoContainer{margin-left:-9px}#envFactorsPanelContainer .title,#motorDataContainer .title,#transmissionRatioPanelContainer .title,.tsCruveContainer #motorAreaAccordionContainer #tsPointsPanelContainer .title{padding-left:20px}}/*******************************************************\r\n * \r\n * ----------------------\r\n * Engine Renderer Styles\r\n * ----------------------\r\n *\r\n * These styles do not include any product-specific branding\r\n * and/or layout / design. They represent minimal structural\r\n * CSS which is necessary for a default rendering of an\r\n * MCQSC activity\r\n *\r\n * The styles are linked/depending on the presence of\r\n * certain elements (classes / ids / tags) in the DOM (as would\r\n * be injected via a valid MCQSC layout HTML and/or dynamically\r\n * created by the MCQSC engine JS)\r\n *\r\n *\r\n *******************************************************/\r\n');

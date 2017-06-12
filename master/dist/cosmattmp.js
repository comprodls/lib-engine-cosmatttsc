/**
 * @license RequireJS text 2.0.7 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    'use strict';

    var text, fs, Cc, Ci,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.7',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                errback(e);
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes,
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');

        text.get = function (url, callback) {
            var inStream, convertStream,
                readData = {},
                fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!../html/cosmattmp.html',[],function () { return '\r\n<!-- Engine Renderer Template -->\r\n\r\n<div class="cosmattmp-body" id="cosmattmp-engine"> \r\n   <div class="row" rv-each-interact="content.interactions | propertyList">   \r\n      <div class="col-sm-12">      \r\n         <div class="form">      \r\n <!-- Paint the instructions or question text -->    \r\n            <div rv-text="content.canvas.data.questiondata | appendInteraction %interact%"></div>     \r\n\t\t\t<!-- Paint the options -->\r\n            <img rv-src="content.stimulus.mediaContent" class="col-sm-6 cosmattmp-img" rv-show="isMCQImageEngine"></img>\r\n            <ul class="list-unstyled nested-list col-sm-6">        \r\n               <li rv-each-element="content.interactions | getArray interact.key">\r\n                  <label class="radio radio-lg">\r\n \t\t\t\t\t <!-- Placeholder for radio buttons-->   \r\n                     <i></i>\r\n                     <span class="answer" class="invisible wrong pull-left"></span>\r\n                     <input type="radio" name="optionsRadios" class="option" id="option" rv-value="element.customAttribs.value">\r\n                     <span class="content" rv-text="element.customAttribs.value"></span>\r\n                  </label>\r\n               </li>                \r\n            </ul> \r\n         </div>   \r\n      </div>  \r\n   </div>\r\n   <div class="row">\r\n      <div class="col-sm-12">\r\n         <div rv-show="showFeedback.correct" rv-text="feedback.global.correct"></div>\r\n         <div rv-show="showFeedback.incorrect" rv-text="feedback.global.incorrect"></div>\r\n         <div rv-show="showFeedback.empty" rv-text="feedback.global.empty"></div>\r\n      </div>\r\n      \r\n   </div>\r\n</div>';});

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


define('css!../css/cosmattmp',[],function(){});
(function() {
  // Public sightglass interface.
  function sightglass(obj, keypath, callback, options) {
    return new Observer(obj, keypath, callback, options)
  }

  // Batteries not included.
  sightglass.adapters = {}

  // Constructs a new keypath observer and kicks things off.
  function Observer(obj, keypath, callback, options) {
    this.options = options || {}
    this.options.adapters = this.options.adapters || {}
    this.obj = obj
    this.keypath = keypath
    this.callback = callback
    this.objectPath = []
    this.update = this.update.bind(this)
    this.parse()

    if (isObject(this.target = this.realize())) {
      this.set(true, this.key, this.target, this.callback)
    }
  }

  // Tokenizes the provided keypath string into interface + path tokens for the
  // observer to work with.
  Observer.tokenize = function(keypath, interfaces, root) {
    var tokens = []
    var current = {i: root, path: ''}
    var index, chr

    for (index = 0; index < keypath.length; index++) {
      chr = keypath.charAt(index)

      if (!!~interfaces.indexOf(chr)) {
        tokens.push(current)
        current = {i: chr, path: ''}
      } else {
        current.path += chr
      }
    }

    tokens.push(current)
    return tokens
  }

  // Parses the keypath using the interfaces defined on the view. Sets variables
  // for the tokenized keypath as well as the end key.
  Observer.prototype.parse = function() {
    var interfaces = this.interfaces()
    var root, path

    if (!interfaces.length) {
      error('Must define at least one adapter interface.')
    }

    if (!!~interfaces.indexOf(this.keypath[0])) {
      root = this.keypath[0]
      path = this.keypath.substr(1)
    } else {
      if (typeof (root = this.options.root || sightglass.root) === 'undefined') {
        error('Must define a default root adapter.')
      }

      path = this.keypath
    }

    this.tokens = Observer.tokenize(path, interfaces, root)
    this.key = this.tokens.pop()
  }

  // Realizes the full keypath, attaching observers for every key and correcting
  // old observers to any changed objects in the keypath.
  Observer.prototype.realize = function() {
    var current = this.obj
    var unreached = false
    var prev

    this.tokens.forEach(function(token, index) {
      if (isObject(current)) {
        if (typeof this.objectPath[index] !== 'undefined') {
          if (current !== (prev = this.objectPath[index])) {
            this.set(false, token, prev, this.update)
            this.set(true, token, current, this.update)
            this.objectPath[index] = current
          }
        } else {
          this.set(true, token, current, this.update)
          this.objectPath[index] = current
        }

        current = this.get(token, current)
      } else {
        if (unreached === false) {
          unreached = index
        }

        if (prev = this.objectPath[index]) {
          this.set(false, token, prev, this.update)
        }
      }
    }, this)

    if (unreached !== false) {
      this.objectPath.splice(unreached)
    }

    return current
  }

  // Updates the keypath. This is called when any intermediary key is changed.
  Observer.prototype.update = function() {
    var next, oldValue

    if ((next = this.realize()) !== this.target) {
      if (isObject(this.target)) {
        this.set(false, this.key, this.target, this.callback)
      }

      if (isObject(next)) {
        this.set(true, this.key, next, this.callback)
      }

      oldValue = this.value()
      this.target = next

      // Always call callback if value is a function. If not a function, call callback only if value changed
      if (this.value() instanceof Function || this.value() !== oldValue) this.callback()
    }
  }

  // Reads the current end value of the observed keypath. Returns undefined if
  // the full keypath is unreachable.
  Observer.prototype.value = function() {
    if (isObject(this.target)) {
      return this.get(this.key, this.target)
    }
  }

  // Sets the current end value of the observed keypath. Calling setValue when
  // the full keypath is unreachable is a no-op.
  Observer.prototype.setValue = function(value) {
    if (isObject(this.target)) {
      this.adapter(this.key).set(this.target, this.key.path, value)
    }
  }

  // Gets the provided key on an object.
  Observer.prototype.get = function(key, obj) {
    return this.adapter(key).get(obj, key.path)
  }

  // Observes or unobserves a callback on the object using the provided key.
  Observer.prototype.set = function(active, key, obj, callback) {
    var action = active ? 'observe' : 'unobserve'
    this.adapter(key)[action](obj, key.path, callback)
  }

  // Returns an array of all unique adapter interfaces available.
  Observer.prototype.interfaces = function() {
    var interfaces = Object.keys(this.options.adapters)

    Object.keys(sightglass.adapters).forEach(function(i) {
      if (!~interfaces.indexOf(i)) {
        interfaces.push(i)
      }
    })

    return interfaces
  }

  // Convenience function to grab the adapter for a specific key.
  Observer.prototype.adapter = function(key) {
    return this.options.adapters[key.i] ||
      sightglass.adapters[key.i]
  }

  // Unobserves the entire keypath.
  Observer.prototype.unobserve = function() {
    var obj

    this.tokens.forEach(function(token, index) {
      if (obj = this.objectPath[index]) {
        this.set(false, token, obj, this.update)
      }
    }, this)

    if (isObject(this.target)) {
      this.set(false, this.key, this.target, this.callback)
    }
  }

  // Check if a value is an object than can be observed.
  function isObject(obj) {
    return typeof obj === 'object' && obj !== null
  }

  // Error thrower.
  function error(message) {
    throw new Error('[sightglass] ' + message)
  }

  // Export module for Node and the browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = sightglass
  } else if (typeof define === 'function' && define.amd) {
    define('sightglass',[], function() {
      return this.sightglass = sightglass
    })
  } else {
    this.sightglass = sightglass
  }
}).call(this);

// Rivets.js
// version: 0.9.6
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindMethod, jQuery, unbindMethod, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {
    options: ['prefix', 'templateDelimiters', 'rootInterface', 'preloadData', 'handler', 'executeFunctions'],
    extensions: ['binders', 'formatters', 'components', 'adapters'],
    "public": {
      binders: {},
      components: {},
      formatters: {},
      adapters: {},
      prefix: 'rv',
      templateDelimiters: ['{', '}'],
      rootInterface: '.',
      preloadData: true,
      executeFunctions: false,
      iterationAlias: function(modelName) {
        return '%' + modelName + '%';
      },
      handler: function(context, ev, binding) {
        return this.call(context, ev, binding.view.models);
      },
      configure: function(options) {
        var descriptor, key, option, value;
        if (options == null) {
          options = {};
        }
        for (option in options) {
          value = options[option];
          if (option === 'binders' || option === 'components' || option === 'formatters' || option === 'adapters') {
            for (key in value) {
              descriptor = value[key];
              Rivets[option][key] = descriptor;
            }
          } else {
            Rivets["public"][option] = value;
          }
        }
      },
      bind: function(el, models, options) {
        var view;
        if (models == null) {
          models = {};
        }
        if (options == null) {
          options = {};
        }
        view = new Rivets.View(el, models, options);
        view.bind();
        return view;
      },
      init: function(component, el, data) {
        var scope, template, view;
        if (data == null) {
          data = {};
        }
        if (el == null) {
          el = document.createElement('div');
        }
        component = Rivets["public"].components[component];
        template = component.template.call(this, el);
        if (template instanceof HTMLElement) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
          el.appendChild(template);
        } else {
          el.innerHTML = template;
        }
        scope = component.initialize.call(this, el, data);
        view = new Rivets.View(el, scope);
        view.bind();
        return view;
      }
    }
  };

  if (window['jQuery'] || window['$']) {
    jQuery = window['jQuery'] || window['$'];
    _ref = 'on' in jQuery.prototype ? ['on', 'off'] : ['bind', 'unbind'], bindMethod = _ref[0], unbindMethod = _ref[1];
    Rivets.Util = {
      bindEvent: function(el, event, handler) {
        return jQuery(el)[bindMethod](event, handler);
      },
      unbindEvent: function(el, event, handler) {
        return jQuery(el)[unbindMethod](event, handler);
      },
      getInputValue: function(el) {
        var $el;
        $el = jQuery(el);
        if ($el.attr('type') === 'checkbox') {
          return $el.is(':checked');
        } else {
          return $el.val();
        }
      }
    };
  } else {
    Rivets.Util = {
      bindEvent: (function() {
        if ('addEventListener' in window) {
          return function(el, event, handler) {
            return el.addEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.attachEvent('on' + event, handler);
        };
      })(),
      unbindEvent: (function() {
        if ('removeEventListener' in window) {
          return function(el, event, handler) {
            return el.removeEventListener(event, handler, false);
          };
        }
        return function(el, event, handler) {
          return el.detachEvent('on' + event, handler);
        };
      })(),
      getInputValue: function(el) {
        var o, _i, _len, _results;
        if (el.type === 'checkbox') {
          return el.checked;
        } else if (el.type === 'select-multiple') {
          _results = [];
          for (_i = 0, _len = el.length; _i < _len; _i++) {
            o = el[_i];
            if (o.selected) {
              _results.push(o.value);
            }
          }
          return _results;
        } else {
          return el.value;
        }
      }
    };
  }

  Rivets.TypeParser = (function() {
    function TypeParser() {}

    TypeParser.types = {
      primitive: 0,
      keypath: 1
    };

    TypeParser.parse = function(string) {
      if (/^'.*'$|^".*"$/.test(string)) {
        return {
          type: this.types.primitive,
          value: string.slice(1, -1)
        };
      } else if (string === 'true') {
        return {
          type: this.types.primitive,
          value: true
        };
      } else if (string === 'false') {
        return {
          type: this.types.primitive,
          value: false
        };
      } else if (string === 'null') {
        return {
          type: this.types.primitive,
          value: null
        };
      } else if (string === 'undefined') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (string === '') {
        return {
          type: this.types.primitive,
          value: void 0
        };
      } else if (isNaN(Number(string)) === false) {
        return {
          type: this.types.primitive,
          value: Number(string)
        };
      } else {
        return {
          type: this.types.keypath,
          value: string
        };
      }
    };

    return TypeParser;

  })();

  Rivets.TextTemplateParser = (function() {
    function TextTemplateParser() {}

    TextTemplateParser.types = {
      text: 0,
      binding: 1
    };

    TextTemplateParser.parse = function(template, delimiters) {
      var index, lastIndex, lastToken, length, substring, tokens, value;
      tokens = [];
      length = template.length;
      index = 0;
      lastIndex = 0;
      while (lastIndex < length) {
        index = template.indexOf(delimiters[0], lastIndex);
        if (index < 0) {
          tokens.push({
            type: this.types.text,
            value: template.slice(lastIndex)
          });
          break;
        } else {
          if (index > 0 && lastIndex < index) {
            tokens.push({
              type: this.types.text,
              value: template.slice(lastIndex, index)
            });
          }
          lastIndex = index + delimiters[0].length;
          index = template.indexOf(delimiters[1], lastIndex);
          if (index < 0) {
            substring = template.slice(lastIndex - delimiters[1].length);
            lastToken = tokens[tokens.length - 1];
            if ((lastToken != null ? lastToken.type : void 0) === this.types.text) {
              lastToken.value += substring;
            } else {
              tokens.push({
                type: this.types.text,
                value: substring
              });
            }
            break;
          }
          value = template.slice(lastIndex, index).trim();
          tokens.push({
            type: this.types.binding,
            value: value
          });
          lastIndex = index + delimiters[1].length;
        }
      }
      return tokens;
    };

    return TextTemplateParser;

  })();

  Rivets.View = (function() {
    function View(els, models, options) {
      var k, option, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5;
      this.els = els;
      this.models = models;
      if (options == null) {
        options = {};
      }
      this.update = __bind(this.update, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.select = __bind(this.select, this);
      this.traverse = __bind(this.traverse, this);
      this.build = __bind(this.build, this);
      this.buildBinding = __bind(this.buildBinding, this);
      this.bindingRegExp = __bind(this.bindingRegExp, this);
      this.options = __bind(this.options, this);
      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      _ref1 = Rivets.extensions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this[option] = {};
        if (options[option]) {
          _ref2 = options[option];
          for (k in _ref2) {
            v = _ref2[k];
            this[option][k] = v;
          }
        }
        _ref3 = Rivets["public"][option];
        for (k in _ref3) {
          v = _ref3[k];
          if ((_base = this[option])[k] == null) {
            _base[k] = v;
          }
        }
      }
      _ref4 = Rivets.options;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        option = _ref4[_j];
        this[option] = (_ref5 = options[option]) != null ? _ref5 : Rivets["public"][option];
      }
      this.build();
    }

    View.prototype.options = function() {
      var option, options, _i, _len, _ref1;
      options = {};
      _ref1 = Rivets.extensions.concat(Rivets.options);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        options[option] = this[option];
      }
      return options;
    };

    View.prototype.bindingRegExp = function() {
      return new RegExp("^" + this.prefix + "-");
    };

    View.prototype.buildBinding = function(binding, node, type, declaration) {
      var context, ctx, dependencies, keypath, options, pipe, pipes;
      options = {};
      pipes = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = declaration.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          pipe = _ref1[_i];
          _results.push(pipe.trim());
        }
        return _results;
      })();
      context = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = pipes.shift().split('<');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ctx = _ref1[_i];
          _results.push(ctx.trim());
        }
        return _results;
      })();
      keypath = context.shift();
      options.formatters = pipes;
      if (dependencies = context.shift()) {
        options.dependencies = dependencies.split(/\s+/);
      }
      return this.bindings.push(new Rivets[binding](this, node, type, keypath, options));
    };

    View.prototype.build = function() {
      var el, parse, _i, _len, _ref1;
      this.bindings = [];
      parse = (function(_this) {
        return function(node) {
          var block, childNode, delimiters, n, parser, text, token, tokens, _i, _j, _len, _len1, _ref1;
          if (node.nodeType === 3) {
            parser = Rivets.TextTemplateParser;
            if (delimiters = _this.templateDelimiters) {
              if ((tokens = parser.parse(node.data, delimiters)).length) {
                if (!(tokens.length === 1 && tokens[0].type === parser.types.text)) {
                  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
                    token = tokens[_i];
                    text = document.createTextNode(token.value);
                    node.parentNode.insertBefore(text, node);
                    if (token.type === 1) {
                      _this.buildBinding('TextBinding', text, null, token.value);
                    }
                  }
                  node.parentNode.removeChild(node);
                }
              }
            }
          } else if (node.nodeType === 1) {
            block = _this.traverse(node);
          }
          if (!block) {
            _ref1 = (function() {
              var _k, _len1, _ref1, _results;
              _ref1 = node.childNodes;
              _results = [];
              for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
                n = _ref1[_k];
                _results.push(n);
              }
              return _results;
            })();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              childNode = _ref1[_j];
              parse(childNode);
            }
          }
        };
      })(this);
      _ref1 = this.els;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        parse(el);
      }
      this.bindings.sort(function(a, b) {
        var _ref2, _ref3;
        return (((_ref2 = b.binder) != null ? _ref2.priority : void 0) || 0) - (((_ref3 = a.binder) != null ? _ref3.priority : void 0) || 0);
      });
    };

    View.prototype.traverse = function(node) {
      var attribute, attributes, binder, bindingRegExp, block, identifier, regexp, type, value, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
      bindingRegExp = this.bindingRegExp();
      block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE';
      _ref1 = node.attributes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          if (!(binder = this.binders[type])) {
            _ref2 = this.binders;
            for (identifier in _ref2) {
              value = _ref2[identifier];
              if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
                if (regexp.test(type)) {
                  binder = value;
                }
              }
            }
          }
          binder || (binder = this.binders['*']);
          if (binder.block) {
            block = true;
            attributes = [attribute];
          }
        }
      }
      _ref3 = attributes || node.attributes;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        attribute = _ref3[_j];
        if (bindingRegExp.test(attribute.name)) {
          type = attribute.name.replace(bindingRegExp, '');
          this.buildBinding('Binding', node, type, attribute.value);
        }
      }
      if (!block) {
        type = node.nodeName.toLowerCase();
        if (this.components[type] && !node._bound) {
          this.bindings.push(new Rivets.ComponentBinding(this, node, type));
          block = true;
        }
      }
      return block;
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref1, _results;
      _ref1 = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.bind();
      }
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.unbind();
      }
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.sync === "function") {
          binding.sync();
        }
      }
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref1;
      _ref1 = this.select(function(b) {
        var _ref1;
        return (_ref1 = b.binder) != null ? _ref1.publishes : void 0;
      });
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        binding.publish();
      }
    };

    View.prototype.update = function(models) {
      var binding, key, model, _i, _len, _ref1;
      if (models == null) {
        models = {};
      }
      for (key in models) {
        model = models[key];
        this.models[key] = model;
      }
      _ref1 = this.bindings;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        binding = _ref1[_i];
        if (typeof binding.update === "function") {
          binding.update(models);
        }
      }
    };

    return View;

  })();

  Rivets.Binding = (function() {
    function Binding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.getValue = __bind(this.getValue, this);
      this.update = __bind(this.update, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.publish = __bind(this.publish, this);
      this.sync = __bind(this.sync, this);
      this.set = __bind(this.set, this);
      this.eventHandler = __bind(this.eventHandler, this);
      this.formattedValue = __bind(this.formattedValue, this);
      this.parseFormatterArguments = __bind(this.parseFormatterArguments, this);
      this.parseTarget = __bind(this.parseTarget, this);
      this.observe = __bind(this.observe, this);
      this.setBinder = __bind(this.setBinder, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
      this.model = void 0;
      this.setBinder();
    }

    Binding.prototype.setBinder = function() {
      var identifier, regexp, value, _ref1;
      if (!(this.binder = this.view.binders[this.type])) {
        _ref1 = this.view.binders;
        for (identifier in _ref1) {
          value = _ref1[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace(/\*/g, '.+')) + "$");
            if (regexp.test(this.type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace(/\*/g, '(.+)')) + "$").exec(this.type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = this.view.binders['*']);
      if (this.binder instanceof Function) {
        return this.binder = {
          routine: this.binder
        };
      }
    };

    Binding.prototype.observe = function(obj, keypath, callback) {
      return Rivets.sightglass(obj, keypath, callback, {
        root: this.view.rootInterface,
        adapters: this.view.adapters
      });
    };

    Binding.prototype.parseTarget = function() {
      var token;
      token = Rivets.TypeParser.parse(this.keypath);
      if (token.type === Rivets.TypeParser.types.primitive) {
        return this.value = token.value;
      } else {
        this.observer = this.observe(this.view.models, this.keypath, this.sync);
        return this.model = this.observer.target;
      }
    };

    Binding.prototype.parseFormatterArguments = function(args, formatterIndex) {
      var ai, arg, observer, processedArgs, _base, _i, _len;
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(Rivets.TypeParser.parse(arg));
        }
        return _results;
      })();
      processedArgs = [];
      for (ai = _i = 0, _len = args.length; _i < _len; ai = ++_i) {
        arg = args[ai];
        processedArgs.push(arg.type === Rivets.TypeParser.types.primitive ? arg.value : ((_base = this.formatterObservers)[formatterIndex] || (_base[formatterIndex] = {}), !(observer = this.formatterObservers[formatterIndex][ai]) ? (observer = this.observe(this.view.models, arg.value, this.sync), this.formatterObservers[formatterIndex][ai] = observer) : void 0, observer.value()));
      }
      return processedArgs;
    };

    Binding.prototype.formattedValue = function(value) {
      var args, fi, formatter, id, processedArgs, _i, _len, _ref1, _ref2;
      _ref1 = this.formatters;
      for (fi = _i = 0, _len = _ref1.length; _i < _len; fi = ++_i) {
        formatter = _ref1[fi];
        args = formatter.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g);
        id = args.shift();
        formatter = this.view.formatters[id];
        processedArgs = this.parseFormatterArguments(args, fi);
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = (_ref2 = formatter.read).call.apply(_ref2, [this.model, value].concat(__slice.call(processedArgs)));
        } else if (formatter instanceof Function) {
          value = formatter.call.apply(formatter, [this.model, value].concat(__slice.call(processedArgs)));
        }
      }
      return value;
    };

    Binding.prototype.eventHandler = function(fn) {
      var binding, handler;
      handler = (binding = this).view.handler;
      return function(ev) {
        return handler.call(fn, this, ev, binding);
      };
    };

    Binding.prototype.set = function(value) {
      var _ref1;
      value = value instanceof Function && !this.binder["function"] && Rivets["public"].executeFunctions ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref1 = this.binder.routine) != null ? _ref1.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      var dependency, observer;
      return this.set((function() {
        var _i, _j, _len, _len1, _ref1, _ref2, _ref3;
        if (this.observer) {
          if (this.model !== this.observer.target) {
            _ref1 = this.dependencies;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              observer = _ref1[_i];
              observer.unobserve();
            }
            this.dependencies = [];
            if (((this.model = this.observer.target) != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
              _ref3 = this.options.dependencies;
              for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                dependency = _ref3[_j];
                observer = this.observe(this.model, dependency, this.sync);
                this.dependencies.push(observer);
              }
            }
          }
          return this.observer.value();
        } else {
          return this.value;
        }
      }).call(this));
    };

    Binding.prototype.publish = function() {
      var args, fi, fiReversed, formatter, id, lastformatterIndex, processedArgs, value, _i, _len, _ref1, _ref2, _ref3;
      if (this.observer) {
        value = this.getValue(this.el);
        lastformatterIndex = this.formatters.length - 1;
        _ref1 = this.formatters.slice(0).reverse();
        for (fiReversed = _i = 0, _len = _ref1.length; _i < _len; fiReversed = ++_i) {
          formatter = _ref1[fiReversed];
          fi = lastformatterIndex - fiReversed;
          args = formatter.split(/\s+/);
          id = args.shift();
          processedArgs = this.parseFormatterArguments(args, fi);
          if ((_ref2 = this.view.formatters[id]) != null ? _ref2.publish : void 0) {
            value = (_ref3 = this.view.formatters[id]).publish.apply(_ref3, [value].concat(__slice.call(processedArgs)));
          }
        }
        return this.observer.setValue(value);
      }
    };

    Binding.prototype.bind = function() {
      var dependency, observer, _i, _len, _ref1, _ref2, _ref3;
      this.parseTarget();
      if ((_ref1 = this.binder.bind) != null) {
        _ref1.call(this, this.el);
      }
      if ((this.model != null) && ((_ref2 = this.options.dependencies) != null ? _ref2.length : void 0)) {
        _ref3 = this.options.dependencies;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          dependency = _ref3[_i];
          observer = this.observe(this.model, dependency, this.sync);
          this.dependencies.push(observer);
        }
      }
      if (this.view.preloadData) {
        return this.sync();
      }
    };

    Binding.prototype.unbind = function() {
      var ai, args, fi, observer, _i, _len, _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.binder.unbind) != null) {
        _ref1.call(this, this.el);
      }
      if ((_ref2 = this.observer) != null) {
        _ref2.unobserve();
      }
      _ref3 = this.dependencies;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        observer = _ref3[_i];
        observer.unobserve();
      }
      this.dependencies = [];
      _ref4 = this.formatterObservers;
      for (fi in _ref4) {
        args = _ref4[fi];
        for (ai in args) {
          observer = args[ai];
          observer.unobserve();
        }
      }
      return this.formatterObservers = {};
    };

    Binding.prototype.update = function(models) {
      var _ref1, _ref2;
      if (models == null) {
        models = {};
      }
      this.model = (_ref1 = this.observer) != null ? _ref1.target : void 0;
      return (_ref2 = this.binder.update) != null ? _ref2.call(this, models) : void 0;
    };

    Binding.prototype.getValue = function(el) {
      if (this.binder && (this.binder.getValue != null)) {
        return this.binder.getValue.call(this, el);
      } else {
        return Rivets.Util.getInputValue(el);
      }
    };

    return Binding;

  })();

  Rivets.ComponentBinding = (function(_super) {
    __extends(ComponentBinding, _super);

    function ComponentBinding(view, el, type) {
      var attribute, bindingRegExp, propertyName, token, _i, _len, _ref1, _ref2;
      this.view = view;
      this.el = el;
      this.type = type;
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.locals = __bind(this.locals, this);
      this.component = this.view.components[this.type];
      this["static"] = {};
      this.observers = {};
      this.upstreamObservers = {};
      bindingRegExp = view.bindingRegExp();
      _ref1 = this.el.attributes || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attribute = _ref1[_i];
        if (!bindingRegExp.test(attribute.name)) {
          propertyName = this.camelCase(attribute.name);
          token = Rivets.TypeParser.parse(attribute.value);
          if (__indexOf.call((_ref2 = this.component["static"]) != null ? _ref2 : [], propertyName) >= 0) {
            this["static"][propertyName] = attribute.value;
          } else if (token.type === Rivets.TypeParser.types.primitive) {
            this["static"][propertyName] = token.value;
          } else {
            this.observers[propertyName] = attribute.value;
          }
        }
      }
    }

    ComponentBinding.prototype.sync = function() {};

    ComponentBinding.prototype.update = function() {};

    ComponentBinding.prototype.publish = function() {};

    ComponentBinding.prototype.locals = function() {
      var key, observer, result, value, _ref1, _ref2;
      result = {};
      _ref1 = this["static"];
      for (key in _ref1) {
        value = _ref1[key];
        result[key] = value;
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        result[key] = observer.value();
      }
      return result;
    };

    ComponentBinding.prototype.camelCase = function(string) {
      return string.replace(/-([a-z])/g, function(grouped) {
        return grouped[1].toUpperCase();
      });
    };

    ComponentBinding.prototype.bind = function() {
      var k, key, keypath, observer, option, options, scope, v, _base, _i, _j, _len, _len1, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (!this.bound) {
        _ref1 = this.observers;
        for (key in _ref1) {
          keypath = _ref1[key];
          this.observers[key] = this.observe(this.view.models, keypath, ((function(_this) {
            return function(key) {
              return function() {
                return _this.componentView.models[key] = _this.observers[key].value();
              };
            };
          })(this)).call(this, key));
        }
        this.bound = true;
      }
      if (this.componentView != null) {
        this.componentView.bind();
      } else {
        this.el.innerHTML = this.component.template.call(this);
        scope = this.component.initialize.call(this, this.el, this.locals());
        this.el._bound = true;
        options = {};
        _ref2 = Rivets.extensions;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          option = _ref2[_i];
          options[option] = {};
          if (this.component[option]) {
            _ref3 = this.component[option];
            for (k in _ref3) {
              v = _ref3[k];
              options[option][k] = v;
            }
          }
          _ref4 = this.view[option];
          for (k in _ref4) {
            v = _ref4[k];
            if ((_base = options[option])[k] == null) {
              _base[k] = v;
            }
          }
        }
        _ref5 = Rivets.options;
        for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
          option = _ref5[_j];
          options[option] = (_ref6 = this.component[option]) != null ? _ref6 : this.view[option];
        }
        this.componentView = new Rivets.View(Array.prototype.slice.call(this.el.childNodes), scope, options);
        this.componentView.bind();
        _ref7 = this.observers;
        for (key in _ref7) {
          observer = _ref7[key];
          this.upstreamObservers[key] = this.observe(this.componentView.models, key, ((function(_this) {
            return function(key, observer) {
              return function() {
                return observer.setValue(_this.componentView.models[key]);
              };
            };
          })(this)).call(this, key, observer));
        }
      }
    };

    ComponentBinding.prototype.unbind = function() {
      var key, observer, _ref1, _ref2, _ref3;
      _ref1 = this.upstreamObservers;
      for (key in _ref1) {
        observer = _ref1[key];
        observer.unobserve();
      }
      _ref2 = this.observers;
      for (key in _ref2) {
        observer = _ref2[key];
        observer.unobserve();
      }
      return (_ref3 = this.componentView) != null ? _ref3.unbind.call(this) : void 0;
    };

    return ComponentBinding;

  })(Rivets.Binding);

  Rivets.TextBinding = (function(_super) {
    __extends(TextBinding, _super);

    function TextBinding(view, el, type, keypath, options) {
      this.view = view;
      this.el = el;
      this.type = type;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.sync = __bind(this.sync, this);
      this.formatters = this.options.formatters || [];
      this.dependencies = [];
      this.formatterObservers = {};
    }

    TextBinding.prototype.binder = {
      routine: function(node, value) {
        return node.data = value != null ? value : '';
      }
    };

    TextBinding.prototype.sync = function() {
      return TextBinding.__super__.sync.apply(this, arguments);
    };

    return TextBinding;

  })(Rivets.Binding);

  Rivets["public"].binders.text = function(el, value) {
    if (el.textContent != null) {
      return el.textContent = value != null ? value : '';
    } else {
      return el.innerText = value != null ? value : '';
    }
  };

  Rivets["public"].binders.html = function(el, value) {
    return el.innerHTML = value != null ? value : '';
  };

  Rivets["public"].binders.show = function(el, value) {
    return el.style.display = value ? '' : 'none';
  };

  Rivets["public"].binders.hide = function(el, value) {
    return el.style.display = value ? 'none' : '';
  };

  Rivets["public"].binders.enabled = function(el, value) {
    return el.disabled = !value;
  };

  Rivets["public"].binders.disabled = function(el, value) {
    return el.disabled = !!value;
  };

  Rivets["public"].binders.checked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) === (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !!value;
      }
    }
  };

  Rivets["public"].binders.unchecked = {
    publishes: true,
    priority: 2000,
    bind: function(el) {
      return Rivets.Util.bindEvent(el, 'change', this.publish);
    },
    unbind: function(el) {
      return Rivets.Util.unbindEvent(el, 'change', this.publish);
    },
    routine: function(el, value) {
      var _ref1;
      if (el.type === 'radio') {
        return el.checked = ((_ref1 = el.value) != null ? _ref1.toString() : void 0) !== (value != null ? value.toString() : void 0);
      } else {
        return el.checked = !value;
      }
    }
  };

  Rivets["public"].binders.value = {
    publishes: true,
    priority: 3000,
    bind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        this.event = el.tagName === 'SELECT' ? 'change' : 'input';
        return Rivets.Util.bindEvent(el, this.event, this.publish);
      }
    },
    unbind: function(el) {
      if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
        return Rivets.Util.unbindEvent(el, this.event, this.publish);
      }
    },
    routine: function(el, value) {
      var o, _i, _len, _ref1, _ref2, _ref3, _results;
      if (el.tagName === 'INPUT' && el.type === 'radio') {
        return el.setAttribute('value', value);
      } else if (window.jQuery != null) {
        el = jQuery(el);
        if ((value != null ? value.toString() : void 0) !== ((_ref1 = el.val()) != null ? _ref1.toString() : void 0)) {
          return el.val(value != null ? value : '');
        }
      } else {
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref2 = o.value, __indexOf.call(value, _ref2) >= 0));
            }
            return _results;
          }
        } else if ((value != null ? value.toString() : void 0) !== ((_ref3 = el.value) != null ? _ref3.toString() : void 0)) {
          return el.value = value != null ? value : '';
        }
      }
    }
  };

  Rivets["public"].binders["if"] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, declaration;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        declaration = el.getAttribute(attr);
        this.marker = document.createComment(" rivets: " + this.type + " " + declaration + " ");
        this.bound = false;
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        return el.parentNode.removeChild(el);
      }
    },
    unbind: function() {
      if (this.nested) {
        this.nested.unbind();
        return this.bound = false;
      }
    },
    routine: function(el, value) {
      var key, model, models, _ref1;
      if (!!value === !this.bound) {
        if (value) {
          models = {};
          _ref1 = this.view.models;
          for (key in _ref1) {
            model = _ref1[key];
            models[key] = model;
          }
          (this.nested || (this.nested = new Rivets.View(el, models, this.view.options()))).bind();
          this.marker.parentNode.insertBefore(el, this.marker.nextSibling);
          return this.bound = true;
        } else {
          el.parentNode.removeChild(el);
          this.nested.unbind();
          return this.bound = false;
        }
      }
    },
    update: function(models) {
      var _ref1;
      return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
    }
  };

  Rivets["public"].binders.unless = {
    block: true,
    priority: 4000,
    bind: function(el) {
      return Rivets["public"].binders["if"].bind.call(this, el);
    },
    unbind: function() {
      return Rivets["public"].binders["if"].unbind.call(this);
    },
    routine: function(el, value) {
      return Rivets["public"].binders["if"].routine.call(this, el, !value);
    },
    update: function(models) {
      return Rivets["public"].binders["if"].update.call(this, models);
    }
  };

  Rivets["public"].binders['on-*'] = {
    "function": true,
    priority: 1000,
    unbind: function(el) {
      if (this.handler) {
        return Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
    },
    routine: function(el, value) {
      if (this.handler) {
        Rivets.Util.unbindEvent(el, this.args[0], this.handler);
      }
      return Rivets.Util.bindEvent(el, this.args[0], this.handler = this.eventHandler(value));
    }
  };

  Rivets["public"].binders['each-*'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
      var attr, view, _i, _len, _ref1;
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.bind();
        }
      }
    },
    unbind: function(el) {
      var view, _i, _len, _ref1;
      if (this.iterated != null) {
        _ref1 = this.iterated;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          view.unbind();
        }
      }
    },
    routine: function(el, collection) {
      var binding, data, i, index, key, model, modelName, options, previous, template, view, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      modelName = this.args[0];
      collection = collection || [];
      if (this.iterated.length > collection.length) {
        _ref1 = Array(this.iterated.length - collection.length);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          view = this.iterated.pop();
          view.unbind();
          this.marker.parentNode.removeChild(view.els[0]);
        }
      }
      for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
        model = collection[index];
        data = {
          index: index
        };
        data[Rivets["public"].iterationAlias(modelName)] = index;
        data[modelName] = model;
        if (this.iterated[index] == null) {
          _ref2 = this.view.models;
          for (key in _ref2) {
            model = _ref2[key];
            if (data[key] == null) {
              data[key] = model;
            }
          }
          previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
          options = this.view.options();
          options.preloadData = true;
          template = el.cloneNode(true);
          view = new Rivets.View(template, data, options);
          view.bind();
          this.iterated.push(view);
          this.marker.parentNode.insertBefore(template, previous.nextSibling);
        } else if (this.iterated[index].models[modelName] !== model) {
          this.iterated[index].update(data);
        }
      }
      if (el.nodeName === 'OPTION') {
        _ref3 = this.view.bindings;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          binding = _ref3[_k];
          if (binding.el === this.marker.parentNode && binding.type === 'value') {
            binding.sync();
          }
        }
      }
    },
    update: function(models) {
      var data, key, model, view, _i, _len, _ref1;
      data = {};
      for (key in models) {
        model = models[key];
        if (key !== this.args[0]) {
          data[key] = model;
        }
      }
      _ref1 = this.iterated;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.update(data);
      }
    }
  };

  Rivets["public"].binders['class-*'] = function(el, value) {
    var elClass;
    elClass = " " + el.className + " ";
    if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
      return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
    }
  };

  Rivets["public"].binders['*'] = function(el, value) {
    if (value != null) {
      return el.setAttribute(this.type, value);
    } else {
      return el.removeAttribute(this.type);
    }
  };

  Rivets["public"].formatters['call'] = function() {
    var args, value;
    value = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return value.call.apply(value, [this].concat(__slice.call(args)));
  };

  Rivets["public"].adapters['.'] = {
    id: '_rv',
    counter: 0,
    weakmap: {},
    weakReference: function(obj) {
      var id, _base, _name;
      if (!obj.hasOwnProperty(this.id)) {
        id = this.counter++;
        Object.defineProperty(obj, this.id, {
          value: id
        });
      }
      return (_base = this.weakmap)[_name = obj[this.id]] || (_base[_name] = {
        callbacks: {}
      });
    },
    cleanupWeakReference: function(ref, id) {
      if (!Object.keys(ref.callbacks).length) {
        if (!(ref.pointers && Object.keys(ref.pointers).length)) {
          return delete this.weakmap[id];
        }
      }
    },
    stubFunction: function(obj, fn) {
      var map, original, weakmap;
      original = obj[fn];
      map = this.weakReference(obj);
      weakmap = this.weakmap;
      return obj[fn] = function() {
        var callback, k, r, response, _i, _len, _ref1, _ref2, _ref3, _ref4;
        response = original.apply(obj, arguments);
        _ref1 = map.pointers;
        for (r in _ref1) {
          k = _ref1[r];
          _ref4 = (_ref2 = (_ref3 = weakmap[r]) != null ? _ref3.callbacks[k] : void 0) != null ? _ref2 : [];
          for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
            callback = _ref4[_i];
            callback();
          }
        }
        return response;
      };
    },
    observeMutations: function(obj, ref, keypath) {
      var fn, functions, map, _base, _i, _len;
      if (Array.isArray(obj)) {
        map = this.weakReference(obj);
        if (map.pointers == null) {
          map.pointers = {};
          functions = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
          for (_i = 0, _len = functions.length; _i < _len; _i++) {
            fn = functions[_i];
            this.stubFunction(obj, fn);
          }
        }
        if ((_base = map.pointers)[ref] == null) {
          _base[ref] = [];
        }
        if (__indexOf.call(map.pointers[ref], keypath) < 0) {
          return map.pointers[ref].push(keypath);
        }
      }
    },
    unobserveMutations: function(obj, ref, keypath) {
      var idx, map, pointers;
      if (Array.isArray(obj) && (obj[this.id] != null)) {
        if (map = this.weakmap[obj[this.id]]) {
          if (pointers = map.pointers[ref]) {
            if ((idx = pointers.indexOf(keypath)) >= 0) {
              pointers.splice(idx, 1);
            }
            if (!pointers.length) {
              delete map.pointers[ref];
            }
            return this.cleanupWeakReference(map, obj[this.id]);
          }
        }
      }
    },
    observe: function(obj, keypath, callback) {
      var callbacks, desc, value;
      callbacks = this.weakReference(obj).callbacks;
      if (callbacks[keypath] == null) {
        callbacks[keypath] = [];
        desc = Object.getOwnPropertyDescriptor(obj, keypath);
        if (!((desc != null ? desc.get : void 0) || (desc != null ? desc.set : void 0))) {
          value = obj[keypath];
          Object.defineProperty(obj, keypath, {
            enumerable: true,
            get: function() {
              return value;
            },
            set: (function(_this) {
              return function(newValue) {
                var cb, map, _i, _len, _ref1;
                if (newValue !== value) {
                  _this.unobserveMutations(value, obj[_this.id], keypath);
                  value = newValue;
                  if (map = _this.weakmap[obj[_this.id]]) {
                    callbacks = map.callbacks;
                    if (callbacks[keypath]) {
                      _ref1 = callbacks[keypath].slice();
                      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        cb = _ref1[_i];
                        if (__indexOf.call(callbacks[keypath], cb) >= 0) {
                          cb();
                        }
                      }
                    }
                    return _this.observeMutations(newValue, obj[_this.id], keypath);
                  }
                }
              };
            })(this)
          });
        }
      }
      if (__indexOf.call(callbacks[keypath], callback) < 0) {
        callbacks[keypath].push(callback);
      }
      return this.observeMutations(obj[keypath], obj[this.id], keypath);
    },
    unobserve: function(obj, keypath, callback) {
      var callbacks, idx, map;
      if (map = this.weakmap[obj[this.id]]) {
        if (callbacks = map.callbacks[keypath]) {
          if ((idx = callbacks.indexOf(callback)) >= 0) {
            callbacks.splice(idx, 1);
            if (!callbacks.length) {
              delete map.callbacks[keypath];
              this.unobserveMutations(obj[keypath], obj[this.id], keypath);
            }
          }
          return this.cleanupWeakReference(map, obj[this.id]);
        }
      }
    },
    get: function(obj, keypath) {
      return obj[keypath];
    },
    set: function(obj, keypath, value) {
      return obj[keypath] = value;
    }
  };

  Rivets.factory = function(sightglass) {
    Rivets.sightglass = sightglass;
    Rivets["public"]._ = Rivets;
    return Rivets["public"];
  };

  if (typeof (typeof module !== "undefined" && module !== null ? module.exports : void 0) === 'object') {
    module.exports = Rivets.factory(require('sightglass'));
  } else if (typeof define === 'function' && define.amd) {
    define('rivets',['sightglass'], function(sightglass) {
      return this.rivets = Rivets.factory(sightglass);
    });
  } else {
    this.rivets = Rivets.factory(sightglass);
  }

}).call(this);

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


define('css!../../node_modules/libs-frontend-cosmatt/libs-frontend-unitcombobox/dist/css/unitComboBox',[],function(){});
var unitData={unitType:{LINEARDISTANCE:{unit:[{name:"m",conversionFactor:.0254,isSI:!0},{name:"cm",conversionFactor:2.54},{name:"mm",conversionFactor:25.4},{name:"in",conversionFactor:1},{name:"ft",conversionFactor:.0833333333333333},{name:"Km",conversionFactor:254e-7}]},ANGULARDISTANCE:{unit:[{name:"rad",conversionFactor:6.28318530717958,isSI:!0},{name:"deg",conversionFactor:360},{name:"rev",conversionFactor:1},{name:"min",conversionFactor:21600}]},VELOCITY:{unit:[{name:"m/sec",conversionFactor:.0254,isSI:!0},{name:"cm/sec",conversionFactor:2.54},{name:"mm/sec",conversionFactor:25.4},{name:"in/sec",conversionFactor:1},{name:"ft/sec",conversionFactor:.0833333333333333},{name:"ft/min",conversionFactor:5}]},ANGULARVELOCITY:{unit:[{name:"rad/sec",conversionFactor:1,isSI:!0},{name:"deg/sec",conversionFactor:57.2957795130823},{name:"rev/sec",conversionFactor:.159154943091895},{name:"rpm",conversionFactor:9.54929658551372}]},ACCELERATION:{unit:[{name:"m/sec<sup>2</sup>",conversionFactor:.0254,isSI:!0},{name:"cm/sec<sup>2</sup>",conversionFactor:2.54},{name:"mm/sec<sup>2</sup>",conversionFactor:25.4},{name:"in/sec<sup>2</sup>",conversionFactor:1},{name:"ft/sec<sup>2</sup>",conversionFactor:.0833333333333333},{name:"g",conversionFactor:.00259007914966232}]},ANGULARACCELERATION:{unit:[{name:"rad/sec<sup>2</sup>",conversionFactor:1,isSI:!0},{name:"deg/sec<sup>2</sup>",conversionFactor:57.2957795130823},{name:"rev/sec<sup>2</sup>",conversionFactor:.159154943091895},{name:"rpm/sec",conversionFactor:9.54929658551372}]},TIME:{unit:[{name:"sec",conversionFactor:60,isSI:!0},{name:"min",conversionFactor:1},{name:"msec",conversionFactor:6e4}]},MASS:{unit:[{name:"kg",conversionFactor:.0283495199999999,isSI:!0},{name:"gm",conversionFactor:28.3495199999999},{name:"oz",conversionFactor:1},{name:"lb",conversionFactor:.0625}]},FORCE:{unit:[{name:"N",conversionFactor:4.4482216153,isSI:!0},{name:"kgf",conversionFactor:.45359237},{name:"lbf",conversionFactor:1},{name:"dyne",conversionFactor:444822.161526051}]},TORQUE:{unit:[{name:"N-m",conversionFactor:.007061552,isSI:!0},{name:"oz-in",conversionFactor:1},{name:"lb-in",conversionFactor:.0625},{name:"lb-ft",conversionFactor:.00520833333333333}]},INERTIA:{unit:[{name:"kg-m<sup>2</sup>",conversionFactor:182997852e-13,isSI:!0},{name:"kg-cm<sup>2</sup>",conversionFactor:.182997852},{name:"Nm-s<sup>2</sup>",conversionFactor:182997852e-13},{name:"oz-in-s<sup>2</sup>",conversionFactor:.00259008},{name:"lb-in-s<sup>2</sup>",conversionFactor:16188e-8},{name:"lb-ft-s<sup>2</sup>",conversionFactor:1349e-8},{name:"oz-in<sup>2</sup>",conversionFactor:1},{name:"lb-in<sup>2</sup>",conversionFactor:.0625},{name:"lb-ft<sup>2</sup>",conversionFactor:434028e-9},{name:"gm-mm<sup>2</sup>",conversionFactor:18299.7852},{name:"Kg-mm<sup>2</sup>",conversionFactor:18.2997852}]},POWER:{unit:[{name:"watts",conversionFactor:746,isSI:!0},{name:"HP",conversionFactor:1},{name:"kW",conversionFactor:.746}]},TEMPERATURE:{unit:[{name:"ºC",conversionFactor:1,isSI:!0},{name:"ºF",conversionFactor:1}]},TORQUECONSTANT:{unit:[{name:"Nm/A",conversionFactor:1,isSI:!0},{name:"kg-m/A",conversionFactor:.101971621296887},{name:"kg-cm/A",conversionFactor:10.1971621296887},{name:"gm-cm/A",conversionFactor:10197.1621296887},{name:"oz-in/A",conversionFactor:141.61193228},{name:"lb-in/A",conversionFactor:8.85074577},{name:"lb-ft/A",conversionFactor:.73756215}]},DAMPINGCONSTANT:{unit:[{name:"Nm/krpm",conversionFactor:1},{name:"kg-m/krpm",conversionFactor:.101971621296887},{name:"kg-cm/krpm",conversionFactor:10.1971621296887},{name:"gm-cm/krpm",conversionFactor:10197.1621296887},{name:"oz-in/krpm",conversionFactor:141.61193228},{name:"lb-in/krpm",conversionFactor:8.85074577},{name:"lb-ft/krpm",conversionFactor:.73756215},{name:"Nm/rad/sec",conversionFactor:.00954929658551372,isSI:!0}]},THERMALRESISTANCE:{unit:[{name:"ºC/Watt",conversionFactor:1,isSI:!0}]},RESISTANCE:{unit:[{name:"Ohms",conversionFactor:1,isSI:!0}]},INDUCTANCE:{unit:[{name:"H",conversionFactor:1,isSI:!0}]},CURRENT:{unit:[{name:"A(0-pk)",conversionFactor:1,isSI:!0},{name:"A(RMS)",conversionFactor:.707106781186547}]},TEMPERATURECOFFICIENT:{unit:[{name:"/ºC",conversionFactor:1,isSI:!0},{name:"%/ºC",conversionFactor:100}]},CAPACITANCE:{unit:[{name:"F",conversionFactor:1,isSI:!0},{name:"µF",conversionFactor:1e6}]},VOLTAGE:{unit:[{name:"Volts",conversionFactor:1,isSI:!0}]},DENSITY:{unit:[{name:"Kg/m^3",conversionFactor:27679.9047,isSI:!0},{name:"Kg/cm^3",conversionFactor:.0276799047},{name:"gm/m^3",conversionFactor:27679904.7},{name:"lb/in^3",conversionFactor:1},{name:"lb/ft^3",conversionFactor:1728},{name:"gm/cm^3",conversionFactor:27.6799047}]},ROLLOFF:{unit:[{name:"Nm/(rad/sec)<sup>2</sup>",conversionFactor:1,isSI:!0}]},MAGNETTEMPCOFFICIENT:{unit:[]},LEAD:{unit:[{name:"mm/rev",conversionFactor:1,isSI:!0},{name:"in/rev",conversionFactor:.03937007874016}]},INCLINATION:{unit:[{name:"rad",conversionFactor:.0174532925199433,isSI:!0},{name:"deg",conversionFactor:1}]},DIAMETER:{unit:[{name:"mm",conversionFactor:25.4},{name:"cm",conversionFactor:2.54},{name:"m",conversionFactor:.0254,isSI:!0},{name:"in",conversionFactor:1},{name:"ft",conversionFactor:.0833333333333333}]},FORCECONSTANT:{unit:[{name:"N/A",conversionFactor:1,isSI:!0},{name:"kg/A",conversionFactor:.101971621296887},{name:"gm/A",conversionFactor:101.971621296887},{name:"oz/A",conversionFactor:3.59694},{name:"lb/A",conversionFactor:.224809}]},ENERGY:{unit:[{name:"J",conversionFactor:1,isSI:!0}]},LIFE:{unit:[{name:"Year",conversionFactor:1,isSI:!0},{name:"Days",conversionFactor:365},{name:"Weeks",conversionFactor:52.1428571428571}]},ALTITUDE:{unit:[{name:"m",conversionFactor:.0254,isSI:!0},{name:"cm",conversionFactor:2.54},{name:"mm",conversionFactor:25.4},{name:"in",conversionFactor:1},{name:"ft",conversionFactor:.0833333333333333},{name:"Km",conversionFactor:254e-7}]},LINEARDAMPING:{unit:[{name:"N/m/s",conversionFactor:175.126818058489,isSI:!0},{name:"kgf/m/s",conversionFactor:17.8579653543307},{name:"lbf/in/s",conversionFactor:1}]},CURRENCY:{unit:[{name:"$(USD)",conversionFactor:1,isSI:!0},{name:"EUR",conversionFactor:.703},{name:"GBP",conversionFactor:.491}]},JERK:{unit:[{name:"m/sec³",conversionFactor:.0254,isSI:!0},{name:"cm/sec³",conversionFactor:2.54},{name:"mm/sec³",conversionFactor:25.4},{name:"in/sec³",conversionFactor:1},{name:"ft/sec³",conversionFactor:.0833333333333333}]},VOLUME:{unit:[{name:"m³",conversionFactor:16387064e-12,isSI:!0},{name:"cm³",conversionFactor:16.387064},{name:"mm³",conversionFactor:16387.064},{name:"in³",conversionFactor:1},{name:"ft³",conversionFactor:578704e-9}]},AREA:{unit:[{name:"m<sup>2</sup>",conversionFactor:.000645159999999949,isSI:!0},{name:"cm<sup>2</sup>",conversionFactor:6.4516},{name:"mm<sup>2</sup>",conversionFactor:645.16},{name:"in<sup>2</sup>",conversionFactor:1},{name:"ft<sup>2</sup>",conversionFactor:.00694444444444438}]},ANGULARJERK:{unit:[{name:"rad/sec³",conversionFactor:1,isSI:!0},{name:"deg/sec³",conversionFactor:57.2957795130823},{name:"rev/sec³",conversionFactor:.159154943091895},{name:"rpm/sec<sup>2</sup>",conversionFactor:9.54929658551372}]},MOMENT:{unit:[{name:"N-m",conversionFactor:.007061552,isSI:!0},{name:"oz-in",conversionFactor:1},{name:"lb-in",conversionFactor:.0625},{name:"lb-ft",conversionFactor:.00520833333333333}]},BANDWIDTH:{unit:[{name:"1/sec",conversionFactor:1,isSI:!0}]},INTEGRAL:{unit:[{name:"1/ms-s",conversionFactor:1,isSI:!0}]},STIFFNESSROTARY:{unit:[{name:"Nm/deg",conversionFactor:1,isSI:!0}]},BACKLASH:{unit:[{name:"arc min",conversionFactor:1,isSI:!0}]},FREQUENCY:{unit:[{name:"Hz",conversionFactor:1,isSI:!0}]},PRESSURE:{unit:[{name:"GPa",conversionFactor:1,isSI:!0}]},THERMALMASS:{unit:[{name:"J/ºC",conversionFactor:1,isSI:!0}]},STIFFNESSLINEAR:{unit:[{name:"N/mm",conversionFactor:1,isSI:!0}]},PERCENTAGE:{unit:[{name:"%",conversionFactor:1,isSI:!0}]}}},COSMATT=COSMATT||{};COSMATT.UNITCONVERTER=function(){var n={unitType:{LINEARDISTANCE:{unit:[{name:"m",conversionFactor:.0254,isSI:!0},{name:"cm",conversionFactor:2.54},{name:"mm",conversionFactor:25.4},{name:"in",conversionFactor:1},{name:"ft",conversionFactor:.0833333333333333},{name:"Km",conversionFactor:254e-7}]},ANGULARDISTANCE:{unit:[{name:"rad",conversionFactor:6.28318530717958,isSI:!0},{name:"deg",conversionFactor:360},{name:"rev",conversionFactor:1},{name:"min",conversionFactor:21600}]},VELOCITY:{unit:[{name:"m/sec",conversionFactor:.0254,isSI:!0},{name:"cm/sec",conversionFactor:2.54},{name:"mm/sec",conversionFactor:25.4},{name:"in/sec",conversionFactor:1},{name:"ft/sec",conversionFactor:.0833333333333333},{name:"ft/min",conversionFactor:5}]},ANGULARVELOCITY:{unit:[{name:"rad/sec",conversionFactor:1,isSI:!0},{name:"deg/sec",conversionFactor:57.2957795130823},{name:"rev/sec",conversionFactor:.159154943091895},{name:"rpm",conversionFactor:9.54929658551372}]},ACCELERATION:{unit:[{name:"m/sec<sup>2</sup>",conversionFactor:.0254,isSI:!0},{name:"cm/sec<sup>2</sup>",conversionFactor:2.54},{name:"mm/sec<sup>2</sup>",conversionFactor:25.4},{name:"in/sec<sup>2</sup>",conversionFactor:1},{name:"ft/sec<sup>2</sup>",conversionFactor:.0833333333333333},{name:"g",conversionFactor:.00259007914966232}]},ANGULARACCELERATION:{unit:[{name:"rad/sec<sup>2</sup>",conversionFactor:1,isSI:!0},{name:"deg/sec<sup>2</sup>",conversionFactor:57.2957795130823},{name:"rev/sec<sup>2</sup>",conversionFactor:.159154943091895},{name:"rpm/sec",conversionFactor:9.54929658551372}]},TIME:{unit:[{name:"sec",conversionFactor:60,isSI:!0},{name:"min",conversionFactor:1},{name:"msec",conversionFactor:6e4}]},MASS:{unit:[{name:"kg",conversionFactor:.0283495199999999,isSI:!0},{name:"gm",conversionFactor:28.3495199999999},{name:"oz",conversionFactor:1},{name:"lb",conversionFactor:.0625}]},FORCE:{unit:[{name:"N",conversionFactor:4.4482216153,isSI:!0},{name:"kgf",conversionFactor:.45359237},{name:"lbf",conversionFactor:1},{name:"dyne",conversionFactor:444822.161526051}]},TORQUE:{unit:[{name:"N-m",conversionFactor:.007061552,isSI:!0},{name:"oz-in",conversionFactor:1},{name:"lb-in",conversionFactor:.0625},{name:"lb-ft",conversionFactor:.00520833333333333}]},INERTIA:{unit:[{name:"kg-m<sup>2</sup>",conversionFactor:182997852e-13,isSI:!0},{name:"kg-cm<sup>2</sup>",conversionFactor:.182997852},{name:"Nm-s<sup>2</sup>",conversionFactor:182997852e-13},{name:"oz-in-s<sup>2</sup>",conversionFactor:.00259008},{name:"lb-in-s<sup>2</sup>",conversionFactor:16188e-8},{name:"lb-ft-s<sup>2</sup>",conversionFactor:1349e-8},{name:"oz-in<sup>2</sup>",conversionFactor:1},{name:"lb-in<sup>2</sup>",conversionFactor:.0625},{name:"lb-ft<sup>2</sup>",conversionFactor:434028e-9},{name:"gm-mm<sup>2</sup>",conversionFactor:18299.7852},{name:"Kg-mm<sup>2</sup>",conversionFactor:18.2997852}]},POWER:{unit:[{name:"watts",conversionFactor:746,isSI:!0},{name:"HP",conversionFactor:1},{name:"kW",conversionFactor:.746}]},TEMPERATURE:{unit:[{name:"ºC",conversionFactor:1,isSI:!0},{name:"ºF",conversionFactor:1}]},TORQUECONSTANT:{unit:[{name:"Nm/A",conversionFactor:1,isSI:!0},{name:"kg-m/A",conversionFactor:.101971621296887},{name:"kg-cm/A",conversionFactor:10.1971621296887},{name:"gm-cm/A",conversionFactor:10197.1621296887},{name:"oz-in/A",conversionFactor:141.61193228},{name:"lb-in/A",conversionFactor:8.85074577},{name:"lb-ft/A",conversionFactor:.73756215}]},DAMPINGCONSTANT:{unit:[{name:"Nm/krpm",conversionFactor:1},{name:"kg-m/krpm",conversionFactor:.101971621296887},{name:"kg-cm/krpm",conversionFactor:10.1971621296887},{name:"gm-cm/krpm",conversionFactor:10197.1621296887},{name:"oz-in/krpm",conversionFactor:141.61193228},{name:"lb-in/krpm",conversionFactor:8.85074577},{name:"lb-ft/krpm",conversionFactor:.73756215},{name:"Nm/rad/sec",conversionFactor:.00954929658551372,isSI:!0}]},THERMALRESISTANCE:{unit:[{name:"ºC/Watt",conversionFactor:1,isSI:!0}]},RESISTANCE:{unit:[{name:"Ohms",conversionFactor:1,isSI:!0}]},INDUCTANCE:{unit:[{name:"H",conversionFactor:1,isSI:!0}]},CURRENT:{unit:[{name:"A(0-pk)",conversionFactor:1,isSI:!0},{name:"A(RMS)",conversionFactor:.707106781186547}]},TEMPERATURECOFFICIENT:{unit:[{name:"/ºC",conversionFactor:1,isSI:!0},{name:"%/ºC",conversionFactor:100}]},CAPACITANCE:{unit:[{name:"F",conversionFactor:1,isSI:!0},{name:"µF",conversionFactor:1e6}]},VOLTAGE:{unit:[{name:"Volts",conversionFactor:1,isSI:!0}]},DENSITY:{unit:[{name:"Kg/m^3",conversionFactor:27679.9047,isSI:!0},{name:"Kg/cm^3",conversionFactor:.0276799047},{name:"gm/m^3",conversionFactor:27679904.7},{name:"lb/in^3",conversionFactor:1},{name:"lb/ft^3",conversionFactor:1728},{name:"gm/cm^3",conversionFactor:27.6799047}]},ROLLOFF:{unit:[{name:"Nm/(rad/sec)<sup>2</sup>",conversionFactor:1,isSI:!0}]},MAGNETTEMPCOFFICIENT:{unit:[]},LEAD:{unit:[{name:"mm/rev",conversionFactor:1,isSI:!0},{name:"in/rev",conversionFactor:.03937007874016}]},INCLINATION:{unit:[{name:"rad",conversionFactor:.0174532925199433,isSI:!0},{name:"deg",conversionFactor:1}]},DIAMETER:{unit:[{name:"mm",conversionFactor:25.4},{name:"cm",conversionFactor:2.54},{name:"m",conversionFactor:.0254,isSI:!0},{name:"in",conversionFactor:1},{name:"ft",conversionFactor:.0833333333333333}]},FORCECONSTANT:{unit:[{name:"N/A",conversionFactor:1,isSI:!0},{name:"kg/A",conversionFactor:.101971621296887},{name:"gm/A",conversionFactor:101.971621296887},{name:"oz/A",conversionFactor:3.59694},{name:"lb/A",conversionFactor:.224809}]},ENERGY:{unit:[{name:"J",conversionFactor:1,isSI:!0}]},LIFE:{unit:[{name:"Year",conversionFactor:1,isSI:!0},{name:"Days",conversionFactor:365},{name:"Weeks",conversionFactor:52.1428571428571}]},ALTITUDE:{unit:[{name:"m",conversionFactor:.0254,isSI:!0},{name:"cm",conversionFactor:2.54},{name:"mm",conversionFactor:25.4},{name:"in",conversionFactor:1},{name:"ft",conversionFactor:.0833333333333333},{name:"Km",conversionFactor:254e-7}]},LINEARDAMPING:{unit:[{name:"N/m/s",conversionFactor:175.126818058489,isSI:!0},{name:"kgf/m/s",conversionFactor:17.8579653543307},{name:"lbf/in/s",conversionFactor:1}]},CURRENCY:{unit:[{name:"$(USD)",conversionFactor:1,isSI:!0},{name:"EUR",conversionFactor:.703},{name:"GBP",conversionFactor:.491}]},JERK:{unit:[{name:"m/sec³",conversionFactor:.0254,isSI:!0},{name:"cm/sec³",conversionFactor:2.54},{name:"mm/sec³",conversionFactor:25.4},{name:"in/sec³",conversionFactor:1},{name:"ft/sec³",conversionFactor:.0833333333333333}]},VOLUME:{unit:[{name:"m³",conversionFactor:16387064e-12,isSI:!0},{name:"cm³",conversionFactor:16.387064},{name:"mm³",conversionFactor:16387.064},{name:"in³",conversionFactor:1},{name:"ft³",conversionFactor:578704e-9}]},AREA:{unit:[{name:"m<sup>2</sup>",conversionFactor:.000645159999999949,isSI:!0},{name:"cm<sup>2</sup>",conversionFactor:6.4516},{name:"mm<sup>2</sup>",conversionFactor:645.16},{name:"in<sup>2</sup>",conversionFactor:1},{name:"ft<sup>2</sup>",conversionFactor:.00694444444444438}]},ANGULARJERK:{unit:[{name:"rad/sec³",conversionFactor:1,isSI:!0},{name:"deg/sec³",conversionFactor:57.2957795130823},{name:"rev/sec³",conversionFactor:.159154943091895},{name:"rpm/sec<sup>2</sup>",conversionFactor:9.54929658551372}]},MOMENT:{unit:[{name:"N-m",conversionFactor:.007061552,isSI:!0},{name:"oz-in",conversionFactor:1},{name:"lb-in",conversionFactor:.0625},{name:"lb-ft",conversionFactor:.00520833333333333}]},BANDWIDTH:{unit:[{name:"1/sec",conversionFactor:1,isSI:!0}]},INTEGRAL:{unit:[{name:"1/ms-s",conversionFactor:1,isSI:!0}]},STIFFNESSROTARY:{unit:[{name:"Nm/deg",conversionFactor:1,isSI:!0}]},BACKLASH:{unit:[{name:"arc min",conversionFactor:1,isSI:!0}]},FREQUENCY:{unit:[{name:"Hz",conversionFactor:1,isSI:!0}]},PRESSURE:{unit:[{name:"GPa",conversionFactor:1,isSI:!0}]},THERMALMASS:{unit:[{name:"J/ºC",conversionFactor:1,isSI:!0}]},STIFFNESSLINEAR:{unit:[{name:"N/mm",conversionFactor:1,isSI:!0}]},PERCENTAGE:{unit:[{name:"%",conversionFactor:1,isSI:!0}]}}},o=function(o,e,c,t){try{var r="",a="",i="";unitNode=n.unitType[o].unit;for(var s=0;s<unitNode.length;s++)unitNode[s].name==c&&(a=unitNode[s].conversionFactor),unitNode[s].name==t&&(i=unitNode[s].conversionFactor);return r=i/a*e}catch(m){console.log("Error : "+m)}},e=function(o){try{var e=[],c=[];c=n.unitType[o].unit;for(var t=0;t<c.length;t++)e.push(c[t].name);return e}catch(r){console.log("Error : "+r)}},c=function(o){try{var e="";unitNode=n.unitType[o].unit;for(var c=0;c<unitNode.length;c++)void 0!=unitNode[c].isSI&&1==unitNode[c].isSI&&(e=unitNode[c].name);return e}catch(t){console.log("Error : "+t)}},t=function(o,e,c){try{var t;unitNode=n.unitType[o].unit;for(var r=0;r<unitNode.length;r++)if(void 0!=unitNode[r].isSI&&1==unitNode[r].isSI){t=r;break}return t===e?c:c*a(o,e,t)}catch(i){console.log("Error : "+i)}},r=function(o,e){try{var c="";unitNode=n.unitType[o].unit;for(var t=0;t<unitNode.length;t++)unitNode[t].name==e&&(c=unitNode[t].conversionFactor);return c}catch(r){console.log("Error : "+r)}},a=function(o,e,c){try{var t=1,r=1;unitNode=n.unitType[o].unit;for(var a=0;a<unitNode.length;a++)a==e&&(t=unitNode[a].conversionFactor),a==c&&(r=unitNode[a].conversionFactor);return r/t}catch(i){console.log("Error : "+i)}};return{getUnits:e,getSIUnit:c,getSIValue:t,getUnitConvertedValue:o,getConversionFactor:r,getConversionRatio:a}}(),function(n){n.fn.unitsComboBox=function(o){var e={unitType:"",unit:"",value:"",show:"true",enable:{textbox:"true",comboBox:"true"},comboBoxWidthRatio:{textBox:"60%",comboBox:"40%"},callBackFn:function(){}},c=this,t=0;c.settings={};var r=n(this);c.init=function(){c.settings=n.extend({},e,o),a(c.settings.unitType)},c.update=function(o){var e=n.extend({},c.settings,o);r.find(".cosmatt-unitComboBox")["true"==e.show?"show":"hide"](),"true"==e.enable.textbox?r.find(".cosmatt-unitComboBox").find("input").removeAttr("disabled"):r.find(".cosmatt-unitComboBox").find("input").attr("disabled","disabled"),"true"==e.enable.comboBox?r.find(".cosmatt-unitComboBox").find("select").removeAttr("disabled"):r.find(".cosmatt-unitComboBox").find("select").attr("disabled","disabled"),r.find(".cosmatt-unitComboBox").find(".unitTextBox")["true"==e.showComboBoxOnly?"hide":"show"]()},c.getSIValue=function(){var n=0,o="";if("object"==typeof COSMATT.UNITCONVERTER){o=COSMATT.UNITCONVERTER.getSIUnit(c.settings.unitType),n=r.find(".amount_"+c.settings.unitType).val();var e=COSMATT.UNITCONVERTER.getUnitConvertedValue(c.settings.unitType,n,c.settings.unit,o);return e}},c.getConversionFactor=function(){var n="";return"object"==typeof COSMATT.UNITCONVERTER&&(n=COSMATT.UNITCONVERTER.getConversionFactor(c.settings.unitType,c.settings.unit)),n},c.setTextBoxValue=function(n){r.find(".amount_"+c.settings.unitType).val(n)};var a=function(o){var e={};try{if("object"==typeof COSMATT.UNITCONVERTER&&""!=o){var t=COSMATT.UNITCONVERTER.getUnits(o),a=n('<div class="cosmatt-unitComboBox"></div>');r.append(a);var m=n('<input type ="textbox" value="" class="form-control amount_'+c.settings.unitType+' unitTextBox"></input>');a.append(m),c.setTextBoxValue(c.settings.value);var v=n('<select id="comboBox'+c.settings.unitType+'" class="form-control unitComboBox"></select');a.append(v),m.css("width",c.settings.comboBoxWidthRatio.textBox),v.css("width",c.settings.comboBoxWidthRatio.comboBox);for(var u=0;u<t.length;u++){var F=n('<option value="'+t[u]+'">'+t[u]+"</option>");v.append(F)}r.find(".unitComboBox").find("option").eq(c.settings.unit).attr("selected",!0),c.settings.unit=r.find("#comboBox"+c.settings.unitType+" :selected").text(),i(),s(),c.update({}),c.settings.SIValue=c.getSIValue({}),"function"==typeof c.settings.callBackFn&&(e.unitName=c.settings.unit,e.SIValue=c.settings.SIValue,c.settings.callBackFn.call(e))}}catch(I){console.log("Error : "+I)}},i=function(){var o=0,e={};r.find(".unitComboBox").on("change",function(t){if(o=r.find(".amount_"+c.settings.unitType).val(),"true"==c.settings.showComboBoxOnly)var a=COSMATT.UNITCONVERTER.getUnitConvertedValue(c.settings.unitType,1,c.settings.unit,n(this).val());else var a=COSMATT.UNITCONVERTER.getUnitConvertedValue(c.settings.unitType,o,c.settings.unit,n(this).val());conversionfactor=COSMATT.UNITCONVERTER.getConversionFactor(c.settings.unitType,n(this).val()),c.settings.unit=n(this).val(),c.settings.value=a,c.setTextBoxValue(c.settings.value),setTimeout(function(){"function"==typeof c.settings.callBackFn&&(e.conversionfactor=conversionfactor,e.unitName=c.settings.unit,e.convertedVal=a,e.SIValue=c.settings.SIValue,c.settings.callBackFn.call(e))},800)})},s=function(){r.find(".unitTextBox").on("input",function(){var o=this,e={};t>0&&clearTimeout(t),t=setTimeout(function(){"function"==typeof c.settings.callBackFn&&(e.value=n(o).val(),e.unit=c.settings.unit,c.settings.callBackFn.call(e))},800)})};c.init(),n(this).data("unitsComboBox",c)}}(jQuery);
define("../../node_modules/libs-frontend-cosmatt/libs-frontend-unitcombobox/dist/js/unitComboBox.min.js", function(){});


define('css!../../node_modules/libs-frontend-cosmatt/libs-frontend-motionprofile/dist/css/motionProfile',[],function(){});

(function($) {

  // add the plugin to the jQuery.fn object
  $.fn.CosmattPlugin = function(params) {
    var $container = $(this);
    switch (params.type) {
      case "motion-profile":
        $container.motionProfile(params.options.data);
        break;
      case "ts-curve":
        $container.TSCurve(params.options.data);
        break;
      case "assessment":
        $container.assessment(params.options.data);
        break;
      case "spreadsheet-leonardo":
        $container.spreadsheetLeonardo(params.options.data);
        break;
      default:
        console.log("No such plugin exists");
    }
  }
})(jQuery);
define("../../node_modules/libs-frontend-cosmatt/libs-frontend-cosmattPlugin/src/js/libs-frontend-CosmattPlugin.js", function(){});


var COSMATT = COSMATT || {};
COSMATT.ProfileCalculation = COSMATT.ProfileCalculation || {};
COSMATT.ProfileCalculation.AccelDecelSegment = (function() {

  //Variables required for calculating delta elements;
  var dM1, dM2, dM3,
    dV1, dV2, dV3,
    dS1, dS2, dS3,
    Snorm, skewCorrectionFactor, accFormFactor, accSkewFactor;

  //Variables required to store intermediate values;
  var deltaM, avgVel, finalVelocity, deltaV, deltaBase, deltaRamp;

  //Variables to hold initial data
  var initialTime, initialVelocity, initialPosition;

  var outputData = {};

  var calculateDeltaElements = function() {
    //i.   Calculate dM1, dM2, dM3 separately to obtain DeltaM.
    dM2 = (2 / accFormFactor) - 1;
    dM1 = (1 - dM2) * (1 - accSkewFactor) / 2;
    dM3 = 1 - dM1 - dM2;

    //ii.   Calculate dV1, dV2, dV3 separately to obtain DeltaV.
    dV1 = accFormFactor * dM1 / 2;
    dV2 = accFormFactor * dM2;
    dV3 = accFormFactor * dM3 / 2;

    //iii.  Calculate dS1, dS2, dS3 separately to obtain DeltaS.
    dS1 = (dV1 / 3) * dM1;
    dS2 = ((dV2 + 2 * dV1) / 2) * dM2;
    dS3 = (1 - dV3 / 3) * dM3;

    Snorm = dS1 + dS2 + dS3;

    dS1 = dS1 / Snorm;
    dS2 = dS2 / Snorm;
    dS3 = dS3 / Snorm;

    skewCorrectionFactor = 0.5 / Snorm;

    console.log('dM1 - ', dM1, 'dM2 - ', dM2, 'dM3 - ', dM3, 'dV1 - ', dV1, 'dV2 - ', dV2, 'dV3 - ', dV3, 'dS1 - ', dS1, 'dS2 - ', dS2, 'dS3 - ', dS3);
  };

  var calculateIntermediateVars = function(inputData) {
    switch (inputData.permutation) {
      case "TIME_DISTANCE":
        deltaM = inputData.time;
        avgVel = inputData.distance / deltaM;
        finalVelocity = initialVelocity + (avgVel - initialVelocity) * 2 * skewCorrectionFactor;
        deltaV = finalVelocity - initialVelocity;
        deltaBase = deltaM * initialVelocity;
        deltaRamp = inputData.distance - deltaBase;
        break;
      case "TIME_VELOCITY":
        // Case 1 - Time (T) – Final Velocity (Vf)
        deltaM = inputData.time;
        deltaV = inputData.velocity - initialVelocity;
        deltaRamp = deltaM * deltaV * Snorm;
        deltaBase = deltaM * initialVelocity;

        console.log('deltaM - ', deltaM, 'deltaV - ', deltaV, 'deltaRamp', -deltaRamp, 'deltaBase - ', deltaBase);
        break;
      default:
        break;
    }

  };


  var calculateAccelElement = function() {
    if (dM1 > 0) {
      var deltaM1 = deltaM * dM1;

      var deltaS1 = deltaBase * dM1 + deltaRamp * dS1;

      var deltaV1 = deltaV * dV1;


      var ElementStartTime = initialTime;

      var ElementEndTime = ElementStartTime + deltaM1;


      var ElementStartPosition = initialPosition;

      var ElementEndPosition = ElementStartPosition + deltaS1;


      var ElementStartVelocity = initialVelocity;

      var ElementEndVelocity = ElementStartVelocity + deltaV1;


      var avgVel = (ElementEndVelocity + ElementStartVelocity) / 2;


      var Ka = (deltaS1 - (avgVel * deltaM1)) * (-2 / Math.pow(deltaM1, 3));


      var Kb = ((-3 * Ka * Math.pow(deltaM1, 2)) + deltaV1) / (2 * deltaM1);


      var Kc = ElementStartVelocity;


      var Kd = ElementStartPosition;


      var ElementStartAcc = 0;


      var ElementEndAcc = 6 * Ka * (ElementEndTime - ElementStartTime) + 2 * Kb;


      var ElementRmsAccel = Math.abs(ElementEndAcc);


      var ElementRmsVel = Math.sqrt((Math.pow(ElementStartVelocity, 2) + Math.pow(ElementEndVelocity, 2)) / 2);


      var ElementJerk = 6 * Ka;



      console.log('deltaM1 - ', deltaM1, 'deltaS1 - ', deltaS1, 'deltaV1 - ', deltaV1, 'ElementStartTime - ', ElementStartTime, 'ElementEndTime - ', ElementEndTime, 'ElementStartPosition - ', ElementStartPosition, 'ElementEndPosition - ', ElementEndPosition, 'ElementStartVelocity - ', ElementStartVelocity, 'ElementEndVelocity - ', ElementEndVelocity, 'avgVel - ', avgVel, 'Ka - ', Ka, 'Kb - ', Kb, 'Kc - ', Kc, 'Kd - ', Kd, 'ElementStartAcc - ', ElementStartAcc, 'ElementEndAcc - ', ElementEndAcc, 'ElementRmsAccel - ', ElementRmsAccel, 'ElementRmsVel - ', ElementRmsVel, 'ElementJerk - ', ElementJerk);

      //Save Data to Service
      var AccelElement = {
        'time_initial': ElementStartTime,
        'time_final': ElementEndTime,
        'velocity_initial': ElementStartVelocity,
        'velocity_final': ElementEndVelocity,
        'acceleration_initial': ElementStartAcc,
        'acceleration_final': ElementEndAcc,
        'position_initial': ElementStartPosition,
        'position_final': ElementEndPosition,
        'motion_equation_third_order_coefficient': Ka,
        'motion_equation_second_order_coefficient': Kb,
        'motion_equation_first_order_coefficient': Kc,
        'motion_equation_zero_order_coefficient': Kd,
        'rms_acceleration': ElementRmsAccel,
        'rms_velocity': ElementRmsVel,
        'jerk': ElementJerk
      }


      outputData.ElementsData.push(AccelElement);

      initialTime = ElementEndTime;
      initialPosition = ElementEndPosition;
      initialVelocity = ElementEndVelocity;
    }
  }

  var calculateCruiseElement = function() {
    if (dM2 > 0) {
      var deltaM2 = deltaM * dM2;

      var deltaS2 = deltaBase * dM2 + deltaRamp * dS2;

      var deltaV2 = deltaV * dV2;

      var ElementStartTime = initialTime;
      var ElementEndTime = ElementStartTime + deltaM2;

      var ElementStartPosition = initialPosition;
      var ElementEndPosition = ElementStartPosition + deltaS2;

      var ElementStartVelocity = initialVelocity;
      var ElementEndVelocity = ElementStartVelocity + deltaV2;


      var avgVel = (ElementEndVelocity + ElementStartVelocity) / 2;

      var Ka = 0;

      var Kb = ((-3 * Ka * Math.pow(deltaM2, 2)) + deltaV2) / (2 * deltaM2);

      var Kc = ElementStartVelocity;

      var Kd = ElementStartPosition;

      var ElementStartAcc = 2 * Kb;

      var ElementEndAcc = 6 * Ka * (ElementEndTime - ElementStartTime) + 2 * Kb;

      var ElementRmsAccel = Math.abs(ElementEndAcc);

      var ElementRmsVel = Math.sqrt((Math.pow(ElementStartVelocity, 2) + Math.pow(ElementEndVelocity, 2)) / 2);

      var ElementJerk = 6 * Ka;

      //Save Data to Service
      var CruiseElement = {
        'time_initial': ElementStartTime,
        'time_final': ElementEndTime,
        'velocity_initial': ElementStartVelocity,
        'velocity_final': ElementEndVelocity,
        'acceleration_initial': ElementStartAcc,
        'acceleration_final': ElementEndAcc,
        'position_initial': ElementStartPosition,
        'position_final': ElementEndPosition,
        'motion_equation_third_order_coefficient': Ka,
        'motion_equation_second_order_coefficient': Kb,
        'motion_equation_first_order_coefficient': Kc,
        'motion_equation_zero_order_coefficient': Kd,
        'rms_acceleration': ElementRmsAccel,
        'rms_velocity': ElementRmsVel,
        'jerk': ElementJerk
      }


      console.log('deltaM2 - ', deltaM2, 'deltaS2 - ', deltaS2, 'deltaV2 - ', deltaV2, 'ElementStartTime - ', ElementStartTime, 'ElementEndTime - ', ElementEndTime, 'ElementStartPosition - ', ElementStartPosition, 'ElementEndPosition - ', ElementEndPosition, 'ElementStartVelocity - ', ElementStartVelocity, 'ElementEndVelocity - ', ElementEndVelocity, 'avgVel - ', avgVel, 'Ka - ', Ka, 'Kb - ', Kb, 'Kc - ', Kc, 'Kd - ', Kd, 'ElementStartAcc - ', ElementStartAcc, 'ElementEndAcc - ', ElementEndAcc, 'ElementRmsAccel - ', ElementRmsAccel, 'ElementRmsVel - ', ElementRmsVel, 'ElementJerk - ', ElementJerk);

      outputData.ElementsData.push(CruiseElement);

      initialTime = ElementEndTime;
      initialPosition = ElementEndPosition;
      initialVelocity = ElementEndVelocity;
    }
  }

  var calculateDecelElement = function() {
    if (dM3 > 0) {
      var deltaM3 = deltaM * dM3;
      var deltaS3 = deltaBase * dM3 + deltaRamp * dS3;
      var deltaV3 = deltaV * dV3;

      var ElementStartTime = initialTime;
      var ElementEndTime = ElementStartTime + deltaM3;

      var ElementStartPosition = initialPosition;
      var ElementEndPosition = ElementStartPosition + deltaS3;

      var ElementStartVelocity = initialVelocity;
      var ElementEndVelocity = ElementStartVelocity + deltaV3;


      var avgVel = (ElementEndVelocity + ElementStartVelocity) / 2;

      var Ka = (deltaS3 - (avgVel * deltaM3)) * (-2 / Math.pow(deltaM3, 3));

      var Kb = ((-3 * Ka * Math.pow(deltaM3, 2)) + deltaV3) / (2 * deltaM3);

      var Kc = ElementStartVelocity;

      var Kd = ElementStartPosition;

      var ElementStartAcc = 2 * Kb;

      var ElementEndAcc = 0;

      var ElementRmsAccel = Math.abs(ElementEndAcc);

      var ElementRmsVel = Math.sqrt((Math.pow(ElementStartVelocity, 2) + Math.pow(ElementEndVelocity, 2)) / 2);

      var ElementJerk = 6 * Ka;

      //Save Data to Service
      var DecelElement = {
        'time_initial': ElementStartTime,
        'time_final': ElementEndTime,
        'velocity_initial': ElementStartVelocity,
        'velocity_final': ElementEndVelocity,
        'acceleration_initial': ElementStartAcc,
        'acceleration_final': ElementEndAcc,
        'position_initial': ElementStartPosition,
        'position_final': ElementEndPosition,
        'motion_equation_third_order_coefficient': Ka,
        'motion_equation_second_order_coefficient': Kb,
        'motion_equation_first_order_coefficient': Kc,
        'motion_equation_zero_order_coefficient': Kd,
        'rms_acceleration': ElementRmsAccel,
        'rms_velocity': ElementRmsVel,
        'jerk': ElementJerk
      };



      console.log('deltaM3 - ', deltaM3, 'deltaS3 - ', deltaS3, 'deltaV3 - ', deltaV3, 'ElementStartTime - ', ElementStartTime, 'ElementEndTime - ', ElementEndTime, 'ElementStartPosition - ', ElementStartPosition, 'ElementEndPosition - ', ElementEndPosition, 'ElementStartVelocity - ', ElementStartVelocity, 'ElementEndVelocity - ', ElementEndVelocity, 'avgVel - ', avgVel, 'Ka - ', Ka, 'Kb - ', Kb, 'Kc - ', Kc, 'Kd - ', Kd, 'ElementStartAcc - ', ElementStartAcc, 'ElementEndAcc - ', ElementEndAcc, 'ElementRmsAccel - ', ElementRmsAccel, 'ElementRmsVel - ', ElementRmsVel, 'ElementJerk - ', ElementJerk)

      outputData.ElementsData.push(DecelElement);

      //Update Global vars for storing initial values required by  other elements
      initialTime = ElementEndTime;
      initialPosition = ElementEndPosition;
      initialVelocity = ElementEndVelocity;
    }
  }

  var calculateIndividualElements = function() {
    calculateAccelElement();
    calculateCruiseElement();
    calculateDecelElement();
  };

  var updateFinalParams = function() {
    var ElementsData = outputData.ElementsData;
    var ElementsLength = ElementsData.length;
    var distance = ElementsData[ElementsLength - 1].position_final - ElementsData[0].position_initial;

    outputData.SegmentData.distance = distance;
  }


  var calculate = function(inputData, initials) {
    console.log('-------------------------------------------------- AccelDecelElement --------------------------------------------------')
    outputData = {};

    outputData.ElementsData = [];

    outputData.SegmentData = {};

    accSkewFactor = (inputData.skewPercentage / 100) || 0;

    accFormFactor = (1 / (1 - inputData.jerkPercentage / 200)) || 1;

    initialTime = initials.time || 0;

    initialVelocity = initials.velocity || 0;

    initialPosition = initials.position || 0;

    calculateDeltaElements();

    calculateIntermediateVars(inputData);

    calculateIndividualElements();

    updateFinalParams();

    return outputData;
  };

  return {
    calculate: calculate
  };
})();

var COSMATT = COSMATT || {};
COSMATT.ProfileCalculation = COSMATT.ProfileCalculation || {};
COSMATT.ProfileCalculation.CruiseSegment = (function() {

  //Variables to hold initial data
  var initialTime, initialVelocity, initialPosition;

  var segmentTime, segmentDistance;

  var outputData = {};

  var calculateIntermediateVars = function(inputData) {
    switch (inputData.permutation) {
      case "TIME":
        segmentTime = inputData.time;
        segmentDistance = segmentTime * initialVelocity;

        console.log('segmentTime - ', segmentTime, 'segmentDistance - ', segmentDistance)
        break;
      default:
        break;
    }

  };

  var calculateElementsData = function() {

    var ElementStartTime = initialTime;
    var ElementEndTime = ElementStartTime + segmentTime;

    var ElementStartPosition = initialPosition;
    var ElementEndPosition = ElementStartPosition + segmentDistance;

    var ElementStartVelocity = initialVelocity;
    var ElementEndVelocity = ElementStartVelocity;

    var Ka = 0;

    var Kb = 0;

    var Kc = ElementStartVelocity;

    var Kd = ElementStartPosition;

    var ElementStartAcc = 0;

    var ElementEndAcc = 0;

    var ElementRmsAccel = Math.abs(ElementEndAcc);

    var ElementRmsVel = Math.sqrt((Math.pow(ElementStartVelocity, 2) + Math.pow(ElementEndVelocity, 2)) / 2);


    console.log('ElementStartTime - ', ElementStartTime, 'ElementEndTime - ', ElementEndTime, 'ElementStartPosition - ', ElementStartPosition, 'ElementEndPosition - ', ElementEndPosition, 'ElementStartVelocity - ', ElementStartVelocity, 'ElementEndVelocity - ', ElementEndVelocity, 'Ka - ', Ka, 'Kb - ', Kb, 'Kc - ', Kc, 'Kd - ', Kd, 'ElementStartAcc - ', ElementStartAcc, 'ElementEndAcc - ', ElementEndAcc, 'ElementRmsAccel - ', ElementRmsAccel, 'ElementRmsVel - ', ElementRmsVel);

    //Save Data to Service
    var Element = {
      'time_initial': ElementStartTime,
      'time_final': ElementEndTime,
      'velocity_initial': ElementStartVelocity,
      'velocity_final': ElementEndVelocity,
      'acceleration_initial': ElementStartAcc,
      'acceleration_final': ElementEndAcc,
      'position_initial': ElementStartPosition,
      'position_final': ElementEndPosition,
      'motion_equation_third_order_coefficient': Ka,
      'motion_equation_second_order_coefficient': Kb,
      'motion_equation_first_order_coefficient': Kc,
      'motion_equation_zero_order_coefficient': Kd,
      'rms_acceleration': ElementRmsAccel,
      'rms_velocity': ElementRmsVel,
    }


    outputData.ElementsData.push(Element);
  };

  var updateFinalParams = function() {
    var ElementsData = outputData.ElementsData;

    var distance = ElementsData[0].position_final - ElementsData[0].position_initial;

    outputData.SegmentData.distance = distance;
  };


  var calculate = function(inputData, initials) {
    console.log('-------------------------------------------------- Cruise/Dwell Element --------------------------------------------------')

    outputData = {};

    outputData.ElementsData = [];

    outputData.SegmentData = {};

    initialTime = initials.time || 0;

    initialVelocity = initials.velocity || 0;

    initialPosition = initials.position || 0;

    calculateIntermediateVars(inputData);

    calculateElementsData();

    updateFinalParams();

    return outputData;
  };

  return {
    calculate: calculate
  };
})();

var COSMATT = COSMATT || {};
COSMATT.ProfileCalculation = COSMATT.ProfileCalculation || {};
COSMATT.ProfileCalculation.ProfileIndexModel = (function() {
  var outputData = [];
  var segmentData = {};
  var accelJerk = 0;
  var decelJerk = 0;
  var initialTime, initialVelocity, initialPosition, finalVelocity;
  var movedistance, movedtime, velFormFactor, velSkewFactor, dweltime;
  var averageVel, cruiseVel, accelTime, decelTime, cruiseTime, accelDistance, decelDistance, cruiseDistance, dwelDistance;

  var updateAccelDecelJerkVariables = function(selectedVal) {
    selectedVal = parseInt(selectedVal);
    if (!isNaN(selectedVal)) {
      switch (selectedVal) {
        case 0:
          accelJerk = 0;
          decelJerk = 0;
          break;
        case 1:
          accelJerk = 40;
          decelJerk = 40;
          break;
        case 2:
          accelJerk = 100;
          decelJerk = 100;
          break;
        default:
          break;
      }
    }
  };

  var updateVelocityJerkSkewVars = function(inputData) {
    var velJerkPerc, velSkewperc;
    if (inputData.velocityJerk != undefined) {
      velJerkPerc = inputData.velocityJerk;
    } else {
      velJerkPerc = 50;
    }

    if (inputData.velocitySkew != undefined) {
      velSkewperc = inputData.velocitySkew;
    } else {
      velSkewperc = 0;
    }
    velFormFactor = velJerkPerc / 100 + 1; //1.5 by default
    velSkewFactor = velSkewperc / 100; //0 by default
  };

  var ResolveIntoElements = function() {
    console.log('-------------------------------------------------- ResolveIntoElements --------------------------------------------------');
    accelDistance = decelDistance = cruiseDistance = dwelDistance = 0;
    averageVel = (movedistance - (initialVelocity * movedtime)) / movedtime;
    cruiseVel = averageVel * velFormFactor;

    if (cruiseVel == 0) {
      console.log('cruise velocity zero');
      //needs to be handleed later
    } else {
      //initial distance 0 if initialVel is zero
      var totalAccelDecelTime = 2 * (cruiseVel * movedtime - (movedistance - (initialVelocity * movedtime))) / cruiseVel;

      //Add effect of skew factor for finding accel and decel time
      accelTime = totalAccelDecelTime * (1 + velSkewFactor) / 2;
      decelTime = totalAccelDecelTime * (1 - velSkewFactor) / 2;

      cruiseTime = movedtime - totalAccelDecelTime;

      console.log('accelJerk - ', accelJerk, 'decelJerk - ', decelJerk, 'averageVel - ', averageVel, 'velFormFactor - ', velFormFactor, 'cruiseVel - ', cruiseVel, 'totalAccelDecelTime - ', totalAccelDecelTime, 'accelTime - ', accelTime, 'decelTime - ', decelTime, 'cruiseTime - ', cruiseTime);

      if (accelTime > 0) {
        var accelInputdata = {};
        var accelInitialValues = {};

        accelInputdata.permutation = 'TIME_VELOCITY';
        accelInputdata.velocity = cruiseVel + initialVelocity;
        accelInputdata.time = accelTime;
        accelInputdata.jerkPercentage = accelJerk;
        accelInputdata.skewPercentage = 0;

        accelInitialValues.position = initialPosition;
        accelInitialValues.velocity = initialVelocity;
        accelInitialValues.time = initialTime;


        var accelSegment = COSMATT.ProfileCalculation.AccelDecelSegment.calculate(accelInputdata, accelInitialValues);

        accelDistance = accelSegment.SegmentData.distance;

        outputData = outputData.concat(accelSegment.ElementsData);
        segmentData.accel = accelSegment.ElementsData;
      }

      if (cruiseTime > 0) {
        var cruiseInputdata = {};
        var cruiseInitialValues = {};

        cruiseInputdata.permutation = 'TIME';
        cruiseInputdata.velocity = cruiseVel + initialVelocity;
        cruiseInputdata.time = cruiseTime;
        cruiseInputdata.skewPercentage = 0;

        cruiseInitialValues.position = initialPosition + accelDistance;
        cruiseInitialValues.velocity = initialVelocity + cruiseVel;
        cruiseInitialValues.time = initialTime + accelTime;

        var cruiseSegment = COSMATT.ProfileCalculation.CruiseSegment.calculate(cruiseInputdata, cruiseInitialValues);

        cruiseDistance = cruiseSegment.SegmentData.distance;

        outputData = outputData.concat(cruiseSegment.ElementsData);
        segmentData.cruise = cruiseSegment.ElementsData;

      }

      if (decelTime > 0) {
        var decelInputdata = {};
        var decelInitialValues = {};

        decelInputdata.permutation = 'TIME_VELOCITY';
        decelInputdata.velocity = finalVelocity;
        decelInputdata.time = decelTime;
        decelInputdata.jerkPercentage = decelJerk;
        decelInputdata.skewPercentage = 0;

        decelInitialValues.position = initialPosition + accelDistance + cruiseDistance; //how to find acceldistance
        decelInitialValues.velocity = cruiseVel + initialVelocity;
        decelInitialValues.time = initialTime + accelTime + cruiseTime;;

        var decelSegment = COSMATT.ProfileCalculation.AccelDecelSegment.calculate(decelInputdata, decelInitialValues);

        decelDistance = decelSegment.SegmentData.distance;

        outputData = outputData.concat(decelSegment.ElementsData);
        segmentData.decel = decelSegment.ElementsData;

      }

      if (dweltime > 0) {
        var dwelInputdata = {};
        var dwelInitialValues = {};


        dwelInputdata.permutation = 'TIME';
        dwelInputdata.velocity = finalVelocity;
        dwelInputdata.time = dweltime;
        dwelInputdata.skewPercentage = 0;

        dwelInitialValues.position = initialPosition + movedistance;
        dwelInitialValues.velocity = finalVelocity;
        dwelInitialValues.time = initialTime + movedtime;

        var dwelSegment = COSMATT.ProfileCalculation.CruiseSegment.calculate(dwelInputdata, dwelInitialValues);

        dwelDistance = dwelSegment.SegmentData.distance;

        outputData = outputData.concat(dwelSegment.ElementsData);

        segmentData.dwell = dwelSegment.ElementsData;
      }
    }
  }


  var calculate = function(inputData, initials) {

    outputData = [];
    segmentData = [];

    //Assign values to the calculation variables
    movedistance = inputData.movedistance || 0;

    movedtime = inputData.movedtime || 0;

    dweltime = inputData.dweltime || 0;

    updateVelocityJerkSkewVars(inputData)

    updateAccelDecelJerkVariables(inputData.smoothness);

    initialTime = initials.time || 0;

    initialVelocity = initials.velocity || 0;

    initialPosition = initials.position || 0;

    finalVelocity = initialVelocity;

    if (movedistance > 0 && movedtime > 0) {
      ResolveIntoElements();
    } else {
      throw {
        "message": "Time and distance needs to be positive values for Profile calculations"
      };
    }

    return {
      elementsData: outputData,
      segmentData: segmentData
    }
  };

  return {
    calculate: calculate
  };
})();


var COSMATT = COSMATT || {};
COSMATT.MotionProfile = COSMATT.MotionProfile || {};

COSMATT.MotionProfile.configuration = {
  DataFields: {
    moveDistance: "moveDistance",
    moveTime: "moveTime",
    dwellTime: "dwellTime",
    velocityFormFactor: "indexType",
    peakVelocity: "peakVelocity",
    rmsVelocity: "rmsVelocity",
    peakAccelaration: "peakAcc",
    rmsAccelaration: "rmsAcc",
    showAll: true
  },
  Profiles: {
    profile1: "profile1",
    profile2: "profile2",
    profile3: "profile3",
    showAll: true
  },
  GraphMode: {
    individualAxis: 0,
    sameAxis: 1
  },
  Graphs: {
    position: "pos",
    velocity: "vel",
    acceleration: "acc",
    jerk: "jerk",
    showAll: true
  },
  GraphHandles: {
    position: "position",
    peakVelocity: "peakVelocity",
    moveTime: "moveTime",
    dwellTime: "dwellTime",
    showAll: true
  },
  Smoothness: {
    automatic: 0,
    standard: 1,
    maximum: 2
  }
};

(function($) {
  $.fn.motionProfile = function(options) {
    var defaults = {
      activeProfileIndex: 1,
      moveDistance: 20,
      moveTime: 10,
      dwellTime: 2,
      graphMode: COSMATT.MotionProfile.configuration.GraphMode.individualAxis,
      showGraphs: [COSMATT.MotionProfile.configuration.Graphs.velocity],
      showGraphDragHandles: COSMATT.MotionProfile.configuration.GraphHandles.showAll,
      readOnlyInputs: false,
      hideInputs: false,
      showProfiles: COSMATT.MotionProfile.configuration.Profiles.showAll,
      smoothness: COSMATT.MotionProfile.configuration.Smoothness.automatic,
      showCheckAnswerButton: false,
      assessmentMode: false
    };

    if (options.assessmentMode) {
      defaults.moveDistance = "";
      defaults.moveTime = "";
      defaults.dwellTime = "";
      defaults.activeProfileIndex = 3;
    }

    var settings = $.extend(defaults, options);
    var $container = this;
    var $widgetContainer = $('<div class="cosmatt-motionProfile unselectable" unselectable="on"></div>');
    $container.append($widgetContainer);
    $widgetContainer.append('<div id="profileButtons"><button class="btn btn-default profileButton" id="btn1">Profile 1</button><button class="btn btn-default profileButton" id="btn2">Profile 2</button><button class="btn btn-default profileButton" id="btn3">Profile 3</button></div><div id="graphContainer"></div><div id="inputControls"></div>');
    if (options.assessmentMode) {
      $widgetContainer.addClass("assessment-mode");
    }
    var uiValues = {};
    var initialValues = {};
    var calculatedValues = {};
    var outputData;

    var $inputControls = $widgetContainer.find("#inputControls");
    var minVel, maxVel, dwellStart = 0;
    var AreaUnderCurve = 0;
    var posPlot, velPlot, accPlot, aioPlot, jerkPlot;
    var xmin = 15;
    var posYMax = 30;
    var velYMax = 8;
    var accYMax = 2.0;
    var jerkYMax = 3;

    var dataSet = { //setting initial values for graph
      "vel": {
        label: "Velocity",
        data: [],
        color: "#f7252a",
        lines: {
          show: true
        },
        hoverable: false,
        clickable: false
      },
      "pos": {
        label: "Position",
        data: [],
        color: "#619beb",
        series: {
          lines: {
            show: false
          }
        },
        hoverable: false,
        clickable: false
      },
      "acc": {
        label: "Acceleration",
        data: [],
        color: "#ff8a65",
        series: {
          lines: {
            show: false
          }
        },
        hoverable: false,
        clickable: false
      },
      "jerk": {
        label: "Jerk",
        data: [],
        color: "#40cc43",
        series: {
          lines: {
            show: false
          }
        },
        hoverable: false,
        clickable: false
      }
    };

    var pointsDataSet = { //setting initial values for graph
      "vel": {
        data: [],
        color: "#ef7c7f",
        lines: {
          show: false
        },
        points: {
          show: true,
          fillColor: '#ef7c7f'
        }
      },
      "pos": {
        data: [],
        color: "#619beb",
        lines: {
          show: false
        },
        points: {
          show: true,
          fillColor: '#619beb'
        }
      },
      "acc": {
        label: "Acceleration",
        data: [],
        color: "#ff8a65"
      },
      "jerk": {
        label: "Jerk",
        data: [],
        color: "#40cc43"
      },
      "dwell": {
        data: [],
        color: "#ef7c7f",
        lines: {
          show: false
        },
        points: {
          show: true,
          fillColor: "#ef7c7f"
        }
      },
      "movetime": {
        data: [],
        color: "#ef7c7f",
        lines: {
          show: false
        },
        points: {
          show: true,
          fillColor: "#ef7c7f"
        }
      }
    };

    var chartOptions = {
      series: {
        lines: {
          show: true
        }
      },
      xaxis: {
        axisLabel: 'Time (sec)',
        position: 'bottom'
      },
      legend: {
        show: true
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderWidth: {
          top: 0,
          bottom: 1,
          right: 0,
          left: 1
        }
      }
    };

    var resetProfileData = function() {
      for (var key in dataSet) {
        if (dataSet.hasOwnProperty(key)) {
          dataSet[key].data = [];
        }
      }
      for (var key in pointsDataSet) {
        if (pointsDataSet.hasOwnProperty(key)) {
          pointsDataSet[key].data = [];
        }
      }
    };

    var getHighestPoint = function(segmentData, axis, leastVal) {
      var keys = Object.keys(segmentData);
      var highestVal = 0;
      for (var keyIndex in keys) {
        if (keys.hasOwnProperty(keyIndex)) {
          var finalVal = 1.2 * segmentData[keys[keyIndex]][0][axis];
          if (highestVal < finalVal) {
            highestVal = finalVal;
          }
        }
      }
      if (highestVal < leastVal) {
        highestVal = leastVal;
      }
      return highestVal;
    };

    var getAioGraphPoints = function() {
      // updating graphs to be displayed
      var aioGraphPointsArr = [];
      if (settings.showGraphs.length > 0) {
        if (settings.showGraphs.indexOf(COSMATT.MotionProfile.configuration.Graphs.position) > -1) {
          aioGraphPointsArr.push(dataSet.pos, pointsDataSet.pos);
        } else {
          aioGraphPointsArr.push([], []);
        }

        if (settings.showGraphs.indexOf(COSMATT.MotionProfile.configuration.Graphs.velocity) > -1) {
          aioGraphPointsArr.push(dataSet.vel, pointsDataSet.vel, pointsDataSet.dwell, pointsDataSet.movetime);
        } else {
          aioGraphPointsArr.push([], [], [], []);
        }

        if (settings.showGraphs.indexOf(COSMATT.MotionProfile.configuration.Graphs.acceleration) > -1) {
          aioGraphPointsArr.push(dataSet.acc);
        } else {
          aioGraphPointsArr.push([]);
        }

        if (settings.showGraphs.indexOf(COSMATT.MotionProfile.configuration.Graphs.jerk) > -1) {
          aioGraphPointsArr.push(dataSet.jerk);
        } else {
          aioGraphPointsArr.push([]);
        }
      }
      return aioGraphPointsArr;
    };

    var updateGraph = function(segmentData) {
      var keys = Object.keys(segmentData);
      var highestTime = getHighestPoint(segmentData, "time_final", xmin);

      if (posPlot) {
        var highestYPtPos = getHighestPoint(segmentData, "position_final", posYMax);
        posPlot.getOptions().yaxes[0].max = highestYPtPos;
        posPlot.getOptions().yaxes[0].min = -1 * highestYPtPos;
        posPlot.getOptions().xaxes[0].max = highestTime;
        posPlot.setupGrid();
        posPlot.setData([dataSet.pos, pointsDataSet.pos]);
        posPlot.draw();
      }

      if (velPlot) {
        var highestYPtVel = getHighestPoint(segmentData, "velocity_final", velYMax);
        velPlot.getOptions().yaxes[0].max = highestYPtVel;
        velPlot.getOptions().yaxes[0].min = -1 * highestYPtVel;
        velPlot.getOptions().xaxes[0].max = highestTime;
        velPlot.setupGrid();
        velPlot.setData([dataSet.vel, pointsDataSet.vel, pointsDataSet.dwell, pointsDataSet.movetime]);
        velPlot.draw();
      }

      if (accPlot) {
        var highestYPtAcc = getHighestPoint(segmentData, "acceleration_final", accYMax);
        accPlot.getOptions().yaxes[0].max = highestYPtAcc;
        accPlot.getOptions().yaxes[0].min = -1 * highestYPtAcc;
        accPlot.getOptions().xaxes[0].max = highestTime;
        accPlot.setupGrid();
        accPlot.setData([dataSet.acc]);
        accPlot.draw();
      }

      if (jerkPlot) {
        var highestYPtJerk = getHighestPoint(segmentData, "jerk", jerkYMax);
        jerkPlot.getOptions().yaxes[0].max = highestYPtJerk;
        jerkPlot.getOptions().yaxes[0].min = -1 * highestYPtJerk;
        jerkPlot.getOptions().xaxes[0].max = highestTime;
        jerkPlot.setupGrid();
        jerkPlot.setData([dataSet.jerk]);
        jerkPlot.draw();
      }

      if (aioPlot) {
        var yaxesArr = aioPlot.getOptions().yaxes;
        var highestYPt;

        for (var i = 0; i < yaxesArr.length; i++) {
          switch (yaxesArr[i].axisLabel) {
            case "Position (rad)":
              highestYPt = getHighestPoint(segmentData, "position_final", posYMax);
              break;
            case "Velocity (rad/sec)":
              highestYPt = getHighestPoint(segmentData, "velocity_final", velYMax);
              break;
            case "Acceleration (rad/sec^2)":
              highestYPt = getHighestPoint(segmentData, "acceleration_final", accYMax);
              break;
            case "Jerk (rad/sec^3)":
              highestYPt = getHighestPoint(segmentData, "jerk", jerkYMax);
              break;
          }
          aioPlot.getOptions().yaxes[i].max = highestYPt;
          aioPlot.getOptions().yaxes[i].min = -1 * highestYPt;
        }

        // //pos plot
        // var highestYPtPos = getHighestPoint(segmentData, "position_final", posYMax);
        // aioPlot.getOptions().yaxes[0].max = highestYPtPos;
        // aioPlot.getOptions().yaxes[0].min = -1 * highestYPtPos;

        // //vel plot
        // var highestYPtVel = getHighestPoint(segmentData, "velocity_final", velYMax);
        // aioPlot.getOptions().yaxes[1].max = highestYPtVel;
        // aioPlot.getOptions().yaxes[1].min = -1 * highestYPtVel;

        // //acc plot
        // var highestYPtAcc = getHighestPoint(segmentData, "acceleration_final", accYMax);
        // aioPlot.getOptions().yaxes[2].max = highestYPtAcc;
        // aioPlot.getOptions().yaxes[2].min = -1 * highestYPtAcc;

        // //jerk plot
        // var highestYPtJerk = getHighestPoint(segmentData, "jerk", jerkYMax);
        // aioPlot.getOptions().yaxes[3].max = highestYPtJerk;
        // aioPlot.getOptions().yaxes[3].min = -1 * highestYPtJerk;

        aioPlot.getOptions().xaxes[0].max = highestTime;
        aioPlot.setupGrid();
        aioPlot.setData(getAioGraphPoints());
        aioPlot.draw();
      }
    };

    var plotGraph = function(segmentData) {
      var posMax = getHighestPoint(segmentData, "position_final", posYMax);
      var velMax = getHighestPoint(segmentData, "velocity_final", velYMax);
      var accMax = getHighestPoint(segmentData, "acceleration_final", accYMax);
      var timeMax = getHighestPoint(segmentData, "time_final", xmin);
      var jerkMax = getHighestPoint(segmentData, "jerk", jerkYMax);
      //append graphs to dom
      var $graphContainer = $widgetContainer.find("#graphContainer");
      if ($graphContainer.children().length === 0) {
        if (settings.graphMode === 0) {
          for (var i = 0; i < settings.showGraphs.length; i++) {
            // $graphContainer.append('<div id="' + settings.showGraphs[i] + 'Graph" class="graphArea"></div>');
            $graphContainer.append('<div id="' + settings.showGraphs[i] + 'Graph" class="graphArea col-xs-12"></div>');
          }
        } else if (settings.graphMode === 1) {
          $graphContainer.append('<div id="aioGraph" class="graphArea"></div>');
        }
      }
      // $graphContainer.find('.graphArea').css("min-width", (100 / $graphContainer.children().length).toFixed(2) + "%");
      $graphContainer.find('.graphArea').addClass("col-md-" + 12 / $graphContainer.children().length);

      var $posGraph = $graphContainer.find("#posGraph");
      var $velGraph = $graphContainer.find("#velGraph");
      var $accGraph = $graphContainer.find("#accGraph");
      var $jerkGraph = $graphContainer.find("#jerkGraph");
      var $aioGraph = $graphContainer.find("#aioGraph");

      if ($posGraph.length > 0) {
        posPlot = $.plot($posGraph, [dataSet.pos, pointsDataSet.pos], $.extend(true, {
          yaxis: {
            min: -1 * posMax,
            max: posMax,
            position: "left",
            axisLabel: "Position (rad)"
          },
          xaxis: {
            min: 0,
            max: timeMax
          }
        }, chartOptions));
        addDragDropFunctionalityPostion(posPlot);
      }
      if ($velGraph.length > 0) {
        velPlot = $.plot($velGraph, [dataSet.vel, pointsDataSet.vel, pointsDataSet.dwell, pointsDataSet.movetime], $.extend(true, {
          yaxis: {
            min: -1 * velMax,
            max: velMax,
            position: "left",
            axisLabel: "Velocity (rad/sec)"
          },
          xaxis: {
            min: 0,
            max: timeMax
          }
        }, chartOptions));
        addDragDropFunctionality(velPlot);
      }
      if ($accGraph.length > 0) {
        accPlot = $.plot($accGraph, [dataSet.acc], $.extend(true, {
          yaxis: {
            min: -1 * accMax,
            max: accMax,
            position: "left",
            axisLabel: "Acceleration (rad/sec^2)"
          },
          xaxis: {
            min: 0,
            max: timeMax
          }
        }, chartOptions));
      }

      if ($jerkGraph.length > 0) {
        jerkPlot = $.plot($jerkGraph, [dataSet.jerk], $.extend(true, {
          yaxis: {
            min: -1 * jerkMax,
            max: jerkMax,
            position: "left",
            axisLabel: "Jerk (rad/sec^3)"
          },
          xaxis: {
            min: 0,
            max: timeMax
          }
        }, chartOptions));
        addDragDropFunctionalityPostion(posPlot);
      }

      if ($aioGraph.length > 0) {
        var yaxesOptions = {
          'pos': {
            position: "left",
            axisLabel: "Position (rad)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            min: -1 * posMax,
            max: posMax
          },
          'vel': {
            position: "left",
            axisLabel: "Velocity (rad/sec)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            min: -1 * velMax,
            max: velMax
          },
          'acc': {
            position: "left",
            axisLabel: "Acceleration (rad/sec^2)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            min: -1 * accMax,
            max: accMax
          },
          'jerk': {
            position: "left",
            axisLabel: "Jerk (rad/sec^3)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            min: -1 * jerkMax,
            max: jerkMax
          }
        }

        var aioOptions = $.extend(true, {
          yaxes: (function() {
            var yaxesArr = [];
            for (var i = 0; i < settings.showGraphs.length; i++) {
              yaxesArr[i] = yaxesOptions[settings.showGraphs[i]];

              dataSet[settings.showGraphs[i]].yaxis = i + 1;
              pointsDataSet[settings.showGraphs[i]].yaxis = i + 1;
            }
            return yaxesArr;
          })(),
          xaxis: {
            min: 0,
            max: timeMax
          }
        }, chartOptions);
        aioOptions.legend = {
          "show": true,
          "backgroundOpacity": 0
        };

        aioPlot = $.plot($aioGraph, getAioGraphPoints(), aioOptions);
        addDragDropFunctionalityAIO(aioPlot);
      }

      if (settings.onGraphPaint) {
        settings.onGraphPaint();
      }
    };

    var plotEmptyGraph = function() {
      // var posMax = getHighestPoint(segmentData, "position_final", posYMax);
      // var velMax = getHighestPoint(segmentData, "velocity_final", velYMax);
      // var accMax = getHighestPoint(segmentData, "acceleration_final", accYMax);
      // var timeMax = getHighestPoint(segmentData, "time_final", xmin);
      // var jerkMax = getHighestPoint(segmentData, "jerk", jerkYMax);
      //append graphs to dom
      var $graphContainer = $widgetContainer.find("#graphContainer");
      if ($graphContainer.children().length === 0) {
        if (settings.graphMode === 0) {
          for (var i = 0; i < settings.showGraphs.length; i++) {
            // $graphContainer.append('<div id="' + settings.showGraphs[i] + 'Graph" class="graphArea"></div>');
            $graphContainer.append('<div id="' + settings.showGraphs[i] + 'Graph" class="graphArea col-xs-12"></div>');
          }
        } else if (settings.graphMode === 1) {
          $graphContainer.append('<div id="aioGraph" class="graphArea"></div>');
        }
      }
      // $graphContainer.find('.graphArea').css("min-width", (100 / $graphContainer.children().length).toFixed(2) + "%");
      $graphContainer.find('.graphArea').addClass("col-md-" + 12 / $graphContainer.children().length);

      var $posGraph = $graphContainer.find("#posGraph");
      var $velGraph = $graphContainer.find("#velGraph");
      var $accGraph = $graphContainer.find("#accGraph");
      var $jerkGraph = $graphContainer.find("#jerkGraph");
      var $aioGraph = $graphContainer.find("#aioGraph");

      if ($posGraph.length > 0) {
        posPlot = $.plot($posGraph, [dataSet.pos, pointsDataSet.pos], $.extend(true, {
          yaxis: {
            // min: -1 * posMax,
            // max: posMax,
            position: "left",
            axisLabel: "Position (rad)"
          },
          xaxis: {
            min: 0,
            // max: timeMax
          }
        }, chartOptions));
        // addDragDropFunctionalityPostion(posPlot);
      }
      if ($velGraph.length > 0) {
        velPlot = $.plot($velGraph, [dataSet.vel, pointsDataSet.vel, pointsDataSet.dwell, pointsDataSet.movetime], $.extend(true, {
          yaxis: {
            // min: -1 * velMax,
            // max: velMax,
            position: "left",
            axisLabel: "Velocity (rad/sec)"
          },
          xaxis: {
            min: 0,
            // max: timeMax
          }
        }, chartOptions));
        // addDragDropFunctionality(velPlot);
      }
      if ($accGraph.length > 0) {
        accPlot = $.plot($accGraph, [dataSet.acc], $.extend(true, {
          yaxis: {
            // min: -1 * accMax,
            // max: accMax,
            position: "left",
            axisLabel: "Acceleration (rad/sec^2)"
          },
          xaxis: {
            min: 0,
            // max: timeMax
          }
        }, chartOptions));
      }

      if ($jerkGraph.length > 0) {
        jerkPlot = $.plot($jerkGraph, [dataSet.jerk], $.extend(true, {
          yaxis: {
            // min: -1 * jerkMax,
            // max: jerkMax,
            position: "left",
            axisLabel: "Jerk (rad/sec^3)"
          },
          xaxis: {
            min: 0,
            // max: timeMax
          }
        }, chartOptions));
        // addDragDropFunctionalityPostion(posPlot);
      }

      if ($aioGraph.length > 0) {
        var yaxesOptions = {
          'pos': {
            position: "left",
            axisLabel: "Position (rad)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            // min: -1 * posMax,
            // max: posMax
          },
          'vel': {
            position: "left",
            axisLabel: "Velocity (rad/sec)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            // min: -1 * velMax,
            // max: velMax
          },
          'acc': {
            position: "left",
            axisLabel: "Acceleration (rad/sec^2)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            // min: -1 * accMax,
            // max: accMax
          },
          'jerk': {
            position: "left",
            axisLabel: "Jerk (rad/sec^3)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            // min: -1 * jerkMax,
            // max: jerkMax
          }
        }

        var aioOptions = $.extend(true, {
          yaxes: (function() {
            var yaxesArr = [];
            for (var i = 0; i < settings.showGraphs.length; i++) {
              yaxesArr[i] = yaxesOptions[settings.showGraphs[i]];

              dataSet[settings.showGraphs[i]].yaxis = i + 1;
              pointsDataSet[settings.showGraphs[i]].yaxis = i + 1;
            }
            return yaxesArr;
          })(),
          xaxis: {
            min: 0,
            // max: timeMax
          }
        }, chartOptions);
        aioOptions.legend = {
          "show": true,
          "backgroundOpacity": 0
        };

        aioPlot = $.plot($aioGraph, getAioGraphPoints(), aioOptions);
        // addDragDropFunctionalityAIO(aioPlot);
      }

      if (settings.onGraphPaint) {
        settings.onGraphPaint();
      }
    };

    var updateGraphData = function(element, timeSlice) {
      var initialTime = element.time_initial;
      var finalTime = element.time_final;
      var Ka = element.motion_equation_third_order_coefficient;
      var Kb = element.motion_equation_second_order_coefficient;
      var Kc = element.motion_equation_first_order_coefficient;
      var Kd = element.motion_equation_zero_order_coefficient;

      var deltaTime = finalTime - initialTime;
      var stepSize = deltaTime / timeSlice;
      for (var time = 0; time < deltaTime; time = time + stepSize) {
        dataSet.jerk.data.push([time + initialTime, 6 * Ka]);
        dataSet.acc.data.push([time + initialTime, 6 * Ka * time + 2 * Kb]);
        dataSet.vel.data.push([time + initialTime, 3 * Ka * Math.pow(time, 2) + 2 * Kb * time + Kc]);
        dataSet.pos.data.push([time + initialTime, Ka * Math.pow(time, 3) + Kb * Math.pow(time, 2) + Kc * time + Kd]);
      }
    };

    var updatePointsGraphData = function(profileElements) {
      var velPonit, dwellTimePoint, moveTimePoint, posPoint;
      if (profileElements.cruise) {
        var timePoint = (profileElements.cruise[0].time_final + profileElements.cruise[0].time_initial) / 2;
        velPonit = [timePoint, profileElements.cruise[0].velocity_final];
      } else if (profileElements.accel) {
        // velPonit = [profileElements.accel[0].time_final, profileElements.accel[0].velocity_final];
        var maxVelPoint = 0;
        for (var i = 0; i < dataSet.vel.data.length; i++) {
          if (dataSet.vel.data[i][1] > maxVelPoint) {
            maxVelPoint = dataSet.vel.data[i][1];
            velPonit = dataSet.vel.data[i];
          }
        }
      }
      if (profileElements.dwell) {
        dwellTimePoint = [profileElements.dwell[0].time_final, profileElements.dwell[0].velocity_final];
      }
      // if (profileElements.decel) {
      // 	moveTimePoint = [profileElements.decel[0].time_final, profileElements.decel[0].velocity_final];
      // } else if (profileElements.cruise) {
      // 	moveTimePoint = [profileElements.cruise[0].time_final, 0];
      // }
      var mvTime = parseFloat(uiValues.movedtime);
      if (mvTime) {
        for (var i = 0; i < dataSet.vel.data.length; i++) {
          if (dataSet.vel.data[i][0] == mvTime) {
            moveTimePoint = dataSet.vel.data[i];
          }
        }
      }


      //Position Graph 
      var totalTime = parseFloat(uiValues.movedtime + uiValues.dweltime || 0);
      var pos_final = parseFloat(uiValues.movedistance);
      posPoint = [totalTime, pos_final];

      if (settings.showGraphDragHandles) {
        if (settings.showGraphDragHandles.indexOf("position") > -1) {
          pointsDataSet.pos.data.push(posPoint);
        }
        if (settings.showGraphDragHandles.indexOf("peakVelocity") > -1) {
          pointsDataSet.vel.data.push(velPonit);
        }
        if (settings.showGraphDragHandles.indexOf("moveTime") > -1) {
          pointsDataSet.movetime.data.push(moveTimePoint);
        }
        if (settings.showGraphDragHandles.indexOf("dwellTime") > -1) {
          pointsDataSet.dwell.data.push(dwellTimePoint);
        }
      }
    };

    var updateCalculatedFields = function(profileElements) {
      var peakVel, rmsVel, peakAcc, rmsAcc;

      // var t1 = profileElements.accel ? profileElements.accel[0].time_final : 0;
      // var t2 = profileElements.cruise ? profileElements.cruise[0].time_final : 0;
      // var t3 = profileElements.decel ? profileElements.decel[0].time_final : 0;
      var t4 = profileElements.dwell ? profileElements.dwell[0].time_final : 0;

      var t1, t2, t3;
      t1 = t2 = t3 = 0;
      var a1, a2, a3, a4;
      a1 = a2 = a3 = a4 = 0;

      // rectangular
      if (profileElements.cruise && !profileElements.accel && !profileElements.decel) {
        peakVel = profileElements.cruise[0].velocity_final;
        peakAcc = profileElements.cruise[0].acceleration_final;

        peakVel = parseFloat(peakVel.toFixed(2));
        peakAcc = parseFloat(peakAcc.toFixed(2));

        rmsVel = peakVel;
        rmsAcc = peakAcc;

        a2 = profileElements.cruise[0].rms_acceleration;
        t2 = profileElements.cruise[0].time_final;
      }

      // triangular
      if (!profileElements.cruise && profileElements.accel && profileElements.decel) {
        peakVel = profileElements.accel[0].velocity_final;
        peakAcc = profileElements.accel[0].acceleration_final;

        peakVel = parseFloat(peakVel.toFixed(2));
        peakAcc = parseFloat(peakAcc.toFixed(2));

        // rmsVel = Math.sqrt(Math.pow(profileElements.accel[0].rms_velocity, 2) + Math.pow(profileElements.decel[0].rms_velocity, 2));
        rmsVel = peakVel / Math.sqrt(3);
        rmsAcc = Math.sqrt(Math.pow(profileElements.accel[0].rms_acceleration, 2) + Math.pow(profileElements.decel[0].rms_acceleration, 2));

        a1 = profileElements.accel[0].rms_acceleration;
        a3 = profileElements.decel[0].rms_acceleration;
        t1 = profileElements.accel[0].time_final;
        t3 = profileElements.decel[0].time_final;
        t2 = t1;
      }

      // trapezoidal
      if (profileElements.cruise && profileElements.accel && profileElements.decel) {
        peakVel = profileElements.cruise[0].velocity_final;
        peakAcc = profileElements.accel[0].acceleration_final;

        peakVel = parseFloat(peakVel.toFixed(2));
        peakAcc = parseFloat(peakAcc.toFixed(2));

        // var t1 = profileElements.accel ? profileElements.accel[0].time_final : 0;
        // var t2 = profileElements.cruise ? profileElements.cruise[0].time_final : 0;
        // var t3 = profileElements.decel ? profileElements.decel[0].time_final : 0;
        // var t4 = profileElements.dwell ? profileElements.dwell[0].time_final : 0;

        t1 = profileElements.accel[0].time_final;
        t2 = profileElements.cruise[0].time_final;
        t3 = profileElements.decel[0].time_final;

        var T = Math.max(t1, t2, t3, t4);

        rmsVel = peakVel * (Math.sqrt((t2 - t1 + (t3 - t2 + t1) / 3) / T));

        a1 = profileElements.accel[0].rms_acceleration;
        a2 = profileElements.cruise[0].rms_acceleration;
        a3 = profileElements.decel[0].rms_acceleration;


        // var a1 = profileElements.accel[0].rms_acceleration;
        // var a2 = profileElements.cruise[0].rms_acceleration;
        // var a3 = profileElements.decel[0].rms_acceleration;
        // var a4 = 0; // dwell time

        // console.log(a1, a2, a3, a4);

        // rmsVel = Math.sqrt(Math.pow(profileElements.accel[0].rms_velocity, 2) + Math.pow(profileElements.cruise[0].rms_velocity, 2) + Math.pow(profileElements.decel[0].rms_velocity, 2));
        // rmsAcc = Math.sqrt(((Math.pow(a1, 2) * t1) + (Math.pow(a2, 2) * t2) + (Math.pow(a3, 2) * t3) + (Math.pow(a4, 2) * t4)) / (t1 + t2 + t3 + t4));
      }
      var T = Math.max(t1, t2, t3, t4);

      rmsAcc = Math.sqrt(((Math.pow(a1, 2) * t1) + (Math.pow(a2, 2) * (t2 - t1)) + (Math.pow(a3, 2) * (t3 - t2)) + (Math.pow(a4, 2) * (t4 - t3))) / (T));

      calculatedValues.peakVel = peakVel;
      calculatedValues.peakAcc = peakAcc;
      calculatedValues.rmsVel = parseFloat(rmsVel.toFixed(3));
      calculatedValues.rmsAcc = parseFloat(rmsAcc.toFixed(3));

      updateCalculatedControls();
    };

    $container.find('#profileButtons').on('click', '.profileButton', function(e) {
      e.preventDefault();
      if ($(this).attr('id') != undefined) {
        settings.activeProfileIndex = parseInt($(this).attr('id').slice(3));
        settings.smoothness = $inputControls.find("#smoothnessInputContainer").find(".smoothnessDropDown").find('.smoothnessDDMenu')[0].selectedIndex;
        $container.find('#profileButtons').find(".profileButton.btn-primary").removeClass("btn-primary").addClass("btn-default");
        $(this).addClass("btn-primary").removeClass("btn-default");
        readUIValues();
        calculateAndPaint();
      }
    });

    var resetCalculatedValues = function() {
      calculatedValues.peakVel = '';
      calculatedValues.peakAcc = '';
      calculatedValues.rmsVel = '';
      calculatedValues.rmsAcc = '';
      updateCalculatedControls();
    }

    var readUIValues = function() {
      uiValues.movedistance = settings.moveDistance;
      uiValues.movedtime = settings.moveTime;
      uiValues.dweltime = settings.dwellTime;
      updateIndexType();
      uiValues.velocityJerk = settings.indexType;
      uiValues.smoothness = settings.smoothness;
    };

    var validateUIValues = function() {
      var bret = true;
      // var errorInputs = [];
      $inputControls.find(".input-entries .form-group").removeClass("has-error");
      if (!(!isNaN(uiValues.movedistance) && uiValues.movedistance > 0)) {
        $inputControls.find("#moveDistanceInputContainer").addClass("has-error");
        bret = false;
      }
      if (!(!isNaN(uiValues.movedistance) && uiValues.movedtime > 0)) {
        $inputControls.find("#moveTimeInputContainer").addClass("has-error");
        bret = false;
      }
      if (!(!isNaN(uiValues.dweltime) && uiValues.dweltime >= 0)) {
        $inputControls.find("#dwellTimeInputContainer").addClass("has-error");
        bret = false;
      }

      if (!(!isNaN(uiValues.velocityJerk) && (uiValues.velocityJerk >= 0 && uiValues.velocityJerk <= 100))) {
        $inputControls.find("#indexTypeInputContainer").addClass("has-error");
        bret = false;
      }
      if (settings.assessmentMode) {
        $inputControls.find(".input-entries .form-group").removeClass("has-error");
      }
      return bret;
    };

    var readinitialValues = function() {
      initialValues.time = 0;
      initialValues.position = 0;
      initialValues.velocity = 0;
    };

    var saveVelMaxMinPoints = function(profileElements) {
      AreaUnderCurve = 0;
      var prevWidth = dataSet.vel.data[0][0];
      for (var i = 1; i < dataSet.vel.data.length; i++) {
        AreaUnderCurve = AreaUnderCurve + ((dataSet.vel.data[i][0] - prevWidth) * dataSet.vel.data[i][1]);
        prevWidth = dataSet.vel.data[i][0];
      }

      minVel = -Infinity;
      var inputData = (JSON.parse(JSON.stringify(uiValues)));
      inputData.velocityJerk = 100;
      inputData.velocityJerk = 0;
      var minVelSegmentData = COSMATT.ProfileCalculation.ProfileIndexModel.calculate(inputData, initialValues).segmentData;
      for (var i = 0; i < Object.keys(minVelSegmentData).length; i++) {
        for (var j = 0; j < minVelSegmentData[Object.keys(minVelSegmentData)[i]].length; j++) {
          if (minVel < minVelSegmentData[Object.keys(minVelSegmentData)[i]][j].velocity_initial) {
            minVel = minVelSegmentData[Object.keys(minVelSegmentData)[i]][j].velocity_initial;
          }
        }
      }
      maxVel = 2 * minVel;
      if (profileElements.dwell) {
        dwellStart = profileElements.dwell[0].time_initial;
      }
    };

    var showTooltip = function(x, y, contents) {
      $('<div id="tooltip">' + contents + '</div>').css({

        top: y + 5,
        left: x + 15,
        // border: '2px solid #000',
        // padding: '2px',
        // size: '10',
        // 'border-radius': '6px 6px 6px 6px',
        // 'background-color': '#fff',
      }).appendTo($widgetContainer).fadeIn(200);
    };

    var addDragDropFunctionality = function(plot) {

      var hoverItem = null;
      var dragItem = null;

      var prevItemIndex = null;

      $container.find("#velGraph").unbind("plothover").bind("plothover", function(event, pos, item) {
        hoverItem = item;
        if (item) {
          var targetOffset = $widgetContainer.offset();
          if (prevItemIndex != item.seriesIndex) {
            switch (item.seriesIndex) {
              case 1:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Velocity Form Factor");
                prevItemIndex = item.seriesIndex;
                break;
              case 2:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Dwell Time");
                prevItemIndex = item.seriesIndex;
                break;
              case 3:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Move Time");
                prevItemIndex = item.seriesIndex;
                break;
              default:
                break;
            }
          }
        } else {
          $widgetContainer.find('#tooltip').remove();
          prevItemIndex = null;
        }

        if (dragItem && dragItem.seriesIndex) {
          var data = plot.getData();
          switch (dragItem.seriesIndex) {
            case 1:
              var Vff;
              if (pos.y >= maxVel) {
                Vff = 100;
              } else if (pos.y <= minVel) {
                Vff = 0;
              } else {
                var xpos = parseFloat(uiValues.movedtime) - AreaUnderCurve / pos.y;
                Vff = xpos * pos.y * 100 / AreaUnderCurve;
              }
              uiValues.velocityJerk = parseFloat(Math.ceil(Vff).toFixed(2));
              break;
            case 2:
              var dwt;
              if (pos.x < dwellStart) {
                dwt = 0;
              } else {
                dwt = parseFloat(pos.x - dwellStart);
              }
              uiValues.dweltime = parseFloat(dwt.toFixed(2));
              break;
            case 3:
              var mvtime;
              var dwellTime
              if (pos.x <= 0) {
                mvtime = 1;
              } else {
                mvtime = pos.x;
              }
              uiValues.movedtime = parseFloat(mvtime.toFixed(2));
              break;
            default:
              break;
          }
          calculateAndPaint(true);
        }
      });

      $container.find("#velGraph").unbind("mousedown").bind("mousedown", function() {
        $widgetContainer.find('#tooltip').remove();
        if (hoverItem) {
          switch (hoverItem.seriesIndex) {
            case 1:
              if ((hoverItem.datapoint[1] >= minVel) && (hoverItem.datapoint[1] <= maxVel)) {
                dragItem = hoverItem;
              }
              break;
            case 2:
              if (hoverItem.datapoint[0] >= dwellStart) {
                dragItem = hoverItem;
              }
              break;
            case 3:
              if (hoverItem.datapoint[0] > 0) {
                dragItem = hoverItem;
              }
              break;
            default:
              break;
          }
        }
      });

      $container.find("#velGraph").unbind("mouseup").bind("mouseup", function() {
        if (dragItem && settings.onGraphDrag) {
          settings.onGraphDrag();
        }
        dragItem = null;
      });

      $container.find("#velGraph").unbind("mouseleave").bind("mouseleave", function() {
        $container.find("#velGraph").mouseup();
      });
    };

    var addDragDropFunctionalityPostion = function(plot) {

      var hoverItem = null;
      var dragItem = null;

      var prevItemIndex = null;

      $container.find("#posGraph").unbind("plothover").bind("plothover", function(event, pos, item) {
        hoverItem = item;
        if (item) {
          var targetOffset = $widgetContainer.offset();
          if (prevItemIndex != item.seriesIndex) {
            switch (item.seriesIndex) {
              case 1:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Move Distance");
                prevItemIndex = item.seriesIndex;
                break;
              default:
                break;
            }
          }
        } else {
          $widgetContainer.find('#tooltip').remove();
          prevItemIndex = null;
        }
        if (dragItem && dragItem.seriesIndex) {
          var data = plot.getData();
          switch (dragItem.seriesIndex) {
            case 1:
              var moveDis;
              if (pos.y <= 0) {
                moveDis = 1;
              } else {
                moveDis = parseFloat(pos.y);
              }
              uiValues.movedistance = parseFloat(moveDis.toFixed(2));
              break;
            default:
              break;
          }
          calculateAndPaint(true);
        }
      });

      $container.find("#posGraph").unbind("mousedown").bind("mousedown", function() {
        $widgetContainer.find('#tooltip').remove();
        if (hoverItem) {
          switch (hoverItem.seriesIndex) {
            case 1:
              if (hoverItem.datapoint[1] > 0) {
                dragItem = hoverItem;
              }
              break;
            default:
              break;
          }
        }
      });

      $container.find("#posGraph").unbind("mouseup").bind("mouseup", function() {
        if (dragItem && settings.onGraphDrag) {
          settings.onGraphDrag();
        }
        dragItem = null;
      });

      $container.find("#posGraph").unbind("mouseleave").bind("mouseleave", function() {
        $container.find("#posGraph").mouseup();
      });
    };

    var addDragDropFunctionalityAIO = function(plot) {
      var hoverItem = null;
      var dragItem = null;
      var prevItemIndex = null;

      $container.find("#aioGraph").unbind("plothover").bind("plothover", function(event, pos, item) {
        hoverItem = item;

        if (item) {
          var targetOffset = $widgetContainer.offset();
          if (prevItemIndex != item.seriesIndex) {
            switch (item.seriesIndex) {
              case 1:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Move Distance");
                prevItemIndex = item.seriesIndex;
                break;
              case 3:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Velocity Form Factor");
                prevItemIndex = item.seriesIndex;
                break;
              case 4:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Dwell Time");
                prevItemIndex = item.seriesIndex;
                break;
              case 5:
                showTooltip(item.pageX - targetOffset.left, item.pageY - targetOffset.top, "Drag to change Move Time");
                prevItemIndex = item.seriesIndex;
                break;
              default:
                break;
            }
          }
        } else {
          $widgetContainer.find('#tooltip').remove();
          prevItemIndex = null;
        }

        if (dragItem && dragItem.seriesIndex) {
          var data = plot.getData();
          switch (dragItem.seriesIndex) {
            case 1:
              var moveDis;
              if (pos.y <= 0) {
                moveDis = 1;
              } else {
                moveDis = parseFloat(pos.y);
              }
              uiValues.movedistance = parseFloat(moveDis.toFixed(2));
              break;
            case 3:
              var Vff;
              var yCordinate = settings.showGraphs.indexOf(COSMATT.MotionProfile.configuration.Graphs.position) > -1 ? pos.y2 : pos.y1;
              if (yCordinate >= maxVel) {
                Vff = 100;
              } else if (yCordinate <= minVel) {
                Vff = 0;
              } else {
                var xpos = parseFloat(uiValues.movedtime) - AreaUnderCurve / yCordinate;
                Vff = xpos * yCordinate * 100 / AreaUnderCurve;
              }
              uiValues.velocityJerk = parseFloat(Math.ceil(Vff).toFixed(2));
              break;
            case 4:
              var dwt;
              if (pos.x < dwellStart) {
                dwt = 0;
              } else {
                dwt = parseFloat(pos.x - dwellStart);
              }
              uiValues.dweltime = parseFloat(dwt.toFixed(2));
              break;
            case 5:
              var mvtime;
              var dwellTime
              if (pos.x <= 0) {
                mvtime = 1;
              } else {
                mvtime = pos.x;
              }
              uiValues.movedtime = parseFloat(mvtime.toFixed(2));
              break;
            default:
              break;
          }
          calculateAndPaint(true);
        }
      });

      $container.find("#aioGraph").unbind("mousedown").bind("mousedown", function() {
        $widgetContainer.find('#tooltip').remove();
        if (hoverItem) {
          switch (hoverItem.seriesIndex) {
            case 1:
              if (hoverItem.datapoint[1] > 0) {
                dragItem = hoverItem;
              }
              break;
            case 3:
              if ((hoverItem.datapoint[1] >= minVel) && (hoverItem.datapoint[1] <= maxVel)) {
                dragItem = hoverItem;
              }
              break;
            case 4:
              if (hoverItem.datapoint[0] >= dwellStart) {
                dragItem = hoverItem;
              }
              break;
            case 5:
              if (hoverItem.datapoint[0] > 0) {
                dragItem = hoverItem;
              }
              break;
            default:
              break;
          }
        }
      });

      $container.find("#aioGraph").unbind("mouseup").bind("mouseup", function() {
        if (dragItem && settings.onGraphDrag) {
          settings.onGraphDrag();
        }
        dragItem = null;
      });

      $container.find("#aioGraph").unbind("mouseleave").bind("mouseleave", function() {
        $container.find("#aioGraph").mouseup();
      });
    };

    var calculateData = function(dataonly) {
      outputData = COSMATT.ProfileCalculation.ProfileIndexModel.calculate(uiValues, initialValues);
      var profileElements = outputData.elementsData;
      var profileElementsLength = profileElements.length;
      if (profileElementsLength > 0) {
        var timeSlice = 100;
        resetProfileData();
        for (var element = 0; element < profileElementsLength; element++) {
          updateGraphData(profileElements[element], timeSlice);

        }
      }
      updatePointsGraphData(outputData.segmentData);
      updateCalculatedFields(outputData.segmentData);
      saveVelMaxMinPoints(outputData.segmentData);
      if (dataonly) {
        updateGraph(outputData.segmentData);
      } else {
        plotGraph(outputData.segmentData);
      }
    };

    var updateIndexType = function() {
      switch (settings.activeProfileIndex) {
        case 1:
          settings.indexType = 50;
          break;
        case 2:
          settings.indexType = 100;
          break;
        case 3:
          settings.indexType = 0;
          break;
        default:
          break;
      }
    };

    var inputControlsCallbackFn = function() {
      calculateAndPaint();
    };

    var generateInputControls = function() {
      var $inputControls = $widgetContainer.find("#inputControls");
      $inputControls.append('<form class="row form-horizontal"><div class="col-sm-6 input-entries"><div class="row form-group" id="moveDistanceInputContainer"><label for="moveDistance" class="col-sm-4 control-label">Move Distance</label><div class="col-sm-8 comboMoveDistance"></div></div><div class="row form-group" id="moveTimeInputContainer"><label for="moveTime" class="col-sm-4 control-label">Move Time</label><div class="col-sm-8 comboMoveTime"></div></div><div class="row form-group" id="dwellTimeInputContainer"><label for="dwellTime" class="col-sm-4 control-label">Dwell Time</label><div class="col-sm-8 comboDwellTime"></div></div><div class="row form-group" id="indexTypeInputContainer"><label for="indexType" class="col-sm-4 control-label">Velocity Jerk</label><div class="col-sm-8 comboIndexType"></div></div><div class="row form-group" id="smoothnessInputContainer"><label for="smoothness" class="col-sm-4 control-label">Smoothness</label><div class="col-sm-8 smoothnessDropDown"></div></div></div><div class="col-sm-6"><div class="row form-group" id="peakVelocityInputContainer"><label for="peakVelocity" class="col-sm-4 control-label">Peak Velocity</label><div class="col-sm-8 comboPeakVelocity"></div></div><div class="row form-group" id="rmsVelocityInputContainer"><label for="rmsVelocity" class="col-sm-4 control-label">RMS Velocity</label><div class="col-sm-8 comboRmsVelocity"></div></div><div class="row form-group" id="peakAccInputContainer"><label for="peakAcc" class="col-sm-4 control-label">Peak Acceleration</label><div class="col-sm-8 comboPeakAcc"></div></div><div class="row form-group" id="rmsAccInputContainer"><label for="rmsAcc" class="col-sm-4 control-label">RMS Acceleration</label><div class="col-sm-8 comboRmsAcc"></div></div></div></form>');

      $inputControls.find("#moveDistanceInputContainer").find(".comboMoveDistance").unitsComboBox({
        "unitType": "ANGULARDISTANCE",
        "unit": "rad",
        "value": settings.moveDistance,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        },
        callBackFn: function() {
          uiValues.movedistance = isNaN(parseFloat(this.value)) ? '' : parseFloat(this.value);
          inputControlsCallbackFn();
          if (settings.assessmentMode && settings.userResponseNotifier) {
            settings.userResponseNotifier({ "movedistance": uiValues.movedistance });
          }
        }
      });

      $inputControls.find("#moveTimeInputContainer").find(".comboMoveTime").unitsComboBox({
        "unitType": "TIME",
        "unit": "sec",
        "value": settings.moveTime,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        },
        callBackFn: function() {
          uiValues.movedtime = isNaN(parseFloat(this.value)) ? '' : parseFloat(this.value);
          inputControlsCallbackFn();
          if (settings.assessmentMode && settings.userResponseNotifier) {
            settings.userResponseNotifier({ "movedtime": uiValues.movedtime });
          }
        }
      });

      $inputControls.find("#dwellTimeInputContainer").find(".comboDwellTime").unitsComboBox({
        "unitType": "TIME",
        "unit": "sec",
        "value": settings.dwellTime,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        },
        callBackFn: function() {
          uiValues.dweltime = isNaN(parseFloat(this.value)) ? '' : parseFloat(this.value);
          inputControlsCallbackFn();
          if (settings.assessmentMode && settings.userResponseNotifier) {
            settings.userResponseNotifier({ "dweltime": uiValues.dweltime });
          }
        }
      });

      updateIndexType();

      $inputControls.find("#indexTypeInputContainer").find(".comboIndexType").unitsComboBox({
        "unitType": "PERCENTAGE",
        "unit": "%",
        "value": settings.indexType,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        },
        callBackFn: function() {
          uiValues.velocityJerk = isNaN(parseFloat(this.value)) ? '' : parseFloat(this.value);
          inputControlsCallbackFn();
          if (settings.assessmentMode && settings.userResponseNotifier) {
            settings.userResponseNotifier({ "velocityJerk": uiValues.velocityJerk });
          }
        }
      });
      // smoothness dropdown
      var $smoothnessDD = $inputControls.find("#smoothnessInputContainer").find(".smoothnessDropDown");
      $smoothnessDD.append('<select class="form-control smoothnessDDMenu"><option value=automatic>Automatic<option value=standard>Standard<option value=maximum>Maximum</select>');
      if (settings.smoothness) {
        $smoothnessDD.find('select option').eq(settings.smoothness).attr("selected", true);
      }
      $smoothnessDD.find('select').on('change', function(e) {
        uiValues.smoothness = e.target.selectedIndex;
        calculateAndPaint(true);
      });
      // $smoothnessDD.find('.chosen-select').chosen({
      // 	disable_search: true
      // });

      $inputControls.find("#peakVelocityInputContainer").find(".comboPeakVelocity").unitsComboBox({
        "unitType": "ANGULARVELOCITY",
        "unit": "rad/sec",
        "value": 0,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        }
      });

      $inputControls.find("#rmsVelocityInputContainer").find(".comboRmsVelocity").unitsComboBox({
        "unitType": "ANGULARVELOCITY",
        "unit": "rad/sec",
        "value": 0,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        }
      });

      $inputControls.find("#peakAccInputContainer").find(".comboPeakAcc").unitsComboBox({
        "unitType": "ANGULARACCELERATION",
        "unit": "rad/sec²",
        "value": 0,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        }
      });

      $inputControls.find("#rmsAccInputContainer").find(".comboRmsAcc").unitsComboBox({
        "unitType": "ANGULARACCELERATION",
        "unit": "rad/sec²",
        "value": 0,
        "comboBoxWidthRatio": {
          "textBox": "60%",
          "comboBox": "40%"
        }
      });
    };

    var updateCalculatedControls = function() {
      $inputControls.find("#moveDistanceInputContainer").find(".comboMoveDistance").data('unitsComboBox').setTextBoxValue(uiValues.movedistance);
      $inputControls.find("#moveTimeInputContainer").find(".comboMoveTime").data('unitsComboBox').setTextBoxValue(uiValues.movedtime);
      $inputControls.find("#dwellTimeInputContainer").find(".comboDwellTime").data('unitsComboBox').setTextBoxValue(uiValues.dweltime);
      $inputControls.find("#indexTypeInputContainer").find(".comboIndexType").data('unitsComboBox').setTextBoxValue(uiValues.velocityJerk);
      $inputControls.find("#peakVelocityInputContainer").find(".comboPeakVelocity").data('unitsComboBox').setTextBoxValue(calculatedValues.peakVel);
      $inputControls.find("#rmsVelocityInputContainer").find(".comboRmsVelocity").data('unitsComboBox').setTextBoxValue(calculatedValues.rmsVel);
      $inputControls.find("#peakAccInputContainer").find(".comboPeakAcc").data('unitsComboBox').setTextBoxValue(calculatedValues.peakAcc);
      $inputControls.find("#rmsAccInputContainer").find(".comboRmsAcc").data('unitsComboBox').setTextBoxValue(calculatedValues.rmsAcc);
    };

    var uiHandler = function($domContainer) {
      var $profileButtons = $widgetContainer.find('#profileButtons');
      $profileButtons.find("#btn" + settings.activeProfileIndex).addClass('btn-primary').removeClass('btn-default');

      if (settings.showProfiles) {
        handleProfilesVisibility(settings.showProfiles, $profileButtons);
      }
      if (settings.showGraphDragHandles) {
        handleGraphDragHandles(settings.showGraphDragHandles);
      }
      if (settings.readOnlyInputs) {
        makeInputsReadOnly(settings.readOnlyInputs);
      }
      if (settings.hideInputs) {
        handleInputsVisibility(settings.hideInputs);
      }
    };

    var handleProfilesVisibility = function(showProfiles, $profileButtons) {
      $profileButtons.find("button").hide();
      if (typeof(showProfiles) === "boolean") { //hide all profile buttons
        if (showProfiles === true) {
          $profileButtons.show();
        } else {
          $profileButtons.hide();
        }
      } else if (showProfiles.length > 0) {
        for (var profile in showProfiles) {
          profile = showProfiles[profile];
          $profileButtons.find('#btn' + profile.slice(profile.length - 1)).show();
        }
      }
    };

    var handleGraphDragHandles = function(showGraphDragHandles) {
      if (typeof(showGraphDragHandles) === "boolean") {
        if (showGraphDragHandles === true) {
          settings.showGraphDragHandles = [COSMATT.MotionProfile.configuration.GraphHandles.position, COSMATT.MotionProfile.configuration.GraphHandles.peakVelocity, COSMATT.MotionProfile.configuration.GraphHandles.moveTime, COSMATT.MotionProfile.configuration.GraphHandles.dwellTime];
        } else {
          settings.showGraphDragHandles = [];
        }
      }
    };

    var makeInputsReadOnly = function(readOnlyInputsArr) {
      if (typeof(readOnlyInputsArr) === "boolean") {
        if (readOnlyInputsArr === true) {
          readOnlyInputsArr = [COSMATT.MotionProfile.configuration.DataFields.moveDistance, COSMATT.MotionProfile.configuration.DataFields.moveTime, COSMATT.MotionProfile.configuration.DataFields.dwellTime, COSMATT.MotionProfile.configuration.DataFields.velocityFormFactor, COSMATT.MotionProfile.configuration.DataFields.peakVelocity, COSMATT.MotionProfile.configuration.DataFields.rmsVelocity, COSMATT.MotionProfile.configuration.DataFields.peakAccelaration, COSMATT.MotionProfile.configuration.DataFields.rmsAccelaration];
        } else {
          readOnlyInputsArr = [];
        }
      }
      if (readOnlyInputsArr.length > 0) {
        for (var inputEle in readOnlyInputsArr) {
          if (readOnlyInputsArr.hasOwnProperty(inputEle)) {
            inputEle = readOnlyInputsArr[inputEle];
            $inputControls.find("#" + inputEle + "InputContainer").find(".combo" + inputEle.charAt(0).toUpperCase() + inputEle.slice(1)).data('unitsComboBox').update({
              "enable": {
                "textbox": "false",
                "comboBox": "true"
              }
            });
          }
        }
      }
    };

    var handleInputsVisibility = function(hideInputsArr) {
      if (typeof(hideInputsArr) === "boolean") {
        if (hideInputsArr === true) {
          $inputControls.hide();
        } else {
          $inputControls.show();
        }
      }
      if (hideInputsArr.length > 0) {
        for (var inputEle in hideInputsArr) {
          if (hideInputsArr.hasOwnProperty(inputEle)) {
            inputEle = hideInputsArr[inputEle];
            $inputControls.find("#" + inputEle + "InputContainer").hide();
          }
        }
      }
    };

    var addEditConfigurations = function() {
      var $body = $('body');
      var $editConfigButton = '<div id="editConfigBtnContainer"><button class="btn btn-default editConfigBtn pull-right btn-lg" type="button" href="configWindow.html" data-target="#theModal" data-toggle="modal">Edit Configurations</div>';
      $body.append($editConfigButton);
    };

    var addCheckAnsButton = function() {
      $widgetContainer.append('<div class="text-right text-xs-right"><button type="button" class="btn btn-primary">Check Answer</button></div>');
    }

    generateInputControls();
    uiHandler($widgetContainer);
    if (settings.showEditConfigButton) {
      addEditConfigurations();
    }

    if (settings.showCheckAnswerButton) {
      //addCheckAnsButton();
    }

    readUIValues();
    readinitialValues();

    var calculateAndPaint = function(dataonly, settimeout) {
      if (validateUIValues()) {
        if (settimeout) {
          setTimeout(function(dataonly) {
            calculateData();
          }, 0);
        } else {
          calculateData(dataonly);
        }
      } else {
        resetProfileData();
        resetCalculatedValues();
        setTimeout(function(dataonly) {
          plotEmptyGraph();
        }, 0);
      }
    }

    calculateAndPaint(false, true);

    function updateInputs(params) {
      if (params.movedistance) {
        uiValues.movedistance = parseInt(params.movedistance);
        $inputControls.find("#moveDistanceInputContainer").find(".comboMoveDistance").data('unitsComboBox').setTextBoxValue(uiValues.movedistance);
      }
      if (params.movedtime) {
        uiValues.movedtime = parseInt(params.movedtime);
        $inputControls.find("#moveTimeInputContainer").find(".comboMoveTime").data('unitsComboBox').setTextBoxValue(uiValues.movedtime);
      }
      if (params.dweltime) {
        uiValues.dweltime = parseInt(params.dweltime);
        $inputControls.find("#dwellTimeInputContainer").find(".comboDwellTime").data('unitsComboBox').setTextBoxValue(uiValues.dweltime);
      }
      if (params.velocityJerk) {
        uiValues.velocityJerk = parseInt(params.velocityJerk);
        $inputControls.find("#indexTypeInputContainer").find(".comboIndexType").data('unitsComboBox').setTextBoxValue(uiValues.velocityJerk);
      }
      calculateAndPaint();
    }

    return {
      ref: this,
      updateInputs: updateInputs
    };
  };

}(jQuery));
define("../../node_modules/libs-frontend-cosmatt/libs-frontend-motionprofile/dist/js/motionProfile.js", function(){});

/*
 * -------------
 * Engine Module
 * -------------
 * 
 * Item Type: cosmattmp Single Choice Quesion engine
 * Code: cosmattmp
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

define('cosmattmp',['text!../html/cosmattmp.html', //HTML layout(s) template (handlebars/rivets) representing the rendering UX
    'css!../css/cosmattmp.css',  //Custom styles of the engine (applied over bootstrap & front-end-core)
    'rivets',  // Rivets for data binding
    'sightglass',
    '../../bower_components/flot/jquery.flot.js',
    '../../bower_components/flot/jquery.flot.resize.js',
    '../../bower_components/flot-axislabels/jquery.flot.axislabels.js',
    'css!../../node_modules/libs-frontend-cosmatt/libs-frontend-unitcombobox/dist/css/unitComboBox.css',
    '../../node_modules/libs-frontend-cosmatt/libs-frontend-unitcombobox/dist/js/unitComboBox.min.js',
    'css!../../node_modules/libs-frontend-cosmatt/libs-frontend-motionprofile/dist/css/motionProfile.css',
    '../../node_modules/libs-frontend-cosmatt/libs-frontend-cosmattPlugin/src/js/libs-frontend-CosmattPlugin.js', //Required by Rivets
    '../../node_modules/libs-frontend-cosmatt/libs-frontend-motionprofile/dist/js/motionProfile.js'], //Required by Rivets
    function (cosmattmpTemplateRef) {

        cosmattmp = function () {

            "use strict";

            /*
             * Reference to platform's activity adaptor (initialized during init() ).
             */
            var activityAdaptor;

            /*
             * Internal Engine Config.
             */
            var __config = {
                MAX_RETRIES: 10, /* Maximum number of retries for sending results to platform for a particular activity. */
                RESIZE_MODE: "auto", /* Possible values - "manual"/"auto". Default value is "auto". */
                RESIZE_HEIGHT: "580" /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
                /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
            };

            /*
             * Internal Engine State.
             */
            var __state = {
                currentTries: 0, /* Current try of sending results to platform */
                activityPariallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
                activitySubmitted: false, /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
                radioButtonClicked: false /* State whether radio button is clicked.  Possible Values: true/false(Boolean) */
            };

            /*
             * Content (loaded / initialized during init() ).
             */
            var __content = {
                instructionText: "",
                appData: {},
                questionText: "", /* Contains the question obtained from content JSON. */
                optionsJSON: {}, /* Contains all the options for a particular question obtained from content JSON. */
                answersJSON: {}, /* Contains the answer for a particular question obtained from content JSON. */
                userAnswersJSON: {}, /* Contains the user answer for a particular question. */
                activityType: null  /* Type of FIB activity. Possible Values :- FIBPassage.  */
            };

            /*
             * Constants.
             */
            var __constants = {
                /* CONSTANT for PLATFORM Save Status NO ERROR */
                STATUS_NOERROR: "NO_ERROR",
                /* CONSTANTS for activity status */
                ACTIVITY_NOT_ATTEMPTED: "not_attempted", /* Activity not yet Attempted. */
                ACTIVITY_IN_PROGRESS: "in_progress", /* In Progress Activity. */
                ACTIVITY_PARTIALLY_CORRECT: "partially_correct", /* Partially Correct Activity. */
                ACTIVITY_CORRECT: "correct", /* Correct Activity. */ 
                ACTIVITY_INCORRECT: "incorrect", /* Incorrect Activity. */  

                TEMPLATES: {
                    /* Regular cosmattmp Layout */
                    cosmattmp: cosmattmpTemplateRef
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

                console.log(__content);

                /* ------ VALIDATION BLOCK END -------- */
                var $questionContainer = $('<div class="row"></div>');
                var $questionArea = $('<div class="col-sm-12 text-primary"></div>');
                var $pluginArea = $('<div class="col-sm-12"></div>');

                $questionArea.html(__content.questionText);

                //add callback function to appData
                __content.appData.options.data.userResponseNotifier = userResponseHandler;
                __pluginInstance = $pluginArea.motionProfile(__content.appData.options.data);

                //$container.motionProfile(params.options.data);

                $questionContainer.append($questionArea);
                $questionContainer.append($pluginArea);

                $(elRoot).html($questionContainer);


                // Not Required for Cosmatt

                // __processedJsonContent = __parseAndUpdateJSONContent(jsonContent, params, htmlLayout);
                //Process JSON for easy iteration in template
                //__parseAndUpdateJSONForRivets();
                // __parseAndUpdateJSONForRivets(__processedJsonContent);

                // /* Apply the layout HTML to the dom */
                // $(elRoot).html(__constants.TEMPLATES[htmlLayout]);

                // /* Initialize RIVET. */
                // __initRivets();
                /* ---------------------- SETUP EVENTHANDLER STARTS----------------------------*/

                // $('input[id^=option]').change(__handleRadioButtonClick);

                $(document).bind('userAnswered', function (e, value) {
                    __saveResults(false);
                });

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
                        __content.userAnswersJSON[getInteractionId(property)] = { response: callbackValue[property] };
                    }
                }
                $(document).triggerHandler('userAnswered', callbackValue);
                console.log(callbackValue);
            }

            function getInteractionId(interactionField) {
                var interactions = __content.optionsJSON;
                var interactionId = '';
                for (interactionId in interactions) {
                    if (interactions[interactionId].type === interactionField) {
                        break;
                    }
                }
                return interactionId;
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

                $('input[id^=option]').attr("disabled", true);
            }

            /**
            * Function to show user grades.
            */
            function showGrades(savedAnswer, reviewAttempt) {
                /* Show last saved answers. */
                updateLastSavedResults(savedAnswer);
                /* Mark answers. */
                __markAnswers();
                $('input[id^=option]').attr("disabled", true);
            }

            /**
             * Function to display last result saved in LMS.
             */
            function updateLastSavedResults(lastResults) {
                
                var updatePluginVals = {};
                $.each(lastResults.interactions, function (num, value) {
                    __content.userAnswersJSON[value.id] = { response: value.answer };;
                    updatePluginVals[__content.optionsJSON[value.id].type] = value.answer;
                });
                __pluginInstance.updateInputs(updatePluginVals);

            }
            /* ---------------------- PUBLIC FUNCTIONS END ----------------------------*/


            /* ---------------------- PRIVATE FUNCTIONS -------------------------------*/

            /* ---------------------- JSON PROCESSING FUNCTIONS START ---------------------------------*/
            /**
            * Parse and Update JSON based on cosmattmp specific requirements.
            */
            function __parseAndUpdateJSONContent(jsonContent, params, htmlLayout) {

                jsonContent.content.displaySubmit = activityAdaptor.displaySubmit;

                __content.activityType = params.engineType;
                __content.layoutType = jsonContent.content.canvas.layout;

                /* Activity Instructions. */
                var tagName = jsonContent.content.instructions[0].tag;
                __content.instructionText = jsonContent.content.instructions[0][tagName];
                __content.appData = jsonContent["app-data"];
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
                var interactionReferenceString = "http://www.comprodls.com/m1.0/interaction/cosmattmp";
                /* Parse questiontext as HTML to get HTML tags. */
                var parsedQuestionArray = $.parseHTML(jsonContent.content.canvas.data.questiondata[0].text);
                var j = 0;
                $.each(parsedQuestionArray, function (i, el) {
                    if (this.href === interactionReferenceString) {
                        interactionId[j] = this.childNodes[0].nodeValue.trim();
                        __interactionIds.push(interactionId[j]);
                        interactionTag[j] = this.outerHTML.replace(/"/g, "'");
                        j++;
                    }
                });

                $.each(interactionId, function (i) {
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
             * Parse and Update Question Set type JSON based on  cosmattmp specific requirements.
             */
            function __parseAndUpdateQuestionSetTypeJSON(jsonContent) {

                /* Extract interaction id's and tags from question text. */
                var interactionId = "";
                var interactionTag = "";
                /* String present in href of interaction tag. */
                var interactionReferenceString = "http://www.comprodls.com/m1.0/interaction/cosmattmp";
                /* Parse questiontext as HTML to get HTML tags. */
                var parsedQuestionArray = $.parseHTML(jsonContent.content.canvas.data.questiondata[0].text);
                $.each(parsedQuestionArray, function (i, el) {
                    if (this.href === interactionReferenceString) {
                        interactionId = this.childNodes[0].nodeValue.trim();
                        __interactionIds.push(interactionId);
                        interactionTag = this.outerHTML;
                        interactionTag = interactionTag.replace(/"/g, "'");
                    }
                });
                /* Replace interaction tag with blank string. */
                jsonContent.content.canvas.data.questiondata[0].text = jsonContent.content.canvas.data.questiondata[0].text.replace(interactionTag, "");
                var questionText = "1.  " + jsonContent.content.canvas.data.questiondata[0].text;
                var correctAnswerNumber = jsonContent.responses[interactionId].correct;
                var interactionType = jsonContent.content.interactions[interactionId].type;
                var optionCount = jsonContent.content.interactions[interactionId][interactionType].length;

                /* Make optionsJSON and answerJSON from JSON. */
                for (var i = 0; i < optionCount; i++) {
                    var optionObject = jsonContent.content.interactions[interactionId][interactionType][i];
                    var option = optionObject[Object.keys(optionObject)].replace(/^\s+|\s+$/g, '');
                    __content.optionsJSON.push(__getHTMLEscapeValue(option));
                    optionObject[Object.keys(optionObject)] = option;
                    /* Update JSON after updating option. */
                    jsonContent.content.interactions[interactionId][interactionType][i] = optionObject;
                    if (Object.keys(optionObject) == correctAnswerNumber) {
                        __content.answersJSON[0] = optionObject[Object.keys(optionObject)];
                    }
                }
                __content.questionsJSON[0] = questionText + " ^^ " + __content.optionsJSON.toString() + " ^^ " + interactionId;
            }

            /**
             * Escaping HTML codes from String.
             */
            function __getHTMLEscapeValue(content) {
                var tempDiv = $("<div></div>");
                $(tempDiv).html(content);
                $("body").append(tempDiv);
                content = $(tempDiv).html();
                $(tempDiv).remove();
                return content;
            }

            /***
             * Function to modify question JSON for easy iteration in template
             * 
             * Original JSON Object
             * ---------------------
             * 
             * "cosmattmp": [
                  {
                    "choiceA": "She has the flu." 
                  },
                  {
                    "choiceB": "She has the measles."
                  }  
                ]
        
                Modified JSON Object
                ----------------------
        
                "cosmattmp": [
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
            function __parseAndUpdateJSONForRivets(jsonContent) {
                var processedArray = [];
                for (var i = 0; i < __interactionIds.length; i++) {
                    jsonContent.content.interactions[__interactionIds[i]].cosmattmp.forEach(function (obj, index) {
                        var processedObj = {};
                        processedObj.customAttribs = {};
                        Object.keys(obj).forEach(function (key) {
                            processedObj.customAttribs.key = key;
                            processedObj.customAttribs.value = obj[key];
                        });
                        processedArray.push(processedObj);
                    });
                    jsonContent.content.interactions[__interactionIds[i]].cosmattmp = processedArray;
                }
            }

            /*------------------------RIVET INITIALIZATION & BINDINGS -------------------------------*/
            function __initRivets() {
                /* Formatter to transform object into object having 'key' property with value key
                 * and 'value' with the value of the object
                 * Example:
                 * var obj = {'choiceA' : 'She has flu.'} to
                 * obj= { 'key' : 'choiceA', 'value' : 'She has flu.'}
                 * This is done to access the key and value of object in the template using rivets.
                 */
                rivets.formatters.propertyList = function (obj) {
                    return (function () {
                        var properties = [];
                        for (var key in obj) {
                            properties.push({ key: key, value: obj[key] })
                        }
                        return properties
                    })();
                }

                /* This formatter is used to append interaction property to the object
                 * and return text of the question for particular interaction
                 */
                rivets.formatters.appendInteraction = function (obj, interaction, cosmattmp) {
                    return obj[interaction].text;
                }

                /* This formatter is used to return the array of options for a particular
                 * interaction so that rivets can iterate over it.
                 */
                rivets.formatters.getArray = function (obj, interaction) {
                    return obj[interaction].cosmattmp;
                }

                var isMCQImageEngine = false;
                /* Find if layout is of type MCQ_IMG*/
                if (__content.layoutType == 'MCQ_IMG') {
                    isMCQImageEngine = true;
                }

                /*Bind the data to template using rivets*/
                rivets.bind($('#cosmattmp-engine'), {
                    content: __processedJsonContent.content,
                    isMCQImageEngine: isMCQImageEngine,
                    feedback: __processedJsonContent.feedback,
                    showFeedback: __feedback
                });
            }

            /*------------------------RIVETS END-------------------------------*/

            /* ---------------------- JQUERY BINDINGS ---------------------------------*/
            /**
            * Function to handle radio button click.
            */
            function __handleRadioButtonClick(event) {
                /*
                 * Soft save here
                 */
                var currentTarget = event.currentTarget;

                $("label.radio").parent().removeClass("highlight");
                $(currentTarget).parent().parent("li").addClass("highlight");

                var newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');

                /* Save new Answer in memory. */
                __content.userAnswersJSON[0] = newAnswer.replace(/^\s+|\s+$/g, '');

                __state.radioButtonClicked = true;

                var interactionId = __content.questionsJSON[0].split("^^")[2].trim();

                $(document).triggerHandler('userAnswered');
            }

            /**
             * Function called to send result JSON to adaptor (partial save OR submit).
             * Parameters:
             * 1. bSumbit (Boolean): true: for Submit, false: for Partial Save.
             */
            function __saveResults(bSubmit) {

                var uniqueId = activityAdaptor.getId();

                /*Getting answer in JSON format*/
                var answerJSON = __getAnswersJSON(false);

                if (bSubmit === true) {/*Hard Submit*/

                    /*Send Results to platform*/
                    activityAdaptor.submitResults(answerJSON, uniqueId, function (data, status) {
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
                    activityAdaptor.savePartialResults(answerJSON, uniqueId, function (data, status) {
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
                var radioNo = "";
                /* Looping through answers to show correct answer. */
                for (var i = 0; i < __content.optionsJSON.length; i++) {
                    radioNo = "" + i;
                    __markRadio(radioNo, __content.answersJSON[0], __content.optionsJSON[i]);
                }
                __generateFeedback();
            }
            /* Add correct or wrong answer classes*/
            function __markRadio(optionNo, correctAnswer, userAnswer) {
                if (userAnswer.trim() === correctAnswer.trim()) {
                    $($(".answer")[optionNo]).removeClass("wrong");
                    $($(".answer")[optionNo]).addClass("correct");
                    $($(".answer")[optionNo]).parent().addClass("state-success");
                } else {
                    $($(".answer")[optionNo]).removeClass("correct");
                    $($(".answer")[optionNo]).addClass("wrong");
                    $($(".answer")[optionNo]).parent().addClass("state-error");
                }
                $(".answer" + optionNo).removeClass("invisible");
            }

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
                var correct = true;        

                if (skipQuestion) {
                    answers = "Not Answered";
                } else {
                    answers = __content.userAnswersJSON;
                    // var interactionScore = 0;
                    // var interactionMaxScore = __content.maxscore/__content.answersXML.length;
                    /* Calculating scores.*/
                    for (var answerID in answers) {
                        var interaction = {};
                        interaction.id = answerID;
                        interaction.answer = answers[answerID].response.toString();
                        interaction.maxscore = __processedJsonContent.meta.score.max;
                        // if (answers[answerID].response == __content.answersJSON[answerID].correct) {
                        //     interaction.score = 1;
                        // } else {
                        //     interaction.score = 0;
                        // }
                        interaction.score = 0;
                        interactionArray.push(interaction);
                    }
                }

                // interactions = {
                //     id: interactionId,
                //     answer: answer,
                //     score: score,
                //     maxscore: __processedJsonContent.meta.score.max
                // };
                // interactionArray[0] = interactions;

                var response = {
                    "interactions": interactionArray
                };

                if(!skipQuestion) {
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
                "init": init, /* Shell requests the engine intialized and render itself. */
                "getStatus": getStatus, /* Shell requests a gradebook status from engine, based on its current state. */
                "getConfig": getConfig, /* Shell requests a engines config settings.  */
                "handleSubmit": handleSubmit,
                "showGrades": showGrades,
                "updateLastSavedResults": updateLastSavedResults
            };
        };
    });

(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('/*******************************************************\n * \n * ----------------------\n * Engine Renderer Styles\n * ----------------------\n *\n * These styles do not include any product-specific branding\n * and/or layout / design. They represent minimal structural\n * CSS which is necessary for a default rendering of an\n * MCQSC activity\n *\n * The styles are linked/depending on the presence of\n * certain elements (classes / ids / tags) in the DOM (as would\n * be injected via a valid MCQSC layout HTML and/or dynamically\n * created by the MCQSC engine JS)\n *\n *\n *******************************************************/\n\n.cosmattmp-body .form *{\n    margin: 0;\n    padding: 0;\n}\n\n.cosmattmp-body .form .cosmattmp-img{\n    padding-top: 10px;\n}\n\n.cosmattmp-body .form ul li{\n    padding: .7em .4em .7em 1.8em;\n    position: relative;\n}\n\n.cosmattmp-body .form ul li.highlight{\n    background-color: #F2F2F2;\n    border-radius: 6px;\n}\n\n.cosmattmp-body .form ul li i{\n    height: 1.8em;\n    width: 1.8em;\n    border-radius: 50%;\n    position: absolute;\n    top: 0;\n    left: 0;\n    display: block;\n    outline: 0;\n    border: 1px solid #BDBDBD;\n    background: #FFF;\n}\n\n.cosmattmp-body .form ul li i:after {\n    background-color: #3276B1;\n    content: \'\';\n    border-radius: 50%;\n    height: 1.1em;\n    width: 1.1em;\n    top: .3em;\n    left: .3em;\n    position: absolute;\n    opacity: 0;\n}\n\n.cosmattmp-body .form ul li.highlight i{\n    border-color: #3276B1;\n}\n\n.cosmattmp-body .form ul li.highlight i:after{\n    opacity: 1;\n}\n\n.cosmattmp-body .form ul li .radio{\n    line-height: 1.8em;\n    font-weight: normal;\n    cursor: pointer;\n    padding-left: 25px;\n}\n\n\n.cosmattmp-body .form ul li .radio input {\n    position: absolute;\n    left: -9999px;\n}\n\n.cosmattmp-body .form ul li .radio.state-error i{\n    background: #fff0f0;\n    border-color: #a90329;\n}\n\n.cosmattmp-body .form ul li .radio.state-error i:after {\n    background-color: #a90329;\n}\n\n.cosmattmp-body .form ul li .radio.state-success i{\n    background: #f0fff0;\n    border-color: #7DC27D;\n}\n\n.cosmattmp-body .form ul li .radio.state-success i:after {\n    background-color: #7DC27D;\n}\n\n.cosmattmp-body span.correct:before {\n    content: \"\\f00c\";\n    font-family: fontawesome;\n    display: inline-block;\n    margin: 0 3.5em auto -3.2em;\n}\n\n.cosmattmp-body span.wrong:before {\n    content: \"\\f00d\";\n    font-family: fontawesome;\n    display: inline-block;\n    margin: 0 3.6em auto -3.2em;\n}\n\n.cosmattmp-body .answer{\n    margin-left: 20px;\n}\n\n.cosmattmp-body span.correct, .cosmattmp-body span.wrong{\n    margin-left: 0;\n}\n\n.cosmattmp-body .col-md-6.last-child {\n    min-height: 200px;\n    border-left: 1px solid #C2C2C2;\n    padding-left: 20px;\n}\n\n.cosmattmp-body .stimulus {\n    margin: 25px 0 25px 0;\n}\n#feedback-area {\n    margin-top: 18px;   \n    border: 1px solid #ddd;\n    border-radius: 4px;\n    padding: 20px;\n    margin: 10px 0px 10px 0px;\n    background-color: #eee;\n    color: #3D3D3D;\n}\n#feedback-area > h4 {\n    padding-bottom: 10px;\n    font-weight: 700;\n}\n/* CORRECT ANSWER icon/mark */\n.cosmattmp-body #feedback-area span.correct:before {\n    content: \"\\f00c\";\n    font-family: fontawesome;\n    display: inline-block;\n    margin-right: 10px;\n    color: #009900;\n    float: left;\n    font-size: 18px;\n    border: 2px solid #009900;\n    padding: 3px 5px 3px 5px;\n    border-radius: 16px;\n    margin: 10px;\n}\n.cosmattmp-body #feedback-area span.wrong:before {\n    content: \"\\f00d\";\n    font-family: fontawesome;\n    display: inline-block;\n    margin-right: 10px;\n    color: red;\n    float: left;\n    font-size: 18px;\n    border: 2px solid red;\n    padding: 2px 6px 2px 6px;\n    border-radius: 16px;\n    margin: 10px;\n}.cosmatt-unitComboBox {\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n.cosmatt-unitComboBox .form-control {\r\n  display: block;\r\n  height: 34px;\r\n  padding: 6px 12px;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #555;\r\n  background-color: #fff;\r\n  background-image: none;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n  -webkit-border-radius: 4px;\r\n}\r\n.cosmatt-unitComboBox .unitTextBox {\r\n  display: inline;\r\n  max-width: 100px;\r\n}\r\n.cosmatt-unitComboBox .unitComboBox {\r\n  display: inline;\r\n  max-width: 100px;\r\n  padding: 0 6px;\r\n  margin-left: 10px;\r\n}\r\n.cosmatt-unitComboBox .form-control[disabled],\r\n.cosmatt-unitComboBox .form-control[readonly] {\r\n  background-color: #eee;\r\n  opacity: 1;\r\n}\r\n.cosmatt-motionProfile {\n  position: relative;\n}\n.cosmatt-motionProfile.unselectable {\n  -moz-user-select: -moz-none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n.cosmatt-motionProfile.assessment-mode {\n  box-shadow: 0 0 0 #ddd !important;\n  border: none !important;\n}\n.cosmatt-motionProfile #inputControls {\n  margin-top: 10px;\n}\n.cosmatt-motionProfile #profileButtons {\n  margin: 10px 0;\n}\n.cosmatt-motionProfile .profileButton {\n  margin-right: 10px;\n}\n.cosmatt-motionProfile #graphContainer .graphArea {\n  height: 400px;\n  min-width: 10px;\n  display: inline-block;\n}\n.cosmatt-motionProfile #graphContainer .graphArea .legend table {\n  pointer-events: none;\n  margin: 0px !important;\n  width: initial;\n}\n.cosmatt-motionProfile #graphContainer .graphArea .legend table tr {\n  background-color: transparent !important;\n  border-width: 0px !important;\n}\n.cosmatt-motionProfile #graphContainer .graphArea .legend table tr td {\n  border-width: 0px !important;\n  padding: 0px !important;\n  vertical-align: middle;\n}\n.cosmatt-motionProfile .smoothnessDropDown .smoothnessDDMenu {\n  max-width: 211px;\n}\n.cosmatt-motionProfile #tooltip {\n  padding: 4px 10px !important;\n  background-color: rgba(0, 0, 0, 0.8) !important;\n  border: solid 1px #000 !important;\n  z-index: 100 !important;\n  font-size: 12px !important;\n  color: #fff !important;\n  -webkit-border-radius: 3px !important;\n  -moz-border-radius: 3px !important;\n  border-radius: 3px !important;\n  position: absolute;\n  display: none;\n}\n');

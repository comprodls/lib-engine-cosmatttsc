/*!
 * jquery.spinner v0.2.1 (https://vsn4ik.github.io/jquery.spinner/)
 * Copyright 2013-2017 xixilive
 * Licensed under the MIT license
 */
'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
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

      this.value(this.oldValue + Number(step) * multipler);
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
     
      this.$el.val(v.toFixed(this.options.precision));
/***************If condition commneted to fix the issue COSMATT-666**************/
      //if (this.oldValue !== this.value()) {
        // changing.spinner
        this.$el.trigger('changing.spinner', [this.value(), this.oldValue]);

        // lazy changed.spinner
        clearTimeout(spinningTimer);
        spinningTimer = setTimeout($.proxy(function() {
          this.$el.trigger('changed.spinner', [this.value(), this.oldValue]);
        }, this), Spinner.delay);
      //}
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

'use strict';

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
            uniqeId:'1',
            firstTimeCall:'0'
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
          
         // $containerEle.append($('<div class="col-md-1"></div>'));
            var $servoMotorTSCurve = $('<div id="servoMotorTSCurve"></div>');
            $containerEle.append($servoMotorTSCurve);

            
            if(settings.showMotorSelForm || settings.showAppPointsForm || settings.showEnviorForm || settings.showTransmissionForm){
              $servoMotorTSCurve.addClass('col-xs-6 col-6');

              // $containerEle.append($('<div class="col-md-1"></div>'));
              var $servoMotorArea = $('<div class="col-xs-6 col-6" id="servoMotorArea"></div>');
              $containerEle.append($servoMotorArea);
              generateServoMotorArea($servoMotorArea);
            }
            else{
              $servoMotorTSCurve.addClass('col-xs-12 col-12');
              $container.find('.tsCruveContainer').addClass('widthMaxLimit')
            }
                        
            generateTSCurvePlotArea($servoMotorTSCurve);           

            //generateServoMotorSpec();
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

            var $motorPanelHeading = $('<div class="panel-heading panelHeadingNew" role="tab" id="headingOne"> <div id="PaginationDiv" class="Pagination"></div><span class="accordion-plus-minus  pull-right" aria-hidden="true" style="color: grey;"></span> </div>');
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

            /***********************************************/


            var $motorPanelBody = $motorPanel.find('#collapseOne .panel-body');
            var $motorDataContainer = $('<div id="motorDataContainer" class="row"></div>');
            $motorPanelBody.append($motorDataContainer);

           /* var $solutionTitle = $('<div class="col-sm-12 title"><span id="solutionTitle">Solution Size: </sapn></div>');
            $motorDataContainer.append($solutionTitle);*/

            /*var $solutionSlider = $('<div class="col-sm-9"><input width="300" id="solutionSliderId" class="span2" type="text" data-slider-id="sizeSlider" data-slider-ticks="['+sizeSliderTicks+']" data-slider-min="0" data-slider-max="'+motorSliderLen+'" data-slider-step="1" data-slider-value="'+settings.motorSelectedIndex +'" data-slider-tooltip="hide"  /></div>');
            $motorDataContainer.append($solutionSlider);*/


          

            /*var $solutionValue = $('<div class="col-md-3"><label class="value" id="solutionValue">10 N-m </label></div>');
            $motorDataContainer.append($solutionValue);*/

            /*var $solutionDivider = $('<div class="col-sm-11 solutionDivider"></div>');
            $motorDataContainer.append($solutionDivider);*/

            var $solutionInfoTitle = $('<div class="col-xs-12 col-12 solutionInfoTitle" id="solutionTitle">Solution Summary</div>');
            $motorDataContainer.append($solutionInfoTitle);

            var $solutionInfoRowOne = $('<div class="col-xs-12 col-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowOne);

            var $driveInfo = $('<div class="col-xs-6 col-6"><span class="driveTitle">Drive:</span><span class="driveName" id="driveNameId">'+settings.motorData[settings.motorSelectedIndex].drivePartNo+'</span></div>');
            $solutionInfoRowOne.append($driveInfo);

            var $motorInfo = $('<div class="col-xs-6 col-6"><span class="motorTitle">Motor:</span><span class="motorName" id="motorNameId">'+settings.motorData[settings.motorSelectedIndex].motorPartNo+'</span></div>');
            $solutionInfoRowOne.append($motorInfo);

            var $solutionInfoRowTwo = $('<div class="col-xs-12 col-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowTwo);

            var $voltageInfo = $('<div class="col-xs-6 col-6"><span class="voltageTitle">Voltage:</span><span class="voltageName" id="voltageInfoId">'+settings.motorData[settings.motorSelectedIndex].voltage+' V</span></div>');
            $solutionInfoRowTwo.append($voltageInfo);

            var $solutionStatus = $('<div class="col-xs-6 col-6"><span class="solutionStatusTitle">Solution Status:</span><span class="solutionStatus motorPass" id="statusValueContainer">Pass</span></div>');
            $solutionInfoRowTwo.append($solutionStatus);

            $motorPanelHeading.find('#PaginationDiv').Folio({
                totalPages: settings.motorData.length,
                maxPages:9,
                activePage:settings.motorSelectedIndex,
                previousClass: 'fa fa-chevron-left',
                nextClass: 'fa fa-chevron-right',              
                onUpdate: function (index) {
                    settings.firstTimeCall = index;
                    updateMessage(index);
                   
                }
            })

            function updateMessage(motorIndex){

                var motorIndex = (motorIndex -1);

                console.log(settings.motorData[motorIndex].drivePartNo);
                $motorDataContainer.find('#driveNameId').text(settings.motorData[motorIndex].drivePartNo);
                $motorDataContainer.find('#motorNameId').text(settings.motorData[motorIndex].motorPartNo);
                $motorDataContainer.find('#voltageInfoId').text(settings.motorData[motorIndex].voltage + ' V');
                $motorDataContainer.find('#solutionTitle').text('Selected Soultion: # '+ (motorIndex + 1));


                settings.motorSelectedIndex = motorIndex;

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
                settings.motorSelectedIndex = motorIndex;                
                calculateTSCurevePoints();
                updateMotorStatus();
            }
            
            //generateMotorDataPanelBody($motorPanel);
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

            var $solutionTitle = $('<div class="col-xs-3 col-3 title"><span id="solutionTitle">Solution Size: </sapn></div>');
            $motorDataContainer.append($solutionTitle);

            /*var $solutionSlider = $('<div class="col-sm-9"><input width="300" id="solutionSliderId" class="span2" type="text" data-slider-id="sizeSlider" data-slider-ticks="['+sizeSliderTicks+']" data-slider-min="0" data-slider-max="'+motorSliderLen+'" data-slider-step="1" data-slider-value="'+settings.motorSelectedIndex +'" data-slider-tooltip="hide"  /></div>');
            $motorDataContainer.append($solutionSlider);*/


            var $solutionSlider = $('<div class="col-xs-9 col-9"></div>');
            $motorDataContainer.append($solutionSlider);

            /*var $solutionValue = $('<div class="col-md-3"><label class="value" id="solutionValue">10 N-m </label></div>');
            $motorDataContainer.append($solutionValue);*/

            var $solutionDivider = $('<div class="col-xs-11 col-11 solutionDivider"></div>');
            $motorDataContainer.append($solutionDivider);

            var $solutionInfoTitle = $('<div class="col-xs-12 col-12solutionInfoTitle">Selected Solution</div>');
            $motorDataContainer.append($solutionInfoTitle);

            var $solutionInfoRowOne = $('<div class="col-xs-12 col-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowOne);

            var $driveInfo = $('<div class="col-xs-6 col-6"><span class="driveTitle">Drive:</span><span class="driveName" id="driveNameId">'+settings.motorData[settings.motorSelectedIndex].drivePartNo+'</span></div>');
            $solutionInfoRowOne.append($driveInfo);

            var $motorInfo = $('<div class="col-xs-6 col-6"><span class="motorTitle">Motor:</span><span class="motorName" id="motorNameId">'+settings.motorData[settings.motorSelectedIndex].motorPartNo+'</span></div>');
            $solutionInfoRowOne.append($motorInfo);

            var $solutionInfoRowTwo = $('<div class="col-xs-12 col-12 solutionInfoContainer row"></div>');
            $motorDataContainer.append($solutionInfoRowTwo);

            var $voltageInfo = $('<div class="col-xs-6 col-6"><span class="voltageTitle">Voltage:</span><span class="voltageName" id="voltageInfoId">'+settings.motorData[settings.motorSelectedIndex].voltage+' V</span></div>');
            $solutionInfoRowTwo.append($voltageInfo);

            var $solutionStatus = $('<div class="col-xs-6 col-6"><span class="solutionStatusTitle">Solution Status:</span><span class="solutionStatus motorPass" id="statusValueContainer">Pass</span></div>');
            $solutionInfoRowTwo.append($solutionStatus);

           /* var solutionSlider = $solutionSlider.find('#solutionSliderId').slider({}).on("change", function(slideEvt) {
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
            });*/

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
                    else{
                      $container.find('#peakSpeedValue').attr('data-max', settings.sliderLimit.peakMaxSpeed); 
                    }
                   

                    if (tsPlotSeries[3].data[0][0] > settings.sliderLimit.rmsMaxSpeed) {
                        $container.find('#rmsSpeedValue').attr('data-max', parseInt(tsPlotSeries[3].data[0][0]));
                    }
                    else{
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

            var $peakTorqueTitle = $('<div class="col-xs-3 col-3 title"><span id="peakTorqueTitle">Peak Torque: </span></div>');
            $peakTorqueSliderContainer.append($peakTorqueTitle);

            var $peakTorqueSlider = $('<div class="col-xs-4 col-4 slider-right-padding"><input id="peakTorqueSlider" data-slider-value="' + settings.peakPoints[1] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $peakTorqueSliderContainer.append($peakTorqueSlider);

           
          
           var $peakTorqueInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="peakTorqueSpinner"><input id="peakTorqueValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.peakMaxTorque+'" data-min="0" data-step="0.1"  value="' + settings.peakPoints[1] + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;Nm</div>')
            $peakTorqueSliderContainer.append($peakTorqueInput);
            




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
            });
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
            if(settings.disableControls && settings.disableControls.peakTorqueTextBox){
                $container.find('#peakTorqueValue').attr("disabled",true);
            }

            var $peakSpeedSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($peakSpeedSliderContainer);

            var $peakSpeedTitle = $('<div class="col-xs-3 col-3 title"><span id="peakSpeedTitle">Peak Speed: </sapn></div>');
            $peakSpeedSliderContainer.append($peakSpeedTitle);

            var $peakSpeedSlider = $('<div class="col-xs-4 col-4 slider-right-padding"><input id="peakSpeedSlider" data-slider-value="' + settings.peakPoints[0] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $peakSpeedSliderContainer.append($peakSpeedSlider);

            var $peakSpeedInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="peakSpeedSpinner"><input id="peakSpeedValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.peakMaxSpeed+'" data-min="0" data-step="1"  value="' + settings.peakPoints[0] + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;rad/sec</div>')
            $peakSpeedSliderContainer.append($peakSpeedInput);

           

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

            });
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

            if(settings.disableControls && settings.disableControls.peakSpeedTextBox){
                $container.find('#peakSpeedValue').attr("disabled",true);
            }

            var $rmsTorqueSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($rmsTorqueSliderContainer);

            var $rmsTorqueTitle = $('<div class="col-xs-3 col-3 title"><span id="rmsTorqueTitle">RMS Torque: </sapn></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueTitle);



            var $rmsTorqueSlider = $('<div class="col-xs-4 col-4 slider-right-padding"><input id="rmsTorqueSlider" data-slider-value="' + settings.rmsPoints[1] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueSlider);

            var $rmsTorqueInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="rmsTorqueSpinner"><input id="rmsTorqueValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.rmsMaxTorque+'" data-min="0" data-step="0.1"  value="' + settings.rmsPoints[1] + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;Nm</div>');
            $rmsTorqueSliderContainer.append($rmsTorqueInput);
            /*var $rmsTorqueInput = $('<div class="col-sm-5 slider-right-padding"><input type="number" id="rmsTorqueValue" step=".1" name="quantity" min="0" max="'+settings.sliderLimit.rmsMaxTorque+'" value="' + settings.rmsPoints[1] + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&nbsp;Nm</label></div>');
            $rmsTorqueSliderContainer.append($rmsTorqueInput);*/

           
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
            });

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

            if(settings.disableControls && settings.disableControls.rmsTorqueTextBox){
                $container.find('#rmsTorqueValue').attr("disabled",true);
            }

            var $rmsSpeedSliderContainer = $('<div id="sliderContainer" class="row"></div>');
            $tsPointsPanelContainer.append($rmsSpeedSliderContainer);

            var $rmsSpeedTitle = $('<div class="col-xs-3 col-3 title"><span id="rmsSpeedTitle">RMS Speed: </span></div>');
            $rmsSpeedSliderContainer.append($rmsSpeedTitle);

            var $rmsSpeedSlider = $('<div class="col-xs-4 col-4 slider-right-padding"><input id="rmsSpeedSlider" data-slider-value="' + settings.rmsPoints[0] + '" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $rmsSpeedSliderContainer.append($rmsSpeedSlider);

            var $rmsSpeedInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="rmsSpeedSpinner"><input id="rmsSpeedValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.rmsMaxSpeed+'" data-min="0" data-step="1"  value="' + settings.rmsPoints[0] + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;rad/sec</div>');
            $rmsSpeedSliderContainer.append($rmsSpeedInput);

           /* var $rmsSpeedInput = $('<div class="col-sm-5 slider-right-padding"><input type="number" id="rmsSpeedValue" name="quantity" min="0" max="'+settings.sliderLimit.rmsMaxSpeed+'" value="' + settings.rmsPoints[0] + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&nbsp;rad/sec</label></div>');
            $rmsSpeedSliderContainer.append($rmsSpeedInput);*/

           
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
            });
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
            if(settings.disableControls && settings.disableControls.rmsSpeedTextBox){
                $container.find('#rmsSpeedValue').attr("disabled",true);
            }

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

            var $tempTitle = $('<div class="col-xs-3 col-3 title"><span id="tempTitle">Temperature: </span></div>');
            $tempSliderContainer.append($tempTitle);

            var $tempSlider = $('<div class="col-xs-4 col-4 slider-right-padding"><input id="tempSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $tempSliderContainer.append($tempSlider);

            /*var $tempInput = $('<div class="col-sm-5 slider-right-padding"><input type="number" id="tempValue" name="quantity" min="0" value="' + settings.motorData[settings.motorSelectedIndex].temp + '" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;&deg;C</label></div>');
            $tempSliderContainer.append($tempInput);*/
            var sliderMax = settings.sliderLimit.maxTemp || defaults.sliderLimit.maxTemp;

            var $tempInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="tempValueSpinner"><input id="tempValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+sliderMax+'" data-min="0" data-step="1"  value="' + settings.motorData[settings.motorSelectedIndex].temp + '" data-rule="percent"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;&#176;C</div>');
            $tempSliderContainer.append($tempInput);

            //var $tempValue = $('<div class="col-sm-3"><label class="value" id="tempValue">' + settings.motorData[settings.motorSelectedIndex].temp + '</label><label class="value">&deg;C</label></div>');
            //$tempSliderContainer.append($tempValue);

            

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

            if(settings.disableControls && settings.disableControls.tempSlider){
                $tempSliderContainer.find('#tempSlider').slider("disable");
            }

            /*$container.find('#tempValue').on('change',function(e){
                    $container.find('#tempSlider').slider('setValue', parseInt(e.target.value));
                    updatePlotDataOnTempChange("peakPlot", parseInt(e.target.value));
                    updatePlotDataOnTempChange("rmsPlot", parseInt(e.target.value));

                  
            });*/
            $container.find('#tempValueSpinner').spinner('changed',function(e, newVal, oldVal){
       
                $container.find('#tempSlider').slider('setValue', parseInt(newVal));
                updatePlotDataOnTempChange("peakPlot", parseInt(newVal));
                updatePlotDataOnTempChange("rmsPlot", parseInt(newVal));
                
            });

            if(settings.disableControls && settings.disableControls.tempTextBox){
                $container.find('#tempValue').attr("disabled",true);
            }

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

            var $altitudeTitle = $('<div class="col-xs-3 col-3 title"><span id="altitudeTitle">Altitude: </span></div>');
            $altitudeSliderContainer.append($altitudeTitle);

            var $altitudeSlider = $('<div class="col-xs-4 col-4 slider-right-padding"><input id="altitudeSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $altitudeSliderContainer.append($altitudeSlider);

            /*var $altitudeInput = $('<div class="col-sm-5 slider-right-padding"><input type="number" id="altitudeValue" name="quantity" min="0" value="' + settings.motorData[settings.motorSelectedIndex].altitude + '" class="widgetNumberInput form-control bfh-number"><label class="value">&nbsp;&nbsp;m</label></div>');
            $altitudeSliderContainer.append($altitudeInput);*/
            var sliderMax = settings.sliderLimit.maxAltitude || defaults.sliderLimit.maxAltitude;

            var $altitudeInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="altitudeSpinner"><input id="altitudeValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+sliderMax+'" data-min="0" data-step="1"  value="' + settings.motorData[settings.motorSelectedIndex].altitude + '" data-rule="currency"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;&nbsp;m</div>');
            $altitudeSliderContainer.append($altitudeInput);

            //var $altitudeValue = $('<div class="col-sm-3"><label class="value" id="altitudeValue">' + settings.motorData[settings.motorSelectedIndex].altitude + '</label><label class="value">  m</label></div>');
            //$altitudeSliderContainer.append($altitudeValue);

            


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

            if(settings.disableControls && settings.disableControls.altitudeSlider){
                $altitudeSlider.find('#altitudeSlider').slider("disable");
            }
            $container.find('#altitudeSpinner').spinner('changed',function(e, newVal, oldVal){
       
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



            if(settings.disableControls && settings.disableControls.transmRatioTextBox){
                $container.find('#altitudeValue').attr("disabled",true);
            }


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

            var $trRatioTitle = $('<div class="col-xs-3 col-3 title"><span id="trRatioTitle">Transmission Ratio: </span></div>');
            $trRatioSliderContainer.append($trRatioTitle);

            var $trRatioSlider = $('<div class="col-xs-4 col-4 slider-right-padding" ><input id="trRatioSlider" data-slider-id="sizeSlider" type="text" data-slider-tooltip="hide"/></div>');
            $trRatioSliderContainer.append($trRatioSlider);

            var $trRatioInput = $('<div class="col-xs-5 col-5 slider-right-padding display-flex margin-bottom"> <div class="input-group spinner" data-trigger="spinner" id="trRatioSpinner"><input id="trRatioValue" type="text" class="form-control text-center widget-textbox-height" data-max="'+settings.sliderLimit.maxTrRatio+'" data-min="1" data-step="1"  value="' + settings.transmissionRaioVal + '" data-rule="quantity"><div class="input-group-addon"><a href="javascript:;" class="spin-up" data-spin="up"><i class="fa fa-caret-up"></i></a><a href="javascript:;" class="spin-down" data-spin="down"><i class="fa fa-caret-down"></i></a></div></div><label class="value"></label>&nbsp;: 1</div>');
            $trRatioSliderContainer.append($trRatioInput);

            /*var $trRatioInput = $('<div class="col-sm-5 slider-right-padding"><input type="number" id="trRatioValue" name="quantity" min="1" max="'+settings.sliderLimit.maxTrRatio+'" value="1" class="widgetNumberInput form-control bfh-number"><lable class="value">&nbsp;: 1</label></div>');
            $trRatioSliderContainer.append($trRatioInput);*/

            
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

            if(settings.disableControls && settings.disableControls.transmRatioSlider){
                $trRatioSlider.find('#trRatioSlider').slider("disable");
            }

            $container.find('#trRatioSpinner').spinner('changed',function(e, newVal, oldVal){
        
                applicationRequPointsOntextChan("TransmissionRatio",newVal);
               
            });

           /* $container.find('#trRatioValue').on('change',function(e){

                   applicationRequPointsOntextChan("TransmissionRatio",e.target.value);
            });*/

            if(settings.disableControls && settings.disableControls.transmRatioTextBox){
                $container.find('#trRatioValue').attr("disabled",true);
            }

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

            /*var $curveConfigContainer = $('<div class="curveConfigContainer row"></div>');
            $containerEle.append($curveConfigContainer);

            if (settings.showQuadrantToggle) {
                generatePlotModeToggleSwitch($curveConfigContainer);
            }*/

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
                
                peakTorqueGraphData.push([0, (motorPoints.peakStallTorque)]);

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
               if(settings.firstTimeCall == '0'){
                    var motorNewPoints = addTempEffectOnMotorData(motorPoints);
                    interpolatePositiveVelocityDataPoints(motorNewPoints);
                    interpolateNegativeVelocityDataPoints(motorNewPoints);

                    updateFourQuadrantData(motorNewPoints);
               }else{
                     
                    interpolatePositiveVelocityDataPoints(motorPoints);
                    interpolateNegativeVelocityDataPoints(motorPoints);

                    updateFourQuadrantData(motorPoints);
               } 
                

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
            var tsPlotAxes = tsPlot.getAxes();

            if (settings.showMotorTsCurve) {
                var maxY = Math.max(settings.peakPoints[1] + 1, settings.rmsPoints[1] + 1, 35);

                if (tsPlotAxes.yaxis.datamax < maxY) {
                      tsPlot.getOptions().yaxes[0].max = maxY;
                }else {
                    
                     tsPlot.getOptions().yaxes[0].max = (tsPlotAxes.yaxis.datamax + 30);
                }

             }   
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
                attachResizeToPlots();
            }, 0);


        };

        var attachResizeToPlots = function() {

            $container.find('.tsCruveContainer').resize(function(e) {
                 var ele = $(this);

                 if(ele.width() < 777){
                    ele.find('#servoMotorArea').addClass('resizeWidth');
                    ele.find('#servoMotorTSCurve').addClass('resizeWidth');                 
                    ele.find('.tsPlotArea').css('min-height',ele.find('.tsPlotArea').width());
                 }
                 else if(ele.width() > 777){
                    ele.find('#servoMotorArea').removeClass('resizeWidth');
                    ele.find('#servoMotorTSCurve').removeClass('resizeWidth');                   
                   ele.find('.tsPlotArea').css('min-height',ele.find('.tsPlotArea').width());
                   console.log("Resized greater 777",ele.find('.tsPlotArea').width());

                 }

                

            }) ;  

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
                    "motorSelectedIndex": {
                        "value": settings.motorSelectedIndex,
                        "unit": ""
                    }
                });
            }
        }


        var updateInputs = function (params) {

            if (params.peakTorque) {
                $container.find('#peakTorqueSlider').slider('setValue', params.peakTorque.value);
                $container.find("#peakTorqueValue").val(params.peakTorque.value);
                updateApplicationRequPoints("PeakTorque");
            }
            if (params.peakSpeed) {
                $container.find('#peakSpeedSlider').slider('setValue', params.peakSpeed.value);
                $container.find("#peakSpeedValue").val(params.peakSpeed.value);
                updateApplicationRequPoints("PeakSpeed");
            }
            if (params.rmsTorque) {
               $container.find('#rmsTorqueSlider').slider('setValue', params.rmsTorque.value);
               $container.find("#rmsTorqueValue").val(params.rmsTorque.value);
               updateApplicationRequPoints("RmsTorque");
            }
            if (params.rmsSpeed) {
                $container.find('#rmsSpeedSlider').slider('setValue', params.rmsSpeed.value);
                $container.find("#rmsSpeedValue").val(params.rmsSpeed.value);
                updateApplicationRequPoints("RmsSpeed");
            }
            if (params.temperature) {
                $container.find('#tempSlider').slider('setValue', params.temperature.value);
                $container.find("#tempValue").val(params.temperature.value);
                updateApplicationRequPoints("Temperature");
            }
            if (params.altitude) {
                $container.find('#altitudeSlider').slider('setValue', params.altitude.value);
                $container.find("#altitudeValue").val(params.altitude.value);
                updateApplicationRequPoints("Altitude");
            }
            if (params.transmissionRatio) {
                $container.find('#trRatioSlider').slider('setValue', params.transmissionRatio.value);
                $container.find("#trRatioValue").val(params.transmissionRatio.value);
                updateApplicationRequPoints("TransmissionRatio");
            }
            if (params.motorSelectedIndex) {
                $container.find('#solutionSliderId').slider('setValue', parseInt(params.motorSelectedIndex.value));
            }
        }

        var markAnswers = function (params) {
            var cssClass;
            if (params.peakTorque) {
                cssClass = params.peakTorque.status ? 'correct' : 'incorrect';
                $container.find('#peakTorqueValue').addClass(cssClass)
                // disable slider and input
            }
            if (params.peakSpeed) {
                cssClass = params.peakSpeed.status ? 'correct' : 'incorrect';
                $container.find('#peakSpeedValue').addClass(cssClass)
                // disable slider and input
            }
            if (params.rmsTorque) {
                cssClass = params.rmsTorque.status ? 'correct' : 'incorrect';
                $container.find('#rmsTorqueValue').addClass(cssClass)
                // disable slider and input
            }
            if (params.rmsSpeed) {
                cssClass = params.rmsSpeed.status ? 'correct' : 'incorrect';
                $container.find('#rmsSpeedValue').addClass(cssClass)
                // disable slider and input
            }
            if (params.temperature) {
                cssClass = params.temperature.status ? 'correct' : 'incorrect';
                $container.find('#tempValue').addClass(cssClass)
                // disable slider and input
            }
            if (params.altitude) {
                cssClass = params.altitude.status ? 'correct' : 'incorrect';
                $container.find('#altitudeValue').addClass(cssClass)
                // disable slider and input
            }
            if (params.transmissionRatio) {
                cssClass = params.transmissionRatio.status ? 'correct' : 'incorrect';
                $container.find('#trRatioValue').addClass(cssClass)
                // disable slider and input
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
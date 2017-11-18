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
          value = numberFormatter.format(value);
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
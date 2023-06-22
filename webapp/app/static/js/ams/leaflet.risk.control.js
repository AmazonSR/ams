/* global L */

// A filter control for changing the risk threshold value that provides stepping backwards and forwards between threshold values.
// Author: Andre Carvalho
// Based on HTML of slider from Pedro
L.Control.RiskThresholdHandler = L.Control.extend({

  options: {
    position: 'bottomcenter',
    autoZIndex: true,
    range: []
  },
  _container: null,
  _base_classname: 'leaflet-slider-control',

  initialize: function (options) {
    L.Util.setOptions(this, options);
  },

  _initLayout: function (map) {
    let container = L.DomUtil.create('div', this._base_classname);

    let form = L.DomUtil.create('div', this._base_classname + '-form');

    let label = L.DomUtil.create('div', this._base_classname + '-label');
    label.innerHTML = 'Risco Ibama';
    form.appendChild(label);

    let slidercontent = L.DomUtil.create('div', this._base_classname + '-content');
    slidercontent.innerHTML = '<input ' +
    'onchange="ams.RiskThresholdHandler.onChange()" ' +
    'id="myRange" ' +
    'class="input-slider" ' +
    'type="range" ' +
    'min="0" ' +
    'max="' + ((this.options.range.length) ? (this.options.range.length - 1) : (0)) + '" ' +
    'step="1" ' +
    'value="' + ((this.options.range.length) ? (this.options.range[0]) : (0)) + '" ' +
    'data-tick-step="1" ' +
    'data-tick-id="weightTicks" ' +
    'data-value-id="weightValue" ' +
    'data-progress-id="weightProgress" ' +
    'data-handle-size="18" ' +
    'data-min-label-id="weightLabelMin" ' +
    'data-max-label-id="weightLabelMax" ' +
    '/>' +
    '<div class="ticks-container">' +
    '<div class="tick"></div>' +
    '<div class="tick"></div>' +
    '<div class="tick"></div>' +
    '<div class="tick"></div>' +
    '</div>' +
    '<div class="tick-labels">' +
    '<span class="tick-label">Muito baixo</span>' +
    '<span class="tick-label">Baixo</span>' +
    '<span class="tick-label">Moderado</span>' +
    '<span class="tick-label">Muito alto</span>' +
    '</div>' +  
    '<div class="risk-status-label"></div>'+
    '</div>'+
    '<div class="risk-date-label"></div>'+
    '</div>';

    form.appendChild(slidercontent);

    container.appendChild(form);

    $(container).mouseenter(function () {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
    });

    $(container).mouseleave(function () {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
    });

    if (L.Browser.touch) {
      L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
    } else {
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);
    }

    this._container = container;  
  },

  _onInputChange: function () {
    let position = +this._container.getElementsByTagName('input')[0].value;
    this._highlightSelectedLabel(position);
  },

  _highlightSelectedLabel: function (value) {
    let labels = this._container.querySelectorAll('.tick-label');
    labels.forEach(function (label) {
      label.style.fontWeight = 'normal';
      label.style.fontSize = '11px';
    });

    let selectedLabel = this._container.querySelector('.tick-label:nth-child(' + (value + 1) + ')');
    selectedLabel.style.fontWeight = 'bold';
    selectedLabel.style.fontSize = '13px';
  },     

  _updateStatusAndDateLabel: function (dateLabel) {    
    let riskDateLabels = this._container.querySelector('.risk-date-label');  
    riskDateLabels.innerHTML = dateLabel;
  
    // Calling the getLastDateStatus function with the new value of res
    let lastDateStatus = this.getLastDateStatus(dateLabel);
    let riskStatusLabel = this._container.querySelector('.risk-status-label');  
    riskStatusLabel.innerHTML = lastDateStatus;
  },    
  
   getLastDateStatus: function (res) {
    let lastDateStatus;
    
    if (res === null) {
      lastDateStatus = "Não há dados disponíveis";
    } else {
      let currentDate = new Date();
      let lastDate = new Date(res);
      let timeDifference = currentDate.getTime() - lastDate.getTime();
      let daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
      
      if (daysDifference > 7) {
        lastDateStatus = "Data desatualizada:";
      } else {
        lastDateStatus = "Data atualizada:";
      }
    }
    
    return lastDateStatus;
  },
  
  

  onAdd: function (map) {
    this._initLayout(map);
    return this._container;
  },

  onRemove: function (map) {
    delete this._container;
  }
});

L.control.RiskThresholdHandler = function (options) {
  return new L.Control.RiskThresholdHandler(options);
};

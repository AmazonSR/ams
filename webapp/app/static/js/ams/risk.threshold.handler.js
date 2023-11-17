var ams = ams || {};

ams.RiskThresholdHandler = {
    _sliderRange: [],
    _control: null,
    _date: null,

    init: function(map){
        this._sliderRange=ams.Config.risk.range;           
        if(!this._control) {
            this._control = L.control.RiskThresholdHandler({
                range: this._sliderRange,
                date: this._date
            });
        }
        this._control.addTo(map);
        let idx=ams.Config.risk.range.findIndex((e)=>{if(e==ams.Config.defaultRiskFilter.threshold) return true;});
        this._control._highlightSelectedLabel(idx);
    },

    remove: function(map) {
        if(this._control){
            map.removeControl(this._control);
            this._control=null;
        }
    },

    setLastRiskDate: function(lastRiskDate){ 
        this._date = lastRiskDate;  
    },

    onChange: function(){
        // to keep updated infos on UI and return the selected value
        ams.App._riskThreshold=this._control._onInputChange();
        ams.App._suViewParams.updateRiskThreshold(ams.App._riskThreshold);
        ams.App._priorViewParams.updateRiskThreshold(ams.App._riskThreshold);
        ams.App._updateSpatialUnitLayer();
    }
};
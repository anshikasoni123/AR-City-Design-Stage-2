modelList = [];

AFRAME.registerComponent("markerHandler",{
    init:function(){
        this.el.addEventListener("markerFound",() => {
          var modelName = this.el.getAttribute("model_name");
          var barcodeValue = this.el.getAttribute("value");
          modelList.push({model_name: modelName, barcode_value: barcodeValue})

          var model = document.querySelector(`${modelName}-${barcodeValue}`);
          model.setAttribute("visible",true);
        })
        this.el.addEventListener("markerFound",() => {
            var elementName = this.el.getAttribute("model_name");
            var index = modelList.findIndex(x=> x.element_name === elementName);

            if(index > -1){
                modelList.splice(index,1);
            }
        })
    },
    getDistance:function(elA,elB){
        return elA.object3D.position.distanceTo(elB.object3D.position)
    },
    getModelGeometry:function(models,modelName){
        var barcodes = Object.keys(models)
        for(var barcode of barcodes){
            if(models[barcode].model_name === modelName){
                return{
                    position:models[barcode]["placement_position"],
                    rotation:models[barcode]["placement_position"],
                    scale:models[barcode]["placement_position"],
                    model_url:models[barcode]["placement_position"]
                };
            }
        }
    },
    isModelPresentInArray:function(arr,val){
          for(i in arr){
            if(i.model_name === val){
                return true;
            }
          }
          return false;
    },
    placeTheModel:function(){
        var isListContainModel = this.isModelPresentInArray(modelList,modelName)
        if (isListContainModel) {
            var distance = null;
              var marker1 = document.querySelector("marker-base");
              var marker2 = document.querySelector(`#marker-${modelName}`);
      
              distance = this.getDistance(marker1, marker2);
      
              if (distance < 1.25) {
            var modelEl = document.querySelector("#modelName");
            modelEl.setAttribute("visible",false)
            var isModelPlaced = document.querySelector(`#model-${modelName}`)
            if(isModelPlaced === null){
                var el = document.createElement('a-entity');
                var modelGeometry = this.getModelGeometry(models,model)
                el.setAttribute("id",`model-${modelName}`);
                el.setAttribute("gltf-model",`url(${modelUrl})`);
                el.setAttribute("position",modelGeometry.position);
                el.setAttribute("rotation",modelGeometry.rotation);
                el.setAttribute("scale",modelGeometry.scale);
    
                marker.appendChild(el)
            }
            }
    }
},
     tick:async function(){
        if (modelList.length > 1) {

            var isBaseModelPresent = this.isBaseModelPresentInArray(modelList,"base")
            var messageText = document.querySelector("#message-text");
      
            if (!isBaseModelPresent) {
              messageText.setAttribute("visible",true);
            }
            else{
                if(models === null){
                    models = await this.getModels();
                }

                messageText.setAttribute("visible",false);
                this.placeTheModel("road",models);
                this.placeTheModel("car",models);
                this.placeTheModel("building",models);
            }
     }
    },
    getModels:function(){
       return fetch("js/compound.json").then(res => res.json()).then(data => data);
    }
})
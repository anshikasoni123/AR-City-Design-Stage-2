AFRAME.registerComponent("city",{
    init:async function(){
      var compounds = await this.getCompound();
      var barcodes = Object.keys(compounds);

      barcodes.map(barcode => {
        var element = compounds[barcode];

        this.createModel(element);
      })
    },
    getCompound:function(){
        return fetch("js/compound.json")
        .then(res => res.json())
        .then(data => data);
    },
    createModel:async function(element){
        var barcodeValue = element.barcode_value;
        var modelUrl = element.model_url;
        var modelName = element.model_name;

        var scene = document.querySelector("a-scene");

        var marker = document.createElement("a-marker");
        marker.setAttribute("id",`marker-${barcodeValue}`);
        marker.setAttribute("type","barcode");
        marker.setAttribute("model_name",modelName);
        marker.setAttribute("value",barcodeValue);
        marker.setAttribute("markerHandler",{})

        scene.appendChild(marker)

        if(barcodeValue === 0){
        var model = document.createElement("a-entity");
        model.setAttribute("id",`${modelName}`)
        model.setAttribute("geometry",{
            primitive :"box",
            width:element.width,
            height:element.height
        });
        model.setAttribute("material",{
            color:element.color,
            opacity:0.3
        });
        model.setAttribute("position",element.position);
        model.setAttribute("rotation",element.rotation);

        marker.appendChild(model);

        }  else{
            var model = document.createElement("a-entity");
            model.setAttribute("id",`${modelName}`);
            model.setAttribute("gltf-model",`url(${modelUrl})`);
            model.setAttribute("position",element.position);
            model.setAttribute("rotation",element.rotation);
            model.setAttribute("scale",element.scale);

            marker.appendChild(model)
        }
    },
})
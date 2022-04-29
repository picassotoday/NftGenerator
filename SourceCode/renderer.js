window.layerLengh = 0;
window.layerMap = new Map();
window.mapLayer = new Map();

function openPicasso() {
    window.openWebBrowser.openWebBrowser('https://www.picasso.today/#/create');
}

function showResultImage() {
    const images = [];
    var index = 0;
    for (let i = 1; i <= window.layerLengh; i++) {

        var layerImage = layerMap.get("layer".concat(i));

        if (typeof (layerImage) !== 'undefined') {
            images[index] = layerImage;
            index = index + 1;
        }
        console.log("typeof(layerImages)");
    }
    console.log(images);
    window.myAPI.mergeImage(images, document.getElementById("resultImage"));
}

function addLayer() {
    window.layerLengh = window.layerLengh + 1;
    var newLayer = document.createElement("div");
    newLayer.setAttribute("id", "layer".concat(window.layerLengh))
    newLayer.setAttribute("class", "imageLayer")
    newLayer.innerHTML = "<p id='dropTip' class='backgroundText'>Drop png images here!</p>";


    newLayer.ondragover = function () {
        return false;
    };

    newLayer.ondragleave = newLayer.ondragend = function () {
        return false;
    };

    newLayer.ondrop = function (e) {
        var targetId = e.target.id;
        if (event.target.id === 'dropTip') {
            targetId = e.target.parentNode.id;
        }
        e.preventDefault();

        console.log("event.target.id----------", targetId);
        document.getElementById(targetId).innerHTML = "";

        var pathNames = [];
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            pathNames[i] = e.dataTransfer.files[i].path;
        }
        window.mapLayer.set(newLayer.id, pathNames);

        for (var i = 0; i < e.dataTransfer.files.length; i++) {

            var myImage = document.createElement("img");
            myImage.setAttribute("class", "image");
            myImage.setAttribute("id", targetId.concat("_").concat(String(i)));
            myImage.setAttribute("src", e.dataTransfer.files[i].path);


            myImage.onclick = function (clickEvent) {
                layerMap.set(newLayer.id, document.getElementById(clickEvent.target.id).getAttribute("src"));
                showResultImage();

            }

            document.getElementById(targetId).appendChild(myImage);
        }

        layerMap.set(newLayer.id, e.dataTransfer.files[0].path);
        showResultImage();

        document.getElementById("genNFTs").innerText = String(getAllSize()).concat(" nfts to disk");
        return false;
    };


    document.getElementById('partsRoot').appendChild(newLayer);
    console.log("layer".concat(String(window.layerLengh)));

}

function getAllSize() {
    var allSize = 1;
    for (var i = 0; i < window.mapLayer.size; i++) {
        if (typeof (window.mapLayer.get("layer".concat(String(i + 1)))) === 'undefined') {
            alert("Layer ".concat(i).concat(" no images"));
            return;
        }
        allSize *= window.mapLayer.get("layer".concat(String(i + 1))).length;
    }
    console.log("allSize", allSize);
    return allSize;
}

function genNFTs() {

    var allSize = getAllSize();

    if (allSize <= 1) {
        alert("Please add layer, and then drop images");
        return;
    }

    window.openNFTFolder.openNFTFolder();

    for (var nIndex = 0; nIndex < allSize; nIndex++) {

        var imagesPath = [];
        var nowGenNumber = nIndex;


        for (var i = window.mapLayer.size - 1; i >= 0; i--) {
            var layerLength = window.mapLayer.get("layer".concat(String(i + 1))).length;
            var layer = window.mapLayer.get("layer".concat(String(i + 1)));
            imagesPath[i] = layer[0];
        }

        for (var i = window.mapLayer.size - 1; i >= 0; i--) {
            var layerLength = window.mapLayer.get("layer".concat(String(i + 1))).length;
            var layer = window.mapLayer.get("layer".concat(String(i + 1)));

            if (layerLength > nowGenNumber) {
                imagesPath[i] = layer[nowGenNumber];
                break;
            } else {
                imagesPath[i] = layer[nowGenNumber % layerLength];
                nowGenNumber = ~~(nowGenNumber / layerLength);
            }
        }

        console.log("Gen number:".concat(String(nIndex)));
        window.mergeImageToxFile.mergeImageToxFile(imagesPath, String(nIndex).concat(".png"));
    }
}

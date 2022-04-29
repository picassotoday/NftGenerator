const {contextBridge, ipcRenderer} = require('electron')
const path = require('path')

contextBridge.exposeInMainWorld('electron', {
    startDrag: (fileName) => {
        ipcRenderer.send('ondragstart', fileName)
    }
})


const mergeImages = require('merge-images');

contextBridge.exposeInMainWorld('myAPI',
    {
        mergeImage: (images, domElement) => {
            mergeImages(images)
                .then(b64 => domElement.src = b64);
        }
    });

//var pathName = path.join(__dirname, 'NFT');
var pathName = path.join(__dirname.concat('../').concat('../').concat('../').concat('../'), 'NFT');

contextBridge.exposeInMainWorld('mergeImageToxFile',
    {
      
        mergeImageToxFile: (images, name) => {

            if (!require("fs").existsSync(pathName)) {
                require("fs").mkdir(pathName, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('Directory created successfully!');
                });
            }else{
              console.log('Directory created successfully!');
            }


            mergeImages(images)
                .then(b64 =>
                    require("fs").writeFile(pathName.concat("/").concat(name), b64.replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                );
        }
    });

contextBridge.exposeInMainWorld('openNFTFolder',
    {
        openNFTFolder: () => {
            var isWin = process.platform === "win32";
            if (isWin) {
                require('child_process').exec('start '.concat(pathName));
            } else {
                require('child_process').exec('open '.concat(pathName));
            }

        }
    });


contextBridge.exposeInMainWorld('openWebBrowser',
    {
        openWebBrowser: (url) => {
            require('open')(url);
        }
    });

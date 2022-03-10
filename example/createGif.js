(async () => {
  try {
    const path = require('path')
    const nftpixels = require('../')
    const inputFolder = path.join(__dirname, './images')
    const outputFolder = path.join(__dirname, `./images/nft.gif`)
    await nftpixels.createGif(inputFolder, outputFolder)
  } catch (e) {
    console.log('error', e)
  }
})();

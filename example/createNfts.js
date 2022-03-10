(async () => {
  try {
    const nftpixels = require('../')
    const nftConfig = require('./config.json')
    const combinations = await nftpixels.generateImages(nftConfig)
    await nftpixels.generateMetadata(nftConfig, combinations)
  } catch (e) {
    console.log('error', e)
  }
})();

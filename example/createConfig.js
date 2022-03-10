(async () => {
  try {
    const path = require('path')
    const nftpixels = require('../')

    await nftpixels.generateConfig({
      metadata: {
        name: "NFT",
        description: "NFT collection",
        image: "ipfs://***/",
        externalUrl: "",
        background_color: "",
        animation_url: "",
        youtube_url: "",
        includeCreatedDate: "Birthday",
      },
      traits: path.join(__dirname, '/traits/'),
      outputImagePath: path.join(__dirname, '/images'),
      outputMetadataPath: path.join(__dirname, '/metadata'),
      configOutputPath: path.join(__dirname, '/config.json')
    })

  } catch (e) {
    console.log('error', e)
  }
})();

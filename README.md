# nft-pixels
`nft-pixels` allows one, to programatically, generate NFT images and their corresponding metadata from a configuration file.

There are various NFT generator projects out there, this project tries to solve some of the configuration issues that exist after the nfts have been generated.

- Generates unique images, via configured traits
- Configure rarity, via weights
- Control size and type of image output
- Aims to be opensea compatible
- Print report of traits used
- Seperately creates images and metadata
- Metadata can be correctly configured with `IPFS` hashes, that are returned from a pinning service e.g. (`pinata`, `nft storage`)

## Install
`npm install nft-pixels --save-dev`

## Setup
`nft-pixels` has been configured to be used programatically, for example, in a `hardhat` or `truffle` task.

In order to run `nft-pixels` you must configure a folder structure, as below, see the repository example folder for a concrete example.

```
{folder}
- traits
  -- trait1
    --- trait1.png
    --- trait2.png
    --- trait3.png
  -- trait2
    --- trait1.png
    --- trait2.png
    --- trait3.png
  -- trait3
    --- trait1.png
    --- trait2.png
    --- trait3.png
```

### nftpixels.generateConfig(config)

You will also need a nftconfig file; this command generates a skeleton nftConfig file, it reads the file system traits, above and generates a config file.

```
await nftpixels.generateConfig({
    metadata: {
      name: "NFT",
      description: "NFT collection",
      image: "ipfs://*********/",
      externalUrl: "url of dapp providing an nft minting function",
      background_color: "",
      animation_url: "",
      youtube_url: "",
      includeCreatedDate: "Birthday",
    },
    traits: '/traits/',
    outputImagePath: '/images',
    outputMetadataPath: '/metadata',
    configOutputPath: '/nftConfig.json'
  })
```

The file generated looks like so, this can be reused to re-generate your images.

The order of the traits structure is important, the images will be laid out based on the trait order

```
const nftConfig = {
  "metadata": {
    "name": "NFT",
    "description": "NFT collection",
    "image": "ipfs://***/",
    "externalUrl": "",
    "background_color": "",
    "animation_url": "",
    "youtube_url": "",
    "includeCreatedDate": "Birthday"
  },
  "files": {
    "imageSize": { "width": 350, "height": 350 },
    "outputFileType": "png",
    "deleteFolders": false,
    "printReport": true,
    "attributesPath": "example/traits/",
    "outputImagePath": "example/images",
    "outputMetadataPath": "example/metadata"
  },
  "traits": {
    "backgrounds": [
      { "file": "brown.png", "numberOfItems": 1000 },
      { "file": "lemon.png", "numberOfItems": 1000 }
    ],
    "eyes": [
      { "file": ".DS_Store", "numberOfItems": 1000 },
      { "file": "black-big-square.png", "numberOfItems": 1000 },
      { "file": "black-small-circle.png", "numberOfItems": 1000 }
    ],
    "hair": [
      { "file": "black-short.png", "numberOfItems": 1000 },
      { "file": "lemon-straight.png", "numberOfItems": 1000 }
    ],
    "mouth": [
      { "file": ".DS_Store", "numberOfItems": 1000 },
      { "file": "black-smile.png", "numberOfItems": 1000 },
      { "file": "black-straight.png", "numberOfItems": 1000 }
    ]
  }
}


```

### Weights and rarity
The weight algorithim, is simple, it randomly selects traits; traits with `numberOfItems` set to larger values are more likely to be selected; `numberOfItems` is the maximum number of images we could generate, not the minimum number.

e.g. if we set `numberOfItems` to 1 we would generate a single image with this trait.  a `numberOfItems` set to 2000, would mean that you could get 2000 images with this trait, if the number of unique images generated is > 2000.

So if you wanted a trait with a rarity of 10 images; set `numberOfItems` to 10.  We generate a report after creating images, so you can play around with the numbers and see whats been generated via the report.


## API

### nftpixels.generateImages(nftConfig)`
This command takes the above nftconfig as input, and creates images `{0}.png` files for all images, written to a folder `config.files.outputImagePath`.  `combinations` contains all the images generated (with traits), and can be used to `generateMetadata`

`const combinations = await nftpixels.generateImages(nftConfig)`


#### Report

If you have `printReport` set to `true` this function will print to console, a report outlining the number of images created for each trait e.g.

```
***********************************
Nft Generator created 1000 nfts

***********************************
Trait report

***********************************

backgrounds
- 406 images include brown
- 18 images include lemon

hair
- 99 images include black-long
- 300 images include black-shaved

mouth
- 302 images include black-grin
- 310 images include black-smile

eyes
- 62 images include black-big-square
- 33 images include black-wink

***********************************
```


### nftpixels.generateMetadata(config, combinations)

This command takes the above nftconfig as input, and the `combinations` returned from `generateImages` and creates metadata `{0}.json` files for all images, which are written to a folder location `config.files.outputMetadataPath`.

```
await nftpixels.generateMetadata(nftConfig, combinations)
```


### nftpixels.createGif(inputFolder, outputFolder)

This command allows you to create an animated gif of the images you have generated, simply takes the first 20 images and makes a gif.

```
await nftpixels.createGif(inputFolder, outputFolder)
```


### Hardhat Example tasks

This is an example of this modules usecase. Here we have a `hardhat` task which:
- generates nft images, returns all combinations created,
- pins images to `IPFS` via `Pinata`
- generates metadata and injects the retuned `IpfsHash`, passes combinations created
- pins metadata to `IPFS` via `Pinata`
- update config file used by the smart contract with a image `IpfsHash`

So, you are now ready to deploy your smart contract, no further configuration is required, and everything is setup correctly.

```
task("pin", "generate and pin images and metadata to pinata").setAction(async (_, hre) => {
  const pinToPinata = true
  let imageResponse;
  let metaResponse;

  // create a stream pointing at your image collection
  const pinata = pinataSdk(PINATA_KEY, PINATA_SECRET)

  // generate images
  console.log('generating images')
  const combinations = await nftpixels.generateImages(nftConfig)

  if (pinToPinata) {
    // pin images via pinata
    console.log('pin images via pinata')
    imageResponse = await pinata.pinFromFS(nftConfig.files.outputImagePath, {
      pinataMetadata: {
        name: `${config.name}-images`
      }
    })
  }

  // generate metadata, pass image via IpfsHash
  console.log('generating metadata')
  await nftpixels.generateMetadata({
    ...nftConfig,
    metadata: {
      ...nftConfig.metadata,
      image: `ipfs://${imageResponse?.IpfsHash}`
    }
  }, combinations)

  if (pinToPinata) {
    // pin metadata via pinata
    console.log('pin metadata via pinata')
    metaResponse = await pinata.pinFromFS(nftConfig.files.outputMetadataPath, {
      pinataMetadata: {
        name: `${config.name}-metadata`
      }
    })
  }

  // update config file with image IpfsHash
  console.log('update config file with IpfsHash')
  await fs.writeFile(path.join(__dirname, '../config/config.json'), JSON.stringify({
    ...config,
    baseTokenURI: `ipfs://${metaResponse?.IpfsHash}/`
  }))
})

```

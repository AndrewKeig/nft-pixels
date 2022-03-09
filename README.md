# nft-pixels
`nft-pixels` allows one, to programatically, generate NFT images and their corresponding metadata.

This can be used with for example, `hardhat` or `truffle` as a task to generate and then pin nfts.

- Generates images, via configured traits
- Configure rarity, via weights
- Control size and type of image output
- Print report of traits used
- Seperately create images and metadata
- Metadata can be correctly configured with `IPFS` hashes, returned from a pinning service e.g. (`pinata`, `nft storage`)

## Install
`npm install nft-pixels --save-dev`

## Setup
`nft-pixels` has been configured to be used programatically, for example, in a `hardhat` or `truffle` task.

In order to use this module you will need a folder of images/image layers; laid out like so.

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

### Generate nftconfig

You will also need a nftconfig file; this command generates a skeleton nftConfig file, it reads the file system traits, above and generates a config file.

```
await nftpixels.generateConfig({
    metadata: {
      name: "NFT",
      description: "NFT collection",
      image: "ipfs://*********/",
      externalUrl: "",
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
    "image": "ipfs://*********/",
    "externalUrl": "http://nft-collection.com",
    "background_color": "",
    "animation_url": "",
    "youtube_url": "",
    "includeCreatedDate": "Birthday"
  },
  "files": {
    "imageSize": {
      "width": 350,
      "height": 350
    },
    "outputFileType": "png",
    "deleteFolders": false,
    "printReport": true,
    "attributesPath": "path to traits",
    "outputImagePath": "path to image output folder",
    "outputMetadataPath": "path to metadata folder"
  },
  "traits": {
    "backgrounds": [
      {
        "file": "brown.png",
        "numberOfItems": 1250
      },
      {
        "file": "lemon.png",
        "numberOfItems": 1250
      }
    ],
    "hair": [
      {
        "file": "black.png",
        "numberOfItems": "300"
      },
      {
        "file": "yellow.png",
        "numberOfItems": "300"
      }
    ],
    "mouth": [
      {
        "file": "black-grin.png",
        "numberOfItems": "500"
      },
      {
        "file": "black-smile.png",
        "numberOfItems": "500"
      }
    ],
    "eyes": [
      {
        "file": "black-big-square.png",
        "numberOfItems": "100"
      },
      {
        "file": "black-wink.png",
        "numberOfItems": 2000
      }
    ]
  }
}

```

## Usage

### Generate Images
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


### Generate Metadata

This command takes the above nftconfig as input, and the `combinations` returned from `generateImages` and creates metadata `{0}.json` files for all images, which are written to a folder location `config.files.outputMetadataPath`.

```
await nftpixels.generateMetadata({
    ...nftConfig,
    metadata: {
      ...config.metadata,
      image: `ipfs://${imageResponse?.IpfsHash}`
    }
  }, combinations)
```


### Hardhat Example tasks

This is a simple example of this modules usecase, this `hardhat` task generates nfts, and then pins the nfts to `IPFS` via `Pinata`

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

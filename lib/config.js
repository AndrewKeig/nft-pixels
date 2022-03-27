const fs = require("fs").promises
const { existsSync } = require("fs")

const template = {
  "metadata": {
    "name": "",
    "description": "",
    "image": "",
    "externalUrl": "",
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
    "attributesPath": "",
    "outputImagePath": "",
    "outputMetadataPath": ""
  },
  "traits": {}
}

async function createConfigFile(config) {
  const traits = {}

  const folder = await (await fs.readdir(config.traits)).filter(x => x !== '.DS_Store')

  for (const f of folder) {
    const files = []
    const subfolder = await fs.readdir(config.traits + f)

    for (const s of subfolder) {
      files.push({
        "file": s,
        "numberOfItems": 100
      })

      traits[f] = files
    }
  }

  template.traits = traits
  template.files.attributesPath = config.traits
  template.files.outputImagePath = config.outputImagePath
  template.files.outputMetadataPath = config.outputMetadataPath
  template.metadata = config.metadata

  await fs.writeFile(config.configOutputPath, JSON.stringify(template))
}

module.exports = {
  createConfigFile
}

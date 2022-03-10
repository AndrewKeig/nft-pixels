const fs = require("fs").promises
const { existsSync } = require("fs")

async function createMetadata(config, combinations) {
  for (var n = 0; n < combinations.length; n++) {
    const attributes = combinations[n].map(c => ({
      trait_type: c.trait,
      value: c.file ? c.file.split('.')[0] : '',
    }))

    if (config.metadata.includeCreatedDate) {
      attributes.push({ trait_type: config.metadata.includeCreatedDate, value: Date.now(), display_type: 'date' })
    }

    await fs.writeFile(`${config.files.outputMetadataPath}/${n}`, JSON.stringify({
      name: `${config.metadata.name}#${n}`,
      description: config.metadata.description,
      image: `${config.metadata.image}/${n}.${config.files.outputFileType}`,
      external_url: config.metadata.externalUrl,
      background_color: config.metadata.background_color,
      animation_url: config.metadata.animation_url,
      youtube_url: config.metadata.youtube_url,
      attributes
    }))
  }
}

async function createMetadataFolder(config) {
  if (!existsSync(config.files.outputMetadataPath)) {
    await fs.mkdir(config.files.outputMetadataPath, { recursive: true })
  }
}

async function deleteMetadataFolder(config) {
  if (!config.files.deleteFolders) {
    return
  }

  if (existsSync(config.files.outputMetadataPath)) {
    await fs.rm(config.files.outputMetadataPath, { recursive: true })
  }
}

module.exports = {
  createMetadata,
  createMetadataFolder,
  deleteMetadataFolder,
}

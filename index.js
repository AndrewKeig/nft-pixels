const { combineAttributes, calculateNumberOfAttributes, findSmallestArray } = require('./lib/shared')
const { createMetadata, createMetadataFolder, deleteMetadataFolder } = require('./lib/metadata')
const { createImages, createImageFolder, deleteImageFolder } = require('./lib/images')
const { createConfigFile } = require('./lib/config')

exports.generateImages = async function (config) {
  const traits = Object.keys(config.traits).map(t => t)
  const attributes = await calculateNumberOfAttributes(config, traits)
  const maxNftsToGenerate = findSmallestArray(traits, attributes)
  const combinations = await combineAttributes(traits, attributes, maxNftsToGenerate)

  await deleteImageFolder(config)
  await createImageFolder(config)
  await createImages(config, combinations, traits)
  return combinations
}

exports.generateMetadata = async function (config, combinations) {
  await deleteMetadataFolder(config)
  await createMetadataFolder(config)
  await createMetadata(config, combinations)
}

exports.generateConfig = async function (setup) {
  await createConfigFile(setup)
}

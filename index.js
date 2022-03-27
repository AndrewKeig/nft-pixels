const { combineAttributes, calculateNumberOfAttributes, findSmallestArray, uniqueCombinations } = require('./lib/shared')
const { createMetadata, createMetadataFolder, deleteMetadataFolder } = require('./lib/metadata')
const { createImages, createImageFolder, deleteImageFolder } = require('./lib/images')
const { createConfigFile } = require('./lib/config')
const { createGif } = require('./lib/gif')

exports.generateImages = async function (config) {
  console.log('generating images')
  const traits = Object.keys(config.traits).map(t => t)
  const attributes = await calculateNumberOfAttributes(config, traits)
  const maxNftsToGenerate = findSmallestArray(traits, attributes)
  const combinations = await combineAttributes(traits, attributes, maxNftsToGenerate)
  const unique = await uniqueCombinations(combinations)

  await deleteImageFolder(config)
  await createImageFolder(config)
  await createImages(config, unique, traits)
  return unique
}

exports.generateMetadata = async function (config, combinations) {
  console.log('generating metadata')
  await deleteMetadataFolder(config)
  await createMetadataFolder(config)
  await createMetadata(config, combinations)
}

exports.generateConfig = async function (setup) {
  console.log('generating config')
  await createConfigFile(setup)
}

exports.createGif = async function (inputFolder, outputFolder) {
  await createGif(inputFolder, outputFolder)
}

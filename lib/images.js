const fs = require("fs").promises
const { existsSync } = require("fs")
const { createCanvas, loadImage } = require("canvas")

async function createImages(config, combinations, traits) {
  const canvas = createCanvas(config.files.imageSize.width, config.files.imageSize.height)
  const ctx = canvas.getContext("2d")
  const report = {}

  let count = 0
  for (var n = 0; n < combinations.length; n++) {
    for (const attribute of combinations[n]) {
      if (attribute.file !== undefined) {
        const filename = attribute.trait + '/' + attribute.file
        const image = await loadImage(config.files.attributesPath + filename)
        ctx.drawImage(image, 0, 0, config.files.imageSize.width, config.files.imageSize.height)
        report[filename] = report[filename] ? report[filename] + 1 : 1
      }
    }
    await fs.writeFile(
      `${config.files.outputImagePath}/${count}.${config.files.outputFileType}`,
      canvas.toBuffer(`image/${config.files.outputFileType}`
      ))

    count++
  }

  if (config.files.printReport) {
    printReport(count, report, traits)
  }
}

async function createImageFolder(config) {
  if (!existsSync(config.files.outputImagePath)) {
    await fs.mkdir(config.files.outputImagePath, { recursive: true })
  }
}

async function deleteImageFolder(config) {
  if (!config.files.deleteFolders) {
    return
  }

  if (existsSync(config.files.outputImagePath)) {
    await fs.rm(config.files.outputImagePath, { recursive: true })
  }
}

function printReport(count, report, traits) {
  console.log(`\n\n***********************************`)
  console.log(`Nft Generator created ${count} nfts`)
  console.log(`\n***********************************`)
  console.log(`Trait report`)
  console.log(`\n***********************************`)

  for (const trait of traits) {
    console.log(`\n${trait}`)
    const keys = Object.keys(report).filter(r => r.startsWith(trait + '/'))
    for (const item of keys) {
      console.log(`- ${report[item]} images include ${item.replace(trait + '/', '').split('.')[0]}`)
    }
  }

  console.log(`\n***********************************\n`)
}

module.exports = {
  createImages,
  createImageFolder,
  deleteImageFolder,
}

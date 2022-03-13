const gif = require('gif-encoder-2')
const fs = require("fs").promises
const { createCanvas, Image } = require('canvas')
const { createWriteStream } = require('fs')
const path = require('path')

async function createGif(imagesFolder, outputFolder) {
  const algorithm = 'neuquant'
  return new Promise(async resolve1 => {
    const files = await fs.readdir(imagesFolder)
    const imagesForGif = files.slice(0, 20);

    const [width, height] = await new Promise(resolve2 => {
      const image = new Image()
      image.onload = () => resolve2([image.width, image.height])
      image.src = path.join(imagesFolder, imagesForGif[0])
    })

    const writeStream = createWriteStream(outputFolder)
    writeStream.on('close', () => { resolve1() })

    const encoder = new gif(width, height, algorithm)
    encoder.createReadStream().pipe(writeStream)
    encoder.start()
    encoder.setDelay(200)

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    for (const file of imagesForGif) {
      await new Promise(resolve3 => {
        const image = new Image()
        image.onload = () => {
          ctx.drawImage(image, 0, 0)
          encoder.addFrame(ctx)
          resolve3()
        }
        image.src = path.join(imagesFolder, file)
      })
    }
  })
}

module.exports = { createGif }

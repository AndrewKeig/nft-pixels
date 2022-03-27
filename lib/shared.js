async function combineAttributes(traits, attributes, maxNftsToGenerate) {
  const combinations = []
  for (let index = 0; index < maxNftsToGenerate; index++) {
    const newItem = []
    for (let traitNumber = 0; traitNumber < traits.length; traitNumber++) {
      const select = random(0, attributes[traitNumber].length - 1)
      attributes[traitNumber].splice(select, 1)
      if (attributes[traitNumber][select] && traits[traitNumber]) {
        newItem.push({ file: attributes[traitNumber][select], trait: traits[traitNumber] })
      }
    }
    if (newItem.length === traits.length) {
      combinations.push(newItem)
    }
  }

  return combinations
}

async function calculateNumberOfAttributes(config, traits) {
  try {
    const attributes = []
    for (const t of traits) {
      const x = []
      for (const item of config.traits[t]) {
        for (let index = 0; index < item.numberOfItems; index++) {
          x.push(item.file)
        }
      }
      attributes.push(x)
    }
    return attributes
  } catch (error) {
    console.log(error)
  }
}

const uniqueCombinations = (combinations) => {
  return combinations.map(JSON.stringify).reverse()
    .filter(function (item, index, arr) { return arr.indexOf(item, index + 1) === -1; })
    .reverse().map(JSON.parse)
}

function findSmallestArray(traits, attributes) {
  return attributes.map(x => x).map(y => y.length).sort()[0]
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

module.exports = {
  combineAttributes,
  calculateNumberOfAttributes,
  uniqueCombinations,
  findSmallestArray,
  random,
}

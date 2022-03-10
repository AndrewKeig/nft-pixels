async function combineAttributes(traits, attributes, maxNftsToGenerate) {
  const combinations = []
  // create (maxNftsToGenerate as n) items
  for (let index = 0; index < maxNftsToGenerate; index++) {
    const newItem = []
    //loop over traits
    for (let traitNumber = 0; traitNumber < traits.length; traitNumber++) {
      const select = random(0, attributes[traitNumber].length - 1)
      attributes[traitNumber].splice(select, 1)
      if (attributes[traitNumber].length > 0) {
        newItem.push({ file: attributes[traitNumber][select], trait: traits[traitNumber] })
      }
    }

    if (newItem.length > 0) {
      combinations.push(newItem)
    }
  }

  const set = new Set(combinations.map(JSON.stringify));
  return Array.from(set).map(JSON.parse);
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

function findSmallestArray(traits, attributes) {
  return attributes.map(x => x).map(y => y.length).sort()[0]
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

module.exports = {
  combineAttributes,
  calculateNumberOfAttributes,
  findSmallestArray,
  random,
}

import fs from '../frontFS.js'
import GlobalVault from '../GlobalVault.js'
import defaults from '/center/defaultSubjectData.js'


const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

const assureArr = value => Array.isArray(value)? value : [value]


const vaultPath = 'writable/vaults/'

GlobalVault.defaultWays.toSave = (name, value, varNames) =>
  fs.write(vaultPath+`${name}.json`, value).then(resp =>
    console.log(resp.ok? `${name} saved${varNames?
      ' '+varNames.join(', ') : ''}` : `unable to save ${name} variable`))

GlobalVault.defaultWays.toLoad = name =>
  fetch(vaultPath+`${name}.json`).then(resp => resp.ok? resp.json() : null)

const vaultNames = Object.keys(defaults)

const vaults = Promise.all(vaultNames.map(async name => {
  if (window[name] === undefined)  window[name] = defaults[name]
  return [name, new GlobalVault(name)]
})).then(Object.fromEntries)



const clerk = {
  async read(vaults, subject) {
    try { await vaults[subject].load() }
    catch { window[subject] = cloneViaJSON(defaults[subject]) }
    return window[subject]
  },

  async create(vaults, subject, dataToAdd=[]) {
    dataToAdd = cloneViaJSON(assureArr(dataToAdd))

    await vaults[subject].load()

    await Promise.all(dataToAdd.map(async item => {
      if (!item.id) item.id = await giveId(vaults)
      if (!item.created || !item.modified) {
        const date = new Date
        if (!item.created) item.created = date
        if (!item.modified) item.modified = date
      }
    }))

    window[subject].push(...dataToAdd)
    await vaults[subject].save()

    return dataToAdd.map(item => item.id)
  },
}



export default async function operate(action, subject, data, credentials) {
  const allVaults = await vaults

  return clerk[action](allVaults, subject, data)
}

async function giveId(vaults) {
  try { await vaults.lastId.load() }
  catch { lastId = defaults.lastId }
  lastId++
  await vaults.lastId.save()
  return lastId
}
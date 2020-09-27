import fs from '../frontFS.js'
import GlobalVault from '../GlobalVault.js'
import defaults from '/center/defaultSubjectData.js'


const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

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
  async read(subject) {
    const allVaults = await vaults
    try { await allVaults[subject].load() }
    catch { window[subject] = cloneViaJSON(defaults[subject]) }
    return window[subject]
  }
}



export default async function operate(action, subject, data, credentials) {
  return clerk[action](subject, data)
}

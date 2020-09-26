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

vaultNames.forEach(name => {
  if (window[name] === undefined)  window[name] = defaults[name]
})

const vault = new GlobalVault(vaultNames)


export default async function operate(action, subject, data, credentials) {
  if (action == 'read') {
    await vault.load()
    return cloneViaJSON(window[subject])
  }
}

import fs from '../frontFS.js'
import GlobalVault from '../GlobalVault.js'

const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

const vaultPath = 'writable/vaults/'

GlobalVault.defaultWays.toSave = (name, value, varNames) =>
  fs.write(vaultPath+`${name}.json`, value).then(resp =>
    console.log(resp.ok? `${name} saved${varNames?
      ' '+varNames.join(', ') : ''}` : `unable to save ${name} variable`))

GlobalVault.defaultWays.toLoad = name =>
  fetch(vaultPath+`${name}.json`).then(resp => resp.ok? resp.json() : null)


if (!window.notes) window.notes = []

const vault = new GlobalVault('notes')


export default async function operate(action, subject, data, credentials) {
  if (action == 'read') {
    await vault.load()
    return cloneViaJSON(window[subject])
  }
}

import resolveByHand from './resolveByHand/resolveByHand.js'

import credentials from './credentials.js'

import operateHardRAM from './frontDataClerks/hardRAMclerk.js'
import operateLS from './frontDataClerks/LSclerk.js'
import operateOnBackend from './frontDataClerks/fetchBackClerk.js'
import operateGlobalVault from './frontDataClerks/globalVaultClerk.js'

const dataClerks = {hardcodeRAM: operateHardRAM, localStorage: operateLS,
  backOperations: operateOnBackend, globalVault: operateGlobalVault}

const operateViaDC = getDataClerk()


async function getDataClerk() {
  if (!localStorage.PG_dataClerk) {
    const db = await fetch('/api/db_in_use')
                      .then(resp => resp.text()).catch(console.error)

    const choice = await resolveByHand(
      'What do we use as a data source?',
      [
        ['localStorage', 'localStorage'],
        ['hardcoded data / RAM', 'hardcodeRAM'],
        ['GlobalVaults', 'globalVault'],
        [`DB selected on back end (${db})`, 'backOperations'],
        {label: 'mongo DB (need permission)',
          value: {ask: 'mongoDB', set: 'backOperations'}, secure: true},
        {label: 'MySQL (need permission)',
          value: {ask: 'mySQL', set: 'backOperations'}, secure: true},
      ]
    )

    if (choice.permissionKey !== undefined) {
      const response = await fetch('/api/use_db', {
        method: 'POST',
        body: JSON.stringify({
          clerkName: choice.value.ask,
          permissionKey: choice.permissionKey
        })
      })
      if (response.ok)  localStorage.PG_dataClerk = choice.value.set
      else  return await getDataClerk()
    } else  localStorage.PG_dataClerk = choice
  }
  return dataClerks[localStorage.PG_dataClerk]
}

export default async function operate(action, subject, data) {
  const properOperate = await operateViaDC
  return properOperate(action, subject, data, credentials)

}

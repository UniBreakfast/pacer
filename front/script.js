import operate from '/frontOperate.js'

import resolveByHand from '/resolveByHand/resolveByHand.js'

// const event = JSON.parse(localStorage.event)
// delete event.id
// operate('insert', 'events', event).then(console.log).catch(console.error)

operate('read', 'events').then(console.log).catch(console.error)

const fireBtn = document.getElementById('fireBtn')
fireBtn.onclick = () => {
  delete localStorage.PG_dataClerk
  location.reload()
}


Object.assign(window, {masterClerk: operate})

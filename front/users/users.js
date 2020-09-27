import Modal from '/Modal.js'

import operate from '/frontOperate.js'

import resolveByHand from '/resolveByHand/resolveByHand.js'

operate('read', 'users').then(showUsers).catch(console.error)
  .then(showDataClerk)

const dateToISOstr = date => JSON.stringify(date).slice(1,20).replace('T',' ')

const users = [
  {
    id: 1,
    login: 'Bob',
    password: 'silent',
    hash: 'to_be_generated',
    created: new Date,
    modified: new Date,
  },
  {
    id: 2,
    login: 'The last airbender',
    password: '123',
    hash: 'to_be_generated',
    created: new Date,
    modified: new Date,
  },
  {
    id: 3,
    login: 'Teresa',
    password: 'very_very_long_password',
    hash: 'to_be_generated',
    created: new Date,
    modified: new Date,
  },
]


const userList = document.getElementById('userList')


fireBtn.onclick = () => { delete localStorage.PG_dataClerk; location.reload() }

showDataClerk()

const width = 430,  left = innerWidth/2 - width/2,  top = innerHeight/3.5

const createUserModal = new Modal('users/create.htm', {top, left, width})

createUserBtn.onclick = () => createUserModal.show()


async function showDataClerk() {
  const label = fireBtn.children[0]
  const assignedAtFront = localStorage.PG_dataClerk
  if (assignedAtFront) {
    if (assignedAtFront != 'backOperations') label.innerText = assignedAtFront
    else {
      const db = await fetch('/api/db_in_use')
                          .then(resp => resp.text()).catch(console.error)
      label.innerText = db
    }
    fireBtn.hidden = false
  } else fireBtn.hidden = true
}

function showUsers(users) {
  userList.innerHTML = users.map(buildUserItem).join('')
  if (userList.children.length) {
    const allWidths = [...userList.querySelectorAll('li>span')]
      .map(span => [...span.children]
          .map(span => span.getBoundingClientRect().width))
    const widths = allWidths[0]
      .map((_, i) => Math.max(...allWidths.map(widths => widths[i])))
    widths.forEach((width, i) =>
      userList.style.setProperty('--width'+i, width+'px'))
  } else {
    userList.innerHTML = `<h3>no users found</h3>`
  }
}

function buildUserItem(user) {
  return `
    <li>
      <span>
        <span>${user.id || user._id}</span>
        <span>${user.login}</span>
        <span>${user.password}</span>
        <span>${user.hash}</span>
        <span>${dateToISOstr(user.created)}</span>
        <span>${dateToISOstr(user.modified)}</span>
      </span>
    </li>
  `
}
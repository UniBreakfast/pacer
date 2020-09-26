import operate from '/frontOperate.js'

import resolveByHand from '/resolveByHand/resolveByHand.js'

operate('read', 'users').then(showUsers).catch(console.error)

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

// showUsers()

fireBtn.onclick = () => { delete localStorage.PG_dataClerk; location.reload() }



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
        <span>${user.id}</span>
        <span>${user.login}</span>
        <span>${user.password}</span>
        <span>${user.hash}</span>
        <span>${dateToISOstr(user.created)}</span>
        <span>${dateToISOstr(user.modified)}</span>
      </span>
    </li>
  `
}
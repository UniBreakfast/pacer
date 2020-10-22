import Modal from '/Modal.js'
import Toaster from '/Toaster/Toaster.js'

import operate from '/frontOperate.js'

import validate from '/center/validate.js'
import subjectSchemata from '/center/subjectSchemata.js'

import resolveByHand from '/resolveByHand/resolveByHand.js'

const dateToISOstr = date => JSON.stringify(date).slice(1,20).replace('T',' ')


const userList = document.getElementById('userList')

let schemata = subjectSchemata.generic


const width = 430,  height = 455,
  left = innerWidth/2 - width/2,  top = innerHeight/3.5



const createUserModal = new Modal('users/create.htm', {top, left, width, height,
  onshow() {
    cancelCreateBtn.onclick = () => createUserModal.hide()

    createUserForm.onsubmit = async e => {
      e.preventDefault()
      await createUser(new FormData(createUserForm))
      await operate('read', 'users').then(showUsers).catch(console.error)
      if (!keepCreateFilledBox.checked) createUserForm.reset()
      if (!keepCreateOpenBox.checked) createUserModal.hide()
    }
  },
  onhide,
})

const regUserModal = new Modal('users/register.htm', {top, left, width,
  height: 310,
  onshow() {
    cancelRegBtn.onclick = () => regUserModal.hide()

    regUserForm.onsubmit = async e => {
      e.preventDefault()
      await registerUser(new FormData(regUserForm))
      await operate('read', 'users').then(showUsers).catch(console.error)
      if (!keepRegFilledBox.checked) regUserForm.reset()
      if (!keepRegOpenBox.checked) regUserModal.hide()
    }
  },
  onhide,
})


const toaster = new Toaster({side: 'top-center', from: 'bottom', to: 'top',
  limit: 9, life: 10, push: false, width: 60, gap: 10})


fireBtn.onclick = () => { delete localStorage.PG_dataClerk; location.reload() }


createUserBtn.onclick = () => createUserModal.show()

regUserBtn.onclick = () => regUserModal.show()


operate('read', 'users').then(showUsers).catch(console.error)
  .then(updateDataClerk)



updateDataClerk()


function onhide() {
  this.glass.classList.add('hiding')
  return new Promise(resolve => {
    const hide = () => {
      resolve()
      this.glass.onanimationend = null
      this.glass.classList.remove('hiding')
    }
    this.glass.onanimationend = hide
    setTimeout(() => {
      if (this.glass.classList.contains('hiding')) hide()
    }, 999)
  })
}

async function updateDataClerk() {
  const label = fireBtn.children[0]
  const assignedAtFront = localStorage.PG_dataClerk
  if (assignedAtFront) {
    if (assignedAtFront != 'backOperations') {
      schemata = subjectSchemata.generic
      label.innerText = assignedAtFront
    } else {
      const db = await fetch('/api/db_in_use')
                          .then(resp => resp.text()).catch(console.error)
      label.innerText = db
      schemata = subjectSchemata[db == 'mongoDB' ? 'hex' : 'num']
    }
    fireBtn.hidden = false
  } else fireBtn.hidden = true
}

function showUsers(users) {
  userList.innerHTML = users.map(buildUserItem).join('')
  if (userList.children.length) {
    columnRow.hidden = false
    userView.style = ''
    const allWidths = [...userList.querySelectorAll('li>span')]
                        .map(span => [...span.children]
                          .map(span => span.getBoundingClientRect().width))
    userView.style = allWidths[0]
      .map((_, i) => Math.max(...allWidths.map(widths => widths[i])))
      .map((width, i) => `--width${i}:${width}px`).join('; ')
  } else {
    columnRow.hidden = true
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

async function createUser(formData) {
  toaster.clear()
  const user = Object.fromEntries([...formData.entries()])
  const issues = validate(user, schemata.users)
  if (issues) {
    issues.forEach(issue => toaster.log(`${issue.field}: ${issue.issue}`))
    throw 'invalid input'
  }
  const id = await operate('create', 'users', [user])
  return id
}

async function registerUser(formData) {
  toaster.clear()
  const user = Object.fromEntries([...formData.entries()])
  const issues = validate(user, schemata.registrants)
  if (issues) {
    issues.forEach(issue => toaster.log(`${issue.field}: ${issue.issue}`))
    throw 'invalid input'
  }
  delete user.confirm
  const id = await operate('create', 'users', [user])
  return id
}
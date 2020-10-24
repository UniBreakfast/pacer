import Modal from '/Modal.js'
import Toaster from '/Toaster/Toaster.js'

import operate from '/frontOperate.js'

import validate from '/center/validate.js'
import subjectSchemata from '/center/subjectSchemata.js'

import resolveByHand from '/resolveByHand/resolveByHand.js'

const dateToISOstr = date => JSON.stringify(date).slice(1,20).replace('T',' ')


const userList = document.getElementById('userList')

let schemata = subjectSchemata.generic


const width = 430,  height1 = 455,  height2 = 310,  height3 = 250,
  left = innerWidth/2 - width/2,  top = innerHeight/3.5



const createUserModal = new Modal('users/create.htm', {
  top, left, width, height: height1,
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

const regUserModal = new Modal('users/register.htm', {
  top, left, width, height: height2,
  onshow() {
    cancelRegBtn.onclick = () => regUserModal.hide()

    seeRegPassBtn.onclick = handleSee

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

const loginModal = new Modal('users/login.htm', {
  top, left, width, height: height3,
  onshow() {
    cancelLoginBtn.onclick = () => loginModal.hide()

    seeLoginPassBtn.onclick = handleSee

    loginForm.onsubmit = async e => {
      e.preventDefault()
      const success = await authenticateUser(new FormData(loginForm))
      if (success) {
        loginForm.reset()
        loginModal.hide()
      }
    }
  },
  onhide,
})


const toaster = new Toaster({side: 'top-center', from: 'bottom', to: 'top',
  limit: 9, life: 10, push: false, width: 60, gap: 10})


fireBtn.onclick = () => { delete localStorage.PG_dataClerk; location.reload() }

createUserBtn.onclick = () => createUserModal.show()
regUserBtn.onclick = () => regUserModal.show()
authUserBtn.onclick = () => loginModal.show()
logOutBtn.onclick = logOut


checkVisitor()

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
  const issues = validate(user, schemata.registrants) || []
  if (user.password != user.confirm) {
    issues.push({field: 'confirm password',
                  issue: 'should be exactly the same password'})
  }
  if (issues.length) {
    issues.forEach(issue => toaster.log(`${issue.field}: ${issue.issue}`))
    throw 'invalid input'
  }
  delete user.confirm
  const id = await operate('create', 'users', [user])
  return id
}

async function authenticateUser(formData) {
  toaster.clear()
  const user = Object.fromEntries([...formData.entries()])
  const issues = validate(user, schemata.visitors)
  if (issues) {
    issues.forEach(issue => toaster.log(`${issue.field}: ${issue.issue}`))
    throw 'invalid input'
  }
  const token = await operate('authorize', 'users', user)
  if (token) {
    localStorage.PG_authToken = token
    localStorage.PG_user = user.login
    updateRecognizedUser(user.login)
    toaster.log('logged in as ' + user.login)
    return true
  } else {
    toaster.log('login and/or password: incorrect')
  }
}

function handleSee() {
  const form = this.previousElementSibling
  if (this.classList.contains('active')) {
    form.password.type = 'password'
    if (form == regUserForm) form.confirm.type = 'password'
    this.classList.remove('active')
  } else {
    form.password.type = 'text'
    if (form == regUserForm) form.confirm.type = 'text'
    this.classList.add('active')
  }
  form.password.focus()
}

function updateRecognizedUser(login) {
  currentUserLabel.innerText = login
}

async function checkIfUserRecognized() {
  if (localStorage.PG_authToken && localStorage.PG_user) {
    const user = {login: localStorage.PG_user, token: localStorage.PG_authToken}
    const recognized = await operate('verify', 'users', user)
    return recognized
  } else return false
}

async function checkVisitor() {
  if (await checkIfUserRecognized()) updateRecognizedUser(localStorage.PG_user)
  else updateRecognizedUser('guest')
}

async function logOut() {
  if (localStorage.PG_authToken && localStorage.PG_user) {
    const user = {login: localStorage.PG_user, token: localStorage.PG_authToken}
    operate('logout', 'users', user)
  }
  delete localStorage.PG_authToken
  delete localStorage.PG_user
  updateRecognizedUser('guest')
}

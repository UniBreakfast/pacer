function showLoginForm() {
    document.getElementById('sign-up-form').hidden = true;
    document.getElementById('sign-in-form').hidden = false;
}

function showSignUpForm() {
    document.getElementById('sign-up-form').hidden = false;
    document.getElementById('sign-in-form').hidden = true;
}

const form = document.getElementById('sign-up-form')
const fullname = document.getElementById('fullname')
const email = document.getElementById('email')
const username = document.getElementById('username')
const password = document.getElementById('password')
const passwordCheck = document.getElementById('password-check')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    checkInputs()
})

function checkInputs() {
    // get the values from the inputs
    const fullnameValue = fullname.value.trim()
    const emailValue = email.value.trim()
    const usernameValue = username.value.trim()
    const passwordValue = password.value.trim()
    const passwordCheckValue = passwordCheck.value.trim()

    if (fullnameValue === '') {
        setErrorFor(fullname, 'Full name cannot be empty')
    } else {
        setSuccessFor(fullname)
    }
    if (usernameValue === '') {
        setErrorFor(username, 'Username cannot be empty')
    } else {
        setSuccessFor(username)
    }
    if (emailValue === '') {
        setErrorFor(email, 'Email cannot be empty')
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Email is not valid')
    }
    else {
        setSuccessFor(email)
    }
    if (passwordValue === '') {
        setErrorFor(password, 'Password cannot be empty')
    } else {
        setSuccessFor(password)
    }
    if (passwordCheckValue === '') {
        setErrorFor(passwordCheck, 'Password cannot be empty')
    } else if (passwordValue !== passwordCheckValue) {
        setErrorFor(passwordCheck, 'Passwords should be the same')
    }

    else {
        setSuccessFor(passwordCheck)
    }
}

function setErrorFor(input, message) {
    const formControl = input.parentElement; // form-control div
    const small = formControl.querySelector('small')

    // add error message inside small tag
    small.innerText = message

    // add error class 
    formControl.classList.add('error')
    formControl.classList.remove('success')
}

function setSuccessFor(input) {
    const formControl = input.parentElement
    formControl.classList.add('success')
    formControl.classList.remove('error')
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

const signInForm = document.getElementById('sign-in-form')

signInForm.addEventListener('submit', (e) => {
    e.preventDefault()

    signInCheckInputs()
})

signInUsername = document.getElementById('sign-in-username')
signInPassword = document.getElementById('sign-in-password')

function signInCheckInputs() {
    const signInUsernameValue = signInUsername.value.trim()
    const signInPasswordValue = signInPassword.value.trim()

    if (signInUsernameValue === '') {
        setErrorFor(signInUsername, 'Username cannot be empty')
    } else {
        setSuccessFor(signInUsername)
    }

    if (signInPasswordValue === '') {
        setErrorFor(signInPassword, 'Password cannot be empty')
    } else {
        setSuccessFor(signInPassword)
    }
}
const operables = {
  required: list(`
    create users
    read users
    update users
    delete users
    check users
    register users
    authorize users
  `),

  hardcodeRAM: list(`

  `),

  localStorage: list(`

  `),

  globalVault: list(`

  `),

  backOperations: list(`

  `),

  mongoDB: list(`

  `),

  mySQL: list(`

  `),
}


export default operables


function list(multiline) {
  return multiline.split('\n  ').filter(line => line.trim())
}
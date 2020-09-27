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
    read users
  `),

  localStorage: list(`
    read users
  `),

  globalVault: list(`
    read users
  `),

  backOperations: list(`
    read users
  `),

  mongoDB: list(`
    read users
  `),

  mySQL: list(`

  `),
}


export default operables


function list(multiline) {
  return multiline.split(/\n */g).filter(line => line.trim())
}
import { Modal } from '/Modal.js'

const fillcb = (modal, { msg, options, handler }) => {
  const [header, buttonsDiv] = modal.querySelectorAll('h3, .buttons')

  header.innerHTML = msg

  buttonsDiv.innerHTML = options.map(option => {
    const format = Array.isArray(option)? 'array' : typeof option
    const conditional = format!='string' && (option.hasOwnProperty('if') ||format=='array' && (option.length==3 || typeof option[0] != 'string'))
    const show = conditional? format=='array'? option.shift() : option.if : 1
    if (!show) return '<u hidden></u>'
    return `<button>${format=='array'? option[0] :
      format=='object'? option.label : option}</button>`
  }).join('')

  choiceModal.onshow = modal => {
    const buttonsDiv = modal.querySelector('.buttons')
    buttonsDiv.onclick = e => {
      if (e.target == buttonsDiv) return

      if (handler([...buttonsDiv.children].indexOf(e.target)))
        choiceModal.hide()
    }
  }
}

const width = 500,  left = innerWidth/2 - width/2,  top = innerHeight/3.5

const choiceModal = new Modal('resolveByHand/resolveByHand.htm',
  {inDOMwhenHidden: false, hideOnGlassClick: false, fillcb, top, left, width})

export default function resolveByHand(msg, options, specialWidth) {
  if (specialWidth) choiceModal.updatePosition({width: specialWidth})
  return new Promise(resolve => {
    const handler = i => {
      const option = options[i]
      const value = Array.isArray(option)? option[1] :
        typeof option == 'object'? option.value : undefined

      if (typeof value == 'function') {
        if (option.secure) {
          setTimeout(() => value(prompt('Enter permission key:')))
        } else  setTimeout(value)
        resolve(null)

        if (specialWidth) choiceModal.updatePosition({width})
        return true
      }
      if (value !== undefined || option.length>1 && Array.isArray(option) ||
        typeof option == 'object' && !Array.isArray(option)) {
        if (option.secure) {
          resolve({value, permissionKey: prompt('Enter permission key:')})
        } else  resolve(value)

        if (specialWidth) choiceModal.updatePosition({width})
        return true
      }
    }
    choiceModal.fill({ msg, options, handler })
    choiceModal.show()
  })
}

resolveByHand.modal = choiceModal
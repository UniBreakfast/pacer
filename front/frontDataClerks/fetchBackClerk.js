const {stringify} = JSON

export default function operate(action, subject, data, credentials) {
  return fetch(`/api/${action}/${subject}`, {
    method: 'POST', body: stringify({data, credentials})
  }).then(resp => resp.json())
}

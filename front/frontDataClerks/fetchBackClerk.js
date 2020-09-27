const {stringify} = JSON

export default async function operate(action, subject, data, credentials) {
  const response = await fetch(`/api/${action}/${subject}`, {
    method: 'POST', body: stringify({data, credentials})
  })

  if (response.ok) return await response.json()
  else throw await response.json()
}

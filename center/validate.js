export default function validate(values, requirements) {
  requirements = {...requirements}
  const issues = []

  for (const field in requirements) {
    if (!values.hasOwnProperty(field) || typeof values[field] != 'string') {
      issues.push({field, issue: 'required'})
      continue
    }

    const value = values[field]

    if (!Array.isArray(requirements[field])) {
      requirements[field] = [requirements[field]]
    }

    requirements[field].forEach(rule => {
      const {is, has, match, not, isNot, hasNo, issue} = rule
      if (is && !is.test(value)) return issues.push({field, issue})
      if (has && !has.test(value)) return issues.push({field, issue})
      if (match && !match.test(value)) return issues.push({field, issue})
      if (not && not.test(value)) return issues.push({field, issue})
      if (isNot && isNot.test(value)) return issues.push({field, issue})
      if (hasNo && hasNo.test(value)) return issues.push({field, issue})
    })
  }

  for (const field in values) {
    if (!requirements.hasOwnProperty(field)) {
      issues.push({field, issue: 'unexpected'})
    }
  }

  return issues.length && issues
}

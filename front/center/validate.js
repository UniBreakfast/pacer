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
      const {is, has, match, not, isNot, hasNo,
        condition, conditions, isValid, issue} = rule
      if (conditions && conditions.some(condition => !condition.test(value)) ||
        condition && !condition.test(value))  return
      if (isValid && !isValid(value) || is && !is.test(value) ||
        has && !has.test(value) || match && !match.test(value) ||
        not && not.test(value) || isNot && isNot.test(value) ||
        hasNo && hasNo.test(value))  return issues.push({field, issue})
    })
  }

  for (const field in values) {
    if (!requirements.hasOwnProperty(field)) {
      issues.push({field, issue: 'unexpected'})
    }
  }

  return issues.length && issues
}

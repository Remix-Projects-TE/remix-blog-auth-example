export function buildValidationErrorFields(err) {
  return err?.inner.reduce((acc, curr) => {
    const fieldName = curr['path']
    const fieldErrors = curr['errors']
    const value = acc[fieldName]
      ? [...acc[fieldName], ...fieldErrors]
      : [...fieldErrors]
    acc[fieldName] = value
    return acc
  }, {})
}

export function getErrorMessage(error) {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return 'Unknown Error'
}

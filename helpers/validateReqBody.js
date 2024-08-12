module.exports.validate = (data, rules) => {
    let errors = []

    //validate each field
    for (const field in rules) {
        const value = data[field]
        const rule = rules[field]

        if (rule.required && (!value || value.trim().length === 0)) {
            errors.push(`${field} is required`)
        }

        if (rule.minLength && value && value.length < rule.minLength) {
            errors.push(`${field} must be at least ${rule.minLength} characters long`)
        }

        if (rule.maxLength && value && value.length > rule.maxLength) {
            errors.push(`${field} must be less than ${rule.maxLength} characters long`)
        }

        if (rule.regex && value && !rule.regex.test(value)) {
            errors.push(`${field} is invalid`)
        }
    }

    return errors
}

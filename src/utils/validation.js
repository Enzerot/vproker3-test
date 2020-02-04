// Validation functions return errors or null

const validateLogin = value => {
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[a-zа-яё0-9-_]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, цифры, - и _'
    }
    return null
}

const validatePassword = value => {
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[a-z0-9]+$/i.test(value))) {
        return 'Это поле может содержать только латинские символы и цифры'
    }
    return null
}

const validatePhoneNumber = value => {
    if (!value) { // Field is not required so if it's empty all's right
        return null
    }
    if (value.length < 10 || value.length > 14) {
        return 'Это поле должно содержать от 10 до 14 символов'
    }
    if (!(/^[- _():=+0-9\s]+$/i.test(value))) {
        return 'Это поле может содержать только цифры, пробелы, +, -, _, (, ), : и ='
    }
    return null
}

const validateClientName = value => {
    if (!value) {
        return null
    }
    if (!(/^[a-zа-яё\s]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, а так же пробелы'
    }
    return null
}

const validatePassport = value => {
    if (!value) {
        return null
    }
    if (!(/^[0-9\s]+$/.test(value))) {
        return 'Это поле может содержать только цифры и пробелы'
    }
    return null
}

const validateContractNumber = value => {
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[0-9]+$/.test(value))) {
        return 'Это поле может содержать только цифры'
    }
    return null
}

const validatePledge = value => {
    value = String(value)
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[0-9.]+$/.test(value))) {
        return 'Это поле может содержать только цифры'
    }
    return null
}

const validateDescription = value => {
    if (!value) {
        return null
    }
    if (!(/^[a-zа-яё0-9\s+-._,!?"<>:]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, цифры, пробелы, !, ?, <, >, +, -, _, ., :, " и ,'
    }
    return null
}

const validateMaterials = value => {
    if (!value) {
        return null
    }
    if (!(/^[a-zа-яё0-9\s+-._,!?"]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, цифры, пробелы, !, ?, +, -, _, ., " и ,'
    }
    return null
}

const validatePrice = value => {
    value = String(value)
    if (!value) {
        return null
    }
    if (!(/^[0-9.]+$/.test(value))) {
        return 'Это поле может содержать только цифры'
    }
    return null
}

const validateEngineHours = value => {
    value = String(value)
    if (!value) {
        return null
    }
    if (!(/^[0-9.]+$/.test(value))) {
        return 'Это поле может содержать только цифры'
    }
    return null
}

const validateName = value => {
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[a-zа-яё\s]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, а так же пробелы'
    }
    return null
}

const validateToolName = value => {
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[a-zа-яё0-9\s-_.,+:]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, цифры, пробелы, -, +, :, _, . и ,'
    }
    return null
}

const validateDiscountName = value => {
    if (!value.length) {
        return 'Это поле не может быть пустым'
    }
    if (!(/^[a-zа-яё0-9\s-_.,+:]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, цифры, пробелы, -, +, :, _, . и ,'
    }
    return null
}

const validateInventoryNumber = value => {
    if (!value) {
        return null
    }
    if (!(/^[0-9]+$/.test(value))) {
        return 'Это поле может содержать только цифры'
    }
    return null
}

const validateCategories = value => {
    if (!value) {
        return null
    }
    if (!(/^[a-zа-яё0-9\s,]+$/i.test(value))) {
        return 'Это поле может содержать только латинские и кириллические символы, цифры, пробелы и ,'
    }
    return null
}

const validateDiscount = value => {
    value = String(value)
    if (!value) {
        return null
    }
    if (value.length > 2) return 'Процент не может быть больше 100'
    if (!(/^[0-9.]+$/.test(value))) {
        return 'Это поле может содержать только цифры'
    }
    return null
}

export default {
    validateLogin,
    validatePassword,
    validatePhoneNumber,
    validateClientName,
    validatePassport,
    validateContractNumber,
    validatePledge,
    validateDescription,
    validateMaterials,
    validatePrice,
    validateEngineHours,
    validateName,
    validateToolName,
    validateDiscountName,
    validateInventoryNumber,
    validateCategories,
    validateDiscount,
}
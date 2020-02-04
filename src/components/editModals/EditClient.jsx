import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import Select from 'react-select'
import api from 'api'
import DateTimePicker from 'components/common/DateTimePicker'
import debounce from 'debounce-promise'
import validation from 'utils/validation'

const debouncedValidation = debounce(value => 
    api.validatePassport(value)
, 700)
const debouncedGetClientInfoByPhoneNumber = debounce(value => 
    api.getClientInfoByPhoneNumber(value)
, 700)

export default class EditClient extends React.Component {
    state = {
        discount: this.props.client.discount ? this.props.client.discount.id : null,
        name: this.props.client.name,
        nameError: null,
        phoneNumber: this.props.client.phoneNumber,
        phoneNumberError: null,
        passport: this.props.client.passport,
        passportError: null,
        birthDate: this.props.client.birthDate,
        description: this.props.client.description,
        descriptionError: null,
        
        discounts: [],
    }

    componentDidMount() {
        this.downloadDiscountsList()
    }

    handleChangeDiscount = option =>
        this.setState({ discount: option.value })
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateName(e.target.value) })
    handleChangePhoneNumber = e => {
        debouncedGetClientInfoByPhoneNumber(e.target.value)
            .then(res => res.data && res.data.name !== this.state.name && this.setState({ phoneNumberError: 'Уже есть клиент с таким номером телефона' }))
            .catch(error => console.log(error))
        this.setState({ phoneNumber: e.target.value, phoneNumberError: validation.validatePhoneNumber(e.target.value) })
    }
    handleChangePassport = e => {
        const passportError = validation.validatePassport(e.target.value)
        this.setState({ passport: e.target.value, passportError })
        if (!passportError) {
            debouncedValidation(e.target.value)
                .then(res =>
                    res.data && this.setState({ passportError: res.data }))
                .catch(error => console.error(error))
        }
    }
    handleChangeBirthDate = value =>
        this.setState({birthDate: value})
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })

    downloadDiscountsList = () =>
        api.getDiscountModels()
            .then(res => this.setState({ discounts: res.data }))
            .catch(error => console.error(error))
        
    submit = () => {
        const {
            discount,
            name,
            phoneNumber,
            passport,
            birthDate,
            description
        } = this.state

        api.editClient({
            _id: this.props.client._id,
            discount,
            name,
            phoneNumber,
            passport,
            birthDate,
            description,
        }).then(res => {
            this.props.editClient(res.data)
        }).catch(error =>
            console.log(error))
    }

    render() {
        const {
            discounts,
            name,
            phoneNumber,
            passport,
            passportError,
            birthDate,
            description,
            nameError,
            phoneNumberError,
            descriptionError,
        } = this.state

        return (
            <form className='edit'>
                <TextField
                    value={ name }
                    onChange={ this.handleChangeName }
                    required
                    label='ФИО'
                    helperText={ nameError }
                    error={ !!nameError }
                />
                <TextField
                    value={ phoneNumber }
                    onChange={ this.handleChangePhoneNumber }
                    type='tel'
                    label='Телефон'
                    helperText={ phoneNumberError }
                    error={ !!phoneNumberError }
                />
                <TextField
                    value={ passport }
                    onChange={ this.handleChangePassport }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Паспорт'
                    passportError={ passportError }
                    error={ passportError === 'Паспорт недействителен' }
                />
                <DateTimePicker 
                    value={ birthDate }
                    onChange={ this.handleChangeBirthDate }
                    label='Дата рождения'
                    onlyDate
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    multiline
                    label='Примечания'
                    helperText={descriptionError}
                    error={!!descriptionError}
                />
                <Select
                    placeholder='Источник привлечения'
                    options={ discounts.map(item => ({ value: item.id, label: item.name })) }
                    onChange={ this.handleChangeDiscount }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких источников'}
                    defaultValue={this.props.client.discount ? {
                        value: this.props.client.discount._id, 
                        label: this.props.client.discount.name,
                    } : null}
                />
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={ 
                        nameError || 
                        phoneNumberError || 
                        passportError === 'Паспорт недействителен' || 
                        descriptionError || 
                        !name ||
                        !passport
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
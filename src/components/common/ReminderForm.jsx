import React from 'react'
import { TextField, Button } from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'
import debounce from 'debounce-promise'

const debouncedGetClientInfoByPhoneNumber = debounce(
    phoneNumber => api.getClientInfoByPhoneNumber(phoneNumber),
    700
)

export default class ReminderForm extends React.Component {
    state = {
        clients: [],
        client: this.props.type === 'order' ? this.props.order.remindTo && (this.props.order.remindTo._id || '') : this.props.maintain.remindTo && (this.props.maintain.remindTo._id || ''),
        isClientInBlackList: false,
        phoneNumber: this.props.type === 'order' ? this.props.order.remindTo && (this.props.order.remindTo.phoneNumber || '') : this.props.maintain.remindTo && (this.props.maintain.remindTo.phoneNumber || ''),
        phoneNumberError: '',
        clientName: this.props.type === 'order' ? this.props.order.remindTo && (this.props.order.remindTo.name || '') : this.props.maintain.remindTo && (this.props.maintain.remindTo.name || ''),
        clientNameError: null,
        clientOrders: '',
        description: this.props.type === 'order' ? this.props.order.remindTo && (this.props.order.remindTo.description || '') : this.props.maintain.remindTo && (this.props.maintain.remindTo.description || ''),
        descriptionError: null,
    }

    handleChangePhoneNumber = e => {
        debouncedGetClientInfoByPhoneNumber(e.target.value)
            .then(res => {
                if (res.data) {
                    this.setState({
                        client: res.data._id,
                        phoneNumberError: null,
                        clientName: res.data.name,
                        clientNameError: null,
                        clientOrders: `Всего заказов: ${res.data.allOrders}. Активных: ${res.data.activeOrders}`,
                        isClientInBlackList: res.data.isClientInBlackList,
                    })
                } else {
                    this.setState({
                        client: null,
                        phoneNumberError: validation.validatePhoneNumber(e.target.value),
                        isClientInBlackList: false,
                    })
                }
            })
            .catch(error => console.error(error))
        this.setState({ phoneNumber: e.target.value, clientOrders: '' })
    }
    handleChangeClientName = e =>
        this.setState({
            clientName: e.target.value,
            clientNameError: validation.validateClientName(e.target.value)
        })
    handleChangeDescription = e => 
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })

    submit = () => {
        const {
            clientName,
            phoneNumber,
            description,
        } = this.state

        this.props.type === 'order' ? api.editOrder({
            _id: this.props.order._id,
            remindTo: {
                name: clientName,
                phoneNumber,
                description,
            },
        }).then(res =>
            this.props.addReminder((item => {
                let toolsString = ''
                item.tools.forEach(i => toolsString += i.name + ', ')
                toolsString = toolsString.slice(0, -2)
                return {
                    ...item,
                    toolsName: toolsString,
                    clientName: item.client ? item.client.name : '',
                    phoneNumber: item.client ? item.client.phoneNumber : '',
                }
            })(res.data))
        ).catch(error => console.log(error)) : api.editMaintain({
            _id: this.props.maintain._id,
            remindTo: {
                name: clientName,
                phoneNumber,
                description,
            },
        }).then(res =>
            this.props.addReminder(({
                ...res.data,
                clientName: res.data.client ? res.data.client.name : '',
                phoneNumber: res.data.client ? res.data.client.phoneNumber : '',
            }))
        ).catch(error => console.log(error))
    }
    
    render() {
        const {
            clientName,
            clientNameError,
            clientOrders,
            phoneNumber,
            phoneNumberError,
            isClientInBlackList,
            description,
            descriptionError,
        } = this.state

        return (
            <form className='edit'>
                {clientOrders}
                <TextField
                    value={ phoneNumber }
                    onChange={ this.handleChangePhoneNumber }
                    error={ !!phoneNumberError }
                    helperText={ phoneNumberError }
                    label='Номер телефона'
                />
                <TextField
                    value={ clientName }
                    onChange={ this.handleChangeClientName }
                    error={ !!clientNameError }
                    helperText={ clientNameError }
                    label='ФИО'
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    error={ !!descriptionError }
                    helperText={ descriptionError }
                    multiline
                    label='Примечания'
                />
                {isClientInBlackList && <span className='blacklist'>Клиент находится в чёрном списке!</span>}
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={
                        phoneNumberError ||
                        clientNameError ||
                        isClientInBlackList
                    }
                    variant='outlined'
                >Добавить</Button>
            </form>
        )
    }
}
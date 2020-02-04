import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import DateTimePicker from 'components/common/DateTimePicker'
import Select from 'react-select'
import validation from 'utils/validation'
import LoadingButton from 'components/common/LoadingButton'
import ConsumableSelect from 'components/common/ConsumableSelect'
import ToolInfo from 'components/common/ToolInfo'
import { roundDate } from 'utils'
import debounce from 'debounce-promise'
import { DateTime } from 'luxon'

const debouncedGetClientInfoByPhoneNumber = debounce(
    phoneNumber => api.getClientInfoByPhoneNumber(phoneNumber),
    700
)

export default class CreateOrders extends React.Component {
    state = {
        tools: null,
        inventoryNumbers: [],
        activeTool: null,
        rigs: null,
        consumables: [{ amount: 1, consumable: { name: '', _id: '' } }],
        discount: null,
        contractNumber: '',
        contractNumberError: null,
        paidPledge: '',
        paidPledgeError: null,
        description: '',
        descriptionError: null,
        client: null,
        phoneNumber: '',
        phoneNumberError: '',
        clientName: '',
        clientNameError: null,
        passport: '',
        passportError: '',
        clientOrders: '',
        isClientInBlackList: false,
        startDate: (roundDate(new Date())).toString(),
        birthDate: null,
        isDebtChecked: false,
        hasClientDebt: null,
        isDebtLoading: false,
        debtError: '',

        toolModels: [],
        rigModels: [],
        consumableModels: [],
        discounts: [],
    }

    componentDidMount() {
        this.downloadToolsList()
        this.downloadDiscountsList()
        this.downloadRigsList()
        this.downloadConsumablesList()
        this.getContractNumber()
    }

    handleChangeTool = option => {
        this.setState({
            tools: option,
            activeTool: option && option.length && option[option.length - 1].tool,
            paidPledge: option && option.length && option.reduce((sum, item) => sum + item.tool.pledge, 0),
            inventoryNumbers: (option && Array(option.length).fill().map((item, index) => option[index].tool.inventoryNumber || this.state.inventoryNumbers[index])) || []
        })
    }
    handleChangeInventoryNumber = (id, e) => {
        let arr = [...this.state.inventoryNumbers]
        arr[id] = e.target.value
        this.setState({ inventoryNumbers: arr })
    }
    handleChangeRig = option =>
        this.setState({ rigs: option && option.map(item => item.value) })
    handleChangeConsumable = (id, option) => {
        this.setState({ consumables: this.state.consumables.map((item, index) => {
                if (index === id) {
                    return { ...item, consumable: { name: option && option.label, _id: option && option.value } }
                }
                return item
            })
        })
    }
    handleChangeAmount = (id, amount) => {
        this.setState({ consumables: this.state.consumables.map((item, index) => {
                if (index === id) {
                    return { ...item, amount }
                }
                return item
            })
        })
    }
    handleChangeDiscount = option =>
        this.setState({ discount: option.value })
    handleChangePhoneNumber = e => {
        debouncedGetClientInfoByPhoneNumber(e.target.value)
            .then(res => {
                if (res.data) {
                    this.setState({
                        client: { id: res.data._id, ...res.data },
                        phoneNumberError: null,
                        clientName: res.data.name,
                        clientNameError: null,
                        passport: res.data.passport,
                        clientOrders: `Всего заказов: ${res.data.allOrders}. Активных: ${res.data.activeOrders}`,
                        isClientInBlackList: res.data.isClientInBlackList,
                        birthDate: res.data.birthDate,
                    })
                    res.data.passport && api.validatePassport(res.data.passport)
                        .then(res => res.data && this.setState({ passportError: res.data }))
                        .catch(error => console.error(error))
                } else {
                    this.setState({
                        client: null,
                        isClientInBlackList: false,
                    })
                }
            })
            .catch(error => console.error(error))
        this.setState({ phoneNumber: e.target.value, phoneNumberError: validation.validatePhoneNumber(e.target.value), clientOrders: '' })
    }
    handleChangeClientName = e =>
        this.setState({
            clientName: e.target.value,
            clientNameError: validation.validateClientName(e.target.value)
        })
    handleChangePassport = e => {
        api.validatePassport(e.target.value)	
            .then(res => res.data && this.setState({ passportError: res.data }))	
            .catch(error => console.error(error))
        this.setState({
            passport: e.target.value,
            passportError: validation.validatePassport(e.target.value)
        })
    }
    handleChangeContractNumber = e => 
        this.setState({ contractNumber: e.target.value, contractNumberError: validation.validateContractNumber(e.target.value) })
    handleChangePaidPledge = e => 
        this.setState({ paidPledge: e.target.value, paidPledgeError: validation.validatePledge(e.target.value) })
    handleChangeDescription = e => 
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    handleChangeStartDate = value => 
        this.setState({ startDate: value })
    handleChangeBirthDate = value =>
        this.setState({ birthDate: value, isDebtChecked: false })
    submit = () => {
        const { 
            tools,
            inventoryNumbers,
            rigs,
            consumables,
            discount,
            client,
            contractNumber,
            paidPledge,
            description,
            startDate,
            clientName,
            phoneNumber,
            passport,
            birthDate,
        } = this.state

        inventoryNumbers.forEach((item, index) => {
            if (tools[index] && tools[index].tool && item !== tools[index].tool.inventoryNumber) {
                api.editInventoryNumber(tools[index].value, item)
                    .catch(error => console.error(error))
            }
        })
        if (!(client && client.id) && clientName && passport) {
            api.postClient({
                discount,
                name: clientName,
                phoneNumber,
                passport,
                birthDate,
                activeOrders: 0,
                allOrders: 0,
                createdAt: (new Date()).toString()
            }).then(res => {
                api.postOrder({
                    tools: tools.map(item => item.value),
                    inventoryNumbers: inventoryNumbers.map(item => parseInt(item)),
                    rigs,
                    consumables: consumables.filter(item => item.consumable._id),
                    client: res.data._id,
                    contractNumber,
                    description,
                    paidPledge: parseFloat(paidPledge),
                    startDate
                }).then(res =>
                    this.props.addOrder((item => {
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
                ).catch(error => console.log(error))
            }).catch(error => console.log(error))
        } else if (!(client && client.id)) {
            api.postOrder({
                tools: tools.map(item => item.value),
                inventoryNumbers: inventoryNumbers.map(item => parseInt(item)),
                rigs,
                consumables: consumables.filter(item => item.consumable._id),
                client: null,
                contractNumber,
                description,
                paidPledge: parseFloat(paidPledge),
                startDate
            }).then(res =>
                this.props.addOrder((item => {
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
            ).catch(error => console.log(error))
        } else if (client && client.id && (client.name !== clientName || client.passport !== passport || client.discount !== discount)) {
            api.editClient({
                _id: client.id,
                discount,
                name: clientName,
                phoneNumber,
                passport,
                birthDate,
                activeOrders: 0,
                allOrders: 0,
                createdAt: (new Date()).toString()
            }).then(res => {
                api.postOrder({
                    tools: tools.map(item => item.value),
                    inventoryNumbers: inventoryNumbers.map(item => parseInt(item)),
                    rigs,
                    consumables: consumables.filter(item => item.consumable._id),
                    client: res.data._id,
                    contractNumber,
                    description,
                    paidPledge: parseFloat(paidPledge),
                    startDate
                }).then(res =>
                    this.props.addOrder((item => {
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
                ).catch(error => console.log(error))
            }).catch(error => console.log(error))
        } else {
            api.postOrder({
                tools: tools.map(item => item.value),
                inventoryNumbers: inventoryNumbers.map(item => parseInt(item)),
                rigs,
                consumables: consumables.filter(item => item.consumable._id),
                client: client.id,
                contractNumber,
                description,
                paidPledge: parseFloat(paidPledge),
                startDate
            }).then(res =>
                this.props.addOrder((item => {
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
            ).catch(error => console.log(error))
        }
    }

    downloadToolsList = () =>
        api.getDetailToolModels()
            .then(res => this.setState({ toolModels: res.data.sort((a, b) => a.name > b.name ? 1 : -1) }))
            .catch(error => console.error(error))

    downloadRigsList = () =>
        api.getRigModels()
            .then(res => this.setState({ rigModels: res.data }))
            .catch(error => console.error(error))

    downloadConsumablesList = () =>
        api.getConsumableModels()
            .then(res => this.setState({ consumableModels: res.data }))
            .catch(error => console.error(error))

    downloadDiscountsList = () =>
        api.getDiscountModels()
            .then(res => this.setState({ discounts: res.data }))
            .catch(error => console.error(error))

    getContractNumber = () =>
        api.getContractNumber()
            .then(res => this.setState({ contractNumber: res.data }))
            .catch(error => console.error(error))

    checkDebt = () => {
        this.setState({ isDebtLoading: true, debtError: null, hasClientDebt: null, isDebtChecked: false })
        api.checkDebt(this.state.clientName, this.state.passport, DateTime.fromJSDate(new Date(this.state.birthDate)).toFormat('dd.MM.yyyy'))
            .then(res =>
                this.setState({ isDebtChecked: true, hasClientDebt: res.data, isDebtLoading: false }))
            .catch(error => {
                console.error(error)
                this.setState({ isDebtLoading: false, debtError: 'Ошибка!' })
            })
    }

    addConsumableSelect = () => {
        const { consumables } = this.state
        this.setState({
            consumables: [...consumables, { amount: 1, consumable: { name: '', _id: '' } }]
        })
    }

    print = () => {
        const { contractNumber, clientName, phoneNumber, inventoryNumbers, startDate, passport, tools } = this.state
        const toolsArr = tools && tools.length && tools.map(item => ({
            name: item.tool.name,
            price: item.tool.price || '',
            dayPrice: item.tool.dayPrice,
            workShiftPrice: item.tool.workShiftPrice,
            pledge: item.tool.pledge,
        }))
        window.open('https://docs.google.com/gview?url=' + encodeURIComponent(`https://vproker3-server.herokuapp.com/api/contract?contractNumber=${contractNumber}&clientName=${clientName}&phoneNumber=${phoneNumber}&date=${startDate}&passport=${passport}&tools=${JSON.stringify(toolsArr)}&inventoryNumbers=${JSON.stringify(inventoryNumbers)}`))
    }

    render() {
        const {
            tools,
            inventoryNumbers,
            toolModels,
            activeTool,
            rigModels,
            consumableModels,
            consumables,
            discounts,
            contractNumber,
            contractNumberError,
            paidPledge,
            paidPledgeError,
            description,
            descriptionError,
            startDate,
            clientName,
            clientNameError,
            client,
            clientOrders,
            phoneNumber,
            phoneNumberError,
            passport,
            passportError,
            isDebtChecked,
            hasClientDebt,
            birthDate,
            isDebtLoading,
            isClientInBlackList,
            debtError,
        } = this.state

        return (
            <form className='create'>
                <Select
                    placeholder='Выберите инструмент'
                    options={ tools && tools.length > 2 ? [] : toolModels.map(item => ({ value: item.id, label: item.name, tool: item })) }
                    isMulti
                    onChange={ this.handleChangeTool }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких инструментов'}
                />
                {activeTool && <ToolInfo tool={activeTool} />}
                {tools && tools.length && tools.map((item, index) => (
                    this.props.role === 'admin' ? <TextField
                        key={index}
                        value={ inventoryNumbers[index] }
                        onChange={ e => this.handleChangeInventoryNumber(index, e) }
                        type='number'
                        className={index === tools.length - 1 ? 'no-margin last' : 'no-margin'}
                        inputProps={{
                            min: 0
                        }}
                        label='Инвентарный номер'
                        InputLabelProps={{
                            shrink: true,
                        }}
                    /> : <span>Инвентарный номер: {inventoryNumbers[index] || '-'}</span>
                ))}
                <Select
                    placeholder='Выберите оснастку'
                    options={ rigModels.map(item => ({ value: item.id, label: item.name })) }
                    isMulti
                    onChange={ this.handleChangeRig }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет такой оснастки'}
                />
                {consumables.map((item, index) => (
                    <ConsumableSelect
                        onChangeConsumable={ this.handleChangeConsumable }
                        onChangeAmount={ this.handleChangeAmount }
                        addConsumableSelect={ this.addConsumableSelect }
                        models={ consumableModels }
                        key={ index }
                        id={ index }
                        value={ item }
                        isButtonDisplaying={ index === consumables.length - 1 }
                    />
                ))}
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
                    value={ passport }
                    onChange={ this.handleChangePassport }
                    label='Паспорт'
                />
                <span className={passportError === 'Всё в порядке' ? 'ok' : 'error'} >{passportError}</span>
                <DateTimePicker
                    value={ birthDate }
                    onChange={ this.handleChangeBirthDate }
                    label='Дата рождения'
                    onlyDate
                />
                <LoadingButton 
                    isLoading={isDebtLoading}
                    onClick={ this.checkDebt }
                    color='secondary'
                    disabled={
                        clientNameError ||
                        !clientName ||
                        !passport ||
                        !birthDate
                    }
                    fullWidth
                >Проверить на долги</LoadingButton>
                {!!debtError &&
                    <span className='debt true'>{debtError}</span>
                }
                {isDebtChecked && (hasClientDebt ?
                    <span className='debt true'>У клиента есть задолженность</span> :
                    <span className='debt'>У клиента нет задолженности</span>)
                }
                {isClientInBlackList && <span className='blacklist'>Клиент находится в чёрном списке!</span>}
                <TextField
                    value={ contractNumber }
                    onChange={ this.handleChangeContractNumber }
                    error={ !!contractNumberError }
                    helperText={ contractNumberError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    required
                    label='Номер договора'
                />
                <TextField
                    value={ paidPledge }
                    onChange={ this.handleChangePaidPledge }
                    error={ !!paidPledgeError }
                    helperText={ paidPledgeError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    required
                    label='Залог'
                />
                <DateTimePicker 
                    value={ startDate }
                    onChange={ this.handleChangeStartDate }
                    label='Дата начала'
                />
                <Select
                    placeholder='Источник привлечения'
                    options={ discounts.map(item => ({ value: item.id, label: item.name })) }
                    onChange={ this.handleChangeDiscount }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких источников'}
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    error={ !!descriptionError }
                    helperText={ descriptionError }
                    multiline
                    label='Примечания'
                />
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={ 
                        contractNumberError ||
                        paidPledgeError ||
                        descriptionError ||
                        phoneNumberError ||
                        clientNameError ||
                        passportError !== 'Всё в порядке' ||
                        !contractNumber ||
                        (client && !passport) ||
                        !paidPledge ||
                        isClientInBlackList
                    }
                    variant='outlined'
                >Создать</Button>
                <Button 
                    onClick={ this.print }
                    color='secondary'
                    variant='outlined'
                >Печатать</Button>
            </form>
        )
    }
}
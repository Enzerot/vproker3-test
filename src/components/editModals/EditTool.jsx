import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import DateTimePicker from 'components/common/DateTimePicker'
import validation from 'utils/validation'

export default class EditTool extends React.Component {
    state = {
        name: this.props.tool.name,
        nameError: null,
        count: this.props.tool.count,
        countError: null,
        description: this.props.tool.description,
        descriptionError: null,
        inventoryNumber: this.props.tool.inventoryNumber,
        inventoryNumberError: null,
        purchased: this.props.tool.purchased,
        category: this.props.tool.category,
        categoryError: null,
        price: this.props.tool.price,
        priceError: null,
        pledge: this.props.tool.pledge,
        pledgeError: null,
        dayPrice: this.props.tool.dayPrice,
        dayPriceError: null,
        workShiftPrice: this.props.tool.workShiftPrice,
        workShiftPriceError: null,
        hourPrice: this.props.tool.hourPrice,
        hourPriceError: null,
        serialNumbers: this.props.tool.serialNumbers || [],
    }

    componentDidMount() {
        !this.state.inventoryNumber && api.getLastInventoryNumber()
            .then(res => this.setState({ inventoryNumber: res.data }))
            .catch(error => console.error(error))
    }
    
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateToolName(e.target.value) })
    handleChangeCount = e => {
        this.setState({ count: e.target.value, countError: validation.validatePrice(e.target.value), serialNumbers: Array(parseInt(e.target.value)).fill().map((item, index) => this.state.serialNumbers[index] ? this.state.serialNumbers[index] : null) })}
    handleChangeSerialNumber = (index, e) =>
        this.setState({ serialNumbers: this.state.serialNumbers.map((item, i) => index === i ? e.target.value : item) })
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    handleChangeInventoryNumber = e =>
        this.setState({ inventoryNumber: e.target.value, inventoryNumberError: validation.validateInventoryNumber(e.target.value) })
    handleChangePurchased = value =>
        this.setState({ purchased: value })
    handleChangeCategory = e =>
        this.setState({ category: e.target.value, categoryError: validation.validateCategories(e.target.value) })
    handleChangePrice = e =>
        this.setState({ price: e.target.value, priceError: validation.validatePrice(e.target.value) })
    handleChangePledge = e =>
        this.setState({ pledge: e.target.value, pledgeError: validation.validatePledge(e.target.value) })
    handleChangeDayPrice = e =>
        this.setState({ dayPrice: e.target.value, dayPriceError: validation.validatePrice(e.target.value) })
    handleChangeWorkShiftPrice = e =>
        this.setState({ workShiftPrice: e.target.value, workShiftPriceError: validation.validatePrice(e.target.value) })
    handleChangeHourPrice = e =>
        this.setState({ hourPrice: e.target.value, hourPriceError: validation.validatePrice(e.target.value) })
    submit = () => {
        const {
            name,
            description,
            inventoryNumber,
            purchased,
            category,
            price,
            pledge,
            dayPrice,
            workShiftPrice,
            hourPrice,
            count,
            serialNumbers,
        } = this.state

        api.editTool({
            _id: this.props.tool._id,
            name,
            description,
            inventoryNumber: parseInt(inventoryNumber),
            purchased,
            category,
            price: parseFloat(price),
            pledge: parseFloat(pledge),
            dayPrice: parseFloat(dayPrice),
            workShiftPrice: parseFloat(workShiftPrice),
            hourPrice: parseFloat(hourPrice),
            count: parseInt(count),
            serialNumbers: serialNumbers.map(item => parseInt(item)),
        }).then(res => {
            this.props.editTool(res.data)
        }).catch(error =>
            console.error(error))
    }

    render() {
        const {
            name,
            nameError,
            description,
            descriptionError,
            inventoryNumber,
            inventoryNumberError,
            purchased,
            category,
            categoryError,
            price,
            priceError,
            pledge,
            pledgeError,
            dayPrice,
            dayPriceError,
            workShiftPrice,
            workShiftPriceError,
            hourPrice,
            hourPriceError,
            count,
            countError,
            serialNumbers,
        } = this.state

        return (
            <form className='edit'>
                <TextField
                    value={ name }
                    onChange={ this.handleChangeName }
                    error={ !!nameError }
                    helperText={ nameError }
                    required
                    label='Наименование'
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    error={ !!descriptionError }
                    helperText={ descriptionError }
                    label='Описание'
                />
                <TextField
                    value={ inventoryNumber }
                    onChange={ this.handleChangeInventoryNumber }
                    error={ !!inventoryNumberError }
                    helperText={ inventoryNumberError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Инвентарный номер'
                />
                <DateTimePicker 
                    value={ purchased }
                    onChange={ this.handleChangePurchased }
                    label='Дата приобретения'
                />
                <TextField
                    value={ category }
                    onChange={ this.handleChangeCategory }
                    error={ !!categoryError }
                    helperText={ categoryError }
                    multiline
                    label='Категории'
                />
                <TextField
                    value={ price }
                    onChange={ this.handleChangePrice }
                    error={ !!priceError }
                    helperText={ priceError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Цена'
                />
                <TextField
                    value={ pledge }
                    onChange={ this.handleChangePledge }
                    error={ !!pledgeError }
                    helperText={ pledgeError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    required
                    label='Залог'
                />
                <TextField
                    value={ dayPrice }
                    onChange={ this.handleChangeDayPrice }
                    error={ !!dayPriceError }
                    helperText={ dayPriceError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='За сутки'
                />
                <TextField
                    value={ workShiftPrice }
                    onChange={ this.handleChangeWorkShiftPrice }
                    error={ !!workShiftPriceError }
                    helperText={ workShiftPriceError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='За смену'
                />
                <TextField
                    value={ hourPrice }
                    onChange={ this.handleChangeHourPrice }
                    error={ !!hourPriceError }
                    helperText={ hourPriceError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='За час'
                />
                <TextField
                    value={ count }
                    onChange={ this.handleChangeCount }
                    error={ !!countError }
                    helperText={ countError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Количество'
                />
                {count == 1 && <TextField
                    value={ inventoryNumber }
                    onChange={ this.handleChangeInventoryNumber }
                    error={ !!inventoryNumberError }
                    helperText={ inventoryNumberError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Инвентарный номер'
                />}
                {serialNumbers.map((item, index) => 
                    <TextField
                        key={ index }
                        value={ item }
                        onChange={ e => this.handleChangeSerialNumber(index, e) }
                        type='number'
                        inputProps={{
                            min: 0
                        }}
                        label='Серийный номер'
                    />
                )}
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={
                        nameError || 
                        descriptionError ||
                        inventoryNumberError ||
                        categoryError ||
                        priceError ||
                        pledgeError ||
                        dayPriceError ||
                        workShiftPriceError ||
                        hourPriceError ||
                        countError ||
                        !name ||
                        !pledge ||
                        !dayPrice ||
                        !hourPrice
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
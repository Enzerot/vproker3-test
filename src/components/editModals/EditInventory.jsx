import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'
import DateTimePicker from 'components/common/DateTimePicker'

export default class EditInventory extends React.Component {
    state = {
        number: this.props.inventory.number,
        numberError: null,
        name: this.props.inventory.name,
        nameError: null,
        serialNumber: this.props.inventory.serialNumber,
        serialNumberError: null,
        inventoryNumber: this.props.inventory.inventoryNumber,
        inventoryNumberError: null,
        purchaseDate: this.props.inventory.purchaseDate,
        purchasePrice: this.props.inventory.purchasePrice,
        purchasePriceError: null,
        residualValue: this.props.inventory.residualValue,
        residualValueError: null,
        guaranteePeriod: this.props.inventory.guaranteePeriod,
        guaranteePeriodError: null,
    }
    
    handleChangeNumber = e =>
        this.setState({ number: e.target.value, numberError: validation.validatePrice(e.target.value) })
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateToolName(e.target.value) })
    handleChangeSerialNumber = e =>
        this.setState({ serialNumber: e.target.value, serialNumberError: validation.validatePrice(e.target.value) })
    handleChangeInventoryNumber = e =>
        this.setState({ inventoryNumber: e.target.value, inventoryNumberError: validation.validatePrice(e.target.value) })
    handleChangePurchaseDate = value =>
        this.setState({ purchaseDate: value })
    handleChangePurchasePrice = e =>
        this.setState({ purchasePrice: e.target.value, purchasePriceError: validation.validatePrice(e.target.value) })
    handleChangeResidualValue = e =>
        this.setState({ residualValue: e.target.value, residualValueError: validation.validatePrice(e.target.value) })
    handleChangeGuaranteePeriod = e =>
        this.setState({ guaranteePeriod: e.target.value, guaranteePeriodError: validation.validateToolName(e.target.value) })
    submit = () => {
        const {
            number,
            name,
            serialNumber,
            inventoryNumber,
            purchaseDate,
            purchasePrice,
            residualValue,
            guaranteePeriod,
        } = this.state

        api.editInventory({
            _id: this.props.inventory._id,
            number: parseInt(number),
            name,
            serialNumber: parseInt(serialNumber),
            inventoryNumber: parseInt(inventoryNumber),
            purchaseDate,
            purchasePrice: parseFloat(purchasePrice),
            residualValue: parseFloat(residualValue),
            guaranteePeriod: parseFloat(guaranteePeriod),
        }).then(res => this.props.editInventory(res.data))
        .catch(error => console.error(error))
    }

    render() {
        const {
            number,
            numberError,
            name,
            nameError,
            serialNumber,
            serialNumberError,
            inventoryNumber,
            inventoryNumberError,
            purchaseDate,
            purchasePrice,
            purchasePriceError,
            residualValue,
            residualValueError,
            guaranteePeriod,
            guaranteePeriodError,
        } = this.state

        return (
            <form className='edit'>
                <TextField
                    value={ number }
                    onChange={ this.handleChangeNumber }
                    error={ !!numberError }
                    helperText={ numberError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Номер'
                />
                <TextField
                    value={ name }
                    onChange={ this.handleChangeName }
                    error={ !!nameError }
                    helperText={ nameError }
                    required
                    label='Наименование'
                />
                <TextField
                    value={ serialNumber }
                    onChange={ this.handleChangeSerialNumber }
                    error={ !!serialNumberError }
                    helperText={ serialNumberError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Серийный номер'
                />
                <TextField
                    value={ inventoryNumber }
                    onChange={ this.handleChangeInventoryNumber }
                    error={ !!inventoryNumberError }
                    helperText={ inventoryNumberError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Инвентарный номер'
                />
                <DateTimePicker 
                    value={ purchaseDate }
                    onChange={ this.handleChangePurchaseDate }
                    label='Дата приобретения'
                    onlyDate
                />
                <TextField
                    value={ purchasePrice }
                    onChange={ this.handleChangePurchasePrice }
                    error={ !!purchasePriceError }
                    helperText={ purchasePriceError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Стоимость приобретения'
                />
                <TextField
                    value={ residualValue }
                    onChange={ this.handleChangeResidualValue }
                    error={ !!residualValueError }
                    helperText={ residualValueError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Остаточная стоимость'
                />
                <TextField
                    value={ guaranteePeriod }
                    onChange={ this.handleChangeGuaranteePeriod }
                    error={ !!guaranteePeriodError }
                    helperText={ guaranteePeriodError }
                    type='number'
                    required
                    inputProps={{
                        min: 0
                    }}
                    label='Гарантийный период'
                />
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={
                        numberError ||
                        nameError ||
                        serialNumberError ||
                        inventoryNumberError ||
                        purchasePriceError ||
                        residualValueError ||
                        guaranteePeriodError ||
                        !name ||
                        !number ||
                        !serialNumber ||
                        !inventoryNumber ||
                        !purchaseDate ||
                        !purchasePrice ||
                        !residualValue ||
                        !guaranteePeriod
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class EditConsumable extends React.Component {
    state = {
        name: this.props.consumable.name,
        nameError: null,
        purchasePrice: this.props.consumable.purchasePrice,
        purchasePriceError: null,
        sellingPrice: this.props.consumable.sellingPrice,
        sellingPriceError: null,
        provider: this.props.consumable.provider,
        providerError: null,
        description: this.props.consumable.description,
        descriptionError: null,
    }
    
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateToolName(e.target.value) })
    handleChangePurchasePrice = e =>
        this.setState({ purchasePrice: e.target.value, purchasePriceError: validation.validatePrice(e.target.value) })
    handleChangeSellingPrice = e =>
        this.setState({ sellingPrice: e.target.value, sellingPriceError: validation.validatePrice(e.target.value) })
    handleChangeProvider = e =>
        this.setState({ provider: e.target.value, providerError: validation.validateToolName(e.target.value) })
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    submit = () => {
        const {
            name,
            purchasePrice,
            sellingPrice,
            provider,
            description,
        } = this.state

        api.editConsumable({
            _id: this.props.consumable._id,
            name,
            purchasePrice: parseFloat(purchasePrice),
            sellingPrice: parseFloat(sellingPrice),
            provider,
            description,
        }).then(res => this.props.editConsumable(res.data))
        .catch(error => console.error(error))
    }

    render() {
        const {
            name,
            nameError,
            amount,
            amountError,
            purchasePrice,
            purchasePriceError,
            sellingPrice,
            sellingPriceError,
            provider,
            providerError,
            description,
            descriptionError,
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
                    value={ amount }
                    onChange={ this.handleChangeAmount }
                    error={ !!amountError }
                    helperText={ amountError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Количество'
                />
                <TextField
                    value={ purchasePrice }
                    onChange={ this.handleChangePurchasePrice }
                    error={ !!purchasePriceError }
                    helperText={ purchasePriceError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Стоимость приобретения'
                />
                <TextField
                    value={ sellingPrice }
                    onChange={ this.handleChangeSellingPrice }
                    error={ !!sellingPriceError }
                    helperText={ sellingPriceError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Стоимость продажи'
                />
                <TextField
                    value={ provider }
                    onChange={ this.handleChangeProvider }
                    error={ !!providerError }
                    helperText={ providerError }
                    label='Поставщик'
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    error={ !!descriptionError }
                    helperText={ descriptionError }
                    label='Примечания'
                />
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={
                        nameError || 
                        purchasePriceError ||
                        amountError ||
                        sellingPriceError ||
                        providerError ||
                        descriptionError ||
                        !name
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
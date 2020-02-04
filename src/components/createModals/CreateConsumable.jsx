import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class CreateConsumable extends React.Component {
    state = {
        name: '',
        nameError: null,
        amount: '',
        amountError: null,
        purchasePrice: '',
        purchasePriceError: null,
        sellingPrice: '',
        sellingPriceError: null,
        provider: '',
        providerError: null,
        description: '',
        descriptionError: null,
    }
    
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateToolName(e.target.value) })
    handleChangeAmount = e =>
        this.setState({ amount: e.target.value, amountError: validation.validatePrice(e.target.value) })
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
            amount,
            purchasePrice,
            sellingPrice,
            provider,
            description,
        } = this.state

        api.postConsumable({
            name,
            amount,
            purchasePrice: parseFloat(purchasePrice),
            sellingPrice: parseFloat(sellingPrice),
            provider,
            description,
        }).then(res =>
            this.props.addConsumable(res.data)
        ).catch(error => console.log(error))
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
            <form className='create'>
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
                        amountError ||
                        purchasePriceError ||
                        sellingPriceError ||
                        providerError ||
                        descriptionError ||
                        !name
                    }
                    variant='outlined'
                >Добавить</Button>
            </form>
        )
    }
}
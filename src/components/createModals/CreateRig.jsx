import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class CreateRig extends React.Component {
    state = {
        name: '',
        nameError: null,
        dayPrice: '',
        dayPriceError: null,
        purchasePrice: '',
        purchasePriceError: null,
        description: '',
        descriptionError: null,
    }
    
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateToolName(e.target.value) })
    handleChangeDayPrice = e =>
        this.setState({ dayPrice: e.target.value, dayPriceError: validation.validatePrice(e.target.value) })
    handleChangePurchasePrice = e =>
        this.setState({ purchasePrice: e.target.value, purchasePriceError: validation.validatePrice(e.target.value) })
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    submit = () => {
        const {
            name,
            dayPrice,
            purchasePrice,
            description,
        } = this.state

        api.postRig({
            name,
            dayPrice: parseFloat(dayPrice),
            purchasePrice: parseFloat(purchasePrice),
            description,
        }).then(res =>
            this.props.addRig(res.data)
        ).catch(error => console.log(error))
    }

    render() {
        const {
            name,
            nameError,
            dayPrice,
            dayPriceError,
            purchasePrice,
            purchasePriceError,
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
                    value={ dayPrice }
                    onChange={ this.handleChangeDayPrice }
                    error={ !!dayPriceError }
                    helperText={ dayPriceError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='За сутки'
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
                        dayPriceError ||
                        purchasePriceError ||
                        descriptionError ||
                        !name
                    }
                    variant='outlined'
                >Добавить</Button>
            </form>
        )
    }
}
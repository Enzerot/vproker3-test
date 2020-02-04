import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class EditRig extends React.Component {
    state = {
        name: this.props.rig.name,
        nameError: null,
        dayPrice: this.props.rig.dayPrice,
        dayPriceError: null,
        purchasePrice: this.props.rig.purchasePrice,
        purchasePriceError: null,
        description: this.props.rig.description,
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

        api.editRig({
            _id: this.props.rig._id,
            name,
            dayPrice: parseFloat(dayPrice),
            purchasePrice: parseFloat(purchasePrice),
            description,
        }).then(res => this.props.editRig(res.data))
        .catch(error => console.error(error))
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
                >Сохранить</Button>
            </form>
        )
    }
}
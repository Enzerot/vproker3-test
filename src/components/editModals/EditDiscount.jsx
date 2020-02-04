import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class EditDiscount extends React.Component {
    state = {
        name: this.props.discount.name,
        nameError: null,
        description: this.props.discount.description,
        descriptionError: null,
        amount: this.props.discount.amount,
        amountError: null,
    }
    
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateDiscountName(e.target.value) })
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    handleChangeAmount = e =>
        this.setState({ amount: e.target.value, amountError: validation.validateDiscount(e.target.value) })
    submit = () => {
        const {
            name,
            description,
            amount,
        } = this.state

        api.editDiscount({
            _id: this.props.discount._id,
            name,
            description,
            amount: parseInt(amount),
        }).then(res => {
            this.props.editDiscount(res.data)
        }).catch(error =>
            console.log(error))
    }

    render() {
        const {
            name,
            nameError,
            description,
            descriptionError,
            amount,
            amountError,
        } = this.state
        return (
            <form className='edit'>
                <TextField
                    value={ name }
                    onChange={ this.handleChangeName }
                    required
                    label='Название'
                    helperText={ nameError}
                    error={ !!nameError }
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    multiline
                    label='Примечания'
                    helperText={ descriptionError }
                    error={ !!descriptionError }
                />
                <TextField
                    value={ amount }
                    onChange={ this.handleChangeAmount }
                    type='number'
                    label='Размер скидки, %'
                    inputProps={{
                        min: 0,
                        max: 100
                    }}
                    helperText={ amountError }
                    error={ !!amountError }
                />
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={ 
                        nameError ||
                        descriptionError ||
                        amountError ||
                        !name
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class ActiveDiscounts extends React.Component {
    state = {
        name: '',
        nameError: null,
        description: '',
        descriptionError: null,
        amount: '',
        amountError: null,
    }
    
    handleChangeName = e =>
        this.setState({ name: e.target.value, nameError: validation.validateDiscountName(e.target.value) })
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    handleChangeAmount = e =>
        this.setState({ amount: e.target.value, amountError: validation.validateDiscount(e.target.value) })
    submit = () => {
        const { name, description, amount } = this.state

        api.postDiscount({
            name,
            description,
            amount: parseInt(amount),
        }).then(res =>
            this.props.addDiscount(res.data)
        ).catch(error =>
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
            <form className='create'>
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
                >Добавить</Button>
            </form>
        )
    }
}
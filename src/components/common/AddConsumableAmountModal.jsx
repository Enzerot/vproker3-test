import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import validation from 'utils/validation'

export default class AddConsumableAmount extends React.Component {
    state = {
        amount: '',
        amountError: null,
    }
    
    handleChangeAmount = e =>
        this.setState({ amount: e.target.value, amountError: validation.validatePrice(e.target.value) })
    submit = () => {
        const {
            amount
        } = this.state

        api.editConsumable({
            _id: this.props.consumable._id,
            amount: this.props.consumable.amount + parseFloat(amount)
        }).then(res => this.props.editConsumable(res.data))
        .catch(error => console.error(error))
    }

    render() {
        const {
            amount,
            amountError,
        } = this.state

        return (
            <form className='edit'>
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
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={
                        amountError ||
                        !amount
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
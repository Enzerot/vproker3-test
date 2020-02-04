import React from 'react'
import { TextField, Button } from '@material-ui/core'
import Select from 'react-select'
import validation from 'utils/validation'

export default class ConsumableSelect extends React.Component {
    state = {
        amountError: null,
    }

    render() {
        const { amountError } = this.state
        const {
            models,
            value,
            addConsumableSelect,
            onChangeAmount,
            onChangeConsumable,
            isButtonDisplaying,
            id,
        } = this.props
        
        return (
            <>
                <div className="consumables">
                    <Select
                        defaultValue={value.consumable && value.consumable._id ? { value: value.consumable && value.consumable._id, label: value.consumable.name } : null}
                        placeholder='Выберите расходники'
                        options={ models.map(item => ({ value: item.id, label: item.name })) }
                        onChange={ option => onChangeConsumable(id, option) }
                        className='react-select-container'
                        classNamePrefix='react-select'
                        id='select'
                        noOptionsMessage={ () => 'Нет таких расходников' }
                        isClearable
                    />
                    <TextField
                        value={ value.amount }
                        onChange={ e => {
                            this.setState({ 
                                amountError:
                                    validation.validatePrice(e.target.value) ||
                                    ((value.prevAmount ? e.target.value - value.prevAmount : e.target.value) > models.find(item => item.id === value.consumable._id).amount ?
                                        'Слишком много' : null)
                                })
                                onChangeAmount(id, e.target.value)}
                            }
                        error={ !!amountError }
                        helperText={ amountError }
                        type='number'
                        inputProps={{
                            min: 0
                        }}
                        required
                        label='Количество'
                    />
                </div>
                {isButtonDisplaying && <Button
                    onClick={ addConsumableSelect }
                    color='secondary'
                    disabled={
                        !value.amount ||
                        this.state.amountError ||
                        !value.consumable._id
                    }
                >Добавить расходников</Button>}
            </>
        )
    }
}
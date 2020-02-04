import React from 'react'
import LuxonUtils from '@date-io/luxon'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

class DateTimePicker extends React.Component {
    render() {
        return (
            <MuiPickersUtilsProvider utils={LuxonUtils} locale='ru'>
                { this.props.onlyDate ? <KeyboardDatePicker
                    okLabel='Выбрать'
                    cancelLabel='Отменить'
                    invalidDateMessage='Неправильная дата'
                    value={ this.props.value }
                    onChange={ this.props.onChange }
                    label={ this.props.label }
                    format={ this.props.format || 'dd/MM/yyyy' }
                    onError={console.log}
                    ampm={false}
                /> : <KeyboardDateTimePicker
                    okLabel='Выбрать'
                    cancelLabel='Отменить'
                    invalidDateMessage='Неправильная дата'
                    value={ this.props.value }
                    onChange={ this.props.onChange }
                    label={ this.props.label }
                    format={ this.props.format || 'dd/MM/yyyy HH:mm' }
                    onError={console.log}
                    ampm={false}
                />}
            </ MuiPickersUtilsProvider>
        )
    }
}

export default DateTimePicker
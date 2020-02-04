import React from 'react'
import { DateTime } from 'luxon'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    TextField
} from '@material-ui/core'
import DateTimePicker from 'components/common/DateTimePicker'
import validation from 'utils/validation'
import { calculateOrderPayment } from 'utils'

class ConfirmationDialog extends React.Component {
    getPayment = finishDate => {
        const prices = this.props.data.tools && this.props.data.tools.length && this.props.data.tools.map(item => ({
            day: item.dayPrice,
            hour: item.hourPrice,
            workShift: item.workShiftPrice,
        }))

        const startDate = DateTime.fromFormat(this.props.data.startDate, 'yyyy-MM-dd HH:mm:ss').toJSDate() //startDate in table is formatted date string

        return calculateOrderPayment(
            startDate,
            finishDate,
            prices,
            this.props.data.client && this.props.data.client.allOrders,
            this.props.data.client && this.props.data.client.discount && parseFloat('0.' + this.props.data.client.discount.amount),
            this.props.data.rigs && this.props.data.rigs.length && this.props.data.rigs.map(item => item.dayPrice),
            this.props.data.consumables
        )
    }

    state = {
        data: {
            ...this.props.data,
            payment: this.getPayment(new Date()),
            finishDate: new Date(),
            priceError: null,
            paymentError: null,
        }
    }

    handleChangePrice = e =>
        this.setState({ data: { ...this.state.data, price: e.target.value }, priceError: validation.validatePrice(e.target.value) })
    handleChangePayment = e =>
        this.setState({ data: { ...this.state.data, payment: e.target.value }, paymentError: validation.validatePrice(e.target.value) })
    handleChangeFinishData = value =>
        this.setState({ data: { ...this.state.data, finishDate: new Date(value), payment: this.getPayment(new Date(value)) } })

    renderInfo = () => {
        const { data } = this.props

        let toolsString = ''
        data.tools && data.tools.forEach(i => toolsString += i.name + ', ')
        toolsString = toolsString.slice(0, -2)

        return this.props.type === 'order' ? (
            <ul>
                <li className={data.tool && data.tool.isDeleted ? 'deleted' : ''}>
                    <span className='field-name'>Название инструмента:</span>
                    <span className='field-value'>{toolsString}</span>
                </li>
                <li className={data.client && data.client.isDeleted ? 'deleted' : ''}>
                    <span className='field-name'>ФИО клиента:</span>
                    <span className='field-value'>{data.client && data.client.name}</span>
                </li>
                <li>
                    <span className='field-name'>Примечание:</span>
                    <span className='field-value description'>{data.description}</span>
                </li>
                <li>
                    <span className='field-name'>День выдачи в аренду:</span>
                    <span className='field-value'>{data.startDate}</span>
                </li>
            </ul>
        ) : (
                <ul>
                    <li>
                        <span className='field-name'>Название:</span>
                        <span className='field-value'>{data.name}</span>
                    </li>
                    <li>
                        <span className='field-name'>Описание:</span>
                        <span className='field-value description'>{data.description}</span>

                    </li>
                    <li>
                        <span className='field-name'>Дата начала:</span>
                        <span className='field-value'>{data.startDate}</span>
                    </li>
                </ul>
            )
    }

    render() {
        const { onClose, close, type, role } = this.props
        const { data, priceError, paymentError } = this.state

        return (
            <Dialog
                open
                onClose={onClose}
                className='confirmation-dialog'
            >
                <DialogTitle>Завершить {type === 'order' ? 'этот заказ' : 'это обслуживание'}?</DialogTitle>
                <DialogContent>
                    {this.renderInfo()}
                    <form>
                        {type === 'order' ? (
                            <TextField
                                value={data.payment}
                                onChange={this.handleChangePayment}
                                error={!!paymentError}
                                helperText={paymentError}
                                type='number'
                                label='Оплата'
                                inputProps={{
                                    min: 0
                                }}
                                fullWidth
                                required
                            />) : (
                                <TextField
                                    value={data.price}
                                    onChange={this.handleChangePrice}
                                    error={!!priceError}
                                    helperText={priceError}
                                    type='number'
                                    label='Цена'
                                    inputProps={{
                                        min: 0
                                    }}
                                    fullWidth
                                    required
                                />
                            )}
                        {role === 'admin' && (
                            <DateTimePicker
                                value={data.finishDate}
                                onChange={this.handleChangeFinishData}
                                label='Дата завершения'
                                fullWidth
                            />
                        )}
                    </form>
                    {data.remindTo && data.remindTo.name ? <span className='remindTo'>{`Напомните ${data.remindTo.name}: ${data.remindTo.phoneNumber}`}<br />{data.remindTo.description || ''}</span> : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => close(data)}>
                        Да
                    </Button>
                    <Button onClick={onClose} autoFocus>
                        Нет
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default ConfirmationDialog
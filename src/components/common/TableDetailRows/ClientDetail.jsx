import React from 'react'
import {
    FormControlLabel,
    Switch,
} from '@material-ui/core'

export default class ClientDetail extends React.Component {
    state = {
        showID: false,
    }
    
    handleChangeShowId = e =>
        this.setState({ showID: e.target.checked })

    render() {
        const { data } = this.props
        return (
            <div className='row-detail'>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.showID}
                            onChange={this.handleChangeShowId}
                            value={this.state.showID}
                            color='primary'
                        />
                    }
                    label='Показывать ID'
                    className='detail-switch'
                />
                <ul>
                    {this.state.showID ? <li>
                        <span className='field-name'>ID:</span> 
                        <span className='field-value'>{data._id}</span>
                    </li> : null}
                    <li>
                        <span className='field-name'>ФИО:</span> 
                        <span className='field-value'>{data.name}</span>
                    </li>
                    <li>
                        <span className='field-name'>Номер телефона:</span> 
                        <span className='field-value'>{data.phoneNumber}</span>
                    </li>
                    <li>
                        <span className='field-name'>Пасспорт:</span> 
                        <span className='field-value'>{data.passport}</span>
                    </li>
                    <li>
                        <span className='field-name'>Создан:</span> 
                        <span className='field-value'>{data.createdAt}</span>
                    </li>
                    <li>
                        <span className='field-name'>Описание:</span> 
                        <span className='field-value'>{data.description}</span>
                    </li>
                    <li>
                        <span className='field-name'>Дата рождения:</span> 
                        <span className='field-value'>{data.birthDate}</span>
                    </li>
                    <li>
                        <span className='field-name'>Всего заказов:</span> 
                        <span className='field-value'>{data.allOrders}</span>
                    </li>
                    <li>
                        <span className='field-name'>Активных заказов:</span> 
                        <span className='field-value'>{data.activeOrders}</span>
                    </li>
                    {this.state.showID ? <li>
                        <span className='field-name'>ID источника:</span>
                        <span className='field-value'>{data.discount ? data.discount._id : null}</span>
                    </li> : null}
                    <li>
                        <span className='field-name'>Откуда пришёл:</span>
                        <span className='field-value'>{data.discount ? data.discount.name : null}</span>
                    </li>
                </ul>
            </div>
        )
    }
}
import React from 'react'
import {
    FormControlLabel,
    Switch,
} from '@material-ui/core'

export default class OrderDetail extends React.Component {
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
                    {data.tools && data.tools.length && data.tools.map(item => (
                        <>
                            {this.state.showID ? <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>ID инструмента:</span>
                                <span className='field-value'>{item._id}</span>
                            </li> : null}
                            <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>Название инструмента:</span>
                                <span className='field-value'>{item.name}</span>
                            </li>
                        </>
                    ))}
                    {data.inventoryNumbers && data.inventoryNumbers.length && (
                        <li>
                            <span className='field-name'>Инвентарные номера:</span>
                            <span className='field-value'>{data.inventoryNumbers.reduce((sum, item) => sum + ((item || '') && (item + ', ')), '').slice(0, -2)}</span>
                        </li>
                    )}
                    {data.rigs && data.rigs.length && data.rigs.map(item => 
                        (<>
                            {this.state.showID ? <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>ID оснастки:</span>
                                <span className='field-value'>{item._id}</span>
                            </li> : null}
                            <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>Название оснастки:</span>
                                <span className='field-value'>{item.name}</span>
                            </li>
                        </>)
                    )}
                    {data.consumables && data.consumables.length ? data.consumables.map(item =>
                        (<>
                            {this.state.showID ? <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>ID расходника:</span>
                                <span className='field-value'>{item.consumable._id}</span>
                            </li> : null}
                            <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>Название расходника:</span>
                                <span className='field-value'>{item.consumable.name}</span>
                            </li>
                            <li className={item.isDeleted ? 'deleted' : ''}>
                                <span className='field-name'>Количество:</span>
                                <span className='field-value'>{item.amount}</span>
                            </li>
                        </>)
                    ) : null}
                    {this.state.showID ? <li className={data.client && data.client.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>ID клиента:</span>
                        <span className='field-value'>{data.client ? data.client._id : null}</span>
                    </li> : null}
                    <li className={data.client && data.client.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>ФИО клиента:</span>
                        <span className='field-value'>{data.client ? data.client.name : null}</span>
                    </li>
                    <li className={data.client && data.client.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>Номер телефона клиента:</span>
                        <span className='field-value'>{data.client ? data.client.phoneNumber : null}</span>
                    </li>
                    <li className={data.client && data.client.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>Паспорт клиента:</span>
                        <span className='field-value'>{data.client ? data.client.passport : null}</span>
                    </li>
                    <li>
                        <span className='field-name'>Номер договора:</span>
                        <span className='field-value'>{data.contractNumber}</span>
                    </li>
                    <li>
                        <span className='field-name'>Создан:</span>
                        <span className='field-value'>{data.createdBy.login} ({data.createdBy.role})</span>
                    </li>
                    <li>
                        <span className='field-name'>Примечание:</span>
                        <span className='field-value'>{data.description}</span>
                    </li>
                    <li>
                        <span className='field-name'>Залог:</span>
                        <span className='field-value'>{data.paidPledge}</span>
                    </li>
                    <li>
                        <span className='field-name'>День выдачи в аренду:</span>
                        <span className='field-value'>{data.startDate}</span>
                    </li>
                    <li>
                        <span className='field-name'>Аренда окончена:</span>
                        <span className='field-value'>{data.finishDate}</span>
                    </li>
                    <li>
                        <span className='field-name'>Оплата:</span>
                        <span className='field-value'>{data.payment}</span>
                    </li>
                </ul>
            </div>
        )
    }
}
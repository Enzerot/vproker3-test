import React from 'react'
import {
    FormControlLabel,
    Switch,
} from '@material-ui/core'

export default class InventoryDetail extends React.Component {
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
                        <span className='field-name'>Номер:</span>
                        <span className='field-value'>{data.number}</span>
                    </li>
                    <li>
                        <span className='field-name'>Наименование:</span>
                        <span className='field-value'>{data.name}</span>
                    </li>
                    <li>
                        <span className='field-name'>Серийный номер:</span>
                        <span className='field-value'>{data.serialNumber}</span>
                    </li>
                    <li>
                        <span className='field-name'>Инвентарный номер:</span>
                        <span className='field-value'>{data.inventoryNumber}</span>
                    </li>
                    <li>
                        <span className='field-name'>Дата приобретения:</span>
                        <span className='field-value'>{data.purchaseDate}</span>
                    </li>
                    <li>
                        <span className='field-name'>Стоимость приобретения:</span>
                        <span className='field-value'>{data.purchasePrice}</span>
                    </li>
                    <li>
                        <span className='field-name'>Остаточная стоимость:</span>
                        <span className='field-value'>{data.residualValue}</span>
                    </li>
                    <li>
                        <span className='field-name'>Срок гарантии:</span>
                        <span className='field-value'>{data.guaranteePeriod}</span>
                    </li>
                </ul>
            </div>
        )
    }
}
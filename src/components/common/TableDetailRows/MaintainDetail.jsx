import React from 'react'
import {
    FormControlLabel,
    Switch,
} from '@material-ui/core'

export default class MaintainDetail extends React.Component {
    state = {
        showID: false,
    }
    
    handleChangeShowId = e =>
        this.setState({ showID: e.target.checked })

    render() {
        const { data } = this.props
        console.log(data)
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
                        <span className='field-name'>Название:</span> 
                        <span className='field-value'>{data.name}</span>
                    </li>
                    {this.state.showID ? <li className={data.tool && data.tool.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>ID инструмента:</span> 
                        <span className='field-value'>{data.tool ? data.tool._id : null}</span>
                    </li> : null}
                    <li className={data.tool && data.tool.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>Название инструмента:</span> 
                        <span className='field-value'>{data.tool ? data.tool.name : null}</span>
                    </li>
                    {this.state.showID ? <li className={data.rig && data.rig.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>ID оснастки:</span>
                        <span className='field-value'>{data.rig ? data.rig._id : null}</span>
                    </li> : null}
                    <li className={data.rig && data.rig.isDeleted ? 'deleted' : ''}>
                        <span className='field-name'>Название оснастки:</span>
                        <span className='field-value'>{data.rig ? data.rig.name : null}</span>
                    </li>
                    <li>
                        <span className='field-name'>Описание:</span> 
                        <span className='field-value'>{data.description}</span>
                    </li>
                    <li>
                        <span className='field-name'>Цена:</span> 
                        <span className='field-value'>{data.price}</span>
                    </li>
                    <li>
                        <span className='field-name'>Материалы:</span> 
                        <span className='field-value'>{data.materials}</span>
                    </li>
                    <li>
                        <span className='field-name'>Моточасы:</span> 
                        <span className='field-value'>{data.engineHours}</span>
                    </li>
                    <li>
                        <span className='field-name'>Дата начала обслуживания:</span> 
                        <span className='field-value'>{data.startDate.toString()}</span>
                    </li>
                    <li>
                        <span className='field-name'>Окончание обслуживания:</span> 
                        <span className='field-value'>{data.finishDate}</span>
                    </li>
                </ul>
            </div>
        )
    }
}
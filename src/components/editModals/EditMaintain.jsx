import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import DateTimePicker from 'components/common/DateTimePicker'
import Select from 'react-select'
import validation from 'utils/validation'

export default class EditMaintain extends React.Component {
    state = {
        name: this.props.maintain.name,
        tool: this.props.maintain.tool ? this.props.maintain.tool._id : '',
        rig: this.props.maintain.rig ? this.props.maintain.rig._id : '',
        description: this.props.maintain.description,
        descriptionError: null,
        materials: this.props.maintain.materials,
        materialsError: null,
        price: this.props.maintain.price,
        priceError: null,
        engineHours: this.props.maintain.engineHours,
        engineHoursError: null,
        startDate: this.props.maintain.startDate,
        finishDate: this.props.maintain.finishDate,

        toolModels: [],
        rigModels: [],
    }

    names = [
        this.props.maintain.name,
        'Ремонт',
        'Ремонт по гарантии',
        'Замена по гарантии',
        'Обслуживание',
        'Продажа',
        'Списание',
    ].map(item => ({ value: item, label: item }))

    componentDidMount() {
        this.downloadToolsList()
        this.downloadRigsList()
    }

    handleChangeName = (option, action) =>
        this.setState({ name: option.value })
    handleChangeTool = (option, action) => 
        this.setState({ tool: option.value })
    handleChangeRig = option =>
        this.setState({ rig: option.value })
    handleChangeDescription = e =>
        this.setState({ description: e.target.value, descriptionError: validation.validateDescription(e.target.value) })
    handleChangeMaterials = e =>
        this.setState({ materials: e.target.value, materialsError: validation.validateMaterials(e.target.value) })
    handleChangePrice = e =>
        this.setState({ price: e.target.value, priceError: validation.validatePrice(e.target.value) })
    handleChangeEngineHours = e =>
        this.setState({ engineHours: e.target.value, engineHoursError: validation.validateDescription(e.target.value) })
    handleChangeStartDate = value =>
        this.setState({startDate: value})
    handleChangeFinishDate = value =>
        this.setState({finishDate: value})
    submit = () => {
        const { 
            name,
            tool,
            rig,
            description,
            materials,
            price,
            engineHours,
            startDate,
            finishDate,
        } = this.state
        api.editMaintain({
            _id: this.props.maintain._id,
            name,
            tool,
            rig,
            description,
            materials,
            price: parseFloat(price),
            engineHours: parseInt(engineHours),
            startDate,
            finishDate
        }).then(res => {
            this.props.editMaintain({
                ...res.data,
                toolName: res.data.tool ? res.data.tool.name : (res.data.rig ? res.data.rig.name : ''),
            })
        })
        .catch(error =>
            console.log(error))
    }

    downloadToolsList = () =>
        api.getToolModels()
            .then(res => this.setState({ toolModels: res.data.sort((a, b) => a.name > b.name ? 1 : -1) }))
            .catch(error => console.error(error))
    downloadRigsList = () =>
        api.getRigModels()
            .then(res => this.setState({ rigModels: res.data.sort((a, b) => a.name > b.name ? 1 : -1) }))
            .catch(error => console.error(error))

    render() {
        const {
            name,
            toolModels,
            rigModels,
            description,
            descriptionError,
            materials,
            materialsError,
            price,
            priceError,
            engineHours,
            engineHoursError,
            startDate,
            finishDate,
        } = this.state
        return (
            <form className='edit'>
                <Select
                    placeholder='Название'
                    options={ this.names }
                    defaultValue={ this.names[0] }
                    onChange={ this.handleChangeName }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких названий'}
                />
                <Select
                    placeholder='Выберите инструмент'
                    options={ toolModels.map(item => ({value: item._id, label: item.name})) }
                    defaultValue={this.props.maintain.tool ? {
                        value: this.props.maintain.tool._id, 
                        label: this.props.maintain.tool.name,
                    } : null}
                    onChange={ this.handleChangeTool }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких инструментов'}
                />
                <Select
                    placeholder='Выберите оснастку'
                    options={ rigModels.map(item => ({value: item.id, label: item.name})) }
                    defaultValue={this.props.maintain.rig ? {
                        value: this.props.maintain.rig._id, 
                        label: this.props.maintain.rig.name,
                    } : null}
                    onChange={ this.handleChangeRig }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет такой оснастки'}
                />
                <TextField
                    value={ description }
                    onChange={ this.handleChangeDescription }
                    error={ !!descriptionError }
                    helperText={ descriptionError }
                    multiline
                    label='Описание'
                />
                <TextField
                    value={ materials }
                    onChange={ this.handleChangeMaterials }
                    error={ !!materialsError }
                    helperText={ materialsError }
                    multiline
                    label='Материалы'
                />
                <TextField
                    value={ price }
                    onChange={ this.handleChangePrice }
                    error={ !!priceError }
                    helperText={ priceError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Цена'
                />
                <TextField
                    value={ engineHours }
                    onChange={ this.handleChangeEngineHours }
                    error={ !!engineHoursError }
                    helperText={ engineHoursError }
                    type='number'
                    inputProps={{
                        min: 0
                    }}
                    label='Моточасы'
                />
                <DateTimePicker 
                    value={ startDate }
                    onChange={ this.handleChangeStartDate }
                    label='Дата начала'
                />
                <DateTimePicker 
                    value={ finishDate }
                    onChange={ this.handleChangeFinishDate }
                    label='Дата окончания'
                />
                <Button 
                    onClick={ this.submit }
                    color='secondary'
                    disabled={ 
                        descriptionError || 
                        materialsError || 
                        priceError || 
                        engineHoursError || 
                        !name 
                    }
                    variant='outlined'
                >Сохранить</Button>
            </form>
        )
    }
}
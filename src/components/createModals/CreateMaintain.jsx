import React from 'react'
import {
    TextField,
    Button
} from '@material-ui/core'
import api from 'api'
import DateTimePicker from 'components/common/DateTimePicker'
import Select from 'react-select'
import validation from 'utils/validation'

const names = [
    'Ремонт',
    'Ремонт по гарантии',
    'Замена по гарантии',
    'Обслуживание',
    'Продажа',
    'Списание',
].map(item => ({ value: item, label: item }))

export default class CreateMaintain extends React.Component {
    state = {
        name: null,
        tool: null,
        rig: null,
        description: '',
        descriptionError: null,
        materials: '',
        materialsError: null,
        price: '',
        priceError: null,
        engineHours: '',
        engineHoursError: null,
        startDate: (new Date()).toString(),

        toolModels: [],
        rigModels: [],
    }

    componentDidMount() {
        this.downloadToolsList()
        this.downloadRigsList()
    }

    handleChangeName = option =>
        this.setState({ name: option.value })
    handleChangeTool = option =>
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
        this.setState({ startDate: value })
    submit = () => {
        const { name, tool, description, materials, price, engineHours, startDate, rig } = this.state
        api.postMaintain({
            name,
            tool,
            rig,
            description,
            materials,
            price: parseFloat(price),
            engineHours: parseInt(engineHours),
            startDate,
        }).then(res =>
            this.props.addMaintain({
                ...res.data,
                toolName: res.data.tool ? res.data.tool.name : (res.data.rig ? res.data.rig.name : ''),
            })
        ).catch(error => console.log(error))
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
        } = this.state

        return (
            <form className='create'>
                <Select
                    placeholder='Название'
                    options={ names }
                    onChange={ this.handleChangeName }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких названий'}
                />
                <Select
                    placeholder='Выберите инструмент'
                    options={ toolModels.map(item => ({value: item._id, label: item.name})) }
                    onChange={ this.handleChangeTool }
                    className='react-select-container'
                    classNamePrefix='react-select'
                    id='select'
                    noOptionsMessage={() => 'Нет таких инструментов'}
                />
                <Select
                    placeholder='Выберите оснастку'
                    options={ rigModels.map(item => ({value: item.id, label: item.name})) }
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
                >Создать</Button>
            </form>
        )
    }
}
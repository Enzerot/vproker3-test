import React from 'react'
import api from 'api'
import Table from 'components/common/Table'
import AddButton from 'components/common/AddButton'
import CreateTool from 'components/createModals/CreateTool'
import EditTool from 'components/editModals/EditTool'
import requireAuth from 'requireAuth'
import { Modal, withStyles, Button } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

const styles = theme => ({
    modal: window.innerWidth > 560 ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: 'none',
        borderRadius: '5px',
        boxSizing: 'border-box',
        maxHeight: '100%',
        overflowY: 'scroll'
    } : {
        position: 'absolute',
        top: '0',
        left: '0',
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        outline: 'none',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        maxHeight: '100%',
        overflowY: 'scroll'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: '50%',
        minWidth: 'auto',
        zIndex: 1000,
    }
})

class Tools extends React.Component {
    state = {
        data: [],
        isCreateModalOpen: false,
        editingTool: null,
        isDataLoading: true,
    }
    
    columns = [
        {
            field: 'name',
            title: 'Наименование',
            defaultSort: 'asc',
            customFilterAndSearch: (filterValue, row, columnDef) =>
                Object.values(row).find(value => String(value).toLowerCase().includes(filterValue.toLowerCase().trim()))
        },
        {
            field: 'price',
            title: 'Цена',
        },
        {
            field: 'pledge',
            title: 'Залог',
        },
        {
            field: 'dayPrice',
            title: 'За сутки',
        },
        {
            field: 'workShiftPrice',
            title: 'За смену',
        },
        {
            field: 'category',
            title: 'Категории',
        },
    ]

    openCreateModal = () => {
        this.setState({ isCreateModalOpen: true })
    }
    closeCreateModal = () => {
        this.setState({ isCreateModalOpen: false })
    }

    openEditModal = tool => {
        this.setState({ editingTool: tool })
    }
    closeEditModal = () => {
        this.setState({ editingTool: null })
    }

    deleteTool = id => {
        api.deleteTool(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))
    }

    editTool = tool => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === tool._id) {
                return tool
            }
            return item
        }) })

        this.closeEditModal()
    }

    addTool = tool => {
        this.setState({ data: [...this.state.data].concat([tool]) })
        this.closeCreateModal()
    }

    componentDidMount() {
        api.getTools()
            .then(res =>
                this.setState({ data: res.data, isDataLoading: false }))
            .catch(error =>
                console.error(error))
    }

    render() {
        const { data, isCreateModalOpen, editingTool, isDataLoading } = this.state
        const { classes, user } = this.props
        return (
            <React.Fragment>
                <div className='container'>
                    {user.role === 'admin' ? (
                        <Table 
                            title='Инструменты'
                            columns={ this.columns }
                            data={ data }
                            type='tool'
                            editRow={ this.openEditModal }
                            deleteRow={ this.deleteTool }
                            loading={ isDataLoading }
                        />
                    ) : <h2>Сожалею, но у вас нет прав для просмотра данной таблицы...</h2>}
                </div>

                <Modal
                    open={isCreateModalOpen}
                    onClose={this.closeCreateModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeCreateModal} className={classes.closeButton}><CloseIcon /></Button>
                        <CreateTool addTool={ this.addTool }/>
                    </div>
                </Modal>

                <Modal
                    open={!!editingTool}
                    onClose={this.closeEditModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditTool
                            tool={ editingTool }
                            editTool={ this.editTool }
                        />
                    </div>
                </Modal>
                
                <AddButton onClick={this.openCreateModal}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Tools))
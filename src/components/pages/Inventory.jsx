import React from 'react'
import api from 'api'
import Table from 'components/common/Table'
import AddButton from 'components/common/AddButton'
import CreateInventory from 'components/createModals/CreateInventory'
import EditInventory from 'components/editModals/EditInventory'
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

class Inventory extends React.Component {
    state = {
        data: [],
        isCreateModalOpen: false,
        editingInventory: null,
        isDataLoading: true,
    }
    
    columns = [
        {
            field: 'number',
            title: 'Номер',
            hidden: true,
        },
        {
            field: 'name',
            title: 'Наименование',
            defaultSort: 'asc',
            customFilterAndSearch: (filterValue, row, columnDef) =>
                Object.values(row).find(value => String(value).toLowerCase().includes(filterValue.toLowerCase().trim()))
        },
        {
            field: 'serialNumber',
            title: 'Серийный номер',
            hidden: true,
        },
        {
            field: 'inventoryNumber',
            title: 'Инвентарный номер',
        },
        {
            field: 'purchaseDate',
            title: 'Дата приобретения',
        },
        {
            field: 'purchasePrice',
            title: 'Стоимость приобретения',
            hidden: true,
        },
        {
            field: 'residualValue',
            title: 'Остаточная стоимость',
        },
        {
            field: 'guaranteePeriod',
            title: 'Срок гарантии',
            hidden: true,
        },
    ]

    openCreateModal = () => {
        this.setState({ isCreateModalOpen: true })
    }
    closeCreateModal = () => {
        this.setState({ isCreateModalOpen: false })
    }

    openEditModal = inventory => {
        this.setState({ editingInventory: inventory })
    }
    closeEditModal = () => {
        this.setState({ editingInventory: null })
    }

    deleteInventory = id => {
        api.deleteInventory(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))
    }

    editInventory = inventory => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === inventory._id) {
                return inventory
            }
            return item
        }) })

        this.closeEditModal()
    }

    addInventory = inventory => {
        this.setState({ data: [...this.state.data].concat([inventory]) })
        this.closeCreateModal()
    }

    componentDidMount() {
        api.getInventory()
            .then(res =>
                this.setState({ data: res.data, isDataLoading: false }))
            .catch(error =>
                console.error(error))
    }

    render() {
        const { data, isCreateModalOpen, editingInventory, isDataLoading } = this.state
        const { classes, user } = this.props
        return (
            <React.Fragment>
                <div className='container'>
                    {user.role === 'admin' ? (
                        <Table 
                            title='Инвентарь'
                            columns={ this.columns }
                            data={ data }
                            type='inventory'
                            editRow={ this.openEditModal }
                            deleteRow={ this.deleteInventory }
                            loading={ isDataLoading }
                        />
                    ) : <h2>Сожалею, но у вас нет прав для просмотра данной таблицы...</h2>}
                </div>

                {user.role === 'admin' && <Modal
                    open={isCreateModalOpen}
                    onClose={this.closeCreateModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeCreateModal} className={classes.closeButton}><CloseIcon /></Button>
                        <CreateInventory addInventory={ this.addInventory }/>
                    </div>
                </Modal>}

                <Modal
                    open={!!editingInventory}
                    onClose={this.closeEditModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditInventory
                            inventory={ editingInventory }
                            editInventory={ this.editInventory }
                        />
                    </div>
                </Modal>
                
                <AddButton onClick={this.openCreateModal}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Inventory))
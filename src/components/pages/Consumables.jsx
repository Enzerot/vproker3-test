import React from 'react'
import api from 'api'
import Table from 'components/common/Table'
import AddButton from 'components/common/AddButton'
import CreateConsumable from 'components/createModals/CreateConsumable'
import EditConsumable from 'components/editModals/EditConsumable'
import AddConsumableAmountModal from 'components/common/AddConsumableAmountModal'
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

class Consumables extends React.Component {
    state = {
        data: [],
        isCreateModalOpen: false,
        editingConsumable: null,
        isDataLoading: true,
        addingConsumable: null,
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
            field: 'amount',
            title: 'Количество',
        },
        {
            field: 'purchasePrice',
            title: 'Цена приобретения',
        },
        {
            field: 'sellingPrice',
            title: 'Цена продажи',
        },
        {
            field: 'provider',
            title: 'Поставщик',
        },
    ]

    openCreateModal = () =>
        this.setState({ isCreateModalOpen: true })
    closeCreateModal = () =>
        this.setState({ isCreateModalOpen: false })

    openEditModal = consumable =>
        this.setState({ editingConsumable: consumable })
    closeEditModal = () =>
        this.setState({ editingConsumable: null })

    openAddingAmountModal = consumable =>
        this.setState({ addingConsumable: consumable })
    closeAddingAmountModal = () =>
        this.setState({ addingConsumable: null })

    deleteConsumable = id =>
        api.deleteConsumable(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))

    editConsumable = consumable => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === consumable._id) {
                return consumable
            }
            return item
        }) })

        this.closeEditModal()
        this.closeAddingAmountModal()
    }

    addConsumable = consumable => {
        this.setState({ data: [...this.state.data].concat([consumable]) })
        this.closeCreateModal()
    }

    componentDidMount() {
        api.getConsumables()
            .then(res => this.setState({ data: res.data, isDataLoading: false }))
            .catch(error => console.error(error))
    }

    render() {
        const { data, isCreateModalOpen, editingConsumable, isDataLoading, addingConsumable } = this.state
        const { classes, user } = this.props
        return (
            <React.Fragment>
                <div className='container'>
                    <Table 
                        title='Расходники'
                        columns={ this.columns }
                        data={ data }
                        type='consumable'
                        editRow={ this.openEditModal }
                        deleteRow={ this.deleteConsumable }
                        onAddAmount= { this.openAddingAmountModal }
                        loading={ isDataLoading }
                        role={ user.role }
                    />
                </div>

                <Modal
                    open={isCreateModalOpen}
                    onClose={this.closeCreateModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeCreateModal} className={classes.closeButton}><CloseIcon /></Button>
                        <CreateConsumable addConsumable={ this.addConsumable }/>
                    </div>
                </Modal>

                <Modal
                    open={!!editingConsumable}
                    onClose={this.closeEditModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditConsumable
                            consumable={ editingConsumable }
                            editConsumable={ this.editConsumable }
                        />
                    </div>
                </Modal>

                <Modal
                    open={!!addingConsumable}
                    onClose={this.closeAddingAmountModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeAddingAmountModal} className={classes.closeButton}><CloseIcon /></Button>
                        <AddConsumableAmountModal
                            consumable={ addingConsumable }
                            editConsumable={ this.editConsumable }
                        />
                    </div>
                </Modal>
                
                <AddButton onClick={this.openCreateModal}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Consumables))
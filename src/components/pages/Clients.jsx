import React from 'react'
import Table from 'components/common/Table'
import api from 'api'
import AddButton from 'components/common/AddButton'
import CreateClient from 'components/createModals/CreateClient'
import EditClient from 'components/editModals/EditClient'
import { Modal, withStyles, Button } from '@material-ui/core'
import requireAuth from 'requireAuth'
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

class Clients extends React.Component {
    state = {
        data: [],
        filter: this.props.user.role === 'admin' ? 'all' : 'birthdays',
        isCreateModalOpen: false,
        editingClient: null,
        isDataLoading: true,
    }
    columns = [
        {
            field: 'createdAt',
            title: 'Дата регистрации',
        },
        {
            field: 'name',
            title: 'Клиент',
            defaultSort: 'asc',
            customFilterAndSearch: (filterValue, row, columnDef) =>
                Object.values(row).find(value => String(value).toLowerCase().includes(filterValue.toLowerCase().trim()))
        },
        {
            field: 'phoneNumber',
            title: 'Телефон',
        },
        {
            field: 'allOrders',
            title: 'Всего заказов',
        },
        {
            field: 'activeOrders',
            title: 'Активных заказов',
        },
    ]

    openCreateModal = () =>
        this.setState({ isCreateModalOpen: true })
    closeCreateModal = () =>
        this.setState({ isCreateModalOpen: false })

    openEditModal = tool =>
        this.setState({ editingClient: tool })
    closeEditModal = () =>
        this.setState({ editingClient: null })

    filterToAll = () =>
        this.setState({ filter: 'all' })
    filterToBlackList = () =>
        this.setState({ filter: 'blackList' })
    filterToBirthdays = () =>
        this.setState({ filter: 'birthdays' })

    componentDidMount() {
        api.getClients()
            .then(res =>
                this.setState({ data: res.data, isDataLoading: false }))
            .catch(error =>
                console.error(error))
    }

    deleteClient = id =>
        api.deleteClient(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))
    
    addToBlackList = id =>
        api.addClientToBlackList(id)
            .then(this.setState({ data: this.state.data.map(item => item._id === id ? {...item, isClientInBlackList: true} : item) }))
            .catch(error => console.error(error))
    removeFromBlackList = id =>
        api.removeClientFromBlackList(id)
            .then(this.setState({ data: this.state.data.map(item => item._id === id ? {...item, isClientInBlackList: false} : item) }))
            .catch(error => console.error(error))

    editClient = client => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === client._id) {
                return client
            }
            return item
        }) })
        this.closeEditModal()
    }

    addClient = client => {
        this.setState({ data: [...this.state.data].concat([client]) })
        this.closeCreateModal()
    }

    render() {
        const { data, isCreateModalOpen, editingClient, isDataLoading, filter } = this.state
        const { classes, user } = this.props
        return (
            <React.Fragment>
                <div className='container'>
                    <Table
                        title={user.role === 'admin' ? 'Клиенты' : 'Сегодня день рождения'}
                        columns={ this.columns }
                        data={ data }
                        type='client'
                        filter={filter}
                        filterToAll={ this.filterToAll }
                        filterToBlackList={ this.filterToBlackList }
                        filterToBirthdays={ this.filterToBirthdays }
                        onAddToBlackList={ this.addToBlackList }
                        onRemoveFromBlackList={ this.removeFromBlackList }
                        editRow={ this.openEditModal }
                        deleteRow={ this.deleteClient }
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
                        <CreateClient addClient={ this.addClient }/>
                    </div>
                </Modal>

                <Modal
                    open={!!editingClient}
                    onClose={this.closeEditModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditClient
                            client={ editingClient }
                            editClient={ this.editClient }
                        />
                    </div>
                </Modal>
                
                <AddButton onClick={this.openCreateModal}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Clients))
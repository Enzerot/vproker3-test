import React from 'react'
import Table from 'components/common/Table'
import api from 'api'
import AddButton from 'components/common/AddButton'
import CreateOrder from 'components/createModals/CreateOrder'
import EditOrder from 'components/editModals/EditOrder'
import ConfirmationDialog from 'components/common/ConfirmationDialog'
import HistoryDialog from 'components/common/HistoryDialog'
import { Modal, withStyles, Button } from '@material-ui/core'
import requireAuth from 'requireAuth'
import { Close as CloseIcon } from '@material-ui/icons'
import ReminderOrder from 'components/common/ReminderForm'

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

class Orders extends React.Component {
    state = {
        data: [],
        filter: 'active',
        isCreateModalOpen: false,
        editingOrder: null,
        closingOrder: null,
        reminderOrder: null,
        isDataLoading: true,
        isHistoryDialogOpen: false,
    }
    columns = [
        {
            field: 'toolsName',
            title: 'Инструмент',
            customFilterAndSearch: (filterValue, row, columnDef) =>
                Object.values(row).find(value => String(value).toLowerCase().includes(filterValue.toLowerCase().trim()))
        },
        {
            field: 'startDate',
            defaultSort: 'desc',
            title: 'Начало аренды',
        },
        {
            field: 'clientName',
            title: 'Клиент',
        },
        {
            field: 'phoneNumber',
            title: 'Телефон',
        },
    ]

    openCreateModal = () =>
        this.setState({ isCreateModalOpen: true })
    closeCreateModal = () =>
        this.setState({ isCreateModalOpen: false })

    openEditModal = order =>
        this.setState({ editingOrder: order })
    closeEditModal = () =>
        this.setState({ editingOrder: null })

    openReminderModal = order =>
        this.setState({ reminderOrder: order })
    closeReminderModal = () =>
        this.setState({ reminderOrder: null })

    openConfirmationDialog = order =>
        this.setState({ closingOrder: order })
    closeConfirmationDialog = () =>
        this.setState({ closingOrder: null })

    openHistoryDialog = () =>
        this.setState({ isHistoryDialogOpen: true })
    closeHistoryDialog = () =>
        this.setState({ isHistoryDialogOpen: false })

    filterToActive = () =>
        this.setState({ filter: 'active' })
    filterToFinished = () =>
        this.setState({ filter: 'finished' })
    filterToAll = () =>
        this.setState({ filter: 'all' })

    componentDidMount() {
        api.getActiveOrders()
            .then(res => {
                this.setState({ data: res.data.map(item => {
                    let toolsString = ''
                    item.tools.forEach(i => toolsString += i.name + ', ')
                    toolsString = toolsString.slice(0, -2)
                    return {
                        ...item, 
                        toolsName: toolsString,
                        clientName: item.client ? item.client.name : '',
                        phoneNumber: item.client ? item.client.phoneNumber : '',
                    }
                }), isDataLoading: false })
            })
            .catch(error => console.error(error))
        api.getOrders()
            .then(res => {
                this.setState({ data: res.data.map(item => {
                    let toolsString = ''
                    item.tools.forEach(i => toolsString += i.name + ', ')
                    toolsString = toolsString.slice(0, -2)
                    return {
                        ...item,
                        toolsName: toolsString,
                        clientName: item.client ? item.client.name : '',
                        phoneNumber: item.client ? item.client.phoneNumber : '',
                    }
                })})
            })
            .catch(error => console.error(error))
    }

    deleteOrder = id => {
        api.deleteOrder(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))
    }

    editOrder = order => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === order._id) {
                return order
            }
            return item
        }) })

        this.closeEditModal()
    }

    addReminder = order => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === order._id) {
                return order
            }
            return item
        }) })

        this.closeReminderModal()
    }

    closeOrder = (data) => {
        api.editOrder(data)
            .then(() => this.closeConfirmationDialog())
            .catch(error => console.error(error))

        this.editOrder(data)
    }

    addOrder = order => {
        this.setState({ data: [{
            ...order,
            toolName: order.tool ? order.tool.name : '',
            clientName: order.client ? order.client.name : '',
            phoneNumber: order.client ? order.client.phoneNumber : '',
        }, ...this.state.data] })
        this.closeCreateModal()
    }

    render() {
        const {
            data,
            isCreateModalOpen,
            editingOrder,
            closingOrder,
            reminderOrder,
            filter,
            isDataLoading,
            isHistoryDialogOpen,
        } = this.state
        const { classes, user } = this.props

        return (
            <React.Fragment>
                <div className='container'>
                    <Table
                        title='Заказы'
                        columns={ this.columns }
                        data={ data }
                        type='order'
                        editRow={ this.openEditModal }
                        deleteRow={ this.deleteOrder }
                        filter={filter}
                        onClose={ this.openConfirmationDialog }
                        onAddReminder={ this.openReminderModal }
                        filterToActive={ this.filterToActive }
                        filterToFinished={ this.filterToFinished }
                        filterToAll={ this.filterToAll }
                        openHistoryDialog={ this.openHistoryDialog }
                        role={ user.role }
                        loading={ isDataLoading }
                    />
                </div>
                
                <Modal
                    open={isCreateModalOpen}
                    onClose={this.closeCreateModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeCreateModal} className={classes.closeButton}><CloseIcon /></Button>
                        <CreateOrder
                            addOrder={ this.addOrder }
                            role={ user.role }
                        />
                    </div>
                </Modal>

                <Modal
                    open={!!editingOrder}
                    onClose={this.closeEditModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditOrder
                            order={ editingOrder }
                            editOrder={ this.editOrder }
                            role={ user.role }
                        />
                    </div>
                </Modal>

                <Modal
                    open={!!reminderOrder}
                    onClose={this.closeReminderModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeReminderModal} className={classes.closeButton}><CloseIcon /></Button>
                        <ReminderOrder
                            order={ reminderOrder }
                            addReminder={ this.addReminder }
                            type='order'
                        />
                    </div>
                </Modal>

                {closingOrder ? <ConfirmationDialog 
                    data={closingOrder}
                    onClose={this.closeConfirmationDialog}
                    close={this.closeOrder}
                    type='order'
                    role={user.role}
                /> : null}

                {isHistoryDialogOpen && <HistoryDialog 
                    onClose={this.closeHistoryDialog}
                />}
                
                <AddButton onClick={this.openCreateModal}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Orders))
import React from 'react'
import Table from 'components/common/Table'
import api from 'api'
import AddButton from 'components/common/AddButton'
import CreateMaintain from 'components/createModals/CreateMaintain'
import EditMaintain from 'components/editModals/EditMaintain'
import ConfirmationDialog from 'components/common/ConfirmationDialog'
import { Modal, withStyles, Button } from '@material-ui/core'
import requireAuth from 'requireAuth'
import { Close as CloseIcon } from '@material-ui/icons'
import ReminderForm from 'components/common/ReminderForm'

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

class Maintain extends React.Component {
    state = {
        data: [],
        filter: 'active',
        isCreateModalOpen: false,
        editingMaintain: null,
        closingMaintain: null,
        reminderMaintain: null,
        isDataLoading: true,
    }
    columns = [
        {
            field: 'startDate',
            title: 'Дата начала',
        },
        {
            field: 'name',
            title: 'Название',
            defaultSort: 'asc',
            customFilterAndSearch: (filterValue, row, columnDef) =>
                Object.values(row).find(value => String(value).toLowerCase().includes(filterValue.toLowerCase().trim()))
        },
        {
            field: 'toolName',
            title: 'Инструмент или оснастка',
        },
        {
            field: 'materials',
            title: 'Расходные материалы',
        },
        {
            field: 'engineHours',
            title: 'Моточасы',
        },
    ]

    openCreateModal = () =>
        this.setState({ isCreateModalOpen: true })
    closeCreateModal = () =>
        this.setState({ isCreateModalOpen: false })

    openEditModal = maintain =>
        this.setState({ editingMaintain: maintain })
    closeEditModal = () =>
        this.setState({ editingMaintain: null })

    openConfirmationDialog = maintain =>
        this.setState({ closingMaintain: maintain })
    closeConfirmationDialog = () =>
        this.setState({ closingMaintain: null })

    openReminderModal = maintain =>
        this.setState({ reminderMaintain: maintain })
    closeReminderModal = () =>
        this.setState({ reminderMaintain: null })

    filterToActive = () =>
        this.setState({ filter: 'active' })
    filterToFinished = () =>
        this.setState({ filter: 'finished' })
    filterToAll = () =>
        this.setState({ filter: 'all' })

    componentDidMount() {
        api.getMaintain()
            .then(res => {
                this.setState({ data: res.data.map(item => {
                    return {
                        ...item,
                        toolName: item.tool ? item.tool.name : (item.rig ? item.rig.name : ''),
                    }
                }), isDataLoading: false })
            })
            .catch(error => console.error(error))
    }

    deleteMaintain = id =>
        api.deleteMaintain(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))

    editMaintain = maintain => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === maintain._id) {
                return maintain
            }
            return item
        }) })

        this.closeEditModal()
    }

    closeMaintain = (data) => {
        api.editMaintain(data)
            .then(() => this.closeConfirmationDialog())
            .catch(error => console.error(error))

        this.editMaintain(data)
    }

    addMaintain = maintain => {
        this.setState({ data: [{
            ...maintain,
            toolName: maintain.tool ? maintain.tool.name : ''
        }, ...this.state.data] })
        this.closeCreateModal()
    }

    addReminder = maintain => {
        this.setState({ data: this.state.data.map(item => {
            if (item._id === maintain._id) {
                return maintain
            }
            return item
        }) })

        this.closeReminderModal()
    }

    render() {
        const {
            data,
            isCreateModalOpen,
            editingMaintain,
            closingMaintain,
            filter,
            isDataLoading,
            reminderMaintain,
        } = this.state
        const { classes, user } = this.props

        return (
            <React.Fragment>
                <div className='container'>
                    <Table
                        title='Обслуживание'
                        columns={ this.columns }
                        data={ data }
                        filter={filter}
                        type='maintain'
                        editRow={ this.openEditModal }
                        deleteRow={ this.deleteMaintain }
                        onClose={ this.openConfirmationDialog }
                        onAddReminder={ this.openReminderModal }
                        filterToActive={ this.filterToActive }
                        filterToFinished={ this.filterToFinished }
                        filterToAll={ this.filterToAll }
                        role={ user.role }
                        loading={ isDataLoading }
                    />
                </div>

                <Modal
                    open={ isCreateModalOpen }
                    onClose={ this.closeCreateModal }
                >
                    <div className={ classes.modal }>
                        <Button onClick={this.closeCreateModal} className={classes.closeButton}><CloseIcon /></Button>
                        <CreateMaintain addMaintain={ this.addMaintain }/>
                    </div>
                </Modal>

                <Modal
                    open={ !!editingMaintain }
                    onClose={ this.closeEditModal }
                >
                    <div className={ classes.modal }>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditMaintain
                            maintain={ editingMaintain }
                            editMaintain={ this.editMaintain }
                        />
                    </div>
                </Modal>
                
                <Modal
                    open={!!reminderMaintain}
                    onClose={this.closeReminderModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeReminderModal} className={classes.closeButton}><CloseIcon /></Button>
                        <ReminderForm
                            maintain={ reminderMaintain }
                            addReminder={ this.addReminder }
                            type='maintain'
                        />
                    </div>
                </Modal>

                {closingMaintain ? <ConfirmationDialog 
                    data={ closingMaintain }
                    onClose={ this.closeConfirmationDialog }
                    close={ this.closeMaintain }
                    role={user.role}
                /> : null}
                
                <AddButton onClick={ this.openCreateModal }/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Maintain))
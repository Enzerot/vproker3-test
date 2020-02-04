import React from 'react'
import Table from 'components/common/Table'
import api from 'api'
import AddButton from 'components/common/AddButton'
import CreateDiscount from 'components/createModals/CreateDiscount'
import EditDiscount from 'components/editModals/EditDiscount'
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

class Discounts extends React.Component {
    state = {
        data: [],
        isCreateModalOpen: false,
        editingDiscount: null,
        isDataLoading: true,
    }
    columns = [
        {
            field: 'name',
            title: 'Название',
            defaultSort: 'asc',
            customFilterAndSearch: (filterValue, row, columnDef) =>
                Object.values(row).find(value => String(value).toLowerCase().includes(filterValue.toLowerCase().trim()))
        },
        {
            field: 'description',
            title: 'Описание',
        },
        {
            field: 'amount',
            title: 'Величина',
        },
    ]

    openCreateModal = () =>
        this.setState({ isCreateModalOpen: true })
    closeCreateModal = () =>
        this.setState({ isCreateModalOpen: false })

    openEditModal = tool =>
        this.setState({ editingDiscount: tool })
    closeEditModal = () =>
        this.setState({ editingDiscount: null })

    componentDidMount() {
        api.getDiscounts()
            .then(res =>
                this.setState({ data: res.data, isDataLoading: false }))
            .catch(error =>
                console.error(error))
    }

    deleteDiscount = id =>
        api.deleteDiscount(id)
            .then(this.setState({ data: this.state.data.filter(item => item._id !== id) }))
            .catch(error => console.error(error))

    editDiscount = discount => {
        const { data } = this.state
        this.setState({ data: data.map(item => {
            if (item._id === discount._id) {
                return discount
            }
            return item
        }) })
        this.closeEditModal()
    }

    addDiscount = discount => {
        this.setState({ data: [...this.state.data].concat([discount]) })
        this.closeCreateModal()
    }

    render() {
        const { data, isCreateModalOpen, editingDiscount, isDataLoading } = this.state
        const { classes, user } = this.props
        return (
            <React.Fragment>
                <div className='container'>
                    {user.role === 'admin' ? (
                        <Table
                            title='Скидки'
                            columns={ this.columns }
                            data={ data }
                            type='discounts'
                            editRow={ this.openEditModal }
                            deleteRow={ this.deleteDiscount }
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
                        <CreateDiscount addDiscount={ this.addDiscount }/>
                    </div>
                </Modal>

                <Modal
                    open={!!editingDiscount}
                    onClose={this.closeEditModal}
                >
                    <div className={classes.modal}>
                        <Button onClick={this.closeEditModal} className={classes.closeButton}><CloseIcon /></Button>
                        <EditDiscount
                            discount={ editingDiscount }
                            editDiscount={ this.editDiscount }
                        />
                    </div>
                </Modal>
                
                <AddButton onClick={this.openCreateModal}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(requireAuth(Discounts))
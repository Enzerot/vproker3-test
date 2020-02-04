import React from 'react'
import MaterialTable, { MTableToolbar } from 'material-table'
import { 
    Clear,
    DeleteOutline,
    ChevronRight,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    ChevronLeft,
    Search,
    ArrowUpward,
    Remove,
    ViewColumn,
    Done,
    ReportProblem,
    Add,
    AlarmAdd,
    CloudDownload,
} from '@material-ui/icons'
import {
    withStyles,
    ButtonGroup,
    Button,
} from '@material-ui/core'
import { DateTime } from 'luxon'
import {
    ClientDetail,
    MaintainDetail,
    OrderDetail,
    ToolDetail,
    RigDetail,
    ConsumableDetail,
    DiscountDetail,
    InventoryDetail,
} from 'components/common/TableDetailRows'

const styles = theme => ({
    icon: {
        width: 25,
        height: 25,
        padding: 5,
    },
    activeButton: {
        color: theme.palette.secondary.main
    }
})

const localization = {
    body: {
        emptyDataSourceMessage: 'Нет данных'
    },
    header: {
        actions: ''
    },
    toolbar: {
        searchTooltip: 'Поиск',
        searchPlaceholder: 'Поиск',
        showColumnsTitle: 'Показать колонки',
        addRemoveColumns: 'Добавить или удалить колонки',
    },
    pagination: {
        labelDisplayedRows: '{from}-{to} из {count}',
        labelRowsSelect: 'строк',
        labelRowsPerPage: 'Строк в странице',
        firstAriaLabel: 'Первая страница',
        firstTooltip: 'Первая страница',
        previousAriaLabel: 'Предыдущая страница',
        previousTooltip: 'Предыдущая страница',
        nextAriaLabel: 'Следующая страница',
        nextTooltip: 'Следующая страница',
        lastAriaLabel: 'Последняя страница',
        lastTooltip: 'Последняя страница',
    }
}

class Table extends React.Component {
    tableIcons = {
        Clear: () => <Clear className={this.props.classes.icon}/>,
        Delete: () => <DeleteOutline className={this.props.classes.icon}/>,
        DetailPanel: () => <ChevronRight className={this.props.classes.icon}/>,
        Edit: () => <Edit className={this.props.classes.icon}/>,
        Filter: () => <FilterList className={this.props.classes.icon}/>,
        FirstPage: () => <FirstPage className={this.props.classes.icon}/>,
        LastPage: () => <LastPage className={this.props.classes.icon}/>,
        NextPage: () => <ChevronRight className={this.props.classes.icon}/>,
        PreviousPage: () => <ChevronLeft className={this.props.classes.icon}/>,
        ResetSearch: () => <Clear className={this.props.classes.icon}/>,
        Search: () => <Search className={this.props.classes.icon}/>,
        SortArrow: () => <ArrowUpward className={this.props.classes.icon}/>,
        ThirdStateCheck: () => <Remove className={this.props.classes.icon}/>,
        ViewColumn: () => <ViewColumn className={this.props.classes.icon}/>,
        Done: () => <Done className={this.props.classes.icon}/>,
        ReportProblem: () => <ReportProblem className={this.props.classes.icon}/>,
        Add: () => <Add className={this.props.classes.icon}/>,
        CloudDownload: () => <CloudDownload className={this.props.classes.icon}/>,
    }

    getActions = () => {
        const {
            type,
            deleteRow,
            editRow,
            onClose,
            role,
            filter,
            onAddToBlackList,
            onRemoveFromBlackList,
            onAddAmount,
            onAddReminder,
        } = this.props
        const baseActions = [
            {
                icon: this.tableIcons.Edit,
                tooltip: 'Изменить',
                onClick: (event, rowData) => editRow(rowData)
            },
            {
                icon: this.tableIcons.Delete,
                tooltip: 'Удалить',
                onClick: (event, rowData) => deleteRow(rowData._id)
            }
        ]
        const closeAction = rowData => ({
            icon: this.tableIcons.Done,
            tooltip: 'Закрыть',
            onClick: (event, rowData) => onClose(rowData),
            disabled: !!rowData.finishDate,
        })
        const downloadHistory = {
            icon: this.tableIcons.CloudDownload,
            tooltip: 'Скачать историю',
            isFreeAction: true,
            onClick: this.props.openHistoryDialog
        }
        const addToBlackList = rowData => ({
            icon: this.tableIcons.ReportProblem,
            tooltip: 'Добавить в чёрный список',
            onClick: (event, rowData) => onAddToBlackList(rowData._id),
            disabled: rowData.isClientInBlackList,
        })
        const removeFromBlackList = rowData => ({
            icon: this.tableIcons.Delete,
            tooltip: 'Удалить из чёрного списка',
            onClick: (event, rowData) => onRemoveFromBlackList(rowData._id),
        })
        const addAmount = rowData => ({
            icon: this.tableIcons.Add,
            tooltip: 'Добавить',
            onClick: (event, rowData) => onAddAmount(rowData),
        })
        const addReminder = rowData => ({
            icon: () => <AlarmAdd className={rowData.remindTo ? `${this.props.classes.icon} ${this.props.classes.activeButton}` : this.props.classes.icon}/>,
            tooltip: 'Добавить напоминалку',
            onClick: (event, rowData) => onAddReminder(rowData),
        })

        switch (type) {
            case 'tool':
                return baseActions
            case 'rig':
                return baseActions
            case 'inventory':
                return baseActions
            case 'consumable':
                return role === 'admin' ? [addAmount, ...baseActions] : [addAmount]
            case 'client':
                return role === 'user' ? [] :
                    filter === 'blackList' ?
                        [removeFromBlackList, ...baseActions] :
                        [addToBlackList, ...baseActions]
            case 'discounts':
                return baseActions
            case 'maintain':
                return role === 'admin' ?
                    (filter !== 'finished' ? [addReminder, closeAction, ...baseActions] : baseActions) :
                    (filter !== 'finished' ? [addReminder, closeAction] : null)
            case 'order':
                return role === 'admin' ?
                    (filter !== 'finished' ? [addReminder, closeAction, downloadHistory, ...baseActions] : [...baseActions, downloadHistory]) :
                    (filter !== 'finished' ? [addReminder, closeAction, downloadHistory] : [downloadHistory])
            default:
                throw new Error(`Unknown table type: ${type}`)
        }
    }

    renderDetail = data => {
        switch (this.props.type) {
            case 'tool': 
                return <ToolDetail data={data}/>
            case 'rig': 
                return <RigDetail data={data}/>
            case 'consumable': 
                return <ConsumableDetail data={data}/>
            case 'client':
                return <ClientDetail data={data}/>
            case 'discounts':
                return <DiscountDetail data={data}/>
            case 'maintain':
                return <MaintainDetail data={data}/>
            case 'order':
                return <OrderDetail data={data}/>
            case 'inventory': 
                return <InventoryDetail data={data}/>
            default: 
                throw new Error(`Unknown table type: ${this.props.type}`)
        }
    }

    filterData = data => {
        switch (this.props.filter || 'all') {
            case 'active':
                return data.filter(item => !item.finishDate)
            case 'finished':
                return data.filter(item => !!item.finishDate)
            case 'blackList':
                return data.filter(item => !!item.isClientInBlackList)
            case 'birthdays':
                return data.filter(item => {
                    const today = new Date()
                    const birthDate = new Date(item.birthDate)
                    return (birthDate.getDate() === today.getDate()) && (birthDate.getMonth() === today.getMonth())
                })
            case 'all':
                return data
            default:
                throw new Error('Unknown type of filtering')
        }
    }

    convertDate = data => {
        const { type } = this.props
        switch (type) {
            case 'client':
                return data.map(item => {
                    return {
                        ...item,
                        createdAt: this.convertDateString(item.createdAt),
                        birthDate: this.convertDateString(item.birthDate),
                    }
                })
            case 'order':   
                return data.map(item => {
                    return {
                        ...item,
                        startDate: this.convertDateString(item.startDate),
                        finishDate: this.convertDateString(item.finishDate),
                    }
                })
            case 'maintain':   
                return data.map(item => {
                    return {
                        ...item,
                        startDate: this.convertDateString(item.startDate),
                        finishDate: this.convertDateString(item.finishDate),
                    }
                })
            case 'tool':   
                return data.map(item => {
                    return {
                        ...item,
                        purchased: this.convertDateString(item.purchased),
                    }
                })
            case 'inventory':   
                return data.map(item => {
                    return {
                        ...item,
                        purchaseDate: this.convertDateString(item.purchaseDate),
                    }
                })
            case 'discounts':
                return data
            case 'rig':
                return data
            case 'consumable':
                return data
            default: 
                throw new Error(`Unknown table type: ${type}`)
        }
    }

    convertDateString = dateString => {
        if (dateString) {
            const date = new Date(dateString)
            return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm:ss')
        }
        return dateString
    }

    render() {
        const {
            data,
            columns,
            title,
            type,
            classes,
            filterToActive,
            filterToFinished,
            filterToBirthdays,
            filterToAll,
            filterToBlackList,
            filter,
            role,
            loading,
        } = this.props
        let filteredData = this.filterData(data)

        return (
            type === 'order' || type === 'maintain' ? (
                <MaterialTable
                    key={ filteredData }
                    title={ title }
                    data={ this.convertDate(filteredData) }
                    columns={ columns }
                    icons={ this.tableIcons }
                    actions={ this.getActions() }
                    localization={ localization }
                    detailPanel={ this.renderDetail }
                    isLoading={ loading }
                    options={window.innerWidth < 1080 ? {
                        pageSize: filter === 'active' ? filteredData.length : 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
                        columnsButton: true,
                    } : {
                        pageSize: filter === 'active' ? filteredData.length : 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
                        actionsColumnIndex: -1,
                        columnsButton: true,
                    }}
                    components={{
                        Toolbar: props => (
                        <div>
                            <MTableToolbar {...props} />
                            {role === 'admin' ? (
                                <div className='filter-row'>
                                    <ButtonGroup
                                        fullWidth
                                    >
                                        {filter === 'active' ? 
                                            <Button onClick={filterToActive} className={classes.activeButton}>Активные</Button> :
                                            <Button onClick={filterToActive}>Активные</Button>
                                        }
                                        {filter === 'finished' ? 
                                            <Button onClick={filterToFinished} className={classes.activeButton}>История</Button> :
                                            <Button onClick={filterToFinished}>История</Button>
                                        }
                                        {filter === 'all' ? 
                                            <Button onClick={filterToAll} className={classes.activeButton}>Все</Button> :
                                            <Button onClick={filterToAll}>Все</Button>
                                        }
                                    </ButtonGroup>
                                </div>
                            ) : null}
                        </div>
                        )
                    }}
                />
            ) : type === 'client' ? (
                <MaterialTable
                    title={ title }
                    key={ filteredData }
                    data={ this.convertDate(filteredData) }
                    columns={ columns }
                    icons={ this.tableIcons }
                    actions={ this.getActions() }
                    localization={ localization }
                    detailPanel={ this.renderDetail }
                    isLoading={ loading }
                    options={window.innerWidth < 1080 ? {
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
                        emptyRowsWhenPaging: false,
                        columnsButton: true,
                    } : {
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
                        actionsColumnIndex: -1,
                        emptyRowsWhenPaging: false,
                        columnsButton: true,
                    }}
                    components={{
                        Toolbar: props => (
                        <div>
                            <MTableToolbar {...props} />
                            {role === 'admin' ? (
                                <div className='filter-row'>
                                    <ButtonGroup
                                        fullWidth
                                    >
                                        {filter === 'all' ?
                                            <Button onClick={filterToAll} className={classes.activeButton}>Все</Button> :
                                            <Button onClick={filterToAll}>Все</Button>
                                        }
                                        {filter === 'blackList' ?
                                            <Button onClick={filterToBlackList} className={classes.activeButton}>Чёрный список</Button> :
                                            <Button onClick={filterToBlackList}>Чёрный список</Button>
                                        }
                                        {filter === 'birthdays' ?
                                            <Button onClick={filterToBirthdays} className={classes.activeButton}>Именинники</Button> :
                                            <Button onClick={filterToBirthdays}>Именинники</Button>
                                        }
                                    </ButtonGroup>
                                </div>
                            ) : null}
                        </div>
                        )
                    }}
                />
            ) : (
                <MaterialTable
                    title={ title }
                    data={ this.convertDate(data) }
                    columns={ columns }
                    icons={ this.tableIcons }
                    actions={ this.getActions() }
                    localization={ localization }
                    detailPanel={ this.renderDetail }
                    isLoading={ loading }
                    options={window.innerWidth < 1080 ? {
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
                        emptyRowsWhenPaging: false,
                        columnsButton: true
                    } : {
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
                        actionsColumnIndex: -1,
                        emptyRowsWhenPaging: false,
                        columnsButton: true,
                    }}
                />
            )
        )
    }
}

export default withStyles(styles)(Table)
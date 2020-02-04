import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
} from '@material-ui/core'
import DateTimePicker from 'components/common/DateTimePicker'
import api from 'api'

class ConfirmationDialog extends React.Component {
    state = {
        startDate: new Date(1),
        finishDate: new Date()
    }

    handleChangeStartDate = value =>
        this.setState({ startDate: new Date(value) })
    handleChangeFinishDate = value =>
        this.setState({ finishDate: new Date(value) })

    downloadHistory = () => {
        api.downloadHistory(this.state.startDate.toString(), this.state.finishDate.toString())
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'history.csv')
                document.body.appendChild(link)
                link.click()
            })
            .catch(error => console.error(error))
        this.props.onClose()
    }
        

    render() {
        const { startDate, finishDate } = this.state

        return (
            <Dialog
                open
                onClose={this.props.onClose}
                className='confirmation-dialog'
            >
                <DialogTitle>Скачать историю заказов</DialogTitle>
                <DialogContent>
                    <form>
                        <DateTimePicker
                            value={startDate}
                            onChange={this.handleChangeStartDate}
                            label='Начало'
                            fullWidth
                        />
                        <DateTimePicker
                            value={finishDate}
                            onChange={this.handleChangeFinishDate}
                            label='Конец'
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ this.downloadHistory }>
                        Скачать
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default ConfirmationDialog
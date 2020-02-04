import React from 'react'
import { withStyles } from '@material-ui/styles'
import { Add as AddIcon } from '@material-ui/icons'
import { Fab } from '@material-ui/core'

const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: 30,
        right: 30,
        zIndex: 100,
    }
})

class AddButton extends React.Component {
    render () {
        const { classes, onClick } = this.props 
        return (
            <Fab 
                className={classes.fab} 
                color='secondary' 
                onClick={onClick}
            >
                <AddIcon />
            </Fab>
        )
    }
}

export default withStyles(styles)(AddButton)
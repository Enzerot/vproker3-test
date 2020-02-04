import React from 'react'
import {
    Button,
    CircularProgress,
} from '@material-ui/core'

export default class LoadingButton extends React.Component {
    render() {
        const { isLoading, onClick, color, disabled, children, fullWidth } = this.props
        return (
            <div className='loading-button-wrapper'>
                <Button
                    onClick={ onClick }
                    color={ color }
                    disabled={ disabled || isLoading }
                    fullWidth={ fullWidth }
                >
                    { children }
                </Button>
                {isLoading && <CircularProgress size={24} className='progress' />}
            </div>
        )
    }
}
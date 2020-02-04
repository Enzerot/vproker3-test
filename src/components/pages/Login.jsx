import React from 'react'
import api from 'api'
import {
    TextField,
    Button,
    FormControlLabel,
    Switch,
} from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import validation from 'utils/validation'

class Login extends React.Component {
    state = {
        login: '',
        loginError: '',
        password: '',
        passwordError: '',
        rememberMe: false,
        redirect: false,
        error: false,
    }

    handleChangeLogin = e =>
        this.setState({ login: e.target.value, loginError: validation.validateLogin(e.target.value), error: false })
    handleChangePassword = e =>
        this.setState({ password: e.target.value, passwordError: validation.validatePassword(e.target.value), error: false })
    handleChangeRememberMe = e =>
        this.setState({ rememberMe: e.target.checked })

    submit = () =>
        api.auth(this.state.login, this.state.password, this.state.rememberMe)
            .then(() => {
                this.setState({ redirect: true })
                window.location.reload()
            })
            .catch(error => this.setState({ error: true }))

    render() {
        const { 
            login,
            loginError,
            password,
            passwordError,
            redirect,
            error
        } = this.state
        return (
            <div className='container'>
                <form className='login-form'>
                    <TextField
                        label='Логин'
                        value={ login }
                        onChange={ this.handleChangeLogin }
                        error={ loginError || error }
                        helperText={ loginError }
                    />
                    <TextField
                        label='Пароль'
                        value={ password }
                        type='password'
                        onChange={ this.handleChangePassword }
                        error={ passwordError || error }
                        helperText={ passwordError }
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.rememberMe}
                                onChange={this.handleChangeRememberMe}
                                value={this.state.rememberMe}
                                color='primary'
                            />
                        }
                        label='Запомнить меня'
                    />
                    <Button
                        onClick={ this.submit }
                        disabled={ loginError || passwordError || !login || !password || error }
                    >Войти</Button>
                </form>
                {redirect && <Redirect to='/' />}
            </div>
        )
    }
}

export default Login
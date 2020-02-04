import React from 'react'
import { Redirect } from 'react-router-dom'
import api from 'api'

export default function requireAuth(ComponentToProtect) {
  return class extends React.Component {
    state = {
        loading: true,
        redirect: false,
        user: null,
    }

    componentDidMount() {
        api.checkToken()
            .then(res => { this.setState({ loading: false, user: res.data }) })
            .catch(error => { this.setState({ loading: false, redirect: true }) })
    }
    render() {
      const { loading, redirect } = this.state
      
      if (loading) {
        return null
      }
      if (redirect) {
        return <Redirect to='/login' />
      }
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props} user={this.state.user} />
        </React.Fragment>
      )
    }
  }
}
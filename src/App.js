import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import {
  ActiveOrders,
  Clients,
  Tools,
  Maintain,
  Discounts,
  Rigs,
  Consumables,
  Inventory,
  Login,
} from 'components/pages'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { ThemeProvider } from '@material-ui/styles'
import theme from 'styles/theme'

class App extends React.Component {
  componentDidMount() {
    let preloader = document.getElementsByClassName('preloader')[0]
    setTimeout(() => {
      preloader.classList.add('loaded')
    }, 1000)
    setTimeout(() => {
      preloader.classList.add('loaded-none')
    }, 1300)
  }

  render() {
    return (
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Header />
            <div className='container'>
                <Route path='/' exact component={ActiveOrders} />
                <Route path='/clients' exact component={Clients} />
                <Route path='/tools' exact component={Tools} />
                <Route path='/rigs' exact component={Rigs} />
                <Route path='/consumables' exact component={Consumables} />
                <Route path='/maintain' exact component={Maintain} />
                <Route path='/discounts' exact component={Discounts} />
                <Route path='/inventory' exact component={Inventory} />
                <Route path='/login' exact component={Login} />
            </div>
            <Footer />
          </BrowserRouter>
        </ThemeProvider>
    )
  }
}

export default App;
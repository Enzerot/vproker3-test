import React from 'react'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import requireAuth from 'requireAuth'
import { Button, SwipeableDrawer, List, ListItem } from '@material-ui/core'
import { ExitToApp as ExitIcon, Menu as MenuIcon } from '@material-ui/icons'

    const styles = theme => ({
    button: {
        color: '#fff',
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        margin: '5px 30px',
        height: 45,
        minWidth: 45,
        borderRadius: '50%',
        padding: 5,
        '&:hover': {
        backgroundColor: theme.palette.secondary.main
        }
    }
    })

class Header extends React.Component {
  state = {
    anchorEl: null,
    mouseOverButton: false,
    mouseOverMenu: false,
    isDrawerOpen: false,
  }

  handleClose = () => {
    this.setState({ mouseOverButton: false, mouseOverMenu: false, anchorEl: null })
  }

  logout = () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // eslint-disable-next-line no-restricted-globals
    location.reload()
  }

  openDrawer = () => this.setState({ isDrawerOpen: true })
  closeDrawer = () => this.setState({ isDrawerOpen: false })

  render() {
    const { classes, user } = this.props
    
    return (
      <div className='header'>
        {window.innerWidth > 1030 ? 
            <nav>
                <ul className='nav-ul'>
                    <li>
                        <Link to='/'>Заказы</Link>
                    </li>
                    <li>
                        <Link to='/clients'>Клиенты</Link>
                    </li>
                    {user.role === 'admin' && <li>
                        <Link to='/tools'>Инструменты</Link>
                    </li>}
                    {user.role === 'admin' && <li>
                        <Link to='/rigs'>Оснастка</Link>
                    </li>}
                    {user.role === 'admin' && <li>
                        <Link to='/consumables'>Расходники</Link>
                    </li>}
                    <li>
                        <Link to='/maintain'>Обслуживание</Link>
                    </li>
                    {user.role === 'admin' && <li>
                        <Link to='/discounts'>Скидки</Link>
                    </li>}
                    {user.role === 'admin' && <li>
                        <Link to='/inventory'>Инвентарь</Link>
                    </li>}
                </ul>
            </nav> : <Button onClick={this.openDrawer} className={classes.button}><MenuIcon /></Button>}
        <Button
            className={classes.button}
            onClick={this.logout}
        ><ExitIcon /></Button>
        <SwipeableDrawer
            open={this.state.isDrawerOpen}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}
        >
          <div
            className='drawer'
            role="presentation"
            onClick={this.closeDrawer}
            onKeyDown={this.closeDrawer}
            >
            <List>
                <ListItem button>
                    <Link to='/'>Заказы</Link>
                </ListItem>
                <ListItem button>
                    <Link to='/clients'>Клиенты</Link>
                </ListItem>
                {user.role === 'admin' && <ListItem button>
                    <Link to='/tools'>Инструменты</Link>
                </ListItem>}
                {user.role === 'admin' && <ListItem button>
                  <Link to='/rigs'>Оснастка</Link>
                </ListItem>}
                {user.role === 'admin' && <ListItem button>
                  <Link to='/consumables'>Расходники</Link>
                </ListItem>}
                <ListItem button>
                    <Link to='/maintain'>Обслуживание</Link>
                </ListItem>
                {user.role === 'admin' && <ListItem button>
                    <Link to='/discounts'>Скидки</Link>
                </ListItem>}
                {user.role === 'admin' && <ListItem button>
                    <Link to='/inventory'>Инвентарь</Link>
                </ListItem>}
            </List>
            </div>
        </SwipeableDrawer>
      </div>
    )
  }
}

export default withStyles(styles)(requireAuth(Header))

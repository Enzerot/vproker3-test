import React from 'react'
import logotype from 'img/logotype.png'

export default class Footer extends React.Component {
    render() {
        return(
            <footer>
                <div className="container">
                    <a href="https://vprok2.ru/">
                        <img src={logotype} alt='vprok'/>
                    </a>
                    <span className='address'>Создано <a href='https://vk.com/enzerot'>enzerot</a>'ом</span>
                </div>
            </footer>
        )
    }
}
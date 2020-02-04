import React from 'react'

export default ({ tool }) => (
    <ul className='tool-info'>
        <li>Сутки: {tool.dayPrice}</li>
        <li>Час: {tool.hourPrice}</li>
        <li>Смена: {tool.workShiftPrice}</li>
        <li>Залог: {tool.pledge}</li>
        <li>Описание: {tool.description}</li>
    </ul>
)
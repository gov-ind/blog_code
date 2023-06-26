import React from 'react';
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props =>
  <div className='page-title-wrapper'>
    <h1 className='page-title'>{props.title}</h1>
    <div style={{ 'display': 'flex', 'align-items': 'center' }}>
      {props.date ?
        <>
          <FontAwesomeIcon icon={faCalendar} className='calendar-icon' />
          <div className='date'>{props.date}</div>
        </>:
          null}
      {props.cat.map(cat => <div className='chip'>{cat}</div>)}
    </div>
  </div>

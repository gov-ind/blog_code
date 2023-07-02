import React from 'react';
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
  let cls = 'page-title-wrapper'
  if (props.className) {
    cls += ' ' + props.className
  }
  return (
    <div className={cls}>
      <h1 className='page-title'>{props.title}</h1>
      <div className='page-title-extras'>
        {props.date ?
          <>
            <FontAwesomeIcon icon={faCalendar} className='calendar-icon' />
            <div className='date'>{props.date}</div>
          </>:
            null}
        {props.cat ? props.cat.map(cat => <div key={cat} className='chip'>{cat}</div>) : null}
      </div>
    </div>
  );
}

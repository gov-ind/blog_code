import React, { Component } from 'react';
import { data } from './index';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Chip extends Component {
  render() {
    return <div className='chip'>crypto</div>
  }
}

class Item extends Component {
  render() {
    return (
      <div className='home-list-item' onClick={() => this.props.history.push(this.props.route)}>
        <li>{this.props.title}</li>
        <div className='calendar'>
          <FontAwesomeIcon icon={faCalendar} className='calendar-icon' />
          <div className='date'>{this.props.date}</div>
        
        {this.props.cat.map(cat => <div className='chip'>{cat}</div>)}
        </div>
      </div>
    );
  }
}

function Home() {
  const history = useHistory();

  return (
      <div className='home content'>
        <ul className='home-list'>
          {data.slice(1).filter(val => val.title != 'About Me').map(({ Page, route, title, cat, date }) =>
            <Item key={title} history={history} route={route} title={title} cat={cat} date={date} />)}
        </ul>
      </div>
  );
}

export default Home;


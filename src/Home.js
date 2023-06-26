import React, { Component, useState } from 'react';
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
          <div className='category-wrapper'>
            {this.props.cat.map(cat => <span className='chip'>{cat}</span>)}
          </div>
        </div>
      </div>
    );
  }
}

function Home() {
  const history = useHistory();
  const [isPost, setIsPost] = useState(true);

  return (
      <div className='home content'>
        <div className='top-chip-wrapper'>
          <span className='chip top-chip' onClick={() => setIsPost(true)}>
            Posts
          </span>
          <span className='chip top-chip top-chip-right' onClick={() => setIsPost(false)}>
            Writeups
          </span>
        </div>
        <ul className='home-list'>
          {data.slice(1)
            .filter(val => val.title != 'About Me')
            .filter(val => {
              if (isPost) {
                return val.type === 'post';
              }
              return val.type !== 'post';
            })
            .map(({ Page, route, title, cat, date }) =>
            <Item key={title} history={history} route={route} title={title} cat={cat} date={date} />)}
        </ul>
      </div>
  );
}

export default Home;


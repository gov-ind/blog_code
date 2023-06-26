import React, { Component } from 'react';
//import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { data, getTitle } from './index';
import { useHistory } from 'react-router-dom';

let top = -1;

/*export class Header extends Component {
  state = {
    hidden: false
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this), true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this), true);
  }

  handleScroll(a) {//debugger;
    let newTop = a.target.scrollTop;
    if (top == -1)
        top = newTop

    else {
        if (newTop > top) {
            console.log('down');
            if (!this.state.hidden)
                this.setState({ hidden: true });
        }
        else {
            console.log('up');
            if (this.state.hidden)
                this.setState({ hidden: false });
        }
        top = newTop;
    }

  }

  scrollDown() {
    console.log('down');
  }

  scrollUp() {
    console.log('up');
  }

  render() {
      const history = useHistory();
      return (
          <div className='header'>
            <nav>
              <ul className='header-name'>Home</ul>
              <ul className='header-name'>About</ul>               
            </nav>
          </div>
      );
  }
}*/

export function Header() {
  const history = useHistory();

  return (
    <div className='header'>
      <nav>
        <ul className='header-name' onClick={() => history.push('/')}>Home</ul>
        <ul className='header-name' onClick={() => history.push('./about')}>About</ul>               
      </nav>
    </div>
  );
}

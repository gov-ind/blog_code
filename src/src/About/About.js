import React, { Component } from 'react';
import Title from '../Title';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class About extends Component {
  render() {
    return (
        <div className='content'>
          <div className='page-title-wrapper-2'>
            <h1 className='page-title-2'>{this.props.title}</h1>
          </div>
          <p style={{'margin-bottom': '3em'}}>
          Hello, I'm Govind: a professional button-styler by day and a CTF player by night. In this blog, I mostly post writeups to some interesting crypto, rev, and algo challenges that I come across in CTFs and coding competitions. I also like to write miscellaneous technical notes here for future reference. Feel free to contact me if you're intereseted in teaming up for a CTF or codejam!
          </p>
          <div className='icon-wrapper'>
            <FontAwesomeIcon icon={faGithub} className='calendar-icon' />
            <div className='icon-label'>
              <a href="https://github.com/gov-ind">Github</a>
            </div>
          </div>
          <div className='icon-wrapper'>
            <FontAwesomeIcon icon={faEnvelope} className='calendar-icon' />
            <div className='icon-label'>
              <a href="mailto: govind.reg.92@gmail.com">Email</a>
            </div>
          </div>
        </div>
    );
  }
}

export default About;

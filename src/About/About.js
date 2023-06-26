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
          Hello, I'm Govind, an ML engineer and aspiring researcher. Until a few years ago, I used to be a professional button-styler by day and a CTF player by night. Although I still love CTFs, I don't get much time to play them that often anymore. This blog started out as a collection of CTF writeups, but these days it's more of a journal for me to scribble down some AI-related musings.
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

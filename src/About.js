import React, { Component } from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class About extends Component {
  render() {
    return (
      <div className="content">
        <div className="page-title-wrapper-2">
          <h1 className="page-title-2">{this.props.title}</h1>
        </div>
        <p style={{ "margin-bottom": "3em" }}>
          I'm Govind, and I love machine learning and cybersecurity. I currently
          work at Litmus7, where I lead the engineering team to tackle
          challenges in the ML model development lifecycle, ranging from data
          engineering, model troubleshooting, and model monitoring.
          <br />
          <br />
          Till 2019, I worked as front-end developer, and somewhere along the
          way, I got involved in Capture The Flags (CTFs). This blog started out
          as a collection of CTF writeups, but these days I don't find much time
          to play in many CTFs, so it's more of a journal for me to scribble
          down some AI-related musings.
        </p>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faGithub} className="calendar-icon" />
          <div className="icon-label">
            <a href="https://github.com/gov-ind">Github</a>
          </div>
        </div>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faEnvelope} className="calendar-icon" />
          <div className="icon-label">
            <a href="mailto: govind.reg.92@gmail.com">Email</a>
          </div>
        </div>
      </div>
    );
  }
}

export default About;

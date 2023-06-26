import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { Header } from './Header';
import Pico2021 from './Pico2021';
import UT2021 from './UT2021';
import BabySign from './BabySign/BabySign';
import Lunch from './Lunch/Lunch';
import PickledOnions from './PickledOnions/PickledOnions';
import Sub from './Sub/Sub';
import MLHack from './MLHack/MLHack';
import Cheapest from './Cheapest/Cheapest';

import './index.css'
import Home from './Home';
import About from './About/About';

import { Provider } from 'react-redux';
//import store from './store';

const Wrapper = Page => props =>
    <Page {...props} />;

export const data = [
  { Page: Wrapper(Home), route: '/', title: 'Home' },
  //{ Page: Wrapper(Pico2021), route: '/picoctf_2021', title: 'PicoCTF 2021' },
  //{ Page: Wrapper(UT2021), route: '/utctf_2021', title: 'UTCTF 2021' },
  
  { Page: Wrapper(Cheapest), route: '/cheapest_cookies_2022', title: 'Cheapest Cookies 2 / An Introduction to the Breadth-First Search', cat: ['tjctf', 'algo'], 'date': '15/04/2022' },
  { Page: Wrapper(MLHack), route: '/mlhack_2022', title: 'How To "Hack" An ML Hackathon\'s Leaderboard', cat: ['jobathon', 'misc'], 'date': '24/04/2022' },
  { Page: Wrapper(PickledOnions), route: '/pickled_onions_redpwn_2021', title: 'Pickled Onions', cat: ['redpwn', 'rev'], 'date': '13/07/2021' },
  { Page: Wrapper(Sub), route: '/the_substitution_game_redpwn_2021', title: 'The Substitution Game', cat: ['redpwn', 'algo'], 'date': '13/07/2021' },
  { Page: Wrapper(Lunch), route: '/lunch_with_the_cia_hsctf_2021', title: 'Lunch With The CIA / A Bin-Packing Heuristic', cat: ['hsctf', 'algo'], 'date': '19/06/2021' },
  { Page: Wrapper(BabySign), route: '/babysign_thc_2021', title: 'BabySign', cat: ['CTF', 'crypto'], 'date': '19/06/2021' },
  { Page: About, route: '/about', 'title': 'About Me', cat: [] }
];

export const getTitle = a => {
    let target = '/' + a.target.href.split('/').slice(-1)[0].split('#')[0];
    return Object.entries(data).filter(([k, v]) =>
        target == v.route
    ).map(([k, v]) => v.title);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Home',
      menuShown: false
    };
  }

  hideMenu() {
    this.setState({ menuShown: false });
  }

  showMenu() {
    this.setState({ menuShown: true });
  }

  toggleMenu() {
    this.setState({ menuShown: !this.state.menuShown });
  }

  setTitle(title) {
    this.setState({ title: title });
  }

  navigate(title) {
    // this.setTitle(title);
    this.hideMenu();
  }

  render() {
    return (
      <Router>
        <div className='wrapper'>
          <Header
              menuShown={this.state.menuShown}
              title={this.state.title}
              onClick={this.toggleMenu.bind(this)}
          />
          <div
            className={'main-wrapper' + (this.state.menuShown ? ' overlay': '')} >
          {/* A <Switch> looks through its children <Route>s and
               renders the first one that matches the current URL. */}
          <Switch>
            {data.map(({ Page, route, cat, date, title }, _) => {
                return (
                  <Route path={route} exact>
                    <Page
                      title={title}
                      cat={cat}
                      date={date}
                      overlay={this.state.menuShown}
                      onClick={this.hideMenu.bind(this)} />
                  </Route>
                );
            })}
          </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

//const root = ReactDOM.createRoot(document.getElementById('root'));
/*root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/

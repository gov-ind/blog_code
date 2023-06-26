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
import Beaver from './Beaver/Beaver';
import HSCTF from './HSCTF/HSCTF';
import OCR from './Google/OCR';

import AdvDTree from './posts/ae_dtree/AdvDTree';
import Wasserstein from './posts/wasserstein_distance/Wasserstein';
import ANN_1_RPD from './posts/ann/ANN_1_RPD';

import './index.css'
import Home from './Home';
import About from './About/About';

import { Provider } from 'react-redux';
import QDP from './posts/q_dp/QDP';
//import store from './store';

const Wrapper = Page => props =>
    <Page {...props} />;

export const data = [
  { Page: Wrapper(Home), route: '/', title: 'Home' },
  //{ Page: Wrapper(Pico2021), route: '/picoctf_2021', title: 'PicoCTF 2021' },
  //{ Page: Wrapper(UT2021), route: '/utctf_2021', title: 'UTCTF 2021' },
  
  //{ Page: Wrapper(ANN_1_RPD), type: 'post', route: '/ann_1_rpd', title: 'ANN Algorithms Part 1: KD Trees and RPDs', cat: ['ml', 'stats'], 'date': '11/05/2023' },
  { Page: Wrapper(Wasserstein), type: 'post', route: '/wasserstein_distance', title: 'The Wasserstein Distance For Dummies', cat: ['ml', 'stats'], 'date': '11/05/2023' },
  { Page: Wrapper(QDP), type: 'post', route: '/qdp', title: 'Q-Values, Dynamic Programming, And The Bellman Equation', cat: ['ml', 'rl'], 'date': '08/05/2023' },
  { Page: Wrapper(AdvDTree), type: 'post', route: '/gradientless_ae', title: 'Adversarial Examples Against Gradientless Models', cat: ['ml'], 'date': '30/04/2023' },
  { Page: Wrapper(OCR), route: '/ocr_2022', title: 'OCR Write-up', cat: ['gctf', 'misc', 'ml'], 'date': '03/07/2022' },
  { Page: Wrapper(HSCTF), route: '/hsctf_2022', title: 'HSCTF 2022 Algo Write-ups', cat: ['hsctf', 'algo'], 'date': '11/06/2022' },
  { Page: Wrapper(Beaver), route: '/beaver_feaver_2022', title: 'Beaver Feaver Write-up', cat: ['secfest', 'rev'], 'date': '02/06/2022' },
  //{ Page: Wrapper(Cheapest), route: '/cheapest_cookies_2022', title: 'Cheapest Cookies 2 Write-up / The Path To Djikstra\'s Algorithm', cat: ['tjctf', 'algo'], 'date': '15/04/2022' },
  { Page: Wrapper(MLHack), type: 'post', route: '/mlhack_2022', title: 'Side Channels in ML Hackathon Leaderboards', cat: ['misc'], 'date': '24/04/2022' },
  { Page: Wrapper(PickledOnions), route: '/pickled_onions_redpwn_2021', title: 'Pickled Onions Write-up', cat: ['redpwn', 'rev'], 'date': '13/07/2021' },
  { Page: Wrapper(Sub), route: '/the_substitution_game_redpwn_2021', title: 'The Substitution Game Write-up', cat: ['redpwn', 'algo'], 'date': '13/07/2021' },
  { Page: Wrapper(Lunch), route: '/lunch_with_the_cia_hsctf_2021', title: 'Lunch With The CIA Write-up / A Bin-Packing Heuristic', cat: ['hsctf', 'algo'], 'date': '19/06/2021' },
  { Page: Wrapper(BabySign), route: '/babysign_thc_2021', title: 'BabySign Write-up', cat: ['thctf', 'crypto'], 'date': '19/06/2021' },
  
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
              title={this.state.title}
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
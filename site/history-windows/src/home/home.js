import logo from './logo.svg';
import React, {Component} from 'react';
import {Button, Toast} from '@douyinfe/semi-ui';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <Button onClick={() => Toast.warning({content: 'welcome'})}>Hello Semi</Button>;
        </div>
    }
}

export default Home;
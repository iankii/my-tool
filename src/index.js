import React, { Component } from 'react';
import { render } from 'react-dom';
import FileReader from './FileReader';
import FileDownloader from './FileDownloader';
import ImpliedVolatily from './ImpliedVolatily';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <div className="App">
        <ImpliedVolatily />
        <FileDownloader />
        <FileReader />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
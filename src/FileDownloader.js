import React from 'react';
import Papa from 'papaparse';

class FileDownloader extends React.Component {
  BASIC_URL = 'https://www.nseindia.com/archives/nsccl/volt/CMVOLT_';
  constructor() {
    super();
    this.state = {
      otherUrl: this.getTodayUrl(),
      todayUrl: this.getTodayUrl(),
      notToday: true
    };
  }

  getTodayUrl = () => {
    return this.buildUrl();
  }

  getOtherUrl = (date) => {
    this.setState({otherUrl: this.buildUrl(date)});
  }

  handleOtherDate = () => {
    this.setState({ notToday: !this.state.notToday });
  }

  getFormattedDate = (dateString) => {
    let date = dateString ? new Date(dateString) : new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    var formattedDate = '' + dd + mm + yyyy;
    return formattedDate;
  }

  buildUrl = (date) => {
    let url = `${this.BASIC_URL}${this.getFormattedDate(date)}.CSV`;
    return url;
  }

  getReport = () => {
    console.log();
  }

  render() {
    let dateForm = this.state.notToday ? null :
      (<form>
        <input type="date" onChange={(e) => this.getOtherUrl(e.target.value)}/> 
        <br />
        <a href={this.state.otherUrl}>Get report</a>
      </form>);

    return (
      <div>
        <a href={this.state.todayUrl} >Download Today's Report</a>
        
        <button onClick={this.handleOtherDate}>Select Other Date</button>
        {dateForm}
      </div>
    );
  }
}

export default FileDownloader;
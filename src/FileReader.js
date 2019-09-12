import React from 'react';
import Papa from 'papaparse';

class FileReader extends React.Component {
  YEARLY_VOLATILITY = 'Underlying Annualised Volatility (F) = E*Sqrt(365)';
  DAILY_VOLATILIYY = 'Current Day Underlying Daily Volatility (E) = Sqrt(0.94*D*D + 0.06*C*C)';
    

  nifty50 = ["ACC", "ADANIPORTS", "AMBUJACEM", "ASIANPAINT", "AXISBANK", "AUTO", "BANKBARODA", "BHEL", "BPCL", "BHARTIARTL", "BOSCHLTD", "CAIRN", "CIPLA", "COALINDIA", "DRREDDY", "GAIL", "GRASIM", "HCLTECH", "HDFCBANK", "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "HDFC", "ITC", "ICICIBANK", "IDEA", "INDUSINDBK", "INFY", "KOTAKBANK", "LT", "LUPIN", "M", "MARUTI", "NTPC", "ONGC", "POWERGRID", "PNB", "RELIANCE", "SBIN", "SUNPHARMA", "TCS", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TECHM", "ULTRACEMCO", "VEDL", "WIPRO", "YESBANK"];
  nifty100 = ["ABB", "ACC", "ADANIPORTS", "AMBUJACEM", "ASHOKLEY", "ASIANPAINT", "AUROPHARMA", "DMART", "AXISBANK", "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BAJAJHLDNG", "BANDHANBNK", "BANKBARODA", "BHEL", "BPCL", "BHARTIARTL", "INFRATEL", "BIOCON", "BOSCHLTD", "BRITANNIA", "CADILAHC", "CIPLA", "COALINDIA", "COLPAL", "CONCOR", "DLF", "DABUR", "DIVISLAB", "DRREDDY", "EICHERMOT", "GAIL", "GICRE", "GODREJCP", "GRASIM", "HCLTECH", "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HAVELLS", "HEROMOTOCO", "HINDALCO", "HINDPETRO", "HINDUNILVR", "HINDZINC", "HDFC", "ICICIBANK", "ICICIGI", "ICICIPRULI", "ITC", "IBULHSGFIN", "IOC", "INDUSINDBK", "INFY", "INDIGO", "JSWSTEEL", "KOTAKBANK", "L&TFH", "LT", "LUPIN", "MRF", "M&M", "MARICO", "MARUTI", "MOTHERSUMI", "NHPC", "NMDC", "NTPC", "ONGC", "OFSS", "PAGEIND", "PETRONET", "PIDILITIND", "PEL", "POWERGRID", "PGHH", "RELIANCE", "SBILIFE", "SHREECEM", "SRTRANSFIN", "SIEMENS", "SBIN", "SAIL", "SUNPHARMA", "TCS", "TATAMTRDVR", "TATAMOTORS", "TATASTEEL", "TECHM", "NIACL", "TITAN", "UPL", "ULTRACEMCO", "UBL", "MCDOWELL-N", "VEDL", "IDEA", "WIPRO", "YESBANK", "ZEEL"];

  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      filteredOn: 'all',
      filteredData: [{}],
      data: [{}],
      sortValue: '', // daily, yealy, ''
      sortOrder: '' // asc, desc, ''
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  sortByYearly = () => {
    this.sortData('yearly');
  }

  sortByDaily = () => {
    this.sortData('daily');
  }

  sortData = (newSortValue) => {
    const { sortValue, sortOrder } = this.state;
    const data = [...this.state.filteredData];
    let sortedData = [];
    let newSortOrder = '';

    const numberToSort = newSortValue === 'daily' ? this.DAILY_VOLATILIYY : this.YEARLY_VOLATILITY;

    if (sortOrder === '' || sortOrder === 'asc') {

      sortedData = data.sort((a, b) => {
        return (b[numberToSort] - a[numberToSort]);
      });

      newSortOrder = 'desc';
    } else {
      sortedData = data.sort((a, b) => {
        return (a[numberToSort] - b[numberToSort]);
      });

      newSortOrder = 'asc';
    }

    this.setState({ sortValue: newSortValue, sortOrder: newSortOrder, filteredData: [...sortedData] });
  }

  getFilteredFifty = () => {
    this.getFilteredData('nifty50');
  }

  getFilteredHundred = () => {
    this.getFilteredData('nifty100');
  }

  getFilteredData = (filter) => {
    const newFilter = this.state.filteredOn !== filter ? filter : 'all';
    let filteredData = [...this.state.data];

    if (newFilter !== 'all') {
      filteredData = this.state.data.filter((value, i) => {
        return this[filter].includes(value.Symbol)
      });
    }

    this.setState({ filteredOn: newFilter, filteredData: filteredData });
  }

  updateData(result) {
    var data = result.data;
    this.setState({ data: [...data], filteredData: [...data] });
  }

  renderTableData() {
    return this.state.filteredData.map((values, index) => {
      const { Symbol } = values
      const dailyData = values[this.DAILY_VOLATILIYY]; //destructuring
      const yearlyData = values[this.YEARLY_VOLATILITY]; //destructuring
      return (
        <tr key={Symbol} className="table-row">
          <td className="symbol">{Symbol}</td>
          <td className="daily-data">{dailyData * 100 ? dailyData * 100 : null}</td>
          <td className="yearly-data">{yearlyData * 100 ? yearlyData * 100 : null}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        <button onClick={this.importCSV}> Upload now!</button>
        <br />
        <button className={this.state.filteredOn === 'nifty50' ? 'active' : null} onClick={this.getFilteredFifty}>Only Nifty50</button>
        <button className={this.state.filteredOn === 'nifty100' ? 'active' : null} onClick={this.getFilteredHundred}>Only from Nifty100</button>

        <div>
          <table className="data-table">
            <tbody>
              <tr className="table-header">
                <th>Name</th>
                <th onClick={this.sortByDaily}>Daily Volatility</th>
                <th onClick={this.sortByYearly}>Yearly Volatility</th>
              </tr>
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default FileReader;
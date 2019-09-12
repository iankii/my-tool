import React from 'react';
import Papa from 'papaparse';

class ImpliedVolatily extends React.Component {
  state = {
    currPrice: 0,
    civ: 0,
    piv: 0,
    callStrikeValue: 0,
    putStrikeValue: 0,
    days: 0,
    callProbs: {},
    putProbs: {},
  };

  handleChange(e) {
    const value = e.target.value;
    const key = e.target.id;

    const newState = {};
    newState[key] = value;

    this.setState(newState);
  }

  handleClick = () => {
    const callProbs = this.calculateProb(this.state.callStrikeValue, this.state.piv);
    const putProbs = this.calculateProb(this.state.putStrikeValue, this.state.civ);
    console.log(putProbs, callProbs);
    this.setState(Object.assign({}, { callProbs, putProbs }));
  }

  calculateProb = (strikeValue, iv) => {
    const p = this.state.currPrice;
    const q = strikeValue;
    const v = iv / 100;
    const t = this.state.days / 365;

    let vt = v * Math.sqrt(t);
    let lnpq = Math.log(q / p);
    let d1 = lnpq / vt;

    let y = Math.floor(1 / (1 + .2316419 * Math.abs(d1)) * 100000) / 100000;
    let z = Math.floor(.3989423 * Math.exp(-((d1 * d1) / 2)) * 100000) / 100000;
    let y5 = 1.330274 * Math.pow(y, 5);
    let y4 = 1.821256 * Math.pow(y, 4);
    let y3 = 1.781478 * Math.pow(y, 3);
    let y2 = .356538 * Math.pow(y, 2);
    let y1 = .3193815 * y;
    let x = 1 - z * (y5 - y4 + y3 - y2 + y1);
    x = Math.floor(x * 100000) / 100000;

    if (d1 < 0) { x = 1 - x };

    let pabove = Math.floor(x * 1000) / 10;
    let pbelow = Math.floor((1 - x) * 1000) / 10;

    return { pbelow, pabove };
  }

  showResult = (strikePriceIsLesserThanCMP) => {
    let header = 'Close Below Target';
    let value1 = this.state.callProbs.pbelow;
    let value2 = this.state.callProbs.pabove;
    let strikePrice = this.state.callStrikeValue;

    if (strikePriceIsLesserThanCMP) {// strike price < CMP
      header = 'Close Above Target'
      value1 = this.state.putProbs.pabove;
      value2 = this.state.putProbs.pbelow;
      strikePrice = this.state.putStrikeValue;
    }

    return (<table>
      <tr>
        <th>Stock Target Price</th>
        <th>Winning Probability</th>
        <th>{header}</th>
      </tr>
      <tr>
        <td>{strikePrice}</td>
        <td>{value1}</td>
        <td>{value2}</td>
      </tr>
    </table>)
  }

  render() {
    const grt = "Strike Price < CMP";
    const lesser = "Strike Price > CMP";
    return (
      <div className='implied-volatility'>
        <header className='header'>
          Calculate Probability of strike a price
        </header>
        <div>
          Take Price as immediate next to closing price and it's IVs. Target Strike price should be the prices with most built up, it can be different for both put and call.
        </div>
        <div className='iv-fields'>
          <span className='title'>Current Price: </span>
          <input type="text" name="Current Price" className="curr-price" id="currPrice"
            onChange={(e) => this.handleChange(e)} value={this.state.currPrice} />
        </div>

        <div className='iv-fields'>
          <span className='title'>Call Implied Volatility: </span>
          <input type="text" name="implied Volatility" className="call-iv" id="civ" onChange={(e) => this.handleChange(e)} value={this.state.civ} /><br />
        </div>

        <div className='iv-fields'>
          <span className='title'>Put Implied Volatility: </span>
          <input type="text" name="implied Volatility" className="put-iv" id="piv" onChange={(e) => this.handleChange(e)} value={this.state.piv} /><br />
        </div>

        <div className='iv-fields'>
        <span className='title'>No. of days to Expiry: </span><input type="text" name="Expiry Day" className="expiry-day" id="days" value={this.state.days} onChange={(e) => this.handleChange(e)} />
        </div>

        <div className='iv-fields'>
          <span className='title'>{grt}: </span><input type="text" name="Strike Value" className="put-strike-price" id="putStrikeValue" onChange={(e) => this.handleChange(e)} value={this.state.putStrikeValue} />
        </div>
        
        <div className='iv-fields'>
          <span>{lesser}: </span><input type="text" name="Strike Value" className="call-strike-price" id="callStrikeValue" onChange={(e) => this.handleChange(e)} value={this.state.callStrikeValue} />
        </div>
        
        <div className='iv-fields'>
          <div className='strike-price-column'>
            <div className="green result">
              {this.showResult(true)}
            </div>
          </div>

          <div className='strike-price-column'>
            <div className="red result">
              {this.showResult()}
            </div>
          </div>
        </div>

        <input type="button" value="Calculate" onClick={this.handleClick} />
      </div>
    );
  }
}

export default ImpliedVolatily;
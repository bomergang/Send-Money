import React, { Component } from 'react';
import PieChart from 'react-minimal-pie-chart';
import NumberFormat from 'react-number-format';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      emailAddress: '',
      amount: '',
      transactions: [],
      validName: '',
      validEmail: '',
      validAmount: '',
      remaining: 20000.00,
      spent: 0.00,
      touched: {
        name: false,
        emailAddress: false,
        amount: false
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.round = this.round.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleBlur(event) {
    const field = event.target.name;
    const value = event.target.value;

    switch (field) {
      case "name":
        this.setState({validName: (!value || (value.trim().length === 0) || value.match(/[^\w \d]/)) ? false : true});
        break;
      case "emailAddress":
        this.setState({validEmail: (!value || value.trim().length === 0 || !value.match(/\S+@\S+\.\S+/)) ? false : true});
        break;
      case "amount":
        this.setState({
          validAmount: (!value || value.trim().length === 0 || value > this.state.remaining) ? false : true,
          amount: (this.state.amount > 0) ? this.round(this.state.amount, 2) : ""
        });
        break;
      default:
        break;
    }

    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }

  handleInputChange(event) {
    const value = event.target.value;
    const field = event.target.name;

    this.setState({
      [field]: value
    });
  }

  submit() {
    const name = this.state.name;
    const emailAddress = this.state.emailAddress;
    const amount = this.state.amount;

    if (this.state.validName && this.state.validEmail && this.state.validAmount) {
      if (this.state.amount < this.state.remaining) {
        const currentTransaction = {
          name: name,
          emailAddress: emailAddress,
          amount: amount
        };

        this.setState((prevState) => {
          return {
            transactions: [currentTransaction, ...prevState.transactions],
            remaining: prevState.remaining - this.state.amount,
            spent: prevState.spent + this.state.amount,
            name: '',
            emailAddress: '',
            amount: '',
            validName: '',
            validEmail: '',
            validAmount: '',
            touched: {
              name: false,
              emailAddress: false,
              amount: false
            }
          }
        });
      }
    }
  }

  round(number, precision) {
    const shift = function (number, exponent) {
      const numArray = ("" + number).split("e");
      return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + exponent) : exponent));
    };
    return shift(Math.round(shift(number, +precision)), -precision);
  }

  render() {
    const touched = this.state.touched;
    const validName = this.state.validName;
    const validEmail = this.state.validEmail;
    const validAmount = this.state.validAmount;

    return (
      <div className="uk-section uk-width-2-3 uk-align-center">
        <div className="uk-grid-match uk-child-width-1-2@m" uk-grid="true">
          <div className="uk-float-left divider">
            <div className="uk-margin-medium-left uk-margin-medium-right">
              <h1> Send Money </h1>
              <form>

                <label id="nameLabel" className="uk-width-1-1 uk-margin-bottom">
                  Name
                  <input id="nameInput" ref="nameInput" className={(touched.name && !validName ? "inputError" : "") + " uk-width-1-1"} name="name" type="text" value={this.state.name} onChange={this.handleInputChange} onBlur={this.handleBlur} />
                  <p className={(touched.name && !validName ? "error" : "hide") + " uk-margin-bottom"}>Please enter a valid name</p>
                </label>

                <label id="emailLabel" className="uk-width-1-1 uk-margin">
                  Email Address
                  <input id="emailInput" ref="emailInput" className={(touched.emailAddress && !validEmail ? "inputError" : "") + " uk-width-1-1"} name="emailAddress" type="text" value={this.state.emailAddress} onChange={this.handleInputChange} onBlur={this.handleBlur} />
                  <p className={(touched.emailAddress && !validEmail ? "error" : "hide") + " uk-margin-bottom"}>Please enter a valid email address</p>
                </label>

                <label id="amountLabel" className="uk-width-1-1 uk-margin">
                  Amount
                  <div className="pound">
                    <input id="amountInput" ref="amountInput" className={(touched.amount && !validAmount ? "inputError" : "") + " uk-width-1-1 amount"} name="amount" type="number" min="0.00"  value={this.state.amount} onChange={this.handleInputChange} onBlur={this.handleBlur} />
                  </div>
                  <p className={(touched.amount && !validAmount ? "error" : "hide") + " uk-margin-bottom"}>Please enter a valid amount</p>
                </label>

              </form>
              <button id="submit" className="uk-width-1-1 uk-margin-large-top" onClick={this.submit}>Send</button>
            </div>
          </div>

          <div className="uk-float-right">
            <div className="uk-margin-medium-left uk-margin-medium-right">
              <h1>My account</h1>
              <table>
                <tbody>
                  <tr>

                    <td className='uk-text-right'>
                      <NumberFormat value={this.state.spent} displayType={'text'} thousandSeparator={true} prefix={'£'} decimalSeparator={"."} decimalScale={2} fixedDecimalScale={true} />
                      <p>total sent</p>
                    </td>

                    <td>
                      <PieChart className="chart"
                        data={[
                          { value: this.state.spent, color: '#EAEAEE' },
                          { value: this.state.remaining, color: '#FFB428'}
                        ]}
                        lineWidth={50} />
                    </td>

                    <td className="uk-text-left">
                      <NumberFormat value={this.state.remaining} displayType={'text'} thousandSeparator={true} prefix={'£'} decimalSeparator={"."} decimalScale={2} fixedDecimalScale={true} />
                      <p>left available </p>
                    </td>

                  </tr>
                </tbody>
              </table>

              <h3>Transactions</h3>
              {this.state.transactions.map((transactions, index) => {
                return (
                  <div key={index}>
                    <table className="uk-width-1-1">
                      <tbody>
                        <tr>

                          <td>
                            <p className="transName">{transactions.name}</p>
                            <p>{transactions.emailAddress}</p>
                          </td>

                          <td className="uk-text-right">
                          <NumberFormat value={transactions.amount} displayType={'text'} thousandSeparator={true} prefix={'£'} decimalSeparator={"."} decimalScale={2} fixedDecimalScale={true} />
                          </td>

                        </tr>
                      </tbody>
                    </table>
                    <hr />
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;

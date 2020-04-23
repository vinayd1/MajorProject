import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import NavBar from './NavBar';
import Loader from './Loader';
import Web3 from 'web3';
import Contract from '../abis/Contract';
import Form from 'antd/lib/form/Form';

const Api = axios.create({
  baseURL: 'http://localhost:8000/',
  timeout: 1000,
  responseType: "json"
})

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      account: null,
      authorities: []
    }
  }

  async componentDidMount() {
    await this.getAuthorities();
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.setState({ loading: false })
  }

  getAuthorities = async () => {
    try {
      const { data } = await Api.get(`authority`);
      this.setState({ authorities: data })
      console.table(data)
    } catch (err) { console.error(err) }
  }

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
    }
  }

  loadBlockchainData = async () => {
    const { web3 } = window;
    const [account] = await web3.eth.getAccounts();
    const contractAddress = Contract.networks[5777].address;
    const contract = new web3.eth.Contract(Contract.abi, contractAddress);


    this.setState(() => {
      return { account, contract }
    });
    await this.getEvents();

    console.log(this.state);
  }

  getEvents = async () => {
    const { contract, account } = this.state;
    const events = await contract.getPastEvents(
      'NewEvent',
      { fromBlock: 0, toBlock: 'latest', filter: { from: account } }
    );
    this.setState(() => {
      return { events }
    });
  }

  triggerContract = async () => {
    const { contract, account } = this.state;
    try {
      await contract.methods.trigger(123).send({ from: account });
      await this.getEvents();
    } catch (e) {
      console.error(e);
    }
    console.log(this.state);
  }

  createIdentity = async (data, authority) => {
    const keys = Object.keys(data);
    const request = keys.map(key => ({
      key, value: data[key], authority
    }));

    const response = await Api.post('sign', {
      attributes: request,
      userPublicKey: this.state.account
    });
    const {web3} = window
    const signedData = response.data.map(({sign} = {}) => sign)
    console.log(signedData);
  }

  render() {
    const { loading, account, authorities } = this.state;
    if (loading)
      return <Loader className="my-5" />
    return (
      <div>
        <NavBar name="Major Project" account={account} />
        <div className="container mt-5 pt-5">
          <h1 className="text-center">Create Your Digital Identity</h1>
          <div className="py-2" />
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mx-auto" style={{ width: "500px" }}>
                <a
                  href="https://www.coinbase.com/price/dai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <img src={"https://dynamic-assets.coinbase.com/90184cca292578d533bb00d9ee98529b889c15126bb120582309286b9129df9886781b30c85c21ee9cae9f2db6dc11e88633c7361fdd1ba5046ea444e101ae15/asset_icons/ebc24b163bf1f58a9732a9a1d2faa5b2141b041d754ddc2260c5e76edfed261e.png"} width={"150"} className="App-logo" alt="logo" /> */}
                </a>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const name = this.name.value;
                  const age = this.age.value;
                  const authority = this.authority.value;
                  this.createIdentity({name, age}, authority);
                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="name"
                      type="text"
                      ref={(inp) => { this.name = inp }}
                      className="form-control"
                      placeholder="Name"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="age"
                      type="number"
                      step="1"
                      min="1"
                      ref={(inp) => { this.age = inp }}
                      className="form-control"
                      placeholder="Age"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <select
                      defaultValue=""
                      id="authority"
                      ref={(inp) => { this.authority = inp }}
                      className="form-control"
                      required
                    >
                      <option value="" disabled>Select an authority</option>
                      {
                        authorities.map((authority) => <option key={authority.PublicKey} value={authority.PublicKey}>
                          {authority.AuthorityName} ({authority.PublicKey})
                      </option>)
                      }
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
                {/* <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                      <th scope="col">Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      transactions.map((tx, index) => <tr key={tx.id}>
                        <td>{tx.returnValues.to}</td>
                        <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        <td>{tx.flow === "in" ? "Recieved" : "Sent"}</td>
                      </tr>)
                    }
                  </tbody>
                </table> */}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

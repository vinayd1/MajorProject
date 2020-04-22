import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import NavBar from './NavBar';
import Loader from './Loader';
import Web3 from 'web3';
import Contract from '../abis/Contract';

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
      const {data} = await Api.get(`authority`);
      this.setState({authorities: data})
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
    await contract.methods.trigger().send({ from: account });
    await this.getEvents();
    console.log(this.state);
  }

  render() {
    const { loading, account } = this.state;
    if (loading)
      return <Loader className="my-5" />
    return (
      <div>
        <NavBar name="Major Project" account={account} />
        <div className="container mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <button onClick={this.triggerContract}>Click</button>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

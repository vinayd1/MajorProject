import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import NavBar from './NavBar';
import Loader from './Loader';
import Web3 from 'web3';
import Contract from '../abis/Contract';
import Form from 'antd/lib/form/Form';
import ipfsClient from 'ipfs-http-client';
import CreateIdentity from './CreateIdentity';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

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
    console.log(this.state)
    this.setState({ loading: false })
  }

  getAuthorities = async () => {
    try {
      const { data } = await Api.get(`authority`);
      this.setState({ authorities: data })
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
    await this.getIdentity();

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

  getIdentity = async () => {
    const {contract, account} = this.state;
    const path = await contract.methods.getIdentity().call({from: account});
    if(!path) return this.setState({userData: [], identity: false});
    const data = (await (await ipfs.get(path).next()).value.content.next()).value.toString();
    this.setState({
      userData: JSON.parse(data),
      identity: true
    })
  }

  createIdentity = async (data, authority) => {
    const {contract, account} = this.state
    // const keys = Object.keys(data);
    // const request = keys.map(key => ({
    //   key, value: data[key], authority
    // }));

    const response = await Api.post('sign', {
      attributes: data,
      userPublicKey: this.state.account
    });
    const signedData = response.data.map(({ sign } = {}) => sign)
    const buf = Buffer.from(JSON.stringify(signedData));
    const d = await ipfs.add(buf).next();
    await contract.methods.createIdentity(d.value.path).send({from: account});
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
            <main role="main" className="col-lg-12 d-flex text-center px-0">
              <div className="content mx-auto" style={{ width: "800px" }}>
               
                <CreateIdentity createIdentity={this.createIdentity} authorities={authorities} />
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

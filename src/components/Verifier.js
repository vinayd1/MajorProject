import React, { Component } from 'react'
import uuid from 'react-uuid';
import { SyncOutlined } from '@ant-design/icons'
import './styles.css';

export default class Verifier extends Component {

    state = {
        reqData: {
            did: '',
            attr: '',
        },
        verifyData: {
            did: '',
            attr: '',
            value: '',
        },
        reqList: [],
        reqDataLoading: true,
        verList:  [],
        reqVerificationLoading: true
    }

    async componentDidMount() {
        await this.getReqDataEvents();
        await this.getReqVerificationEvents();
    }

    getReqDataEvents = async () => {
        const { contract, account } = this.props;
        this.setState({reqDataLoading: true})
        const dataRequestEvent = await contract.getPastEvents(
            'GetDataRequestEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { from: account } }
        );
        const dataResponseEvent = await contract.getPastEvents(
            'GetDataResponseEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { to: account } }
        );

        const reqData = Array.isArray(dataRequestEvent) && Array.isArray(dataResponseEvent) ? dataRequestEvent.map(({ returnValues: req = {} } = {}) => {
            const { to, attribute, id } = req;
            const [{ returnValues: { status, value = '' } = {} } = {}] = dataResponseEvent.filter(({ returnValues: res = {} } = {}) => res.id && res.id === req.id);
            if (status !== 1)
                return { did: to, attribute, id, value: null, status: this.getStatus(status) }
            const signedData = JSON.parse(value);
            const authority = window.web3.eth.accounts.recover(signedData);
            return { did: to, attribute, id, value: JSON.parse(signedData.message).value, status: authority ? this.getStatus(1) : "Failed", authority }
        }) : []

        this.setState(() => {
            return { reqList: reqData, reqDataLoading: false }
        });
    }

    getAuthority = (key, value, userPublicKey, signature) => {
        let message = {
            key,
            value,
            userPublicKey
        }
        message = JSON.stringify(message);
        return window.web3.eth.accounts.recover(message,signature);
    }

    getReqVerificationEvents = async () => {
        const { contract, account } = this.props;
        this.setState({reqVerificationLoading: true})

        const verificationRequestEvent = await contract.getPastEvents(
            'VerifyDataRequestEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { from: account } }
        );
        const verificationResponseEvent = await contract.getPastEvents(
            'VerifyDataResponseEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { to: account } }
        );

        const verData = Array.isArray(verificationRequestEvent) ? verificationRequestEvent.map(({ returnValues: req = {} } = {}) => {
            const {to, value, attribute, id } = req;
            const [{ returnValues: { verifiedStatus, signature, status = '' } = {} } = {}] = verificationResponseEvent.filter(({ returnValues: res = {} } = {}) => res.id && res.id === req.id);
            if (verifiedStatus === true) {
                const authority = this.getAuthority(attribute, value, to, signature);
                return {did: to, attribute, id, authority, value: true, status: this.getStatus(status)};
            }
                return { did: to, attribute, id, value: false, status: this.getStatus(status) }
        }) : [];
        this.setState(() => {
            return { verList: verData, reqVerificationLoading: false }
        });
    }

    getStatus = (status) => {
        switch (status) {
            case 0: return "Rejected";
            case 1: return "Approved";
            case 2: return "Failed";
        }
        return "Pending";
    }

    deleteReq = (index) => {
        const { reqList } = this.state
        const data = reqList.filter((_, i) => i !== index)
        this.setState({ reqList: data });
        window.alert("Request removed successfully");
    }

    deleteVer = (index) => {
        const { verList } = this.state
        const data = verList.filter((_, i) => i !== index)
        this.setState({ verList: data });
        window.alert("Request removed successfully");
    }

    getTextColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-warning';
            case 'Approved': return 'text-success';
            case 'Rejected':
            case 'Failed': return 'text-danger';
            default: return '';
        }
    }

    reqData = (data = {}) => {
        this.setState({
            reqData: {
                did: '',
                attr: '',
            },
        });
        data.did && data.attr ?
            this.props.contract.methods.triggerDataRequest(uuid(), data.did, data.attr).send({ from: this.props.account }) :
            window.alert("Input fields are empty...")
    }

    verifyData = (data = {}) => {
        this.setState({
            verifyData: {
                did: '',
                attr: '',
                value: '',
            }
        });
        data.did && data.attr && data.value ?
            this.props.contract.methods.triggerVerifyRequest(uuid(), data.did, data.attr, data.value).send({from: this.props.account}) :
            window.alert("Input fields are empty");
    }

    getView = (title, data, del, loading, onClick) => <>
        <div className="d-flex align-items-center">
            <p className="m-0 h3 fw-450">{title || ''}&nbsp;</p>
            <SyncOutlined spin={loading} style={{ fontSize: "1.3rem", marginTop: "5px" }} onClick={onClick} />
        </div>
        <div className="py-2" />
        <table className="table">
            <thead>
                <tr>
                    <th scope="col" className="text-center">User's DID</th>
                    <th scope="col" className="text-center">Requested Attribute</th>
                    <th scope="col" className="text-center">Status</th>
                    <th scope="col" className="text-center">Value</th>
                    <th scope="col" className="text-center">Approved by</th>
                    <th scope="col" className="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, index) => <tr key={uuid()}>
                        <td align="center">{item.did}</td>
                        <td align="center">{item.attribute}</td>
                        <td align="center" className={this.getTextColor(item.status)}>{item.status}</td>
                        <td align="center">{item.value !== null && item.value !== undefined ? `${item.value}` : '--'}</td>
                        <td align="center">{item.authority || '--'}</td>
                        <td align="center">
                            {item.status !== "Pending" ? <button onClick={() => del(index)}>Delete</button> : '--'}
                        </td>

                    </tr>)
                }
            </tbody>
        </table>
    </>

    render() {
        const { reqData, reqVerificationLoading, verifyData, reqList, verList, reqDataLoading } = this.state;

        return <>
            <div style={{ width: "800px", margin: "0 auto" }}>
                <div className="row py-1">
                    <div className="col-6">
                        <input
                            value={reqData.did || ''}
                            id="req-did"
                            type="text"
                            onChange={(inp) => { inp && this.setState({ reqData: { ...this.state.reqData, did: inp.target.value } }) }}
                            className="form-control"
                            placeholder="Enter user's DID"
                            required />
                    </div>
                    <div className="col-3 px-0">
                        <input
                            value={reqData.attr || ''}
                            id="req-attr"
                            type="text"
                            onChange={(inp) => { inp && this.setState({ reqData: { ...this.state.reqData, attr: inp.target.value } }) }}
                            className="form-control"
                            placeholder="Enter required attribute"
                            required />
                    </div>
                    <div className="col-3">
                        <button className="btn btn-primary btn-block" onClick={() => this.reqData(reqData)}>Get data request</button>
                    </div>
                </div>
                <div className="row py-1">
                    <div className="col-3">
                        <input
                            value={verifyData.did || ''}
                            id="req-did"
                            type="text"
                            onChange={(inp) => { inp && this.setState({ verifyData: { ...this.state.verifyData, did: inp.target.value } }) }}
                            className="form-control"
                            placeholder="Enter user's DID"
                            required />
                    </div>
                    <div className="col-3 pl-0">
                        <input
                            value={verifyData.attr || ''}
                            id="req-attr"
                            type="text"
                            onChange={(inp) => { inp && this.setState({ verifyData: { ...this.state.verifyData, attr: inp.target.value } }) }}
                            className="form-control"
                            placeholder="Enter required attribute"
                            required />
                    </div>
                    <div className="col-3 px-0">
                        <input
                            value={verifyData.value || ''}
                            id="req-attr"
                            type="text"
                            onChange={(inp) => { inp && this.setState({ verifyData: { ...this.state.verifyData, value: inp.target.value } }) }}
                            className="form-control"
                            placeholder="Enter required attribute"
                            required />
                    </div>
                    <div className="col-3">
                        <button className="btn btn-primary btn-block" onClick={() => this.verifyData(verifyData)}>Verify data request</button>
                    </div>
                </div>
            </div>
            <div className="py-2" />
            <div style={{ width: "90%", margin: "0 auto" }}>
                <p className="m-0 h3 fw-500 text-center">Verifier's logs</p>
                {this.getView("Date requests", reqList, this.deleteReq, reqDataLoading, this.getReqDataEvents)}
                {this.getView("Verification requests", verList, this.deleteVer,reqVerificationLoading, this.getReqVerificationEvents)}
            </div>
        </>
    }
}

import React, { Component } from 'react'
import uuid from 'react-uuid'
import { SyncOutlined } from '@ant-design/icons'
import './styles.css';


export default class User extends Component {

    state = {
        reqData: [],
        reqDataLoading: true,
        verData: [],
        reqVerificationLoading: true
    }

    async componentDidMount() {
        await this.getReqDataEvents();
    }

    getReqDataEvents = async () => {
        const { contract, account } = this.props;
        this.setState({reqDataLoading: true})
        const dataRequestEvent = await contract.getPastEvents(
            'GetDataRequestEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { to: account } }
        );
        const dataResponseEvent = await contract.getPastEvents(
            'GetDataResponseEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { from: account } }
        );

        const reqData = Array.isArray(dataRequestEvent) && Array.isArray(dataResponseEvent) ? dataRequestEvent.map(({ returnValues: req = {} } = {}) => {
            const { from, attribute, id } = req;
            const [{ returnValues: { status } = {} } = {}] = dataResponseEvent.filter(({ returnValues: res = {} } = {}) => res.id && res.id === req.id);
            return { did: from, attribute, id, status: this.getStatus(status) }
        }) : []


        this.setState(() => {
            return { reqData, reqDataLoading: false }
        });
    }

    getReqVerificationEvents = async() => {
        const { contract, account } = this.props;
        this.setState({reqVerificationLoading: true});

        const verificationRequestEvent = await contract.getPastEvents(
            'VerifyDataRequestEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { to: account } }
        );
        const verificationResponseEvent = await contract.getPastEvents(
            'VerifyDataResponseEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { from: account } }
        );

        const verData = Array.isArray(verificationRequestEvent) && Array.isArray(verificationResponseEvent) ? verificationRequestEvent.map(({ returnValues: req = {} } = {}) => {
            const { from, attribute, id } = req;
            const [{ returnValues: { status } = {} } = {}] = verificationResponseEvent.filter(({ returnValues: res = {} } = {}) => res.id && res.id === req.id);
            return { did: from, attribute, id, status: this.getStatus(status) }
        }) : []

        this.setState(() => {
            return { verData, reqVerificationLoading: false }
        });
    }

    getStatus = (status) => {
        switch (status) {
            case 0: return "Rejected";
            case 1: return "Approved";
            case 2: return "Failed";
        }

        return "Pending"
    }

    getTextColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-warning';
            case 'Approved': return 'text-success';
            case 'Failed': return 'text-danger';
            case 'Rejected': return 'text-danger';
            default: return '';
        }
    }

    approveReq = (index) => {
        const { reqData } = this.state;
        const data = reqData[index];

        const i = this.props.data.findIndex(({ key } = {}) => key === data.attribute);
        if (i >= 0) {
            const value = this.props.userData[i];
            this.props.contract.methods.triggerDataResponse(data.id, data.did, JSON.stringify(value), 1).send({ from: this.props.account });
        } else {
            this.props.contract.methods.triggerDataResponse(data.id, data.did, 'no data', 2).send({ from: this.props.account });
        }
    }

    rejectReq = (index) => {
        const { reqData } = this.state;
        const data = reqData[index];

        this.props.contract.methods.triggerDataResponse(data.id, data.did, 'no data', 0).send({ from: this.props.account });
    }

    deleteReq = (index) => {
        const { reqData } = this.state
        const data = reqData.filter((_, i) => i !== index)
        this.setState({ reqData: data });
        window.alert("Request removed successfully");
    }

    approveVer = (index) => {
        const { verData } = this.state;
        const data = verData[index];
        console.log(data)
        const dataAttr = this.props.userData[index];
        console.log("<<<<");
        console.log(dataAttr.signature);
        if(index >= 0)
        this.props.contract.methods.triggerVerifyResponse(data.id, data.did, JSON.parse(dataAttr.message).key,JSON.parse(dataAttr.message).value,JSON.parse(dataAttr.message).userPublicKey, dataAttr.signature, 1).send({from: this.props.account});
        else
            this.props.contract.methods.triggerVerifyResponse(data.id, data.did, "no data", dataAttr.signature, 2).send({from: this.props.account});

    }

    rejectVer = (index) => {
        const { verData } = this.state;
        verData[index].status = 'Rejected';
        this.setState({ verData })
        window.alert("Request rejected successfully");
    }

    deleteVer = (index) => {
        const { verData } = this.state
        const data = verData.filter((_, i) => i !== index)
        this.setState({ verData: data });
        window.alert("Request removed successfully");
    }

    getView = (title, data, rej, apr, del, loading, onClick) => <>
        <div className="d-flex align-items-center">
            <p className="m-0 h3 fw-450">{title || ''}&nbsp;</p>
            <SyncOutlined spin={loading} style={{ fontSize: "1.3rem", marginTop: "5px" }} onClick={onClick} />
        </div>
        <div className="py-2" />
        <table className="table">
            <thead>
                <tr>
                    <th scope="col" className="text-center">Verifier's DID</th>
                    <th scope="col" className="text-center">Requested Attribute</th>
                    <th scope="col" className="text-center">Status</th>
                    <th scope="col" className="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, index) => <tr key={uuid()}>
                        <td align="center">{item.did}</td>
                        <td align="center">{item.attribute}</td>
                        <td align="center" className={this.getTextColor(item.status)}>{item.status}</td>
                        <td align="center">
                            {
                                !item.status || item.status === "Pending" ? <>
                                    <button onClick={() => apr(index)} className="mr-1">Approve</button>
                                    <button onClick={() => rej(index)} className="ml-1">Reject</button>
                                </> : <button onClick={() => del(index)}>Delete</button>
                            }

                        </td>

                    </tr>)
                }
            </tbody>
        </table>
    </>

    render() {
        const { reqData, reqDataLoading, verData, reqVerificationLoading } = this.state;
        return <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <p className="m-0 h3 fw-500 text-center">User's logs</p>
            {this.getView("Data request", reqData, this.rejectReq, this.approveReq, this.deleteReq, reqDataLoading, this.getReqDataEvents)}
            {this.getView("Verification request", verData, this.rejectVer, this.approveVer, this.deleteVer, reqVerificationLoading, this.getReqVerificationEvents)}
        </div>
    }
}
import React, { Component } from 'react'
import './styles.css';

const req = [
    { did: '', attribute: '', status: 'Approved' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Failed' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Rejected' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
]

const ver = [
    { did: '', attribute: '', status: 'Approved' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Failed' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Rejected' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
]

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
        reqList: req || [],
        verList: ver || [],
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

    reqData = () => {
        this.setState({
            reqData: {
                did: '',
                attr: '',
            },
        })

        window.alert("Request generated successfully");
    }

    verifyData = () => {
        this.setState({
            verifyData: {
                did: '',
                attr: '',
                value: '',
            }
        })

        window.alert("Request generated successfully");
    }

    getView = (title, data, del) => <>
        <p className="m-0 h3 fw-450">{title || ''}</p>
        <div className="py-2" />
        <div className="scrollable-child">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col" className="text-center">User's DID</th>
                        <th scope="col" className="text-center">Requested Attribute</th>
                        <th scope="col" className="text-center">Status</th>
                        <th scope="col" className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) => <tr key={item}>
                            <td align="center">{item.did}</td>
                            <td align="center">{item.attribute}</td>
                            <td align="center" className={this.getTextColor(item.status)}>{item.status}</td>
                            <td align="center">
                                {item.status !== "Pending" ? <button onClick={() => del(index)}>Delete</button> : '--'}
                            </td>

                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    </>

    render() {
        const { reqData, verifyData, reqList, verList } = this.state;
        return <div className="">
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
                    <button className="btn btn-primary btn-block" onClick={this.reqData}>Get data request</button>
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
                    <button className="btn btn-primary btn-block" onClick={this.verifyData}>Verify data request</button>
                </div>
            </div>

            <div className="py-2" />
            <p className="m-0 h3 fw-500 text-center">Verifier logs</p>
            <div className="scrollable">
                {this.getView("Date requests", reqList, this.deleteReq)}
                {this.getView("Verification requests", verList, this.deleteVer)}
            </div>
        </div>
    }
}

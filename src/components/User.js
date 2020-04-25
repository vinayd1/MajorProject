import React, { Component } from 'react'
import './styles.css';

const req = [
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
]

const ver = [
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
    { did: '', attribute: '', status: 'Pending' },
]

export default class User extends Component {

    state = {
        reqData: req || [],
        verData: ver || []
    }

    getTextColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-warning';
            case 'Approved': return 'text-success';
            case 'Rejected': return 'text-danger';
            default: return '';
        }
    }

    approveReq = (index) => {
        const { reqData } = this.state;
        reqData[index].status = 'Approved';
        this.setState({ reqData })
        window.alert("Request approved successfully");
    }

    rejectReq = (index) => {
        const { reqData } = this.state;
        reqData[index].status = 'Rejected';
        this.setState({ reqData })
        window.alert("Request rejected successfully");
    }

    deleteReq = (index) => {
        const { reqData } = this.state
        const data = reqData.filter((_, i) => i !== index)
        this.setState({reqData: data});
        window.alert("Request removed successfully");
    }

    approveVer = (index) => {
        const { verData } = this.state;
        verData[index].status = 'Approved';
        this.setState({ verData })
        window.alert("Request approved successfully");
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
        this.setState({verData: data});
        window.alert("Request removed successfully");
    }

    getView = (title, data, rej, apr, del) => <>
        <p className="m-0 h3 fw-450">{title || ''}</p>
        <div className="py-2" />
        <div className="scrollable-child">
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
                        data.map((item, index) => <tr key={item}>
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
        </div>
    </>

    render() {
        const { reqData, verData } = this.state;
        return <div>
            <p className="m-0 h3 fw-500 text-center">User logs</p>
            <div className="scrollable">
                {this.getView("Data request", reqData, this.rejectReq, this.approveReq, this.deleteReq)}
                {this.getView("Verification request", verData, this.rejectVer, this.approveVer, this.deleteVer)}
            </div>
        </div>
    }
}

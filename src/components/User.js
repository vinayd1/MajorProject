import React, { Component } from 'react'
import './styles.css';

const req = [
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Name', status: 'Pending' },
    { did: '0x335b6ca553D2681E03A0EE1746Ffdafa52b211A1', attribute: 'Age', status: 'Pending' },
    { did: '0xa8c38Ed8DC407fB8d6Fa807AbB09A43F6427e206', attribute: 'Cerificate', status: 'Pending' },
    { did: '0xE9439E54DEF1fc50499b3589963c2266B2432511', attribute: 'Gender', status: 'Pending' },
    { did: '0xa229347C0c11BcDe4654105F6B6971Cd07737D37', attribute: 'Age', status: 'Pending' },
    { did: '0x14084f5c44E18FFBecE53c13F176bE417b1F950C', attribute: 'DOB', status: 'Pending' },
    { did: '0x5e7cAd0e20b100Ecce3D42f3f564432D219edc5d', attribute: 'Name', status: 'Pending' },
    { did: '0xAc5C8a4482D22F38642D01154501660963c85745', attribute: 'Age', status: 'Pending' },
    { did: '0x50225bE7EdeEfeC7C28e11BBFD5544e29af42Add', attribute: 'Name', status: 'Pending' },
    { did: '0xB22Ab149D58921d842195ffe05b3e83195303a63', attribute: 'Gender', status: 'Pending' },
    { did: '0xa229347C0c11BcDe4654105F6B6971Cd07737D37', attribute: 'DOB', status: 'Pending' },
    { did: '0x335b6ca553D2681E03A0EE1746Ffdafa52b211A1', attribute: 'Name', status: 'Pending' },
    { did: '0xE9439E54DEF1fc50499b3589963c2266B2432511', attribute: 'Cerificate', status: 'Pending' },
    { did: '0xAc5C8a4482D22F38642D01154501660963c85745', attribute: 'Marital Status', status: 'Pending' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'DOB', status: 'Pending' },
]

const ver = [
    { did: '0x50225bE7EdeEfeC7C28e11BBFD5544e29af42Add', attribute: 'Gender', status: 'Pending' },
    { did: '0xE9439E54DEF1fc50499b3589963c2266B2432511', attribute: 'Name', status: 'Pending' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Gender', status: 'Pending' },
    { did: '0xa8c38Ed8DC407fB8d6Fa807AbB09A43F6427e206', attribute: 'DOB', status: 'Pending' },
    { did: '0x335b6ca553D2681E03A0EE1746Ffdafa52b211A1', attribute: 'Cerificate', status: 'Pending' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Name', status: 'Pending' },
    { did: '0xa229347C0c11BcDe4654105F6B6971Cd07737D37', attribute: 'DOB', status: 'Pending' },
    { did: '0xAc5C8a4482D22F38642D01154501660963c85745', attribute: 'DOB', status: 'Pending' },
    { did: '0x14084f5c44E18FFBecE53c13F176bE417b1F950C', attribute: 'Name', status: 'Pending' },
    { did: '0x335b6ca553D2681E03A0EE1746Ffdafa52b211A1', attribute: 'Marital Status', status: 'Pending' },
    { did: '0xB22Ab149D58921d842195ffe05b3e83195303a63', attribute: 'Name', status: 'Pending' },
    { did: '0x5e7cAd0e20b100Ecce3D42f3f564432D219edc5d', attribute: 'Gender', status: 'Pending' },
    { did: '0x14084f5c44E18FFBecE53c13F176bE417b1F950C', attribute: 'Name', status: 'Pending' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Marital Status', status: 'Pending' },
    { did: '0x5e7cAd0e20b100Ecce3D42f3f564432D219edc5d', attribute: 'DOB', status: 'Pending' },
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

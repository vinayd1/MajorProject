import React, { Component } from 'react'
import uuid from 'react-uuid';
import './styles.css';

const ver = [
    { did: '0x50225bE7EdeEfeC7C28e11BBFD5544e29af42Add', attribute: 'Gender', status: 'Pending' },
    { did: '0xE9439E54DEF1fc50499b3589963c2266B2432511', attribute: 'Name', status: 'Approved' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Gender', status: 'Pending' },
    { did: '0xa8c38Ed8DC407fB8d6Fa807AbB09A43F6427e206', attribute: 'DOB', status: 'Pending' },
    { did: '0x335b6ca553D2681E03A0EE1746Ffdafa52b211A1', attribute: 'Cerificate', status: 'Approved' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Name', status: 'Pending' },
    { did: '0xa229347C0c11BcDe4654105F6B6971Cd07737D37', attribute: 'DOB', status: 'Failed' },
    { did: '0xAc5C8a4482D22F38642D01154501660963c85745', attribute: 'DOB', status: 'Rejected' },
    { did: '0x14084f5c44E18FFBecE53c13F176bE417b1F950C', attribute: 'Name', status: 'Pending' },
    { did: '0x335b6ca553D2681E03A0EE1746Ffdafa52b211A1', attribute: 'Marital Status', status: 'Approved' },
    { did: '0xB22Ab149D58921d842195ffe05b3e83195303a63', attribute: 'Name', status: 'Pending' },
    { did: '0x5e7cAd0e20b100Ecce3D42f3f564432D219edc5d', attribute: 'Gender', status: 'Failed' },
    { did: '0x14084f5c44E18FFBecE53c13F176bE417b1F950C', attribute: 'Name', status: 'Pending' },
    { did: '0x039cB2bAbb2582D6fB32a13991b1b8418758787e', attribute: 'Marital Status', status: 'Approved' },
    { did: '0x5e7cAd0e20b100Ecce3D42f3f564432D219edc5d', attribute: 'DOB', status: 'Pending' },
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
        reqList: [],
        verList: ver || [],
    }

    async componentDidMount() {
        await this.getEvents();
    }

    getEvents = async () => {
        const { contract, account } = this.props;
        const dataRequestEvent = await contract.getPastEvents(
            'GetDataRequestEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { from: account } }
        );
        const dataResponseEvent = await contract.getPastEvents(
            'GetDataResponseEvent',
            { fromBlock: 0, toBlock: 'latest', filter: { to: account } }
        );

        const reqData = Array.isArray(dataRequestEvent) && Array.isArray(dataResponseEvent) ? dataRequestEvent.map(({ returnValues: req = {} } = {}) => {
            const { from, attribute, id } = req;
            const [{ returnValues: { status, value = '' } = {} } = {}] = dataResponseEvent.filter(({ returnValues: res = {} } = {}) => res.id && res.id === req.id);
            if (status !== 1)
                return { did: from, attribute, id, value: null, status: this.getStatus(status) }
            const signedData = JSON.parse(value);
            const authority = window.web3.eth.accounts.recover(signedData);
            return { did: from, attribute, id, value: signedData, status: authority ? this.getStatus(1) : "Failed", authority }
        }) : []

        console.log({ reqData });

        this.setState(() => {
            return { reqList: reqData }
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

    reqData = async (data = {}) => {
        this.setState({
            reqData: {
                did: '',
                attr: '',
            },
        });
        const id = uuid();
        try {
            await data.did && data.attr && this.props.contract.methods.triggerDataRequest(id, data.did, data.attr).send({ from: this.props.account })
        } catch (err) {
            console.log({ ...err })
        }
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
                    data.map((item, index) => <tr key={uuid()}>
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
                    <button className="btn btn-primary btn-block" onClick={async () => await this.reqData(reqData)}>Get data request</button>
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
            {this.getView("Date requests", reqList, this.deleteReq)}
            {this.getView("Verification requests", verList, this.deleteVer)}
        </div>
    }
}

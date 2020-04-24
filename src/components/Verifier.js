import React, { Component } from 'react'

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

    render() {
        const { reqData, verifyData } = this.state;
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
        </div>
    }
}

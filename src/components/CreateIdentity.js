import React, { Component } from 'react'
import './styles.css';

const selectType = [
    { display: "Text", value: "text" },
    { display: "Number", value: "number" },
    { display: "Date", value: "date" },
    { display: "Password", value: "password" },
]

export default class CreateIdentity extends Component {

    state = {
        name: this.props.data && this.props.data.name || {
            val: '',
            authority: null
        },
        dob: this.props.data && this.props.data.dob || {
            val: '',
            authority: null
        },
        data: this.props.data && this.props.data.data || []
    }

    getInput = (data, index) => <div key={index} className="row py-1">
        <div className="col-3 px-0">
            <input
                value={data.key || ''}
                id={`key-${index}`}
                type="text"
                onChange={(inp) => {
                    const { data } = this.state;
                    data[index].key = inp && inp.target.value
                    this.setState({ data })
                }}
                className="form-control"
                placeholder="Key"
                required />
        </div>
        <div className="col-3 pr-0">
            <select
                defaultValue='text'
                id={`type-${index}`}
                onChange={(inp) => {
                    const { data } = this.state;
                    data[index].type = inp && inp.target.value;
                    this.setState({ data })
                }}
                className="form-control"
                required
                placeholder="Select type"
            >
                {
                    selectType.map((type) => <option key={type.value} value={type.value}>
                        {type.display}
                    </option>)
                }
            </select>
        </div>
        <div className="col-3">
            <input
                value={data.val || ''}
                id={`value-${index}`}
                type={this.state.data[index].type}
                onChange={(inp) => {
                    const { data } = this.state;
                    data[index].val = inp && inp.target.value;
                    this.setState({ data });
                }}
                className="form-control"
                placeholder={`Enter ${this.state.data[index].key || "value"}`}
                required />
        </div>
        <div className="col-3 px-0">
            <select
                defaultValue={data.authority || ''}
                id={`authority-${index}`}
                onChange={(inp) => {
                    const { data } = this.state;
                    data[index].authority = inp.target.value;
                    this.setState({ data });
                }}
                className="form-control"
                required
            >
                <option value="" disabled>Select an authority</option>
                {
                    this.props.authorities.map((authority) => <option key={authority.PublicKey} value={authority.PublicKey}>
                        {authority.AuthorityName} ({authority.PublicKey})
                    </option>)
                }
            </select>
        </div>
    </div>

    submit = () => {
        const { name, dob, data } = this.state;
        const requestData = [
            {
                key: "Name",
                value: name.val,
                authority: name.authority,
            },
            {
                key: "DOB",
                value: dob.val,
                authority: dob.authority,
            },
            ...data.map(item => ({
                key: item.key,
                value: item.val,
                authority: item.authority,
            }))
        ];
        console.log({ requestData })
        this.props.createIdentity(requestData)
    }

    addMore = () => {
        const { data } = this.state;
        data.push({
            key: '',
            type: 'text',
            val: null,
            authority: null
        });
        this.setState({ data })
    }

    render = () => {
        const { name, dob } = this.state;
        const {authorities} = this.props;
        console.log({authorities})
        return <div className="content mx-auto" style={{ width: "800px" }}>
            <div className="row py-1">
                <div className="col-6 rounded-border py-1">Name: </div>
                <div className="col-3">
                    <input
                        value={name.val || ''}
                        id="name"
                        type="text"
                        onChange={(inp) => { inp && this.setState({ name: { ...this.state.name, val: inp.target.value } }) }}
                        className="form-control"
                        placeholder="Enter name"
                        required />
                </div>
                <div className="col-3 px-0">
                    <select
                        defaultValue={name.authority || ''}
                        id="authority-name"
                        onChange={(inp) => { inp && this.setState({ name: { ...this.state.name, authority: inp.target.value } }) }}
                        className="form-control"
                        required
                    >
                        <option value="" disabled>Select an authority</option>
                        {
                            this.props.authorities.map((authority) => <option key={authority.PublicKey} value={authority.PublicKey}>
                                {authority.AuthorityName} ({authority.PublicKey})
                </option>)
                        }
                    </select>
                </div>
            </div>
            <div className="row py-1">
                <div className="col-6 rounded-border py-1">Date of Birth:</div>
                <div className="col-3">
                    <input
                        value={dob.val || ''}
                        id="dob"
                        type="date"
                        onChange={(inp) => { inp && this.setState({ dob: { ...this.state.dob, val: inp.target.value } }) }}
                        className="form-control"
                        placeholder="Enter Date of birth"
                        required />
                </div>
                <div className="col-3 px-0">
                    <select
                        defaultValue={dob.authority || ''}
                        id="authority-dob"
                        onChange={(inp) => { inp && this.setState({ dob: { ...this.state.dob, authority: inp.target.value } }) }}
                        className="form-control"
                        required
                    >
                        <option value="" disabled>Select an authority</option>
                        {
                            authorities.map((authority) => <option key={authority.PublicKey} value={authority.PublicKey}>
                                {authority.AuthorityName} ({authority.PublicKey})
                        </option>
                            )
                        }
                    </select>
                </div>
            </div>
            {
                this.state.data.map((item, index) => this.getInput(item, index))
            }
            <div className="d-flex justify-content-end align-items-center">
                <p className="m-0 text-primary fw-450 pointer" onClick={this.addMore}>+ Add more data</p>
            </div>
            <div className="py-3" />
            <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-primary btn-block w-50" onClick={this.submit}>{this.props.buttonText || "Create Identity"}</button>
            </div>
        </div>
    }
}
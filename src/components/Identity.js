import React, { Component } from 'react'
import uuid from 'react-uuid'
import './styles.css';
import CreateIdentity from './CreateIdentity';

export default class Identity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || {},
            edit: false
        }

    }
    
    componentDidUpdate(prevProps) {
        JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data) && this.setState({data: this.props.data})
    }

    getEditState = () => {
        const { data, editIdentity, authorities } = this.props;
        const [name] = Array.isArray(data) ? data.filter(item => item.key === "Name").map((item) => ({ val: item.value, authority: item.authority })) : []

        const [dob] = Array.isArray(data) ? data.filter(item => item.key === "DOB").map((item) => ({ val: item.value, authority: item.authority })) : []

        const otherData = Array.isArray(data) ? data.filter(item => item.key !== "DOB" && item.key !== "Name")
            .map((item) => ({ key: item.key, type: '', val: item.value, authority: item.authority })) : []

        return <>
            <div className="d-flex justify-content-end">
                <p className="m-0 text-danger fw-450 pointer" onClick={() => this.setState({ edit: false })}>Close X</p>
            </div>
            <h2 className="text-center">Edit your Identity</h2>
            <CreateIdentity data={{
                name, dob, data: otherData
            }} createIdentity={async (data) => {
                await editIdentity(data);
                this.setState({ edit: false })
            }} authorities={authorities}
                buttonText="Edit Identity" />
        </>
    }

    render = () => <div className="content mx-auto" style={{ width: "800px" }}>
        {
            this.state.edit ? this.getEditState() : <>
                <div className="d-flex justify-content-end align-items-center">
                    <p className="m-0 pointer text-primary fw-450" onClick={() => this.setState({ edit: true })}>Edit &#128393;</p>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">Key</th>
                            <th scope="col" className="text-center">Value</th>
                            <th scope="col" className="text-center">Authority Name</th>
                            <th scope="col" className="text-center">Authority Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((item) => <tr key={uuid()}>
                                <td align="center">{item.key}</td>
                                <td align="center">{item.value}</td>
                                <td align="center">{item.authorityName}</td>
                                <td align="center">{item.authority}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </>
        }
    </div>
}
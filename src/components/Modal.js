import React from 'react'
import PropTypes from 'prop-types'

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        window.$(this.modal).modal("show");
        window.$(this.modal).on("hidden.bs.modal", handleModalCloseClick);
    }

    componentWillUnmount() {
        window.$("#modal").modal("hide");
    }

    handleCloseClick() {
        window.$(this.modal).modal("hide");
        this.props.handleModalCloseClick();
        window.$("#modal").modal("hide");
    }

    render() {
        return <div className={`modal fade ${this.props.className}`}
            ref={(modal) => this.modal = modal}
            id="modal" tabIndex="-1"
            data-backdrop={this.props.dataBackdrop && this.props.dataBackdrop}
            data-keyboard={this.props.dataKeyboard ? this.props.dataKeyboard : "true"}
            role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div
                className={`modal-dialog ${this.props.small ? "modal-sm " : this.props.medium ? "modal-md " : "modal-lg"}`}
                role="document">
                <div className={this.props.marginTop ? "modal-content marginTop200" : "modal-content"}>
                    {this.props.heading &&
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{this.props.heading}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>}
                    <div
                        className={this.props.noBodyPadding ? "modal-body p-0" : "modal-body"}>{this.props.children}</div>
                </div>
            </div>
        </div>;
    }
}

Modal.propTypes = {
    small: PropTypes.bool,
    heading: PropTypes.string,
    handleModalCloseClick: PropTypes.func.isRequired
};

export default Modal;
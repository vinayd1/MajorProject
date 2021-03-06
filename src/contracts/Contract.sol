pragma solidity ^0.5.0;


contract Contract {
    mapping(address => Identity) identities;
    mapping(string => VerificationData) verificationDataList;
    struct Identity {
        address did;
        string contentAddress;
    }
    struct VerificationData {
        string value;
        bool exist;
    }
    event GetDataRequestEvent(
        string id,
        address indexed from,
        address indexed to,
        string attribute
    );
    event GetDataResponseEvent(
        string id,
        address indexed from,
        address indexed to,
        string value,
        uint8 status //0 => rejected, 1 => approved, 2 => failed
    );
    event VerifyDataRequestEvent(
        string id,
        address indexed from,
        address indexed to,
        string attribute,
        string value
    );
    event VerifyDataResponseEvent(
        string id,
        address indexed from,
        address indexed to,
        string signature,
        bool verifiedStatus,
        uint8 status //0 => rejected, 1 => approved, 2 => failed
    );

    function createIdentity(string memory _contentAddress)
        public
        returns (bool)
    {
        require(
            bytes(_contentAddress).length > 0,
            "No content address was provided"
        );
        if (bytes(_contentAddress).length <= 0) return false;
        identities[msg.sender] = Identity(msg.sender, _contentAddress);
        return true;
    }

    function getIdentity() public view returns (string memory) {
        return identities[msg.sender].contentAddress;
    }

    function editIdentity(string memory _contentAddress) public returns (bool) {
        require(
            bytes(_contentAddress).length > 0,
            "No content address was provided"
        );
        if (bytes(identities[msg.sender].contentAddress).length <= 0)
            return false;
        identities[msg.sender] = Identity(msg.sender, _contentAddress);
        return true;
    }

    function triggerDataRequest(
        string memory _id,
        address _to,
        string memory _attribute
    ) public {
        require(!verificationDataList[_id].exist, "Id is not unique");
        require(_to != address(0), "Recipient address not provided");
        require(bytes(_attribute).length > 0, "Attribute not provided");
        emit GetDataRequestEvent(_id, msg.sender, _to, _attribute);
    }

    function triggerDataResponse(
        string memory _id,
        address _to,
        string memory _value,
        uint8 _status
    ) public {
        require(_to != address(0), "Recipient address not provided");
        require(_status >= 0 && _status <= 2, "Invalid status");

        emit GetDataResponseEvent(_id, msg.sender, _to, _value, _status);
    }

    function triggerVerifyRequest(
        string memory _id,
        address _to,
        string memory _attribute,
        string memory _value
    ) public {
        require(!verificationDataList[_id].exist, "Id is not unique");
        require(_to != address(0), "Recipient address not provided");
        require(bytes(_attribute).length > 0, "Attribute not provided");
        require(bytes(_value).length > 0, "Value not provided");

        verificationDataList[_id].value = _value;
        verificationDataList[_id].exist = true;
        emit VerifyDataRequestEvent(_id, msg.sender, _to, _attribute, _value);
    }

    function triggerVerifyResponse(
        string memory _id,
        address _to,
        string memory _value,
        string memory _signature,
        uint8 _status
    ) public returns (bytes32) {
        require(verificationDataList[_id].exist, "Request not found");
        require(_to != address(0), "Verifier address not provided");
        require(_status >= 0 && _status <= 2, "Invalid status");

        if (keccak256(abi.encodePacked(verificationDataList[_id].value)) == keccak256(abi.encodePacked(_value)))
            emit VerifyDataResponseEvent(_id, msg.sender, _to, _signature, true, _status);
        else
            emit VerifyDataResponseEvent(_id, msg.sender, _to, '', false, _status);

        verificationDataList[_id].exist = false;
    }
}

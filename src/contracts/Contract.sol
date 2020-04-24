pragma solidity ^0.5.0;

contract Contract {

    mapping(address => Identity) identities;
    mapping(uint => VerificationData) verificationDataList;
    struct Identity {
        address did;
        string contentAddress;
    }
    struct VerificationData {
        string value;
        bool exist;
    }
    event GetDataRequestEvent(
        uint256 id,
        address indexed from,
        address indexed to,
        string attribute
    );
    event GetDataResponseEvent(
        uint256 id,
        address indexed from,
        address indexed to,
        string value
    );
    event VerifyDataRequestEvent(
        uint256 id,
        address indexed from,
        address indexed to,
        string attribute
    );
    event VerifyDataResponseEvent(
        uint256 id,
        address indexed from,
        address indexed to,
        address verifier,
        bool status
    );

    function createIdentity(string memory _contentAddress) public returns(bool) {
        require(bytes(_contentAddress).length > 0, 'No content address was provided');
        if(bytes(_contentAddress).length <= 0) return false;
        identities[msg.sender] = Identity(msg.sender, _contentAddress);
        return true;
    }
    function getIdentity() public view returns (string memory){
        return identities[msg.sender].contentAddress;
    }
    function editIdentity(string memory _contentAddress) public returns(bool) {
        require(bytes(_contentAddress).length > 0, 'No content address was provided');
        if(bytes(identities[msg.sender].contentAddress).length <= 0) return false;
        identities[msg.sender] = Identity(msg.sender, _contentAddress);
        return true;
    }
    function triggerDataRequest(uint256 _id, address _to, string memory _attribute) public {
        require(_id > 0, 'Id is invalid');
        require(verificationDataList[_id].exist, "Id is not unique");
        require(_to != address(0), "Recipient address not provided");
        require(bytes(_attribute).length > 0, "Attribute not provided");
        emit GetDataRequestEvent(_id, msg.sender, _to, _attribute);
    }
    function triggerDataResponse(uint256 _id, address _to, string memory _value) public {
        require(_id > 0, 'Id not provided');
        require(verificationDataList[_id].exist, "Id is not unique");
        require(_to != address(0), "Recipient address not provided");
        require(bytes(_value).length > 0, "Value not provided");
        emit GetDataResponseEvent(_id, msg.sender, _to, _value);
    }
    function triggerVerifyRequest(uint256 _id, address _to, string memory _attribute, string memory _value) public {
        require(_id > 0, 'Id not provided');
        require(verificationDataList[_id].exist, "Id is not unique");
        require(_to != address(0), "Recipient address not provided");
        require(bytes(_attribute).length > 0, "Attribute not provided");
        require(bytes(_value).length > 0, "Value not provided");
        verificationDataList[_id].value = _value;
        verificationDataList[_id].exist = true;
        emit VerifyDataRequestEvent(_id, msg.sender, _to, _attribute);
    }
    function triggerVerifyResponse(uint256 _id, address _to, string memory _value, bytes memory _signature) public {
        verificationDataList[_id].exist = false;
        require(_id > 0, 'Id not provided');
        require(_to != address(0), "Recipient address not provided");
        require(bytes(_value).length > 0, "Value not provided");
        bytes32 r;
        bytes32 s;
        uint8 v;
        if(_signature.length != 65){
            emit VerifyDataResponseEvent(_id, msg.sender, _to, address(0), false);
            return;
        }
        assembly{
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }
        if(v < 27) v += 27;
        if(v != 27 && v != 28) {
            emit VerifyDataResponseEvent(_id, msg.sender, _to, address(0), false);
            return;
        }
        address _authority = ecrecover(keccak256(abi.encodePacked(_value)), v, r, s);
        if(keccak256(abi.encodePacked((verificationDataList[_id].value))) != keccak256(abi.encodePacked((_value)))) {
            emit VerifyDataResponseEvent(_id, msg.sender, _to, _authority, false);
            return;
        }
        emit VerifyDataResponseEvent(_id, msg.sender, _to, _authority, true);
    }
}
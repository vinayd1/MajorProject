pragma solidity ^0.5.0;

contract Contract {
    event NewEvent(
        address indexed from
    );

    function trigger() public {
        emit NewEvent(msg.sender);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {AxelarExecutable} from "lib/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {StringToAddress} from "lib/axelar-gmp-sdk-solidity/contracts/libs/AddressString.sol";

interface IBridgeContract {
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) external;
}

struct DataAttestation {
    bytes commP;
    int64 duration;
    uint64 FILID;
    uint status;
}

interface IReceiveAttestation {
    function proveDataStored(DataAttestation calldata attestation_) external;
}

contract AxelarBridge is AxelarExecutable {
    address public receiver;
    address public sender;
    event ReceivedAttestation(
        string sourceChain,
        string sourceAddress,
        bytes commP,
        bytes attestation
    );
    using StringToAddress for string;

    constructor(address _gateway) AxelarExecutable(_gateway) {}

    event check(bytes, string, string);

    function setSenderReceiver(address sender_, address receiver_) external {
        receiver = receiver_;
        sender = sender_;
    }

    function _execute(
        string calldata _sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        DataAttestation memory attestation = abi.decode(
            payload_,
            (DataAttestation)
        );
        emit ReceivedAttestation(
            _sourceChain_,
            sourceAddress_,
            attestation.commP,
            payload_
        );
        require(
            StringsEqual(_sourceChain_, "filecoin-2"),
            "Only filecoin supported"
        );
        require(
            sender == sourceAddress_.toAddress(),
            "Only registered sender addr can execute"
        );

        emit check(payload_, sourceAddress_, _sourceChain_);

        IReceiveAttestation(receiver).proveDataStored(attestation);
    }
}

function StringsEqual(string memory a, string memory b) pure returns (bool) {
    bytes memory aBytes = bytes(a);
    bytes memory bBytes = bytes(b);

    if (aBytes.length != bBytes.length) {
        return false;
    }

    for (uint i = 0; i < aBytes.length; i++) {
        if (aBytes[i] != bBytes[i]) {
            return false;
        }
    }

    return true;
}

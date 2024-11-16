// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Cid} from "./Cid.sol";
import {TRUNCATOR} from "./Const.sol";
import {DataAttestation} from "./Oracles.sol";

// Adapted from https://github.com/lighthouse-web3/raas-starter-kit/blob/main/contracts/data-segment/Proof.sol
// adapted rather than imported to
//  1) avoid build issues
//  2) avoid npm deps
//  3) avoid use of deprecated @zondax/filecoin-solidity
contract PODSIVerifier {
    // ProofData is a Merkle proof
    struct ProofData {
        uint64 index;
        bytes32[] path;
    }

    // verify verifies that the given leaf is present in the merkle tree with the given root.
    function verify(
        ProofData memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool) {
        return computeRoot(proof, leaf) == root;
    }

    // computeRoot computes the root of a Merkle tree given a leaf and a Merkle proof.
    function computeRoot(
        ProofData memory d,
        bytes32 subtree
    ) internal pure returns (bytes32) {
        require(
            d.path.length < 64,
            "merkleproofs with depths greater than 63 are not supported"
        );
        require(
            d.index >> d.path.length == 0,
            "index greater than width of the tree"
        );

        bytes32 carry = subtree;
        uint64 index = d.index;
        uint64 right = 0;

        for (uint64 i = 0; i < d.path.length; i++) {
            (right, index) = (index & 1, index >> 1);
            if (right == 1) {
                carry = computeNode(d.path[i], carry);
            } else {
                carry = computeNode(carry, d.path[i]);
            }
        }

        return carry;
    }

    // computeNode computes the parent node of two child nodes
    function computeNode(
        bytes32 left,
        bytes32 right
    ) internal pure returns (bytes32) {
        bytes32 digest = sha256(abi.encodePacked(left, right));
        return truncate(digest);
    }

    // truncate truncates a node to 254 bits.
    function truncate(bytes32 n) internal pure returns (bytes32) {
        // Set the two lowest-order bits of the last byte to 0
        return n & TRUNCATOR;
    }
}

contract SmoothStore is PODSIVerifier {
    struct Miner {
        IERC20 token;
        uint256 amountPerByte;
        string location;
        bool retrieval;
        bytes minerId;
    }

    struct Offer {
        bytes minerId;
        bytes commP;
        uint64 size;
        string location;
    }

    uint256 public constant STAKE = 1 * 10 ** 20; // Example stake amount

    event DataReady(Offer offer, uint64 id);
    uint64 private nextOfferId = 1;
    uint64 private nextAggregateID = 1;
    address public dataProofOracle;
    mapping(uint64 => Offer) public offers;
    mapping(uint64 => uint64[]) public aggregations;
    mapping(uint64 => address) public aggregationPayout;
    mapping(uint64 => bool) public provenAggregations;
    mapping(bytes => uint64) public commPToAggregateID;
    mapping(bytes => Miner) public miners;
    // miners array
    Miner[] public minersArray;

    function setOracle(address oracle_) external {
        dataProofOracle = oracle_;
    }

    function registerMiner(
        IERC20 token,
        uint256 amountPerByte,
        string calldata location,
        bool retrieval,
        bytes calldata minerId
    ) external {
        require(
            token.transferFrom(msg.sender, address(this), STAKE),
            "Stake transfer failed"
        );

        miners[minerId] = Miner({
            token: token,
            amountPerByte: amountPerByte,
            location: location,
            retrieval: retrieval,
            minerId: minerId
        });
        minersArray.push(miners[minerId]);
    }

    function offerData(Offer calldata offer) public payable returns (uint64) {
        Miner storage miner = miners[offer.minerId];
        require(miner.token != IERC20(address(0)), "Miner not registered");

        uint256 totalAmount = miner.amountPerByte * offer.size;
        require(
            miner.token.transferFrom(msg.sender, address(this), totalAmount),
            "Payment transfer failed"
        );

        uint64 id = nextOfferId++;
        offers[id] = offer;

        emit DataReady(offer, id);
        return id;
    }

    function offerDataBatch(Offer[] calldata offersArray) external payable {
        for (uint256 i = 0; i < offersArray.length; i++) {
            offerData(offersArray[i]);
        }
    }

    function commitAggregate(
        bytes calldata aggregate,
        uint64[] calldata claimedIDs,
        ProofData[] calldata inclusionProofs,
        address payoutAddr
    ) external {
        uint64[] memory offerIDs = new uint64[](claimedIDs.length);
        uint64 aggId = nextAggregateID++;
        // Prove all offers are committed by aggregate commP
        for (uint64 i = 0; i < claimedIDs.length; i++) {
            uint64 offerID = claimedIDs[i];
            offerIDs[i] = offerID;
            require(
                verify(
                    inclusionProofs[i],
                    Cid.cidToPieceCommitment(aggregate),
                    Cid.cidToPieceCommitment(offers[offerID].commP)
                ),
                "Proof verification failed"
            );
        }
        aggregations[aggId] = offerIDs;
        aggregationPayout[aggId] = payoutAddr;
        commPToAggregateID[aggregate] = aggId;
    }

    function verifyDataStored(
        uint64 aggID,
        uint idx,
        uint64 offerID
    ) external view returns (bool) {
        require(provenAggregations[aggID], "Provided aggregation not proven");
        require(
            aggregations[aggID][idx] == offerID,
            "Aggregation does not include offer"
        );

        return true;
    }

    // Called by oracle to prove the data is stored
    function proveDataStored(DataAttestation calldata attestation) external {
        require(
            msg.sender == dataProofOracle,
            "Only oracle can prove data stored"
        );
        uint64 aggID = commPToAggregateID[attestation.commP];
        require(aggID != 0, "Aggregate not found");

        // transfer payment to the receiver
        for (uint i = 0; i < aggregations[aggID].length; i++) {
            uint64 offerID = aggregations[aggID][i];
            Miner storage miner = miners[offers[offerID].minerId];
            require(
                miner.token.transfer(
                    aggregationPayout[aggID],
                    miner.amountPerByte * offers[offerID].size
                ),
                "Payment transfer failed"
            );
        }
        provenAggregations[aggID] = true;
    }

    function getMinersArray() public view returns (Miner[] memory) {
        return minersArray;
    }
}

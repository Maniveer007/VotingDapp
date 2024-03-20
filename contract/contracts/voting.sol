// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "./Identity.sol";

contract VotingDapp is EIP712WithModifier {
    struct Candidate {
        euint32 id;
        string candidate_name;
        string candidate_description;
        string candidate_logo;
    }

    address public Electionofficer;
    Candidate[] public candidates;
    euint32 public total_casted_votes;
    euint32 public winnerindex;
    VoteRegistry public voteRegistry;
    address[] public requestvoters;
    mapping(address => bool) public isvoted;
    mapping(uint => euint32) public candidate_votes;

    modifier onlyElectionofficer() {
        require(msg.sender == Electionofficer, "Only Election Officer can call this function.");
        require(tx.origin == msg.sender, "Only directly-called transactions are allowed.");
        _;
    }

    constructor(address _identityRegistry) EIP712WithModifier("Authorization token", "1") {
        Electionofficer = msg.sender;
        voteRegistry = VoteRegistry(_identityRegistry);
    }

    function addCandidate(string memory _name, string memory _des, string memory _logo) external onlyElectionofficer {
        candidates.push(Candidate(
            TFHE.asEuint32(candidates.length),
            _name,
            _des,
            _logo
        ));
        candidate_votes[candidates.length - 1] = TFHE.asEuint32(0);
    }

    function CastVote(bytes memory _id) external {
        require(TFHE.decrypt(voteRegistry.verifyVoterByCountry(msg.sender)), "Voter not verified.");
        require(!isvoted[msg.sender], "Already Voted.");
        euint32 id = TFHE.asEuint32(_id);
        for (uint i = 0; i < candidates.length; i++) {
            ebool Valid_vote = TFHE.eq(candidates[i].id, id);
            candidate_votes[i] = TFHE.cmux(Valid_vote, candidate_votes[i] + TFHE.asEuint32(1), candidate_votes[i]);
        }
        total_casted_votes = TFHE.add(total_casted_votes, 1);
        isvoted[msg.sender] = true;
    }

    function requestVoteRight() public {
        requestvoters.push(msg.sender);
    }

    function giveVoteRight(uint index, bytes memory _acceptance) public onlyElectionofficer {
        require(index < requestvoters.length, "Improper Index.");
        ebool Acceptance = TFHE.asEbool(_acceptance);
        if (TFHE.decrypt(Acceptance)) {
            voteRegistry.addVoter(requestvoters[index]);
        }
        for (uint i = index + 1; i < requestvoters.length; i++) {
            requestvoters[i - 1] = requestvoters[i];
        }
        requestvoters.pop();
    }

    function calculate_Results() onlyElectionofficer external {
        euint32 Highest_votes = candidate_votes[0];
        euint32 Winner_Index = TFHE.asEuint32(0);
        ebool isTie=TFHE.asEbool(false);
        for (uint i = 0; i < candidates.length; i++) {
            ebool is_i_MAX = TFHE.lt(Highest_votes, candidate_votes[i]);
            ebool is_i_TIE = TFHE.eq(Highest_votes, candidate_votes[i]);
            Highest_votes = TFHE.cmux(is_i_MAX, candidate_votes[i], Highest_votes);
            Winner_Index = TFHE.cmux(is_i_MAX, TFHE.asEuint32(i), Winner_Index);
            isTie=TFHE.cmux(is_i_MAX,TFHE.asEbool(false),TFHE.or(isTie,is_i_TIE));
        }
        if(TFHE.decrypt(isTie)){
            revert("election is draw unable to finish election");
        }else{
            winnerindex=Winner_Index;
        }
    }

    function get_Results(bytes32 publicKey, bytes calldata signature) public onlySignedPublicKey(publicKey, signature) view returns (bytes memory) {
        require(TFHE.isInitialized(winnerindex), "Winner is not declared yet.");
        return TFHE.reencrypt(winnerindex, publicKey);
    }

    function getcandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}

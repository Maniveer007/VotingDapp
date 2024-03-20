// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity 0.8.20;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteRegistry is EIP712WithModifier,Ownable {

    struct VoterDetails {
        uint VoterID;
        address VoterAddress;
        euint32 CountryCode;
    }

    // A mapping from wallet to Countrycode of registrar 
    mapping(address => euint32) public registrars; // A Registrar can only add voter of the assigned Country

    // A mapping from wallet to an identity.
    mapping(address => VoterDetails) internal identities;

    uint currVoterid;

    event NewRegistrar(address wallet);
    event NewVoterAdded(address wallet);
    event VoterRemoved(address wallet);


    constructor() Ownable(msg.sender) EIP712WithModifier("Authorization token", "1") {
        currVoterid++;
    }

    // Add registrar
	function addRegistrar(address wallet, bytes memory _countrycode) public onlyOwner {
        require(!TFHE.isInitialized(registrars[wallet]),"REGISTAR is already registered for a country"); 
        registrars[wallet] = TFHE.asEuint32(_countrycode);
        emit NewRegistrar(wallet);
    }


    // Add user
    function addVoter(address wallet) public onlyRegistrar {
        require(identities[wallet].VoterID == 0, "This wallet is already registered");
        VoterDetails storage newIdentity = identities[wallet];

        newIdentity.VoterID=currVoterid;
        newIdentity.CountryCode=registrars[msg.sender]; // Each Country has Only One registrars
        newIdentity.VoterAddress=wallet;

        currVoterid++;
        identities[wallet]=newIdentity;
        emit NewVoterAdded(wallet);
    }

    function removeVoter(address wallet) public onlyExistingWallet(wallet) onlyRegistrarOf(wallet) {
        require(identities[wallet].VoterID > 0, "This wallet isn't registered");
        delete identities[wallet];
        emit VoterRemoved(wallet);
    }

    function verifyVoterByCountry(address wallet) public onlyRegistrar() view returns(ebool){
        if(identities[wallet].VoterID > 0){
        return TFHE.eq(registrars[msg.sender],identities[wallet].CountryCode);
        }
        return TFHE.asEbool(false);
    } 

	modifier onlyExistingWallet(address wallet) {
        require(identities[wallet].VoterID > 0, "This wallet isn't registered");
        _;
    }

    modifier onlyRegistrar() {
        require(TFHE.isInitialized(registrars[msg.sender]), "You're not a registrar");
        _;
    }

    modifier onlyRegistrarOf(address wallet) {
        require(TFHE.decrypt(TFHE.eq(registrars[msg.sender],identities[wallet].CountryCode)), "You're not managing this identity");
        _;
    }

    




}
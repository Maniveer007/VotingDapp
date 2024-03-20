const {expect} =require('chai')
const {  exec  } = require('child_process');
const { promisify } = require('util');
const execute = promisify(exec);
const { ethers } = require('ethers');

const hre = require("hardhat");


const fhevmjs =require('fhevmjs')



describe("Contract", function() {


  it("initalising Signers",async function(){
    this.timeout(70000)

    const provider=new ethers.providers.JsonRpcProvider('http://localhost:8545/')

    this.Electionofficer=new ethers.Wallet.createRandom().connect(provider)
    this.voter1=new ethers.Wallet.createRandom().connect(provider)
    this.voter2=new ethers.Wallet.createRandom().connect(provider)
    this.voter3=new ethers.Wallet.createRandom().connect(provider)
    this.voter4=new ethers.Wallet.createRandom().connect(provider)
    this.voter5=new ethers.Wallet.createRandom().connect(provider)

        const waitForBalance = async (address) => {
            return new Promise((resolve, reject) => {
              const checkBalance = async () => {
                const balance = Number(await provider.getBalance(address));
                if (balance > 0) {
                  await provider.off('block', checkBalance);
                  resolve();
                }
              };
               provider.on('block', checkBalance)
            });
          };
        
          if(Number(await provider.getBalance(this.Electionofficer.address))==0){
            await execute(`docker exec -i fhevm faucet ${this.Electionofficer.address}`)
            await waitForBalance(this.Electionofficer.address)
            console.log('funded Electionofficer');
          }
          if(Number(await provider.getBalance(this.voter1.address))==0){
            await execute(`docker exec -i fhevm faucet ${this.voter1.address}`)
            await waitForBalance(this.voter1.address)
            console.log('funded voter1');
          }
          if(Number(await provider.getBalance(this.voter2.address))==0){
            await execute(`docker exec -i fhevm faucet ${this.voter2.address}`)
            await waitForBalance(this.voter2.address)
            console.log('funded voter2');
          }
          if(Number(await provider.getBalance(this.voter3.address))==0){
            await execute(`docker exec -i fhevm faucet ${this.voter3.address}`)
            await waitForBalance(this.voter3.address)
            console.log('funded voter3');
          }
          if(Number(await provider.getBalance(this.voter4.address))==0){
            await execute(`docker exec -i fhevm faucet ${this.voter4.address}`)
            await waitForBalance(this.voter4.address)
            console.log('funded voter4');
      
          }
          if(Number(await provider.getBalance(this.voter5.address))==0){
            await execute(`docker exec -i fhevm faucet ${this.voter5.address}`)
            await waitForBalance(this.voter5.address)
            console.log('funded voter5');
          }

    })

    it("setting up instance and token",async function(){

      const provider=new ethers.providers.JsonRpcProvider('http://localhost:8545/')
  
        const network = await provider.getNetwork();
  
        const chainId = Number(network.chainId)
  
  
        const ret = await provider.call({
          // fhe lib address, may need to be changed depending on network
          to: "0x000000000000000000000000000000000000005d",
          // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
          data: "0xd9d47bb001",
        });
  
        const abiCoder = new ethers.utils.AbiCoder();
        const decoded = abiCoder.decode(['bytes'], ret);
      
        const publicKey = decoded[0];
  
        this.instance= await fhevmjs.createInstance({chainId,publicKey})
    })


    it("deploying contract",async function(){
      this.timeout(70000)
      const VoteRegistry = await hre.ethers.getContractFactory("VoteRegistry",this.Electionofficer);
      this.VoteRegistry=await VoteRegistry.deploy();

      const VotingDapp = await hre.ethers.getContractFactory("VotingDapp",this.Electionofficer);
      this.Electionofficer_contract = await VotingDapp.deploy(this.VoteRegistry.address);

      const countrycodeofFRANCE=this.instance.encrypt32(33)
      const tx=await this.VoteRegistry.addRegistrar(this.Electionofficer_contract.address,countrycodeofFRANCE)
      await tx.wait()

       
      this.voter1_contract=this.Electionofficer_contract.connect(this.voter1);
      this.voter2_contract=this.Electionofficer_contract.connect(this.voter2);
      this.voter3_contract=this.Electionofficer_contract.connect(this.voter3);
      this.voter4_contract=this.Electionofficer_contract.connect(this.voter4);
      this.voter5_contract=this.Electionofficer_contract.connect(this.voter5);
  })



  it("adding candidates and request Voteright",async function(){
    this.timeout(70000)
    const tx1=await this.Electionofficer_contract.addCandidate("Maniveer","DES1","MV");
    await tx1.wait();

    const tx2=await this.Electionofficer_contract.addCandidate("Prajwal","des2","PJ");
    await tx2.wait();

    const _input19=this.instance.encrypt32(20);

    const tx3=await this.voter1_contract.requestVoteRight();
    await tx3.wait();

    const tx4=await this.voter2_contract.requestVoteRight();
    await tx4.wait();

    const tx5=await this.voter3_contract.requestVoteRight();
    await tx5.wait();

    const tx6=await this.voter4_contract.requestVoteRight();
    await tx6.wait();

    const tx7=await this.voter5_contract.requestVoteRight();
    await tx7.wait();
  })
  it("giving vote right",async function (){
    this.timeout(70000)
    const inputbooltrue=this.instance.encrypt8(1);

    const tx1=await this.Electionofficer_contract.giveVoteRight(0,inputbooltrue);
    await tx1.wait();
    
    const tx2=await this.Electionofficer_contract.giveVoteRight(0,inputbooltrue);
    await tx2.wait();
    
    const tx3=await this.Electionofficer_contract.giveVoteRight(0,inputbooltrue);
    await tx3.wait();
    
    const tx4=await this.Electionofficer_contract.giveVoteRight(0,inputbooltrue);
    await tx4.wait();
    
    const tx5=await this.Electionofficer_contract.giveVoteRight(0,inputbooltrue);
    await tx5.wait();
    

  })
  it("castvote",async function (){
    this.timeout(90000)

    const zeroinput=this.instance.encrypt32(0);
    const oneinput=this.instance.encrypt32(1);

    const tx1=await this.voter1_contract.CastVote(zeroinput)
    await tx1.wait()

    const tx2=await this.voter2_contract.CastVote(zeroinput)
    await tx2.wait()

    const tx3=await this.voter3_contract.CastVote(oneinput)
    await tx3.wait()

    const tx4=await this.voter4_contract.CastVote(oneinput)
    await tx4.wait()

    const tx5=await this.voter5_contract.CastVote(oneinput)
    await tx5.wait()
  })

  it("CALCULATE RESULTS", async function (){
    this.timeout(70000)
    const tx=await this.Electionofficer_contract.calculate_Results({gasLimit:9000000 });

    await tx.wait();


  const generatedToken = this.instance.generatePublicKey({
    name: "Authorization token",
    verifyingContract: this.Electionofficer_contract.address,
  });

  const sign = await this.Electionofficer._signTypedData(   
     generatedToken.eip712.domain,
    { Reencrypt: generatedToken.eip712.types.Reencrypt }, 
    generatedToken.eip712.message,);


    
    const winner=await this.Electionofficer_contract.get_Results(generatedToken.publicKey, sign);
    const num=this.instance.decrypt(this.Electionofficer_contract.address,winner)
    console.log(Number(num));



  })



})
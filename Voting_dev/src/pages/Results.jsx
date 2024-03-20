import React, { useEffect, useState } from 'react';
import { useGlobalContext } from "../context";

const Results = () => {
  const [electionsCompleted, setElectionsCompleted] = useState(false);
  const [Candidatename, setCandidatename] = useState();
  const {address,contract,instance}=useGlobalContext();
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const contentStyle = {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#232a32',
  };

  const headerStyle = {
    fontSize: '2rem',
    color: '#b95ce0',
    marginBottom: '1rem',
  };

  const textStyle = {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '2rem',
  };
  const getdata=async()=>{
    const generatedToken = instance.generateToken({
      name: "Authorization token",
      verifyingContract: contract.address,
    });

    const params = [address, JSON.stringify(generatedToken.token)];
    const sign =  await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params,
      });
    try {
      const encryptdwinnerindex=await contract.get_Results(generatedToken.publicKey,sign);

      const winnerindex=instance.decrypt(contract.address,encryptdwinnerindex);

      const candidates=await contract.getCandidates();

      setCandidatename(candidates[winnerindex][1]);


    }catch(e){
      setElectionsCompleted(false)
    }
  }

  useEffect(()=>{
    getdata()
  },[])

  
  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {electionsCompleted ? (
          <div>
            <h2 style={headerStyle}>Results</h2>
            <p style={textStyle}>{Candidatename} won the elections!</p>
          </div>
        ) : (
          <div>
            <h2 style={headerStyle}>Elections Not Completed</h2>
            <p style={textStyle}>Come back again to view the results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;

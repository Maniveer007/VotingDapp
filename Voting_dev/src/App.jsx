import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";

import { GlobalContextProvider } from "./context/index.jsx";
import Spinner from "./components/Spinner.jsx";
import Vote from "./pages/vote.jsx";
import Registervote from "./pages/registervote.jsx";
import Results from "./pages/Results.jsx";


function App() {
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(false);



  const updateWallet = (wallet) => {
    setWallet(wallet);
  };
  
  

  return (<>
  <GlobalContextProvider>

    <div>

      <Navbar
        updateWallet={updateWallet}
        wallet={wallet}
        loading={loading}
      />
      
      <Toaster />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/RegisterVote" element={<Registervote />} />
        <Route path="/Results" element={<Results />} />
        <Route path="*" element={<Spinner />} />
      </Routes>

    </div>
  </GlobalContextProvider>
  </>
  );
}

export default App;

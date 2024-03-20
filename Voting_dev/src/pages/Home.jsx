import "../App.css";
import Lottie from "lottie-react";
import moiLottie from "../lotties/moiLottie.json";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
    <div className="flex flex-col content-center mt-[2rem] max-md:p-2 overflow-y-hidden">
  <h1 className="text-center font-extrabold text-4xl text-blue-800 mb-2 py-6 animate-charcter max-md:text-2xl">
    Welcome to
  </h1>
  <h1 className="text-center font-extrabold text-4xl text-blue-800 mb-2 py-4 animate-charcter max-md:text-2xl">
    Zama-Vote
  </h1>
</div>

<div className="p-8 pb-0">
  <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left">
    <Link
      to="vote"
      className="text-lg font-semibold transition-transform duration-450 hover:transform hover:scale-105 mb-4 md:mb-0 text-blue-600"
    >
      <button
        className="px-6 py-3 mt-4 bg-yellow-500 text-gray-800 rounded-lg hover:bg-yellow-600 focus:outline-none transition-transform duration-450 hover:transform max-md:text-base"
      >
        Vote Now
      </button>
    </Link>
  </div>
</div>

  


      <div className="md:flex md:flex-row content-center justify-center md:mt-[3rem] max-md:p-12 max-md:px-3">
        <div className="flex items-center justify-center ml-5 md:w-1/4 md:mr-[150px]"><p className="text-xl max-md:text-lg text-justify">
        Welcome to BlockVote, the groundbreaking voting app that leverages the power of blockchain technology to revolutionize the way we participate in democratic processes. With BlockVote, your voice is not just heard, but securely and transparently recorded on an immutable blockchain, ensuring the integrity and authenticity of every vote.</p>
        </div>
        <div className="mr-5 w-1/4 max-md:flex max-md:justify-center max-md:items-center max-md:w-full"><Lottie animationData={moiLottie} loop={true} /></div>
      </div>

      {/* go to all contests button */}


      {/* footer */}
      <div className="pt-9">
        <div className="flex-col justify-center">
          <div className=" text-gray-400 pt-7 border-t border-gray-800 text-center pb-4"> Copyrights Reserved </div>
        </div>
      </div>

    </>
  );
};

export default Home;

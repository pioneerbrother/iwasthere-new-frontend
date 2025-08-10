// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="p-8 flex flex-col items-center">
            {/* You can add the top banner back here if you like */}
            {/* <div className="w-full text-center py-2 bg-blue-100 text-blue-800">
                A place to share your story. Join our community of photographers & storytellers on Facebook. 
                <a href="#" className="font-bold underline ml-2">JOIN NOW</a>
            </div> */}

            <h1 className="text-5xl font-bold mt-12">I Was There</h1>
            
            <div className="w-full max-w-lg mt-10 p-8 border rounded-lg shadow-lg flex flex-col items-center text-center">
                <p className="text-xl mb-6">Immortalize your memories on the blockchain. Forever.</p>
                
                <div className="w-full max-w-sm p-4 border rounded-md mb-8">
                    <p className="text-gray-600">COMMUNITY PRIZE POOL</p>
                    <p className="text-4xl font-bold my-2">$0.00</p>
                    <p className="text-sm text-gray-500">Goal: 1 BTC (~$120,000) <a href="#" className="underline">(View Wallet)</a></p>
                </div>

                <h2 className="text-2xl font-semibold">Connect Wallet to Begin</h2>
                <p className="mt-2 text-gray-600">Connect your wallet to begin your journey.</p>
                
                {/* This button can be for Web3 login later */}
                <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                    Connect Wallet
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
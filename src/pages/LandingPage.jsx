// File: new-frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @title The Sentry Landing Page
 * @notice The public-facing entry point for the Sentry service.
 */
function LandingPage() {
    return (
        <div className="bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                        Stop Checking Etherscan.
                        <br />
                        Start Getting Alerts.
                    </h1>
                    <p className="mt-6 text-xl text-gray-300">
                        Sentry is your automated monitoring tool for the blockchain. Create custom, real-time alerts for any smart contract, transaction, or wallet activity.
                    </p>
                    <Link to="/login">
                        <button className="mt-8 px-8 py-3 font-semibold text-lg bg-blue-600 hover:bg-blue-700 rounded-lg transition-transform transform hover:scale-105">
                            Monitor Your First Contract for Free
                        </button>
                    </Link>
                </div>
            </section>

            {/* Features/Pain Points Section */}
            <section className="py-20 px-4 bg-gray-800">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold">Never Fly Blind Again</h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-12">
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold">Is Your DeFi Position Safe?</h3>
                            <p className="mt-4 text-gray-400">Get a RED ALERT if a farm's contract owner changes or a massive withdrawal occurs.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold">Did a Key Wallet Just Sell?</h3>
                            <p className="mt-4 text-gray-400">Stop missing market movements. Get notified the second a wallet you're tracking sells its tokens.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold">Did Your NFT Just Get an Offer?</h3>
                            <p className="mt-4 text-gray-400">Stop refreshing marketplaces. Get an instant alert the moment a key event happens on your NFT's contract.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold">Your Sentry Online in 60 Seconds</h2>
                    <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-12">
                        <div>
                            <div className="text-4xl mb-4">1.</div>
                            <h3 className="text-2xl font-semibold">Login / Sign Up</h3>
                            <p className="text-gray-400">A simple, secure login with your email. No wallet connection needed to start.</p>
                        </div>
                        <div className="text-2xl text-gray-600 hidden md:block">→</div>
                        <div>
                            <div className="text-4xl mb-4">2.</div>
                            <h3 className="text-2xl font-semibold">Set Your Sentry</h3>
                            <p className="text-gray-400">Paste a contract address and give your alert a name.</p>
                        </div>
                         <div className="text-2xl text-gray-600 hidden md:block">→</div>
                        <div>
                            <div className="text-4xl mb-4">3.</div>
                            <h3 className="text-2xl font-semibold">Get Notified</h3>
                            <p className="text-gray-400">Receive instant, actionable intelligence via Email.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
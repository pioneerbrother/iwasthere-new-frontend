// File: src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @title The Sentry Landing Page
 * @author Simo & Gemini
 * @notice The public-facing capital of the iwasthere.watch Sentry service.
 */
function HomePage() {
    return (
        <div className="bg-gray-900 text-white">
            {/* --- Hero Section --- */}
            <section className="text-center py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                        Stop Checking Etherscan.
                        <br />
                        Start Getting Alerts.
                    </h1>
                    <p className="mt-6 text-xl text-gray-300">
                        The Sentry is your automated 'check engine light' for the blockchain. Create custom, real-time alerts for any smart contract, transaction, or wallet.
                    </p>
                    {/* This link will go to your main application/dashboard */}
                    <Link to="/dashboard">
                        <button className="mt-8 px-8 py-3 font-semibold text-lg bg-blue-600 hover:bg-blue-700 rounded-lg transition-transform transform hover:scale-105">
                            Monitor Your First Contract for Free
                        </button>
                    </Link>
                </div>
            </section>

            {/* --- Pain Section --- */}
            <section className="py-20 px-4 bg-gray-800">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold">You're Flying Blind.</h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-12">
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold">Is Your Farm Safe?</h3>
                            <p className="mt-4 text-gray-400">Worried about a rug pull? Get a RED ALERT if the contract owner changes or a massive withdrawal occurs.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold">Did the Whale Just Dump?</h3>
                            <p className="mt-4 text-gray-400">Stop missing market movements. Get a notification the second a major wallet you're tracking sells its tokens.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold">Did Your NFT Just Sell?</h3>
                            <p className="mt-4 text-gray-400">Stop refreshing OpenSea. Get an instant alert the moment a `Transfer` event happens on your NFT's contract.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- How It Works Section --- */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold">Your Sentry on the Wall in 60 Seconds.</h2>
                    <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-12">
                        <div className="text-center">
                            <div className="text-4xl mb-4">1.</div>
                            <h3 className="text-2xl font-semibold">Connect Wallet</h3>
                            <p className="text-gray-400">No sign-up needed. Just connect your wallet to begin.</p>
                        </div>
                        <div className="text-2xl text-gray-600 hidden md:block">→</div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">2.</div>
                            <h3 className="text-2xl font-semibold">Set Your Sentry</h3>
                            <p className="text-gray-400">Paste a contract address and pick an event from a simple list.</p>
                        </div>
                         <div className="text-2xl text-gray-600 hidden md:block">→</div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">3.</div>
                            <h3 className="text-2xl font-semibold">Get Notified</h3>
                            <p className="text-gray-400">Receive instant, actionable intelligence via Telegram or Email.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* --- Pricing Section --- */}
            <section className="py-20 px-4 bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold">Simple, Powerful Pricing</h2>
                    <p className="mt-4 text-lg text-gray-300">Start for free, upgrade when you're ready.</p>
                    {/* Here you would build out your pricing table component */}
                    <div className="mt-8 border border-gray-700 p-8 rounded-lg">
                        <h3 className="text-2xl font-semibold">Free Tier</h3>
                        <p className="text-5xl font-bold my-4">$0</p>
                        <ul className="text-gray-400 space-y-2">
                            <li>Monitor 1 Contract</li>
                            <li>Up to 10 Alerts / month</li>
                            <li>Email Notifications</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Sentry</h1>
      <p>Your on-chain anxiety killer.</p>
      <Link to="/login"><button>Login / Sign Up</button></Link>
    </div>
  );
}
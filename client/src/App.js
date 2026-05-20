import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 KRONOS Super App</h1>
        <p>Red Social + E-commerce + Delivery integrados</p>
        <p className="glassmorphism-text">
          Plataforma con diseño glassmorphism ultra-moderno
        </p>
      </header>
      
      {/* Vercel Speed Insights Component */}
      <SpeedInsights />
    </div>
  );
}

export default App;

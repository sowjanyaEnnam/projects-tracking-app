import React from 'react';
import Navbar from './components/Navbar';
import Releases from './components/Releases';
import './App.css';

function App() {
  return (
    <div className="App" style={{
      overflowX: 'auto',
    }}>
      <div
        style={{
          height: '10vh',
        }}>
        <Navbar />
      </div>
      <div
        style={{
          height: '90vh',
          padding: '2rem',
          overflowY: 'scroll',
        }}>
        <Releases />
      </div>
    </div>
  );
}

export default App;

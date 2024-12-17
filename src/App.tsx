import React from 'react';
import PingPongGame from './components/PingPongGame';
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">NFT Ping Pong Game</h1>
        </header>
        <main className="container mx-auto p-4">
          <PingPongGame />
        </main>
      </div>
    </Web3Provider>
  );
}

export default App;import React from 'react';
import PingPongGame from './components/PingPongGame';
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">NFT Ping Pong Game</h1>
        </header>
        <main className="container mx-auto p-4">
          <PingPongGame />
        </main>
      </div>
    </Web3Provider>
  );
}

export default App;

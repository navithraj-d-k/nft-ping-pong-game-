import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import PingPongNFTABI from './PingPongNFT.json';

const PingPongGame: React.FC = () => {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [account, setAccount] = useState<string>('');
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [playerStats, setPlayerStats] = useState({
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        score: 0
    });

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccount(accounts[0]);
                    setWeb3(web3Instance);

                    const networkId = await web3Instance.eth.net.getId();
                    const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
                    const pingPongContract = new web3Instance.eth.Contract(
                        PingPongNFTABI, 
                        contractAddress
                    );
                    setContract(pingPongContract);
                } catch (error) {
                    console.error("Could not connect wallet", error);
                }
            }
        };

        initWeb3();
    }, []);

    const startGame = () => {
        setPlayer1Score(0);
        setPlayer2Score(0);
        setGameActive(true);
    };

    const handlePaddle1Hit = () => {
        setPlayer1Score(prev => prev + 1);
        if (player1Score >= 10) {
            endGame(true);
        }
    };

    const handlePaddle2Hit = () => {
        setPlayer2Score(prev => prev + 1);
        if (player2Score >= 10) {
            endGame(false);
        }
    };

    const endGame = async (player1Wins: boolean) => {
        setGameActive(false);
        
        if (contract && account) {
            try {
                await contract.methods.updatePlayerStats(account, player1Wins).send({ from: account });
                
                // Fetch updated player stats
                const stats = await contract.methods.getPlayerStats(account).call();
                setPlayerStats(stats);
            } catch (error) {
                console.error("Error updating game stats", error);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">NFT Ping Pong</h1>
            
            <div className="flex justify-between mb-4">
                <div>Player 1 Score: {player1Score}</div>
                <div>Player 2 Score: {player2Score}</div>
            </div>

            {!gameActive ? (
                <button 
                    onClick={startGame} 
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Start Game
                </button>
            ) : (
                <div className="game-controls">
                    <button 
                        onClick={handlePaddle1Hit} 
                        className="bg-green-500 text-white p-2 rounded mr-2"
                    >
                        Player 1 Hit
                    </button>
                    <button 
                        onClick={handlePaddle2Hit} 
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        Player 2 Hit
                    </button>
                </div>
            )}

            <div className="player-stats mt-4">
                <h2>Your Stats</h2>
                <p>Games Played: {playerStats.gamesPlayed}</p>
                <p>Wins: {playerStats.wins}</p>
                <p>Losses: {playerStats.losses}</p>
                <p>Total Score: {playerStats.score}</p>
            </div>
        </div>
    );
};

export default PingPongGame;

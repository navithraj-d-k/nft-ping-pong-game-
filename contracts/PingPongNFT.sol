// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PingPongNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 private _tokenIds;
    uint256 public mintPrice = 0.01 ether;

    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 wins;
        uint256 losses;
        uint256 score;
    }

    mapping(address => PlayerStats) public playerStats;
    mapping(uint256 => string) public tokenURIs;

    constructor() ERC721("PingPongChamp", "PONG") {}

    function mintPlayerNFT(string memory _tokenURI) public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIds < MAX_SUPPLY, "All NFTs minted");

        _tokenIds++;
        _safeMint(msg.sender, _tokenIds);
        tokenURIs[_tokenIds] = _tokenURI;
    }

    function updatePlayerStats(address player, bool isWin) public onlyOwner {
        PlayerStats storage stats = playerStats[player];
        stats.gamesPlayed++;
        
        if (isWin) {
            stats.wins++;
            stats.score += 10;
        } else {
            stats.losses++;
            stats.score = stats.score > 5 ? stats.score - 5 : 0;
        }
    }

    function getPlayerStats(address player) public view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

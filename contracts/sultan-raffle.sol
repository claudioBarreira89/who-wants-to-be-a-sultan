// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SultanRaffle {
    address public owner;
    IERC20 public token;

    address public charityAddress;
    address public adminAddress;

    bool public poolInitialized = false;
    uint256 public betAmount = 1;
    address[] public players;

    constructor(
        address _tokenAddress,
        address _charityAddress,
        address _adminAddress
    ) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
        charityAddress = _charityAddress;
        adminAddress = _adminAddress;
        betAmount = 1 * (10 ** 18);

        poolInitialized = true;
    }

    modifier isPoolOpen() {
        require(poolInitialized, "The pool is not open.");
        _;
    }

    function initializePool() public {
        require(!poolInitialized, "Pool is already open.");
        poolInitialized = true;
    }

    function betOnPool() public payable isPoolOpen {
        require(
            token.transferFrom(msg.sender, address(this), betAmount),
            "Failed to transfer tokens"
        );

        players.push(msg.sender);
    }

    function getRandomWinner() private view returns (address) {
        require(players.length > 0, "No players in the pool.");

        // TODO: Randomize this with VRF
        uint256 random = uint256(1);

        return players[random % players.length];
    }

    function checkForRandomWinner() public isPoolOpen {
        address winner = getRandomWinner();
        uint256 poolBalance = token.balanceOf(address(this));
        uint256 winnerShare = (poolBalance * 95) / 100;
        uint256 charityShare = (poolBalance * 4) / 100;
        uint256 adminShare = poolBalance - winnerShare - charityShare;

        require(
            token.transfer(winner, winnerShare),
            "Failed to send tokens to winner"
        );
        require(
            token.transfer(charityAddress, charityShare),
            "Failed to send tokens to charity"
        );
        require(
            token.transfer(adminAddress, adminShare),
            "Failed to send tokens to admin"
        );

        poolInitialized = false;
    }

    function resetPool() public {
        require(!poolInitialized, "Pool must be closed to reset.");
        delete players;
    }

    receive() external payable {
        betOnPool();
    }
}

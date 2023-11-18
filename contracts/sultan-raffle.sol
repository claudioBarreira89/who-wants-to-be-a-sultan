// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract SultanRaffle is VRFConsumerBaseV2, ConfirmedOwner {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }

    IERC20 public token;

    bool public poolInitialized;
    uint256 public poolCap;
    uint256 public betAmount;
    address[] public players;

    address[] public charities = [
        0x06d67c0F18a4B2055dF3C22201f351B131843970,
        0x06d67c0F18a4B2055dF3C22201f351B131843970
    ];
    address public admin = 0x06d67c0F18a4B2055dF3C22201f351B131843970;

    mapping(uint256 => RequestStatus) public s_requests;
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;

    bytes32 keyHash =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    uint256[] public requestIds;
    uint256 public lastRequestId;

    constructor(
        address _tokenAddress,
        uint64 _subscriptionId
    )
        VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
        );
        s_subscriptionId = _subscriptionId;

        token = IERC20(_tokenAddress);

        betAmount = 0.1 * (10 ** 18);
        poolCap = 1 * (10 ** 18);
        poolInitialized = false;
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

    function checkIfPoolIsFull() public isPoolOpen {
        uint256 poolBalance = token.balanceOf(address(this));

        if (poolBalance >= poolCap) {
            requestRandomWords();
            resetPool();
        }
    }

    function closePool() public isPoolOpen {
        requestRandomWords();
        resetPool();
    }

    function transferFundsToWinner(address winner) private {
        uint256 poolBalance = token.balanceOf(address(this));
        uint256 winnerShare = (poolBalance * 95) / 100;
        uint256 charityShare = (poolBalance * 4) / 100;
        uint256 adminShare = poolBalance - winnerShare - charityShare;

        require(
            token.transfer(winner, winnerShare),
            "Failed to send tokens to winner"
        );
        require(
            token.transfer(charities[0], charityShare),
            "Failed to send tokens to charity"
        );
        require(
            token.transfer(admin, adminShare),
            "Failed to send tokens to admin"
        );
    }

    function resetPool() public {
        poolInitialized = false;
        delete players;
    }

    function requestRandomWords()
        private
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        uint256 winnerIndex = _randomWords[0] % players.length;
        address winner = players[winnerIndex];

        transferFundsToWinner(winner);

        emit RequestFulfilled(_requestId, _randomWords);
    }

    receive() external payable {
        betOnPool();
    }
}

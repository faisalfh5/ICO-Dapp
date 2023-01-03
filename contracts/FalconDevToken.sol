//SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <=0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IFalconDev.sol";

contract FalconDevToken is ERC20, Ownable {
    //price of the token
    uint public constant tokenprice = 0.001 ether;
    // Each NFT would give the user 10 tokens
    // It needs to be represented as 10 * (10 ** 18) as ERC20 tokens are represented by the smallest denomination possible for the token
    // By default, ERC20 tokens have the smallest denomination of 10^(-18). This means, having a balance of (1)
    // is actually equal to (10 ^ -18) tokens.
    // Owning 1 full token is equivalent to owning (10^18) tokens when you account for the decimal places.
    uint public constant tokensPerNFT = 10 * (10 * 18);
    // the max total supply is 10000 for Crypto Dev Tokens
    uint public constant maxTotalSupply = 10000 * 10 * (10 * 18);
    //Create FalconDevToken instance
    IFalconDevs Falcon_DevToken;
    // Mapping to keep track of which tokenIds have been claimed
    mapping(uint => bool) public tokenIdsClaimed;

    constructor(address _falconDevsContract) ERC20("Falcon Dev Token", " FD") {
        Falcon_DevToken = IFalconDevs(_falconDevsContract);
    }

    /**
     * @dev Mints `amount` number of CryptoDevTokens
     * Requirements:
     * - `msg.value` should be equal or greater than the tokenPrice * amount
     */
    function mint(uint _value) public payable {
        uint required_amount = tokenprice * _value;
        require(msg.value >= required_amount, "Ether sent is not correct");
        // total tokens + amount <= 10000, otherwise revert the transaction
        uint256 amountWithDecimals = _value * 10 ** 18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        // call the internal function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amountWithDecimals);
    }

    /**
     * @dev Mints tokens based on the number of NFT's held by the sender
     * Requirements:
     * balance of Crypto Dev NFT's owned by the sender should be greater than 0
     * Tokens should have not been claimed for all the NFTs owned by the sender
     */
    function claim() public {
        address sender = msg.sender;
        // Get the number of CryptoDev NFT's held by a given sender address
        uint256 balance = Falcon_DevToken.Balanceof(sender);
        // If the balance is zero, revert the transaction
        require(balance > 0, "You don't own any Crypto Dev NFT");
        // amount keeps track of number of unclaimed tokenIds
        uint256 amount = 0;
        // loop over the balance and get the token ID owned by `sender` at a given `index` of its token list.
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = Falcon_DevToken.Token_of_Owner_Byindex(sender, i);
            // if the tokenId has not been claimed, increase the amount
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }
        // If all the token Ids have been claimed, revert the transaction;
        require(amount > 0, "You have already claimed all the tokens");
        // call the internal function from Openzeppelin's ERC20 contract
        // Mint (amount * 10) tokens for each NFT
        _mint(msg.sender, amount * tokensPerNFT);
    }

    /**
     * @dev withdraws all ETH sent to this contract
     * Requirements:
     * wallet connected must be owner's address
     */
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");

        address _owner = owner();
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}

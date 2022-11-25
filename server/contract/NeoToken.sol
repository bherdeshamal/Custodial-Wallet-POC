// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NeoToken is ERC20{
  address public owner;
  
  //event to check approval of tokens.
  event Approval(address inboxOwner , uint256 amount);

  // @notice holds the Name of token and symbol.
 constructor() ERC20("NeoTokens", "NEO")  {
    owner = msg.sender;
  } 

  // @notice holds amount to be minted 
  function createTokens (uint _amount) public {
    _mint(owner, _amount);
  }

  /** @param _amount holds amount to be burn 
      @param _spender holds address of Inbox contract or UserAccount
    */
  function approveTokens (address _spender , uint _amount) public {
    approve(_spender , _amount);
    emit Approval(_spender , _amount);
  } 
   
}


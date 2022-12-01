// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
import "./NeoToken.sol";

contract Inbox is NeoToken
{        
  /**
    * @notice NeoToken instance neoToken
    * @notice Total Neo Tokens Amount
    * @notice First Record id 
    */ 
  NeoToken public neoToken;                  
  uint256 public totalNeoTokens;        
  string public message;    
 
  // Event for selling task , Buying Task and Burning Task
  event SetMessage(string newMessage, string userId);  
  event AddUser(string userId, string email, address userAddress);
  event BuyToken(address owner , uint256 totalNeoToken, uint balanceOfneoToken, string userId, address userAddress, string email);
  event SellToken(uint256 totalNeoToken, uint balanceOfOwner, string userId, address userAddress, string email);
  
  // @notice holds the address of neoTokens contract
  constructor(address _neoToken){
    owner = msg.sender;
    neoToken = NeoToken(_neoToken);
  }
    
  // modifier to check if caller is owner
  modifier onlyOwner() {
    require(msg.sender == owner , "Sender should be the owner of our contract");
    _;
  }
   
  /**
    * @dev User Details Structure
    * @notice User Id
    * @notice User Email Address
    * @notice User Password
    */
  struct UserDetails{                          
    string userId;                           
    string email;
    address userAddress;
    string message;                    
  }

  /**
    * @dev Message History details
    * @notice Message's Record id 
    * @notice User Address
    */
  struct MessageHistory{                      
    uint256 id;                               
    address userAddress;                      
    uint256 amount;         
  }

  // Mapping of Bullion History with record id
  mapping(uint => MessageHistory) public messageRecords;

  // Mapping of User Details with User Id
  mapping(string => UserDetails) public userRecords;
  
  /**
    * @dev Add User Details
    * @param _userId user Id 
    * @param _email user email
    * @param _userAddress user address
    */
  function addUser(string memory _userId, string memory _email, address _userAddress, string memory _message) public onlyOwner{
    
    UserDetails storage _userDetails = userRecords[_userId];
    
    require(keccak256(abi.encodePacked((_userDetails.userId))) != keccak256(abi.encodePacked((_userId))) , "User Id already exists" );
     
    userRecords[_userId] = UserDetails(_userId, _email, _userAddress, _message);
    
    emit AddUser(_userId, _email, _userAddress);
  }

  /**
    * @dev Get User Balance 
    * @param _userId user ID 
    */
  function getUserBalance(string memory _userId) public view returns(uint256){
    
    UserDetails storage _userDetails = userRecords[_userId];
   
    require(keccak256(abi.encodePacked((_userDetails.userId))) == keccak256(abi.encodePacked((_userId))) , "User Id does not exist" );

    return neoToken.balanceOf(_userDetails.userAddress);
  }

  function getUserRecords(string memory _id) public view returns(UserDetails memory) {
    
    UserDetails storage _userDetails = userRecords[_id];
    
    require(keccak256(abi.encodePacked((_userDetails.userId))) == keccak256(abi.encodePacked((_id))) , " User Id does not exists" );
   
    return userRecords[_id];
  }

  /**
    * @dev Transfer neoTokens on Buy from Admin to User Account
    * @param _amount neo amount
    * @param _userId User Id
    */
  function transferTokenOnBuy( uint256 _amount, string memory _userId ) public onlyOwner {
    uint256 balanceOfNeoToken = _amount;
    uint256 totalNeoToken = neoToken.balanceOf(owner);
   
    require(balanceOfNeoToken <= totalNeoToken , "Insufficient Balance");

    UserDetails storage _userDetails = userRecords[_userId]; 

    require(keccak256(abi.encodePacked((_userDetails.userId))) == keccak256(abi.encodePacked((_userId))) , "User Id does not exist" );
   
    uint256 allowance = neoToken.allowance(owner , address(this));
    require(allowance >= balanceOfNeoToken, "Check the token allowance");

    neoToken.transferFrom(owner , _userDetails.userAddress , balanceOfNeoToken);

    emit BuyToken(owner,totalNeoToken, balanceOfNeoToken, _userId, _userDetails.userAddress , _userDetails.email);
  }
    
  /**
    * @dev Transfer neoTokens on sell from User Account to Admin
    * @param _amount is  Amount 
    * @param _userId is the User Id
    */
  function transferTokenOnSell( uint256 _amount , address _user , string memory _userId ) public  {
    UserDetails storage _userDetails = userRecords[_userId]; 
  
    require(keccak256(abi.encodePacked((_userDetails.userId))) == keccak256(abi.encodePacked((_userId))) , "User Id does not exist" );
       
    uint256 balanceOfNeoToken = _amount;
    uint256 totalNeoToken = neoToken.balanceOf(_userDetails.userAddress);
   
    require(balanceOfNeoToken <= totalNeoToken , "Insufficient Balance");
   
    uint256 allowance = neoToken.allowance(_userDetails.userAddress , address(this));
    require(allowance >= balanceOfNeoToken, "Check the token allowance");

    neoToken.transferFrom(_userDetails.userAddress , _user , balanceOfNeoToken);
      
    emit SellToken( totalNeoToken, balanceOfNeoToken, _userId, _userDetails.userAddress, _userDetails.email);
  }
  
  function setMessage(string memory newMessage, string memory _userId) public {
   
    UserDetails storage _userDetails = userRecords[_userId]; 
   
    require(keccak256(abi.encodePacked((_userDetails.userId))) == keccak256(abi.encodePacked((_userId))) , "User Id does not exist" );
   
    _userDetails.message = newMessage;
        
    emit SetMessage(_userDetails.message , _userId);
  }

  function getMessage(string memory _userId) public view returns (string memory)   {
    
    UserDetails storage _userDetails = userRecords[_userId]; 
    
    require(keccak256(abi.encodePacked((_userDetails.userId))) == keccak256(abi.encodePacked((_userId))) , "User Id does not exist" );
  
    return  _userDetails.message;
  }

}

require("dotenv").config();
const User = require("../model/authModel");
const jwt = require("jsonwebtoken");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const artifactsInbox = require("../ABI/Inbox.json");
const artifactsNeo = require("../ABI/NeoToken.json");
const { response } = require("express");
const owner = process.env.Owner;
const Mnemonic = process.env.Mnemonic;
const Polygon_API_URL = process.env.Polygon_Http_APIURL;
const InboxContractAddress = process.env.Inbox_Contract_Address;
const NeoContractAddress = process.env.NeoToken_Contract_Address;

if (typeof web3 !== "undefined") {
  var web3 = new Web3(web3.currentProvider);
} else {
  const provider = new HDWalletProvider(Mnemonic, Polygon_API_URL);
  var web3 = new Web3(provider);
}

const inboxABI = artifactsInbox.abi;
const contract = new web3.eth.Contract(inboxABI, InboxContractAddress);

const neoABI = artifactsNeo.abi;
const neoContract = new web3.eth.Contract(neoABI, NeoContractAddress);

web3.eth.handleRevert = true;

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "Shree ram super secret key", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const createWallet = async () => {
  let ethData = {};

  const payload = {
    address: String,
    privateKey: String,
  };

  try {
    ethData = await web3.eth.accounts.wallet.create(1);
    // console.log(ethData);
    for (var i = 0; i < ethData.length; i++) {
      payload.address = ethData[i].address;
      payload.privateKey = ethData[i].privateKey;
    }
  } catch (err) {
    console.log(err.message);
  }

  return payload;
};

module.exports.register = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const getAddress = await createWallet();
    const userAddress = getAddress.address;
    const privateKey = getAddress.privateKey;
    const message = "Custodial Wallet";

    const user = await User.create({
      email,
      password,
      userAddress,
      privateKey,
    });
    const token = createToken(user._id);

    const userId = user._id.toString();

    const result = await contract.methods
      .addUser(userId, email, userAddress, message)
      .send({ from: owner, gas: 3000000 })
      .then(() => {
        console.log("user store in blockchain");
      });

    await web3.eth.sendTransaction({
      from: owner,
      to: userAddress,
      value: web3.utils.toWei("1"),
    });

    response.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    response.status(200).json({ user: user._id, status: true });
    response.json("User Added Successfully");
  } catch (err) {
    const errors = handleErrors(err);
    response.json(errors.email);
    response.status(500).send(err.reason);
  }
};

module.exports.login = async (req, response) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    response.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    response.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    response.json({ errors });
  }
};

module.exports.logout = async (req, res) => {
  // Set token to none and expire after 5 seconds
  // res.cookie(
  //   "jwt",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODYxYzcwNDBmMDM5NzhlMjU4YzRmMSIsImlhdCI6MTY2OTczMzQ4OCwiZXhwIjoxNjY5OTkyNjg4fQ.eCZKI56SIQcWFJcY3sCwwfn61RbuGJrr_DRZzvWA5CI; Path=/; Expires=Fri, 02 Dec 2022 14:51:28 GMT",
  //   {
  //     expires: new Date(Date.now() + 1 * 10),
  //     httpOnly: true,
  //   }
  // );
  res.clearCookie("jwt", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

module.exports.getItems = async (req, res) => {
  const x = await User.findById({ _id: req.query.id });

  res.json(x);
};

module.exports.setMessage = async (request, response) => {
  const newMessage = request.body.newMessage;
  const userId = request.body.userId;

  const x = await User.findById(userId);

  const address = x.userAddress;
  const privateKey = x.privateKey;

  await web3.eth.accounts.wallet.add(privateKey);

  try {
    await contract.methods
      .setMessage(newMessage, userId)
      .send({ from: address, gas: 3000000 });

    response.json("User set message successfully");
  } catch (error) {
    response.status(500).send(error.message);
  }
};

module.exports.getMessage = async (request, response) => {
  const userId = request.body.userId;

  const x = await User.findById(userId);

  const address = x.userAddress;
  const privateKey = x.privateKey;

  await web3.eth.accounts.wallet.add(privateKey);

  try {
    const result = await contract.methods
      .getMessage(userId)
      .call({ from: address });

    response.json(result);
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

module.exports.getUserBalance = async (request, response) => {
  const userId = request.body.userId;

  try {
    const result = await contract.methods
      .getUserBalance(userId)
      .call({ from: owner });

    response.json(Web3.utils.fromWei(result.toString()));
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

module.exports.getUserDetails = async (request, response) => {
  const userId = request.body.userId;
  console.log(request.body);

  try {
    console.log("a");
    const result = await contract.methods
      .getUserRecords(userId)
      .call({ from: owner });

    response.json(result);
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

module.exports.ApproveOwner = async (request, response) => {
  const amount = request.body.amount;

  try {
    await neoContract.methods
      .approveTokens(InboxContractAddress, Web3.utils.toWei(amount.toString()))
      .send({ from: owner, gas: 3000000 });

    response.json("Tokens Approve Successfully");
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

module.exports.CreateToken = async (request, response) => {
  const amount = request.body.amount;

  try {
    await neoContract.methods
      .createTokens(Web3.utils.toWei(amount.toString()))
      .send({ from: owner, gas: 3000000 });

    response.json("Tokens Created successfully");
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

module.exports.transferTokenOnBuy = async (request, response) => {
  const userId = request.body.userId;
  const amount = request.body.amount;

  try {
    await contract.methods
      .transferTokenOnBuy(Web3.utils.toWei(amount.toString()), userId)
      .send({ from: owner, gas: 3000000 });

    response.json("Tokens Transfer from Admin to User");
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

module.exports.ApproveUser = async (request, response) => {
  const userId = request.body.userId;
  const amount = request.body.amount;

  const x = await User.findById(userId);

  const address = x.userAddress;
  const privateKey = x.privateKey;

  await web3.eth.accounts.wallet.add(privateKey);

  try {
    await neoContract.methods
      .approveTokens(InboxContractAddress, Web3.utils.toWei(amount.toString()))
      .send({ from: address, gas: 3000000 });

    response.json("User Tokens Approve Successfully");
  } catch (error) {
    response.status(500).send(error.message);
  }
};

module.exports.transferTokenOnSell = async (request, response) => {
  const userId = request.body.userId;
  const amount = request.body.amount;
  const user = request.body.user;

  try {
    await contract.methods
      .transferTokenOnSell(Web3.utils.toWei(amount.toString()), user, userId)
      .send({ from: owner, gas: 3000000 });

    response.json("Token transfer from user to admin successfully");
  } catch (error) {
    response.status(500).send(error.reason);
  }
};

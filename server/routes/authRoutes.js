const { register, login, getItems, getMessage, setMessage ,getUserDetails, getUserBalance, ApproveOwner, transferTokenOnBuy, ApproveUser, transferTokenOnSell, CreateToken} = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", checkUser); 
router.post("/register", register);
router.post("/login", login);
router.get("/getItems" , getItems);
router.post("/setMessage", setMessage);
router.post("/getMessage", getMessage);
router.post("/getUserBalance" , getUserBalance);
router.post("/getUserDetails" , getUserDetails);
router.post("/ApproveOwner" , ApproveOwner);
router.post("/transferTokenOnBuy" , transferTokenOnBuy);
router.post("/ApproveUser" , ApproveUser);
router.post("/transferTokenOnSell" , transferTokenOnSell);
router.post("/CreateToken" , CreateToken);

module.exports = router;

const { ethers } = require("hardhat");
require("dotenv").config();
// const { Contract_address } = require("../constant");

const Contractdeploy = async () => {
  const Pre_NFT_Contract = process.env.Contract_address;
  const Falcon_Dev_Token = await ethers.getContractFactory("FalconDevToken");
  const Contract_address = await Falcon_Dev_Token.deploy(Pre_NFT_Contract);
  await Contract_address.deployed();
  console.log("Contract Address is : ", Contract_address.address);
};
Contractdeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
  });

import hre from "hardhat";
import chalk from "chalk";

const { ethers } = hre;
const { utils } = ethers;

const msg = 'MUSE';
const message = `\x19Ethereum Signed Message:\n${msg.length}${msg}`

async function main() {
  const signers = await ethers.getSigners();
  const user = await signers[0].getAddress();
  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user} <<<<<<<<<<<<`));

  console.log('\nOriginal Message:', message);
  const bytes32Message = utils.formatBytes32String(message);
  console.log('\nbytes32Message Message:', bytes32Message);
  const keccak256Message = utils.keccak256(utils.toUtf8Bytes(message));
  console.log('\nkeccak256 Message:', keccak256Message);

  const signedMessage = await signers[0].signMessage(msg);
  console.log('\nSigned Message:', signedMessage);

  const signedBy = utils.verifyMessage(msg, signedMessage);
  console.log('\nSigned By:', signedBy);

  const splitSignature = utils.splitSignature(signedMessage);
  console.log('\nSplit Signature:\n', splitSignature);

  const EthSign = await ethers.getContractFactory("EthSign");
  const ethSign = await EthSign.deploy();
  await ethSign.deployed();
  console.log("\nEthSign deployed to:", ethSign.address);

  const encodeRes = await ethSign.encode(user, bytes32Message, keccak256Message, splitSignature.r, splitSignature.s, splitSignature.v);
  console.log('\nEthSign.encode():', encodeRes);

  const decodeRes = await ethSign.decode(encodeRes);
  console.log('\nEthSign.decode():', decodeRes);

  const verifyRes = await ethSign.verify(user, keccak256Message, splitSignature.r, splitSignature.s, splitSignature.v);
  console.log('\nEthSign.verify():', verifyRes);

  const testRes = await ethSign.test(encodeRes);
  console.log('\nEthSign.test():', testRes);

  console.log(chalk.magenta("\n\n---------------------------\n\n"));
  console.log(chalk.grey("Message which was signed:"));
  console.log(chalk.yellow(msg));
  console.log(chalk.grey("\n\nInput to be used as message parameter:"));
  console.log(chalk.yellow(encodeRes));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

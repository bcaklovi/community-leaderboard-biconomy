import Web3 from "web3";
import { toBuffer } from "ethereumjs-util";
import { Web3Context } from "./Web3Context";

export const constructMetaTransactionMessage = (
  nonce,
  chainId,
  functionSignature,
  contractAddress
) => {
  let abi = require("ethereumjs-abi");

  return abi.soliditySHA3(
    ["uint256", "address", "uint256", "bytes"],
    [nonce, contractAddress, chainId, toBuffer(functionSignature)]
  );
}

export const getSignatureParameters = (web3, signature) => {
  if (!web3.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  var r = signature.slice(0, 66);
  var s = "0x".concat(signature.slice(66, 130));
  var v = "0x".concat(signature.slice(130, 132));
  v = web3.utils.hexToNumber(v);
  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
};
import axios from "axios";
import { ContractInterface, ethers } from "ethers";
import abi from "./abi.json";

export const setMint = async (
  address: string,
  provider: any,
  _tokenURI: any
) => {
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner(address);
  const contract = new ethers.Contract(
    "0xE7D234213eA5fee48FAaC52Ac69b1ee34a6A4b92",
    abi as ContractInterface,
    signer
  );

  const mintTx = await contract.mintNft(_tokenURI, address);
  await mintTx.wait();
};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const getMint = async (address: string, provider: any) => {
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner(address);
  const contract = new ethers.Contract(
    "0xE7D234213eA5fee48FAaC52Ac69b1ee34a6A4b92",
    abi as ContractInterface,
    signer
  );

  const totalId = Number((await contract.tokenId()).toString());

  const result = await Promise.all(
    Array.from({ length: totalId }).map(async (_, i) => {
      const d = await contract.tokenURI(i);
      const { data } = await axios({
        method: "get",
        url: `https://ipfs.io/ipfs/${d}`,
      });
      return data;
    })
  );

  console.log(result);
  return result;
};

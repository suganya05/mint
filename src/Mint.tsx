import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
} from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { getMint, setMint } from "./utils/methods";
import { Injected } from "./utils/connectors";
const Mint: React.FC = () => {
  const [formName, setFormName] = useState({
    name: "",
    descrip: "",
    image: "",
  });
  const [fileImg, setFileImg] = useState<File | null>(null);
  const [mintData, setMintData] = useState<any[]>([]);
  const { account, activate, library } = useWeb3React();
  console.log(account);

  const handleGetData = useCallback(async () => {
    if (!account) return;
    const data = await getMint(account, library?.provider);
    setMintData(data);
  }, [account, library]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const sendFileToIPFS = async (e: FormEvent) => {
    e.preventDefault();
    if (!account) return;
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);

        const newData = { ...formName, image: ImgHash };
        const resData = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: newData,
          headers: {
            pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "application/json",
          },
        });
        const JsonHash = resData.data.IpfsHash;
        const dataHash = `https://gateway.pinata.cloud/ipfs/${JsonHash}`;
        console.log(dataHash);
        await setMint(account, library?.provider, JsonHash);
        handleGetData();
      } catch (error) {
        console.log("Error sending File to IPFS:");
        console.log(error);
      }
    }
  };

  return (
    <>
      {account ? (
        <form onSubmit={sendFileToIPFS}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={formName.name}
            onChange={(e) =>
              setFormName((f) => ({ ...f, name: e.target.value }))
            }
          />
          <br />
          <br />
          <label htmlFor="des">Description:</label>
          <input
            type="text"
            placeholder="Description"
            value={formName.descrip}
            onChange={(e) =>
              setFormName((f) => ({ ...f, descrip: e.target.value }))
            }
          />
          <br />
          <br />
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!e.target.files || !e.target.files.length) return;
              setFileImg(e.target.files[0]);
            }}
            required
          />
          <button type="submit">Mint NFT</button>
        </form>
      ) : (
        <button onClick={() => activate(Injected)}>Connect Wallet</button>
      )}
      <h1>
        {mintData.map((f) => {
          return (
            <div>
              <h1>{f.name}</h1>
              <p>{f.description}</p>
              <img src={f.image} alt="" />
            </div>
          );
        })}
      </h1>
    </>
  );
};

export default Mint;

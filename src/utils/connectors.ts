import { InjectedConnector } from "@web3-react/injected-connector";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const Injected = new InjectedConnector({ supportedChainIds: [5] });

// export const walletconnect = new WalletConnectConnector({
//   bridge: "https://bridge.walletconnect.org",
//   qrcode: true,
//   infuraId: "ec03b8dcd95348149519e0be7ac5098e",
// });

const switchRequest = () => {
  const { ethereum } = window as any;
  return ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x19" }],
  });
};

export const switchNetwork = async () => {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      await switchRequest();
    } catch (error) {
      console.log(error);
    }
  }
};

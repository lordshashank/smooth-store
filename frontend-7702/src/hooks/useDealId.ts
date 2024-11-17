import { ethers } from "ethers";
import { abi, contractTypeAddress as contractAddresses } from "../../constants";
import CID from "cids";

// Connect to the Ethereum node
// const provider = new ethers.providers.JsonRpcProvider(
//   `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
// );

// Specify the function and its parameters

// Call the view function
export const useDealId = () => {
  const getDealId = async (commp: CID) => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ANKR_URL
    );
    // Replace with your contract ABI and address
    const contractABI = abi.DealClient; // Your contract ABI
    const contractAddress = contractAddresses.DealClient;

    // Create a contract instance
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const functionName = "pieceDeals";
    const functionParams = [commp.bytes];

    try {
      const response = await contract[functionName](...functionParams);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  return { getDealId };
};

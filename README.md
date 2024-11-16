# SmoothStore

SmoothStore is a decentralized application (dApp) designed to seamlessly onboard users to decentralized storage solutions. It allows users to store their files securely across various storage providers in the network while ensuring data privacy and user convenience. The core highlight of SmoothStore is the integration of **EIP-7702**, which revolutionizes user authentication in the Web3 space making your web3 journey smoooooooooth.

## 🚀 Project Overview

SmoothStore provides you an interface to store your data on filecoin through smart contracts, helping you choose SPs, configure SLAs and have easy experience. Storing data on decentralized platforms like Filecoin is inherently public, which poses challenges for users who prioritize privacy. SmoothStore addresses this by implementing **client-side encryption** using the user's wallet, ensuring that sensitive data never leaves the user's system in an unencrypted state.

Additionally, a significant hurdle in Web3 is the complex user flow that involves multiple transaction signatures, wallet management, and the need for users to manually approve each transaction. SmoothStore simplifies this process by leveraging the innovative **EIP-7702**.

## 🔑 What is EIP-7702?

[EIP-7702](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7702.md) introduces a game-changing method for user authentication and transaction signing in the Web3 ecosystem. This Ethereum Improvement Proposal enables the use of biometric data such as **FaceID, fingerprint**, or other device-based biometric authentication as private keys. This means users can authorize and batch multiple transactions using a single authentication step, effectively solving the UX friction that currently prevents broader adoption of Web3 applications.

### Key Advantages of EIP-7702:

- **Seamless User Experience**: Removes the need for repeated transaction approvals, reducing friction for users.
- **Enhanced Security**: Utilizes device-level biometric data, which is highly secure and already familiar to most users.
- **Efficient Onboarding**: Allows users to interact with the dApp in a manner similar to Web2 applications like Google Drive.

## 🌟 Key Features

1. **Client-Side Encryption**: Ensures that files are encrypted locally on the user's device before being uploaded, preserving privacy.
2. **Multi-Provider Storage Support**: SmoothStore connects with multiple decentralized storage providers, offering users flexibility and redundancy.
3. **Biometric Authentication via EIP-7702**: Batch transactions using FaceID or fingerprint, streamlining the user journey.
4. **Google Drive-Like Interface**: Provides a familiar, intuitive UI for Web3 users, simplifying the transition from traditional cloud storage platforms.

## 🛠️ How It Works

1. **User Onboarding**:

   - Connect your Web3 wallet (Metamask, WalletConnect, etc.).
   - Enable EIP-7702 for biometric authentication.

2. **Data Upload**:

   - Select files to store.
   - Files are encrypted on your device using your wallet's private key.
   - Encrypted files are distributed among supported decentralized storage providers.

3. **Transaction Optimization**:
   - SmoothStore leverages EIP-7702 to batch all necessary transactions, so users only authenticate once using their biometrics.
   - The process significantly reduces the need for manual transaction approvals, enhancing usability.

## 📄 Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/SmoothStore.git
   cd SmoothStore
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dApp:
   ```bash
   npm start
   ```

## 💻 Tech Stack

- **Frontend**: React, ethers.js
- **Backend**: Node.js, IPFS/Filecoin integration
- **Smart Contracts**: Solidity, EIP-7702 implementation
- **Wallet Integration**: Metamask, WalletConnect

## 🤝 Contribution

We welcome contributions to SmoothStore! Feel free to open issues or submit pull requests for improvements, bug fixes, or new features.
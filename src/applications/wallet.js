import { Wallet } from 'fabric-network';
import WalletStore from '../services/wallet-store-service.js';

const store = new WalletStore();
const wallet = new Wallet(store);

export default wallet;

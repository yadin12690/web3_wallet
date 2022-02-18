import { PublicKey, Transaction } from "@solana/web3.js";

interface IConnect {
    publicKey: PublicKey | null;
    isConnected: boolean | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage: (
        message: Uint8Array | string,
        display?: string
    ) => Promise<any>;
    // connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    // disconnect: () => Promise<void>;
    // on: (event: PhantomEvent, handler: (args: any) => void) => void;
    // request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export default IConnect;

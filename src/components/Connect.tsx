import { useEffect, useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";

function Connect() {
    const [provider, setProvider] = useState<undefined>(
        undefined
    );
    const [walletKey, setWalletKey] = useState<undefined>(
        undefined
    );

    /**
     * @description gets Phantom provider, if it exists
     */
    const getProvider = (): undefined => {
        if ("solana" in window) {
            // @ts-ignore
            const provider = window.solana as any;
            if (provider.isPhantom) return provider;
        }
    };

    /**
     * @description prompts user to connect wallet if it exists
     */
    const connectWallet = async () => {
        // @ts-ignore
        const { solana } = window;

        if (solana) {
            try {
                const response = await solana.connect();
                console.log("wallet account ", response.publicKey.toString());
                setWalletKey(response.publicKey.toString());
            } catch (err) {
                // { code: 4001, message: 'User rejected the request.' }
            }
        }
    };

    /**
     * @description disconnect Phantom wallet
     */
    const disconnectWallet = async () => {
        // @ts-ignore
        const { solana } = window;

        if (walletKey && solana) {
            await (solana).disconnect();
            setWalletKey(undefined);
        }
    };

    // detect phantom provider exists
    useEffect(() => {
        const provider = getProvider();

        if (provider) setProvider(provider);
        else setProvider(undefined);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h2>Connect to Phantom Wallet</h2>
                {provider && !walletKey && (
                    <button
                        style={{
                            fontSize: "16px",
                            padding: "15px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            background: '#2ecc71',
                            color: '#ffffff',
                        }}
                        onClick={connectWallet}
                    >
                        Connect to Phantom Wallet
                    </button>
                )}

                {provider && walletKey && (
                    <div>
                        <p>Connected account key:{walletKey}</p>

                        <button
                            style={{
                                fontSize: "16px",
                                padding: "15px",
                                fontWeight: "bold",
                                borderRadius: "5px",
                                margin: "15px auto",
                            }}
                            onClick={disconnectWallet}
                        >
                            Disconnect
                        </button>
                    </div>
                )}

                {!provider && (
                    <p>
                        No provider found. Install{" "}
                        <a href="https://phantom.app/">Phantom Browser extension</a>
                    </p>
                )}
            </header>
        </div>
    );
}

export default Connect

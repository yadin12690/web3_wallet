import { useEffect, useState } from "react";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

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
     * @description gets token list for display amount
     */
    const getTokenList = () => {
        new TokenListProvider().resolve().then((tokens) => {
            const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
            const monkeyBallToken = tokenList.find(item => item.symbol === 'MBS');
            console.log(monkeyBallToken);
            return tokenList;
        });
    };

    /**
     * @description prompts user to connect wallet if it exists
     */
    const connectWallet = async () => {
        const { solana } = (window as any);

        if (solana) {
            try {
                const response = await solana.connect();
                console.log("wallet account key", response.publicKey.toString());
                setWalletKey(response.publicKey.toString());
            } catch (err) {
                console.log(err);
            }
        }
    };

    /**
     * @description disconnect from Phantom wallet
     */
    const disconnectWallet = async () => {
        const { solana } = (window as any);

        if (walletKey && solana) {
            await (solana).disconnect();
            setWalletKey(undefined);
        }
    };

    // detect phantom provider exists
    useEffect(() => {
        const provider = getProvider();

        const tokenList = getTokenList();

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

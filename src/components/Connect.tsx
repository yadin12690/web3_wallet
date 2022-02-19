import { useEffect, useState } from "react";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import axios from 'axios';

function Connect() {
    const [provider, setProvider] = useState<undefined>(
        undefined
    );
    const [walletKey, setWalletKey] = useState<undefined>(
        undefined
    );

    const [mbsTokenMint, setMbsTokenAdress] = useState<string | undefined>();
    const [mbsAmount, setMbsAmount] = useState<TokenInfo | undefined>();

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
     * @returns $MBS token mint adress.
     */
    const getTokenList = () => {
        new TokenListProvider().resolve().then((tokens) => {
            const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
            const monkeyBallToken = tokenList.find(item => item.symbol === 'MBS');
            setMbsTokenAdress(monkeyBallToken?.address);
            return monkeyBallToken;
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
                getTokenBalance();
            } catch (err) {
                console.log(err);
            }
        }
    };

    /**
    * @description JSON RPC API call to get amount of $MBS amount 
    * @constant walletKey
    * @constant mbsTokenMint
    */
    const getTokenBalance = async (tokenMintAddress?: string) => {
        try {
            const response = await axios({
                url: `https://api.mainnet-beta.solana.com`,
                method: "post",
                headers: { "Content-Type": "application/json" },
                data: {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getBalance",
                    params: [
                        'H8Zm2RAg4CAfskDitUK2aPCrmFzAWpcaRej6HajXevwU',
                        {
                            commitment: "finalized",
                        },
                    ],
                },
            });
            const amount = response?.data.result.value;
            setMbsAmount(amount);
        } catch (e) {
            console.error(e);
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
        getTokenList();

        if (provider) setProvider(provider);
        else setProvider(undefined);

    }, [walletKey]);

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

                        <p>$MBS Amount:{mbsAmount ? 'No coins' : mbsAmount}</p>
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
                        No extention was found. Install{" "}
                        <a href="https://phantom.app/">Phantom Browser extension</a>
                    </p>
                )}
            </header>
        </div>
    );
}

export default Connect

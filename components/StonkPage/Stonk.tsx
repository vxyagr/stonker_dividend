import type { FunctionComponent } from "react";
// Import components
import ButtonLaunchGradient from "../Buttons/LaunchGradient";
import PrivateSale from "./PrivateSale";
// @ts-ignore
import ReactRoundedImage from "react-rounded-image";
import MyPhoto from "../../public/dragonkin_final.jpg";
import { useMarkets } from "../../utils/snapshot";
import ButtonConnectWalletMobile from "../Buttons/ConnectWalletMobile";
import ButtonConnectWalletDesktop from "../Buttons/ConnectWalletDesktop";
import { DEFAULT_CHAIN, RinkebyProvider, useWalletContext, MainnetProvider, mainnetSigner } from "../Wallet";
import { ethers, providers } from "ethers";
import React, { useState, useEffect } from "react";
import NFTCard from "./NFTCard";
import Link from "next/link";
import Web3 from "web3";
/**
 * HeroProps is a React Component properties that passed to React Component Hero
 */
type HeroProps = { accountConnected: boolean };

/**
 * Hero is just yet another react component
 *
 * @link https://fettblog.eu/typescript-react/components/#functional-components
 *
 */

interface ICard {
    yield: number;
    tokenId: number;
}
const Hero: FunctionComponent<HeroProps> = (props) => {
    const { chain } = useWalletContext();
    const { account } = useWalletContext();
    const { signer } = useWalletContext();
    const showConnectWallet = account ? false : true;
    const showSwitchToDefaultNetwork = !showConnectWallet && chain.unsupported ? true : false;
    const availableSpecies = [0, 0, 0, 0];

    //require("dotenv").config();

    /*const readOwned = async () => {
        //const { web3 } = this.state;
        const contract = web3.eth.Contract(ABI, contractAddress);
        const balance = await contract.methods.balance().call();
        this.setState({ balance: parseInt(balance.toString()) / 10 ** 8 });
    }; */

    //setIsConnected(props.accountConnected);

    // Read data from Snapshot API
    //const marketsResponse = useMarkets(chain.unsupported ? DEFAULT_CHAIN.id : chain.chain.id);
    const items: ICard[] = [];
    const [allCards, setAllCards] = useState();
    // UI states

    //const Web3 = require("web3");
    //if (window.web3) {

    var contractAbi = require("../../abis/StonkerNFTABI.json");
    var dividendContractAbi = require("../../abis/stonkerDividendABI.json");
    //const contractAddres = "0x21Bf9D1BBc6FA5C39378fe3091B05EF51d24BcFF"; //rinkeby

    const contractAddres = "0x6BdD2353D12a78FEa7487829adaB30bf391ae336"; //mainnet
    //const dividendContractAddres = "0x882249918044aF91FDCA1B7DE0FFbde637E5F546"; //mainnet
    const dividendContractAddres = "0x67f31A68a38A5Fcb0367998918dFdA7D9D8fed27"; //polygonmainnet
    //
    // console.log(accountsList[0])

    // const provider = new providers.JsonRpcBatchProvider("https://rinkeby.infura.io/v3/8051d992532d4f65b1cea01cb751d577");

    const alchemyKey = "https://eth-mainnet.g.alchemy.com/v2/qrt8MvfIylAYeVY0yL5lIZkR08rclzIJ";
    const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const web3 = createAlchemyWeb3(alchemyKey);

    const readDividendContract = new web3.eth.Contract(dividendContractAbi, dividendContractAddres);
    const readStonkerNFTContract = new web3.eth.Contract(contractAbi, contractAddres);

    const contract = new ethers.Contract(contractAddres, contractAbi, signer);
    //const readDividendContract = new ethers.Contract(contractAddres, contractAbi);
    const readContract = new ethers.Contract(dividendContractAddres, dividendContractAbi);

    const dividendContract = new ethers.Contract(dividendContractAddres, dividendContractAbi, signer);
    //const [lokaCards, setLokaCards] = useState([]);
    const prices = [10, 120, 10, 10];
    const [dataFetched, setDataFethced] = useState(false);
    const [cardLoaded, setCardLoaded] = useState(false);
    prices[1] = 225;

    const axios = require("axios");
    // const request = require("request");
    const [human, setHuman] = useState(0);
    const [elf, setElf] = useState(0);
    const [vampire, setVampire] = useState(0);
    const [android, setAndroid] = useState(0);
    const [ownerPercent, setOwnerPercent] = useState(0);
    const [claimable, setClaimable] = useState(0);
    const [totalClaimed, setTotalClaimed] = useState(0);
    const [zeroStonker, setZeroStonker] = useState(true);
    const [totalStonkerYield, setTotalStonkerYield] = useState(0);
    const [androidYield, setAndroidYield] = useState(0);
    const [elfYield, setElfYield] = useState(0);
    const [vampireYield, setVampireYield] = useState(0);
    const [humanYield, setHumanYield] = useState(0);
    const [lastDisburse, setLastDisburse] = useState(0);
    const [amnt, setAmnt] = useState(0);
    const [distributable, setDistributable] = useState(0);

    const [testNum, setTestnum] = useState(1);

    const getLastDisbursement = async () => {
        var last = await dividendContract.getLastDisbursementTime();
        setLastDisburse(last);
    };

    const logit = async () => {
        console.log("Dis : " + amnt);
    };

    const distribute = async () => {
        if (account) {
            //var claimable = await readStonkerNFTContract.methods.stonkersOfOwner(account).call();
            var totalStonkers = await readStonkerNFTContract.methods.totalSupply().call();
            //console.log("list : " + claimable);
            var i = 0;
            var totalYield = 0;
            var stonkerIds = [];
            var addr_ = [];
            var divs_ = [];
            //var dividend = await dividendContract.getStonkerUSDCBalance();
            var dividend = amnt;
            for (i = 0; i < totalStonkers; i++) {
                //address stonkerOwner = stonkerNFT.ownerOf(i);

                var stk = await readStonkerNFTContract.methods.stonkers(i).call();
                console.log(stk);
                var owner = await readStonkerNFTContract.methods.ownerOf(i).call();
                var isExcluded = await dividendContract.isAddressExcluded(owner);
                //console.log(isExcluded);
                if (isExcluded) continue;
                if (stk[2] > lastDisburse) continue;
                stonkerIds.push(i);
                addr_.push(owner);
                divs_.push(stk[1]);
                totalYield += parseInt(stk[1]);
                console.log("yield " + stk[1]);
                console.log(totalYield);
            }

            var dividendPerYield = dividend / totalYield;
            console.log("totalYield " + totalYield);
            console.log("dividend per yield " + dividendPerYield);
            //const numbers = [1, 2, 3, 4, 5];
            const divsYield_ = divs_.map((number) => Math.floor(number * dividendPerYield * 0.7));
            console.log(divsYield_);
            var distribute = await dividendContract.distributeDividends(addr_, divsYield_, stonkerIds, dividend);
        }
    };

    const getTotalClaimed = async () => {
        if (account) {
            //var totalClaim = await dividendContract.getTotalClaimedDividends(account);
            var totalClaim = await dividendContract.getTotalClaimedDividends(account);
            setTotalClaimed(totalClaim);
        }
    };

    const getDistributable = async () => {
        if (account) {
            //var totalClaim = await dividendContract.getTotalClaimedDividends(account);
            var totalClaim = await dividendContract.getDistributableDividend();
            setDistributable(totalClaim / 1000000);
        }
    };
    if (distributable == 0) {
        getLastDisbursement();
        getDistributable();
    }

    useEffect(() => {
        //getOwned();
        getLastDisbursement();
        getDistributable();
        console.log("lastDisburse " + lastDisburse);
        console.log("distributable " + distributable);
        //
    }, [account]); // <-- empty dependency array
    if (!showConnectWallet && !showSwitchToDefaultNetwork) {
        //if (true) {
        return (
            <div className="relative h-full w-full justify-center overflow-hidden lg:h-full">
                <div className="relative z-10 m-auto flex w-screen flex-col items-center gap-8 py-[20px] px-4 text-center align-middle lg:py-10">
                    <h2 className="med-hero-text">
                        Stonker <span className="gradient move-gradient bg-[length:250%_250%] bg-clip-text text-transparent transition-none sm:py-20">Admin Page</span>
                    </h2>
                    <div>
                        <div className="px-4 py-6 text-center sm:basis-1/4 sm:pl-8">
                            <p className="mb-6 text-sm leading-6 text-gray-light-10 dark:text-gray-dark-10">
                                <div>We have</div> <span className="items-center justify-center text-4xl text-gray-light-12 dark:text-gray-dark-12">{distributable.toString()} USDC</span> <div>of dividend</div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Type something..."
                                        id="myInput"
                                        onChange={(e) => {
                                            setAmnt(e.currentTarget.value);
                                        }}
                                    ></input>
                                </div>
                                <Link href="#">
                                    <a
                                        onClick={() => {
                                            distribute();
                                            //logit();
                                        }}
                                        className="button gradient inline-block rounded-full bg-[length:300%_300%] bg-center py-3 px-8 font-inter text-sm font-bold leading-none tracking-tight text-gray-50 hover:bg-left  hover:shadow-xl hover:shadow-blue-400/20 active:scale-95 dark:text-gray-900 sm:text-base md:text-base"
                                    >
                                        Distribute
                                    </a>
                                </Link>
                            </p>
                            <p className="text-sm font-bold leading-6 text-gray-light-12 dark:text-gray-dark-12"></p>
                        </div>
                    </div>
                    <div className="w-full px-10">
                        {" "}
                        <hr />
                    </div>
                    {/* <h2 className="med-hero-text">
                        Stonker <span className="gradient move-gradient bg-[length:250%_250%] bg-clip-text text-transparent transition-none sm:py-20">Treasury Farming</span>
                    </h2>
                    <h2 className="small-hero-text">(coming soon)</h2>*/}
                    <div className="md:flex lg:flex ">
                        {/*<NFTCard tokenId={0} yield={20} />
                        <NFTCard tokenId={0} yield={20} />
                        <NFTCard tokenId={0} yield={20} />
                        <NFTCard tokenId={0} yield={20} />
                        <NFTCard tokenId={0} yield={20} />
                        {renderCards()} */}
                    </div>
                </div>
            </div>
        );
    } else if (showSwitchToDefaultNetwork) {
        return (
            <div className="lg:py-30 relative z-10 m-auto flex max-w-screen-md flex-col items-center gap-8 py-[60px] px-4 text-center align-middle">
                <h2 className="med-hero-text">
                    Please Switch Network to <span className="gradient move-gradient bg-[length:250%_250%] bg-clip-text text-transparent transition-none sm:py-20">{DEFAULT_CHAIN.name}</span>
                </h2>
            </div>
        );
    } else {
        return (
            <div className="lg:py-30 relative z-10 m-auto flex max-w-screen-md flex-col items-center gap-8 py-[60px] px-4 text-center align-middle">
                <h2 className="med-hero-text">Please Connect Your Wallet</h2>
            </div>
        );
    }
};

export default Hero;

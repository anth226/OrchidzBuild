import React, { useContext, useEffect, useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Button,
    message,
    Row,
    Col,
    Upload,
    Descriptions,
    Collapse
} from 'antd';
import {
    ConnectWallet
} from '@thirdweb-dev/react';

import { ethers } from 'ethers';
import { Web3ConnectionContext } from 'src/smartContract/Web3ConnectionContext';
import SimpleLoader from '@components/loader/loader';

type NftMetaDataType = {
    name: string;
    price: number;
    admin: string;
    royalyPercent: number;
    image: string;
};

export const MintNftDetails: React.FC<any> = ({
    user
}) => {
    const { address, getNftMetaData, getUserNftBalance, mintNft } = useContext(
        Web3ConnectionContext
    );

    const [loading, setLoading] = useState(false);
    const [minting, setMinting] = useState(false);

    const [userNftBalance, setUserNftBalance] = useState(0);
    const [nftMetaData, setNftMetaData] = useState<NftMetaDataType>({
        name: "",
        price: 0,
        admin: "",
        royalyPercent: 0,
        image: ""
    })

    const loadUserBalance = async () => {
        const nftId = user?.nftId;
        if (!nftId) return;
        const _nftBalance = await getUserNftBalance(Number(nftId));
        setUserNftBalance(Number(_nftBalance));
    };

    const loadingNftDetails = async () => {
        const nftId = user?.nftId;
        if (!nftId) return;
        setLoading(true);
        try {
            const _metadata = await getNftMetaData(Number(nftId));
            await loadUserBalance();
            setNftMetaData(_metadata);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const mintOneNftForUser = async () => {
        const nftId = user?.nftId;
        if (!nftId) return;
        setMinting(true);
        const _minted = await mintNft(nftId, String(nftMetaData.price));
        if (_minted) {
            await loadUserBalance();
        }
        setMinting(false);
    }

    if (!address) {
        return (
            <Row>
                <Col xs={24}>
                    <ConnectWallet />
                </Col>
            </Row>
        );
    } else {
        useEffect(() => {
            loadingNftDetails()
        }, [])
    }
    return (
        <div className="per-infor">
            <Collapse defaultActiveKey={['0']} bordered={false} accordion>
                <Collapse.Panel
                    header={<span className="flex items-center text-lg text-primaryColor">
                        Mint NFT
                    </span>
                    }
                    key="1"
                >
                    <Col xs={24}>

                        <h1 className="text-white">
                            Nft Id: {user.nftId}
                        </h1>
                    </Col>
                    <Col xs={24}>

                        <h1 className="text-white">
                            ** Mint one nft and get access to all content of user
                        </h1>
                    </Col>

                    {loading ?
                        <Col xs={24} className="text-center mt-4">
                            <SimpleLoader className="w-14 h-14 text-primaryColor" />
                        </Col>

                        :
                        <div className="mint-details">
                            {nftMetaData?.name !== "" ?
                                <div>

                                    <Row>
                                        <Col xl={6} md={12} xs={24}>
                                            <h1 className="text-white">
                                                You Have: {userNftBalance} Nfts
                                            </h1>
                                        </Col>
                                        <Col xl={6} md={12} xs={24}>
                                            <h1 className="text-white">
                                                Nft Name: {nftMetaData?.name}
                                            </h1>
                                        </Col>
                                        <Col xl={6} md={12} xs={24}>
                                            <h1 className="text-white">
                                                Nft Price: {nftMetaData?.price} Matic
                                            </h1>
                                        </Col>
                                        <Col xs={24}>
                                            <Button
                                                className="primary"
                                                type="primary"
                                                htmlType="submit"
                                                loading={minting}
                                                disabled={minting}
                                                onClick={mintOneNftForUser}
                                            >
                                                {minting ? 'Minting' : 'Mint Nft'}
                                            </Button>
                                        </Col>

                                    </Row>
                                </div>
                                :
                                <>
                                </>}
                        </div>
                    }

                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default MintNftDetails;

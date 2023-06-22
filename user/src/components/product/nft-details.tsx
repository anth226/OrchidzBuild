import React, { useContext, useEffect, useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Button,
    message,
    Row,
    Col,
    Upload
} from 'antd';
import {
    ConnectWallet
} from '@thirdweb-dev/react';

import { ethers } from 'ethers';
import { Web3ConnectionContext } from 'src/smartContract/Web3ConnectionContext';

type NftMetaDataType = {
    name: string;
    price: number;
    admin: string;
    royalyPercent: number;
    image: string;
};

export const ModelNftDetails: React.FC<any> = ({
    user
}) => {
    const { address, getOrchidzContract, storage } = useContext(
        Web3ConnectionContext
    );

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [nftMetaData, setNftMetaData] = useState<NftMetaDataType>({
        name: "",
        price: 0,
        admin: "",
        royalyPercent: 0,
        image: ""
    })

    const loadingNftDetails = async () => {        
        const nftId = user?.nftId;
        if (!nftId) return;

        try {
            const OrchidzBuildCreatorContract = await getOrchidzContract();
            const tx = await OrchidzBuildCreatorContract.call(
                'nftDetailOf', // Name of your function as it is on the smart contract
                [
                    Number(nftId)
                ]
                );
                // console.log(tx);
                
                const durii = await storage.download(tx.uri);
                
                const metadataReq = await fetch(durii.url);
                const metadata = await metadataReq.json();
                const _imgurl = await storage.download(metadata.image);
                
                setNftMetaData({
                    ...metadata,
                    price: Number(Number(tx.mintPrice) / 10 ** 18),
                    image: _imgurl.url
                });
            } catch (error) {
                console.log(error);
            }
    };

    if (!address) {
        return (
            <Row>
                <Col xs={24}>
                    <ConnectWallet />
                </Col>
            </Row>
        );
    }

    useEffect(() => {
        loadingNftDetails()
    }, [])

    useEffect(() => {
        console.log("nftMetaData", nftMetaData);
    }, [nftMetaData])

    return (

        nftMetaData.name !== "" ?
            <Form
                onFinishFailed={() => message.error('Please complete the required fields')}
                name="form-create-nftid"
                className="w-full"
                initialValues={{
                    name: nftMetaData.name,
                    admin: nftMetaData.admin,
                    price: nftMetaData.price,
                    royalyPercent: nftMetaData.royalyPercent
                }}
                scrollToFirstError
            >
                <Col md={24} xs={24}>

                    <h1 className="text-white">
                        You have Created Nft. Your Nft Id:
                        {user.nftId}
                    </h1>
                </Col>

                <Col md={12} xs={24}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please enter a name for your NFT' }]}
                        label="NFT Name"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="price"
                        rules={[{ required: true, message: 'Please enter a price for your NFT' }]}
                        label="Price Per NFT"
                    >
                        <InputNumber style={{ width: '100%' }} min={0} value={nftMetaData.price} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="royalyPercent"
                        label="Total royalyPercent"
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                    <Form.Item
                        name="admin"
                        rules={[{ required: true, message: 'Please admin' }]}
                        label="admin address"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col md={12} xs={12}>
                    <Form.Item label="Image">
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            className="avatar-uploader"
                            multiple={false}
                            showUploadList={false}
                            disabled={uploading}
                            customRequest={() => false}
                        >
                            {nftMetaData.image && (
                                <img
                                    src={nftMetaData.image}
                                    alt="file"
                                    style={{ width: '100%' }}
                                />
                            )}
                            {/* <CameraOutlined /> */}
                        </Upload>
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Button
                        className="primary"
                        type="primary"
                        htmlType="submit"
                        loading={loading || uploading}
                        disabled={loading || uploading}
                        style={{ marginRight: 10 }}
                    >
                        {uploading ? 'Updating Nft' : 'Update NFT'}
                    </Button>
                </Col>
            </Form>
            :
            <>
            </>
    );
};

export default ModelNftDetails;

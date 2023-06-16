import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Row,
  Col
} from 'antd';
import { connect } from 'react-redux';
import {
  updatePerformer as updatePerformerAction
} from 'src/redux/user/actions';
import {
  ConnectWallet, useAddress, useSDK, useStorage
} from '@thirdweb-dev/react';

import { OrchidzBuildContractAddr } from 'src/contract/networkDetails';
import OrchidzBuildAbi from 'src/contract/OrchidzBuildAbi.json';
import { ethers } from 'ethers';

type CreateNftType = {
  name:string;
  image:string;
  price:number;
  admin:string;
  royalyPercent:number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export const CreateNftCollectionForm: React.FC<any> = ({ user, updatePerformer }) => {
  const address = useAddress();
  const storage = useStorage();
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);

  const createNFT = async (metadata: CreateNftType):Promise<number> => {
    const imageUri = 'ipfs://QmeRgH3a5BYXer6X3KwEpFedTFXz8svSpfC84FvRR3MXSd';
    const urii = 'ipfs://QmaPtJKTuSWrh566qHZqfFWFy3td4QSNy1ZwSBkQX9V3uG/0';
    setLoading(true);
    console.log('uploading ipfs');
    // const imageUri = await storage.upload();
    // const urii = await storage.upload({ ...metadata, image: imageUri });
    console.log(urii);
    // const durii = await storage.download(urii);
    // console.log(durii.url);
    const OrchidzBuildCreatorContract = await sdk.getContract(
      OrchidzBuildContractAddr,
      OrchidzBuildAbi
    );

    try {
      const tx = await OrchidzBuildCreatorContract.call(
        'createNFTtoMint', // Name of your function as it is on the smart contract
        [
          urii,
          ethers.utils.parseUnits(String(metadata.price), 'ether'),
          metadata.admin
        ]
      );
      console.log(Number(tx.receipt.events[0].args.id));
      setLoading(false);
      return -1;
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      return -1;
    }
  };

  const handleOnSubmit = async (metadata: CreateNftType) => {
    try {
      const nftId = await createNFT(metadata);
      if (nftId >= 0) {
        await updatePerformer({
          ...user,
          nftId
        });
      }
    } catch (error) {
      message.error(error.message);
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

  return (
    <Form
      {...layout}
      onFinish={handleOnSubmit}
      onFinishFailed={() => message.error('Please complete the required fields')}
      name="form-create-nftid"
      validateMessages={validateMessages}
      initialValues={{
        name: user.name,
        admin: address,
        price: 10,
        royalyPercent: 2.5
      }}
      scrollToFirstError
    >
      <Row>
        <Col xs={24}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter a name for your collection' }]}
            label="NFT Name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={16}>
          <Form.Item
            name="image"
            rules={[{ required: true, message: 'Please enter a Valid Nft image uri' }]}
            label="Enter NFT image Uri"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item
            name="price"
            rules={[{ required: true, message: 'Please enter a Valid NFT price' }]}
            label="Enter NFT Price (MATIC)"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        {/* <Col xs={24}>
          <Form.Item
            name="primary_sale_recipient"
            rules={[{ required: true, message: 'Please enter a primary sale recipient address' }]}
            label="Primary Sale Recipient Address"
          >
            <Input />
          </Form.Item>
        </Col> */}
        {/* <Col xs={18}>
          <Form.Item
            name="fee_recipient"
            rules={[{ required: true, message: 'Please enter a royalties recipient address' }]}
            label="Royalty Recipient Address"
          >
            <Input />
          </Form.Item>
        </Col> */}
        <Col xs={16}>
          <Form.Item
            name="admin"
            rules={[{ required: true, message: 'Please enter a admin address' }]}
            label="Admin Address"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={8}>
          <Form.Item
            name="royalyPercent"
            rules={[{ required: true, message: 'Please enter a royalty percentage' }]}
            label="Royalty Percentage"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Button
            className="primary"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            style={{ marginRight: 10 }}
          >
            Configure NFT Collection
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const mapDispatch = {
  updatePerformer: updatePerformerAction
};

export default connect(undefined, mapDispatch)(CreateNftCollectionForm);

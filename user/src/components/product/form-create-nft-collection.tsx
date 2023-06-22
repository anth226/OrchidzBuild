import React, { useContext, useState } from 'react';
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
import { CameraOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { updatePerformer as updatePerformerAction } from 'src/redux/user/actions';
import {
  ConnectWallet,
  useAddress,
  useSDK,
  useStorage
} from '@thirdweb-dev/react';

import { ethers } from 'ethers';
import { Web3ConnectionContext } from 'src/smartContract/Web3ConnectionContext';

type CreateNftType = {
  name: string;
  price: number;
  admin: string;
  royalyPercent: number;
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export const CreateNftCollectionForm: React.FC<any> = ({
  user,
  updatePerformer
}) => {
  const { address, storage, getOrchidzContract } = useContext(
    Web3ConnectionContext
  );
  // const address = useAddress();
  // const storage = useStorage();
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgUrlIPFS, setimgUrlIPFS] = useState('');
  const [preUrl, setPreUrl] = useState('');

  const createNFT = async (metadata: CreateNftType): Promise<number> => {
    setLoading(true);
    const urii = await storage.upload({ ...metadata, image: imgUrlIPFS });
    // const durii = await storage.download(urii);
    // console.log('metadata', durii.url);

    try {
      const OrchidzBuildCreatorContract = await getOrchidzContract();
      console.log([
        urii,
        ethers.utils.parseUnits(String(metadata.price), 'ether'),
        metadata.admin
      ]);
      
      const tx = await OrchidzBuildCreatorContract.call(
        'createNFTtoMint', // Name of your function as it is on the smart contract
        [
          urii,
          ethers.utils.parseUnits(String(metadata.price), 'ether'),
          metadata.admin
        ]
      );

      console.log('nft id', Number(tx.receipt.events[0].args.id));
      setLoading(false);
      return Number(tx.receipt.events[0].args.id);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      return -1;
    }
  };

  const handleOnSubmit = async (metadata: CreateNftType) => {
    if (imgUrlIPFS === '') return;
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

  async function uploadImageIpfs(file) {
    setUploading(true);
    const _uri = await storage.upload(file);
    setimgUrlIPFS(_uri);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreUrl(String(reader.result));
    });
    reader.readAsDataURL(file);
    setUploading(false);
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
            rules={[
              {
                required: true,
                message: 'Please enter a name for your collection'
              }
            ]}
            label="NFT Name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item
            name="price"
            rules={[
              { required: true, message: 'Please enter a Valid NFT price' }
            ]}
            label="Enter NFT Price (MATIC)"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item
            name="royalyPercent"
            rules={[
              { required: true, message: 'Please enter a royalty percentage' }
            ]}
            label="Royalty Percentage"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="admin"
            rules={[
              { required: true, message: 'Please enter a admin address' }
            ]}
            label="Admin Address"
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
              beforeUpload={uploadImageIpfs.bind(this)}
              customRequest={() => false}
            >
              {preUrl !== '' && (
                <img
                  src={preUrl}
                  alt="file"
                  style={{ width: '100%' }}
                />
              )}
              <CameraOutlined />
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
            {uploading ? 'Uploading Files' : 'Create NFT'}
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

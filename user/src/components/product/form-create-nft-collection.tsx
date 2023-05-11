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
  ConnectWallet, useAddress, useSDK, NFTContractDeployMetadata
} from '@thirdweb-dev/react';

const useCollectionDeployment = () => {
  const [loading, setLoading] = useState(false);
  const sdk = useSDK();

  const deploy = async (metadata: NFTContractDeployMetadata) => {
    try {
      setLoading(true);
      const contractAddress = await sdk.deployer.deployEditionDrop({
        ...metadata,
        // @TODO: config should come from environment variables
        seller_fee_basis_points: metadata.seller_fee_basis_points * 100,
        platform_fee_recipient: '0xa5b586b750Ae4D91780BD50e289e8d267F9C2435',
        platform_fee_basis_points: 2.5 * 100
      });
      return contractAddress;
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  return {
    loading,
    deploy
  };
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export const CreateNftCollectionForm: React.FC<any> = ({ user, updatePerformer }) => {
  const address = useAddress();
  const { loading, deploy } = useCollectionDeployment();

  const handleOnSubmit = async (metadata: NFTContractDeployMetadata) => {
    try {
      const contractAddress = await deploy(metadata);
      if (contractAddress) {
        await updatePerformer({
          ...user,
          contractAddress
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
      name="form-create-collection"
      validateMessages={validateMessages}
      initialValues={{
        name: user.name,
        primary_sale_recipient: address,
        fee_recipient: address,
        seller_fee_basis_points: 2.5
      }}
      scrollToFirstError
    >
      <Row>
        <Col xs={24}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter a name for your collection' }]}
            label="Collection Name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="primary_sale_recipient"
            rules={[{ required: true, message: 'Please enter a primary sale recipient address' }]}
            label="Primary Sale Recipient Address"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={18}>
          <Form.Item
            name="fee_recipient"
            rules={[{ required: true, message: 'Please enter a royalties recipient address' }]}
            label="Royalty Recipient Address"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={6}>
          <Form.Item
            name="seller_fee_basis_points"
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

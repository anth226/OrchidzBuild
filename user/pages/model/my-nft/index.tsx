import { PureComponent } from 'react';
import Head from 'next/head';
import { message, Layout, Col, Form, Button, Modal } from 'antd';
import { ShopOutlined, GiftOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import { productService } from '@services/product.service';
import Router from 'next/router';
import { FormProduct } from '@components/product/form-product';
import { IUIConfig, IPerformer, ISettings } from 'src/interfaces';
import { connect } from 'react-redux';
import { getResponseError } from '@lib/utils';
import ModelNftDetails from '@components/product/nft-details';
import FormCreateNftCollection from '@components/product/form-create-nft-collection';

interface IFiles {
  fieldname: string;
  file: File;
}

interface IProps {
  ui: IUIConfig;
  user: IPerformer;
  settings: ISettings;
}

class CreateProduct extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  state = {
    uploading: false,
    uploadPercentage: 0,
    contractModalOpen: false
  };

  _files: {
    image: File;
    digitalFile: File;
  } = {
    image: null,
    digitalFile: null
  };

  componentDidMount() {
    const { user, settings } = this.props;
    if (!user || !user.verifiedDocument) {
      message.warning('Your ID documents are not verified yet! You could not post any content right now.');
      Router.back();
    }
    // if (settings.paymentGateway === 'stripe' && !user?.stripeAccount?.payoutsEnabled) {
    //   message.warning('You have not connected with stripe. So you cannot post any content right now!');
    //   Router.push('/model/banking');
    // }
  }

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File, field: string) {
    this._files[field] = file;
  }

  async submit(data: any) {
    if (!this._files.image) {
      message.error('Please upload product image!');
      return;
    }
    if (data.type === 'digital' && !this._files.digitalFile) {
      message.error('Please select digital file!');
      return;
    }
    if (data.type === 'physical') {
      this._files.digitalFile = null;
    }

    const files = Object.keys(this._files).reduce((tmpFiles, key) => {
      if (this._files[key]) {
        tmpFiles.push({
          fieldname: key,
          file: this._files[key] || null
        });
      }
      return tmpFiles;
    }, [] as IFiles[]) as [IFiles];

    await this.setState({
      uploading: true
    });
    try {
      await productService.createProduct(
        files,
        data,
        this.onUploading.bind(this)
      );
      message.success('New product was successfully created');
      Router.push('/model/my-store');
    } catch (error) {
      message.error(
        getResponseError(error) || 'Something went wrong, please try again!'
      );
      this.setState({
        uploading: false
      });
    }
  }

  render() {
    const { uploading, uploadPercentage, contractModalOpen } = this.state;
    const { ui, user } = this.props;

    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | New product
          </title>
        </Head>
        <div className="main-container pt-2">
          <PageHeading title="My Nfts" icon={<GiftOutlined />} />
          <>
        {Number(user.nftId) > 0 && (
          <ModelNftDetails user={user} />
        )}
        {Number(user.nftId) > 0 && (
          <>
            <Col xs={24}>
              <Form.Item>
                <Button
                  className="primary"
                  type="primary"
                  onClick={() => this.setState({ contractModalOpen: true })}
                >
                  Create Your NFT
                </Button>
              </Form.Item>
            </Col>
            <Modal
              title="Configure NFT Collection"
              centered
              open={contractModalOpen}
              footer={null}
              width={600}
              onCancel={() => this.setState({ contractModalOpen: false })}
            >
              <FormCreateNftCollection user={user} />
            </Modal>
          </>
        )}
      </>
        </div>
      </>
    );
  }
}
const mapStates = (state: any) => ({
  ui: state.ui,
  user: state.user.current,
  settings: state.settings
});
export default connect(mapStates)(CreateProduct);

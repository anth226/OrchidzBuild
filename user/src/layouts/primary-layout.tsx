import { PureComponent } from 'react';
import dynamic from 'next/dynamic';
import { Layout, BackTop } from 'antd';
import { connect } from 'react-redux';
import { Router } from 'next/router';
import { IUIConfig } from 'src/interfaces/ui-config';
import { loadUIValue } from '@redux/ui/actions';

const Header = dynamic(() => import('@components/common/layout/header'));
const Footer = dynamic(() => import('@components/common/layout/footer'));
const Loader = dynamic(() => import('@components/common/base/loader'));

interface DefaultProps {
  loadUIValue: Function;
  children: any;
  ui: IUIConfig
}

class PrimaryLayout extends PureComponent<DefaultProps> {
  state = {
    routerChange: false
  };

  componentDidMount() {
    const { loadUIValue: handleLoadUI } = this.props;
    process.browser && handleLoadUI();
    process.browser && this.handleStateChange();
  }

  handleStateChange() {
    Router.events.on('routeChangeStart', async () => this.setState({ routerChange: true }));
    Router.events.on('routeChangeComplete', async () => this.setState({ routerChange: false }));
  }

  render() {
    const {
      children, ui
    } = this.props;
    const { routerChange } = this.state;
    return (
      <div className=" text-textColor bg-gradient-to-bl from-primaryColor from-1% via-bgColor via-20% to-bgColor to-79%">
          <div className="flex">
            <div className="h-screen w-2/12">
              <Header />
            </div>
            <div className="flex-auto overflow-y-auto h-screen w-8/12">
              <Layout.Content>
                {routerChange ? <Loader /> :
                  children
                }
                {/* <Loader /> */}
              </Layout.Content>
            </div>
          </div>
          <BackTop className="backTop" />
          {/* <Footer /> */}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ui: { ...state.ui }
});
const mapDispatchToProps = { loadUIValue };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);

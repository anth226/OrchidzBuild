import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import nextCookie from 'next-cookies';
import withReduxSaga from '@redux/withReduxSaga';
import { Store } from 'redux';
import BaseLayout from '@layouts/base-layout';
import {
  authService, userService, settingService
} from '@services/index';
import Router from 'next/router';
import { NextPageContext } from 'next';
import { loginSuccess } from '@redux/auth/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { updateUIValue } from '@redux/ui/actions';
import {
  Ethereum,
  Goerli,
  Mumbai,
  Polygon,
  Sepolia
} from '@thirdweb-dev/chains';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Socket } from 'src/socket';
import Head from 'next/head';
import { SETTING_KEYS } from 'src/constants';
import { pick } from 'lodash';
import { updateLiveStreamSettings } from '@redux/streaming/actions';
import { updateSettings } from '@redux/settings/actions';
import { setGlobalConfig } from '@services/config';

require('../style/default.less');
require('../style/mixin.less');
require('../style/index.less');

require('../src/components/common/base/loader.less');
require('../src/components/common/layout/header.less');
require('../src/components/common/layout/page.less');
require('../src/components/common/layout/search-bar.less');
require('../src/components/auth/google-login-button.less');
require('../src/components/comment/comment.less');
require('../src/components/post/index.less');
require('../src/components/performer/performer.less');
require('../src/layouts/primary-layout.less');

require('./auth/index.less');
require('./home/index.less');
require('./gallery/index.less');
require('./model/block-user/index.less');
require('./model/earning/index.less');
require('./model/live/index.less');
require('./store/store.less');
require('./user/cards/index.less');
require('./user/index.less');
require('./video/index.less');
require('./wallet/index.less');

declare global {
  interface Window {
    ReactSocketIO: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    iframely: any;
  }
}

function redirectLogin(ctx: any) {
  if (process.browser) {
    authService.removeToken();
    Router.push('/');
    return;
  }

  // fix for production build
  ctx.res.clearCookie && ctx.res.clearCookie('token');
  ctx.res.clearCookie && ctx.res.clearCookie('role');
  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/' });
  ctx.res.end && ctx.res.end();
}

async function auth(
  ctx: NextPageContext,
  noredirect: boolean,
  onlyPerformer: boolean
) {
  try {
    // @ts-ignore
    const { store } = ctx;
    const state = store.getState();
    const { token } = nextCookie(ctx);
    if (state.auth && state.auth.loggedIn) {
      return;
    }
    if (token) {
      authService.setToken(token);
      const user = await userService.me({
        Authorization: token
      });
      if (!user.data || !user.data._id) {
        redirectLogin(ctx);
        return;
      }
      if (!user.data.isPerformer && onlyPerformer) {
        redirectLogin(ctx);
        return;
      }
      store.dispatch(loginSuccess());
      store.dispatch(updateCurrentUser(user.data));
      return;
    }

    !noredirect && redirectLogin(ctx);
  } catch (e) {
    redirectLogin(ctx);
  }
}

async function updateSettingsStore(ctx: NextPageContext, settings) {
  // @ts-ignore
  const { store } = ctx;
  store.dispatch(
    updateUIValue({
      logo: settings.logoUrl || '',
      siteName: settings.siteName || '',
      favicon: settings.favicon || '',
      loginPlaceholderImage: settings.loginPlaceholderImage || '',
      menus: settings.menus || [],
      footerContent: settings.footerContent || '',
      countries: settings.countries || [],
      userBenefit: settings.userBenefit || '',
      modelBenefit: settings.modelBenefit || ''
    })
  );
  store.dispatch(
    updateLiveStreamSettings(
      pick(settings, [
        SETTING_KEYS.VIEWER_URL,
        SETTING_KEYS.PUBLISHER_URL,
        SETTING_KEYS.SUBSCRIBER_URL,
        SETTING_KEYS.OPTION_FOR_BROADCAST,
        SETTING_KEYS.OPTION_FOR_PRIVATE,
        SETTING_KEYS.SECURE_OPTION,
        SETTING_KEYS.ANT_MEDIA_APPNAME,
        SETTING_KEYS.AGORA_APPID,
        SETTING_KEYS.AGORA_ENABLE
      ])
    )
  );

  store.dispatch(
    updateSettings(
      pick(settings, [
        SETTING_KEYS.REQUIRE_EMAIL_VERIFICATION,
        SETTING_KEYS.TOKEN_CONVERSION_RATE,
        SETTING_KEYS.STRIPE_PUBLISHABLE_KEY,
        SETTING_KEYS.GOOGLE_RECAPTCHA_SITE_KEY,
        SETTING_KEYS.ENABLE_GOOGLE_RECAPTCHA,
        SETTING_KEYS.GOOGLE_CLIENT_ID,
        SETTING_KEYS.TWITTER_CLIENT_ID,
        SETTING_KEYS.PAYMENT_GATEWAY,
        SETTING_KEYS.META_KEYWORDS,
        SETTING_KEYS.META_DESCRIPTION
      ])
    )
  );
}

interface AppComponent extends NextPageContext {
  layout: string;
}

interface IApp {
  store: Store;
  layout: string;
  Component: AppComponent;
  settings: any;
  config: any;
}

const publicConfig = {} as any;
class Application extends App<IApp> {
  // TODO - consider if we need to use get static props in children component instead?
  // or check in render?
  static async getInitialProps({ Component, ctx }) {
    // load configuration from ENV and put to config
    if (!process.browser) {
      // eslint-disable-next-line global-require
      const dotenv = require('dotenv');
      const myEnv = dotenv.config().parsed;

      // publish to server config with app
      setGlobalConfig(myEnv);

      // load public config and api-endpoint?
      Object.keys(myEnv).forEach((key) => {
        if (key.indexOf('NEXT_PUBLIC_') === 0) {
          publicConfig[key] = myEnv[key];
        }
      });
    }

    // won't check auth for un-authenticated page such as login, register
    // use static field in the component
    const { noredirect, onlyPerformer, authenticate } = Component;
    if (authenticate !== false) {
      await auth(ctx, noredirect, onlyPerformer);
    }
    const { token } = nextCookie(ctx);
    ctx.token = token || '';
    // server side to load settings, once time only
    let settings = {};
    if (!process.browser) {
      const [setting] = await Promise.all([
        settingService.all('all', true)
      ]);
      settings = { ...setting.data };
      await updateSettingsStore(ctx, settings);
    }
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return {
      settings,
      pageProps,
      layout: Component.layout,
      config: publicConfig
    };
  }

  constructor(props) {
    super(props);
    setGlobalConfig(this.props.config);
  }

  render() {
    const Ganache = {
      chainId: 1337, // Chain ID of the network
      rpc: ['http://127.0.0.1:8545'],
      nativeCurrency: {
        decimals: 18,
        name: 'Ganache ETH',
        symbol: 'gETH'
      },
      shortName: 'ganache', // Display value shown in the wallet UI
      slug: 'ganache', // Display value shown in the wallet UI
      testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
      chain: 'Ganache', // Name of the network
      name: 'Ganache Testnet' // Name of the network
    };
    const {
      Component, pageProps, store, settings
    } = this.props;
    const { layout } = Component;
    return (
      <ThirdwebProvider
        activeChain="ganache"
        // activeChain="mumbai"
        supportedChains={[Ganache, Polygon, Mumbai]}
      >
        <Provider store={store}>
          <Head>
            <title>{settings?.siteName}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            {/* GA code */}
            {settings && settings.gaCode && [
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaCode}`} />,
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
                   window.dataLayer = window.dataLayer || [];
                   function gtag(){dataLayer.push(arguments);}
                   gtag('js', new Date());
                   gtag('config', '${settings.gaCode}');
               `
                }}
              />
            ]}
            {/* extra script */}
            {settings && settings.headerScript && (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: settings.headerScript }} />
            )}
          </Head>
          <Socket>
            <BaseLayout layout={layout} maintenance={settings.maintenanceMode}>
              <Component {...pageProps} />
            </BaseLayout>
          </Socket>
          {settings && settings.afterBodyScript && (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: settings.afterBodyScript }} />
          )}
        </Provider>
      </ThirdwebProvider>
    );
  }
}

export default withReduxSaga(Application);

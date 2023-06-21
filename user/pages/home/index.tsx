/* eslint-disable react/no-unused-prop-types */
import {
  Layout, message, Tooltip, Alert, Input
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { HomePerformers } from '@components/performer';
import HomeFooter from '@components/common/layout/footer';
import { getFeeds, moreFeeds, removeFeedSuccess } from '@redux/feed/actions';
import {
  performerService, feedService, bannerService, utilsService, streamService
} from '@services/index';
import {
  IFeed, IPerformer, ISettings, IUser, IBanner, IUIConfig, ICountry, IStream
} from 'src/interfaces';
import ScrollListFeed from '@components/post/scroll-list';
import {
  SyncOutlined, TagOutlined, SearchOutlined, CloseOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Router from 'next/router';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import Carousel from '@components/Carousel/Carousel';
import SearchInputBox from '@components/inputbox/SearchInputBox';

const StreamListItem = dynamic(() => import('@components/streaming/stream-list-item'), { ssr: false });

interface IProps {
  countries: ICountry[];
  banners: IBanner[];
  streams: IStream[];
  ui: IUIConfig;
  settings: ISettings;
  user: IUser;
  performers: IPerformer[];
  getFeeds: Function;
  moreFeeds: Function;
  feedState: any;
  removeFeedSuccess: Function;
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  const bodyHeight = window.innerHeight || document.documentElement.clientHeight;
  return (
    rect.bottom <= bodyHeight + 250
  );
}

class HomePage extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  static async getInitialProps() {
    const [banners, countries, streams] = await Promise.all([
      bannerService.search({ limit: 99 }),
      utilsService.countriesList(),
      streamService.search({ limit: 99 })
    ]);
    return {
      banners: banners?.data?.data || [],
      countries: countries?.data || [],
      streams: streams?.data?.data || []
    };
  }

  state = {
    itemPerPage: 12,
    feedPage: 0,
    loadingPerformer: false,
    isFreeSubscription: '',
    randomPerformers: [],
    orientation: '',
    keyword: '',
    openSearch: false,
    showFooter: false
  }

  componentDidMount() {
    this.getPerformers();
    this.getFeeds();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // eslint-disable-next-line react/sort-comp
  handleScroll = () => {
    const footer = document.getElementById('main-footer');
    if (isInViewport(footer)) {
      this.setState({ showFooter: false });
    } else {
      this.setState({ showFooter: true });
    }
  }

  handleClick = (stream: IStream) => {
    const { user } = this.props;
    if (!user._id) {
      message.error('Please log in or register!', 5);
      Router.push('/');
      return;
    }
    if (user.isPerformer) return;
    if (!stream?.isSubscribed) {
      message.error('Please subscribe to join live chat!', 5);
      Router.push({
        pathname: '/model/profile',
        query: {
          username: stream?.performerInfo?.username || stream?.performerInfo?._id
        }
      }, `/${stream?.performerInfo?.username || stream?.performerInfo?._id}`);
      return;
    }
    Router.push({
      pathname: '/streaming/details',
      query: {
        username: stream?.performerInfo?.username || stream?.performerInfo?._id
      }
    }, `/streaming/${stream?.performerInfo?.username || stream?.performerInfo?._id}`);
  };

  async onGetFreePerformers() {
    const { isFreeSubscription } = this.state;
    await this.setState({ isFreeSubscription: isFreeSubscription ? '' : true });
    this.getPerformers();
  }

  async onDeleteFeed(feed: IFeed) {
    const { removeFeedSuccess: handleRemoveFeed } = this.props;
    if (!window.confirm('All earnings related to this post will be refunded. Are you sure to remove it?')) return;
    try {
      await feedService.delete(feed._id);
      message.success('Post deleted successfully');
      handleRemoveFeed({ feed });
    } catch (e) {
      message.error('Something went wrong, please try again later');
    }
  }

  async onFilterFeed(value: string) {
    await this.setState({ orientation: value, feedPage: 0 });
    this.getFeeds();
  }

  onSearchFeed = debounce(async (e) => {
    await this.setState({ keyword: e, feedPage: 0 });
    this.getFeeds();
  }, 600)

  async getFeeds() {
    const { getFeeds: handleGetFeeds, user } = this.props;
    const {
      itemPerPage, feedPage, keyword, orientation
    } = this.state;
    handleGetFeeds({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: !!user.verifiedEmail
    });
  }

  async getPerformers() {
    const { isFreeSubscription } = this.state;
    const { user } = this.props;
    try {
      await this.setState({ loadingPerformer: true });
      const performers = await (
        await performerService.randomSearch({ isFreeSubscription })
      ).data.data;
      this.setState({
        randomPerformers: performers.filter((p) => p._id !== user._id),
        loadingPerformer: false
      });
    } catch {
      this.setState({ loadingPerformer: false });
    }
  }

  async loadmoreFeeds() {
    const { feedState, moreFeeds: handleGetMore, user } = this.props;
    const { items: posts, total: totalFeeds } = feedState;
    const { feedPage, itemPerPage } = this.state;
    if (posts.length >= totalFeeds) return;
    this.setState({ feedPage: feedPage + 1 }, () => {
      handleGetMore({
        limit: itemPerPage,
        offset: (feedPage + 1) * itemPerPage,
        isHome: !!user.verifiedEmail
      });
    });
  }

  render() {
    const {
      ui, feedState, user, settings, banners, countries, streams
    } = this.props;
    const { items: feeds, total: totalFeeds, requesting: loadingFeed } = feedState;
    // const topBanners = banners && banners.length > 0 && banners.filter((b) => b.position === 'top');
    const {
      randomPerformers, loadingPerformer, isFreeSubscription, openSearch, showFooter
    } = this.state;
    const topBanners = [
      <img width={200} className="h-full w-full" src="https://picsum.photos/100/800/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/200/800/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/800/200/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/400/800/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/800/400/?random" alt="teste" />,
    ];

    // const topBanners = [{ _id: 1, description: "this is dess", tittle: "banner full", photo: { url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" } }, { _id: 2, description: "this is dess", tittle: "banner full", photo: { url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80" } }]

    const fakeSteams = [{
      _id: "1",
      title: "new Stream",
      description: "this is details",
      performerId: "string",
      // performerInfo: IPerformer,
      type: 'public',
      sessionId: "string",
      isStreaming: 1,
      streamingTime: 203,
      lastStreamingTime: new Date(),
      isFree: true,
      price: 10,
      stats: {
        members: 55,
        likes: 555,
      },
      isSubscribed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversationId: "stringcon",
      hasPurchased: true
    }, {
      _id: "2",
      title: "new Stream",
      description: "this is details",
      performerId: "string",
      // performerInfo: IPerformer,
      type: 'public',
      sessionId: "string",
      isStreaming: 1,
      streamingTime: 203,
      lastStreamingTime: new Date(),
      isFree: true,
      price: 0,
      stats: {
        members: 55,
        likes: 555,
      },
      isSubscribed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversationId: "stringcon",
      hasPurchased: true
    }]

    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Home
          </title>
        </Head>
        <div className="w-full min-h-screen  flex flex-col pt-20 ">
          <div className="">

            <h1 className="text-4xl font-bold text-textColor">
              HOME
            </h1>
            <hr className="my-6 h-0.5 border-t-0 shadow-lg bg-neutral-200 opacity-100 dark:opacity-50" />
          </div>

          <div className="flex flex-auto justify-evenly">
            <div className="">
              <Carousel items={topBanners} />
              {user._id && !user.verifiedEmail && settings.requireEmailVerification && <Link href={user.isPerformer ? '/model/account' : '/user/account'}><a><Alert type="error" style={{ margin: '15px 0', textAlign: 'center' }} message="Please verify your email address, click here to update!" /></a></Link>}
              {fakeSteams?.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-stretch">
                    <span>Live Videos</span>
                    <a href="/model" className="text-black"><span>View all</span></a>
                  </div>
                  <div className="flex gap-4 w-full overflow-x-auto">
                    {fakeSteams.length > 0 ? fakeSteams.map((s) => (
                      <StreamListItem stream={s} user={user} key={s._id} />
                    )) :
                      <p className="text-center" style={{ margin: '30px 0' }}>No live for now</p>
                    }
                  </div>
                </div>
              )}
              {!loadingFeed && !totalFeeds && (
                <div className="main-container custom text-center" style={{ margin: '10px 0' }}>
                  <Alert
                    type="warning"
                    message={(
                      <a href="/model">
                        <SearchOutlined />
                        {' '}
                        Find someone to follow
                      </a>
                    )}
                  />
                </div>
              )}
              <div className="mt-8 mx-4">

                <ScrollListFeed
                  items={feeds}
                  canLoadmore={feeds && feeds.length < totalFeeds}
                  loading={loadingFeed}
                  onDelete={this.onDeleteFeed.bind(this)}
                  loadMore={this.loadmoreFeeds.bind(this)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between w-[30rem]">
              <div>
                <div>
                  <SearchInputBox onChange={(e) => {
                    e.persist();
                    this.onSearchFeed(e.target.value);
                  }} />
                </div>
                <div className="">
                  <div className="my-4">
                    <span className="text-2xl">Who to Follow</span>
                  </div>
                  <HomePerformers countries={countries} performers={randomPerformers} />
                  <div className="mt-4">
                    <Link href="/model">
                      <span className="text-xl">Show more</span>
                    </Link>
                  </div>
                  {!loadingPerformer && !randomPerformers?.length && <p className="text-center">No profile was found</p>}

                </div>
              </div>
              <div className="">
                <HomeFooter />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  user: { ...state.user.current },
  feedState: { ...state.feed.feeds },
  settings: { ...state.settings }
});

const mapDispatch = {
  getFeeds, moreFeeds, removeFeedSuccess
};
export default connect(mapStates, mapDispatch)(HomePage);

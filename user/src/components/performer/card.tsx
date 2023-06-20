import { PureComponent } from 'react';
import { Avatar, message, Tooltip } from 'antd';
import { TickIcon } from 'src/icons';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { IPerformer, ICountry, IUser } from 'src/interfaces';
import Link from 'next/link';
import moment from 'moment';
import { connect } from 'react-redux';
import Router from 'next/router';
import { followService } from 'src/services';
import './performer.less';

interface IProps {
  performer: IPerformer;
  countries: ICountry[];
  user: IUser;
  onFollow?: Function;
}

class PerformerCard extends PureComponent<IProps> {
  state = {
    isFollowed: false,
    requesting: false
  };

  componentDidMount(): void {
    const { performer } = this.props;
    this.setState({ isFollowed: !!performer?.isFollowed });
  }

  handleJoinStream = (e) => {
    e.preventDefault();
    const { user, performer } = this.props;
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    if (user.isPerformer) return;
    if (!performer?.isSubscribed) {
      message.error('Please subscribe to this model!');
      return;
    }
    Router.push({
      pathname: '/streaming/details',
      query: {
        performer: JSON.stringify(performer),
        username: performer?.username || performer?._id
      }
    }, `/streaming/${performer?.username || performer?._id}`);
  }

  handleFollow = async () => {
    const { performer, user, onFollow } = this.props;
    const { isFollowed, requesting } = this.state;
    if (requesting || user.isPerformer) return;
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    try {
      this.setState({ requesting: true });
      if (!isFollowed) {
        await followService.create(performer?._id);
        this.setState({ isFollowed: true, requesting: false });
      } else {
        await followService.delete(performer?._id);
        this.setState({ isFollowed: false, requesting: false });
      }
      onFollow && onFollow();
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Error occured, please try again later');
      this.setState({ requesting: false });
    }
  };

  render() {
    const { performer, countries, user } = this.props;
    const { isFollowed } = this.state;
    const country = countries && countries.length && countries.find((c) => c.code === performer.country);

    return (
      <Link
        href={{
          pathname: '/model/profile',
          query: { username: performer?.username || performer?._id }
        }}
        as={`/${performer?.username || performer?._id}`}
      >
        <div
          className="bg-center py-6 rounded-2xl"
          style={{
            backgroundImage: `url(${performer?.cover || '/static/banner-image.jpg'})`
          }}
        >
          <div className="flex items-center ml-12">
            <div className="bg-primaryColor rounded-full ">
              <div className="relative p-1">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    className=" w-full h-full"
                    src={performer?.avatar || '/static/no-avatar.png'}
                    alt="Profile"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start ml-6">
              <div className="flex">
                <span className="text-2xl text-white stroke-black">
                  {performer?.name || 'N/A'}
                </span>
                {performer?.verifiedAccount && <TickIcon className="text-white " />}
                {country && (
                  <img alt="performer-country" className="model-country" src={country?.flag} />
                )}
              </div>
              <span className="text-lg text-white">
                {`@${performer?.username || 'n/a'}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

const maptStateToProps = (state) => ({ user: { ...state.user.current } });
export default connect(maptStateToProps)(PerformerCard);

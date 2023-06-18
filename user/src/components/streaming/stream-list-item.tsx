import { IStream } from '@interfaces/stream';
import { IUser } from '@interfaces/user';
import { message } from 'antd';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { showSubscribePerformerModal } from '@redux/subscription/actions';

type Props = {
  stream: IStream;
  user: IUser;
}

export default function StreamListItem({ stream, user }: Props) {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!user._id) {
      message.error('Please log in or register!', 5);
      Router.push('/');
      return;
    }
    if (user.isPerformer) return;
    if (!stream?.isSubscribed) {
      message.error('Please subscribe to join live chat!', 5);
      dispatch(showSubscribePerformerModal(stream.performerId));
      return;
    }
    Router.push(
      {
        pathname: '/streaming/details',
        query: {
          username:
            stream?.performerInfo?.username || stream?.performerInfo?._id
        }
      },
      `/streaming/${stream?.performerInfo?.username || stream?.performerInfo?._id
      }`
    );
  };

  return (
    <>
      {/* <div
        aria-hidden
        onClick={handleClick}
        key={stream?._id}
        className="story-per-card"
        title={stream?.performerInfo?.name || stream?.performerInfo?.username || 'N/A'}
      >
        <div className="blink-border" />
        <img className="per-avatar" alt="avatar" src={stream?.performerInfo?.avatar || '/static/no-avatar.png'} />
        <div className="live-tag">LIVE</div>
      </div> */}
      <div className="bg-primaryOrange rounded-full ">
        <div className="relative p-1">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              className=" w-full h-full"
              src={stream?.performerInfo?.avatar || '/static/no-avatar.png'}
              alt="Profile"
            />
          </div>
          <div className="absolute inset-0 text-center flex justify-center items-end ">
            <p className="text-white leading-3 px-2 py-1 text-[10px] text-he border border-white rounded-md font-semibold bg-primaryOrange">LIVE</p>
          </div>
        </div>
      </div>
      <div className="bg-primaryOrange rounded-full ">
        <div className="relative p-1">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              className=" w-full h-full"
              src={stream?.performerInfo?.avatar || '/static/no-avatar.png'}
              alt="Profile"
            />
          </div>
          <div className="absolute inset-0 text-center flex justify-center items-end ">
            <p className="text-white leading-3 px-2 py-1 text-[10px] text-he border border-white rounded-md font-semibold bg-primaryOrange">LIVE</p>
          </div>
        </div>
      </div>
      <div className="bg-primaryOrange rounded-full ">
        <div className="relative p-1">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              className=" w-full h-full"
              src={stream?.performerInfo?.avatar || '/static/no-avatar.png'}
              alt="Profile"
            />
          </div>
          <div className="absolute inset-0 text-center flex justify-center items-end ">
            <p className="text-white leading-3 px-2 py-1 text-[10px] text-he border border-white rounded-md font-semibold bg-primaryOrange">LIVE</p>
          </div>
        </div>
      </div>
      <div className="bg-primaryOrange rounded-full ">
        <div className="relative p-1">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              className=" w-full h-full"
              src={stream?.performerInfo?.avatar || '/static/no-avatar.png'}
              alt="Profile"
            />
          </div>
          <div className="absolute inset-0 text-center flex justify-center items-end ">
            <p className="text-white leading-3 px-2 py-1 text-[10px] text-he border border-white rounded-md font-semibold bg-primaryOrange">LIVE</p>
          </div>
        </div>
      </div>
    </>
  );
}

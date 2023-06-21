import Router from 'next/router';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';

interface Iprops {
  title: string;
  icon?: any
}

const PageHeading = ({ title, icon }: Iprops) => (
  <div className="page-heading ">
    <span className="text-3xl" aria-hidden onClick={() => Router.back()}>
      {icon || <ArrowLeftOutlined className="text-xl" />}
      {' '}
      {title}
    </span>
  </div>
);

PageHeading.defaultProps = {
  icon: null
};

export default PageHeading;

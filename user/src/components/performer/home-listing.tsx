import { Carousel } from 'antd';
import { PureComponent } from 'react';
import { IPerformer, ICountry } from 'src/interfaces';
import { chunk } from 'lodash';
import PerformerCard from './card';
import './performer.less';

interface IProps {
  performers: IPerformer[];
  countries: ICountry[];
}

export class HomePerformers extends PureComponent<IProps> {
  render() {
    const { performers, countries } = this.props;
    const chunkPerformers = chunk(performers, 1);
    return (
      <div className="flex flex-col gap-4">
          {chunkPerformers.length > 0 && chunkPerformers.map((arr: any, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              {arr.length > 0 && arr.map((p) => <PerformerCard countries={countries} performer={p} key={p._id} />)}
            </div>
          ))}
      </div>
    );
  }
}

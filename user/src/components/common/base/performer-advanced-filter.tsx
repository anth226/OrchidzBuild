import { PureComponent } from 'react';
import {
  Input, Button, Select
} from 'antd';
import { omit } from 'lodash';
import { ArrowUpOutlined, ArrowDownOutlined, FilterOutlined } from '@ant-design/icons';
import { ICountry, IBody } from '@interfaces/index';

interface IProps {
  onSubmit: Function;
  countries: ICountry[];
  bodyInfo: IBody;
}

export class PerformerAdvancedFilter extends PureComponent<IProps> {
  state = {
    showMore: false
  };

  handleSubmit() {
    const { onSubmit } = this.props;
    onSubmit(omit(this.state, ['showMore']));
  }

  render() {
    const { countries, bodyInfo } = this.props;
    const { showMore } = this.state;
    const {
      heights = [], weights = [], bodyTypes = [], genders = [], sexualOrientations = [], ethnicities = [],
      hairs = [], eyes = [], butts = [], ages = []
    } = bodyInfo;

    return (
      <div style={{ width: '100%' }}>
        <div className="filter-block custom">
          <div className="filter-item custom">
            <Input
              placeholder="Enter keyword"
              className="bg-secoundaryColor"
              onChange={(evt) => this.setState({ q: evt.target.value })}
              onPressEnter={this.handleSubmit.bind(this)}
            />
          </div>
          <div className="filter-item">
            <Select className="" style={{ width: '100%' }} defaultValue="live" onChange={(val) => this.setState({ sortBy: val }, () => this.handleSubmit())}>
              <Select.Option value="" disabled>
                <div className="text-primaryColor">

                  <FilterOutlined />
                  {' '}
                  Sort By
                </div>

              </Select.Option>
              <Select.Option value="popular">
                <div className="text-primaryColor">
                  Popular
                </div>

              </Select.Option>
              <Select.Option label="" value="latest">
                <div className="text-primaryColor">
                  Latest
                </div>

              </Select.Option>
              <Select.Option value="oldest">
                <div className="text-primaryColor">
                  Oldest
                </div>

              </Select.Option>
              <Select.Option value="online">
                <div className="text-primaryColor">
                  Online
                </div>

              </Select.Option>
              <Select.Option value="live">
                <div className="text-primaryColor">
                  Live
                </div>

              </Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <Button
              className="primary"
              style={{ width: '100%' }}
              onClick={() => this.setState({ showMore: !showMore })}
            >
              Advanced search
              {' '}
              {showMore ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </Button>
          </div>
        </div>
        <div className={!showMore ? 'filter-block hide' : 'filter-block custom'}>
          <div className="filter-item">
            <Select
              // eslint-disable-next-line no-nested-ternary
              onChange={(val: any) => this.setState({ isFreeSubscription: val === 'false' ? false : val === 'true' ? true : '' }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All subscriptions
                </div>

              </Select.Option>
              <Select.Option key="false" value="false">
                <div className="text-primaryColor">

                  Non-free subscription
                </div>

              </Select.Option>
              <Select.Option key="true" value="true">
                <div className="text-primaryColor">

                  Free subscription
                </div>

              </Select.Option>
            </Select>
          </div>
          {countries && countries.length > 0 && (
            <div className="filter-item">
              <Select
                onChange={(val) => this.setState({ country: val }, () => this.handleSubmit())}
                style={{ width: '100%' }}
                placeholder="Countries"
                defaultValue=""
                showSearch
                optionFilterProp="label"
              >
                <Select.Option key="All" label="" value="">
                  <div className="text-primaryColor">

                    All countries
                  </div>

                </Select.Option>
                {countries.map((c) => (
                  <Select.Option key={c.code} label={c.name} value={c.code}>
                    <div className="text-primaryColor">

                      <img alt="flag" src={c.flag} width="25px" />
                      &nbsp;
                      {c.name}
                    </div>

                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ gender: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All genders
                </div>

              </Select.Option>
              {genders.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ sexualOrientation: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All sexual orientations
                </div>

              </Select.Option>
              {sexualOrientations.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ age: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Age"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All ages
                </div>

              </Select.Option>
              {ages.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ eyes: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Eye color"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All eye colors
                </div>

              </Select.Option>
              {eyes.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ hair: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Hair color"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All hair colors
                </div>

              </Select.Option>
              {hairs.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ butt: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Butt size"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All butt size
                </div>

              </Select.Option>
              {butts.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ height: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Height"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All heights
                </div>

              </Select.Option>
              {heights.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ weight: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Weight"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All weights
                </div>

              </Select.Option>
              {weights.map((i) => (
                <Select.Option key={i.text} value={i.text}>
                  <div className="text-primaryColor">

                    {i.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ ethnicity: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Ethnicity"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All ethnicities
                </div>

              </Select.Option>
              {ethnicities.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onChange={(val) => this.setState({ bodyType: val }, () => this.handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Body type"
              defaultValue=""
            >
              <Select.Option key="all" value="">
                <div className="text-primaryColor">

                  All body types
                </div>

              </Select.Option>
              {bodyTypes.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  <div className="text-primaryColor">

                    {s.text}
                  </div>

                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
// import { Carousel, Image } from 'antd';
// import Carousel from 'react-spring-3d-carousel';
import Image from 'next/image';
import Carousel from '@components/Carousel/Carousel';

interface IProps {
  banners?: any;
}

export class Banner extends PureComponent<IProps> {
  render() {
    const { banners } = this.props;

    const imagesItems = [
      <img width={200} className="h-full w-full" src="https://picsum.photos/100/800/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/200/800/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/800/200/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/400/800/?random" alt="teste" />,
      <img width={200} className="h-full w-full" src="https://picsum.photos/800/400/?random" alt="teste" />,
    ];
    
    return (
      <>
        {/* <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
        {banners.map((item) => (
          <div key={item._id} className="hidden duration-700 ease-in-out" data-carousel-item>
            <img className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src={item?.photo?.url} alt="banner" />
            <h1>{item?.photo?.url}</h1>
          </div>
        ))} */}
        <div className="flex flex-col items-center justify-center w-full ">
        <Carousel items={imagesItems} />
        </div>
      </>

    );
  }
}

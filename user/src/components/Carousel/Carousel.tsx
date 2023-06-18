import React, { useState } from 'react';

import { IoIosArrowBack } from 'react-icons/io';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import CarouselItem from './CarouselItem';
import CarouselIndicator from './CarouselIndicator';

export interface CarouselProps {
    width?: number;
    height?: number;
    items: React.ReactNode[];
}

export default function Carousel({ width, height, items }: CarouselProps) {
    const [activeIndex, setActiveIndex] = useState<number>(Math.round(items.length / 2));

    function handleNextItemBtn() {
        setActiveIndex((prev) => {
            return prev + 1 < items.length ? prev + 1 : prev;
        });
    }

    function handlePrevItemBtn() {
        setActiveIndex((prev) => {
            return prev - 1 >= 0 ? prev - 1 : prev;
        });
    }

    return (
        <div className="w-full flex justify-center items-center">
            <div className="carousel-container ">
                <button
                    className="carousel-btn-switch-card-left carousel-btn-switch-card"
                    onClick={handleNextItemBtn}
                    disabled={activeIndex === items.length - 1}
                >
                    <FaAngleRight
                        style={{ transform: 'rotate(180deg)' }} />
                </button>
                {items?.map((item, index) => (
                    <CarouselItem key={index} index={index} activeIndex={activeIndex}>
                        {item}
                    </CarouselItem>
                ))}
                <button
                    className="carousel-btn-switch-card-right carousel-btn-switch-card"
                    onClick={handlePrevItemBtn}
                    disabled={activeIndex === 0}
                >
                    <FaAngleLeft
                        style={{ transform: 'rotate(180deg)' }} />
                </button>

                <CarouselIndicator
                    activeIndex={activeIndex}
                    length={items.length}
                    onSetActiveIndex={(_activeIndex) => {
                        setActiveIndex(_activeIndex);
                    }}
                />
            </div>
        </div>
    );
}
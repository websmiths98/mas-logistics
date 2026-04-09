"use client";
import React, { createContext } from "react";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}


type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  return (
    <div className="relative w-full py-16 flex justify-center">
      <div className="card-stack flex flex-row items-center justify-center">
        {items.map((item, index) => (
          <div key={"stacked-card-" + index} className="stacked-card">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};



/**
 * Card — now a pure flip-card container.
 * No click-to-expand popup. The content prop (ServiceCard) handles
 * its own hover-flip with full 3-D effect.
 */
export const Card = ({
  card,
  index,
}: {
  card: Card;
  index: number;
}) => {
  return (
    <div className="relative w-[240px] h-[340px] z-10 transition-all duration-300">
      {card.content}
    </div>
  );
};

export { type Card as CardType };

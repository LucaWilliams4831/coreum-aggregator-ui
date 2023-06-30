import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
const OwlCarousel = dynamic(import('react-owl-carousel3'));

const options = {
  loop: true,
  margin: 0,
  nav: false,
  mouseDrag: false,
  dots: false,
  autoplay: true,

  autoplaySpeed: 2000,
  autoplayTimeout: 3100,
  autoplayHoverPause: false,

  responsive: {
    0: {
      items: 1,
    },
    576: {
      items: 3,
    },
    768: {
      items: 3,
    },
    992: {
      items: 4,
    },
  },
};

interface ApiData {
  id:string;
  name: string;
  symbol:string;
  current_price:number;
  price_change_percentage_24h:number;
}

const TopHeader = () => {
  const [newData, setnewData] = useState<ApiData[]>([]);
  const [display, setDisplay] = useState(false);
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
    setDisplay(true);
    setisMounted(false);
  }, []);

  useEffect(() => {
    const getCoins = async () => {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      setnewData(data);
    };
    getCoins();
  }, []);

  return (
    <>
      <div className='value-trade-area'>
        <div className='container'>
          <div className='value-trade-slides'>
            {display ? (
              <OwlCarousel
                {...options}
              >
                {newData &&
                  newData.length > 0 &&
                  newData.slice(0, 20).map((data) => (
                    <div className='single-value-trade-box' key={data.id}>
                      <p>
                        <span className='crypto-name'>
                          {data.name}/{data.symbol}
                        </span>
                        <span className='price'>{data.current_price}</span>
                        {data.price_change_percentage_24h < 0 ? (
                          <span className='trending down'>
                            <i className='fas fa-caret-down'></i> -
                            {data.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        ) : (
                          <span className='trending up'>
                            <i className='fas fa-caret-up'></i> +
                            {data.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
              </OwlCarousel>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeader;

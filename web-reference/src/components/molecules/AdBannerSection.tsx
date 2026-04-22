import { useEffect, useState } from 'react';

const BANNERS = [
  '/main/banners/banner1.jpg',
  '/main/banners/banner2.jpg',
  '/main/banners/banner3.jpg',
];

export default function AdBannerSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='main-ad-banner'>
      <img
        src={BANNERS[activeIndex]}
        alt='광고 배너'
        className='main-ad-banner__image'
        fetchPriority='high'
      />
    </div>
  );
}

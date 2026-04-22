import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/atoms/Skeleton';
import { getWeather, type GetWeatherRes } from '@/api/weather';

export default function WeatherComponent() {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<GetWeatherRes | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  /**
   * 날씨 데이터 불러오기
   */
  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      const res = await getWeather();
      setWeatherData(res);
      setIsError(false);
    } catch (e) {
      console.error('WeatherComponent.tsx::fetch weather data', e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 날씨 데이터 포맷팅
   */
  const hour = new Date().getHours();
  const temp = Math.round(weatherData?.temperature ?? 0);
  const tMin = Math.round(weatherData?.minTemperature ?? 0);
  const tMax = Math.round(weatherData?.maxTemperature ?? 0);
  const feelsLike = Math.round(weatherData?.feelsLike ?? temp);
  const humidity = Math.round(weatherData?.humidity ?? 0);
  const pm10Cat = weatherData?.pm10Category ?? '-';
  const pm25Cat = weatherData?.pm2_5Category ?? '-';
  const icon = weatherData?.weatherIcon ?? '/placeholder-weather.png';
  const location = weatherData?.location;

  return (
    <section className='px-6 py-4 rounded-xl flex flex-col gap-3 border-2 border-grey-05 bg-white'>
      {isError ? (
        <>
          <span className='text-title02 text-mju-primary text-center'>문제가 발생했습니다</span>
          <button
            className='px-3 py-2 self-center text-caption01 cursor-pointer hover:bg-grey-05 rounded-xl transition'
            onClick={fetchWeatherData}
          >
            다시 시도하기
          </button>
        </>
      ) : isLoading ? (
        <>
          <Skeleton />
          <Skeleton className='h-22' />
          <Skeleton />
        </>
      ) : (
        <>
          <p className='text-mju-primary text-title02'>{`${location}날씨 ${hour}시`} </p>
          <div className='flex items-center gap-3'>
            <img src={icon} alt='날씨 아이콘' className='w-20 h-20 rounded-xl object-cover' />
            <div className='flex flex-col gap-2'>
              <p className='text-heading02 text-black'>{temp}°C</p>
              <p className='text-body03 text-grey-40'>{`${tMin}°C | ${tMax}°C`}</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <div className='flex gap-1'>
              <span className='text-caption01 text-black'>체감 온도</span>
              <span className='text-caption02 text-grey-40'>{feelsLike}°C</span>
            </div>
            <div className='flex gap-1'>
              <span className='text-caption01 text-black'>습도</span>
              <span className='text-caption02 text-grey-40'>{humidity}%</span>
            </div>
            <div className='flex gap-1'>
              <span className='text-caption01 text-black'>미세먼지</span>
              <span className='text-caption02 text-grey-40'>{pm10Cat}</span>
            </div>
            <div className='flex gap-1'>
              <span className='text-caption01 text-black'>초미세먼지</span>
              <span className='text-caption02 text-grey-40'>{pm25Cat}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

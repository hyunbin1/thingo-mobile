import MainSearchSection from '@/components/molecules/MainSearchSection';
import AdBannerSection from '@/components/molecules/AdBannerSection';
import Footer from '@/components/organisms/Footer';

export default function Main() {
  return (
    <div className='w-full'>
      {/* 첫 화면: White(MainCarousel) + Grey(Banner) = 한 뷰포트, Footer는 스크롤 이후 노출 */}
      <section className='h-[calc(100svh-3.5rem)] w-full overflow-hidden'>
        <div className='flex h-full min-h-0 flex-col'>
          {/* White: MainCarousel 영역 (인디케이터는 이 영역 맨 아래에 absolute 고정) */}
          <div className='min-h-[420px] flex-1 overflow-y-auto bg-white'>
            <div className='h-full w-full overflow-hidden'>
              <MainSearchSection key='search' />
            </div>
          </div>

          {/* Grey: AdBanner 영역 (항상 첫 화면 하단에 고정, 양옆 여백 없이 전체 폭 사용) */}
          <div className='w-full shrink-0'>
            <AdBannerSection />
          </div>
        </div>
      </section>

      {/* Blue: Footer 영역 (첫 화면 아래에서 스크롤 시 노출) */}
      <Footer />
    </div>
  );
}

import { clsx, type ClassValue } from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import { twMerge } from 'tailwind-merge';

import { MapPin } from '@/components/atoms/map-pin';
import { MAP_DATA, type Building } from '@/constants/map';
import { BUILDING_HIGHLIGHT_MAP, BUILDING_PINS, ENTRANCE_PINS } from '@/constants/map-pins';
import MapSidebar from './map-sidebar';

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 명지도 컴포넌트
 */
const CampusMap = ({ isActive }: { isActive?: boolean }) => {
  // 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 지도 초기화 완료 상태 관리
  const [isMapReady, setIsMapReady] = useState(false);
  // 바텀시트 확장 상태
  const [isExpanded, setIsExpanded] = useState(false);
  // 현재 선택된 출입구 핀의 ID
  const [selectedEntranceId, setSelectedEntranceId] = useState<string | null>(null);
  // 드래그 시작 Y좌표
  const dragStartY = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinchZoomRef = useRef<any>(null);
  // 스크롤바 관련 참조
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  // 현재 변환 상태 저장 (스크롤바 동기화용)
  const currentTransform = useRef({ x: 0, y: 0, scale: 1 });

  // 초기 줌 설정 함수
  const setInitialZoom = useCallback(() => {
    if (pinchZoomRef.current) {
      console.log('Setting initial zoom');
      // 레이아웃이 안정화될 때까지 잠시 대기 후 설정
      setTimeout(() => {
        pinchZoomRef.current.scaleTo({
          x: 200,
          y: 100,
          scale: 2.8,
          animated: false,
        });
        // 줌 설정이 완료되면 지도를 보이게 처리
        setIsMapReady(true);
      }, 50);
    }
  }, []);

  // 컴포넌트 마운트 및 이미지 로드 시 초기 배율 설정
  useEffect(() => {
    // 이미지가 이미 로드된 경우 즉시 설정
    if (imgRef.current?.complete) {
      setInitialZoom();
    }
  }, [setInitialZoom]);

  const onUpdate = useCallback(({ x, y, scale }: { x: number; y: number; scale: number }) => {
    currentTransform.current = { x, y, scale };
    if (mapRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      mapRef.current.style.setProperty('transform', value);
    }

    // 스크롤바 동기화 로직
    if (thumbRef.current && trackRef.current && imgRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      const containerWidth = containerRect.width;
      const contentWidth = imgRect.width;
      const trackWidth = trackRef.current.offsetWidth;

      if (contentWidth > containerWidth + 0.5) {
        // 실제 화면에서의 물리적 거리 차이 계산
        const currentPullX = containerRect.left - imgRect.left;
        const maxPullX = contentWidth - containerWidth;
        const progress = Math.min(Math.max(currentPullX / maxPullX, 0), 1);

        // 썸네일 너비 계산 (컨테이너 대비 비율 적용, 최소 40px)
        const thumbWidth = Math.max((containerWidth / contentWidth) * trackWidth, 40);
        thumbRef.current.style.width = `${thumbWidth}px`;

        const maxMove = trackWidth - thumbWidth;
        thumbRef.current.style.transform = `translateX(${progress * maxMove}px)`;
        trackRef.current.style.opacity = '1';
        trackRef.current.style.pointerEvents = 'auto';
      } else {
        trackRef.current.style.opacity = '0';
        trackRef.current.style.pointerEvents = 'none';
      }
    }
  }, []);

  // 스크롤바 클릭 및 드래그 핸들러
  const handleTrackInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!trackRef.current || !imgRef.current || !pinchZoomRef.current || !containerRef.current)
      return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX =
      'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;

    const thumbWidth = thumbRef.current?.offsetWidth || 0;
    // 클릭한 지점이 썸네일의 중앙이 되도록 progress 계산
    const progress = Math.min(
      Math.max((clientX - rect.left - thumbWidth / 2) / (rect.width - thumbWidth), 0),
      1,
    );

    const { scale, y } = currentTransform.current;
    if (!containerRef.current || !imgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();
    const contentSize = imgRect.width;
    const containerSize = containerRect.width;
    const maxScroll = contentSize - containerSize;

    if (maxScroll > 0) {
      pinchZoomRef.current.scaleTo({
        x: -progress * maxScroll,
        y: y,
        scale: scale,
        animated: true,
      });
    }
  }, []);

  // 선택된 건물 정보 상태 관리
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // 건물 선택 핸들러
  const handleBuildingSelect = useCallback((building: Building | null) => {
    setSelectedBuilding(building);
    setIsSidebarOpen(false);
    // 건물 선택 시에는 확장(상세정보 보기), 캠퍼스 선택 시에는 peek 상태로 유지
    if (building) {
      setIsExpanded(true);
      // 'f-2'(캠퍼스 출입구) 카테고리가 아닌 일반 건물이면 출입구 선택 상태 초기화
      if (building.id !== 'f-2') {
        setSelectedEntranceId(null);
      }
    } else {
      setIsExpanded(false);
      setSelectedEntranceId(null);
    }

    // 활성화된 핀들의 중심 좌표로 지도 이동
    if (building && pinchZoomRef.current && imgRef.current) {
      const pinIds = BUILDING_HIGHLIGHT_MAP[building.id] ?? [];
      if (pinIds.length === 0) return;

      // 1. 모든 활성 핀(건물 + 출입구)의 좌표 수집
      const pinsToHighlight = [
        ...BUILDING_PINS.filter((p) => pinIds.includes(p.id)),
        ...ENTRANCE_PINS.filter((p) => pinIds.includes(p.id)),
      ];

      if (pinsToHighlight.length === 0) return;

      // 2. 출입구 핀이 포함된 경우, 첫 번째 출입구를 대표 선택 상태로 (개별 강조용)
      const firstEntrance = ENTRANCE_PINS.find((p) => pinIds.includes(p.id));
      if (firstEntrance) {
        setSelectedEntranceId(firstEntrance.id);
      }

      // 3. 모든 활성 핀의 중심점 계산
      const img = imgRef.current;
      const avgLeft = pinsToHighlight.reduce((acc, p) => acc + p.left, 0) / pinsToHighlight.length;
      const avgTop = pinsToHighlight.reduce((acc, p) => acc + p.top, 0) / pinsToHighlight.length;

      const cx = img.offsetWidth * (avgLeft / 100);
      const cy = img.offsetHeight * (avgTop / 100);

      pinchZoomRef.current.alignCenter({
        x: cx,
        y: cy,
        scale: 3,
        animated: true,
      });
    }
  }, []);

  // 핀 클릭 핸들러 (이동 + 정보 표시)
  const handlePinClick = useCallback(
    (pin: (typeof BUILDING_PINS)[number]) => {
      // 1. 해당 건물 데이터 찾기
      const building =
        'targetId' in pin
          ? MAP_DATA.campuses[0].buildings.find((b) => b.id === pin.targetId)
          : null;

      // 2. 정보 표시 및 바텀시트 확장
      handleBuildingSelect(building || null);

      // 3. 지도 이동 로직
      // alignCenter(x, y, scale): (x, y) 위치를 화면 정중앙으로 이동시키는 API
      // x, y = 이미지 내 레이아웃 픽셀 좌표 (CSS 기준, scale 1일 때의 좌표)
      if (pinchZoomRef.current && imgRef.current) {
        const img = imgRef.current;
        const iw = img.offsetWidth;
        const ih = img.offsetHeight;

        // 핀의 이미지 내 절대 픽셀 좌표 (leayout 기준, scale=1)
        const cx = iw * (pin.left / 100);
        const cy = ih * (pin.top / 100);

        pinchZoomRef.current.alignCenter({
          x: cx,
          y: cy,
          scale: 3,
          animated: true,
        });
      }
    },
    [handleBuildingSelect],
  );

  // 출입구 핀 클릭 핸들러 (ID를 인자로 받아 해당 핀 활성화)
  const handleEntrancePinClick = useCallback(
    (pinId: string) => {
      setSelectedEntranceId(pinId);
      const entranceBuilding = MAP_DATA.campuses[0].buildings.find((b) => b.id === 'f-2');
      handleBuildingSelect(entranceBuilding || null);
    },
    [handleBuildingSelect],
  );

  // 선택된 항목 기반으로 강조할 핀 ID 목록 계산
  const activePinIds: string[] = selectedBuilding
    ? (BUILDING_HIGHLIGHT_MAP[selectedBuilding.id] ?? [])
    : [];

  // 표시할 건물 정보 (기본값 설정 - 인문캠퍼스)
  const displayInfo: Building =
    (selectedBuilding as Building) ||
    ({
      id: 'campus-humane',
      name: '인문캠퍼스',
      category: '캠퍼스',
      subItems: [],
    } as unknown as Building);

  // 탭이 변경되어 비활성화될 때 사이드바 닫기
  useEffect(() => {
    if (!isActive) {
      setIsSidebarOpen(false);
    }
  }, [isActive]);

  return (
    <div className='relative h-full overflow-hidden bg-white'>
      {/* 지도 이미지 영역 (줌/팬 지원) */}
      <div
        ref={containerRef}
        className='swiper-no-swiping absolute inset-x-0 top-0 bottom-[210px] z-0 overflow-hidden'
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <QuickPinchZoom
          ref={pinchZoomRef}
          onUpdate={onUpdate}
          wheelScaleFactor={200}
          draggableUnZoomed={true}
          containerProps={{ className: 'h-full w-full' }}
          enforceBoundsDuringZoom={false}
          tapZoomFactor={2}
          inertia={true}
          // Ctrl 키 없이도 마우스 휠만으로 확대/축소 허용
          shouldInterceptWheel={() => false}
        >
          <div
            ref={mapRef}
            style={{ transformOrigin: '0 0' }}
            className={cn(
              'relative h-fit w-fit transition-opacity duration-300 will-change-transform',
              isMapReady ? 'opacity-100' : 'opacity-0',
            )}
          >
            <img
              ref={imgRef}
              src='/img/school_map.png'
              alt='명지대학교 캠퍼스 지도'
              className='pointer-events-none block h-[calc(100dvh-99px)] w-auto max-w-none'
              onLoad={() => {
                setInitialZoom();
              }}
            />

            {/* 건물 번호 핀 */}
            {BUILDING_PINS.map((pin) => {
              // activePinIds에 포함된 핀은 물방울형(large)으로, 나머지는 원형(small)으로 표시
              const isActive = activePinIds.length === 0 || activePinIds.includes(pin.id);
              return (
                <div
                  key={pin.id}
                  className='absolute -translate-x-1/2 -translate-y-1/2'
                  style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
                >
                  <MapPin
                    size={isActive && activePinIds.length > 0 ? 'large' : 'small'}
                    variant='number'
                    value={pin.value}
                    onClick={() => handlePinClick(pin)}
                  />
                </div>
              );
            })}

            {/* 출입구 핀 */}
            {ENTRANCE_PINS.map((pin) => (
              <div
                key={pin.id}
                className='absolute -translate-x-1/2 -translate-y-1/2'
                style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
              >
                <MapPin
                  size={
                    activePinIds.includes(pin.id) || selectedEntranceId === pin.id
                      ? 'large'
                      : 'small'
                  }
                  variant={
                    activePinIds.includes(pin.id) || selectedEntranceId === pin.id
                      ? 'default'
                      : 'icon'
                  }
                  onClick={() => handleEntrancePinClick(pin.id)}
                />
              </div>
            ))}
          </div>
        </QuickPinchZoom>
      </div>

      {/* 지도 연동형 수평 스크롤바 */}
      <div
        ref={trackRef}
        onClick={handleTrackInteraction}
        onTouchMove={handleTrackInteraction}
        className={cn(
          'absolute bottom-[225px] left-1/2 z-20 h-1.5 w-[80%] -translate-x-1/2 overflow-hidden rounded-[15px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.20)] transition-opacity duration-300',
          isExpanded ? 'pointer-events-none opacity-0' : 'opacity-0', // 초기에는 숨김, contentWidth > containerWidth일 때 onUpdate에서 보이게 함
        )}
      >
        <div
          ref={thumbRef}
          className='bg-grey-40 h-full rounded-full transition-transform duration-75 ease-out'
        />
      </div>

      {/* 커스텀 바텀시트 */}
      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 z-[100] flex flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-4px_8px_rgba(23,23,27,0.14)]',
          'touch-pan-x transition-[height] duration-300 ease-in-out',
        )}
        style={{ height: isExpanded ? '70%' : '210px' }}
        onTouchStart={(e) => {
          dragStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          if (dragStartY.current === null) return;
          const diff = dragStartY.current - e.changedTouches[0].clientY;
          // 위로 50px 이상 드래그 → 확장, 아래로 50px 이상 드래그 → 축소
          if (diff > 50) setIsExpanded(true);
          else if (diff < -50) setIsExpanded(false);
          dragStartY.current = null;
        }}
      >
        {/* 상단 드래그 핸들 및 클릭 시 토글 영역 */}
        <div className='cursor-pointer px-5 pt-4 pb-0' onClick={() => setIsExpanded((v) => !v)}>
          <div className='bg-grey-10 mx-auto mb-4 h-1 w-10 shrink-0 rounded-full' />

          {/* 메인 정보 */}
          <div className='mb-4 flex shrink-0 items-center gap-[14px]'>
            <div className='border-blue-20 bg-blue-15 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border'>
              <img
                src={
                  displayInfo.category === '건물'
                    ? '/img/building-icon.png'
                    : displayInfo.category === '편의시설'
                      ? '/img/shop-icon.png'
                      : '/img/school-icon.png'
                }
                alt='카테고리 아이콘'
                className='h-7 w-7 object-contain'
              />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-body05 text-grey-40 leading-tight'>
                {displayInfo.category || '캠퍼스'}
              </span>
              <h1 className='text-title02 leading-tight font-semibold text-black'>
                {displayInfo.name}
              </h1>
            </div>
          </div>

          {/* S1~S4 정보 블록 (항상 표시) */}
          <>
            {/* 구분선 */}
            <div className='bg-grey-02 mb-4 h-px w-full shrink-0' />
            <div className='mb-6 flex gap-2'>
              {[
                { label: '캠퍼스', value: 'S' },
                { label: '건물', value: '1~10' },
                { label: '층', value: '3' },
                { label: '강의실', value: '01~' },
              ].map((item, idx) => (
                <div key={idx} className='flex flex-col items-center gap-1.5'>
                  <div className='bg-blue-05 text-title02 flex h-[38px] min-w-[50px] items-center justify-center px-2'>
                    {item.value}
                  </div>
                  <span className='text-body05 text-grey-40'>{item.label}</span>
                </div>
              ))}
            </div>
          </>

          {/* 편의시설 등 다른 카테고리일 때의 구분선 */}
          {selectedBuilding && selectedBuilding.category !== '건물' && (
            <div className='bg-grey-02 mb-4 h-px w-full shrink-0' />
          )}
        </div>

        {/* 상세 정보 리스트 - 건물/시설 선택 시 & 확장 시에만 표시 */}
        {selectedBuilding && (
          <div
            className={cn(
              'no-scrollbar flex-1 resize-none overflow-y-auto px-5 transition-opacity duration-300',
              !isExpanded ? 'pointer-events-none opacity-0' : 'opacity-100',
            )}
          >
            {/* 상세 정보 리스트  */}
            <div className='grid grid-cols-[max-content_1fr] gap-x-4 gap-y-5 pb-12'>
              {displayInfo.subItems?.map((info, idx) => (
                <div key={idx} className='contents'>
                  <div className='flex items-start gap-1 pt-0.5'>
                    <span className='text-body02 text-blue-35 font-bold'>{info.location}</span>
                    <div className='bg-blue-15 mt-4 h-[10px] w-[1px] rotate-45' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-body03 text-black'>{info.name}</span>
                    {info.description && (
                      <span className='text-grey-40 text-[10px]'>{info.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 지도 목록 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className='absolute top-2 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all active:scale-95'
        aria-label='건물 목록 열기'
      >
        <img src='/img/mapIcon.png' alt='지도 아이콘' className='h-7 w-7' />
      </button>

      {/* 사이드바 (Portal 사용으로 Swiper 스택 탈출) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <MapSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onBuildingSelect={handleBuildingSelect}
            selectedBuildingId={selectedBuilding?.id}
          />,
          document.body,
        )}
    </div>
  );
};

export default CampusMap;

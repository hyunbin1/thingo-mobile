import { MAP_DATA, type Building, type BuildingCategory } from '@/constants/map';
import { clsx, type ClassValue } from 'clsx';
import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SidebarSection = BuildingCategory | 'CAMPUS';

type MapSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onBuildingSelect?: (building: Building | null) => void;
  selectedBuildingId?: string;
};

const CATEGORY_ORDER: BuildingCategory[] = ['건물', '캠퍼스 시설', '편의시설', '기타'];

/**
 * 지도 사이드바 컴포넌트
 */
const MapSidebar = ({ isOpen, onClose, onBuildingSelect, selectedBuildingId }: MapSidebarProps) => {
  // 현재 첫 번째 캠퍼스 데이터를 명시적으로 사용
  const currentCampusData = MAP_DATA.campuses[0];
  const selectedCampus = currentCampusData.name;

  // 확장된 카테고리를 관리하는 상태
  const [expandedCategories, setExpandedCategories] = useState<Set<SidebarSection>>(
    new Set(['CAMPUS', '건물']),
  );

  // 선택된 캠퍼스의 건물들을 카테고리별로 그룹화 (최적화)
  const buildingsByCategory = useMemo(() => {
    return currentCampusData.buildings.reduce(
      (acc, building) => {
        if (!acc[building.category]) {
          acc[building.category] = [];
        }
        acc[building.category].push(building);
        return acc;
      },
      {} as Record<BuildingCategory, Building[]>,
    );
  }, [currentCampusData.buildings]);

  // 카테고리 토글 핸들러
  const toggleCategory = (category: SidebarSection) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // 건물 선택 핸들러
  const handleBuildingClick = (building: Building) => {
    onBuildingSelect?.(building);
    onClose();
  };

  // 캠퍼스 선택 핸들러 (선택 해제)
  const handleCampusClick = () => {
    onBuildingSelect?.(null);
    onClose();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className='fixed top-[99px] right-0 bottom-0 left-0 z-[1001] bg-black/50'
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-[99px] right-0 bottom-0 z-[1002] flex w-[280px] transform flex-col bg-white shadow-xl transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className='flex items-center justify-end p-4'>
          <button
            onClick={onClose}
            className='text-grey-40 hover:text-grey-60 transition-colors'
            aria-label='사이드바 닫기'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M18 6L6 18M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        {/* 컨텐츠 영역 (스크롤 가능) */}
        <div className='no-scrollbar flex-1 overflow-y-auto pb-[300px]'>
          {/* 섹션 목록 */}
          <div className='flex-1 space-y-0'>
            {/* 캠퍼스 섹션 */}
            <div key='campus-section' className='border-grey-02 border-b py-6'>
              <div
                className='flex cursor-pointer items-center justify-between px-5'
                onClick={() => toggleCategory('CAMPUS')}
              >
                <h2 className='text-body02 text-mju-primary font-bold'>{MAP_DATA.titles.CAMPUS}</h2>
                <div className='text-grey-30 p-2'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    style={{
                      transform: expandedCategories.has('CAMPUS')
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <path
                      d='M6 9L12 15L18 9'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </div>
              {expandedCategories.has('CAMPUS') && (
                <div className='mt-1 space-y-1'>
                  <button
                    onClick={handleCampusClick}
                    className={cn(
                      'text-body05 flex w-full items-center px-8 py-4 text-left transition-all',
                      !selectedBuildingId
                        ? 'bg-blue-05 text-mju-primary font-bold'
                        : 'hover:bg-blue-02',
                    )}
                  >
                    {selectedCampus}
                  </button>
                </div>
              )}
            </div>

            {/* 건물 카테고리별 섹션 */}
            {CATEGORY_ORDER.map((category) => {
              const buildings = buildingsByCategory[category];
              if (!buildings || buildings.length === 0) return null;

              return (
                <div key={category} className='border-grey-02 border-b py-6'>
                  <div
                    className='flex cursor-pointer items-center justify-between px-5'
                    onClick={() => toggleCategory(category)}
                  >
                    <h2 className='text-body02 text-mju-primary font-bold'>{category}</h2>
                    <div className='text-grey-30 p-2'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                          transform: expandedCategories.has(category)
                            ? 'rotate(0deg)'
                            : 'rotate(-90deg)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        <path
                          d='M6 9L12 15L18 9'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                  </div>

                  {/* 건물 목록 */}
                  {expandedCategories.has(category) && (
                    <div className='mt-1 space-y-1'>
                      {buildings.map((building) => {
                        const isSelected = selectedBuildingId === building.id;
                        return (
                          <button
                            key={building.id}
                            onClick={() => handleBuildingClick(building)}
                            className={cn(
                              'text-body05 flex w-full items-center justify-between px-8 py-4 text-left transition-all',
                              isSelected ? 'bg-blue-05' : 'hover:bg-blue-02',
                            )}
                          >
                            <span>{building.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapSidebar;

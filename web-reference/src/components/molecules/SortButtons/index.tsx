export type Sort = 'relevance' | 'latest' | 'oldest';

interface SortButtonsProps {
  sort: Sort;
  onSortChange: (sort: Sort) => void;
}

const sortOptions = [
  { label: '추천순', value: 'relevance' },
  { label: '최신순', value: 'latest' },
  { label: '오래된순', value: 'oldest' },
];

export default function SortButtons({ sort, onSortChange }: SortButtonsProps) {
  return (
    <div className='text-caption02 text-grey-20 flex w-full items-center gap-3'>
      {sortOptions.map((data, idx) => (
        <button
          key={idx}
          onClick={() => onSortChange(data.value as Sort)}
          className={`cursor-pointer ${sort === (data.value as Sort) ? 'text-grey-80' : 'text-grey-20'}`}
        >
          • {data.label}
        </button>
      ))}
    </div>
  );
}

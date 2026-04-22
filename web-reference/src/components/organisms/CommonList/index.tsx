import DetailItem, { type ListItemProps } from '../DetailItem/idex';
import { COMMON_LIST_ITEMS_PER_PAGE } from '@/constants/common';

interface NoticeListProps {
  items: ListItemProps[];
  category: 'notice' | 'news';
  page?: number;
  itemsPerPage?: number;
}

const CommonList = ({
  items,
  category,
  page = 1,
  itemsPerPage = COMMON_LIST_ITEMS_PER_PAGE,
}: NoticeListProps) => {
  return (
    <section className='flex flex-col'>
      {items.map((item, index) => (
        <DetailItem
          key={item.id}
          {...item}
          id={(page - 1) * itemsPerPage + index + 1}
          variant={category}
        />
      ))}
    </section>
  );
};

export default CommonList;

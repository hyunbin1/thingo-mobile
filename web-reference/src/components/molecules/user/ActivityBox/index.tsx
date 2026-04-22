import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

interface ActivityBoxProps {
  label: string;
  count: number;
  link: string;
}

const ActivityBox = ({ label, count, link }: ActivityBoxProps) => {
  return (
    <Link
      to={link}
      className='flex min-h-20 w-full flex-row items-center justify-between gap-2 rounded-lg bg-white px-6 py-4'
    >
      <p className='text-body04 text-grey-80 md:text-title03 flex items-center justify-between'>
        {label}
      </p>
      <div className='flex flex-row items-center gap-6'>
        <p className='text-body04 text-grey-40 md:text-title03'>{`${count}개`}</p>
        <IoIosArrowForward className='text-grey-30 h-5 w-5 md:h-5 md:w-5' />
      </div>
    </Link>
  );
};

export default ActivityBox;

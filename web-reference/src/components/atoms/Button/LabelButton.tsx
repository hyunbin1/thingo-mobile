import { IoIosArrowForward } from 'react-icons/io';

interface LabelButtonProps {
  label: string;
  onClick?: () => void;
  emphasized?: boolean; // 강조 여부
}
const LabelButton = ({ label, onClick, emphasized = false }: LabelButtonProps) => {
  const textClass = emphasized
    ? 'text-mju-primary text-base md:text-xl font-semibold'
    : 'text-black font-normal font-medium';
  const widthClass = emphasized ? 'w-20 md:w-36' : 'w-full';
  return (
    <button onClick={onClick} className={`${widthClass} flex items-center justify-between`}>
      <span className={`text-body06 md:text-base ${textClass}`}>{label}</span>
      <IoIosArrowForward className='text-grey-30 h-5 w-5 md:h-5 md:w-5' />
    </button>
  );
};

export default LabelButton;

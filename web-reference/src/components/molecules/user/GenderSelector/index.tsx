import Button from '../../../atoms/Button';

interface GenderOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: GenderOption[];
  selected: string;
  onSelect: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}
const GenderSelector = ({ options, selected, onSelect }: Props) => (
  <div>
    <div className='mb-3 flex items-center gap-4 md:gap-6'>
      <label className='text-grey-80 text-body04 text-md font-semibold md:w-auto md:text-xl'>
        성별
      </label>
    </div>
    <div className='flex justify-start gap-4'>
      {options.map((g) => (
        <Button
          type='button'
          key={g.value}
          size='sm'
          variant={selected === g.value ? 'main' : 'chip'}
          shape='rounded'
          fullWidth={false}
          onClick={() => onSelect(g.value)}
          className='h-10 flex-1 md:h-[48px] md:w-[120px]'
          disabled={false}
        >
          {g.label}
        </Button>
      ))}
    </div>
  </div>
);

export default GenderSelector;

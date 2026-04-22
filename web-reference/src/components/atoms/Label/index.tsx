interface LabelProps {
  lab: string;
  disabled: boolean;
}

const Label = ({ lab, disabled }: LabelProps) => {
  return (
    <div className='flex items-center gap-6'>
      <label
        className={`text-body04 font-semibold whitespace-nowrap ${
          disabled ? 'text-grey-40' : 'text-grey-80'
        }`}
      >
        {lab}
      </label>
    </div>
  );
};

export default Label;

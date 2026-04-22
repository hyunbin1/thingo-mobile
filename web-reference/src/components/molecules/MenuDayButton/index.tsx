import { Typography } from '../../atoms/Typography';

type MenuDayButtonProps = {
  label: string;
  focused?: boolean;
};

export default function MenuDayButton({ label, focused = false }: MenuDayButtonProps) {
  return (
    <div
      className={`flex items-center justify-center w-20 gap-3 rounded-xl ${
        focused ? 'bg-blue-35' : 'bg-blue-05'
      }`}
    >
      <Typography variant='title02' className={focused ? 'text-white' : 'text-blue-10'}>
        {label}
      </Typography>
    </div>
  );
}

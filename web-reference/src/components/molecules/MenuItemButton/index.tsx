import clsx from 'clsx';
import { Typography } from '../../atoms/Typography';

type MenuItemButtonProps = {
  time: string;
  menus: string[];
  focused?: boolean;
};

export default function MenuItemButton({ time, menus, focused }: MenuItemButtonProps) {
  return (
    <div
      className={clsx(
        'flex flex-col px-6 py-4 gap-3 rounded-lg border-2 border-grey-05',
        focused && 'bg-blue-05',
      )}
    >
      <Typography variant='body02' className='text-blue-35'>
        {time}
      </Typography>
      <hr
        className={clsx(
          'w-full h-[2px] rounded-full border-0',
          focused ? 'bg-blue-10' : 'bg-grey-05',
        )}
      />
      <div
        className={clsx(
          'w-full h-full',
          menus.length === 1 ? 'flex items-center justify-center' : 'grid grid-cols-2 gap-3',
        )}
      >
        {menus.map((menu, idx) => (
          <Typography key={idx} variant='body03'>
            {menu}
          </Typography>
        ))}
      </div>
    </div>
  );
}

import { Drawer as VaulDrawer } from 'vaul';
import type { ReactNode } from 'react';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  showHandle?: boolean;
}

export default function Drawer({
  open,
  onOpenChange,
  title,
  children,
  showHandle = true,
}: DrawerProps) {
  return (
    <VaulDrawer.Root open={open} onOpenChange={onOpenChange} handleOnly={!showHandle}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className='bg-bg fixed inset-0 z-40' />
        <VaulDrawer.Content className='fixed right-0 bottom-0 left-0 z-50 mt-24 flex max-h-[80vh] flex-col rounded-t-[10px] bg-white'>
          {/* 드래그 핸들 */}
          {showHandle && <div className='bg-grey-10 mx-auto mt-5 mb-3 h-1 w-10 rounded-full' />}

          {/* 제목 */}
          {title && (
            <div className='px-5 pt-6 pb-4'>
              <h2 className='text-body02 font-semibold text-black'>{title}</h2>
            </div>
          )}

          {/* 내용 */}
          <div className='flex-1 overflow-y-auto pb-6'>{children}</div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}

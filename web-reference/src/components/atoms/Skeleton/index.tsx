/**
 * 콘텐츠 로딩 중에 표시되는 UI 입니다
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`min-h-5 animate-pulse rounded-md bg-grey-05 ${className}`} {...props} />;
}

function SkeletonProfile({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center space-x-4 ${className}`} {...props}>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
}

function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-3 ${className}`} {...props}>
      <Skeleton className='h-[125px] w-[250px] rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonProfile, SkeletonCard };

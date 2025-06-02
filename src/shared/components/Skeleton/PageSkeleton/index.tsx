import { Skeleton } from '@/shared/components/ui/skeleton';

const PageSkeleton = () => {
  return (
    <div className="w-full">
      {/* header  */}
      <Skeleton className="mb-7 h-[32px] w-[400px]" />

      {/* body */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

export default PageSkeleton;

import { EmptyState } from "@/shared/ui/empty-states/empty-states";

export const NoticePage = (): React.ReactElement => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-16 md:px-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-10">
        <header>
          <h1 className="text-[32px] font-bold leading-tight text-gray-900">공지사항</h1>
        </header>
        <EmptyState
          variant="no-content"
          title="페이지 준비 중입니다"
          description="공지사항 페이지를 준비하고 있습니다."
          hasBackground
        />
      </div>
    </main>
  );
};

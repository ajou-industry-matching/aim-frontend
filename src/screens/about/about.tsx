import { EmptyState } from "@/shared/ui/empty-states/empty-states";

export const AboutPage = (): React.ReactElement => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-16 md:px-16">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-10">
        <header>
          <h1 className="text-[32px] font-bold leading-tight text-gray-900">소개</h1>
        </header>
        <EmptyState
          variant="no-content"
          title="페이지 준비 중입니다"
          description="AIM 서비스를 소개하는 페이지를 준비하고 있습니다."
          hasBackground
        />
      </div>
    </main>
  );
};

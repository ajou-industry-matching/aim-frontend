export const HomePage: React.FC = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white px-6 py-10 text-[var(--color-gray-900)]">
      <section className="mx-auto flex max-w-[720px] flex-col gap-4">
        <p className="text-[14px] font-medium text-[var(--color-primary-800)]">로그인 완료</p>
        <h1 className="text-[32px] font-bold leading-tight text-black">AIM AJOU Home</h1>
        <p className="text-[16px] leading-7 text-[var(--color-gray-700)]">
          Firebase 로그인과 백엔드 로그인 API 호출이 완료되었습니다.
        </p>
      </section>
    </main>
  );
};

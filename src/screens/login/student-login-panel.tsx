import { GoogleIcon } from "@/shared/ui/icons";
import { Loading } from "@/shared/ui/loading";

type StudentLoginPanelProps = {
  isSubmitting: boolean;
  onGoogleLoginClick: () => void;
};

export const StudentLoginPanel = ({
  isSubmitting,
  onGoogleLoginClick,
}: StudentLoginPanelProps): React.ReactElement => (
  <>
    <p className="mt-10 text-[14px] font-medium leading-[150%] tracking-[-0.025em] text-[var(--color-gray-500)] md:mt-[40px]">
      아주대학교 구성원(학생/교수)은 Google 계정으로 로그인하세요
    </p>
    <button
      type="button"
      onClick={onGoogleLoginClick}
      disabled={isSubmitting}
      className="mt-8 flex h-11 items-center justify-center gap-3 rounded-[4px] border border-[var(--color-gray-300)] bg-white px-5 text-[14px] font-medium text-[#4a4a4a] transition-colors duration-200 hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] disabled:cursor-wait disabled:opacity-70"
    >
      {isSubmitting ? <Loading size="small" /> : <GoogleIcon size={20} />}
      {isSubmitting ? "로그인 중..." : "Sign in with Google"}
    </button>
  </>
);

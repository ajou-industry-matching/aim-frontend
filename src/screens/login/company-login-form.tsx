import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input";
import { LockIcon, MailIcon } from "@/shared/ui/icons";

type CompanyLoginFormProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const CompanyLoginForm = ({
  email,
  password,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: CompanyLoginFormProps): React.ReactElement => (
  <form onSubmit={onSubmit} className="flex flex-col gap-2">
    <label htmlFor="login-email" className="text-[16px] font-medium leading-5 text-[#000000]">
      이메일
    </label>
    <Input
      id="login-email"
      type="email"
      value={email}
      onChange={(event) => onEmailChange(event.target.value)}
      disabled={isSubmitting}
      leftIcon={<MailIcon width={18} />}
      iconClassName="!text-[#000000] hover:!text-[#000000]"
      size="large"
      isFullWidth
      className="rounded-[4px] text-[14px] shadow-none"
    />

    <label
      htmlFor="login-password"
      className="mt-3 text-[16px] font-medium leading-5 text-[#000000]"
    >
      비밀번호
    </label>
    <Input
      id="login-password"
      type="password"
      value={password}
      onChange={(event) => onPasswordChange(event.target.value)}
      disabled={isSubmitting}
      leftIcon={<LockIcon width={18} />}
      iconClassName="!text-[#000000] hover:!text-[#000000]"
      size="large"
      isFullWidth
      className="rounded-[4px] text-[14px] shadow-none"
    />

    <Button
      type="submit"
      fullWidth
      size="large"
      isLoading={isSubmitting}
      className="mt-5 rounded-[4px] text-[14px] font-medium hover:scale-100 hover:shadow-none active:scale-100"
    >
      로그인
    </Button>
    <a
      href="#signup"
      className="mt-3 text-center text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-[#000000] hover:text-[var(--color-primary-800)]"
    >
      기업 계정이 없으신가요? 회원가입으로 이동하세요.
    </a>
  </form>
);

import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input";
import { AtSignIcon, BuildingIcon, LockIcon, MailIcon, UserIcon } from "@/shared/ui/icons";

export type CompanyAuthMode = "login" | "signup";

export type CompanySignupValues = {
  companyName: string;
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type CompanyLoginFormProps = {
  mode: CompanyAuthMode;
  email: string;
  password: string;
  signupValues: CompanySignupValues;
  isSubmitting: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSignupValueChange: (name: keyof CompanySignupValues, value: string) => void;
  onModeChange: (mode: CompanyAuthMode) => void;
  onLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignupSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const inputClassName = "rounded-[4px] text-[14px] shadow-none";
const signupInputClassName = "h-[44px] rounded-[4px] text-[14px] shadow-none md:h-12";
const iconClassName = "!text-[#8c8c8c] hover:!text-[#8c8c8c]";

export const CompanyLoginForm = ({
  mode,
  email,
  password,
  signupValues,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSignupValueChange,
  onModeChange,
  onLoginSubmit,
  onSignupSubmit,
}: CompanyLoginFormProps): React.ReactElement => {
  if (mode === "signup") {
    return (
      <form onSubmit={onSignupSubmit} className="flex flex-col gap-4">
        <Input
          id="company-signup-company-name"
          type="text"
          value={signupValues.companyName}
          onChange={(event) => onSignupValueChange("companyName", event.target.value)}
          disabled={isSubmitting}
          placeholder="회사명"
          aria-label="회사명"
          leftIcon={<BuildingIcon width={20} />}
          iconClassName={iconClassName}
          size="large"
          isFullWidth
          className={signupInputClassName}
        />
        <Input
          id="company-signup-name"
          type="text"
          value={signupValues.name}
          onChange={(event) => onSignupValueChange("name", event.target.value)}
          disabled={isSubmitting}
          placeholder="이름"
          aria-label="이름"
          leftIcon={<UserIcon width={20} />}
          iconClassName={iconClassName}
          size="large"
          isFullWidth
          className={signupInputClassName}
        />
        <Input
          id="company-signup-username"
          type="text"
          value={signupValues.username}
          onChange={(event) => onSignupValueChange("username", event.target.value)}
          disabled={isSubmitting}
          placeholder="아이디"
          aria-label="아이디"
          leftIcon={<AtSignIcon width={20} />}
          iconClassName={iconClassName}
          size="large"
          isFullWidth
          className={signupInputClassName}
        />
        <Input
          id="company-signup-email"
          type="email"
          value={signupValues.email}
          onChange={(event) => onSignupValueChange("email", event.target.value)}
          disabled={isSubmitting}
          placeholder="이메일"
          aria-label="이메일"
          leftIcon={<MailIcon width={20} />}
          iconClassName={iconClassName}
          size="large"
          isFullWidth
          className={signupInputClassName}
        />
        <Input
          id="company-signup-password"
          type="password"
          value={signupValues.password}
          onChange={(event) => onSignupValueChange("password", event.target.value)}
          disabled={isSubmitting}
          placeholder="비밀번호"
          aria-label="비밀번호"
          leftIcon={<LockIcon width={20} />}
          iconClassName={iconClassName}
          size="large"
          isFullWidth
          className={signupInputClassName}
        />
        <Input
          id="company-signup-password-confirm"
          type="password"
          value={signupValues.passwordConfirm}
          onChange={(event) => onSignupValueChange("passwordConfirm", event.target.value)}
          disabled={isSubmitting}
          placeholder="비밀번호 확인"
          aria-label="비밀번호 확인"
          leftIcon={<LockIcon width={20} />}
          iconClassName={iconClassName}
          size="large"
          isFullWidth
          className={signupInputClassName}
        />

        <Button
          type="submit"
          fullWidth
          size="large"
          isLoading={isSubmitting}
          className="mt-3 rounded-[4px] text-[14px] font-medium hover:scale-100 hover:shadow-none active:scale-100"
        >
          회원가입
        </Button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onModeChange("login")}
          className="mt-1 text-center text-[16px] font-medium leading-[150%] text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:text-[var(--color-gray-400)]"
        >
          이미 계정이 있으신가요? 로그인
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onLoginSubmit} className="flex flex-col gap-2">
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
        className={inputClassName}
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
        className={inputClassName}
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
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => onModeChange("signup")}
        className="mt-3 text-center text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-[#000000] hover:text-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:text-[var(--color-gray-400)]"
      >
        기업 계정이 없으신가요? 회원가입으로 이동하세요.
      </button>
    </form>
  );
};

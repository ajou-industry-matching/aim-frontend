"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuthErrorMessage,
  signInWithEmail,
  signInWithGoogle,
  signUpCompanyWithEmail,
} from "@/lib/auth";
import type { BackendUser } from "@/api/auth";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tabs,
  type TabItem,
} from "@/shared/ui";
import {
  CompanyLoginForm,
  type CompanyAuthMode,
  type CompanySignupValues,
} from "./company-login-form";
import { StudentLoginPanel } from "./student-login-panel";
import styles from "./login.module.css";

const loginTabs: TabItem[] = [
  { id: "student", label: "학생/교수" },
  { id: "company", label: "기업" },
];

const initialCompanySignupValues: CompanySignupValues = {
  companyName: "",
  name: "",
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

type ErrorModalState = {
  title: string;
  message: string;
};

const getCompanySignupStatusMessage = (status: BackendUser["status"]): string => {
  switch (status) {
    case "ACTIVE":
      return "회원가입이 완료되었습니다.";
    case "PENDING":
      return "회원가입 요청이 완료되었습니다. 관리자 승인 후 이용할 수 있습니다.";
    case "BLOCKED":
      return "가입은 완료되었지만 차단된 계정입니다. 관리자에게 문의해주세요.";
    case "SUSPENDED":
      return "가입은 완료되었지만 정지된 계정입니다. 관리자에게 문의해주세요.";
  }
};

export const LoginPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("student");
  const [companyMode, setCompanyMode] = useState<CompanyAuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupValues, setSignupValues] = useState<CompanySignupValues>(initialCompanySignupValues);
  const [errorModal, setErrorModal] = useState<ErrorModalState | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = activeTab === "student";

  const showErrorModal = (message: string, title = "로그인 실패") => {
    setErrorModal({ title, message });
  };

  const clearFeedback = () => {
    setErrorModal(null);
    setStatusMessage("");
  };

  const handleCompanyModeChange = (nextMode: CompanyAuthMode) => {
    setCompanyMode(nextMode);
    clearFeedback();
  };

  const handleSignupValueChange = (name: keyof CompanySignupValues, value: string) => {
    setSignupValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleGoogleLoginClick = async () => {
    clearFeedback();
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
      router.replace("/portfolio");
    } catch (error) {
      console.error("[auth] Google login failed", error);
      showErrorModal(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      showErrorModal("이메일과 비밀번호를 입력해주세요.", "입력 오류");
      return;
    }

    clearFeedback();
    setIsSubmitting(true);

    try {
      await signInWithEmail(trimmedEmail, password);
      router.replace("/home");
    } catch (error) {
      console.error("[auth] Company login failed", error);
      showErrorModal(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const companyName = signupValues.companyName.trim();
    const name = signupValues.name.trim();
    const username = signupValues.username.trim();
    const signupEmail = signupValues.email.trim();
    const signupPassword = signupValues.password;
    const passwordConfirm = signupValues.passwordConfirm;

    if (!companyName || !name || !username || !signupEmail || !signupPassword || !passwordConfirm) {
      showErrorModal("모든 정보를 입력해주세요.", "입력 오류");
      return;
    }

    if (signupPassword.length < 6) {
      showErrorModal("비밀번호는 6자 이상으로 입력해주세요.", "입력 오류");
      return;
    }

    if (signupPassword !== passwordConfirm) {
      showErrorModal("비밀번호와 비밀번호 확인이 일치하지 않습니다.", "입력 오류");
      return;
    }

    clearFeedback();
    setIsSubmitting(true);

    try {
      const session = await signUpCompanyWithEmail(signupEmail, signupPassword, {
        companyName,
        name,
      });
      const nextMessage = getCompanySignupStatusMessage(session.backendUser.status);

      setSignupValues(initialCompanySignupValues);
      setEmail(signupEmail);
      setPassword("");
      setStatusMessage(nextMessage);

      if (session.backendUser.status === "ACTIVE") {
        router.replace("/home");
      }
    } catch (error) {
      console.error("[auth] Company signup failed", error);
      showErrorModal(getAuthErrorMessage(error), "회원가입 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page flex min-h-[calc(100vh-80px)] flex-col bg-white text-[var(--color-gray-900)]">
      <main className="login-page__main flex flex-1 justify-center px-2 pb-5 pt-[10vh] md:px-8 md:pb-10 md:pt-[8vh]">
        <div className="flex w-full justify-center">
          <section className="login-page__surface w-full rounded-3xl bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] py-0">
            <div className="login-page__content flex flex-col items-center">
              <div className="login-page__title mb-8 md:mb-14">
                <img
                  src="/assets/aim-logo.svg"
                  alt="AIM AJOU"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div
                className={[
                  "login-page__card w-full max-w-180 overflow-hidden rounded-xl border border-gray-200 bg-white md:min-h-75",
                  isStudent
                    ? "shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                    : "shadow-[0_0_4px_4px_rgba(0,74,156,0.25)]",
                ].join(" ")}
              >
                <div className="login-page__tabs px-4 pt-3 md:px-6 md:pt-4">
                  <Tabs
                    items={loginTabs}
                    value={activeTab}
                    onChange={(nextTab) => {
                      setActiveTab(nextTab);
                      clearFeedback();
                    }}
                    variant="horizontal"
                    isAnimated
                    className="[&>button]:flex-1 [&>button]:text-[13px] [&>button]:md:text-[14px]"
                  />
                </div>

                <div className="login-page__body px-4 pb-8 pt-7 md:px-6 md:pb-10 md:pt-7">
                  <div
                    key={`${activeTab}-${companyMode}`}
                    className={[
                      "login-page__panel mx-auto flex w-full flex-col md:max-w-2xl",
                      styles.panelAnimated,
                      isStudent ? "items-center text-center" : "gap-2 text-left",
                    ].join(" ")}
                  >
                    {isStudent ? (
                      <StudentLoginPanel
                        isSubmitting={isSubmitting}
                        onGoogleLoginClick={handleGoogleLoginClick}
                      />
                    ) : (
                      <CompanyLoginForm
                        mode={companyMode}
                        email={email}
                        password={password}
                        signupValues={signupValues}
                        isSubmitting={isSubmitting}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onSignupValueChange={handleSignupValueChange}
                        onModeChange={handleCompanyModeChange}
                        onLoginSubmit={handleCompanyLoginSubmit}
                        onSignupSubmit={handleCompanySignupSubmit}
                      />
                    )}
                    {statusMessage && (
                      <p
                        role="status"
                        className="mt-4 text-center text-[14px] font-medium leading-5 text-[var(--color-primary-800)]"
                      >
                        {statusMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Modal
        isOpen={errorModal !== null}
        onClose={() => setErrorModal(null)}
        className="max-w-[420px]"
      >
        <ModalHeader title={errorModal?.title ?? "오류"} onClose={() => setErrorModal(null)} />
        <ModalContent>
          <p className="text-[15px] font-medium leading-6 text-[var(--color-gray-700)]">
            {errorModal?.message}
          </p>
        </ModalContent>
        <ModalFooter>
          <Button
            type="button"
            size="medium"
            onClick={() => setErrorModal(null)}
            className="rounded-[4px] hover:scale-100 active:scale-100"
          >
            확인
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

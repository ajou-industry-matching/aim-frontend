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
    <div className="login-page flex min-h-screen flex-col bg-white text-(--color-gray-900)">
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
                        className="mt-4 text-center text-[14px] font-medium leading-5 text-(--color-primary-800)"
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

      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-10 md:px-16">
        <div className="mx-auto max-w-360">
          <div className="mb-6 flex justify-center gap-6 text-[13px] text-gray-500">
            <a href="/terms" className="transition-colors hover:text-gray-900">
              이용약관
            </a>
            <a href="/privacy" className="transition-colors hover:text-gray-900">
              개인정보처리방침
            </a>
            <a href="/sitemap" className="transition-colors hover:text-gray-900">
              사이트맵
            </a>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/ajou-logo.svg"
                alt="Ajou University"
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="text-[14px] font-bold text-gray-900">아주대학교</p>
                <p className="text-[11px] text-gray-400">AJOU University</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-[12px] text-gray-500 md:text-center">
              <p>16499 경기도 수원시 영통구 월드컵로 206 아주대학교</p>
              <p>T. 031-219-2114</p>
              <p>Copyright © 2026 Ajou University. All Rights Reserved.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
                aria-label="인스타그램"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
                aria-label="페이스북"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-(--color-primary-800) hover:text-(--color-primary-800)"
                aria-label="유튜브"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={errorModal !== null}
        onClose={() => setErrorModal(null)}
        className="max-w-[420px]"
      >
        <ModalHeader title={errorModal?.title ?? "오류"} onClose={() => setErrorModal(null)} />
        <ModalContent>
          <p className="text-[15px] font-medium leading-6 text-gray-700">{errorModal?.message}</p>
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

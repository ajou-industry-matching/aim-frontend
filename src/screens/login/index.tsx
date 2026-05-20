"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage, signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { Navigation, Tabs, type NavItem, type TabItem } from "@/shared/ui";
import { CompanyLoginForm } from "./company-login-form";
import { StudentLoginPanel } from "./student-login-panel";
import styles from "./login.module.css";

const navItems: NavItem[] = [
  { label: "포트폴리오", href: "#portfolio" },
  { label: "소개", href: "#about" },
  { label: "공지사항", href: "#notice" },
];

const loginTabs: TabItem[] = [
  { id: "student", label: "학생/교수" },
  { id: "company", label: "기업" },
];

export const LoginPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = activeTab === "student";

  const handleGoogleLoginClick = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
      router.replace("/portfolio");
    } catch (error) {
      console.error("[auth] Google login failed", error);
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithEmail(trimmedEmail, password);
      router.replace("/home");
    } catch (error) {
      console.error("[auth] Company login failed", error);
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page flex min-h-screen flex-col bg-white text-[var(--color-gray-900)]">
      <Navigation
        items={navItems}
        onLogin={() => undefined}
        onSignup={() => undefined}
        className="login-page__nav"
      />

      <main className="login-page__main flex min-h-[calc(100vh-80px)] flex-1 justify-center px-2 pb-5 pt-[10vh] md:px-8 md:pb-10 md:pt-[8vh]">
        <div className="flex w-full justify-center">
          <section className="login-page__surface w-full rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] py-0">
            <div className="login-page__content flex flex-col items-center">
              <h1 className="login-page__title mb-8 text-center text-[36px] font-bold leading-[1.3] tracking-[-1px] text-black md:mb-14 md:text-[40px]">
                AIM AJOU
              </h1>

              <div
                className={[
                  "login-page__card w-full max-w-[720px] overflow-hidden rounded-[12px] border border-[var(--color-gray-200)] bg-white md:min-h-[300px]",
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
                      setErrorMessage("");
                    }}
                    variant="horizontal"
                    isAnimated
                    className="[&>button]:flex-1 [&>button]:text-[13px] [&>button]:md:text-[14px]"
                  />
                </div>

                <div className="login-page__body px-4 pb-8 pt-7 md:px-6 md:pb-[40px] md:pt-7">
                  <div
                    key={activeTab}
                    className={[
                      "login-page__panel mx-auto flex w-full flex-col md:max-w-[672px]",
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
                        email={email}
                        password={password}
                        isSubmitting={isSubmitting}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onSubmit={handleCompanyLoginSubmit}
                      />
                    )}
                    {errorMessage && (
                      <p
                        role="alert"
                        className="mt-4 text-center text-[14px] font-medium leading-5 text-[var(--color-error-500)]"
                      >
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

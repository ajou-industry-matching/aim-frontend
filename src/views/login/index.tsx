"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/inputBox/inputBox";
import { Navigation, Tabs, type NavItem, type TabItem } from "@/shared/ui";
import { LockIcon, MailIcon } from "@/shared/ui/icons";
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
  const [activeTab, setActiveTab] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isStudent = activeTab === "student";
  const signupCopy = "기업 계정이 없으신가요? 회원가입으로 이동하세요.";

  const handleCompanyLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
                    onChange={setActiveTab}
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
                      <>
                        <p className="mt-10 text-[14px] font-medium leading-[150%] tracking-[-0.025em] text-[var(--color-gray-500)] md:mt-[40px]">
                          아주대학교 구성원(학생/교수)은 Google 계정으로 로그인하세요
                        </p>
                        <button
                          type="button"
                          className="mt-8 flex h-11 items-center justify-center gap-3 rounded-[4px] border border-[var(--color-gray-300)] bg-white px-5 text-[14px] font-medium text-[#4a4a4a] transition-colors duration-200 hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[conic-gradient(from_90deg,#4285F4_0_25%,#34A853_25%_50%,#FBBC05_50%_75%,#EA4335_75%_100%)] text-[9px] font-bold text-white">
                            G
                          </span>
                          Sign in with Google
                        </button>
                      </>
                    ) : (
                      <form onSubmit={handleCompanyLoginSubmit} className="flex flex-col gap-2">
                        <label
                          htmlFor="login-email"
                          className="text-[16px] font-medium leading-5 text-[#000000]"
                        >
                          이메일
                        </label>
                        <Input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
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
                          onChange={(event) => setPassword(event.target.value)}
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
                          className="mt-5 rounded-[4px] text-[14px] font-medium hover:scale-100 hover:shadow-none active:scale-100"
                        >
                          로그인
                        </Button>
                        <a
                          href="#signup"
                          className="mt-3 text-center text-[16px] font-medium leading-[150%] tracking-[-0.025em] text-[#000000] hover:text-[var(--color-primary-800)]"
                        >
                          {signupCopy}
                        </a>
                      </form>
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

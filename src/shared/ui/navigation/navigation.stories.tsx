import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navigation } from "./navigation";
import { fn } from "storybook/test";

// --- Mock Data ---
const mockUsers = {
  // 1. 어드민 권한이 있는 학생 (토글 노출됨)
  studentAdmin: {
    name: "김철수",
    email: "chulsoo.kim@ajou.ac.kr",
    userType: "학생",
    isAdmin: true,
  },
  // 2. 일반 학생 (토글 노출 안됨)
  student: {
    name: "이영희",
    email: "younghee.lee@ajou.ac.kr",
    userType: "학생",
    isAdmin: false,
  },
  // 3. 어드민 권한이 있는 교수 (토글 노출됨)
  professorAdmin: {
    name: "박교수",
    email: "park.prof@ajou.ac.kr",
    userType: "교수",
    isAdmin: true,
  },
  // 4. 기업 사용자 (토글 노출 안됨)
  company: {
    name: "(주)에이아이엠",
    email: "contact@aim.com",
    userType: "기업",
    isAdmin: false,
  },
} as const;

const meta = {
  title: "Shared/UI/Navigation",
  component: Navigation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    items: [
      { label: "포트폴리오", href: "/portfolio", isActive: true },
      { label: "소개", href: "/about" },
      { label: "공지사항", href: "/notice" },
    ],
    onLogin: fn(),
    onSignup: fn(),
    onLogout: fn(),
    onAdminToggle: fn(),
    onProfileClick: fn(),
    onAdminDashboardClick: fn(),
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 로그인 전 상태
export const LoggedOut: Story = {
  args: {
    user: undefined,
  },
};

// 2. 학생 어드민 (토글 노출)
export const StudentAdmin: Story = {
  args: {
    user: mockUsers.studentAdmin,
    isAdminMode: false,
  },
};

// 3. 학생 어드민 - 관리 모드 활성화 (토글 파란색, 대시보드 메뉴 노출)
export const StudentAdminActive: Story = {
  args: {
    user: mockUsers.studentAdmin,
    isAdminMode: true,
  },
};

// 4. 일반 학생 (토글 노출 안됨)
export const GeneralStudent: Story = {
  args: {
    user: mockUsers.student,
  },
};

// 5. 교수 어드민 (토글 노출)
export const ProfessorAdmin: Story = {
  args: {
    user: mockUsers.professorAdmin,
    isAdminMode: true,
  },
};

// 6. 기업 사용자 (토글 노출 안됨)
export const CompanyUser: Story = {
  args: {
    user: mockUsers.company,
  },
};

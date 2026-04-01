import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import "../../../index.css";
import { RichEditor } from "./rich-editor";

const meta = {
  title: "Shared/UI/RichEditor",
  component: RichEditor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    isEditable: {
      control: "boolean",
      description: "편집 가능 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    content: {
      control: "text",
      description: "초기 HTML 콘텐츠 (초기값만 적용, 이후 변경 미반영)",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RichEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = `<h1>포트폴리오 제목</h1><p>프로젝트에 대한 소개를 작성합니다. 여기에 프로젝트의 목표와 성과를 간략히 설명할 수 있습니다.</p><h2>주요 기능</h2><ul><li>React 기반 SPA 개발</li><li>Firebase 인증 및 Firestore 연동</li><li>반응형 UI 구현</li></ul><h3>기술 스택</h3><ol><li>TypeScript</li><li>React 19</li><li>Tailwind CSS</li></ol><blockquote><p>사용자 중심의 개발을 지향하며, 직관적인 UI를 제공합니다.</p></blockquote><pre><code>const greet = () =&gt; {
  console.log("Hello, AIM AJOU!")
}</code></pre>`;

export const Default: Story = {
  args: {
    isEditable: true,
    content: "",
  },
};

export const WithContent: Story = {
  args: {
    isEditable: true,
    content: sampleContent,
  },
};

export const ReadOnly: Story = {
  args: {
    isEditable: false,
    content: sampleContent,
  },
};

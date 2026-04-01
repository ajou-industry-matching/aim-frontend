import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup, type AvatarProps } from "./avatars";

const meta = {
  title: "Shared/UI/Avatars",
  parameters: {
    layout: "padded",
    componentSubtitle: "유저 프로필 및 다중 유저를 표시하는 아바타 컴포넌트",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

// ==========================================
// Avatar Stories
// ==========================================
export const AvatarSizes: StoryObj = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="xs" name="A" />
      <Avatar size="sm" name="B" />
      <Avatar size="md" name="C" />
      <Avatar size="lg" name="D" />
      <Avatar size="xl" name="E" />
      <Avatar size="2xl" name="F" />
      <Avatar size="3xl" name="G" />
    </div>
  ),
  parameters: {
    docs: { description: { story: "XS(24px) 부터 3XL(128px) 까지 지원합니다. (기본값: MD 40px)" } },
  },
};

export const AvatarVariants: StoryObj = {
  render: () => (
    <div className="flex gap-6">
      <Avatar size="xl" src="https://picsum.photos/200/200" name="김아주" />
      <Avatar size="xl" name="김아주" />
      <Avatar size="xl" /> {/* src, name 둘 다 없으면 기본 아이콘 */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "이미지, 이니셜 텍스트, 기본 아이콘 순으로 렌더링 우선순위를 가집니다.",
      },
    },
  },
};

export const AvatarStatusDisplay: StoryObj = {
  render: () => (
    <div className="flex gap-6">
      <Avatar size="lg" src="https://picsum.photos/100/100" status="online" />
      <Avatar size="lg" name="A" status="away" />
      <Avatar size="lg" status="busy" />
      <Avatar size="lg" src="https://picsum.photos/101/101" status="offline" />
    </div>
  ),
};

export const AvatarWithBadge: StoryObj<typeof Avatar> = {
  render: (args) => <Avatar {...args} />,
  args: {
    size: "lg",
    src: "https://picsum.photos/102/102",
    badge: (
      <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
        3
      </span>
    ),
  },
};

// ==========================================
// Avatar Group Stories
// ==========================================
const mockAvatars: AvatarProps[] = [
  { src: "https://picsum.photos/200/200?random=1", name: "User 1" },
  { src: "https://picsum.photos/200/200?random=2", name: "User 2" },
  { name: "Choi", status: "online" },
  { src: "https://picsum.photos/200/200?random=4", name: "User 4" },
  { src: "https://picsum.photos/200/200?random=5", name: "User 5" },
  { name: "Park" },
  { src: "https://picsum.photos/200/200?random=7", name: "User 7" },
];

export const GroupDefault: StoryObj<typeof AvatarGroup> = {
  render: (args) => <AvatarGroup {...args} />,
  args: {
    avatars: mockAvatars,
    maxVisible: 4,
    size: "md",
  },
};

export const GroupSizes: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6">
      <AvatarGroup avatars={mockAvatars} size="sm" maxVisible={3} />
      <AvatarGroup avatars={mockAvatars} size="md" maxVisible={5} />
      <AvatarGroup avatars={mockAvatars} size="xl" maxVisible={4} />
    </div>
  ),
};

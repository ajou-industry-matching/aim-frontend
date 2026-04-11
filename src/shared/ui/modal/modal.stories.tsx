import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "./modal";
import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import { FormField, FormLabel } from "../form";
import { Input, Textarea, Select } from "../inputBox/inputBox";

const meta = {
  title: "Shared/UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- 1. Portfolio Filter Modal Example ---
const FilterModalExample = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(propsIsOpen);

  // 스토리북 args(propsIsOpen)가 변경될 때 내부 상태 동기화
  useEffect(() => {
    setIsOpen(propsIsOpen);
  }, [propsIsOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    propsOnClose(); // 스토리북 상태에도 알림
  };

  const categories = ["웹 개발", "모바일 앱", "UI/UX 디자인", "데이터 분석", "AI/ML", "게임 개발"];
  const departments = ["소프트웨어학과", "미디어학과", "산업공학과", "경영학과"];

  return (
    <>
      <Button onClick={handleOpen}>필터 모달 열기</Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalHeader title="필터 선택" onClose={handleClose} />
        <ModalContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[16px] font-semibold text-[var(--color-gray-800,#333)]">
              카테고리
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Checkbox label="전체" className="col-span-2" defaultChecked />
              {categories.map((cat) => (
                <Checkbox key={cat} label={cat} />
              ))}
            </div>
          </div>

          <div className="h-px bg-[var(--color-gray-100,#f2f2f2)]" />

          <div className="space-y-4">
            <h3 className="text-[16px] font-semibold text-[var(--color-gray-800,#333)]">학과</h3>
            <div className="grid grid-cols-2 gap-3">
              <Checkbox label="전체" className="col-span-2" defaultChecked />
              {departments.map((dept) => (
                <Checkbox key={dept} label={dept} />
              ))}
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            초기화
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleClose} className="px-8">
            적용
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const FilterModal: Story = {
  render: (args) => <FilterModalExample {...args} />,
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};

// --- 2. Profile Edit Modal Example ---
const ProfileEditModalExample = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(propsIsOpen);

  useEffect(() => {
    setIsOpen(propsIsOpen);
  }, [propsIsOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    propsOnClose();
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpen}>
        프로필 편집 열기
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[500px]">
        <ModalHeader title="프로필 편집" onClose={handleClose} />
        <ModalContent className="space-y-5">
          <FormField>
            <FormLabel>이름</FormLabel>
            <Input defaultValue="김철수" />
          </FormField>

          <FormField>
            <FormLabel>이메일</FormLabel>
            <Input type="email" defaultValue="chulsoo.kim@ajou.ac.kr" />
          </FormField>

          <FormField>
            <FormLabel>소속</FormLabel>
            <Input defaultValue="아주대학교 소프트웨어학과" />
          </FormField>

          <FormField>
            <FormLabel>회원 종류</FormLabel>
            <Select
              options={[
                { label: "학생", value: "학생" },
                { label: "교수", value: "교수" },
                { label: "기업", value: "기업" },
              ]}
              defaultValue="학생"
            />
          </FormField>

          <FormField>
            <FormLabel>자기소개</FormLabel>
            <Textarea defaultValue="웹 개발과 UI/UX 디자인에 관심이 많은 학생입니다." rows={4} />
          </FormField>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleClose} className="px-8">
            저장
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const ProfileEditModal: Story = {
  render: (args) => <ProfileEditModalExample {...args} />,
  args: {
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};

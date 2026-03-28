import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "./modal";
import { Button } from "@/shared/ui/button/button";
import { Checkbox } from "@/shared/ui/checkbox/checkbox";
import { FormField, FormLabel } from "@/shared/ui/form";
import { Input, Textarea, Select } from "@/shared/ui/inputBox/inputBox";

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
const FilterModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = ["웹 개발", "모바일 앱", "UI/UX 디자인", "데이터 분석", "AI/ML", "게임 개발"];
  const departments = ["소프트웨어학과", "미디어학과", "산업공학과", "경영학과"];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>필터 모달 열기</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader title="필터 선택" onClose={() => setIsOpen(false)} />
        <ModalContent className="space-y-8">
          {/* 카테고리 섹션 */}
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

          {/* 학과 섹션 */}
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
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            초기화
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)} className="px-8">
            적용
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const FilterModal: Story = {
  render: () => <FilterModalExample />,
  args: {
    isOpen: true,
    onClose: () => {},
    children: null,
  },
};

// --- 2. Profile Edit Modal Example ---
const ProfileEditModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        프로필 편집 열기
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[500px]">
        <ModalHeader title="프로필 편집" onClose={() => setIsOpen(false)} />
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
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)} className="px-8">
            저장
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const ProfileEditModal: Story = {
  render: () => <ProfileEditModalExample />,
  args: {
    isOpen: true,
    onClose: () => {},
    children: null,
  },
};

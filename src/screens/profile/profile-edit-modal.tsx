"use client";

import { useState } from "react";
import type { AuthRole } from "@/api/auth";
import type { UserProfile } from "@/api/user";
import { useUpdateProfile } from "@/lib/user";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@/shared/ui";

const roleLabels: Record<AuthRole, string> = {
  STUDENT: "학생",
  PROFESSOR: "교수",
  COMPANY: "기업",
};

const BIO_MAX_LENGTH = 200;

const labelClasses = "block text-[14px] font-medium text-[color:var(--color-gray-900,#1a1a1a)]";
const errorTextClasses = "text-[12px] text-[color:var(--color-error-500,#ef4444)]";

export type ProfileEditModalProps = {
  profile: UserProfile;
  onClose: () => void;
  onSaved: (updated: UserProfile) => void;
};

// 편집 가능한 필드는 이름/자기소개뿐이며, 나머지(이메일/소속/회원 종류)는 읽기 전용으로 노출한다.
export const ProfileEditModal = ({ profile, onClose, onSaved }: ProfileEditModalProps) => {
  const { submit, isSubmitting, error } = useUpdateProfile();
  const [name, setName] = useState(profile.name);
  const [profileBio, setProfileBio] = useState(profile.profileBio ?? "");
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("이름을 입력해주세요.");
      return;
    }

    const updated = await submit({ name: trimmedName, profileBio: profileBio.trim() });
    if (updated) {
      onSaved(updated);
    }
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-[500px]">
      <ModalHeader title="프로필 편집" onClose={onClose} />
      <ModalContent className="space-y-4">
        <div className="space-y-2">
          <label className={labelClasses} htmlFor="profile-name">
            이름
          </label>
          <Input
            id="profile-name"
            size="medium"
            value={name}
            hasError={Boolean(nameError)}
            placeholder="이름을 입력하세요"
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
          />
          {nameError && <p className={errorTextClasses}>{nameError}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClasses} htmlFor="profile-email">
            이메일
          </label>
          <Input id="profile-email" size="medium" value={profile.email} disabled />
        </div>

        <div className="space-y-2">
          <label className={labelClasses} htmlFor="profile-department">
            소속
          </label>
          <Input id="profile-department" size="medium" value={profile.department} disabled />
        </div>

        <div className="space-y-2">
          <label className={labelClasses} htmlFor="profile-role">
            회원 종류
          </label>
          <Input id="profile-role" size="medium" value={roleLabels[profile.role]} disabled />
        </div>

        <div className="space-y-2">
          <label className={labelClasses} htmlFor="profile-bio">
            자기소개
          </label>
          <Textarea
            id="profile-bio"
            rows={4}
            maxLength={BIO_MAX_LENGTH}
            value={profileBio}
            placeholder="자기소개를 입력하세요"
            className="resize-none"
            onChange={(event) => setProfileBio(event.target.value)}
          />
        </div>

        {error && (
          <p className={errorTextClasses}>프로필 저장에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
        )}
      </ModalContent>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave} isLoading={isSubmitting}>
          저장
        </Button>
      </ModalFooter>
    </Modal>
  );
};

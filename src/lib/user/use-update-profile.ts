"use client";

import { useCallback, useState } from "react";
import { updateMyProfile, type UpdateProfileRequest, type UserProfile } from "@/api/user";

export type UseUpdateProfileResult = {
  submit: (request: UpdateProfileRequest) => Promise<UserProfile | null>;
  isSubmitting: boolean;
  error: Error | null;
};

const toErrorInstance = (cause: unknown): Error => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause);
  return new Error("프로필 수정에 실패했습니다.");
};

export const useUpdateProfile = (): UseUpdateProfileResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (request: UpdateProfileRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await updateMyProfile(request);
    } catch (cause) {
      console.error("프로필 수정에 실패했습니다.", cause);
      setError(toErrorInstance(cause));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error };
};

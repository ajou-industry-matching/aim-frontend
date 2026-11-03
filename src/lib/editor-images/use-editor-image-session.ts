"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  deleteEditorImage,
  isEditorImageUrl,
  uploadEditorImage,
  type EditorImagePathPrefix,
} from "@/api/editor-images";

// getHTML()은 src의 &를 &amp;로 이스케이프하므로 문자열 비교 대신 DOM으로 파싱해 원래 URL을 꺼낸다.
const extractImageSrcs = (html: string): Set<string> => {
  if (!html || typeof DOMParser === "undefined") return new Set();
  const doc = new DOMParser().parseFromString(html, "text/html");
  return new Set(
    Array.from(doc.querySelectorAll("img"))
      .map((img) => img.getAttribute("src") ?? "")
      .filter(Boolean),
  );
};

export type UseEditorImageSessionResult = {
  /** RichEditor의 onUploadImage로 넘긴다. */
  uploadImage: (file: File) => Promise<string>;
  /** RichEditor의 canPasteImage로 넘긴다. */
  canPasteImage: (src: string) => boolean;
  /**
   * 저장이 성공한 직후 저장된 본문으로 호출한다.
   * 이번에 올렸거나 원래 본문에 있던 이미지 중 저장된 본문에서 빠진 것을 Storage에서 지운다.
   */
  commit: (savedContent: string) => void;
};

/**
 * 에디터 이미지의 Storage 정리를 "저장할 때" 한 번에 한다.
 * - 편집 중 지운 이미지를 바로 지우지 않아야 되돌리기(Ctrl+Z)로 살려도 깨지지 않는다.
 * - 다른 글의 Storage 이미지는 붙여넣지 못하게 막아, 파일 하나가 한 글에만 속하게 한다.
 *   그래야 원래 본문에서 빠진 이미지를 지워도 다른 글이 깨지지 않는다.
 * - 저장하지 않고 화면을 떠나면 이번에 올린 이미지만 지운다(창 닫기는 감지하지 못하는 best-effort).
 */
export const useEditorImageSession = (
  prefix: EditorImagePathPrefix,
  originalContent = "",
): UseEditorImageSessionResult => {
  const uploadedUrlsRef = useRef<Set<string>>(new Set());
  const originalContentRef = useRef(originalContent);
  const isActiveRef = useRef(true);

  // 수정 화면은 상세를 불러온 뒤에 원본 본문이 정해지므로 바뀌면 따라간다.
  useEffect(() => {
    originalContentRef.current = originalContent;
  }, [originalContent]);

  const uploadImage = useCallback(
    async (file: File) => {
      const url = await uploadEditorImage(file, prefix);
      // 업로드 도중 화면을 떠났으면 아무 데도 쓰이지 않으므로 바로 지운다.
      if (!isActiveRef.current) {
        void deleteEditorImage(url, prefix);
        return url;
      }
      uploadedUrlsRef.current.add(url);
      return url;
    },
    [prefix],
  );

  const canPasteImage = useCallback(
    (src: string) =>
      !isEditorImageUrl(src, prefix) ||
      uploadedUrlsRef.current.has(src) ||
      extractImageSrcs(originalContentRef.current).has(src),
    [prefix],
  );

  const commit = useCallback(
    (savedContent: string) => {
      const kept = extractImageSrcs(savedContent);
      const candidates = new Set([
        ...uploadedUrlsRef.current,
        ...extractImageSrcs(originalContentRef.current),
      ]);
      candidates.forEach((url) => {
        if (!kept.has(url)) void deleteEditorImage(url, prefix);
      });

      // 저장된 본문이 다음 비교의 기준이 되고, 남은 업로드는 이제 저장된 이미지다.
      originalContentRef.current = savedContent;
      uploadedUrlsRef.current = new Set();
    },
    [prefix],
  );

  useEffect(() => {
    const uploadedUrls = uploadedUrlsRef;
    const isActive = isActiveRef;
    // Strict Mode의 mount → unmount → mount에서도 다시 살아나도록 mount마다 켠다.
    isActive.current = true;
    return () => {
      isActive.current = false;
      uploadedUrls.current.forEach((url) => void deleteEditorImage(url, prefix));
      uploadedUrls.current = new Set();
    };
  }, [prefix]);

  return { uploadImage, canPasteImage, commit };
};

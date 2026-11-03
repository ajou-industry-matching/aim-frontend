"use client";

import { useMemo, useState } from "react";
import { useAdminKeywords } from "@/lib/admin";
import { Button, Input } from "@/shared/ui";
import { PlusIcon, SearchIcon } from "@/shared/ui/icons";
import { Table, type TableColumn, type TableRowData } from "@/shared/ui/lists/lists";
import { Loading } from "@/shared/ui/loading";
import { Tag } from "@/shared/ui/tag";

const columns: TableColumn[] = [
  { id: "order", label: "순번", width: "sm", align: "center" },
  { id: "name", label: "태그명", width: "fill", align: "left", headerAlign: "center" },
  { id: "actions", label: "관리", width: "lg", align: "center" },
];

export const TagsTab = () => {
  const { keywords, isLoading, isSubmitting, error, create, rename, remove } = useAdminKeywords();
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const filteredKeywords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return keywords;
    return keywords.filter((keyword) => keyword.keywordName.toLowerCase().includes(query));
  }, [keywords, search]);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    if (await create(name)) setNewName("");
  };

  const handleRename = async () => {
    const name = editingName.trim();
    if (editingId === null || !name) return;
    if (await rename(editingId, name)) setEditingId(null);
  };

  const handleDelete = (keywordId: number, name: string) => {
    if (window.confirm(`"${name}" 태그를 삭제하시겠습니까? 모든 포트폴리오에서 제거됩니다.`)) {
      void remove(keywordId);
    }
  };

  const rows: TableRowData[] = filteredKeywords.map((keyword, index) => {
    const isEditing = editingId === keyword.keywordId;

    return {
      id: String(keyword.keywordId),
      order: index + 1,
      name: isEditing ? (
        <div className="max-w-[240px]">
          <Input
            size="medium"
            isFullWidth
            autoFocus
            value={editingName}
            aria-label="태그 이름"
            onChange={(event) => setEditingName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void handleRename();
            }}
          />
        </div>
      ) : (
        <Tag>#{keyword.keywordName}</Tag>
      ),
      actions: isEditing ? (
        <div className="flex items-center justify-center gap-2">
          <Button size="small" onClick={() => void handleRename()} isLoading={isSubmitting}>
            저장
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => setEditingId(null)}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="small"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => {
              setEditingId(keyword.keywordId);
              setEditingName(keyword.keywordName);
            }}
          >
            수정
          </Button>
          <Button
            size="small"
            variant="danger"
            disabled={isSubmitting}
            onClick={() => handleDelete(keyword.keywordId, keyword.keywordName)}
          >
            삭제
          </Button>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-[300px]">
          <Input
            size="medium"
            isFullWidth
            value={newName}
            aria-label="새 태그 이름"
            placeholder="새 태그 이름 입력..."
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void handleCreate();
            }}
          />
        </div>
        <Button
          size="medium"
          iconPosition="left"
          icon={<PlusIcon size={18} />}
          disabled={!newName.trim() || isSubmitting}
          onClick={() => void handleCreate()}
        >
          태그 추가
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full max-w-sm">
          <Input
            size="medium"
            isFullWidth
            value={search}
            placeholder="태그 검색..."
            leftIcon={<SearchIcon size={16} />}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <span className="text-[14px] text-[var(--color-gray-600,#666666)]">
          총{" "}
          <span className="font-semibold text-[var(--color-gray-900,#1a1a1a)]">
            {keywords.length}
          </span>
          개
        </span>
      </div>

      {error && (
        <p role="alert" className="text-[14px] text-[var(--color-error-500,#ef4444)]">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loading text="불러오는 중" />
        </div>
      ) : (
        <Table columns={columns} data={rows} />
      )}
    </div>
  );
};

import React from "react";
import Image from "next/image";
// 공통 아이콘 Import 추가
import { ChevronRightIcon, InboxIcon } from "../icons";

// ----------------------------------------------------------------------
// 타입 정의
// ----------------------------------------------------------------------

// List Item 관련 타입
export type ListItemProps = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  metaPrimary?: string;
  metaSecondary?: string;
  hasCheckbox?: boolean;
  isChecked?: boolean;
  hasArrow?: boolean;
  isActive?: boolean;
  isDisabled?: boolean; // 불린 컨벤션
  onClick?: (id: string) => void;
  onCheck?: (id: string, isChecked: boolean) => void;
};

// Table 관련 타입
export type TableColumnWidth = "checkbox" | "sm" | "md" | "lg" | "fill";
export type TableColumnAlign = "left" | "center" | "right";

export type TableColumn = {
  id: string;
  label: string;
  width?: TableColumnWidth;
  align?: TableColumnAlign;
};

export type TableRowData = {
  id: string;
  [key: string]: React.ReactNode;
  isSelected?: boolean;
  isDisabled?: boolean;
};

export type TableProps = {
  columns: TableColumn[];
  data: TableRowData[];
  isEmpty?: boolean;
  hasCheckbox?: boolean;
  isAllChecked?: boolean;
  onRowClick?: (id: string) => void;
  onRowCheck?: (id: string, isChecked: boolean) => void;
  onCheckAll?: (isChecked: boolean) => void;
};

// ----------------------------------------------------------------------
// 스타일 토큰 (상수)
// ----------------------------------------------------------------------

// --- List Item 스타일 ---
const listItemBaseClasses =
  "flex flex-row items-center w-full min-h-[64px] px-[20px] py-[16px] gap-[16px] border-b border-[color:var(--color-gray-200,#E5E5E5)] transition-colors duration-200 outline-none";

// --- Table 스타일 ---
const tableThBaseClasses =
  "bg-[color:var(--color-gray-100,#f2f2f2)] border-b border-t-2 border-[color:var(--color-gray-200,#e5e5e5)] h-12 px-5 py-3 text-[color:var(--color-gray-800,#333)] text-[16px] font-semibold leading-[1.5] tracking-[-0.4px]";
const tableTdBaseClasses =
  "border border-[color:var(--color-gray-200,#e5e5e5)] border-t-0 border-l-0 h-[56px] px-5 py-4 text-[color:var(--color-gray-800,#333)] text-[14px] leading-[1.43] tracking-[-0.35px]";

// 너비 맵핑 클래스
const columnWidthClasses: Record<TableColumnWidth, string> = {
  checkbox: "w-[48px]",
  sm: "w-[80px]",
  md: "w-[120px]",
  lg: "w-[200px]",
  fill: "",
};

// 정렬 맵핑 클래스
const columnAlignClasses: Record<TableColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ----------------------------------------------------------------------
// 함수
// ----------------------------------------------------------------------

const getListItemClasses = (isActive: boolean, isDisabled: boolean): string => {
  if (isDisabled) {
    return [listItemBaseClasses, "bg-white opacity-50 cursor-not-allowed"].join(" ");
  }

  const stateClasses = isActive
    ? "bg-[color:var(--color-primary-50,#F0F6FD)] border-[color:var(--color-primary-200,#B3D1F7)]"
    : "bg-white hover:bg-[color:var(--color-gray-50,#F9F9F9)] cursor-pointer group";

  return [listItemBaseClasses, stateClasses].join(" ");
};

const getTableRowClasses = (isSelected: boolean, isDisabled: boolean): string => {
  if (isDisabled) return "opacity-50 cursor-not-allowed";
  if (isSelected)
    return "bg-[color:var(--color-primary-50,#F0F6FD)] cursor-pointer transition-colors";
  return "hover:bg-[color:var(--color-gray-50,#F9F9F9)] cursor-pointer transition-colors";
};

// ----------------------------------------------------------------------
// 컴포넌트 정의
// ----------------------------------------------------------------------

// List Item Component
export const ListItem = ({
  id,
  title,
  description,
  imageUrl,
  metaPrimary,
  metaSecondary,
  hasCheckbox = false,
  isChecked = false,
  hasArrow = false,
  isActive = false,
  isDisabled = false,
  onClick,
  onCheck,
}: ListItemProps): React.ReactElement => {
  const handleItemClick = () => {
    if (!isDisabled && onClick) onClick(id);
  };

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled && onCheck) onCheck(id, !isChecked);
  };

  return (
    <div className={getListItemClasses(isActive, isDisabled)} onClick={handleItemClick}>
      {/* 체크박스 */}
      {hasCheckbox && (
        <div
          className="flex items-center justify-center w-[20px] h-[20px] flex-shrink-0"
          onClick={handleCheckClick}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              if (onCheck) {
                onCheck(id, !isChecked);
              }
            }}
            onClick={(e) => {
              // 부모 <li> 나 <div>에 걸려있는 onClick 이벤트로 버블링되는 것 방지=
              e.stopPropagation();
            }}
            disabled={isDisabled}
            className="w-4 h-4 cursor-pointer accent-[color:var(--color-primary-800,#004A9C)]"
          />
        </div>
      )}

      {/* 썸네일 이미지 */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={48}
          height={48}
          className="rounded-[8px] object-cover flex-shrink-0 border border-[color:var(--color-gray-200,#E5E5E5)]"
        />
      )}

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        <span
          className={`text-[16px] leading-[24px] font-medium truncate ${
            isActive
              ? "text-[color:var(--color-primary-800,#004A9C)]"
              : "text-[color:var(--color-gray-900,#1A1A1A)]"
          }`}
        >
          {title}
        </span>
        {description && (
          <span className="text-[14px] leading-[20px] text-[color:var(--color-gray-600,#666666)] line-clamp-2">
            {description}
          </span>
        )}
      </div>

      {/* 메타 정보 */}
      {(metaPrimary || metaSecondary) && (
        <div className="flex flex-col gap-[4px] items-end justify-center flex-shrink-0">
          {metaPrimary && (
            <span className="text-[14px] font-medium text-[color:var(--color-gray-900,#1A1A1A)]">
              {metaPrimary}
            </span>
          )}
          {metaSecondary && (
            <span className="text-[12px] text-[color:var(--color-gray-500,#808080)]">
              {metaSecondary}
            </span>
          )}
        </div>
      )}

      {/* 화살표 아이콘 */}
      {hasArrow && (
        <div
          className={`flex items-center justify-center w-[20px] h-[20px] flex-shrink-0 transition-colors ${
            isActive
              ? "text-[color:var(--color-primary-800,#004A9C)]"
              : "text-[color:var(--color-gray-300,#CCCCCC)] group-hover:text-[color:var(--color-primary-800,#004A9C)]"
          }`}
        >
          <ChevronRightIcon size={20} />
        </div>
      )}
    </div>
  );
};

// Table Component
export const Table = ({
  columns,
  data,
  isEmpty = false,
  hasCheckbox = false,
  isAllChecked = false,
  onRowClick,
  onRowCheck,
  onCheckAll,
}: TableProps): React.ReactElement => {
  const totalCols = columns.length + (hasCheckbox ? 1 : 0);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {hasCheckbox && (
            <th className={`${tableThBaseClasses} w-[48px] text-center`}>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={(e) => onCheckAll && onCheckAll(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-[color:var(--color-primary-800,#004A9C)]"
              />
            </th>
          )}
          {columns.map((col, i) => (
            <th
              key={col.id}
              className={[
                tableThBaseClasses,
                i > 0 || hasCheckbox ? "border-l" : "",
                columnWidthClasses[col.width || "fill"],
                columnAlignClasses[col.align || "center"],
              ].join(" ")}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isEmpty || data.length === 0 ? (
          <tr>
            <td colSpan={totalCols}>
              <div className="flex flex-col items-center justify-center w-full h-[200px] gap-2">
                <InboxIcon
                  size={48}
                  strokeWidth={1}
                  className="text-[color:var(--color-gray-400,#999999)]"
                />
                <span className="text-[14px] text-[color:var(--color-gray-500,#808080)]">
                  데이터가 없습니다
                </span>
              </div>
            </td>
          </tr>
        ) : (
          data.map((row) => {
            const isSelected = !!row.isSelected;
            const isDisabled = !!row.isDisabled;

            return (
              <tr
                key={row.id}
                className={getTableRowClasses(isSelected, isDisabled)}
                onClick={() => !isDisabled && onRowClick && onRowClick(row.id)}
              >
                {hasCheckbox && (
                  <td
                    className={`${tableTdBaseClasses} text-center`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled && onRowCheck) onRowCheck(row.id, !isSelected);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => onRowCheck && onRowCheck(row.id, !isSelected)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer accent-[color:var(--color-primary-800,#004A9C)]"
                    />
                  </td>
                )}
                {columns.map((col, i) => (
                  <td
                    key={col.id}
                    className={[
                      tableTdBaseClasses,
                      i === columns.length - 1 ? "border-r-0" : "",
                      columnAlignClasses[col.align || "center"],
                    ].join(" ")}
                  >
                    {row[col.id]}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

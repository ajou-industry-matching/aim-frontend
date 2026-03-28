import React from "react";

// ----------------------------------------------------------------------
// 1. 공통 유틸리티 및 아이콘 (내부 사용)
// ----------------------------------------------------------------------
const ChevronRightIcon = (): React.ReactElement => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InboxIcon = (): React.ReactElement => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[color:var(--color-gray-400,#999999)]"
  >
    <path
      d="M22 12H16L14 15H10L8 12H2V5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M2 12V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// ----------------------------------------------------------------------
// 2. 타입 정의 (interface 대신 type 선호 컨벤션 적용)
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
  [key: string]: React.ReactNode; // 각 열의 데이터 (키는 column의 id와 매칭)
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
// 3. 스타일 토큰 (상수)
// ----------------------------------------------------------------------

// --- List Item 스타일 ---
const listItemBaseClasses =
  "flex flex-row items-center w-full min-h-[64px] px-[20px] py-[16px] gap-[16px] border-b border-[color:var(--color-gray-200,#E5E5E5)] transition-colors duration-200 outline-none";

// --- Table 스타일 ---
const tableContainerClasses =
  "w-full flex flex-col border border-[color:var(--color-gray-200,#E5E5E5)] rounded-[8px] overflow-hidden bg-white";
const tableHeaderRowClasses =
  "flex flex-row items-center w-full h-[48px] px-[20px] py-[12px] bg-[color:var(--color-gray-50,#F9F9F9)] border-b-[2px] border-[color:var(--color-gray-300,#CCCCCC)]";
const tableRowBaseClasses =
  "flex flex-row items-center w-full min-h-[56px] px-[20px] py-[16px] border-b border-[color:var(--color-gray-200,#E5E5E5)] transition-colors duration-200";

// 너비 맵핑 클래스
const columnWidthClasses: Record<TableColumnWidth, string> = {
  checkbox: "w-[48px] flex-shrink-0",
  sm: "w-[80px] flex-shrink-0",
  md: "w-[120px] flex-shrink-0",
  lg: "w-[200px] flex-shrink-0",
  fill: "flex-1 min-w-0",
};

// 정렬 맵핑 클래스
const columnAlignClasses: Record<TableColumnAlign, string> = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

// ----------------------------------------------------------------------
// 4. 헬퍼 함수
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
  if (isDisabled) {
    return [tableRowBaseClasses, "bg-white opacity-50 cursor-not-allowed"].join(" ");
  }

  const stateClasses = isSelected
    ? "bg-[color:var(--color-primary-50,#F0F6FD)] border-[color:var(--color-primary-200,#B3D1F7)]"
    : "bg-white hover:bg-[color:var(--color-gray-50,#F9F9F9)] cursor-pointer";

  return [tableRowBaseClasses, stateClasses].join(" ");
};

// ----------------------------------------------------------------------
// 5. 컴포넌트 정의
// ----------------------------------------------------------------------

// ==========================================
// List Item Component
// ==========================================
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
            readOnly
            disabled={isDisabled}
            className="w-4 h-4 cursor-pointer accent-[color:var(--color-primary-800,#004A9C)]"
          />
        </div>
      )}

      {/* 썸네일 이미지 */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-[48px] h-[48px] rounded-[8px] object-cover flex-shrink-0 border border-[color:var(--color-gray-200,#E5E5E5)]"
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
          <ChevronRightIcon />
        </div>
      )}
    </div>
  );
};

// ==========================================
// Table Component
// ==========================================
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
  return (
    <div className={tableContainerClasses}>
      {/* Table Header */}
      <div className={tableHeaderRowClasses}>
        {hasCheckbox && (
          <div className={`${columnWidthClasses.checkbox} flex items-center justify-center`}>
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => onCheckAll && onCheckAll(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[color:var(--color-primary-800,#004A9C)]"
            />
          </div>
        )}
        {columns.map((col) => (
          <div
            key={col.id}
            className={`flex items-center ${columnWidthClasses[col.width || "fill"]} ${
              columnAlignClasses[col.align || "left"]
            }`}
          >
            <span className="text-[14px] font-semibold leading-[20px] text-[color:var(--color-gray-800,#333333)] truncate">
              {col.label}
            </span>
          </div>
        ))}
      </div>

      {/* Table Body (Empty State) */}
      {isEmpty || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-[200px] gap-2 bg-white">
          <InboxIcon />
          <span className="text-[14px] text-[color:var(--color-gray-500,#808080)]">
            데이터가 없습니다
          </span>
        </div>
      ) : (
        /* Table Body (Rows) */
        <div className="flex flex-col w-full">
          {data.map((row) => {
            const isSelected = !!row.isSelected;
            const isDisabled = !!row.isDisabled;

            const handleRowClick = () => {
              if (!isDisabled && onRowClick) onRowClick(row.id);
            };

            const handleCheckClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!isDisabled && onRowCheck) onRowCheck(row.id, !isSelected);
            };

            return (
              <div
                key={row.id}
                className={getTableRowClasses(isSelected, isDisabled)}
                onClick={handleRowClick}
              >
                {hasCheckbox && (
                  <div
                    className={`${columnWidthClasses.checkbox} flex items-center justify-center`}
                    onClick={handleCheckClick}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      disabled={isDisabled}
                      className="w-4 h-4 cursor-pointer accent-[color:var(--color-primary-800,#004A9C)]"
                    />
                  </div>
                )}
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className={`flex items-center ${columnWidthClasses[col.width || "fill"]} ${
                      columnAlignClasses[col.align || "left"]
                    }`}
                  >
                    <span className="text-[14px] leading-[20px] text-[color:var(--color-gray-600,#666666)] truncate w-full">
                      {row[col.id]}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export type LoadingSize = "small" | "medium" | "large";

export interface LoadingProps {
  /** 로딩 중 표시할 문구 (페이지마다 다르게 주입). 없으면 점만 표시 */
  text?: string;
  size?: LoadingSize;
  /** 전체 화면 오버레이로 표시 (페이지 이동 시 사용) */
  isFullScreen?: boolean;
  className?: string;
}

// 점마다 아주 블루 팔레트를 진 → 연으로 (물결 색상 그라데이션). 밝은 배경(인라인)용
const dotColorClasses = [
  "bg-[color:var(--color-primary-800,#004A9C)]",
  "bg-[color:var(--color-primary-600,#0066CC)]",
  "bg-[color:var(--color-primary-400,#5C9DE5)]",
] as const;

// 전체 화면은 진한 블루 아치 위에 얹히므로, 점도 밝은 톤(흰색 → 하늘색)으로 뒤집는다
const dotColorClassesOnCover = [
  "bg-white",
  "bg-[color:var(--color-primary-100,#E0EDFB)]",
  "bg-[color:var(--color-primary-300,#85B5EE)]",
] as const;

const dotSizeClasses: Record<LoadingSize, string> = {
  small: "h-1.5 w-1.5",
  medium: "h-2.5 w-2.5",
  large: "h-3.5 w-3.5",
};

const gapClasses: Record<LoadingSize, string> = {
  small: "gap-1",
  medium: "gap-1.5",
  large: "gap-2",
};

const textSizeClasses: Record<LoadingSize, string> = {
  small: "text-[12px] leading-[16px]",
  medium: "text-[14px] leading-[20px]",
  large: "text-[16px] leading-[24px]",
};

// 전체 화면에서 화면을 덮는 솔리드의 색(SVG path fill). 색만 바꾸려면 여기만 수정하면 된다.
const coverPanelColor = "var(--color-primary-800,#004A9C)";

// 전체 화면에서는 진한 블루 판 위에 글자가 얹히므로, 회색 대신 흰색으로 대비를 확보한다
const getTextClasses = (size: LoadingSize, isFullScreen: boolean) =>
  [
    isFullScreen
      ? "font-semibold text-white"
      : "font-medium text-[color:var(--color-gray-700,#4D4D4D)]",
    textSizeClasses[size],
  ].join(" ");

export const Loading = ({
  text,
  size = "medium",
  isFullScreen = false,
  className = "",
}: LoadingProps) => {
  const containerClasses = isFullScreen
    ? "fixed inset-0 z-[var(--z-modal,1050)] flex items-center justify-center overflow-hidden"
    : "inline-flex items-center justify-center";

  // 아치 솔리드는 z-0, 문구·점은 z-10 → 덮개가 항상 콘텐츠 뒤에 깔린다
  const contentClasses = [
    "relative flex flex-col items-center justify-center gap-3",
    isFullScreen ? "z-10 animate-loading-content-in" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const dotsWrapperClasses = ["flex items-end", gapClasses[size]].join(" ");

  const dotBaseClasses = [
    "inline-block rounded-full animate-wave-bounce",
    dotSizeClasses[size],
  ].join(" ");

  const dots = isFullScreen ? dotColorClassesOnCover : dotColorClasses;

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
      {isFullScreen && (
        // 솔리드가 아래에서 한 번 올라와 이전 화면을 덮는다 (반복 없음).
        // 윗변은 SVG 2차 베지어 — 가운데 컨트롤 포인트를 당겨 곡률을 만들었다가 마지막에 편다.
        <div className="loading-panel animate-panel-cover z-0" aria-hidden="true">
          <svg className="loading-panel-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              className="loading-panel-fill"
              fill={coverPanelColor}
              d="M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z"
            />
          </svg>
        </div>
      )}

      <div className={contentClasses}>
        {text && <p className={getTextClasses(size, isFullScreen)}>{text}</p>}

        <div className={dotsWrapperClasses} aria-hidden="true">
          {dots.map((colorClass, index) => (
            <span
              key={index}
              className={`${dotBaseClasses} ${colorClass}`}
              // 0.15s씩 순차 지연 → 물결 파동 (인라인 스타일이 shorthand animation 을 확실히 덮어씀)
              style={{ animationDelay: `${index * 0.15}s` }}
            />
          ))}
        </div>

        {/* text 가 없을 때 스크린리더용 대체 문구 */}
        {!text && <span className="sr-only">불러오는 중</span>}
      </div>
    </div>
  );
};

Loading.displayName = "Loading";

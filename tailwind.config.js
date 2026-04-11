/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 프로그레스 바 빗살무늬
      backgroundImage: {
        stripes:
          "linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)",
      },
      // 애니메이션 키프레임
      keyframes: {
        "progress-stripes": {
          "0%": { backgroundPosition: "1rem 0" },
          "100%": { backgroundPosition: "0 0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      // 애니메이션 클래스 생성
      animation: {
        "progress-stripes": "progress-stripes 1s linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
};

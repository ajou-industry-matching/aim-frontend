import { PolicyPage } from "@/shared/ui/policy-page/policy-page";

export const SitemapPage = (): React.ReactElement => {
  return (
    <PolicyPage
      title="사이트맵"
      description="AIM AJOU는 아주대학교 사이트맵을 함께 안내해 드립니다."
      externalUrl="https://www.ajou.ac.kr/kr/guide/sitemap.do"
      externalLinkLabel="아주대학교 사이트맵 확인하기"
    />
  );
};

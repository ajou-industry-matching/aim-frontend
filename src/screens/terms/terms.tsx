import { PolicyPage } from "@/shared/ui/policy-page/policy-page";

export const TermsPage = (): React.ReactElement => {
  return (
    <PolicyPage
      title="이용약관"
      description="AIM AJOU의 이용약관은 아주대학교 SOFTCON 페이지에서 확인하실 수 있습니다."
      externalUrl="https://softcon.ajou.ac.kr/community/privacy_policy.asp"
      externalLinkLabel="이용약관 확인하기"
    />
  );
};

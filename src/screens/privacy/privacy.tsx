import { PolicyPage } from "@/shared/ui/policy-page/policy-page";

export const PrivacyPage = (): React.ReactElement => {
  return (
    <PolicyPage
      title="개인정보처리방침"
      description="AIM AJOU는 아주대학교의 개인정보처리방침을 따릅니다. 자세한 내용은 아주대학교 공식 페이지에서 확인하실 수 있습니다."
      externalUrl="https://www.ajou.ac.kr/kr/guide/policy.do"
      externalLinkLabel="개인정보처리방침 확인하기"
    />
  );
};

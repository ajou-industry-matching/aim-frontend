import { PolicyPage } from "@/shared/ui/policy-page/policy-page";

export const PrivacyPage = (): React.ReactElement => {
  return (
    <PolicyPage
      title="개인정보처리방침"
      externalUrl="https://www.ajou.ac.kr/kr/guide/policy.do"
      externalLinkLabel="개인정보처리방침"
    />
  );
};

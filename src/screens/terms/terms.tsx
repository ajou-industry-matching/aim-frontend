import { PolicyPage } from "@/shared/ui/policy-page/policy-page";

export const TermsPage = (): React.ReactElement => {
  return (
    <PolicyPage
      title="이용약관"
      externalUrl="https://softcon.ajou.ac.kr/community/privacy_policy.asp"
      externalLinkLabel="이용약관"
    />
  );
};

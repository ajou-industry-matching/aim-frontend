import type { AuthRole, BackendLoginRequest } from "./auth-api";

export const GOOGLE_PROFILE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/user.organization.read",
] as const;

type PeopleApiName = {
  displayName?: string;
  metadata?: {
    primary?: boolean;
  };
};

type PeopleApiOrganization = {
  name?: string;
  department?: string;
  title?: string;
  metadata?: {
    primary?: boolean;
  };
};

export class GoogleProfileRoleError extends Error {
  constructor() {
    super("Google profile role could not be resolved.");
    this.name = "GoogleProfileRoleError";
  }
}

type PeopleApiProfile = {
  names?: PeopleApiName[];
  organizations?: PeopleApiOrganization[];
};

const getPrimaryItem = <T extends { metadata?: { primary?: boolean } }>(
  items?: T[],
): T | undefined => items?.find((item) => item.metadata?.primary) ?? items?.[0];

const inferAuthRole = (organization?: PeopleApiOrganization): AuthRole => {
  const profileText = [organization?.title, organization?.department, organization?.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(student|undergraduate|graduate|[1-6]\s*학년|학부생|대학원생|학생)/i.test(profileText)) {
    return "STUDENT";
  }

  if (/(professor|faculty|교수|교원)/i.test(profileText)) {
    return "PROFESSOR";
  }

  if (/(staff|employee|worker|직원|행정)/i.test(profileText)) {
    throw new GoogleProfileRoleError();
  }

  return "STUDENT";
};

export const fetchGoogleProfile = async (accessToken: string): Promise<BackendLoginRequest> => {
  const params = new URLSearchParams({
    personFields: "names,organizations",
  });

  const response = await fetch(`https://people.googleapis.com/v1/people/me?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Google People API profile request failed.");
  }

  const profile = (await response.json()) as PeopleApiProfile;
  const primaryName = getPrimaryItem(profile.names);
  const primaryOrganization = getPrimaryItem(profile.organizations);

  return {
    role: inferAuthRole(primaryOrganization),
    name: primaryName?.displayName?.trim() || "이름 미입력",
    department:
      primaryOrganization?.department?.trim() ||
      primaryOrganization?.name?.trim() ||
      primaryOrganization?.title?.trim() ||
      "",
  };
};

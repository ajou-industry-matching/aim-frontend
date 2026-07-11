import { AdminUsersDetailPage } from "@/screens/admin";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function AdminUsersDetailRoute({ params }: Props) {
  const { id } = await params;
  return <AdminUsersDetailPage id={id} />;
}

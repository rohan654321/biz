
import OrganizerDashboard from "./sidebr"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function OrganizerDashboardPage() {
  return <OrganizerDashboard />
}

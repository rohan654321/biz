
import OrganizerDashboard from "./sidebar"
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth-options";
// import { redirect } from "next/navigation";

export default async function OrganizerDashboardPage() {
  // const session = await getServerSession(authOptions)
  // if (!session || session.user.role !== "organizer") {
  //   redirect("/login")
  // }
  return <OrganizerDashboard />
}

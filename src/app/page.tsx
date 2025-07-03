import DashboardView from "@/components/dashboard/DashboardView";
import { fetchDashboard } from "@/store/features/dashboardSlice";
import { store } from "@/store/store";
import { IDashboardSummary } from "@/store/types";

export default async function Home() {
  await store.dispatch(fetchDashboard());
  const { summary, status } = store.getState().dashboard;

  if (status === "loading") {
    return (
      <div className="text-center mt-20" style={{ color: "var(--foreground)" }}>
        Loading...
      </div>
    );
  }

  return <DashboardView dashboard={summary as IDashboardSummary} />;
}

import { LiveCctvCard } from "./_components/live-cctv-card";
import { recentLeadsData } from "./_components/crm.config";
import { InsightCards } from "./_components/insight-cards";
import { OperationalCards } from "./_components/operational-cards";
import { OverviewCards } from "./_components/overview-cards";
import { RecentLeadsTable } from "./_components/recent-leads-table/table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-0">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <LiveCctvCard className="h-full" />
        <div className="h-full">
          <OverviewCards className="xl:grid-cols-2 gap-4" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <InsightCards />
        {/* <OperationalCards /> */}
        <RecentLeadsTable data={recentLeadsData} />
      </div>
    </div>
  );
}

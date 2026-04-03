import { InsightCards } from "./_components/insight-cards";
import { LiveCctvCard } from "./_components/live-cctv-card";
import { OverviewCards } from "./_components/overview-cards";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-0">
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <LiveCctvCard className="h-full" />
        <div className="h-full">
          <OverviewCards className="gap-4 xl:grid-cols-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <InsightCards />
        {/* <OperationalCards /> */}
        {/* <RecentLeadsTable data={recentLeadsData} /> */}
      </div>
    </div>
  );
}

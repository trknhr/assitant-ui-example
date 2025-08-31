import { MyRuntimeProvider } from "./MyRuntimeProvider";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";
import { WeatherApprovalTool } from "@/components/assistant-ui/weather-tool";

export default function Home() {

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-5xl">
        <MyRuntimeProvider>
          <div className="flex w-full gap-8" style={{ minHeight: 600 }}>
            <div className="flex-shrink-0 basis-3/12 max-w-xs">
              <ThreadList />
            </div>
            <div className="flex-grow basis-7/12">
              <WeatherApprovalTool />
              <Thread />
            </div>
          </div>
        </MyRuntimeProvider>
      </main>
    </div>
  );
}

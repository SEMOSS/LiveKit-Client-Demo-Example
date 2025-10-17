import "../../index.css";
import { useInsight } from "@semoss/sdk/react";
import useFetchUserData from "../../hooks/useFetchUserData";
import LiveKitContainer from "../../components/containers/livekit-container";

import ModelsSidebarStatic from "../../components/containers/sidebar2";
import MobileSidebar from "../../components/containers/mobile-sidebar";
function App() {
  const { isAuthorized } = useInsight();
  const userStore = useFetchUserData();

  const authMessage = isAuthorized
    ? "User is authorized!"
    : "User is not authorized!";

  const noAuthJsx = (
    <div className="text-red-500">
      <p>{authMessage}</p>
      <p>Please log in to continue.</p>
    </div>
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <header className="text-center">{noAuthJsx}</header>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-svh
        
      "
    >
      {/* <ModelsSidebarStatic /> */}
      <main>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          {/* <MobileSidebar /> */}
          <h1 className="font-semibold">LiveKit Demo</h1>
        </header>
        <div className="w-full">
          <LiveKitContainer />
          <div />
        </div>
      </main>
    </div>
  );
}

export default App;

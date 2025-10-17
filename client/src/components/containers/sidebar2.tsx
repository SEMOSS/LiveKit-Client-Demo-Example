import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Server } from "lucide-react";
import { BsSoundwave } from "react-icons/bs";
import TestButton from "../test/testButton";

const ModelsSidebarStatic = observer(() => {
  return (
    <aside
      className="
        hidden md:flex md:flex-col
        w-64 lg:w-72 flex-shrink-0
        h-svh sticky top-0
        border-r bg-sidebar text-sidebar-foreground
        overflow-y-auto
      "
    >
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Server className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-semibold truncate">Model Demos</span>
            <span className="text-xs text-muted-foreground truncate">
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="p-2 space-y-4">
        {/* <div>
          <div className="h-8 flex items-center px-2 text-xs font-medium text-sidebar-foreground/70">
            Testing
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <li>
              <TestButton />
            </li>
          </ul>
        </div> */}

        {/* Add more groups here if needed */}
      </div>
    </aside>
  );
});

export default ModelsSidebarStatic;

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Outlet } from 'react-router-dom';

import DefaultModal from '@/shared/components/DefaultModal';
import Navigation from '@/shared/components/Navigation';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar';
import { Toaster } from '@/shared/components/ui/sonner';

const DefaultLayout = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full min-h-[100vh] w-full">
        <DefaultModal />
        <Toaster />
        {/* 내비게이션 */}
        {/* <div className="h-[78px] w-full bg-white border border-b-[#D0D5DD] z-50 flex items-center px-10 fixed">
        <p className="text-2xl font-bold">Sync-Insight</p>
      </div> */}
        <SidebarProvider className="flex h-auto min-h-0 w-full">
          <Navigation />
          <SidebarTrigger />
          <div
            id="prototype-body"
            className="flex h-full w-full flex-col p-5 pb-20"
          >
            <Outlet />
          </div>
        </SidebarProvider>
      </div>
    </DndProvider>
  );
};

export default DefaultLayout;

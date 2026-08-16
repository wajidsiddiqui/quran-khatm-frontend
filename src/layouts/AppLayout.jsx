import { Outlet } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="max-w-md md:max-w-xl mx-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

export default function HeatmapPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">Heatmap coming in Next sprint</p>
        </div>
      </div>
    </div>
  );
}
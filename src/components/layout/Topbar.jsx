export default function Topbar() {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-sm font-medium text-slate-600">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <button className="text-sm bg-slate-100 px-3 py-1 rounded-lg">
          Upgrade
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
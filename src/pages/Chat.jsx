export default function Chat() {
  return (
    <div className="bg-white rounded-xl border h-full flex flex-col">
      
      <div className="border-b px-4 py-3 text-sm font-medium">
        AI Chat
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-500">
        Your conversation will appear here...
      </div>

      <div className="border-t p-3 flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Ask anything..."
        />
        <button className="bg-black text-white px-4 rounded-lg text-sm">
          Send
        </button>
      </div>
    </div>
  );
}
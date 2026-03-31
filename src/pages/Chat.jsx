import { useApiQuery } from "@/lib/apiHooks";

const Chat = () => {
  const { data, isLoading } = useApiQuery(
    ["chatMessages"],
    "/api/chat/messages"
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Chat</h1>

      <pre className="bg-gray-100 p-4 rounded-md">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default Chat;
import { useApiMutation } from "@/lib/apiHooks";

const Settings = () => {
  const mutation = useApiMutation("/api/user/settings", "POST", {
    successMessage: "Settings saved!",
  });

  const handleSave = () => {
    mutation.mutate({
      theme: "dark",
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
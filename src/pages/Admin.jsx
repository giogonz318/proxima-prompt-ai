const Admin = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Only users with admin role can access this page.
      </p>
    </div>
  );
};

export default Admin;
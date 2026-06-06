const User = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Welcome, User!</h2>
        <p className="text-secondary">This is the regular user protected area. You have standard access permissions.</p>
      </div>
    </div>
  );
};

export default User;

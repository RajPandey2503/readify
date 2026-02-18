function Profile() {
  const user = localStorage.getItem("user");

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>User Profile</h1>

      {user ? (
        <>
          <p><strong>Name:</strong> {user}</p>
          <p>Status: Logged In</p>
        </>
      ) : (
        <p>Please login first.</p>
      )}
    </div>
  );
}

export default Profile;

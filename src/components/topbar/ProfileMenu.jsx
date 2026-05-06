export default function ProfileMenu({ user }) {
  return (
    <div style={styles.wrapper}>
      {getInitials(user.name)}

      <div style={styles.dropdown}>
        <div>👤 {user.name}</div>
        <div>Role: {user.role}</div>
        <hr />
        <div>⚙️ Profile Settings</div>
        <div>🔐 Permissions</div>
        <div>🚪 Logout</div>
      </div>
    </div>
  )
}

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
}

const styles = {
  wrapper: {
    position: "relative",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#38bdf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 40,
    background: "#0f172a",
    padding: 10,
    borderRadius: 10,
    display: "none",
  }
}
import { Link } from "react-router";

export default function Navbar() {
  const classes = ["5a", "5b", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "9d"];

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/">🏫 Bosh sahifa</Link>
      {" | "}
      {classes.map((cls) => (
        <Link key={cls} to={`/class/${cls}`} style={{ margin: "0 8px" }}>
          {cls.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}

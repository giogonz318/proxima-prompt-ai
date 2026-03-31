import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Page not found</p>

      <Link to="/" style={styles.link}>
        Go back home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "4rem",
    margin: 0,
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    opacity: 0.7,
  },
  link: {
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
  },
};
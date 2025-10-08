import { Link, Outlet, useNavigate } from "react-router-dom";

export default function App() {
  const nav = useNavigate();
  const authed = !!localStorage.getItem("token");

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">INSY7314 Bank Client</div>
        <nav className="nav">
          {!authed && <Link className="btn btn-ghost" to="/register">Register</Link>}
          {!authed && <Link className="btn btn-ghost" to="/login">Login</Link>}
          {authed && <Link className="btn btn-ghost" to="/payments">Pay</Link>}
          {authed && (
            <a className="btn btn-ghost" href="#logout" onClick={logout}>
              Logout
            </a>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">© {new Date().getFullYear()} INSY7314</footer>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg bg-dark ">
      <div className="container-fluid ">
        <Link className="navbar-brand text-primary" to="/">
          Events
        </Link>
        <button
          className="navbar-toggler "
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active text-primary"
                to="/upcoming-events"
              >
                Upcoming Events
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-primary active " to="/archives">
                Archives
              </Link>
            </li>
            <li className="nav-item ">
              <Link
                className="nav-link active text-primary"
                to="/eventcreationform"
              >
                Create Event
              </Link>
            </li>
          </ul>
          {!user && (
            <>
              <div className="m-2">
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline-primary"
                >
                  Login
                </button>
              </div>
              <div className="m-2 ">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
          {user && (
            <ul className="navbar-nav ">
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle text-primary"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {user}
                </span>
                <ul className="dropdown-menu bg-dark ">
                  <li>
                    <Link className="dropdown-item text-primary" to="/profile">
                      My profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-primary"
                      to="/organised-events"
                    >
                      Organised events
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-primary"
                      to="/participated-events"
                    >
                      Participated events
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-primary"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          )}
          <form className="d-flex" role="search">
            <SearchBar />
          </form>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

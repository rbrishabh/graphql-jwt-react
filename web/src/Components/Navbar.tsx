import React from "react";
import { Link, useHistory } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import "./style.css";

const Navbar: React.FC = () => {
  const history = useHistory();
  const [logout, { client }] = useLogoutMutation();
  const { data, loading } = useMeQuery();
  if (loading) {
    return <div> Loading....</div>;
  }
  return (
    <div className="navbar">
      {(!data || !data.me) && (
        <Link className="navlinks" to="/login">
          Login
        </Link>
      )}

      {!loading && data && data.me ? (
        <>
          <Link className="navlinks" to="/">
            Search
          </Link>
          <button
            className="nav-button"
            onClick={async () => {
              await logout();
              setAccessToken("");
              await client.resetStore();
              history.push("/login");
            }}
          >
            Logout
          </button>
        </>
      ) : null}
    </div>
  );
};
export default Navbar;

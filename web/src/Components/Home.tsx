import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../generated/graphql";
import Layout from "./Layout";
import "./style.css";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const [isLogin, setIsLogin] = React.useState(true);

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const doAction = async () => {
    if (isLogin) {
      const response = await login({
        variables: credentials,
        update: (store, { data }) => {
          if (!data) {
            return null;
          }

          store.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          });
        },
      });
      if (response && response.data) {
        setAccessToken(response.data.login.accessToken);
      }
      setCredentials({ email: "", password: "" });
      history.push("/");
    } else {
      await register({
        variables: credentials,
      });
      setCredentials({ email: "", password: "" });
      setIsLogin(true);
    }
  };

  return (
    <Layout>
      <div className="home-container">
        <h1>
          {isLogin ? "Login" : "Signup"} | or{" "}
          <button
            onClick={() => setIsLogin((isLogin) => !isLogin)}
            className="actionButton"
          >
            {isLogin ? "Signup" : "Login"}
          </button>{" "}
        </h1>
        <input
          className="home-container-items input"
          placeholder="email"
          onChange={(e) =>
            setCredentials((state) => {
              return { ...state, email: e.target.value };
            })
          }
          type="text"
          name="email"
          value={credentials.email}
        />
        <input
          className="home-container-items input"
          placeholder="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((state) => {
              return { ...state, password: e.target.value };
            })
          }
          type="password"
          name="password"
        />
        <button className="home-container-items button" onClick={doAction}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </Layout>
  );
};
export default Home;

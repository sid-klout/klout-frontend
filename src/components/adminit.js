import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import MasterLayout from "./layouts/admin/MasterLayout";
import Page404Dashboard from "./errors/Page404Dashboard";
import { Route, Redirect, useHistory } from "react-router-dom";

function AdminPrivateRoute({ ...rest }) {
  const history = useHistory();

  const [Authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/checkingAuthenticated`)
      .then((res) => {
        if (res.status === 200) {
          setAuthenticated(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            // console.log(
            //   "Unauthorized access. Redirect or handle accordingly."
            // );
            setAuthenticated(false);
            // history.push("/login");
          }
        } else if (error.request) {
          console.error("No response received. Check your network connection.");
        } else {
          console.error("Error:", error.message);
        }
      });

    return () => {
      setAuthenticated(false);
    };
  }, []);

  axios.interceptors.response.use(
    undefined,
    function axiosRetryInterceptor(err) {
      if (
        err.response.status === 401 ||
        err.response.statusText === "Unauthenticated"
      ) {
        swal("Unauthorized", err.response.data.message, "warning");
        history.push("/");
      }
      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 403) {
        swal("Forbidden", error.response.data.message, "warning");
        history.push("/403");
      } else if (error.response.status === 404) {
        swal("Page Not Found", "Url/Page Not Found", "warning");
        history.push("/404");
      }
      return Promise.reject(error);
    }
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Route
      {...rest}
      render={({ props, location }) =>
        Authenticated ? (
          <MasterLayout {...props} />
        ) : (
          // <Redirect to={{ pathname: "/login", state: { from: location } }} />
          <>
            {/* <Route path="admin/*" component={Page404Dashboard} /> */}
            <Redirect to="/admin/404" />
          </>
        )
      }
    />
  );
}

export default AdminPrivateRoute;

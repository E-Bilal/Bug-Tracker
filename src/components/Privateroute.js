import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./Provider";
import React from "react";
import { Route, Redirect } from "react-router";

export default function PrivateRoute({ component: Component, ...rest }) {
  const providerAuth = useContext(AuthContext);
  return (
    providerAuth.loading && (
      <div>
        <Route
          {...rest}
          render={(props) => {
            if (!providerAuth.session) {
              return <Redirect to="Login" />;
            } else {
              return <Component {...props} />;
            }
          }}
        ></Route>
      </div>
    )
  );
}

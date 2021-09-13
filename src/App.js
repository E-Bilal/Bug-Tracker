import AuthProvider from "./components/Provider";
import { ChakraProvider } from "@chakra-ui/react";
import Account from "./components/Settings";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Recoverpassword from "./components/PasswordForEmail";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import PrivateRoute from "./components/Privateroute";
import ReportBug from "./components/ReportBug";
import Avataroo from "./components/Testingstuffout";
import Dashboard from "./components/Dashboard";
export default function Homeso(props) {
  return (
    <Router>
      <Switch>
        <AuthProvider>
          <ChakraProvider>
            <Route path="/" exact>
              <Redirect to="dashboard" />
            </Route>
            <PrivateRoute path="/settings" component={Account} />
            <Route path="/password-reset" component={Recoverpassword} />
            <Route path="/test" component={Avataroo} />
            <PrivateRoute path="/Dashboard" component={Dashboard} />
            <PrivateRoute path="/reportbug" component={ReportBug} />
            <Route path="/Signup" component={Signup} />
            <Route path="/Login" component={Login} />
          </ChakraProvider>
        </AuthProvider>
      </Switch>
    </Router>
  );
}

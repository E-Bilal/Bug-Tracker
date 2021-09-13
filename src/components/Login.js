import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import ThemeToggler from "./Themetoggler";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      setError(error.error_description || error.message);
      return setLoading(false);
    }

    setLoading(false);
    history.push("dashboard");
  };

  return (
    <Box bg={useColorModeValue("gray.50", "gray.800")} height="100vh">
      <ThemeToggler />
      <Flex align={"center"} justify={"center"} mt={"120px"}>
        <Stack spacing={6} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}></Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Box color={"red.500"}>{error}</Box>
              <Stack spacing={10}>
                <Text
                  align={"right"}
                  _hover={{
                    color: "blue.500",
                    textDecoration: "underline",
                  }}
                >
                  <Link to="/password-reset">Forgot Password ?</Link>
                </Text>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={(e) => {
                    handleLogin();
                  }}
                  disabled={loading}
                >
                  {loading ? <span>Loading</span> : <span>Login</span>}
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Text
            textAlign={"center"}
            _hover={{
              color: "blue.500",
              textDecoration: "underline",
            }}
          >
            <Link to="Signup">Need an account? Sign up.</Link>
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Login;

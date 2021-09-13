import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";
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

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const handleSignUp = async () => {
    if (password !== passwordConfirm) {
      setError("Passwords don't match");
    } else {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;
      } catch (error) {
        setError(error.error_description || error.message);
        return setLoading(false);
      }
      setLoading(false);
      setMessage("Check your inbox for further instructions.");
    }
  };

  return (
    <Box bg={useColorModeValue("gray.50", "gray.800")}>
      <ThemeToggler />
      <Flex align={"center"} justify={"center"} mt={"120px"}>
        <Stack spacing={6} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create a new account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}></Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <Box color={"green.500"}>{message}</Box>
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
              <FormControl id="password">
                <FormLabel>Password Confirmation</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </FormControl>
              <Box color={"red.500"}>{error}</Box>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={(e) => {
                    handleSignUp();
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
            <Link to="Login">Already have an account? Sign in.</Link>
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}

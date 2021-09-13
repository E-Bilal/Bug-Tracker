import { useState } from "react";
import React from "react";
import { supabase } from "./supabaseClient";
import ThemeToggler from "./Themetoggler";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  FormLabel,
  Box,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Recoverpassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);

      if (error) throw error;
    } catch (error) {
      console.log(error);
      setError(error.error_description || error.message);
      return setLoading(false);
    }
    setLoading(false);
    setMessage("Check your inbox for further instructions.");
  };
  return (
    <Box bg={useColorModeValue("gray.50", "gray.800")}>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "2xl", md: "3xl" }}
            textAlign={"center"}
          >
            Forgot your password?
          </Heading>
          <Text color={"green.500"}>{message}</Text>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </FormControl>
          <Stack spacing={6}>
            <Text color={"red.500"}>{error}</Text>

            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleReset(email);
              }}
            >
              Request Reset
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
}

import { useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient";
import { AuthContext } from "./Provider";
import ThemeToggler from "./Themetoggler";
import { useHistory, Redirect } from "react-router";
import Navbar from "./Navbar";
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
  Select,
  useColorModeValue,
  HStack,
  Divider,
  Textarea,
} from "@chakra-ui/react";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const providerAuth = useContext(AuthContext);
  const [username, setUsername] = useState(null);
  const [child, setChild] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  let history = useHistory();

  useEffect(() => {
    getProfile();
  }, [providerAuth.session]);

  useEffect(() => {}, [role]);

  const handleCallback = (childData) => {
    console.log(childData);
    setChild({ childData });
    console.log(child);
  };

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      setUserId(user.id);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url,id,role`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setRole(data.role);
        //      setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  const [loading1, setLoading1] = useState(true);
  const [password, setPassword] = useState("");
  const [new_password, setNewPasswrd] = useState("");

  const testing = useContext(AuthContext);
  const email = testing.session.user.email;

  const handlePassChange = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      alert("Old password is incorrect.");
      setLoading(false);
      return history.push("password-reset");
    }

    try {
      const { error } = await supabase.auth.api.updateUser(
        testing.session.access_token,
        {
          password: new_password,
        }
      );
      if (error) throw error;
    } catch (error) {
      setError("Something went wrong , try again.");
      return setLoading(false);
    }
    console.log("hello");
    setMessage("Password changed successfully");
  };

  async function changeRole() {
    let updateRole = "";
    if (role === "dev") {
      updateRole = "client";
    } else {
      updateRole = "dev";
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: updateRole })
      .match({ id: userId });
    console.log(data.role);
    setRole(updateRole);
  }

  return (
    <>
      <Navbar />
      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Flex align={"center"} justify={"center"}>
          <Stack spacing={6} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Heading textAlign={"center"} fontSize={"4xl"}>
              Settings
            </Heading>

            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={"4"}>
                <Heading textAlign={"center"} size={"md"}>
                  Change password
                </Heading>
                <FormControl id="email">
                  <HStack>
                    <FormLabel minW={"110px"}>Old Password</FormLabel>
                    <Input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </HStack>
                </FormControl>

                <FormControl id="password">
                  <HStack>
                    <FormLabel minW={"110px"}> New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      onChange={(e) => setNewPasswrd(e.target.value)}
                    />
                  </HStack>
                </FormControl>
                <Stack>
                  {" "}
                  {error ? (
                    <Text mb={"10px"} mt={"-5px"} color={"red.500"}>
                      {error}
                    </Text>
                  ) : (
                    <Text mb={"10px"} mt={"-5px"} color={"green.500"}>
                      {message}
                    </Text>
                  )}
                </Stack>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePassChange(
                      email,
                      password,
                      testing.session.access_token,
                      new_password
                    );
                  }}
                >
                  Change Password
                </Button>
                <Divider />
              </Stack>
              <Stack spacing={"4"}>
                <Heading textAlign={"center"} size={"md"} pt={"15px"}>
                  Change Role
                </Heading>
                <FormControl id="role">
                  <HStack>
                    <FormLabel minW={"110px"} textAlign={"center"}>
                      Current role
                    </FormLabel>
                    <FormLabel>{role}</FormLabel>
                  </HStack>
                </FormControl>

                <Stack>
                  {" "}
                  {error ? (
                    <Text mb={"10px"} mt={"-5px"} color={"red.500"}>
                      {error}
                    </Text>
                  ) : (
                    <Text mb={"10px"} mt={"-5px"} color={"green.500"}>
                      {message}
                    </Text>
                  )}
                </Stack>
                <Button onClick={changeRole}>
                  Change Role (testing purpose)
                </Button>
                <Divider />
              </Stack>
              <Stack spacing={"4"}>
                <Heading textAlign={"center"} size={"md"} pt={"15px"}>
                  Colormode
                </Heading>
                <FormControl id="email">
                  <HStack>
                    <FormLabel minW={"110px"}>Colormode</FormLabel>
                    <Stack pl={"25px"}>
                      {" "}
                      <ThemeToggler />
                    </Stack>
                  </HStack>
                </FormControl>

                <Divider />
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}

//   return testing.session ? (
//     <div>
//       <div>

//       </div>

//         Confirm Password Change
//       </button>
//       {console.log(testing.session.user)}
//       {testing.session.user.role === "admin" ? (
//         <div>YOU ARE AN ADMIN</div>
//       ) : (
//         <div>You are a guest</div>
//       )}

//       {testing.event === "PASSWORD_RECOVERY" ? (
//         <div>PASSWORD_RECOVERY event recognized</div>
//       ) : null}
//     </div>
//   ) : (
//     <Redirect to="Login" />
//   );
// }

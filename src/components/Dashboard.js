import { useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient";
import DetailedBacklog from "./DetailedBacklog";
import Navbar from "./Navbar";
import { AuthContext } from "./Provider";
import DetailedInprogress from "./DetailedInProgress";
import DetailedDone from "./DetailedDone";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Image,
  Heading,
  propNames,
  Spinner,
} from "@chakra-ui/react";

export default function Dashbaord() {
  const [backlogData, setBacklogData] = useState([]);
  const [inProgressData, setInProgressData] = useState([]);
  const [doneData, setDoneData] = useState([]);
  //   const [rowData, setRowdata] = useState(null);
  const color = useColorModeValue("white", "gray.700");
  const [working, setWorking] = useState(false);
  const [id, setId] = useState(null);
  const [doneId, setDoneId] = useState(null);
  const [doneLoading, setDoneLoading] = useState(false);
  const [inProgressLoading, setInProgressLoading] = useState(false);
  const [inProgressId, setInProgressId] = useState(null);
  const [value, setValue] = useState("");
  const [role, setRole] = useState("");

  const [loadingRole, setLoadingRole] = useState(true);
  const providerAuth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchingData();
  }, [JSON.stringify(backlogData)]);

  useEffect(() => {
    fetchingData();
  }, [JSON.stringify(inProgressData)]);

  useEffect(() => {
    getProfile();
  }, [providerAuth.session]);

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  async function fetchingData() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("bugs").select();
      setBacklogData(data);

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    try {
      const { data, error } = await supabase.from("inprogress").select();
      setInProgressData(data);

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    try {
      const { data, error } = await supabase.from("done").select();
      setDoneData(data);

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  }

  async function testing(id) {
    setId(id);
    setWorking(true);
    setValue(1);
  }

  async function inProgress(id) {
    setInProgressId(id);
    setInProgressLoading(true);
    setValue(2);
  }

  async function done(id) {
    setDoneId(id);
    setDoneLoading(true);
    setValue(3);
  }

  async function getProfile() {
    try {
      setLoadingRole(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`role`)
        .eq("id", user.id)
        .single();
      setRole(data.role);
      console.log(typeof data.role);

      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingRole(false);
    }
  }
  return (
    <>
      {loading ? (
        <Flex align={"center"} justify={"center"} height="100vh">
          <Spinner />{" "}
        </Flex>
      ) : (
        <Box>
          <Navbar />
          <Flex ml={"20px"}>
            <Box p={4} width={"33%"}>
              {" "}
              <Heading
                fontSize={"3xl"}
                mb={"10px"}
                mt={"25px"}
                textAlign={"center"}
              >
                Backlog
              </Heading>
              {backlogData.map((x) => (
                <Box
                  as="button"
                  rounded={"lg"}
                  bg={color}
                  boxShadow={"lg"}
                  mb={"15px"}
                  width={"100%"}
                  _hover={{
                    bg: "gray.600",
                  }}
                  onClick={() => {
                    testing(x.id);
                    onOpen();
                  }}
                >
                  <Text p={"15px"} textAlign={"left"}>
                    {x.title}
                  </Text>

                  <HStack spacing={"4"} px={"10px"} pb={"15px"}>
                    <Box
                      rounded={"md"}
                      boxShadow={"md"}
                      bgColor={"#FFA500"}
                      px={"40px"}
                    >
                      {x.priority}
                    </Box>
                    <Box
                      rounded={"md"}
                      boxShadow={"md"}
                      bgColor={"#FFA500"}
                      px={"40px"}
                    >
                      {x.browser}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </Box>

            <Box p={4} width={"33%"}>
              {" "}
              <Heading
                fontSize={"3xl"}
                mb={"10px"}
                mt={"25px"}
                textAlign={"center"}
              >
                In Progress
              </Heading>
              {inProgressData.map((x) => (
                <Box
                  as="button"
                  rounded={"lg"}
                  bg={color}
                  boxShadow={"lg"}
                  mb={"15px"}
                  width={"100%"}
                  _hover={{
                    bg: "gray.600",
                  }}
                  onClick={() => {
                    inProgress(x.id);
                    onOpen1();
                  }}
                >
                  <Text p={"15px"} textAlign={"left"}>
                    {x.title}
                  </Text>
                  <Box display={"none"}> {x.id}</Box>

                  <HStack spacing={"4"} px={"10px"} pb={"15px"}>
                    <Box
                      rounded={"md"}
                      boxShadow={"md"}
                      bgColor={"#FFA500"}
                      px={"40px"}
                    >
                      {x.priority}
                    </Box>
                    <Box
                      rounded={"md"}
                      boxShadow={"md"}
                      bgColor={"#FFA500"}
                      px={"40px"}
                    >
                      {x.browser}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </Box>
            <Box p={4} width={"33%"}>
              {" "}
              <Heading
                fontSize={"3xl"}
                mb={"10px"}
                mt={"25px"}
                textAlign={"center"}
              >
                Done
              </Heading>
              {doneData.map((x) => (
                <Box
                  as="button"
                  rounded={"lg"}
                  bg={color}
                  boxShadow={"lg"}
                  mb={"15px"}
                  width={"100%"}
                  _hover={{
                    bg: "gray.600",
                  }}
                  onClick={() => {
                    done(x.id);
                    onOpen2();
                  }}
                >
                  <Text p={"15px"} textAlign={"left"}>
                    {x.title}
                  </Text>
                  <Box display={"none"}> {x.id}</Box>

                  <HStack spacing={"4"} px={"10px"} pb={"15px"}>
                    <Box
                      rounded={"md"}
                      boxShadow={"md"}
                      bgColor={"#FFA500"}
                      px={"40px"}
                    >
                      {x.priority}
                    </Box>
                    <Box
                      rounded={"md"}
                      boxShadow={"md"}
                      bgColor={"#FFA500"}
                      px={"40px"}
                    >
                      {x.browser}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </Box>
          </Flex>

          {working && (
            <DetailedBacklog
              fetchingData={fetchingData}
              onOpen={onOpen}
              isOpen={isOpen}
              id={id}
              onClose={onClose}
              value={value}
              role={role}
            />
          )}

          {inProgressLoading && (
            <DetailedInprogress
              fetchingData={fetchingData}
              onOpen1={onOpen1}
              isOpen1={isOpen1}
              inProgressId={inProgressId}
              onClose1={onClose1}
              value={value}
              role={role}
            />
          )}

          {doneLoading && (
            <DetailedDone
              fetchingData={fetchingData}
              onOpen2={onOpen2}
              isOpen2={isOpen2}
              doneId={doneId}
              onClose2={onClose2}
              value={value}
              role={role}
            />
          )}
        </Box>
      )}
    </>
  );
}

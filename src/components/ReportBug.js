import { useState } from "react";
import UploadImage from "./UploadImages";
import { supabase } from "./supabaseClient";
import { Redirect } from "react-router-dom";
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
  Textarea,
} from "@chakra-ui/react";

export default function ReportBug() {
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [browser, setBrowser] = useState("Firefox");
  const [enviroment, setEnviroment] = useState("Windows");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [child, setChild] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCallback = (childData) => {
    setChild(childData);
    console.log(childData);
  };

  async function SubmitBugReport() {
    setError("");
    setMessage("");
    if (!title || !issue || !description) {
      return setError("Please fill in the required fields");
    }
    let imageArray = [];
    setLoading(true);

    for (let i = 0; i < child.length; i++) {
      const file = child[i].file;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      imageArray.push(fileName);
      try {
        let { error: uploadError } = await supabase.storage

          .from("screenshots")
          .upload(filePath, file);

        if (uploadError) throw uploadError;
      } catch (error) {
        setLoading(false);
        return setError(error.error_description || error.message);
      }
    }
    try {
      setLoading(true);
      const { error } = await supabase.from("bugs").insert([
        {
          title: title,
          issuetype: issue,
          priority: priority,
          browser: browser,
          description: description,
          os: enviroment,
          screenshots: imageArray,
        },
      ]);
      if (error) throw error;
    } catch (error) {
      setLoading(false);
      return setError(error.error_description || error.message);
    }

    setLoading(false);
    setMessage("Your Report has been submitted successfully ");
  }
  return (
    <Box height="100vh">
      <Navbar />
      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Flex align={"center"} justify={"center"}>
          <Stack spacing={6} mx={"auto"} maxW={"lg"} pt={"15px"} px={6}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"}>Report a bug</Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="Title" isRequired>
                  <FormLabel>Title </FormLabel>
                  <Input
                    placeholder="Short Description"
                    maxLength="35"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl id="issue" isRequired>
                  <FormLabel>Issue type</FormLabel>
                  <Input
                    placeholder="Bug/Suggestion/Feature"
                    onChange={(e) => setIssue(e.target.value)}
                  />
                </FormControl>
                <FormControl id="priority">
                  <FormLabel>Priority</FormLabel>

                  <Select
                    bg={useColorModeValue("white", "gray.700")}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Select>
                </FormControl>
                bg={useColorModeValue("white", "gray.700")}
                <HStack spacing={30}>
                  <FormControl id="browser">
                    <FormLabel>Browser</FormLabel>

                    <Select
                      bg={useColorModeValue("white", "gray.700")}
                      onChange={(e) => setBrowser(e.target.value)}
                    >
                      <option value="Chrome">Chrome</option>
                      <option value="Firefox">Firefox</option>
                      <option value="Brave">Brave</option>
                      <option value="All Browsers">All Browsers</option>
                    </Select>
                  </FormControl>
                  <FormControl id="Enviroment">
                    <FormLabel>Enviroment</FormLabel>

                    <Select
                      bg={useColorModeValue("white", "gray.700")}
                      onChange={(e) => setEnviroment(e.target.value)}
                    >
                      <option value="Windows">Windows</option>
                      <option value="MacOs">MacOs</option>
                      <option value="Android">Android</option>
                      <option value="iOs">iOs</option>
                    </Select>
                  </FormControl>
                </HStack>
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    width={"400px"}
                    placeholder="Describe the issue and if possible the steps to reproduce it"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
                <UploadImage parentCallback={handleCallback} />
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
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={SubmitBugReport}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
}

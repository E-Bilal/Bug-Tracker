import { useState, useEffect, useContext } from "react";

import { supabase } from "./supabaseClient";
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
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";

export default function DetailedDone(props) {
  const [finishedFetching, setFinishedFetching] = useState(false);
  const [downloadedimages, setDownloadedImages] = useState([]);
  const [rowData, setRowdata] = useState(null);

  useEffect(() => {
    downloadImage();
  }, [props.doneId]);

  async function downloadImage() {
    let backlogRow = null;
    let section = "done";
    let id = props.doneId;

    setFinishedFetching(false);
    try {
      const { data, error } = await supabase
        .from(section)
        .select()
        .eq("id", id);
      backlogRow = data;
      setRowdata(backlogRow);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }

    let array = [];
    setDownloadedImages([]);

    for (let i = 0; i < backlogRow.length; i++) {
      for (let y = 0; y < backlogRow[i].screenshots.length; y++) {
        try {
          let { data, error } = await supabase.storage
            .from("screenshots")
            .download(backlogRow[i].screenshots[y]);

          const url = URL.createObjectURL(data);
          array.push(url);
          if (error) throw error;
        } catch (error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    }
    setDownloadedImages(array);
    setFinishedFetching(true);
  }

  async function moveData() {
    let movedData = null;

    let id = props.doneId;

    try {
      const { data, error } = await supabase.from("done").select().eq("id", id);
      movedData = data;
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    try {
      const { data, error } = await supabase.from("bugs").insert(movedData);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    try {
      const { data, error } = await supabase
        .from("done")
        .delete()
        .match({ id: id });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    props.fetchingData();
  }

  async function deleteData() {
    let id = props.doneId;

    try {
      const { data, error } = await supabase
        .from("done")
        .delete()
        .match({ id: id });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <Box>
      <Modal isOpen={props.isOpen2} onClose={props.onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Detailed Bugreport</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Flex>
              {finishedFetching ? (
                rowData.map((x) => (
                  <VStack align={"left"} pl={"10px"} maxH={"400px"}>
                    <Text>Title : {x.title}</Text>
                    <Text textAlign={"left"}>Type : {x.issuetype}</Text>
                    <Text>Title : {x.priority}</Text>
                    <Text textAlign={"left"}>Title : {x.browser}</Text>
                    <Text>Title : {x.os}</Text>
                    <Text overflowX={"hidden"} overflowY={"auto"}>
                      Description : {x.description}
                    </Text>
                    <HStack pt={"15px"}>
                      {downloadedimages.map((x) => (
                        <Image
                          onClick={() => window.open(x, "_blank")}
                          src={x}
                          maxW={"150px"}
                          _hover={{
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </HStack>
                  </VStack>
                ))
              ) : (
                <Spinner />
              )}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={props.onClose2}>
              Close
            </Button>
            {props.role === `client` ? (
              <HStack>
                <Button variant="ghost" onClick={deleteData}>
                  Bug is fixed
                </Button>
                <Button variant="ghost" onClick={moveData}>
                  Bug is not fixed
                </Button>
              </HStack>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

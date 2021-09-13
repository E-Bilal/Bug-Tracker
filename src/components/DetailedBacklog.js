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

export default function DetailedBacklog(props) {
  const [finishedFetching, setFinishedFetching] = useState(false);
  const [downloadedimages, setDownloadedImages] = useState([]);
  const [rowData, setRowdata] = useState(null);

  useEffect(() => {
    downloadImage();
  }, [props.id]);

  async function downloadImage() {
    let backlogRow = null;
    let id = props.id;

    setFinishedFetching(false);
    try {
      const { data, error } = await supabase.from("bugs").select().eq("id", id);
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
    let id = props.id;

    try {
      const { data, error } = await supabase.from("bugs").select().eq("id", id);
      movedData = data;
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    try {
      const { data, error } = await supabase
        .from("inprogress")
        .insert(movedData);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    try {
      const { data, error } = await supabase
        .from("bugs")
        .delete()
        .match({ id: id });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
    props.fetchingData();
  }

  return (
    <Box>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
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
            <Button colorScheme="blue" mr={3} onClick={props.onClose}>
              Close
            </Button>
            {props.role === `dev` ? (
              <Button variant="ghost" onClick={moveData}>
                Fix the bug
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

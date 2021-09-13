import React from "react";
import ImageUploading from "react-images-uploading";
import { HStack, Button, FormLabel, Box } from "@chakra-ui/react";
import { useState } from "react";

export default function UploadImage(props) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 2;
  const [uploading, setUploading] = useState(false);
  const [screenshotArray, setScreenshotArray] = useState([]);
  const [imageList, setImagelist] = useState([]);
  const [loading, setLoading] = useState(true);

  const onChange = (imageList) => {
    setLoading(true);
    setImages(imageList);
    props.parentCallback(imageList);
    setLoading(false);
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
    >
      {({ imageList, onImageUpload, onImageRemove }) => (
        <Box>
          <FormLabel>Screenshots</FormLabel>
          <Box
            border="1px solid #4A5568"
            borderRadius={"5px"}
            mb={3}
            minHeight={"40px"}
          >
            {!loading &&
              imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <HStack ml={"8px"} mb={"4px"}>
                    <p>{image.file.name} </p>
                    <button onClick={() => onImageRemove(index)}>X</button>
                  </HStack>
                </div>
              ))}
          </Box>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={onImageUpload}
            mb={"20px"}
          >
            Upload
          </Button>
        </Box>
      )}
    </ImageUploading>
  );
}

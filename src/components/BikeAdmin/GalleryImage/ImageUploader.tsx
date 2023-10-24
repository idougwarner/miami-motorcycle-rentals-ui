import React, { useEffect, useState } from "react";
import { CameraIcon, CloseIconWrapper, CloseIcon, Description, ImgLabel, Helper, UploadIcon, UploadIconWrapper, UploaderWrapper, GalleryImageWrapper } from "./styles";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import { HStack, VStack } from "../common/styles";
import { GrayButton, PinkButton, Wrapper } from "../common/ActionButtons/styles";
import { ArrowBack, ArrowForward, UploadFileOutlined } from "@mui/icons-material";
import axios from "axios";
import { BikeData } from "../Stepper";
import { extractFileProperties } from "@/utils/extractFileProperties";
import { mergeArrayWithObject } from "@/utils/mergeArrayWithObject";
import { updateObjectWithArray } from "@/utils/updateObjectWithArray";

export interface ImageDetailProps {
  width: number,
  height: number,
  filesize?: number,
  mimeType: string,
  filename: string,
  title: string,
  alt: string,
  type: string,
}

export interface MediaIds {
  featuredMediaItemId: number;
  galleryImageIds: number[];
}

export interface MediaItemProps extends ImageDetailProps {
  id: number,
  mediaUrl: string
}

interface MediaItemResponseProps {
  featuredMediaItem: MediaItemProps,
  galleryMediaItems: MediaItemProps[],
}

const transformImages = async (mediaItemRes: MediaItemResponseProps) => {
  const { featuredMediaItem, galleryMediaItems } = mediaItemRes;
  
  const featuredImageInfo = featuredMediaItem ? {
    id: featuredMediaItem.id,
    filename: featuredMediaItem.filename,
    mediaUrl: featuredMediaItem.mediaUrl,
    mimeType: featuredMediaItem.mimeType,
  } : null;

  const galleryImagesInfos = galleryMediaItems?.map((image) => ({
    id: image.id,
    filename: image.filename,
    mediaUrl: image.mediaUrl,
    mimeType: image.mimeType,
  })) ?? null;

  let data = {
    ...(featuredImageInfo && { featuredImage: featuredImageInfo }),
    ...(galleryImagesInfos.length && { galleryImages: galleryImagesInfos })
  };

  try {
    const token = localStorage.getItem("SESSION_ID");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/media/transform`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const responseData: MediaItemProps = await response.json();
    console.log("Transform Success");  
  } catch (error) {
    console.error(error);
    alert("Transform Error");
  }
}

export function GalleryImagesUploader(
  { setActiveStep, bikeData, setBikeData }: 
  { setActiveStep: (value: any) => void; bikeData: BikeData; setBikeData: (bikeData: BikeData) => void;}) 
{
  const [formData, setFormData] = useState<{featureImage: ImageDetailProps, galleryImages: ImageDetailProps[]}>(null);
  const [featuredImageError, setFeaturedImageError] = useState<string | null>(null);
  const [galleryImagesError, setGalleryImagesError] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeNext, setActiveNext] = useState<boolean>(!!(bikeData.bike.featuredMediaItem && bikeData.galleryMediaItems));

  const [featuredImage, setFeaturedImage] = React.useState<ImageType>(null);
  const [galleryImages, setGalleryImage] = React.useState<{[key: string]: ImageType}>(null);

  const validateImages = () => {
    let isValid = true;

    if (!featuredImage && !bikeData.bike.featuredMediaItem) {
      setFeaturedImageError("Please add a featured image.");
      isValid = false;
    } else {
      setFeaturedImageError(null);
    }

    const galleryImageCount = Object.keys(galleryImages || {}).length;
    if (galleryImageCount < 3 && bikeData.galleryMediaItems.length < 3) {
      setGalleryImagesError("Please select a minimum of 3 gallery images.");
      isValid = false;
    } else {
      setGalleryImagesError(null);
    }

    return isValid;
  };
  
  const uploadImages = async (e) => {
    e.preventDefault();
    if (!validateImages()) return;

    setIsUploading(true);
    const token = localStorage.getItem("SESSION_ID");
    const data = new FormData();

    if (formData.featureImage) {
      data.append("featureImage", JSON.stringify(formData.featureImage));
      data.append("featureImageFile", featuredImage.file);
    } 

    if (formData.galleryImages) {
      data.append("galleryImages", JSON.stringify(formData.galleryImages));
      Object.keys(galleryImages || {}).map((key) => galleryImages[key]).forEach((image, index) => {
        data.append(`galleryImageFiles[${index}]`, image.file);
      });
    }
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/media/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData: {data: MediaItemResponseProps} = response.data;  // assuming server responds with json

      console.log("Upload Success");
      
      await transformImages(responseData.data);

      let newGalleryMediaItems: MediaItemProps[] = [];
      if (responseData.data.galleryMediaItems?.length) {
        const updatedGalleryImages = updateObjectWithArray(responseData.data.galleryMediaItems, galleryImages);
        newGalleryMediaItems = mergeArrayWithObject(bikeData.galleryMediaItems, updatedGalleryImages);
      }
      setBikeData({
        ...bikeData,
        bike: {
          ...bikeData.bike,
          // will keep old featuredMediaItemId if responseData.data.featuredMediaItem is null(no updates)
          ...(responseData.data.featuredMediaItem && {featuredMediaItemId: responseData.data.featuredMediaItem?.id}),
          ...(responseData.data.featuredMediaItem && {featuredMediaItem: responseData.data.featuredMediaItem})
        },
        ...(newGalleryMediaItems.length && {galleryImageIds: newGalleryMediaItems.map(media => media.id)}),
        ...(newGalleryMediaItems.length && {galleryMediaItems: newGalleryMediaItems})
      })
      setIsUploading(false);
      setActiveNext(true)
    } catch (error) {
      console.error(error);
      alert("Upload Error");
      setIsUploading(false);
    }
  };

  const addGalleryImage = (image: ImageType, index: string) => {
    setGalleryImagesError(null);
    setGalleryImage({
      ...galleryImages,
      [`${index}`]: image
    })
  }
  const removeGalleryImage = (index: string) => {
    const updatedGalleryImage = {...galleryImages};
    delete updatedGalleryImage[index];
    setGalleryImage(updatedGalleryImage);
  }

  const addFeaturedImage = (image: ImageType) => {
    setFeaturedImage(image); 
    setFeaturedImageError(null);
  }

  useEffect(() => {
    if (featuredImage?.file) {
      const updateFormData = async () => {
        const fileProps = await extractFileProperties(featuredImage.file, `${bikeData.bike.name} featured`);
        setFormData(prev => ({
          ...prev,
          featureImage: {
            ...fileProps,
          },
        }));
      };
      updateFormData();
      setActiveNext(false);
    }
  }, [featuredImage])

  useEffect(() => {
    if (galleryImages) {
      const updateFormData = async () => {
        const galleryFilesProps = await Promise.all(
          Object.keys(galleryImages).map((key) => extractFileProperties(galleryImages[key].file, `${bikeData.bike.name} gallery ${key}`))
        );
        setFormData(prev => ({
          ...prev,
          galleryImages: galleryFilesProps,
        }));
      };
      updateFormData();
      setActiveNext(false);
    }
  }, [galleryImages])

  return (
    <div>
      <ImgLabel>Featured Image *</ImgLabel>
      <div style={{height: '245px', marginBottom: "30px"}}>
        <ImageUploader 
          onAddImage={(images) => {addFeaturedImage(images[0])}} 
          onRemoveImage={() => {setFeaturedImage(null)}}
          initImages={bikeData.bike.featuredMediaItem && [{
            dataURL: bikeData.bike.featuredMediaItem?.mediaUrl
          }]}
        />
      </div>
      {featuredImageError && <div style={{color: "red", marginBottom: "20px", marginTop: '-20px'}}>{featuredImageError}</div>}

      <ImgLabel>Gallery Image* <Helper>Please select a minimum of 3 images.</Helper></ImgLabel>
      <VStack>
        {(() => {
          const { rows, globalIndexes } = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].reduce((acc, key, index) => {
            if (index % 3 === 0) {
              acc.rows.push([]);
              acc.globalIndexes.push([]);
            }
            acc.rows[acc.rows.length - 1].push(key);
            acc.globalIndexes[acc.globalIndexes.length - 1].push(index);
            return acc;
          }, { rows: [], globalIndexes: [] });

          return rows.map((row, rowIndex) => (
            <HStack key={rowIndex}>
              {row.map((key, colIndex) => (
                <GalleryImageWrapper key={key}>
                  <ImageUploader 
                    onAddImage={(images) => addGalleryImage(images[0], key)} 
                    onRemoveImage={() => removeGalleryImage(key)}
                    initImages={bikeData.galleryMediaItems[globalIndexes[rowIndex][colIndex]] && [{
                      dataURL: bikeData.galleryMediaItems[globalIndexes[rowIndex][colIndex]]?.mediaUrl
                    }]}
                  />
                </GalleryImageWrapper>
              ))}
            </HStack>
          ));
        })()}
      </VStack>
      {galleryImagesError && <div style={{color: "red", marginTop: "10px"}}>{galleryImagesError}</div>}

      <Wrapper>
        <GrayButton className="gray" disabled={isUploading} onClick={() => setActiveStep(0)} variant="contained" startIcon={<ArrowBack />}>Back</GrayButton>
        {!activeNext && <PinkButton className="pink" disabled={isUploading} onClick={uploadImages} variant="contained" endIcon={<UploadFileOutlined />}>{isUploading ? 'Uploading...': 'Upload'}</PinkButton>}
        {activeNext && <PinkButton className="pink" onClick={() => setActiveStep(2)} variant="contained" endIcon={<ArrowForward />}>Next</PinkButton>}
      </Wrapper>
    </div>
  );
}


interface ImageUploader {
  onAddImage: (images: ImageType) => void;
  onRemoveImage: (index: number) => void;
  initImages?: ImageType[];
}
function ImageUploader({onAddImage, onRemoveImage, initImages}: ImageUploader) {
  const [images, setImages] = React.useState<ImageType[]>(initImages ? initImages : []);
  const onChange = (
    imageList: ImageListType,
    _addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList);
    onAddImage(imageList)
  };

  return (
    <ImageUploading
      value={images}
      onChange={onChange}
      maxNumber={1}
    >
      {({
        imageList,
        onImageUpload,
        onImageRemove,
        isDragging,
        dragProps
      }) => (
        <UploaderWrapper className="upload__image-wrapper" {...dragProps} style={isDragging ? {background: '#fba9db'} : {}}>
          {imageList?.length === 0 && <UploadIconWrapper onClick={onImageUpload}>
            <UploadIcon>
              <CameraIcon />
            </UploadIcon>
            <Description>Drop your images here <br/> or <span style={{color: '#EB42A8', fontWeight: 'bold'}}>Browse</span></Description>
            <Helper>Min size:  820 by 312</Helper>
          </UploadIconWrapper>}
          {imageList.map((image, index) => (
            <div key={index} className="image-item" style={{overflow: 'hidden', width: '100%', height: '100%', position: 'relative'}}>
              <img src={image.dataURL} alt="" style={{overflow: 'hidden', width: '100%', height: '100%', objectFit: 'cover'}}/>
              <button onClick={(e) => { e.stopPropagation(); onImageRemove(index); onRemoveImage(index)}} style={{position: 'absolute', top: '10px', right: '10px'}}>
                <CloseIconWrapper>
                  <CloseIcon />
                </CloseIconWrapper>
              </button>
            </div>
          ))}
        </UploaderWrapper>
      )}
    </ImageUploading>
  );
}
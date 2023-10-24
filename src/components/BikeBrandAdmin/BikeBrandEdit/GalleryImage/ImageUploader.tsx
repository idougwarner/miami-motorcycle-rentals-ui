import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CameraIcon, CloseIconWrapper, CloseIcon, Description, ImgLabel, Helper, UploadIcon, UploadIconWrapper, UploaderWrapper } from "./styles";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import { UploadFileOutlined } from "@mui/icons-material";
import axios from "axios";
import { extractFileProperties } from "@/utils/extractFileProperties";
import { mergeArrayWithObject } from "@/utils/mergeArrayWithObject";
import { updateObjectWithArray } from "@/utils/updateObjectWithArray";
import { HStack, WhiteButton } from "@/components/BikeAdmin/common/styles";
import { Brand } from "@/types";

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
  const { featuredMediaItem } = mediaItemRes;
  
  const featuredImageInfo = featuredMediaItem ? {
    id: featuredMediaItem.id,
    filename: featuredMediaItem.filename,
    mediaUrl: featuredMediaItem.mediaUrl,
    mimeType: featuredMediaItem.mimeType,
  } : null;

  let data = {
    ...(featuredImageInfo && { featuredImage: featuredImageInfo }),
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

export function BrandImagesUploader({
  brand,
  brandName,
  setBrand,
  setMediaItemId
} : {
  brand: Brand
  brandName: string
  setBrand: Dispatch<SetStateAction<Brand>>
  setMediaItemId: (value: number) => void
}) {
  const [formData, setFormData] = useState<{featureImage: ImageDetailProps, galleryImages: ImageDetailProps[]}>(null);
  const [featuredImageError, setFeaturedImageError] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [featuredImage, setFeaturedImage] = React.useState<ImageType>(null);

  const validateImages = () => {
    let isValid = true;

    if (!featuredImage) {
      setFeaturedImageError("Please add a brand image.");
      isValid = false;
    } else if (!brandName) {
      setFeaturedImageError("Please input a brand name.");
      isValid = false;
    } else {
      setFeaturedImageError(null);
    }

    return isValid;
  };
  
  const uploadImages = async (e) => {
    e.preventDefault();
    if (!validateImages()) return;

    setIsUploading(true);
    const token = localStorage.getItem("SESSION_ID");
    const data = new FormData();

    const imageProperties = {
      ...formData.featureImage,
      filename: brandName.replace(/ /g, "-"),
      title: brandName,
      alt: brandName
    };

    if (formData.featureImage) {
      data.append("featureImage", JSON.stringify(imageProperties));
      data.append("featureImageFile", featuredImage.file);
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
      
      // await transformImages(responseData.data);

      if (responseData.data.featuredMediaItem) {
        setBrand({
          ...brand,
          mediaItem: responseData.data.featuredMediaItem,
          mediaItemId: responseData.data.featuredMediaItem.id
        })
        
        setMediaItemId(responseData.data.featuredMediaItem.id)
      }
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      alert("Upload Error");
      setIsUploading(false);
    }
  };

  const addFeaturedImage = (image: ImageType) => {
    setFeaturedImage(image); 
    setFeaturedImageError(null);
  }

  useEffect(() => {
    if (featuredImage?.file) {
      const updateFormData = async () => {
        const fileProps = await extractFileProperties(featuredImage.file, `${brandName}`);
        setFormData(prev => ({
          ...prev,
          featureImage: {
            ...fileProps,
          },
        }));
      };
      updateFormData();
    }
  }, [featuredImage])

  return (
    <div>
      <ImgLabel>Image *</ImgLabel>
      <div style={{height: '245px', marginBottom: "8px"}}>
        <ImageUploader 
          onAddImage={(images) => {addFeaturedImage(images[0])}} 
          onRemoveImage={() => {setFeaturedImage(null)}}
          initImages={brand.mediaItem && [{
            dataURL: brand.mediaItem?.mediaUrl
          }]}
        />
      </div>
      {featuredImageError && <div style={{color: "red", marginBottom: "20px", fontSize: '12px', marginLeft: '14px'}}>{featuredImageError}</div>}

      <HStack style={{justifyContent: 'center'}}>
        <WhiteButton 
          className="white" 
          disabled={isUploading} 
          onClick={uploadImages} 
          variant="contained" 
          endIcon={<UploadFileOutlined />}
          style={{width: '150px'}}
        >
          {isUploading ? 'Uploading...': 'Upload'}
        </WhiteButton>
      </HStack>
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
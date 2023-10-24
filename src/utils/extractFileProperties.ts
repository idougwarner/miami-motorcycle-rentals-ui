import { ImageDetailProps } from "@/components/BikeAdmin/GalleryImage/ImageUploader";

export const extractFileProperties = async (file: File, title: string): Promise<ImageDetailProps> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({
      width: img.width,
      height: img.height,
      filesize: file.size,
      mimeType: file.type,
      filename: title.replace(/ /g, "-"),
      title,
      alt: title, // "same with title",
      type: 'image'
    });
    img.src = URL.createObjectURL(file);
  });
};
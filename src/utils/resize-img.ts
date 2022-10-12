import Resizer from "react-image-file-resizer";
import { ImageType } from "react-images-uploading";

export const resizeFile = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "webp",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const convertImageType = async (file: File) => {
  const imageType = {
    dataURL: await toBase64(file as File),
    file: file,
  } as ImageType;

  return imageType;
};

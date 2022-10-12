import api from "utils/api";

const getImage = async (prefix: string, id: number, fileName: string) => {
    return await api.get<string>(
        `store/file/image-base64/${prefix}/${id}/${fileName}`,
        {}
      );
}

export const S3Service = {
    getImage
}
import type { INFT } from "@/redux/slice/sliceNFTContract";
import { useState } from "react";

const pinataJwt = import.meta.env.VITE_PINATA_JWT_KEY;

const UploadPinata = () => {
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleUploadImage = async (file: File) => {
    if (!file) return false;
    try {
      setUploadStatus("Pending");
      let formData: FormData = new FormData();
      formData.append("file", file);
      formData.append("network", "public");
      formData.append("group_id", "a420f5c1-57bd-409b-9c0b-6b55c4e748f3");
      const request = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
        body: formData,
      });
      const response = await request.json();
      console.log(response);
      setUploadStatus("Success");
      return response;
    } catch (error) {
      setUploadStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  const handleUploadJson = async (metadata: INFT, name: string) => {
    try {
      if (metadata) {
        let blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
        let file = new File([blob], `${name}.json`, { type: "application/json" });
        setUploadStatus("Pending");
        let formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("network", "public");
        formData.append("group_id", "1c568344-c460-4628-8792-bcdbc6ea55c7");
        const request = await fetch("https://uploads.pinata.cloud/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
          },
          body: formData,
        });
        const response = await request.json();
        console.log(response);
        setUploadStatus("Success");
        return response;
      }
    } catch (error) {
      setUploadStatus(`Error : ${error instanceof Error ? error.message : String(Error)}`);
    }
  };
  return {
    
    handleUploadImage,
    uploadStatus,
    handleUploadJson,
  };
};

export default UploadPinata;

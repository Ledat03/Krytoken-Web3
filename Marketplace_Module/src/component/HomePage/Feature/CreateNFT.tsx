import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { ImageUp, Trash, Pen } from "lucide-react";
import type { INFT } from "../../../redux/slice/sliceNFTContract";
import ether_icon from "../../../../public/ether-icon.svg";
import { create } from "@storacha/client";
import type { Client } from "@storacha/client";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const CreateNFT = () => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const isConnected: boolean = useSelector((state: RootState) => state.Info.isConnected);
  useEffect(() => {
    console.log("first");
    createClient();
    if (client) {
      console.log("Second");
      initConnect(client);
    }
  }, [isConnected]);
  const createClient = async () => {
    const res = await create();
    if (res) {
      setClient(res);
    }
  };
  const initConnect = async (client: Client) => {
    console.log("start 1");
    const account = await client.login("krytosvn@gmail.com");
    await account.plan.wait();
    console.log("start 3", account);
    const space = "did:key:z6MksRsTMnZijSHR7rQbsr2TPQeoKw9k27JXb8pjmqq2deL5";
    await client.setCurrentSpace(space);
    console.log("start 4");
    console.log("currentSpace", await client.currentSpace());
  };

  let btnAddFile = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<string | undefined>(undefined);
  const handleClick = () => {
    btnAddFile.current?.click();
  };
  const formValidate = zod.object({
    name: zod.string().min(2, "Name of NFT must be larger than 2 !").max(20, "Name of NFT is too long !"),
    descrition: zod.string().max(1000, "Description is too long !"),
    traits: zod.string().min(1, "This NFT must has traits to make different with another NFT !"),
    imgFile: zod
      .instanceof(File)
      .refine((file) => file, "Choose image you want to NFT !")
      .refine((file) => file && ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.type), "You must choose image file !")
      .refine((file) => file && file.size <= 5 * 1024 * 1024, "This file is overloaded !"),
  });
  const form = useForm<zod.infer<typeof formValidate>>({
    resolver: zodResolver(formValidate),
    defaultValues: {
      name: "",
      descrition: "",
      traits: "",
      imgFile: undefined,
    },
  });
  const onSubmit = async (value: zod.infer<typeof formValidate>) => {
    if (client) {
      const date = Date.now();
      const formatName: string = `${date}-${value.imgFile.name.split(".").pop()}`;
      const newFormat: File = new File([value.imgFile], formatName, { type: value.imgFile.type });
      const imageUpload: any = await client.uploadFile(newFormat);
      console.log(imageUpload);
      if (imageUpload !== undefined) {
        const imageURL: string = `https://ipfs.io/ipfs/${imageUpload}`;
        console.log(imageURL);
        const NFTinfo: INFT = {
          name: value.name,
          description: value.descrition,
          traits: value.traits,
          image: imageURL,
        };
        const blob = new Blob([JSON.stringify(NFTinfo)], { type: "application/json" });
        const metadataFile = new File([blob], "metadata.json", { type: "application/json" });
        const CIDmetadata = await client.uploadFile(metadataFile);
        console.log(CIDmetadata);
      }
    }
  };
  return (
    <>
      <div className="form-container w-4xl mx-auto flex flex-col items-center">
        <img src="https://bafkreidd3xirkz6yjnnrgdcsh3udq2bxlbn5eagzp4eaczhfepfgcqgg4y.ipfs.w3s.link/" alt="NFT" />
        <h1 className="text-xl font-medium text-gray-400">Add new NFT</h1>
        <Form {...form}>
          <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="input-custom" placeholder="Fill name " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"descrition"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="input-custom" placeholder="Fill description " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"traits"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="input-custom" placeholder="Fill traits " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {img === undefined ? (
              <div onClick={handleClick} className="input-custom h-60 flex flex-col justify-center items-center text-gray-400 border rounded-3xl">
                <ImageUp />
                <span>Click to upload</span> <span className="font-bold">PNG , JPEG , GIF , WEBP</span>
              </div>
            ) : (
              <div onClick={handleClick} className="input-custom h-60 flex flex-col justify-center items-center border rounded-3xl">
                <div className="flex items-end w-96">
                  <Trash
                    size={30}
                    className="icon-custom"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImg(undefined);
                      form.setValue("imgFile", undefined as unknown as File);
                    }}
                  />
                  <Pen size={30} className="icon-custom" />
                </div>

                <img src={img} width={350} height={350} />
              </div>
            )}
            <FormField
              control={form.control}
              name={"imgFile"}
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="input-custom"
                      placeholder="Fill name "
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file: File | undefined = e.target.files?.[0];
                        if (file) {
                          const imgURL: string = URL.createObjectURL(file);
                          setImg(imgURL);
                        }

                        onChange(file);
                      }}
                      ref={btnAddFile}
                      hidden
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-76 h-12 items-center justify-center mx-auto gap-1 bg-[rgb(20,20,21)] border rounded-2xl border-0">
              <img src={ether_icon} width={35} height={35} />
              <p className="text-gray-500">Sepolia Testnet</p>
              <p className="text-gray-300">{`( Default Chain )`}</p>
            </div>
            <FormDescription className="text-yellow-300 text-center text-xs font-[600]">{"Alert : the contract is in the process of testing on Sepolia, so Sepolia is default chain"}</FormDescription>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};
export default CreateNFT;

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
import { useNFTContract } from "@/hooks/useNFTContract";
import { Select, SelectItem, SelectValue, SelectContent, SelectGroup, SelectTrigger } from "@/components/ui/select";
import images from "@/utils/imageCustom";
const CreateNFT = () => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const isConnected: boolean = useSelector((state: RootState) => state.Info.isConnected);
  const { mintNFT } = useNFTContract();
  const signer = useSelector((state: RootState) => state.Info.userAddress);
  useEffect(() => {
    createClient();
    if (client) {
      initConnect(client);
    }
  }, [isConnected]);
  const createClient = async () => {
    const res = await create();
    if (res) {
      setClient(res);
    }
  };
  console.log("Image List ", images);
  const initConnect = async (client: Client) => {
    const account = await client.login("KrytosVN@gmail.com");
    await account.plan.wait();
    console.log("DID : ", await account.agent.spaces);
    const key: string = "key";
    const cidSpace: string = "z6MkoUETAoBrsSaoPNTdjM54qKxWDBrmNAJoficv4qLwCrAt";
    const space: any = `did:${key}:${cidSpace}`;
    await client.setCurrentSpace(space);
    console.log("currentSpace", client.currentSpace());
  };

  let btnAddFile = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<string | undefined>(undefined);
  const handleClick = () => {
    btnAddFile.current?.click();
  };
  const formValidate = zod.object({
    name: zod.string().min(2, "Name of NFT must be larger than 2 !").max(20, "Name of NFT is too long !"),
    description: zod.string().max(1000, "Description is too long !"),
    class: zod.string().min(1, "This NFT must has class !"),
    rarity: zod.string().min(1, "You must choose rarity for cookies !"),
    element: zod.string().min(1, "This NFT must has element !"),
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
      description: "",
      class: "",
      imgFile: undefined,
      rarity: "",
      element: "",
    },
  });
  const onSubmit = async (value: zod.infer<typeof formValidate>) => {
    console.log(value);
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
          description: value.description,
          traits: {
            class: value.class,
            rarity: value.rarity,
            element: value.element,
          },
          image: imageURL,
        };
        console.log(NFTinfo.traits.class);
        const blob = new Blob([JSON.stringify(NFTinfo)], { type: "application/json" });
        const metadataFile = new File([blob], "metadata.json", { type: "application/json" });
        const CIDmetadata = await client.uploadFile(metadataFile);
        console.log(CIDmetadata.toString());
        const data = await mintNFT(CIDmetadata.toString(), signer);
        console.log(data);
      }
    }
  };
  return (
    <>
      <div className="form-container w-4xl mx-auto flex flex-col items-center">
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
              name={"description"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="input-custom h-[150px]" placeholder="Fill description " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3 className="text-center">Choose Traits</h3>
            <div className="flex gap-3 mx-auto h-[40px]">
              <FormField
                control={form.control}
                name={"rarity"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue className=" flex-1 justify-center text-center" placeholder={"Choose Rarity"} />
                        </SelectTrigger>
                        <SelectContent className="border-0 shadow-none bg-black">
                          <SelectGroup>
                            <SelectItem className="select-custom" value="Common">
                              <img src={images.Common} alt="Common" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Rare">
                              <img src={images.Rare} alt="Rare" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Epic">
                              <img src={images.Epic} alt="Epic" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Super Epic">
                              <img src={images.Super_Epic} alt="SuperEpic" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Special">
                              <img src={images.Special} alt="Special" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Dragon">
                              <img src={images.Dragon} alt="Dragon" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Legendary">
                              <img src={images.Legendary} alt="Legendary" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Ancient">
                              <img src={images.Ancient} alt="Ancient" />
                            </SelectItem>
                            <SelectItem className="select-custom" value="Beast">
                              <img src={images.Beast} alt="Beast" />
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={"class"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} {...field}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Choose Class" />
                        </SelectTrigger>
                        <SelectContent className="border-0 bg-black">
                          <SelectGroup>
                            <SelectItem className="select-custom " value="Charge">
                              <p className="text-amber-400">Charge</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Ambush">
                              <p className="text-red-400">Ambush</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Support">
                              <p className="text-green-400">Support</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Defense">
                              <p className="text-gray-400">Defense</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Ranged">
                              <p className="text-amber-400">Ranged</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Magic">
                              <p className="text-blue-400">Magic</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Healing">
                              <p className="text-amber-50">Healing</p>
                            </SelectItem>
                            <SelectItem className="select-custom" value="Bomber">
                              <p className="text-purple-600">Bomber</p>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"element"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder={"Choose Element"} {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Ice">
                              <img src={images.Ice} height={26} width={26} />
                              <p>Ice</p>
                            </SelectItem>
                            <SelectItem value="Darkness">
                              <img src={images.Darkness} height={26} width={26} />
                              <p>Darkness</p>
                            </SelectItem>
                            <SelectItem value="Earth">
                              <img src={images.Earth} height={26} width={26} />
                              <p>Earth</p>
                            </SelectItem>
                            <SelectItem value="Electricity">
                              <img src={images.Electricity} height={26} width={26} />
                              <p>Electricity</p>
                            </SelectItem>
                            <SelectItem value="Fire">
                              <img src={images.Fire} height={26} width={26} />
                              <p>Fire</p>
                            </SelectItem>
                            <SelectItem value="Grass">
                              <img src={images.Grass} height={26} width={26} />
                              <p>Grass</p>
                            </SelectItem>
                            <SelectItem value="Light">
                              <img src={images.Light} height={26} width={26} />
                              <p>Light</p>
                            </SelectItem>
                            <SelectItem value="Poison">
                              <img src={images.Poison} height={26} width={26} />
                              <p>Poison</p>
                            </SelectItem>
                            <SelectItem value="Steel">
                              <img src={images.Steel} height={26} width={26} />
                              <p>Steel</p>
                            </SelectItem>
                            <SelectItem value="Water">
                              <img src={images.Water} height={26} width={26} />
                              <p>Water</p>
                            </SelectItem>
                            <SelectItem value="Wind">
                              <img src={images.Wind} height={26} width={26} />
                              <p>Wind</p>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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

            <div className="flex w-76 h-12 items-center justify-center mx-auto gap-1 bg-[rgb(20,20,21)] border rounded-2xl">
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

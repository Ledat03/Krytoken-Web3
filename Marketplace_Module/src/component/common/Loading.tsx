import LoadingIMG from "../../../public/Loading/Loading_Cookie.gif";

export const LoadingLayout = ({ Loading }: { Loading: boolean }) => {
  if (Loading) {
    return (
      <span className="relative size-2 w-[100px] h-[100px] ">
        <img src={LoadingIMG} alt="" className=" absolute left-3 top-0" />
        <span className="text-xl absolute bottom-0 left-3 cookie-text font-bold text-muted-foreground">Loading...</span>
      </span>
    );
  }
};

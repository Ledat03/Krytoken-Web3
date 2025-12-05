import LoadingIMG from "../../../public/Loading/Loading_Cookie.gif";
import LoadingWelcome from "../../../public/background/CharcoalWalk.webp";
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
export const LoadingInit = ({ Loading }: { Loading: boolean }) => {
  if (Loading) {
    return (
      <span className="relative size-2 w-[300px] h-[300px] ">
        <img src={LoadingWelcome} alt="" className="absolute left-[40px] top-30 w-[150px] h-[150px]" />
        <span className="text-2xl absolute bottom-0 left-3 cookie-text font-bold text-muted-foreground">GOING TO KINGDOM</span>
      </span>
    );
  }
};

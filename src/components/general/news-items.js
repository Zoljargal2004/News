import { Bookmark, Save } from "lucide-react";
import { Button } from "../ui/button";

export const News1 = ({ data }) => {
  return (
    <div className="max-h-[440]">
      <div className="rounded-2xl relative overflow-hidden w-full h-full">
        <img
          src={data?.thumbnail}
          alt="news thumbnail"
          className="object-cover w-full h-full"
        />
        <Button
          className="absolute rounded-full size-20 right-8 bottom-8 bg-background"
          variant="ghost"
        >
          <Bookmark className="size-10" />
        </Button>
      </div>
      <span className="font-semibold text-3xl">{data.title}</span>
    </div>
  );
};

export const News2 = ({data}) => {
  return (
    <div className="max-h-[440]">
      <div className="rounded-2xl relative overflow-hidden w-full h-full">
        <img
          src={data?.thumbnail}
          alt="news thumbnail"
          className="object-cover w-full h-full"
        />
        <Button
          className="absolute rounded-full size-20 right-8 bottom-8 bg-background"
          variant="ghost"
        >
          <Bookmark className="size-10" />
        </Button>
      </div>
      <span className="font-semibold text-3xl">{data.title}</span>
    </div>
  );
};

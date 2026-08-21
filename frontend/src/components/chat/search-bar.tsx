import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBar({roomName} : {roomName: string}) {
  return (
    <div className="flex pl-3 pt-1 pb-1 gap-2 items-center bg-accent rounded-sm">
      <Search />
      <Input
        id="search"
        type="text"
        placeholder={`Search in #${roomName.toLowerCase()}`}
        className="border-none font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
        required
      />
    </div>
  );
}

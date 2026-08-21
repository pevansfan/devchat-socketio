import SearchBar from "./search-bar";

export default function ChatBar({ roomName }: { roomName: string }) {
  return (
    <div className="flex min-w-0 w-full items-center justify-between gap-4 border-b border-accent p-5">
      <div className="shrink-0">
        <p className="flex items-center gap-3">
          <span className="text-green-300">#</span>

          <span className="text-xl font-bold">{roomName}</span>
        </p>
      </div>

      <div className="min-w-0 flex-1 flex justify-end">
        <SearchBar roomName={roomName} />
      </div>
    </div>
  );
}

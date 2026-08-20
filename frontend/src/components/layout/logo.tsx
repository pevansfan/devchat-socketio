import { Terminal } from "lucide-react";

const Logo = () => {
  return (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
        <Terminal className="h-6 w-6" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold tracking-tight">DevChat</h1>
        <div className="text-xs uppercase tracking-widest">
          Connect to Redis server
        </div>
      </div>
    </>
  );
};

export default Logo;

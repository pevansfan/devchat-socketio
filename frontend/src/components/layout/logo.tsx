import { Terminal } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 ring-1 ring-cyan-400/30">
        <Terminal className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-semibold leading-tight text-white">
          DevChat Rooms
        </p>
      </div>
    </div>
  );
};

export default Logo;

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@/components/ui/avatar";

export interface Member {
  id: string;
  username: string;
}

export default function MembersBar({ members }: { members: Member[] }) {
  const getInitial = (username: string) =>
    username.trim().charAt(0).toUpperCase() || "?";

  return (
    <section
      aria-labelledby="connected-members-title"
      className="border-border/70 bg-card/60 w-full max-w-sm rounded-xl border p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2
            id="connected-members-title"
            className="text-sm font-semibold tracking-wide"
          >
            Membres connectés
          </h2>
          <p className="text-muted-foreground text-xs">
            {members.length} {members.length > 1 ? "personnes" : "personne"}
          </p>
        </div>

        
      </div>

      {members.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Aucun membre connecté pour le moment.
        </p>
      ) : (
        <ul
          className="flex max-h-52 flex-col gap-2 overflow-y-auto"
          aria-live="polite"
        >
          {members.map((member) => (
            <li
              key={member.id}
              className="bg-muted/45 flex items-center gap-3 rounded-lg px-3 py-2"
            >
              <Avatar size="sm">
                <AvatarFallback>{getInitial(member.username)}</AvatarFallback>
                <AvatarBadge className="bg-secondary" />
              </Avatar>

              <span className="min-w-0 truncate text-sm font-medium">
                {member.username}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

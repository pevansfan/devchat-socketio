interface DateFirstConversationProps {
  date: string;
}

export default function DateFirstConversation({
  date,
}: DateFirstConversationProps) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-1 flex-1 bg-accent rounded-3xl" />

      <span className="font-mono shrink-0 text-xs font-medium text-muted-foreground border-3 border-accent p-2 rounded-2xl">
        {date}
      </span>

      <div className="h-1 flex-1 bg-accent rounded-3xl" />
    </div>
  );
}
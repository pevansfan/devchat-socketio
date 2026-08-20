"use client";

import { useState } from "react";
import { Terminal, User, Globe, Gamepad2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Logo from "@/components/layout/logo";

const SECTORS = [
  {
    id: "general",
    label: "Général",
    description: "Global transmission channel",
    icon: Globe,
  },
  {
    id: "tech",
    label: "Tech",
    description: "Code and infrastructure",
    icon: Terminal,
  },
  {
    id: "chill",
    label: "Chill",
    description: "Off-topic and gaming",
    icon: Gamepad2,
  },
] as const;

export default function ConnectRedis() {
  const [alias, setAlias] = useState("");
  const [sector, setSector] =
    useState<(typeof SECTORS)[number]["id"]>("general");

  return (
    <main className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-3">
          <Logo />
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: initialiser la connexion (alias, sector)
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="alias"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Pseudonym
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="alias"
                    type="text"
                    placeholder="Enter your alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Select sector
                </Label>
                <div className="flex flex-col gap-2">
                  {SECTORS.map(({ id, label, description, icon: Icon }) => {
                    const isSelected = sector === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSector(id)}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                          isSelected
                            ? "border-primary ring-1 ring-primary"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {description}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "h-4 w-4 shrink-0 rounded-full border",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full gap-2">
            Initialize Connection
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

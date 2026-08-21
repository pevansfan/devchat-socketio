"use client";

import { useEffect, useState } from "react";
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

import { getRooms } from "@/lib/api-rooms";
import type { RoomResponse } from "@/types/room-response";
import { initializeConnection } from "@/lib/api-auth";
import { useAuth } from "@/hooks/useAuth";

/**
 * Page de connexion permettant à l'utilisateur de renseigner
 * son pseudonyme et de sélectionner un secteur.
 */
export default function Login() {
  /** Pseudonyme saisi par l'utilisateur. */
  const [username, setUsername] = useState("");

  /** Identifiant du secteur sélectionné. */
  const [sector, setSector] = useState("");

  /** Liste des secteurs disponibles. */
  const [sectors, setSectors] = useState<RoomResponse[]>([]);
  const [usernameError, setUsernameError] = useState("");
  const { loading } = useAuth();

  /**
   * Charge la liste des secteurs disponibles au montage du composant.
   */
  useEffect(() => {
    
    const loadRooms = async () => {
      try {
        const rooms = await getRooms();
        setSectors(rooms);
      } catch (error) {
        console.error("Failed to load rooms", error);
      }
    };

    loadRooms();
  }, []);

  /**
   * Valide le formulaire et initialise la connexion.
   *
   * @param e Événement de soumission du formulaire.
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUsernameError("");

    if (!username || !sector) {
      return;
    }

    try {
      const response = await initializeConnection({
        username,
        roomId: sector,
      });

      console.log("Connection initialized:", response);

      window.location.href='/test'
    } catch (error) {
      if (error instanceof Error) {
        setUsernameError(error.message);
      }
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-3">
          <Logo />
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Champ de saisie du pseudonyme */}
              <div className="grid gap-2">
                <Label
                  htmlFor="username"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Pseudonym
                </Label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    className={cn(
                      "pl-9",
                      usernameError && "border-destructive",
                    )}
                    required
                  />
                </div>

                {usernameError && (
                  <p className="text-sm text-destructive">{usernameError}</p>
                )}
              </div>

              {/* Liste des secteurs disponibles */}
              <div className="grid gap-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Select sector
                </Label>

                <div className="flex flex-col gap-2">
                  {sectors.map((room, index) => {
                    // Alterne les icônes utilisées pour chaque secteur.
                    let Icon = Globe;

                    if (index === 1) {
                      Icon = Gamepad2;
                    }

                    if (index === 2) {
                      Icon = Terminal;
                    }

                    const isSelected = sector === room.id;

                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSector(room.id)}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                          isSelected
                            ? "border-primary ring-1 ring-primary"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        {/* Icône du secteur */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Nom et description du secteur */}
                        <div className="flex-1">
                          <p className="text-sm font-medium font-mono">{room.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {room.description}
                          </p>
                        </div>

                        {/* Indicateur de sélection */}
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
          </CardContent>

          {/* Action de connexion */}
          <CardFooter>
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={!username || !sector}
            >
              Initialize Connection
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

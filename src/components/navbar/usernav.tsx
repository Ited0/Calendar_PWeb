import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/store";
import { useModal } from "../modal-provider";
import { ProfileEdit } from "../modals/profile/edit";
import { useMemo } from "react";

export const UserNav = () => {
  const modal = useModal();

  const { user, logout } = useStore((store) => store.auth);
  const { displayName, email } = user!;

  const editModalOptions = useMemo(() => ProfileEdit, []);

  const nameFallback = (displayName || email?.split("@")[0] || "")
    .match(/\b(\w)/g)
    ?.join("")
    .toUpperCase()
    .slice(0, 3);

  const handleProfile = () =>
    modal.open({ ...editModalOptions }, { className: "md:max-w-lg" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || undefined} alt="@shadcn" />
            <AvatarFallback>{nameFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{nameFallback}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfile}>Perfil</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BellIcon,
  CircleHelpIcon,
  CircleUserRoundIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  KeyboardIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserProfile, type UserProfile } from "@/api/user";
import { logout } from "@/api/auth";
import { toast } from "sonner";

const profileQueryKey = ["user", "profile"];

function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getRoleLabel(role: string): string {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export function ProfileMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Signed out", {
        description: "You have been signed out successfully.",
      });
      navigate("/sign-in", { replace: true });
    },
    onError: () => {
      // Even if the server call fails, clear local state so the user isn't stuck
      queryClient.clear();
      navigate("/sign-in", { replace: true });
    },
  });

  const profile = profileQuery.data as UserProfile | undefined;
  const isLoading = profileQuery.isLoading;
  const isError = profileQuery.isError;

  // Fallback display for unauthenticated / loading states
  const displayName = profile?.name ?? "Guest";
  const displayEmail = profile?.email ?? "Not signed in";
  const displayRole = profile ? getRoleLabel(profile.role) : "Member";
  const displayAvatar = profile?.imageUrl ?? "";
  const initials = getInitials(profile?.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open profile menu"
            className="size-9 rounded-full p-0 text-muted-foreground hover:text-foreground"
          />
        }>
        {isLoading ? (
          <Skeleton className="size-9 rounded-full" />
        ) : (
          <Avatar className="size-9 ring-2 ring-border transition-all group-hover:ring-primary/50">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 overflow-hidden p-0">
        {/* Profile header */}
        <div className="relative bg-linear-to-br from-primary/10 via-primary/5 to-transparent px-4 py-4">
          <div className="flex items-start gap-3">
            {isLoading ? (
              <>
                <Skeleton className="size-12 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </>
            ) : (
              <>
                <Avatar className="size-12 shrink-0 ring-2 ring-background">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {displayEmail}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                      <ShieldCheckIcon className="size-2.5" />
                      {displayRole}
                    </span>
                    {profile?.emailVerified && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account section */}
        <div className="p-1.5">
          <DropdownMenuLabel className="px-2 py-1 text-[10px] uppercase tracking-wider">
            Account
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={<Link to="/profile" />}
              className="cursor-pointer rounded-md">
              <CircleUserRoundIcon className="size-4" />
              <span className="flex-1">My profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link to="/profile" />}
              className="cursor-pointer rounded-md">
              <CreditCardIcon className="size-4" />
              <span className="flex-1">Billing &amp; plans</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Soon
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <BellIcon className="size-4" />
              <span className="flex-1">Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5" />

          <DropdownMenuLabel className="px-2 py-1 text-[10px] uppercase tracking-wider">
            Preferences
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <SettingsIcon className="size-4" />
              <span className="flex-1">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <KeyboardIcon className="size-4" />
              <span className="flex-1">Keyboard shortcuts</span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                ?
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <CircleHelpIcon className="size-4" />
              <span className="flex-1">Help &amp; support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5" />

          <DropdownMenuItem
            variant="destructive"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            className="cursor-pointer rounded-md">
            <LogOutIcon className="size-4" />
            <span className="flex-1">
              {logoutMutation.isPending ? "Signing out…" : "Sign out"}
            </span>
            {!logoutMutation.isPending && (
              <EllipsisVerticalIcon className="size-3.5 opacity-50" />
            )}
          </DropdownMenuItem>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-4 py-2">
          <p className="text-[10px] text-muted-foreground">
            {isError
              ? "Couldn't load profile details"
              : profile?.createdAt
                ? `Member since ${new Date(
                    profile.createdAt,
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    year: "numeric",
                  })}`
                : "Smart Task Management"}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

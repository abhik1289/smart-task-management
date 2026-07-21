import { BellIcon, SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme-switcher";
import { ProfileMenu } from "@/components/profile-menu";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/80 transition-[width,height] ease-linear backdrop-blur-md group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-3">
      <div className="flex w-full items-center justify-between gap-2 px-4 lg:gap-3 lg:px-6">
        {/* Left: sidebar trigger + title */}
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-1 h-4 data-vertical:self-auto"
          />
          <h1 className="truncate text-base font-medium tracking-tight">
            Dashboard
          </h1>
        </div>

        {/* Right: search, notifications, theme, profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative hidden md:block">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks, members…"
              className="h-8 w-56 rounded-lg pl-8 text-sm lg:w-72"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="text-muted-foreground hover:text-foreground md:hidden">
            <SearchIcon className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative text-muted-foreground hover:text-foreground">
            <BellIcon className="size-4" />
            <span className="absolute right-1.5 top-1.5 inline-flex size-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </Button>

          <Separator
            orientation="vertical"
            className="mx-0.5 hidden h-5 data-vertical:self-auto sm:block"
          />

          <ModeToggle />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

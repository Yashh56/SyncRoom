'use client';

import React from "react";
import CreateRoom from "./room/createRoom";
import JoinRoom from "./room/joinRoom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./theme-toggle";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  // const logout = useAuthStore((state) => state.logout);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60">
      {/* Left section: Logo and branding */}
      <div className="flex items-center gap-3">
        <h1 className="hidden text-xl font-bold text-gray-900 dark:text-gray-50 sm:block">SyncRoom</h1>

        {/* Mobile menu - only visible on small screens */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <DropdownMenuLabel className="text-gray-900 dark:text-gray-50">Room Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-800"
                onSelect={() => {
                  const createRoomButton = document.getElementById("create-room-button");
                  if (createRoomButton) createRoomButton.click();
                }}
              >
                Create Room
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-800"
                onSelect={() => {
                  const joinRoomButton = document.getElementById("join-room-button");
                  if (joinRoomButton) joinRoomButton.click();
                }}
              >
                Join Room
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center section: Room Actions - hidden on mobile */}
      <div className="hidden items-center gap-3 sm:flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div id="create-room-button">
                <CreateRoom />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800">
              Create a new meeting room
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div id="join-room-button">
                <JoinRoom />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800">
              Join an existing meeting
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Right section: User Profile + Theme Toggle */}
      <div className="flex items-center gap-2">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-800">
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={user?.image || ""}
                  alt={user?.name || "User profile"}
                />
                <AvatarFallback className="text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-50">
                  {user?.name || "Guest"}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                  {user?.email || "guest@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-800">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-gray-700 dark:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-800"
              // onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
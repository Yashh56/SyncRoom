import React from "react";
import { useFavouriteRoomStore } from "@/store/useFavouriteRoomStore"; // adjust path as needed
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const Sidebar = () => {
  const { favouriteRooms, removeFavouriteRoom } = useFavouriteRoomStore();

  if (favouriteRooms.length > 0) {
    return (
      <aside className="h-screen w-20 border-rbg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-2 flex flex-col items-center">
        <h2 className="sr-only">Favourite Rooms</h2> {/* Accessible but visually hidden */}

        {favouriteRooms.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-4 text-center">No rooms</p>
        ) : (
          <ScrollArea className="flex-1 w-full">
            <ul className="space-y-4 mt-2">
              {favouriteRooms.map((room) => (
                <li
                  key={room.id}
                  className="relative group flex justify-center"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary hover:scale-105 transition shadow-sm">
                    <AvatarImage src={room.banner} alt={room.name} />
                    <AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {room.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Remove button on hover */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFavouriteRoom(room.id)}
                    aria-label={`Remove ${room.name}`}
                    className="absolute -top-1 -right-1 hidden group-hover:flex h-5 w-5 p-0 text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm"
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </aside>
    );
  }

  return null; // Fixed the return statement that was missing a value
};

export default Sidebar;
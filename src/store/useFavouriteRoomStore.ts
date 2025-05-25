import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Room {
  id: string;
  name: string;
  banner: string;
}

interface FavouriteRoomState {
  favouriteRooms: Room[];
  addFavouriteRoom: (room: Room) => void;
  removeFavouriteRoom: (roomId: string) => void;
  clearFavouriteRooms: () => void;
}

export const useFavouriteRoomStore = create<FavouriteRoomState>()(
  persist(
    (set) => ({
      favouriteRooms: [],
      addFavouriteRoom: (room) =>
        set((state) => ({ favouriteRooms: [...state.favouriteRooms, room] })),
      removeFavouriteRoom: (roomId) =>
        set((state) => ({
          favouriteRooms: state.favouriteRooms.filter(
            (room) => room.id !== roomId
          ),
        })),
      clearFavouriteRooms: () => set({ favouriteRooms: [] }),
    }),
    { name: "favourite-rooms-storage" }
  )
);

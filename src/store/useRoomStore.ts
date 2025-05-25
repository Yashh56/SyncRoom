import { create } from "zustand";

// Define message interface
interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

// Define member interface
interface Member {
  id: string;
  name: string;
  image?: string;
  role?: string; // Optional role property
}

// Define RoomState interface
interface RoomState {
  members: Member[];
  messages: Message[]; // Add a state for messages
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  setMessages: (messages: Message[]) => void; // Action to set all messages
  addMessage: (message: Message) => void; // Action to add a new message
}

export const useRoomStore = create<RoomState>((set) => ({
  members: [],
  messages: [], // Initialize with an empty array of messages
  setMembers: (members) => set({ members }),
  addMember: (member) =>
    set((state) => ({
      members: [...state.members, member],
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    })),
  setMessages: (messages) => set({ messages }), // Action to set all messages
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message], // Add the new message to the array
    })),
}));

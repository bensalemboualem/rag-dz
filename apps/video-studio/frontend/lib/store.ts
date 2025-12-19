import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);

// Credits store
interface CreditsState {
  balance: number;
  setBalance: (balance: number) => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  deductCredits: (amount) => set((state) => ({ balance: state.balance - amount })),
  addCredits: (amount) => set((state) => ({ balance: state.balance + amount })),
}));

// Generation store
interface GenerationTask {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  prompt: string;
  mode: "text-to-video" | "image-to-video";
  videoUrl?: string;
  error?: string;
  createdAt: Date;
}

interface GenerationState {
  tasks: GenerationTask[];
  currentTask: GenerationTask | null;
  addTask: (task: GenerationTask) => void;
  updateTask: (id: string, updates: Partial<GenerationTask>) => void;
  setCurrentTask: (task: GenerationTask | null) => void;
  removeTask: (id: string) => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  tasks: [],
  currentTask: null,
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      currentTask:
        state.currentTask?.id === id
          ? { ...state.currentTask, ...updates }
          : state.currentTask,
    })),
  setCurrentTask: (task) => set({ currentTask: task }),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));

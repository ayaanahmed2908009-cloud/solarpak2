import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { 
  Worker, 
  WorkerLoginInput, 
  WorkerRegisterInput, 
  CreateTaskInput, 
  CreateEventInput,
  Task,
  Event
} from "@shared/worker-schema";

export function useWorkerAuth() {
  const queryClient = useQueryClient();

  const { data: worker, isloading } = useQuery<Worker>({
    queryKey: ["/worker/api/user"],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: WorkerLoginInput) => {
      const response = await apiRequest("POST", "/worker/api/login", credentials);
      const data = await response.json();
      // Set the user data immediately after successful login
      queryClient.setQueryData(["/worker/api/user"], data.worker);
      return data;
    },
    onSuccess: () => {
      // Also invalidate to refresh from server
      queryClient.invalidateQueries({ queryKey: ["/worker/api/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: WorkerRegisterInput) => {
      return await apiRequest("POST", "/worker/api/register", data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/worker/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/worker/api/user"], null);
      queryClient.removeQueries({ queryKey: ["/worker/api/user"] });
    },
  });

  const refreshWorker = () => {
    queryClient.invalidateQueries({ queryKey: ["/worker/api/user"] });
  };

  return {
    worker,
    isLoading,
    isAuthenticated: !!worker,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshWorker,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

export function useWorkerList() {
  return useQuery<Worker[]>({
    queryKey: ["/worker/api/workers"],
    retry: false,
  });
}

export function useWorkersByDepartment(department: string | null | undefined) {
  return useQuery<Worker[]>({
    queryKey: ["/worker/api/workers/department", department],
    queryFn: async () => {
      if (!department) return [];
      const response = await fetch(`/worker/api/workers/department/${department}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    },
    enabled: !!department,
    retry: false,
  });
}

export function useWorkerActivity(workerId: string) {
  return useQuery({
    queryKey: ["/worker/api/activity", workerId],
    enabled: !!workerId,
    retry: false,
  });
}

// Admin hooks
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WorkerRegisterInput) => {
      return await apiRequest("POST", "/worker/api/admin/create-employee", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/workers"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ employeeId, data }: { employeeId: string; data: Partial<Worker> }) => {
      return await apiRequest("PUT", `/worker/api/admin/employees/${employeeId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/workers"] });
    },
  });
}

// Task hooks
export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["/worker/api/tasks"],
    retry: false,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      return await apiRequest("POST", "/worker/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string; data: Partial<Task> }) => {
      return await apiRequest("PUT", `/worker/api/tasks/${taskId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      return await apiRequest("DELETE", `/worker/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/tasks"] });
    },
  });
}

// Event hooks
export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["/worker/api/events"],
    retry: false,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateEventInput) => {
      return await apiRequest("POST", "/worker/api/events", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: string; data: Partial<Event> }) => {
      return await apiRequest("PUT", `/worker/api/events/${eventId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      return await apiRequest("DELETE", `/worker/api/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/worker/api/events"] });
    },
  });
}
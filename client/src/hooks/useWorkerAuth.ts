import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Worker, WorkerLoginInput, WorkerRegisterInput } from "@shared/worker-schema";

export function useWorkerAuth() {
  const queryClient = useQueryClient();

  const { data: worker, isLoading } = useQuery<Worker>({
    queryKey: ["/worker/api/user"],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: WorkerLoginInput) => {
      return await apiRequest("POST", "/worker/api/login", credentials);
    },
    onSuccess: () => {
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

export function useWorkerActivity(workerId: string) {
  return useQuery({
    queryKey: ["/worker/api/activity", workerId],
    enabled: !!workerId,
    retry: false,
  });
}
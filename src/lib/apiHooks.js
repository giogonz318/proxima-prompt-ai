import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { toast } from "@/components/ui/use-toast";

/* =========================
   GENERIC QUERY
========================= */
export const useApiQuery = (key, url, options = {}) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiClient(url),
    ...options,
  });
};

/* =========================
   GENERIC MUTATION
========================= */
export const useApiMutation = (url, method = "POST", options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      apiClient(url, {
        method,
        body: JSON.stringify(data),
      }),

    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);

      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });

      options?.onError?.(error);
    },
  });
};
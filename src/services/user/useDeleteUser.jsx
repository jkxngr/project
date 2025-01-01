import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (user) => request.delete(`/users/${user.user_id}/`).then((res) => res.data),
  });
};
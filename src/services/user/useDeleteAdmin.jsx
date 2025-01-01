import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useDeleteAdmin = () => {
  return useMutation({
    mutationFn: (user) => request.patch(`/users/${user.user_id}/remove-admin`).then((res) => res.data),
  });
};
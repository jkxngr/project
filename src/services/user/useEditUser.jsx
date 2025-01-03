import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../config/request";
export const useEditUser = () => {
  return useMutation({
    mutationFn: (user) =>
      request.patch(`/users/${user.user_id}/admin`).then((res) => res.data),
  });
};

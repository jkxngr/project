import { useMutation } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useUnblockUser = () => {
  return useMutation({
    mutationFn: (user) =>
      request.patch(`/users/${user.user_id}/unblock`).then((res) => res.data),
  });
};

import { useMutation } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useBlockUser = () => {
  return useMutation({
    mutationFn: (user) =>
      request.patch(`/users/${user.user_id}/block`).then((res) => res.data),
  });
};

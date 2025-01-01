import { request } from "../../config/request";
import { useQuery } from "@tanstack/react-query";
export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: ["user-templates"],
    queryFn: () =>
      request.get(`/users/${userId}`).then((res) => res.data),
  });
};

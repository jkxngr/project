import { request } from "../../config/request";
import { useQuery } from "@tanstack/react-query";
export const useGetTemplates = (userId) => {
  return useQuery({
    queryKey: ["my-templates"],
    queryFn: () =>
      request.get(`/users/${userId}/templates`).then((res) => res.data),
  });
};

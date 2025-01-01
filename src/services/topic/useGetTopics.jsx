import { request } from "../../config/request";
import { useQuery } from "@tanstack/react-query";
export const useGetTopics = () => {
  return useQuery({
    queryKey: ["topic"],
    queryFn: () => request.get("/topics").then((res) => res.data),
  });
};

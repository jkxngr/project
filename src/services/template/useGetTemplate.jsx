import { request } from "../../config/request";
import { useQuery } from "@tanstack/react-query";
export const useGetTemplate = () => {
  return useQuery({
    queryKey: ["template"],
    queryFn: () => request.get("/templates").then((res) => res.data),
  });
};

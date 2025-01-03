import { request } from "../../config/request";
import { useQuery } from "@tanstack/react-query";
export const useGetTemplateById = (templateId) => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () =>
      request.get(`/templates/${templateId}`).then((res) => res.data),
  });
};

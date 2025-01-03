import { request } from "../../config/request";
import { useMutation } from "@tanstack/react-query";
export const useEditTemplate = () => {
  return useMutation({
    mutationFn: (template) =>
      request.post(`/templates${template.template_id}`).then((res) => res.data),
  });
};

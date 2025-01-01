import { request } from "../../config/request";
import { useMutation } from "@tanstack/react-query";
export const usePostTemplate = () => {
  return useMutation({
    mutationFn: (data) =>
      request.post("/templates", data).then((res) => res.data),
  });
};

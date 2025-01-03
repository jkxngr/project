import { request } from "../../config/request";
import { useMutation } from "@tanstack/react-query";
export const usePostForms = () => {
  return useMutation({
    mutationFn: (data) => request.post("/forms", data).then((res) => res.data),
  });
};

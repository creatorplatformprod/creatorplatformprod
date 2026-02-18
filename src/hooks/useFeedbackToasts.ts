import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";

type FeedbackToastsInput = {
  success?: string;
  error?: string;
  info?: string;
};

export const useFeedbackToasts = ({ success, error, info }: FeedbackToastsInput) => {
  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (info) {
      toast.info(info);
    }
  }, [info]);
};


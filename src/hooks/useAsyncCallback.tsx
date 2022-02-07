import { useState } from "react";

export function useAsyncCallback<Payload = any, Response = any, Reject = any>(
  promise: (payload: Payload) => Promise<Response>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  function reset() {
    setStatus("idle");
  }

  function execute(
    payload: Payload,
    onSuccess: (payload: Response) => void,
    onError: (payload: Reject) => void
  ): void {
    setLoading(true);
    setStatus("pending");
    promise(payload)
      .then((response) => {
        setStatus("success");
        onSuccess(response);
      })
      .catch((error: Reject) => {
        setStatus("error");
        onError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { execute, reset, loading, status };
}

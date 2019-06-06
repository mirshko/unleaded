import { useState } from "react";

const useAPI = (method, endpoint, data) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(async () => {
    try {
      setIsLoading(true);
      setResponse(null);
      setError(null);

      const res = await fetch(endpoint, { method, data });

      setIsLoading(false);
      setResponse(res);
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  }, [method, endpoint, data]);

  return {
    response,
    error,
    isLoading
  };
};

export default useAPI;

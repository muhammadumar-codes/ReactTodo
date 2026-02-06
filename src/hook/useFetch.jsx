import { useEffect, useState } from "react";
import axios from "axios";


// ===* useFetch component *===
export function useFetch({ url }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      if (!url) {
      console.warn(" Please provide a valid API URL!");
      setIsLoading(false);
      return;
    }

    // ===*Create a controller to cancel the request if needed*===

    const controller = new AbortController();

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // ===* Pass controller.signal to axios to handle cancellation*===
    
        const response = await axios.get(url, { signal: controller.signal });

        setData(response.data);
        setError(null);
      } catch (err) {
          //
          // ===*Check if the request was cancelled*===

        if (axios.isCancel(err)) {
          console.log(" Request cancelled by the user or unmount.");
        } else {
          console.error(" Fetch error:", err);
          setError("Something went wrong while fetching data.");
        }
      } finally {
          setIsLoading(false);
        }
    };

    fetchData();

    // ===*  Cleanup: runs when component unmounts*===

    return () => {
        controller.abort(); //
    };
  }, [url]);

  // ===* Reusable in  any components  *===
  return { data, isLoading, error };
}

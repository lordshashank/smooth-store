import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export const useTotalRenewDealsCount = () => {
  const [totalRenewDealsCount, setTotalRenewDealsCount] = useState(0);
  const { address } = useAccount();

  useEffect(() => {
    const fetchTotalRenewDealsCount = async () => {
      if (!address) return;
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/users/${address.toLowerCase()}/cart/renew-deals/count`
        );
        if (response.ok) {
          const data = await response.json();
          setTotalRenewDealsCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching total renew deals count", error);
      }
    };
    if (address) fetchTotalRenewDealsCount();
  }, [address]);

  return { totalRenewDealsCount, setTotalRenewDealsCount };
};

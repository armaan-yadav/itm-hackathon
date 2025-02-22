import { createContext, useState, useEffect } from "react";
import { landServices } from "@/services/landServices";

const LIMIT = 5;

export const landContext = createContext({
  lands: [],
  loading: false,
  hasMore: true,
  setPage: () => {},
  getLandById: () => null,
});

export const LandContextProvider = ({ children }) => {
  const [lands, setLands] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadLands = async () => {
    setLoading(true);
    try {
      const newLands = await landServices.fetchLand({
        limit: LIMIT,
        offset: page * LIMIT,
      });

      setLands((prev) => [...prev, ...newLands]);

      if (newLands.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load lands", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLands();
  }, [page]);

  const getLandById = (id) => {
    return lands.find((land) => land.id === id) || null;
  };

  return (
    <landContext.Provider
      value={{ lands, loading, hasMore, setPage, getLandById }}
    >
      {children}
    </landContext.Provider>
  );
};

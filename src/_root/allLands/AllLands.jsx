import { useContext, useEffect, useRef, useCallback } from "react";
import { landContext } from "@/context/landContext";
import LandCard from "@/components/shared/LandCard";

const AllLands = () => {
  const { lands, loading, hasMore, setPage } = useContext(landContext);
  const observer = useRef();

  const lastLandElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Available Lands</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lands.map((land, index) => (
          <LandCard
            key={land.id}
            land={land}
            refProp={index === lands.length - 1 ? lastLandElementRef : null}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {!hasMore && lands.length > 0 && (
        <div className="text-center py-4 text-gray-600">
          No more lands to load
        </div>
      )}

      {!loading && lands.length === 0 && (
        <div className="text-center py-4 text-gray-600">No lands available</div>
      )}
    </div>
  );
};

export default AllLands;

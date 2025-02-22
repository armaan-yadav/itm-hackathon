import ProductCard from "@/components/shared/ProductCard";
import ProductCardShimmer from "@/components/shimmer/ProductShimmer";
import { productsContext } from "@/context/productsContext";
import { useContext, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const { products, loading, hasMore, setPage } = useContext(productsContext);
  const observer = useRef();

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPage]
  );

  const renderShimmerGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {[...Array(5)].map((_, index) => (
        <ProductCardShimmer key={`shimmer-${index}`} />
      ))}
    </div>
  );

  const renderProducts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product, index) => {
        if (products.length === index + 1) {
          return (
            <div ref={lastProductRef} key={product.id || index}>
              <ProductCard {...product} thumbnailImage={product.media[0]} />
            </div>
          );
        } else {
          return (
            <div key={product.id || index}>
              <ProductCard {...product} thumbnailImage={product.media[0]} />
            </div>
          );
        }
      })}
      {loading && hasMore && (
        <>
          {[...Array(2)].map((_, i) => (
            <ProductCardShimmer key={`load-more-shimmer-${i}`} />
          ))}
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Fresh Veggies/Fruits, Direct from Farmers
      </h1>

      {products.length === 0 && loading
        ? renderShimmerGrid()
        : renderProducts()}

      {/* {!hasMore && products.length > 0 && (
        <span className="text-center text-gray-500 mt-8">No more loads</span>
      )} */}
    </div>
  );
};

export default AllProducts;

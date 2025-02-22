import { createContext, useState, useEffect } from "react";
import { productServices } from "@/services/productServices";

const LIMIT = 5;

export const productsContext = createContext({
  products: [],
  loading: false,
  hasMore: true,
  setPage: () => {},
  getProductById: () => null, // Placeholder function
});

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const newProducts = await productServices.fetchProducts({
        limit: LIMIT,
        offset: page * LIMIT,
      });

      setProducts((prev) => [...prev, ...newProducts]);

      if (newProducts.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  const getProductById = (id) => {
    return products.find((product) => product.id === id) || null;
  };

  return (
    <productsContext.Provider
      value={{ products, loading, hasMore, setPage, getProductById }}
    >
      {children}
    </productsContext.Provider>
  );
};

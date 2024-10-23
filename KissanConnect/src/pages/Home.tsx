import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/config';
import { useCart } from './CartContext'; // Import the cart context

// Define the Product interface
interface Product {
  id: string;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook to navigate between pages
  const { dispatch } = useCart(); // Access the dispatch function from the cart context

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle adding product to the cart
  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product }); // Dispatch action to add product to cart
  };

  if (loading) {
    return <p>Loading...</p>; // Display a loading message while fetching
  }

  return (
    <div className="store">
      <h1>Store</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.productName} className="product-image" />
            <h2>{product.productName}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button> {/* Add to Cart Button */}
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/cart')}>Go to Cart</button> {/* Navigate to Cart Button */}
    </div>
  );
};

export default Home;

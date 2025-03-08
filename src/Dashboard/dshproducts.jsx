import React, { useEffect, useState } from "react";
import "./dshproducts.css";
import DASHHeader from "./DashboardComponents/dashHeader";
import DashSidebar from "./DashboardComponents/dashSidebar";
import { useTranslation } from "../TranslationContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dshproducts() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { translations } = useTranslation();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    imageFile: null, // New field for image
  });

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch product's first image by product ID
  const fetchProductImage = async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/product-images/product/${productId}`
      );
      console.log(
        `API Response for product ${productId}:`,
        response.data[0].imagePath
      );
      // Ensure the response has the expected structure
      if (response.data && response.data.length > 0) {
        return response.data[0].imagePath; // Return first image
      }
    } catch (error) {
      console.error(`Error fetching image for product ${productId}:`, error);
    }
    return "/path/to/default/image.jpg"; // Fallback image
  };
  // Fetch product images by product ID

  const fetchProductImages = async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/product-images/product/${productId}`
      );
      console.log(`API Response for product ${productId}:`, response.data);

      // Check if the response data and productImages exist
      if (response.data && Array.isArray(response.data.productImages)) {
        return response.data.productImages;
      } else {
        console.warn(`No images found for product ${productId}`);
        return []; // Return empty array if no images
      }
    } catch (error) {
      console.error(`Error fetching image for product ${productId}:`, error);
      return []; // Return empty array in case of error
    }
  };

  // Fetch all products and attach images
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);

      if (response.data && Array.isArray(response.data)) {
        const productsWithImage = response.data.map((product) => {
          // Extract the image from productImages
          const productImages = product.productImages || [];

          // Check if productImages exists and has a default image
          const defaultImage = productImages.find((image) => image.isDefault);
          console.log("Default Image Path:", defaultImage.imagePath);

          // Use the default image or fallback to a placeholder image if no default image exists
          const imageUrl = defaultImage
            ? `https://${defaultImage.imagePath}`
            : "/path/to/default/image.jpg"; // Fallback image

          // Return the product with the image URL included
          return {
            ...product,
            imageUrl: imageUrl, // Add the imageUrl to each product
          };
        });

        console.log("Final Products with Images:", productsWithImage);
        setProducts(productsWithImage); // Assuming you're using state management like setState or context
      } else {
        console.error(
          "No products found or incorrect data format:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Create Product + Image
  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found! User is not authenticated.");
        return;
      }

      // Step 1: Create the Product First (send as JSON, map imageFile to image)
      const productResponse = await axios.post(
        `${API_BASE_URL}/products`,
        {
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          quantity: newProduct.quantity,
          categoryId: newProduct.categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const createdProduct = productResponse.data;

      console.log("Uploading image for product:", createdProduct.id);
      console.log("Image file:", newProduct.imageFile);

      // Step 2: Upload Image if present (send as multipart/form-data)
      if (newProduct.imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("imageFile", newProduct.imageFile); // The image file itself
        imageFormData.append("isDefault", true); // Set the isDefault flag
        imageFormData.append("productId", createdProduct.id); // Pass the product ID

        // Send the image data to the product-images endpoint
        await axios.post(
          `${API_BASE_URL}/product-images`, // Make sure this is the correct endpoint for image upload
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Correct content type for file upload
            },
          }
        );
      }

      // Refresh Products
      fetchProducts();

      // Reset Form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        imageFile: null,
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Delete Product
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Delete Product Image
  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/product-images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Open Edit Modal
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
    });
  };
  // Update Product and Image
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      // Ensure categoryId is a number or null
      const formattedUpdatedProduct = {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
        categoryId: updatedProduct.categoryId
          ? parseInt(updatedProduct.categoryId)
          : null,
      };

      // Step 1: Update Product (map imageFile to image)
      await axios.put(
        `${API_BASE_URL}/products/${editingProduct.id}`,
        formattedUpdatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <div className="wrap-container">
        <DashSidebar
          OpenSidebar={OpenSidebar}
          openSidebarToggle={openSidebarToggle}
        />
        <div className="middle-container">
          <DASHHeader OpenSidebar={OpenSidebar} />
          <main className="productSection">
            <div class="head">
              <h1 className="products">{translations.products}</h1>
            </div>
            <div class="productsTable">
              <table>
                <thead>
                  <tr>
                    <th className="select">{translations.select}</th>
                    <th className="P.Id">{translations.pn}</th>
                    <th className="">{translations.productImage}</th>
                    <th className="prodname">{translations.prodname}</th>
                    <th className="desc">{translations.description}</th>
                    <th className="price">{translations.price}</th>
                    <th className="">{translations.quantity}</th>
                    <th className="categoryid">{translations.categoryId}</th>
                    <th>{translations.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((products) => (
                    <tr
                      key={products.id}
                      onClick={() =>
                        navigate(
                          `/dashboard/products/productdetails/${products.id}`
                        )
                      }
                    >
                      <td>
                        <i class="fa-regular fa-square"></i>
                      </td>
                      <td>{products.id}</td>
                      <td>
                        <img
                          src={products.imageUrl}
                          style={{ width: "50px", height: "50px" }}
                          alt={products.name}
                        />
                        {console.log(products.imageUrl)}{" "}
                        {/* Log each product's imageUrl */}
                      </td>
                      <td>{products.name}</td>
                      <td>{products.description}</td>
                      <td>{products.price}</td>
                      <td>{products.quantity}</td>
                      <td>{products.categoryId}</td>
                      <td>
                        <button
                          className="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(products);
                          }}
                        >
                          {translations.edit}
                        </button>
                        <button
                          className="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(products.id);
                          }}
                        >
                          {translations.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="toaddproduct">
              <button
                className="addprod"
                onClick={() => setShowCreateProduct(!showCreateProduct)}
              >
                {showCreateProduct ? "Close" : `${translations.addprod}`}
              </button>
            </div>

            {/* Create Product Form */}
            {showCreateProduct && (
              <div className="create-user-form">
                <h3>Create New Product</h3>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      imageFile: e.target.files[0],
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Category ID"
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                />
                <button onClick={handleCreateProduct}>Create Product</button>
              </div>
            )}
            {/* Edit User Modal */}
            {editingProduct && (
              <div className="edit-user-modal">
                <h3>Edit Product</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={updatedProduct.description}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      price: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  value={updatedProduct.quantity}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Category Id"
                  value={updatedProduct.categoryId}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                />
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Dshproducts;

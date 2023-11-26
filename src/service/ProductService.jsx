import { callAPI } from "./API";

const url = `/api/product`;
const urlImage = `/api/uploadImageProduct`;
class ProductService {
  addProduct = async (
    name,
    price,
    description,
    status,
    valueCategoryItem,
    quantityValue,
    selectedImages,
    imagesave,
    idShop
  ) => {
    const reponse = await callAPI(`${url}/shop/${idShop}`, "POST", {
      product_name: name,
      price: price,
      description: description,
      status: status,
      create_date: new Date(),
      categoryItem_product: {
        id: valueCategoryItem
      }
    });
    if (reponse && quantityValue !== 0) {
      await callAPI(`/api/product/createStorage/${reponse.data.id}`, "POST", {
        quantity: quantityValue,
        create_date: new Date()
      });
    }

    if (reponse && selectedImages.length > 0) {
      try {
        const formData = new FormData();
        imagesave.forEach((image, index) => {
          formData.append(`images`, image);
        });
        formData.append("idProduct", reponse.data.id);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        await callAPI(urlImage, "POST", formData, config);
      } catch (error) {
        console.error("Error for", error);
      }
    }
    return reponse;
  };

  updateProduct = async (
    productid,
    name,
    price,
    description,
    status,
    valueCategoryItem,
    selectedImages,
    imagesave
  ) => {
    const reponse = await callAPI(`${url}/${productid}`, "PUT", {
      product_name: name,
      price: price,
      description: description,
      status: status,
      categoryItem_product: {
        id: valueCategoryItem
      }
    });
    if (reponse && selectedImages.length > 0) {
      try {
        const formData = new FormData();
        imagesave.forEach((image, index) => {
          formData.append(`images`, image);
        });
        formData.append("idProduct", reponse.data.id);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        await callAPI(urlImage, "POST", formData, config);
      } catch (error) {
        console.error("Error for", error);
      }
    }
    return reponse;
  };

  getAllProduct = async shop => {
    try {
      const response = await callAPI(
        `${url}/getByShop?shop=${shop}&status=`,
        "GET"
      ); // Ensure status parameter is included
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Return an empty array or handle the error according to your app's logic
    }
  };

  getAllProductWithStorage = async () => {
    const reponse = await callAPI(`${url}/getAllProductWithStorage`, "GET");
    return reponse;
  };

  getProductbyId = async id => {
    const reponse = await callAPI(`${url}/${id}`, "GET");
    return reponse;
  };

  getImage = () => {
    return "http://localhost:8080/api/uploadImageProduct";
  };
}

export default new ProductService();

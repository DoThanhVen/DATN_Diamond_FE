import { callAPI } from "./API";
const urlCategory = `/api/category`;
const urlCategoryItem = `/api/category/categoryItem`;
class CategoryService {
  getAllCategory = async () => {
    return await callAPI(urlCategory, "GET");
  };

  getAllCategoryById = async (id) => {
    return await callAPI(`${urlCategory}/${id}`, "GET");
  };

  addCategory = async (type_category, image, idAccount, token) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("id_account", idAccount);
    formData.append("type_category", type_category);
    formData.append("create_date", new Date());
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    };

    const response = await callAPI(`/api/auth/category`, "POST", formData, config);
    return response;
  };

  updateCategory = async (id, type_category, image, token) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("type_category", type_category);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    };
    const response = await callAPI(
      `/api/auth/category/${id}`,
      "PUT",
      formData,
      config
    );
    return response;
  };

  deleteCategory = async (id, token) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };
    const response = await callAPI(`/api/auth/category/${id}`, "DELETE",{}, config);
    console.log(response)
    return response;
  };

  //CategoryItem
  getAllCategoryItem = async () => {
    return await callAPI(urlCategoryItem, "GET");
  };

  getAllCategoryItemById = async (id) => {
    return await callAPI(`${urlCategoryItem}/${id}`, "GET");
  };

  addCategoryItem = async (idCategory, type_category_item, idAccount, token) => {
    const formData = new FormData();
    formData.append("category", idCategory);
    formData.append("idAccount", idAccount);
    formData.append("type_categoryItem", type_category_item);
    formData.append("create_date", new Date());
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    const reponse = await callAPI('/api/auth/categoryItem', "POST", formData, config);
    return reponse;
  };

  updateCategoryItem = async (id, idCategory, type_category_item, idAccount, token) => {
    const formData = new FormData();
    formData.append("category", idCategory);
    formData.append("idAccount", idAccount);
    formData.append("type_categoryItem", type_category_item);
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    const reponse = await callAPI(`/api/auth/categoryItem/${id}`, "PUT", formData, config);
    return reponse;
  };

  deleteCategoryItem = async (id, token) => {
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    const response = await callAPI(`/api/auth/categoryItem/${id}`, "DELETE",{}, config);
    return response;
  };
}
export default new CategoryService();

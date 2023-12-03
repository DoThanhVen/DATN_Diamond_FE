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

  addCategory = async (type_category, image, idAccount) => {
    const formData = new FormData();
    console.log(idAccount)
    formData.append("image", image);
    formData.append("id_account", idAccount);
    formData.append("type_category", type_category);
    formData.append("create_date", new Date());
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    const response = await callAPI(`${urlCategory}`, "POST", formData, config);
    return response;
  };

  updateCategory = async (id, type_category, image) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("type_category", type_category);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    const response = await callAPI(
      `${urlCategory}/${id}`,
      "PUT",
      formData,
      config
    );
    return response;
  };

  deleteCategory = async (id) => {
    const response = await callAPI(`${urlCategory}/${id}`, "DELETE");
    return response;
  };

  //CategoryItem
  getAllCategoryItem = async () => {
    return await callAPI(urlCategoryItem, "GET");
  };

  getAllCategoryItemById = async (id) => {
    return await callAPI(`${urlCategoryItem}/${id}`, "GET");
  };

  addCategoryItem = async (idCategory, type_category_item, idAccount) => {
    const formData = new FormData();
    formData.append("category", idCategory);
    formData.append("idAccount", idAccount);
    formData.append("type_categoryItem", type_category_item);
    formData.append("create_date", new Date());
    const reponse = await callAPI(urlCategoryItem, "POST", formData);
    return reponse;
  };

  updateCategoryItem = async (id, idCategory, type_category_item,idAccount) => {
    const formData = new FormData();
    formData.append("category", idCategory);
    formData.append("idAccount", idAccount);
    formData.append("type_categoryItem", type_category_item);
    const reponse = await callAPI(`${urlCategoryItem}/${id}`, "PUT", formData);
    return reponse;
  };

  deleteCategoryItem = async (id) => {
    const response = await callAPI(`${urlCategoryItem}/${id}`, "DELETE");
    return response;
  };
}
export default new CategoryService();

import { callAPI } from "./API";
const url = `/api`
class ShopService {
    getAllshop = async () => {
        return await callAPI(`${url}/findAll`, 'GET')
    }

    getAllshopById = async (id) => {
        return await callAPI(`${url}/${id}`, 'GET')
    }

    addshop = async (shopName, image) => {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("idAccount", '5');
            formData.append("shopName", shopName);
            formData.append("create_date", new Date());
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
            const response = await callAPI(`${url}`, 'POST', formData, config);
            return response;
        
    };

    // updateshop = async (id, type_shop, image) => {
    //     const formData = new FormData();
    //     formData.append("image", image);
    //     formData.append("type_shop", type_shop);
    //     const config = {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         }
    //     };
    //     const response = await callAPI(`${urlshop}/${id}`, 'PUT', formData, config);
    //     return response;

    // };
    updateStatusAdmin=async(shop,status,token)=>{
        const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const formData=new FormData()
          formData.append('id',shop);
          formData.append('status',status)
        const response = await callAPI(`/api/auth/admin/update`, 'PUT',formData,config);
           return response;
    }
    // deleteshop=async (id)=>{
    //     const response = await callAPI(`${urlshop}/${id}`, 'DELETE');
    //     return response;
    // }



} export default new ShopService();
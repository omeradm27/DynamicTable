import requests from './httpService';

const DynamicTableServices = {
  getAllTableData() {
    return requests.get('/table');
  },

//   getCategoryById(id) {
//     return requests.get(`/category/${id}`);
//   },
//   getShowingCategory() {
//     return requests.get(`/category/show`);
//   },
//   getShowingCategoryByCompanyID(id) {
//     return requests.get(`/category/show/${id}`);
//   },
//   getAllCategoryByCompanyId(id) {
//     return requests.get(`/category/company/${id}`);
//   },

//   addCategory(body) {
//     return requests.post('/category/add', body);
//   },

//   updateCategory(id, body) {
//     return requests.put(`/category/${id}`, body);
//   },

//   updateStatus(id, body) {
//     return requests.put(`/category/status/${id}`, body);
//   },

//   deleteCategory(id, body) {
//     return requests.delete(`/category/${id}`, body);
//   },

//   //FOTO CRUD 
//   addFoto(body, companyID, productID) {
//     return requests.post(`/category/addFoto/${companyID}/${productID}`, body);
//     //return requests.post(`/fotos/add/${companyID}/${productID}/${date_info}`, body);
//   },

//   getFotos(companyID, productID, fotoName) {
//     return requests.get(`/category/getFotos/${companyID}/${productID}/${fotoName}`, { responseType: 'blob' })
//   },

//   deleteFoto(fotoName, companyID, productID) {
//     return requests.delete(`/category/deleteFoto/${companyID}/${productID}/${fotoName}`);
//   },

//   deleteFolder(companyID, productID) {
//     return requests.delete(`/category/deleteFolder/${companyID}/${productID}`);
//   }

};


export default DynamicTableServices;

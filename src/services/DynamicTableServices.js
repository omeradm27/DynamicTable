import requests from './httpService';

const DynamicTableServices = {
    getAllTableData() {

        return requests.get('/table');
    },
    addTableData(body) {
        return requests.post('/table/add', body);
    },
    updateTableData(id,body) {
        return requests.put(`/table/update/${id}`, body);
    },
    deleteTableData(id) {
        return requests.delete(`/table/delete/${id}`);
    },
};


export default DynamicTableServices;

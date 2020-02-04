import axios from 'axios'

export default {
    getTools: () =>
        axios.get('/api/tool'),
    editTool: tool =>
        axios.put('/api/tool', tool),
    postTool: tool =>
        axios.post('/api/tool', tool),
    deleteTool: id =>
        axios.delete(`/api/tool/${id}`),
    getToolModels: () =>
        axios.get('/api/tool/models'),
    getDetailToolModels: () =>
        axios.get('/api/tool/detailModels'),
    editInventoryNumber: (toolID, inventoryNumber) => 
        axios.put('/api/tool/inventoryNumber', { toolID, inventoryNumber }),
    getLastInventoryNumber: () => 
        axios.get('/api/tool/inventoryNumber'),

    getRigs: () =>
        axios.get('/api/rig'),
    editRig: rig =>
        axios.put('/api/rig', rig),
    postRig: rig =>
        axios.post('/api/rig', rig),
    deleteRig: id =>
        axios.delete(`/api/rig/${id}`),
    getRigModels: () =>
        axios.get('/api/rig/models'),

    getConsumables: () =>
        axios.get('/api/consumable'),
    editConsumable: consumable =>
        axios.put('/api/consumable', consumable),
    postConsumable: consumable =>
        axios.post('/api/consumable', consumable),
    deleteConsumable: id =>
        axios.delete(`/api/consumable/${id}`),
    getConsumableModels: () =>
        axios.get('/api/consumable/models'),
    
    getOrders: () =>
        axios.get('/api/order'),
    getActiveOrders: () =>
        axios.get('/api/order/active'),
    editOrder: order =>
        axios.put('/api/order', order),
    postOrder: order =>
        axios.post('/api/order', order),
    deleteOrder: id =>
        axios.delete(`/api/order/${id}`),
    getContractNumber: () =>
        axios.get(`/api/order/contractNumber`),
    downloadHistory: (startDate, finishDate) =>
        axios({
            url: `/api/order/CSVHistory/${startDate}/${finishDate}`,
            method: 'GET',
            responseType: 'blob',
        }),

    getMaintain: () =>
        axios.get('/api/maintain'),
    editMaintain: maintain =>
        axios.put('/api/maintain', maintain),
    postMaintain: maintain =>
        axios.post('/api/maintain', maintain),
    deleteMaintain: id => 
        axios.delete(`/api/maintain/${id}`),

    getClients: () => 
        axios.get('/api/client'),
    editClient: client => 
        axios.put('/api/client', client),
    postClient: client => 
        axios.post('/api/client', client),
    deleteClient: id => 
        axios.delete(`/api/client/${id}`),
    addClientToBlackList: id => 
        axios.put(`/api/client/blacklist/add/${id}`),
    removeClientFromBlackList: id => 
        axios.put(`/api/client/blacklist/remove/${id}`),
    getClientInfoByPhoneNumber: phoneNumber => 
        axios.get(`/api/client/byPhoneNumber/${phoneNumber}`),
    getClientInfoByName: name =>
        axios.get(`/api/client/byName/${name}`),
    getClientInfoByPassport: passport =>
        axios.get(`/api/client/byPassport/${passport}`),
    validatePassport: passport => 
        axios.get(`/api/client/validatePassport/${passport}`),

    getDiscounts: () =>
        axios.get('/api/discount'),
    editDiscount: discount =>
        axios.put('/api/discount', discount),
    postDiscount: discount =>
        axios.post('/api/discount', discount),
    deleteDiscount: id => 
        axios.delete(`/api/discount/${id}`),
    getDiscountModels: () =>
        axios.get('/api/discount/models'),

    getInventory: () =>
        axios.get('/api/inventory'),
    editInventory: inventory =>
        axios.put('/api/inventory', inventory),
    postInventory: inventory =>
        axios.post('/api/inventory', inventory),
    deleteInventory: id =>
        axios.delete(`/api/inventory/${id}`),

    auth: (login, password, rememberMe) => 
        axios.post('/api/user/auth', { login, password, rememberMe }),
    checkToken: () => 
        axios.get('/api/user/checkToken'),

    checkDebt: (name, passport, birthDate) =>
        axios.get(`api/client/checkDebt`, { 
            params: {
                name,
                passport,
                birthDate,
            }
        })
}
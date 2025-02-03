import { privateRequest } from '../config/axios.config'

/* list of resource */
export const index = async (page, perPage) => {
    return await privateRequest.get(`/admin/product`);
};

/* resource store */
export const store = async(data) => {
    return await privateRequest.post('/admin/product', data)
}

/* resource show */
export const show = async(id) => {
    return await privateRequest.get(`/admin/product/${id}`)
}

/* reosurce update */
export const update = async(id, data) => {
    return await privateRequest.post(`/admin/product/${id}`, data)
}

/* resource destory */
export const destroy = async (id) => {
    return await privateRequest.delete(`/admin/product/${id}`)
}

/** category list */
export const categoryList = async () => {
    return await privateRequest.get(`/admin/product/`);
};

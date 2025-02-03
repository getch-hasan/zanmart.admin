import { privateRequest } from '../config/axios.config'

/* list of resource */
export const index = async (page, perPage) => {
    return await privateRequest.get(`/admin/web-setting?page=${page}&page_size=${perPage}`);
};

/* resource store */
export const store = async(data) => {
    return await privateRequest.post('/admin/web-setting', data)
}

/* resource show */
export const show = async(id) => {
    return await privateRequest.get(`/admin/web-setting/${id}`)
}

/* reosurce update */
export const update = async(id, data) => {
    return await privateRequest.put(`/admin/web-setting/${id}`, data)
}

/* resource destory */
export const destroy = async (id) => {
    return await privateRequest.delete(`/admin/web-setting/${id}`)
}

/** web-setting list */
// export const web-settingList = async () => {
//     return await privateRequest.get(`/admin/web-setting/`);
// };

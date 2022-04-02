import request from '../../utils/request'
import qs from 'qs'

const urlPrefix = "api/lineage/baseData";

export const getBaseData = (url, data) => {
    return request({
        url: urlPrefix + '/' + url,
        method: 'post',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: qs.stringify(data),
    })
}

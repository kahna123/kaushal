import axios from 'axios';
import GlobalProperties from './GlobalPropperties';

const getToken = () => {
    const user = sessionStorage.getItem('nopToken') || null;
    // const data = user ? JSON.parse(user) : null;
   return user ? user : null;
//    return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJDdXN0b21lcklkIjo2NjcxLCJleHAiOjE3Mzc3ODUwNTEuMH0.Ej3i-ZHv9k8swSuVNuJcz4KF7r_AeGiA-j9KN-zdNmc"
  
}

const UrlType = {
    TEST: 'TEST',
    LIVE: 'LIVE',
    LOCAL: 'LOCAL'
};

const CallFor2 = async (requestUrl, method, data, headerType) => {
    let url = '';
    // if (GlobalProperties.environment === UrlType.LIVE) {
    //     url = GlobalProperties.urlParam + requestUrl;
    // } else if (GlobalProperties.environment === UrlType.TEST) {
    //     url = GlobalProperties.testParam + requestUrl;
    // } else {
    url = GlobalProperties.ezeo_shopmystation + requestUrl;
    // }

    const headers = {};

    switch (headerType) {
        case 'withoutAuth':
            headers['Content-Type'] = 'application/json';
            break;
        case 'Auth':
            // headers['authorization'] = 'Bearer ' + getToken();
            headers['Token'] = getToken();
            headers['Content-Type'] = 'application/json';
            break;
        case 'authWithoutContentType':
            headers['authorization'] = 'Bearer ' + getToken();
            break;
        case 'authWithContentTypeMultipart':
            headers['Token'] = getToken();
            headers['Content-Type'] = 'multipart/form-data';
            break;
        default:
            break;
    }

    try {
        const response = await axios({
            url,
            method,
            headers,
            data
        });
        return response;
    } catch (error) {
        // handleError(error);
        // return {
        //     status: 500,
        //     message: 'Server Error Found'
        // };
    }
}

export default CallFor2;



// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJDdXN0b21lcklkIjoxLCJleHAiOjE3MzQ3NzY3NDIuMH0.Ry59TosqpfR7rOjt9BznbMWUgzcAYcrokl00AoRplGs'
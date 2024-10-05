
import axios from 'axios';
import GlobalProperties from './GlobalPropperties';

const getToken = () => {
    const user = sessionStorage.getItem('token') || null;
    // const data = user ? JSON.parse(user) : null;
    return user ? user : null;
}

const UrlType = {
    TEST: 'TEST',
    LIVE: 'LIVE',
    LOCAL: 'LOCAL'
};

console.log(getToken());

const CallFor = async (requestUrl, method, data, headerType) => {
    let url = '';
    if (GlobalProperties.environment === UrlType.LIVE) {
        url = GlobalProperties.urlParam + requestUrl;
    } else if (GlobalProperties.environment === UrlType.TEST) {
        url = GlobalProperties.testParam + requestUrl;
    } else {
        url = GlobalProperties.localUrlParam + requestUrl;
    }

    const headers = {};

    switch (headerType) {
        case 'withoutAuth':
            headers['Content-Type'] = 'application/json';
            break;
        case 'Auth':
            headers['authorization'] = 'Bearer ' + getToken();
            headers['Content-Type'] = 'application/json';
            break;
        case 'authWithoutContentType':
            headers['authorization'] = 'Bearer ' + getToken();
            break;
        case 'authWithContentTypeMultipart':
            headers['authorization'] = 'Bearer ' + getToken();
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

export default CallFor;
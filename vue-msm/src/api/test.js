// @ 代表的是 /src
// import axios from '@/utils/request'
import request from "@/utils/request";

const BASE_URL = 'http://localhost:8888'
// 测试1
request.get(BASE_URL + "/db.json").then(response => {
    console.log("get1", response.data);
}).catch(error => {
    console.log(error);
});


// 测试2, 使用对象形式传入请求配置，如 请求url, method，param
request({
    url: '/db.json',
    method: "get"
}).then(response => {
    console.log("get2", response.data);
}).catch(error => {
    console.log(error);
});



// 测试3 导出默认对象
export default {
    getList() {
        const req = request({
            // url: BASE_URL + "/db.json",
            url: '/db.json',
            method: "get"
        });
        // console.log(req) // Promise
        return req;
    }
}


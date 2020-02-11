import request from "@/utils/request"
export default {

    //校验密码，userId,passsword旧密码
    checkPwd(userId,passsword){
        return request({
            url:'/user/pwd',
            method:'post',
            data: {
                userId,
                passsword
            }
        })
    },
    //修改密码，userId，password新密码
    updatePwd(userId,passsword){
        return request({
            url:'/user/pwd',
            method:'put',
            data: {
                userId,
                passsword
            }
        })
    }
} 

import request from "@/utils/request"
export default {
    // 获取会员列表
    getList() {
        return request({
            url: '/member/list',
            method: 'get'
        })
    },
    // 分页查询,
    // page当前页码, size 每页显示条数, searchMap 条件
    // 后台要通过 page 和 size 统计本次请求响应的数据
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    // 新增会员
    add(pojo) {
        return request({
            url: '/member',
            method: 'post',
            data: pojo
        })
    },
    // 查询
    getById(id) {
        return request({
            url: `/member/${id}`, // 反单引号 `
            method: 'get'
        })
    },
    // 更新
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`, // 反单引号 ``
            method: 'put', // put 方式提交
            data: pojo
        })
    },
    //删除
    deleteById(id) {
        return request({
          url: `/member/${id}`, // 反单引号 ``
          method: 'delete', // delete 方式提交
        })
      }

}
<template>
  <div>
    <!-- 上方区域 -------------------------------------------------------------------------->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
      <!-- 有prop才可以重置 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="账号" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="姓名" style="width: 100px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" circle @click="fetchData"></el-button>
        <el-button type="info" round @click="resetForm('searchForm')">重置</el-button>
        <el-button type="warning" round icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 列表-->
    <!-- :data 绑定渲染的数据；border: 边框; -->
    <el-table :data="list" height="500px" border style="width: 100%">
      <!--type="index" 获取索引值，从1开始； label 显示的标题; prop 数据字段名； width 列的宽度 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="员工姓名"></el-table-column>
      <el-table-column prop="birthday" label="出生日期" width="110"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="130"></el-table-column>
      <el-table-column prop="salary" label="工资"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 下方页码区域-------------------------------------------------------------------- -->
    <!-- 分页，添加在div里面 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- -------------------------------------新增弹出的部分--------------------------------------------- -->
    <!-- ------------------------------------------------新增弹出的部分 -->
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <!-- status-icon 当表单校验不通过时, 输入框右侧有个 x 小图标 -->
      <el-form
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :rules="rules"
      >
        <el-form-item label="账号" prop="username" :required="true">
          <el-input v-model="pojo.username" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="name" :required="true">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="pojo.birthday" type="date" placeholder="请点击选择" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" :required="true">
          <el-input v-model="pojo.phone" />
        </el-form-item>
        <el-form-item label="工资" prop="salary">
          <el-input v-model="pojo.salary" />
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate" :required="true">
          <el-date-picker v-model="pojo.entryDate" type="date" placeholder="请点击选择" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from "@/api/staff";
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        username: "",
        name: ""
      }, // 条件查询的绑定字段
      pojo: {
        id: null, //增加id
        username: "",
        name: "",
        birthday: "",
        phone: "",
        salary: "",
        entryDate: ""
      }, // 提交的数据
      dialogFormVisible: false, // 控制新增对话框,
      // 校验规则
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ],
        entryDate: [
          { required: true, message: "入职时间不能为空", trigger: "blur" }
        ]
      }
    };
  },

  // 钩子函数获取数据
  created() {
    this.fetchData();
  },
  methods: {
    //列表获取
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const reqs = response.data;
          this.total = reqs.data.total;
          this.list = reqs.data.rows;
          console.log(this.list);
        });
    },
    //分页改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    //分页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 表单重置，
    // 在 el-form-item 标签属性 prop 上, 指定了字段名, 重置才会生效
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 打开新增窗口
    handleAdd() {
      console.log('编辑')
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过，提交添加
          staffApi.add(this.pojo).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            console.log(resp);
            if (resp.flag) {
              // 新增成功, 刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
            } else {
              // 失败, 弹出提示
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          // 验证不通过
          return false;
        }
      });
    },
 
    // 打开编辑窗口
    handleEdit(id) {
      // 清空原数据
      this.handleAdd();
      // 通过Id查询数据
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    // 更新数据
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过，提交
          staffApi.update(this.pojo).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              this.fetchData(); // 刷新列表数据
              this.dialogFormVisible = false; // 关闭窗口
            } else {
              // 失败, 弹出提示
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          // 验证不通过
          return false;
        }
      });
    },
    //删除操作
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认
          console.log("确认");
          staffApi.deleteById(id).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
            });
            if (resp.flag) {
              // 删除成功，刷新列表
              this.fetchData();
            }
          });
        })
        .catch(() => {
          // 取消删除，不理会
          console.log("取消");
        });
    }
  }
};
</script>


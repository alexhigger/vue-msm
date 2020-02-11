<template>
  <div>
    <!-- 上方区域 -------------------------------------------------------------------------->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
      <!-- 有prop才可以重置 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 100px;"></el-input>
      </el-form-item>
      <el-form-item prop="phone" v-if="!isDialog">
        <el-input v-model="searchMap.phone" placeholder="联系电话" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" circle @click="fetchData"></el-button>
        <el-button v-if="!isDialog" type="info" round @click="resetForm('searchForm')">重置</el-button>
        <el-button v-if="!isDialog" type="warning" round icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 ------------------------------------------------------------------------------------------->
    <!-- highlight-current-row 激活单选行, isDialog为true时激活
      @current-change 当点击某一行后,会触发这个事件,从而调用对应的函数clickCurrentChange
      clickCurrentChange函数会接收两个参数:currentRow，oldCurrentRow
    -->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="list"
      height="500px"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="120"></el-table-column>
      <el-table-column v-if="!isDialog" prop="mobile" label="联系电话"></el-table-column>
      <el-table-column v-if="!isDialog" prop="remark" label="备注"></el-table-column>
      <el-table-column v-if="!isDialog" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle  @click="handleEdit(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 -->
    <!-- 分页，添加在div里面 -->
    <el-pagination
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper': 'prev, pager, next,jumper'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <!-- 点击新增弹出的页面 -->
    <el-dialog v-if="!isDialog"
    title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="pojo.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入地址"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm'):updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from "@/api/supplier";
export default {
  props: {
    // 接收父组件传递过来 的数据,通过isDialog来判断 是否为弹框
    // 如果为 true, 则是弹框, false 就是列表
    isDialog: Boolean
  },

  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      }, // 条件查询的绑定字段值
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
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
      supplierApi
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
    //新增功能
    // 打开新增窗口
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 提交新增数据
    addData(formName) {
      console.log("新增");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过，提交添加
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              // 验证不通过
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    // 打开编辑窗口
    handleEdit(id) {
      // 重用打开新增窗口方法, 不要少了 this
      this.handleAdd();
      // 查询数据
      supplierApi.getById(id).then(response => {
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
          supplierApi.update(this.pojo).then(response => {
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
    //删除功能
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认
          supplierApi.deleteById(id).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
              // 删除成功，刷新列表
              this.fetchData();
            }
          });
        })
        .catch(() => {
          // 取消删除，不理会
        });
    },

    // 当点击某一行时,会调用这个函数进行处理
    clickCurrentChange(currentRow) {
      console.log(currentRow);
      // 点击后,要将点击的数据传递到父组件(商品管理中),
      // 则可以通过触发父组件中的option-supplier, 触发之后 ,
      //父组件可以在 option-supplier 这个事件对应的处理函数中进行接收数据currentRow
      this.$emit("option-supplier", currentRow);
    }
  }
};
</script>
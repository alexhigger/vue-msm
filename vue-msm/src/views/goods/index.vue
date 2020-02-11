<template>
  <div>
    <!-- 上方区域 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
      <!-- 有prop才可以重置 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible = true"
          v-model="searchMap.supplierName"
          placeholder="点击选择供应商"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" circle @click="fetchData"></el-button>
        <el-button type="info" round @click="$refs['searchForm'].resetFields()">重置</el-button>
        <el-button type="warning" round icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 ----------------------------------------------------------------------------------->
    <el-table :data="list" height="500px" border style="width: 100%" highlight-current-row>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
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
    <!-- 供应商弹出框---------------------------------------------------------- -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="600px">
      <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>
    <!-- 商品新增弹出框---------------------------------------------------------- -->
    <!-- 新增 or 编辑页面 -->
    <el-dialog title="商品新增" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        status-icon
        ref="pojoForm"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" />
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" />
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" placeholder="0.00" />
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" placeholder="0.00" />
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" placeholder="0" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-input
            @click.native="editOptionSupplier"
            v-model="pojo.supplierName"
            placeholder="选择供应商"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
       <el-button type="primary" @click="pojo.id === null ? addData('pojoForm'):updateData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import goodsApi from "@/api/goods";
// Supplier 作为子组件
import Supplier from "@/views/supplier";

export default {
  //注册Supplier作为子组件
  components: { Supplier },

  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      }, // 条件查询的绑定字段值
      dialogSupplierVisible: false, // 控制供应商对话框
      /******************************************** */
      isEdit: false, //是否为编辑窗口
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierId: null
      },
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
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
      goodsApi
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
    //当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //供应商回显
    optionSupplier(currentRow) {
      // currentRow 子组件传递的数据
      console.log("parent", currentRow);
      this.searchMap.supplierName = currentRow.name; // 供应商名称
      this.searchMap.supplierId = currentRow.id; // 供应商ID
      this.dialogSupplierVisible = false; //关闭窗口
    },

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
          goodsApi.add(this.pojo).then(response => {
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
      goodsApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    //编辑窗口打开供应商
    editOptionSupplier() {
      this.isEdit = true; // 是编辑窗口
      this.dialogSupplierVisible = true;
    },
    optionSupplier(current) {
      //current子组件传递的数据
      // current 子组件传递的数据
      console.log("goods", current);
      // 判断是否编辑
      if (this.isEdit) {
        //编辑窗口打开的选择供应商
        this.pojo.supplierName = current.name; //供应商名称
        this.pojo.supplierId = current.id; // 供应商 id
      } else {
        //搜索区域打开的选择供应商
        this.searchMap.supplierName = current.name; //供应商名称
        this.searchMap.supplierId = current.id; // 供应商 id
      }
      this.isEdit = false; // 注意重新赋值 false
      this.dialogSupplierVisible = false; // 关闭窗口
    },
    //提交更新数据
    updateData(formName) {
      console.log("更新");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过，提交添加
          goodsApi.update(this.pojo).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message
            });
            if (resp.flag) {
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
          goodsApi.deleteById(id).then(response => {
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
    }
  }
};
</script>
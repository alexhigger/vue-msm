<template>
  <div>
    <!-- 条件查询。 inline 属性设置表单变为行内的表单域 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
      <!-- 有prop才可以重置 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称" style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 110px">
          <!--key 标识， label 下拉显示的文本，vulue 表单值 
          不要忘记吧payTypeOptions绑定到data中-->
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday" >
        <!-- value-format 是指定绑定值的格式 -->
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
          style="width:150px;"
        ></el-date-picker>
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
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="110"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="180"></el-table-column>
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

    <!-- ------------------------------------------------新增弹出的部分 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
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
        <el-form-item label="会员卡号" prop="cardNum" :required="true">
          <el-input v-model="pojo.cardNum" />
        </el-form-item>
        <el-form-item label="会员姓名" prop="name" :required="true">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker v-model="pojo.birthday" type="date" placeholder="请点击选择" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" :required="true">
          <el-input v-model="pojo.phone" />
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" />
        </el-form-item>
        <el-form-item label="可用积分">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" class="filter-item" placeholder="请点击选择">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input
            v-model="pojo.address"
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
          @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import memberApi from "@/api/member";

// 支付类型
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页, 默认第1页
      pageSize: 10, // 每页显示条数， 10条
      searchMap: {
        // 条件查询绑定的条件值
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, // 条件查询绑定条件值
      payTypeOptions, // 支付类型，ES6语法
      pojo: {
        id: null, //增加id
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: "",
        integral: "",
        payType: "",
        address: ""
      }, // 提交的数据
      dialogFormVisible: false, // 控制新增对话框,
      // 校验规则
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择支付类型", trigger: "change" }
        ]
      }
    };
  },

  // 钩子函数获取数据
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // memberApi.getList().then(response => {
      //   this.list = response.data.data;
      //   console.log(response.data);
      // });

      // 调用分页方法查询, 不要少了 this
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const reqs = response.data;
          this.total = reqs.data.total;
          this.list = reqs.data.rows;
          console.log(this.total, this.list);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
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
          memberApi.add(this.pojo).then(response => {
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
      // 重用打开新增窗口方法, 不要少了 this
      this.handleAdd();
      // 查询数据
      memberApi.getById(id).then(response => {
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
          memberApi.update(this.pojo).then(response => {
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
      }).then(() => {
          // 确认
          console.log('确认')
          memberApi.deleteById(id).then(response => {
            const resp = response.data;
            //提示信息
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success': 'error'
            })
            if (resp.flag) {
              // 删除成功，刷新列表
              this.fetchData();                                                        
            }
          });
        }).catch(() => {
          // 取消删除，不理会
          console.log('取消')
        });
    }
  },
  filters: {
    // filters 中 this 指向的不是vue实例, 所有无法直接获取 data 中的数据
    payTypeFilter(type) {
      // 全局的 payTypeOptions , 返回一个满足条件的对象
      const obj = payTypeOptions.find(obj => obj.type === type);
      // 非空返回类型名称
      return obj ? obj.name : null;
    }
  }
};
</script>
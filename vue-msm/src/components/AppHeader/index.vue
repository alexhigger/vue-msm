<template>
  <div class="header">
    <!-- 头部左侧Logo和标题 -->
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="company">Vue-会员管理系统</span>
    </a>
    <!-- 头部右侧下拉菜单 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
         当前用户 &ensp;: &ensp;&ensp;&ensp;
        <i class="el-icon-user"></i>
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a" icon="el-icon-edit-outline">修改密码</el-dropdown-item>
        <el-dropdown-item command="b" icon="el-icon-switch-button">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹出的部分 ---------------------------------------------------->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px ">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass" autocomplete="off">
          <el-input type="password" v-model.number="ruleForm.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>




<script>
import { logout } from "@/api/login";
import passwordApi from "@/api/password";
export default {
  data() {
    //校验原密码
    const validateOldPass = (rule, value, callback) => {
      // alert(this.user.id)
      passwordApi.checkPwd(this.user.id, value).then(response => {
        //提示信息
        const resp = response.data;
        // this.$message({
        //   message: resp.message,
        //   type: resp.flag ? "success" : "warning"
        // });
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    //校验确认密码是否为一致
    const validatenewPass = (rule, value, callback) => {
      if (value != this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },

      // user 获取用户信息
      user: JSON.parse(localStorage.getItem("msm-user")),

      rules: {
        oldPass: [
          {
            required: true, //必须输入
            message: "原密码不能为空", //下方的弹出信息
            trigger: "blur" //失去焦点时
          },
          { validator: validateOldPass, trigger: "blur" }
        ],
        newPass: [
          {
            required: true, //必须输入
            message: "新密码不能为空", //下方的弹出信息
            trigger: "blur" //失去焦点时
          }
        ],
        checkPass: [
          {
            required: true, //必须输入
            message: "确认新密码不能为空", //下方的弹出信息
            trigger: "blur" //失去焦点时
          },
          { validator: validatenewPass, trigger: "change" }
        ]
      }
    };
  },

  methods: {
    //下拉框的动作选择
    handleCommand(command) {
      switch (command) {
        case "a":
          //打开修改密码窗口
          this.handlePwd();
          break;
        case "b":
          //退出系统
          this.handlelogout();
          break;
        default:
          break;
      }
    },
    //退出系统
    handlelogout() {
      logout(localStorage.getItem(localStorage.getItem("msm-token"))).then(
        response => {
          const resp = response.data;
          if (resp.flag) {
            //推出成功
            // 清除本地数据
            localStorage.removeItem("msm-token");
            localStorage.removeItem("msm-user");
            //回到登录页面
            this.$router.push("/login");
          } else {
            this.$message({
              message: resp.message,
              type: "warning",
              duration: 500 //弹出停留时间
            });
          }
        }
      );
    },

    //打开修改密码窗口
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    //提交修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.checkPass)
            .then(response => {
              //提示信息
              const resp = response.data;
              this.$message({
                message: resp.message,
                type: resp.flag ? "success" : "warning"
              });
              if (resp.flag) {
                // 修改成功, 清除本地数据, 重新登录
                this.handlelogout();
                // 关闭窗口
                this.dialogFormVisible = false;
              }
            });
        } else {
          // 验证不通过
          return false;
        }
      });
    }
  }
};
</script>




<style scoped>
.logo {
  vertical-align: middle;
  /* 上 右 下 左 */
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  color: white;
}
/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style>
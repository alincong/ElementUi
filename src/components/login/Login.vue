<template>
    <div class="login">
        <div class="login_box">
        <div class="avatar_box">
            <img src="../../assets/logo.png">
        </div>
        <!--ref:调用引用对象，:model是数据绑定, :rules表单验证规则-->
        <el-form ref="loginFromRef" :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <!--prop:loginFromRules中的那个字段名-->
            <el-form-item prop="username">
                <!--v-model：数据绑定，prefix-icon:字体图标-->
                <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <!-- type:在Element库中按钮类型 -->
                <el-button type="primary" round @click="login">登录</el-button>
                <el-button type="info" round @click="resetLoginFrom">重置</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
       return{
            // 登录表单数据绑定对象
            loginFrom:{
                username: "",
                password: ""
            },
            // 表单验证规则对象
            loginFromRules:{
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
   
            }
       }
       
    },
    methods:{
        // 点击重置按钮，重置登录表单resetFields()
        resetLoginFrom(){
            // console.log(this)
            this.$refs.loginFromRef.resetFields();
        },
        // 点击登录按钮，对form表单进行验证validate（Boolean）
        login(){
            this.$refs.loginFromRef.validate(async valid => {
                // console.log(valid)
                if(!valid) return;
                // await只能用在async修饰的方法中，用来简化异步操作返回的数据
                const res =await this.$http.post("login",this.loginFrom);
                    // console.log(res)
                    if(res.data.meta.status !==200) return this.$message.error("登录失败");
                    this.$message.success("登录成功");
                    // 1.将登录成功之后的token，保存到客户端的sessionStorage中
                        // 1.1项目中除了登录之外的其他API接口，必须在登录之后才可以访问
                        // 1.2token只能在当前网站打开期间生效，所以将token保存在sessionStorage中
                        // console.log(res)
                    window.sessionStorage.setItem("token",res.data.data.token)
                    // 2. 通过编程式导航跳转到后台主页，路由地址是/home
                    this.$router.push("/home")
            })
        }
    }
}
</script>

<style scoped>
  .login{
      width: 100%;
      height: 100%;
      background-color: #2b4b6b;
  }
  .login>.login_box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
  }
  .login>.login_box>.avatar_box{
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      top:-65px;
      transform: translate(-50%);
      background-color: #fff;
  }
  .login>.login_box>.avatar_box>img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
  }
  .btns{
      display: flex;
      justify-content: flex-end;
  }
  .login_form{
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;
  }
</style>
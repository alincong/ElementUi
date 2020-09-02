<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <!--：gutter表示间隔 ：span表示各各自占的比例-->
      <el-row :gutter="30">
        <el-col :span="12">
          <!--v-model="queryInfo.quer" 与 @click="getUserList"实现用户搜索功能
          clearable属性是可以清空输入框内容，@clear="getUserList"是清空内容后显示搜索前数据-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

       <!--添加用户对话框-->
       <!--@close="DialongClosed"当对话框关闭，会调用@close  :visible.sync 对话框的显示以隐藏-->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="DialongClosed">
      <!--如果是验证规则，以Rules结尾   如果是引用对象，以Ref结尾-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

      <!--用户列表区域-->
      <!--:border="true"添加边框  :stripe="true"hover变色  :data="userList"绑定那个数据，
      prop="username"数据中的哪个数据-->
       <el-table :data="userList" :border="true" :stripe="true">
         <!--type="index"添加索引-->
         <el-table-column type="index"></el-table-column>
         <el-table-column label="姓名" prop="username"></el-table-column>
         <el-table-column label="邮箱" prop="email"></el-table-column>
         <el-table-column label="电话" prop="mobile"></el-table-column>
         <el-table-column label="角色" prop="role_name"></el-table-column>
         <el-table-column label="状态" prop="mg_state">
           <!--slot-scope作用域插槽-->
           <template slot-scope="scope">
             <!-- {{scope.row}}可以拿到当前一行的所有数据 -->
             <!--v-model决定按钮打开或关闭， switch是开关按钮组件-->
             <el-switch v-model="scope.row.mg_state"></el-switch>
           </template>
         </el-table-column>
         <el-table-column label="操作" width="180px">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialong(scope.row.id)"></el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialong(scope.row.id)"></el-button>
             <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
           </template>
         </el-table-column>
       </el-table>

       <!--修改用户对话框-->
       <el-dialog title="修改用户" :visible.sync="editDialongVisible" width="50%" @close="editDialongClose">
         <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
           <el-form-item label="用户名">
             <el-input v-model="editForm.username" disabled></el-input>
           </el-form-item>
           <el-form-item label="邮箱" prop="email">
             <el-input v-model="editForm.email"></el-input>
           </el-form-item>
           <el-form-item label="手机号" prop="mobile">
             <el-input v-model="editForm.mobile"></el-input>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="editDialongVisible = false">取 消</el-button>
           <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
       </el-dialog>  

       <!--删除用户的对话框-->
       

       <!--分页区域-->
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
     //验证邮箱的验证规则
      let checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if(regEmail.test(value)){
          return callback()
        }
        callback(new Error("请输入合法邮箱"))
      }

      // 验证手机号的验证规则
      let checkMobile = (rule, value, callback) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if(regMobile.test(value)){
          return callback()
        }
         callback(new Error("请输入合法手机号"))
      }

    return {
      // 获取用户列表的参数对象
      queryInfo:{
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 保存用户列表数据
      userList: [],
      total: 0,
      // 添加对话框的显示与隐藏
      dialogVisible:false,
      //添加用户表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
         { required: true, message: '请输入用户名称', trigger: 'blur' },
         { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 通过validator来验证
          {validator:checkEmail,trigger: 'blur'}
        ],
        mobile: [
           { required: true, message: '请输入手机号', trigger: 'blur' },
           {validator:checkMobile,trigger: 'blur'}
        ]
      },
      //修改用户对话框显示以隐藏
      editDialongVisible: false,
      //保存用户查询数据
      editForm: {},
      //修改表单的验证规则对象
      editFormRules:{
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 通过validator来验证
          {validator:checkEmail,trigger: 'blur'}
        ],
        mobile: [
           { required: true, message: '请输入手机号', trigger: 'blur' },
           {validator:checkMobile,trigger: 'blur'}
        ]
      },
      //删除用户对话框的显示以隐藏
    }
  },
  created(){
    this.getUserList()
  }, 
  methods:{
    // 获取用户列表数据
   async getUserList(){
     const res = await this.$http.get("users",{params: this.queryInfo});
     console.log(res)
     if(res.data.meta.status !== 200) return this.$message.error("res.data.meta.msg");
     this.userList = res.data.data.users,
     this.total = res.data.data.total
    },
    //监听pagesize改变的事件
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize;
      // 重新保存pagesize值
      this.getUserList()
    },
    //监听页码值改变事件
    handleCurrentChange(newpage){
      this.queryInfo.pagenum = newpage;
      // 重新保存pagenum值
      this.getUserList()
    },
    //当对话框关闭，调用resetFields()来重置对话框
    DialongClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击确定，调用validate来对添加用户数据进行判断
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        // console.log(valid)
        if(!valid) return
        //可以发送添加用户的网络请求
        const res = await this.$http.post("users",this.addForm)
        // console.log(res)
        if(res.data.meta.status !== 201){
          this.$message.error("添加用户失败")
        }
        this.$message.success("添加用户成功")
        //隐藏对话框
        this.dialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    //展示修改用户的对话框
    async showEditDialong(id){
      this.editDialongVisible = true
      // console.log(aid)
      //解构赋值，把数据data之中的数据，赋值给res
      const {data:res} = await this.$http.get('users/' + id)
      // console .log(res)
      if(res.meta.status !== 200) return this.$message.error("查询用户信息失败")

      this.editForm = res.data
    },
    //监听用户修改数据关闭重置表单
    editDialongClose(){
      this.$refs.editFormRef.resetFields()
    },
    //修改用户数信息并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid =>{
        console.log(valid)
        if(!valid) return
        //可以发送添加用户的网络请求
        const res = await this.$http.put("users/" + this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
          })
        // console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error("更新用户信息失败")
        //隐藏对话框
        this.editDialongVisible = false
        // 重新获取用户列表数据
        this.getUserList()
        this.$message.success("更新用户信息成功")
      })
    },
    //删除用户信息
    async deleteDialong(id){
      // console.log(id)
      const num = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户点击确定，返回confirm
      //如果用户点击取消，返回cancel
      // console.log(num)
      if(num != "confirm") return this.$message.info("已经取消删除")
      
      const {data : res} = await this.$http.delete("users/" + id)
      if(res.meta.status !== 200) return this.$message.error("删除用户失败")
      return this.$message.success("删除用户成功")
      this.getUserList()
    }
  }
}
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
  }
  .el-card{
    /*因Elementui组件样式比较高，想覆盖它的默认样式，需加!important*/
    box-shadow: 0 0 0 rgb(0, 1px, 1px,0.15) !important;
  }
  .el-table{
    margin-top: 20px;
    font-style: 14px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>
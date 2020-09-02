<template>
  <el-container class="home-container">
    <el-header>
      <!--主页顶部-->
      <div>
          <img src="../../assets/heima.png">
          <h2>电商后台管理系统</h2>
      </div>
       <!--实现用户退出登录功能-->
       <el-button class="logout" type="info" @click="logout">退 出</el-button>
    </el-header>
    <el-container>
      <!--主页侧边栏-->
      <!--通过侧边栏展开或折叠来决定侧边栏宽度-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!--折叠展开按钮-->
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!--侧边栏菜单区域-->
        <!--active-text-color:活跃状态下的颜色  :unique-opened：是否点击展开一个组件，另一个组件关闭，默认是false
        :collapse="true"是否对菜单折叠与展开，默认是false :collapse-transition是折叠动画
        :router="true"是否开始二级菜单路由模式-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" 
        :unique-opened="true" :collapse="iscollapse" :collapse-transition="false" :router="true">
          <!--一级菜单-->
          <!--:index="item.id + ''"默认值相同，点一个全部展开，给index设定唯一值，只接受字符串-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!--一级模板-->
            <template slot="title">
              <!--动态获取字体图标-->
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <!--模板中的index只接受字符串，不接受数值，所以需要转换，index作为二级菜单路由跳转路径-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <!--二级模板-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主页内容主体-->
      <el-main>
        <!--Welcome组件-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      //左侧菜单数据
      menulist: [],
      //一级菜单字体图标
      iconsObj:{
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao",
      },
      //是否对菜单折叠与展开
      iscollapse:false,
    }
  },
  created(){
    this.getMenulist()
  },
  methods:{
    logout(){
        // 清空那个token
        window.sessionStorage.clear();
        // 跳转到登录页面
        this.$router.push("/login")
    },
    //获取主页侧边栏数据
    async getMenulist(){
      const res = await this.$http.get("menus");
      console.log(res);
      if(res.data.meta.status !== 200) return this.$message.error("res.data.meta.msg");
      this.menulist = res.data.data
    },
    //侧边栏折叠与展开
    toggleClick(){
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>

<style scoped>
  .home-container{
      height: 100%;
  }
  .el-header{
     background-color: #373d41;
     display: flex;
     justify-content: space-between;
     padding-left: 0;
     color: #fff;
     align-items: center;
  }
  .el-header>div{
      display: flex;
      line-height: 100%;
  }
  .el-header>div>h2{
      margin-left: 15px;
  }
  .el-aside{
      background-color: #333744;
  }
  .el-aside>.el-menu{
    border-right: 0;
  }
  el-main{
      background-color: #EAEDF1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-style: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    /* 之间的间隔 */
    letter-spacing: 0.2em;
    /* 变成小手 */
    cursor: pointer;
  }
</style>
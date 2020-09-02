<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图区域-->
    <el-card>
      <!--警告区域-->
      <!--show-icon警告图标  closable关闭按钮-->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!--选择商品分类区域-->
      <el-row class="col">
        <el-col>
          <span>选择商品分类：</span>
          <!--级联选择器区域-->
           <!--:options指定数据源  v-model只能绑定数组  clearable是否清除  change-on-select可以选中一级父级-->
          <el-cascader expand-trigger= 'hover' v-model="selectedCateKeys" :options="cateList" 
          :props="cateProps" @change="handleChange" clearable></el-cascader> 
        </el-col>
      </el-row>

      <!-- tab区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return{
      //保存商品分类列表
      cateList: [],
      //级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //计量选择框双向绑定的数组
      selectedCateKeys: [],
      //被激活标签的名称
      activeName: 'many'
    }
  },
  created(){
    this.getCateList()
  },
  methods: {
    //获取商品列表数据
    async getCateList() {
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error("获取商品列表数据失败");
      this.cateList = res.data
      // console.log(this.cateList)
    },
    //级联选择框选中项变化，会触发这个函数
    async handleChange() {
      // console.log(this.selectedCateKeys)
      //判断用户选中几级分类
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        return
      }

      //选中三级分类
      console.log(this.selectedCateKeys)
      //根据所选的分类ID，和当前所处的面板，获取对应的参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel: this.activeName}})
      if(res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      console.log(res.data)
    },
    // tab点击事件的处理函数
    handleClick() {
      // console.log(this.activeName)
    }
  },
  computed: {
    //判断按钮是否需要禁用，禁用返回true，否则返回false
    isBtnDisabled(){
      if(this.selectedCateKeys.length !== 3){
        return true
      }
      return false
    },
    //当前选中三级分类的Id
    cateId(){
      if(this.selectedCateKeys.length === 3){
        //索引为2
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
  }
  .col{
    margin: 15px 0;
  }
</style>
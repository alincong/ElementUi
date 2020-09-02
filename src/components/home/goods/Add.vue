<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--警告区域-->
      <!-- :closable="false" 关闭关闭按钮-->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!--步骤条区域-->
      <!--active 活跃索引 activeIndex-0转为数字类型-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="参数列表">
          <!--渲染表单item项-->
          <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
             <!--复选框-->
             <el-checkbox-group v-model="item.attr_vals">
               <el-checkbox label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
             </el-checkbox-group>
          </el-form-item>
        </el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--tabs栏区域-->
      <!--label-position="top"可以指定文字在上，输入框在下-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
         <!--v-model实现与步骤条的联动效果 :tab-position位置  :before-leave阻止切换-->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave='beforeTabLeave'  
        @tab-click="tabsClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader  expand-trigger= "hover" v-model="addForm.goods_cat" :options="cateList" 
                :props="cateProps" @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //绑定步骤条以及tab的index
      activeIndex: "0",
      //添加商品表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: []
      },
      //form表单的验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      //商品分类列表
      cateList: [],
      //级联选择框
      cateProps: {
        //看到的是哪个属性
        label: 'cat_name',
        //选中谁的值
        value: 'cat_id',
        //父子嵌套关系 
        children: 'children'
      },
      //商品参数数据
      manyTableData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const {data:res} = await this.$http.get(`categories`)
      if(res.meta.status !== 200) return this.$message.error("请输入商品分类数据");
      this.cateList = res.data
      // console.log(this.cateList)
      
    },
    //级联选择器选中项发生变化，会触发这个函数
    handleChange() {
      // console.log(this.addForm.goods_cat)
    },
    //判断tabs是否可以进行切换  activeName进入新的tabs页,oldActiveName；离开tabs页
    beforeTabLeave(activeName,oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请选择分类')
        return false
      }
    },
    //tabs每个item激活会触发的函数
    tabsClick() {
      // console.log(this.activeIndex)
      //判断是不是点击了商品参数的item
      if(this.activeIndex === '1') {
        const {data: res} = this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
        {params: {sel:'many'}})
      }
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品参数失败')
      }
      console.log(res)
      //把字符串转为数组
      res.data.forEach(item => {
        item.attr_vals =  item.attr_vals.length ===0 ? [] : item.attr_vals.split(' ')
      })
      this.manyTableData = res.data
    }
  }
}
</script>

<style scoped>
  
</style>
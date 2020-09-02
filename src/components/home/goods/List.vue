<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--:gutter="20"边距-->
      <el-row :gutter="20">
        <!--搜索框区域-->
        <el-col :span="8">
          <!--v-model="queryInfo.query" clearable @clear="getList"结合el-button 
          @click="getList"可以实现搜索功能-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getList">
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>

        <!--添加商品区域-->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="95"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10,15,20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //请求商品列表数据参数
      queryInfo:{
        query: "",
        //默认展示第一页
         pagenum: 1,
        // 每一页十条数据
         pagesize:10
      },
      //商品列表数据
      goodsList: [],
      //商品列表总共多少条数据
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取商品列表数据
    async getList() {
      const {data:res} = await this.$http.get('goods',{params: this.queryInfo})
      if(res.meta.status !== 200){
        return this.$message.error('获取参数列表失败')
      } 
      // console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //一页多少条数据
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      thsi.getList()
    },
    //第几页
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    //跳转到添加商品组件
    goAddPage() {
      this.$router.push(`/goods/add`)
    }
  }
}
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
  }
  .el-table{
    margin-top: 20px;
  }
  .el-pagination{
    margin-top: 20px;
  }
</style>
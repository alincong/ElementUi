<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据-->
      <el-table :data='orderlist' border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="300px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="140px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px">
          <template slot-scope="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
    </el-card>
  </div>

</template>

<script>
export default {
  data() {
    return {
      //获取订单数据的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //订单数据
      orderlist: [],
      //总数据条数
      total: 0
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单数据
    async getOrderList() {
      const {data:res} = await this.$http.get('orders', {params: this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error('获取订单数据');
      console.log(res)
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    }
  }
}
</script>
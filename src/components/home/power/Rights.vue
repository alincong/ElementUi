<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限管理" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!--因为要改变权限等级要渲染怎样，所以通过作用域插槽-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //权限列表数据
      rightsList: []
    }
  },
  created() {
      //获取权限列表数据
      this.getRightList()
    },
  methods: {
    async getRightList() {
      const {data : res} = await this.$http.get("rights/list")
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error("获取权限列表失败");
      this.rightsList = res.data
      // console.log(this.rightList)
    }
  }
}
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
  }
</style>
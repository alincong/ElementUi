<template>
  <div>
    <!--顶部导航栏-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色列表区域-->
      <el-table :data = "rolesList" border stripe>
        <!--expand：展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--:class="['bbottom',i === 0 ? 'btop' : '' 动态添加边框-->
            <el-row :class="['bbottom',i === 0 ? 'btop' : '','vcenter']" v-for="(item,i) in scope.row.children" :key="item.id">
              <!--el-col :span="5" 删格布局，占5份-->
              <!--渲染一级权限-->
              <el-col :span="5">
                <!-- <pre>{{scope.row}}</pre> -->
                <el-tag>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二三级权限-->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'btop','vcenter']" v-for="(item2,i2) in item.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col  :span="18">
                    <!--closable 是关闭按钮-->
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="deleteRolesId(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--index：索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolse(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限对话框-->
      <el-dialog title="分配权限" :visible.sync="showRolseVisible" width="50%" @close="rodesClose">
        <!--树形控件-->
        <!--show-checkbox 显示选框 node-key获取选中状态的id  default-expand-all是否展开所以节点
        :default-checked-keys：默认勾选的节点的 key 的数组-->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" 
        default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRolseVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //角色列表数据
      rolesList: [],
      //分配权限对话框的显示与隐藏 
      showRolseVisible: false,
      //保存分配权限数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的节点id数组
      defKeys: [],
      //分配权限角色的ID
      rolseId: 0
    }
  },
  //获取角色列表数据
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data : res} = await this.$http.get("roles")
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error("请求角色列表失败")
      this.rolesList =res.data
      // console.log(this.rolesList)
    },
    //根据ID删除权限
    async deleteRolesId(roles,rightId){
      const id = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(id !== "confirm") return this.$message.info("取消了删除")
        const {data: res} = await this.$http.delete('roles/+roles.id/rights/+rightId')
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error("删除权限失败")
        this.getRolesList()
    },
    //获取权限数据
    async showRolse(rolse){
      this.rolseId = rolse.id
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error("获取权限数据失败")
      console.log(res)
      this.rightsList = res.data
      // console.log(this.rightsList)
      //递归获取三级节点
      this.getLeafKeys(rolse,this.defKeys)
      this.showRolseVisible = true
    },
    //通过递归函数，获取三级权限ID，并保存到defKeys数组中 node：节点,arr：数组
    getLeafKeys(node,arr) {
      //判断是不是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //如不是三级节点
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    //重置数组
    rodesClose() {
      this.defKeys = []
    },
    //点击确定给角色分配权限
    // getCheckedKeys()若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
    //getHalfCheckedKeys()若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.rolseId}/rights`,{rids:idStr})
      // console.log(res)
      if(res.meta.status !==200) return this.$message.error("分配权限失败")
      this.$message.success("分配权限成功")
      this.getRolesList()
      this. showRolseVisible = false
    }
  } 
  
}
</script>

<style scoped>
  .btop{
    border-top: 1px solid #eee;
  }
  .bbottom{
    border-bottom: 1px solid #eee;
  }
  .el-tag{
    margin: 9px;
  }
  .el-col>i{
    margin-left: 3px;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
  .el-card{
    margin-top: 20px;
  }
  .el-table{
    margin-top: 15px;
  }
</style>
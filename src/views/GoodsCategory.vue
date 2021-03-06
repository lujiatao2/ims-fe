<template>
  <el-container>
    <el-header id="nav">
      <ims-nav :user="common.user"></ims-nav>
    </el-header>
    <el-container>
      <el-aside id="menu">
        <ims-menu default-active="2"></ims-menu>
      </el-aside>
      <el-main>
        <div>
          <el-form id="search-form" :model="searchForm" size="mini" :inline="true">
            <el-form-item label="名称">
              <el-input v-model="searchForm.name" placeholder="请输入名称..." clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查 询</el-button>
            </el-form-item>
          </el-form>
          <el-button id="add-button" type="primary" @click="addItem" size="mini">新 增</el-button>
        </div>
        <el-table :data="tableData" stripe size="mini">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="text" @click="modifyItem(scope)" size="small">编辑</el-button>
              <el-button type="text" @click="deleteItem(scope)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination id="pagination" layout="prev, pager, next" :page-count="pageCount" @current-change="changePage"
                       :hide-on-single-page="true" background small></el-pagination>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog :title="addOrModifyTitle" :model-value="addOrModifyVisible" @close="cancelAddOrModify" width="30%">
    <el-form label-width="30%" :model="addOrModifyForm" size="small">
      <el-form-item label="名称">
        <el-input v-model="addOrModifyForm.name" placeholder="请输入名称..." clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelAddOrModify">取 消</el-button>
      <el-button type="primary" @click="addOrModify">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Nav from '@/components/Nav'
import Menu from '@/components/Menu'
import {getLoginedUser} from "@/assets/js/ims"

export default {
  name: 'GoodsCategory',
  data() {
    return {
      common: {
        user: ''
      },
      searchForm: {
        name: ''
      },
      addOrModifyForm: {
        name: '',
        id: 0
      },
      addOrModifyTitle: '',
      addOrModifyVisible: false,
      tableData: [],
      pageCount: 0
    }
  },
  components: {
    imsNav: Nav,
    imsMenu: Menu
  },
  methods: {
    getLoginedUser() {
      getLoginedUser(this.common)
    },
    search() {
      const data = {
        name: this.searchForm.name
      }
      this.$http.get('/goods-category/search', {params: data})
          .then(response => {
            if (response['code'] === 0) {
              this.tableData = response['data'][2]
              this.pageCount = response['data'][1]
            } else {
              this.$message({
                type: 'error',
                message: '查询失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '查询失败：' + error
            })
          })
    },
    addItem() {
      this.addOrModifyTitle = '新增'
      this.addOrModifyVisible = true
    },
    cancelAddOrModify() {
      this.addOrModifyForm.name = ''
      this.addOrModifyForm.id = 0
      this.addOrModifyTitle = ''
      this.addOrModifyVisible = false
    },
    addOrModify() {
      const data = {
        name: this.addOrModifyForm.name,
        id: this.addOrModifyForm.id
      }
      this.$http.request({
        method: this.addOrModifyTitle === '新增' ? 'POST' : 'PUT',
        url: '/goods-category',
        data: data
      })
          .then(response => {
            if (response['code'] === 0) {
              this.cancelAddOrModify()
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: this.addOrModifyTitle + '失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: this.addOrModifyTitle + '失败：' + error
            })
          })
    },
    getTableData() {
      this.$http.get('/goods-category/all')
          .then(response => {
            if (response['code'] === 0) {
              this.tableData = response['data'][2]
              this.pageCount = response['data'][1]
            } else {
              this.$message({
                type: 'error',
                message: '获取列表数据失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取列表数据失败：' + error
            })
          })
    },
    modifyItem(scope) {
      this.addOrModifyTitle = '编辑'
      this.addOrModifyVisible = true
      this.addOrModifyForm.name = scope.row.name
      this.addOrModifyForm.id = scope.row.id
    },
    deleteItem(scope) {
      this.$confirm('确认删除？', '删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: scope.row.id
        }
        this.$http.delete('/goods-category', {params: data})
            .then(response => {
              if (response['code'] === 0) {
                this.getTableData()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败：' + response['msg']
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '删除失败：' + error
              })
            })
      })
    },
    changePage(targetPage) {
      const data = {
        name: this.searchForm.name,
        targetPage: targetPage
      }
      this.$http.get('/goods-category/page', {params: data})
          .then(response => {
            if (response['code'] === 0) {
              this.tableData = response['data'][2]
              this.pageCount = response['data'][1]
            } else {
              this.$message({
                type: 'error',
                message: '获取列表数据失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取列表数据失败：' + error
            })
          })
    }
  },
  created() {
    this.getLoginedUser()
    this.getTableData()
  }
}
</script>
<template>
  <el-container>
    <el-header id="nav">
      <ims-nav :user="common.user"></ims-nav>
    </el-header>
    <el-container>
      <el-aside id="menu">
        <ims-menu default-active="3-1"></ims-menu>
      </el-aside>
      <el-main>
        <div>
          <el-form id="search-form" :model="searchForm" size="mini" :inline="true">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名..." clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查 询</el-button>
            </el-form-item>
          </el-form>
          <el-button id="add-button" type="primary" @click="addItem" size="mini">新 增</el-button>
        </div>
        <el-table :data="tableData" stripe size="mini">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="role" label="角色"></el-table-column>
          <el-table-column prop="isActive" label="状态" align="center"></el-table-column>
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
      <el-form-item label="用户名">
        <el-input v-model="addOrModifyForm.username" placeholder="请输入用户名..."
                  :disabled="addOrModifyForm.usernameDisabled" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="addOrModifyForm.password" placeholder="请输入密码..." show-password clearable></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="addOrModifyForm.role" @change="setRoleCode" @clear="clearRoleCode" placeholder="请选择角色..."
                   clearable>
          <el-option v-for="(role, index) in addOrModifyForm.roles" :key="index" :label="role.roleName"
                     :value="role.roleCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addOrModifyForm.isActive">
          <el-radio :disabled="addOrModifyForm.statusDisabled" label="启用"></el-radio>
          <el-radio :disabled="addOrModifyForm.statusDisabled" label="禁用"></el-radio>
        </el-radio-group>
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
import {getLoginedUser} from '@/assets/js/ims'

export default {
  name: 'User',
  data() {
    return {
      common: {
        user: ''
      },
      searchForm: {
        username: ''
      },
      addOrModifyForm: {
        username: '',
        password: '',
        role: '',
        roles: [
          {'roleName': '普通用户', 'roleCode': 'ROLE_USER'},
          {'roleName': '管理员', 'roleCode': 'ROLE_ADMIN'},
        ],
        isActive: '启用',
        id: 0,
        usernameDisabled: false,
        statusDisabled: true
      },
      roleCode: '',
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
    setRoleCode(value) {
      this.roleCode = value
    },
    clearRoleCode() {
      this.roleCode = ''
    },
    search() {
      const data = {
        username: this.searchForm.username
      }
      this.$http.get('/user/search', {params: data})
          .then(response => {
            if (response['code'] === 0) {
              this.tableData = response['data'][2].filter(function (item) {
                item.isActive = item.isActive ? '启用' : '禁用'
                switch (item.role) {
                  case 'ROLE_USER':
                    item.role = '普通用户'
                    break
                  case 'ROLE_ADMIN':
                    item.role = '管理员'
                }
                return item
              })
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
      this.addOrModifyForm.username = ''
      this.addOrModifyForm.password = ''
      this.addOrModifyForm.role = ''
      this.addOrModifyForm.isActive = '启用'
      this.addOrModifyForm.usernameDisabled = false
      this.addOrModifyForm.statusDisabled = true
      this.addOrModifyForm.id = 0
      this.roleCode = ''
      this.addOrModifyTitle = ''
      this.addOrModifyVisible = false
    },
    addOrModify() {
      const data = {
        username: this.addOrModifyForm.username,
        password: this.addOrModifyForm.password,
        role: this.addOrModifyForm.role,
        isActive: this.addOrModifyForm.isActive === '启用',
        id: this.addOrModifyForm.id
      }
      this.$http.request({
        method: this.addOrModifyTitle === '新增' ? 'POST' : 'PUT',
        url: '/user',
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
      this.$http.get('/user/all')
          .then(response => {
            if (response['code'] === 0) {
              this.tableData = response['data'][2].filter(function (item) {
                item.isActive = item.isActive ? '启用' : '禁用'
                switch (item.role) {
                  case 'ROLE_USER':
                    item.role = '普通用户'
                    break
                  case 'ROLE_ADMIN':
                    item.role = '管理员'
                }
                return item
              });
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
      this.addOrModifyForm.username = scope.row.username
      this.addOrModifyForm.password = scope.row.password
      switch (scope.row.role) {
        case '普通用户':
          this.addOrModifyForm.role = 'ROLE_USER'
          break
        case '管理员':
          this.addOrModifyForm.role = 'ROLE_ADMIN'
      }
      this.addOrModifyForm.isActive = scope.row.isActive
      this.addOrModifyForm.id = scope.row.id
      this.addOrModifyForm.usernameDisabled = true
      this.addOrModifyForm.statusDisabled = false
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
        this.$http.delete('/user', {params: data})
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
        username: this.searchForm.username,
        targetPage: targetPage
      }
      this.$http.get('/user/page', {params: data})
          .then(response => {
            if (response['code'] === 0) {
              this.tableData = response['data'][2].filter(function (item) {
                item.isActive = item.isActive ? '启用' : '禁用'
                switch (item.role) {
                  case 'ROLE_USER':
                    item.role = '普通用户'
                    break
                  case 'ROLE_ADMIN':
                    item.role = '管理员'
                }
                return item
              });
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
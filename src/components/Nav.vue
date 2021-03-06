<template>
  <div>
    <span>库存管理系统</span>
  </div>
  <div>
    <span v-if="user">{{ user }}&nbsp;</span>
    <span v-else>游客 </span>
    <el-dropdown trigger="click" @command="handleCommand">
      <i class="el-dropdown-link el-icon-setting"></i>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="user" command="logout">注销</el-dropdown-item>
          <el-dropdown-item v-else command="login">登录</el-dropdown-item>
          <el-dropdown-item command="about">关于</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  props: ['user'],
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.$http.get('/logout')
              .then(response => {
                if (response['code'] === 0) {
                  this.$router.push('/login')
                } else {
                  this.$message({
                    type: 'error',
                    message: '注销失败：' + response['msg']
                  })
                }
              })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: '注销失败：' + error
                })
              })
          break
        case 'login':
          this.$router.push('/login')
          break
        case 'about':
          this.$alert('<div style="text-align: center"><p>库存管理系统</p><p>Inventory Management System</p><p>版本: 1.0.0</p></div>', '关于', {
            confirmButtonText: '确 定',
            dangerouslyUseHTMLString: true
          }).catch()
      }
    }
  }
}
</script>
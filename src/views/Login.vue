<template>
  <el-form id="login-form">
    <h1>库存管理系统</h1>
    <el-form-item>
      <el-input v-model="username" placeholder="请输入用户名..." clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="password" placeholder="请输入密码..." show-password clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login" :loading="isLoading">登 录
        <el-tooltip placement="right">
          <template #content>
            默认用户名/密码：admin/admin123456
          </template>
          <i class="el-icon-question"/>
        </el-tooltip>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      backgroundImg: require('../assets/img/background.png'),
      username: '',
      password: '',
      isLoading: false
    }
  },
  methods: {
    login() {
      this.isLoading = true;
      const data = new FormData()
      data.append('username', this.username)
      data.append('password', this.password)
      this.$http.post('/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
          .then(response => {
            if (response['code'] === 0) {
              this.$router.push('/')
            } else {
              this.$message({
                type: 'error',
                message: '登录失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '登录失败：' + error
            })
          })
          .finally(() => {
            this.isLoading = false
          })
    }
  },
  created() {
    document.body.style.backgroundImage = 'url(' + this.backgroundImg + ')'
    document.body.style.backgroundSize = '100%'
  },
  unmounted() {
    document.body.style.backgroundImage = ''
  }
}
</script>
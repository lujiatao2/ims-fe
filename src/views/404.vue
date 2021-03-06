<template>
  <el-container>
    <el-header id="nav">
      <ims-nav :user="common.user"></ims-nav>
    </el-header>
    <el-container>
      <el-aside id="menu">
        <ims-menu></ims-menu>
      </el-aside>
      <el-main>
        <el-empty description="404未知页面"></el-empty>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Nav from '@/components/Nav'
import Menu from '@/components/Menu'
import {getLoginedUser} from "@/assets/js/ims"

export default {
  name: '404',
  data() {
    return {
      common: {
        user: ''
      }
    }
  },
  components: {
    imsNav: Nav,
    imsMenu: Menu
  },
  methods: {
    getLoginedUser() {
      getLoginedUser(this.common)
    }
  },
  created() {
    this.getLoginedUser()
  }
}
</script>
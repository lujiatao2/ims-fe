<template>
  <el-menu :default-active="defaultActive" @select="handleSelect">
    <el-menu-item index="1">
      <i class="el-icon-document"></i>
      <template #title>物品管理</template>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-document"></i>
      <template #title>物品类别管理</template>
    </el-menu-item>
    <el-submenu index="3">
      <template #title>
        <i class="el-icon-menu"></i>
        <span>更多</span>
      </template>
      <el-menu-item index="3-1">用户管理</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  props: ['defaultActive'],
  methods: {
    handleSelect(key) {
      switch (key) {
        case '1':
          this.$router.push('/goods')
          break
        case '2':
          this.$router.push('/goods-category')
          break
        case '3-1':
          this.$router.push('/user')
      }
    }
  }
}
</script>
<template>
  <el-container>
    <el-header id="nav">
      <ims-nav :user="common.user"></ims-nav>
    </el-header>
    <el-container>
      <el-aside id="menu">
        <ims-menu default-active="1"></ims-menu>
      </el-aside>
      <el-main>
        <div>
          <el-form id="search-form" :model="searchForm" size="mini" :inline="true">
            <el-form-item label="分类">
              <el-select v-model="searchForm.goodsCategory" @change="setGoodsCategoryId" @clear="clearGoodsCategoryId"
                         placeholder="请选择分类..." clearable>
                <el-option v-for="(goodsCategory, index) in searchForm.goodsCategories" :key="index"
                           :label="goodsCategory.name" :value="goodsCategory.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-input v-model="searchForm.brand" placeholder="请输入品牌..." clearable></el-input>
            </el-form-item>
            <el-form-item label="型号">
              <el-input v-model="searchForm.model" placeholder="请输入型号..." clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查 询</el-button>
            </el-form-item>
          </el-form>
          <el-button id="add-button" type="primary" @click="addItem" size="mini">新 增</el-button>
        </div>
        <el-table :data="tableData" stripe size="mini">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="brand" label="品牌"></el-table-column>
          <el-table-column prop="model" label="型号"></el-table-column>
          <el-table-column prop="desc" label="描述" width="200"></el-table-column>
          <el-table-column prop="count" label="数量" width="100"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template #default="scope">
              <el-button type="text" @click="modifyItem(scope)" size="small">编辑</el-button>
              <el-button type="text" @click="deleteItem(scope)" size="small">删除</el-button>
              <el-button type="text" @click="outStock(scope)" size="small">出库</el-button>
              <el-button type="text" @click="inStock(scope)" size="small">入库</el-button>
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
      <el-form-item label="分类">
        <el-select v-model="addOrModifyForm.goodsCategory" @change="setGoodsCategoryId" @clear="clearGoodsCategoryId"
                   placeholder="请选择分类..." clearable>
          <el-option v-for="(goodsCategory, index) in addOrModifyForm.goodsCategories" :key="index"
                     :label="goodsCategory.name" :value="goodsCategory.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="addOrModifyForm.brand" placeholder="请输入品牌..." clearable></el-input>
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="addOrModifyForm.model" placeholder="请输入型号..." clearable></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="addOrModifyForm.desc" placeholder="请输入描述..."></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelAddOrModify">取 消</el-button>
      <el-button type="primary" @click="addOrModify">确 定</el-button>
    </template>
  </el-dialog>
  <el-dialog :title="outOrInStockTitle" :model-value="outOrInStockVisible" @close="cancelOutOrInStock" width="30%">
    <el-form label-width="30%" :model="outOrInStockForm" size="small">
      <el-form-item label="数量">
        <el-input-number v-model="outOrInStockForm.count" :min="1" :precision="0"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelOutOrInStock">取 消</el-button>
      <el-button type="primary" @click="outOrInStock">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Nav from '@/components/Nav'
import Menu from '@/components/Menu'
import {getLoginedUser} from "@/assets/js/ims"

export default {
  name: 'Goods',
  data() {
    return {
      common: {
        user: ''
      },
      searchForm: {
        goodsCategory: '',
        goodsCategories: [],
        brand: '',
        model: ''
      },
      goodsCategoryId: 0,
      addOrModifyForm: {
        goodsCategory: '',
        goodsCategories: [],
        brand: '',
        model: '',
        desc: '',
        id: 0
      },
      addOrModifyTitle: '',
      addOrModifyVisible: false,
      outOrInStockForm: {
        count: 1,
        id: 0
      },
      outOrInStockTitle: '',
      outOrInStockVisible: false,
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
    getGoodsCategories() {
      this.$http.get('/goods-category')
          .then(response => {
            if (response['code'] === 0) {
              const tmps = response['data'].reverse()
              this.searchForm.goodsCategories = tmps
              this.addOrModifyForm.goodsCategories = tmps
            } else {
              this.$message({
                type: 'error',
                message: '获取物品分类失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '获取物品分类失败：' + error
            })
          })
    },
    setGoodsCategoryId(value) {
      this.goodsCategoryId = value
    },
    clearGoodsCategoryId() {
      this.goodsCategoryId = 0
    },
    search() {
      const data = {
        goodsCategoryId: this.goodsCategoryId,
        brand: this.searchForm.brand,
        model: this.searchForm.model
      }
      this.$http.get('/goods/search', {params: data})
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
      this.addOrModifyForm.goodsCategories = this.getGoodsCategories()
      this.addOrModifyTitle = '新增'
      this.addOrModifyVisible = true
    },
    cancelAddOrModify() {
      this.addOrModifyForm.goodsCategory = ''
      this.addOrModifyForm.goodsCategories = []
      this.addOrModifyForm.brand = ''
      this.addOrModifyForm.model = ''
      this.addOrModifyForm.desc = ''
      this.addOrModifyForm.id = 0
      this.goodsCategoryId = 0
      this.addOrModifyTitle = ''
      this.addOrModifyVisible = false
    },
    addOrModify() {
      const data = {
        goodsCategoryId: this.goodsCategoryId,
        brand: this.addOrModifyForm.brand,
        model: this.addOrModifyForm.model,
        desc: this.addOrModifyForm.desc,
        id: this.addOrModifyForm.id
      }
      this.$http.request({
        method: this.addOrModifyTitle === '新增' ? 'POST' : 'PUT',
        url: '/goods',
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
      this.$http.get('/goods/all')
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
      this.addOrModifyForm.goodsCategories = this.getGoodsCategories()
      this.addOrModifyTitle = '编辑'
      this.addOrModifyVisible = true
      this.addOrModifyForm.goodsCategory = scope.row.goodsCategoryId
      this.addOrModifyForm.brand = scope.row.brand
      this.addOrModifyForm.model = scope.row.model
      this.addOrModifyForm.desc = scope.row.desc
      this.addOrModifyForm.id = scope.row.id
      this.goodsCategoryId = scope.row.goodsCategoryId
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
        this.$http.delete('/goods', {params: data})
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
    outStock(scope) {
      this.outOrInStockTitle = '出库'
      this.outOrInStockVisible = true
      this.outOrInStockForm.id = scope.row.id
    },
    inStock(scope) {
      this.outOrInStockTitle = '入库'
      this.outOrInStockVisible = true
      this.outOrInStockForm.id = scope.row.id
    },
    cancelOutOrInStock() {
      this.outOrInStockTitle = ''
      this.outOrInStockVisible = false
      this.outOrInStockForm.count = 1
      this.outOrInStockForm.id = 0
    },
    outOrInStock() {
      const data = {
        count: this.outOrInStockTitle === '入库' ? this.outOrInStockForm.count : -this.outOrInStockForm.count,
        id: this.outOrInStockForm.id
      }
      this.$http.put('/goods', data)
          .then(response => {
            if (response['code'] === 0) {
              this.cancelOutOrInStock()
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: this.outOrInStockTitle + '失败：' + response['msg']
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: this.outOrInStockTitle + '失败：' + error
            })
          })
    },
    changePage(targetPage) {
      const data = {
        goodsCategoryId: this.goodsCategoryId,
        brand: this.searchForm.brand,
        model: this.searchForm.model,
        targetPage: targetPage
      }
      this.$http.get('/goods/page', {params: data})
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
    this.getGoodsCategories()
    this.getTableData()
  }
}
</script>
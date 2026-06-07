<template>
  <div class="config-page">
    <el-card>
      <template #header>
        <span>系统配置</span>
      </template>

      <el-tabs v-model="activeTab" class="config-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="basicConfig" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicConfig.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload action="#" :auto-upload="false" :show-file-list="false">
                <el-button>上传Logo</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="basicConfig.copyright" placeholder="请输入版权信息" />
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input v-model="basicConfig.description" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="微信配置" name="wechat">
          <el-form :model="wechatConfig" label-width="120px">
            <el-form-item label="AppID">
              <el-input v-model="wechatConfig.appId" placeholder="请输入AppID" />
            </el-form-item>
            <el-form-item label="AppSecret">
              <el-input v-model="wechatConfig.appSecret" type="password" placeholder="请输入AppSecret" />
            </el-form-item>
            <el-form-item label="商户号">
              <el-input v-model="wechatConfig.mchId" placeholder="请输入商户号" />
            </el-form-item>
            <el-form-item label="商户密钥">
              <el-input v-model="wechatConfig.mchKey" type="password" placeholder="请输入商户密钥" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="短信配置" name="sms">
          <el-form :model="smsConfig" label-width="120px">
            <el-form-item label="短信平台">
              <el-select v-model="smsConfig.platform" placeholder="请选择短信平台">
                <el-option label="阿里云" value="aliyun" />
                <el-option label="腾讯云" value="qcloud" />
              </el-select>
            </el-form-item>
            <el-form-item label="AccessKey">
              <el-input v-model="smsConfig.accessKey" placeholder="请输入AccessKey" />
            </el-form-item>
            <el-form-item label="AccessSecret">
              <el-input v-model="smsConfig.accessSecret" type="password" placeholder="请输入AccessSecret" />
            </el-form-item>
            <el-form-item label="签名">
              <el-input v-model="smsConfig.sign" placeholder="请输入短信签名" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="配送配置" name="delivery">
          <el-form :model="deliveryConfig" label-width="120px">
            <el-form-item label="是否启用配送">
              <el-switch v-model="deliveryConfig.enabled" />
            </el-form-item>
            <el-form-item label="配送方式">
              <el-checkbox-group v-model="deliveryConfig.methods">
                <el-checkbox label="快递">快递</el-checkbox>
                <el-checkbox label="同城配送">同城配送</el-checkbox>
                <el-checkbox label="自提">自提</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="配送费用">
              <el-input-number v-model="deliveryConfig.fee" :min="0" :precision="2" />
              <span style="margin-left: 10px">元</span>
            </el-form-item>
            <el-form-item label="满额免配送">
              <el-input-number v-model="deliveryConfig.freeThreshold" :min="0" :precision="2" />
              <span style="margin-left: 10px">元（0表示不免费）</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="form-footer">
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicConfig = reactive({
  systemName: '毕生优养健康管理商城',
  logo: '',
  copyright: '© 2024 毕生优养',
  description: '专注养生健康类产品'
})

const wechatConfig = reactive({
  appId: '',
  appSecret: '',
  mchId: '',
  mchKey: ''
})

const smsConfig = reactive({
  platform: 'aliyun',
  accessKey: '',
  accessSecret: '',
  sign: '毕生优养'
})

const deliveryConfig = reactive({
  enabled: true,
  methods: ['快递', '同城配送'],
  fee: 10,
  freeThreshold: 99
})

const handleSave = () => {
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.config-page {
  padding: 20px;
}

.config-tabs {
  margin-bottom: 20px;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}
</style>

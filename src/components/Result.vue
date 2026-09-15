<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    default: "empty", // 'empty' | 'confirm' | 'loading' | 'result'
  },
  confirmData: {
    type: Object,
    default: () => null,
  },
  resultData: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(["confirm", "reset"]);

const isEditing = ref(false);
const editTime = ref("");
const editSpace = ref("");

const startEdit = () => {
  if (props.confirmData) {
    editTime.value = props.confirmData.time || "";
    editSpace.value = props.confirmData.space || "";
    isEditing.value = true;
  }
};

const saveEdit = () => {
  isEditing.value = false;
};

const handleConfirm = () => {
  emit("confirm", {
    ...props.confirmData,
    time: editTime.value || props.confirmData?.time,
    space: editSpace.value || props.confirmData?.space,
  });
};

const formattedArea = computed(() => {
  const val = props.resultData?.area?.value;
  if (typeof val !== "number") return "0";
  return Number(val.toFixed(2)).toLocaleString();
});
</script>

<template>
  <div class="result-container">
    <div v-if="status === 'empty'" class="empty-wrap">
      <el-empty description="暂无分析任务，请在上方输入指令后点击查询" />
    </div>

    <div v-else-if="status === 'confirm' && confirmData" class="confirm-wrap">
      <el-card shadow="never" class="card-box">
        <template #header>
          <div class="card-header">
            <span>任务解析确认</span>
            <el-tag type="warning" size="small">待核对</el-tag>
          </div>
        </template>

        <el-descriptions :column="1" border size="default">
          <el-descriptions-item label="原始问题">
            {{ confirmData.original_task }}
          </el-descriptions-item>
          <el-descriptions-item label="计算目标">
            <el-tag type="success">{{ confirmData.current_object }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="时间范围">
            <el-input v-if="isEditing" v-model="editTime" size="small" />
            <span v-else>{{ editTime || confirmData.time }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="分析区域">
            <el-input v-if="isEditing" v-model="editSpace" size="small" />
            <span v-else>{{ editSpace || confirmData.space }}</span>
          </el-descriptions-item>
        </el-descriptions>

        <div class="card-actions">
          <el-button type="primary" @click="handleConfirm">
            确认执行
          </el-button>
          <el-button v-if="!isEditing" @click="startEdit">
            修改条件
          </el-button>
          <el-button v-else type="success" @click="saveEdit">
            保存修改
          </el-button>
          <el-button @click="emit('reset')">
            取消
          </el-button>
        </div>
      </el-card>
    </div>

    <div
      v-else-if="status === 'loading'"
      v-loading="true"
      element-loading-text="空间智能体正在执行空间分析运算，请稍候..."
      class="loading-wrap"
    >
      <div style="height: 180px"></div>
    </div>

    <div v-else-if="status === 'result' && resultData" class="result-wrap">
      <el-alert
        title="空间分析计算完成"
        type="success"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />

      <el-card shadow="never" class="card-box" style="margin-bottom: 16px">
        <template #header>
          <div class="card-header">
            <span>{{ confirmData?.current_object || '分析计算结果' }}</span>
          </div>
        </template>
        <div class="kpi-box">
          <span class="kpi-number">{{ formattedArea }}</span>
          <span class="kpi-unit">{{ resultData.area?.unit || "平方米" }}</span>
        </div>
      </el-card>

      <el-card shadow="never" class="card-box" style="margin-bottom: 16px">
        <template #header>
          <div class="card-header">
            <span>计算过程</span>
          </div>
        </template>
        <div class="step-list">
          <div v-for="s in resultData.steps" :key="s.step" class="step-item">
            <div class="step-title">第 {{ s.step }} 步：{{ s.name }}</div>
            <div class="step-desc">工具：{{ s.tool }} ｜ 结果：{{ s.output }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="card-box" style="margin-bottom: 16px">
        <template #header>
          <div class="card-header">
            <span>数据来源清单</span>
          </div>
        </template>
        <el-table :data="resultData.data_sources" size="small" border stripe>
          <el-table-column prop="name" label="数据名称" min-width="120" />
          <el-table-column prop="layer" label="图层" width="100" />
          <el-table-column prop="time" label="时段" width="80" />
          <el-table-column prop="region" label="区域" width="70" />
        </el-table>
      </el-card>

      <div style="text-align: right; padding-bottom: 16px">
        <el-button size="default" @click="emit('reset')">
          重新查询
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
}

.empty-wrap {
  padding-top: 40px;
}

.card-box {
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.card-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.kpi-box {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.kpi-number {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}

.kpi-unit {
  font-size: 14px;
  color: #909399;
}

.step-list {
  display: flex;
  flex-direction: column;
}

.step-item {
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.step-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.step-desc {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
}
</style>

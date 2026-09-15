<script setup>
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  defaultValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["search"]);

const input = ref(props.defaultValue);

watch(
  () => props.defaultValue,
  (val) => {
    input.value = val;
  },
);

const handleSearch = () => {
  if (!input.value.trim()) return;
  emit("search", input.value);
};
</script>

<template>
  <div class="search-container">
    <el-input
      v-model="input"
      placeholder="请输入空间分析指令..."
      class="search-input"
      clearable
      :disabled="loading"
      @keyup.enter="handleSearch"
    />
    <el-button
      type="primary"
      :icon="Search"
      :loading="loading"
      @click="handleSearch"
    >
      查询
    </el-button>
  </div>
</template>

<style scoped>
.search-container {
  flex-shrink: 0;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ebeef5;
}

.search-input {
  flex: 1;
}
</style>

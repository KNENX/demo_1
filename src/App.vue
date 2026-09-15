<script setup>
import { ref, computed } from "vue";
import Header from "./components/Header.vue";
import Map from "./components/Map.vue";
import Result from "./components/Result.vue";
import Search from "./components/Search.vue";
import {
  defaultQuestion,
  mockConfirmData,
  mockResultData,
} from "./mockData.js";

// 状态：empty | confirm | loading | result
const currentStatus = ref("empty");
const searchLoading = ref(false);

const confirmData = ref(JSON.parse(JSON.stringify(mockConfirmData)));
const resultData = ref(mockResultData);

const mapGeoJson = computed(() => {
  return currentStatus.value === "result" ? resultData.value.geojson : null;
});

const handleSearch = (question) => {
  searchLoading.value = true;
  setTimeout(() => {
    confirmData.value.original_task = question;
    currentStatus.value = "confirm";
    searchLoading.value = false;
  }, 400);
};

const handleConfirm = (updatedContext) => {
  if (updatedContext) {
    confirmData.value = { ...confirmData.value, ...updatedContext };
  }
  currentStatus.value = "loading";
  setTimeout(() => {
    currentStatus.value = "result";
  }, 600);
};

const handleReset = () => {
  currentStatus.value = "empty";
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header height="50px">
        <Header />
      </el-header>

      <el-container>
        <el-aside width="40%">
          <Search
            :loading="searchLoading"
            :default-value="defaultQuestion"
            @search="handleSearch"
          />
          <Result
            :status="currentStatus"
            :confirm-data="confirmData"
            :result-data="resultData"
            @confirm="handleConfirm"
            @reset="handleReset"
          />
        </el-aside>

        <el-main>
          <Map :geojson="mapGeoJson" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout,
.common-layout > .el-container {
  height: 100vh;
  overflow: hidden;
}

.el-container:not(.is-vertical) {
  height: calc(100vh - 50px);
  min-height: 0;
  overflow: hidden;
}

.el-aside {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-right: 1px solid #dcdfe6;
  background-color: #ffffff;
  overflow: hidden;
}

.el-main {
  height: 100%;
  min-height: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.el-header {
  border-bottom: 1px solid #dcdfe6;
  flex-shrink: 0;
}
</style>

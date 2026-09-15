import fs from "node:fs";
import { defaultQuestion, mockConfirmData, mockResultData } from "../src/mockData.js";

function runTests() {
  console.log("🚀 开始检索部分 UI Demo 及组件接口规范自动化测试...");

  // 1. 验证 mockData.js 契约数据结构完整性
  if (!defaultQuestion || typeof defaultQuestion !== "string") {
    throw new Error("❌ defaultQuestion 非法");
  }
  if (!mockConfirmData.original_task || !mockConfirmData.current_object || !mockConfirmData.time || !mockConfirmData.space) {
    throw new Error("❌ mockConfirmData 缺失 02 规范中的核心 4 项字段");
  }
  if (!mockResultData.area || typeof mockResultData.area.value !== "number" || !mockResultData.area.unit) {
    throw new Error("❌ mockResultData.area 缺失面积数值或单位");
  }
  if (!Array.isArray(mockResultData.steps) || mockResultData.steps.length !== 4) {
    throw new Error("❌ mockResultData.steps 步骤数不为 4");
  }
  if (!Array.isArray(mockResultData.data_sources) || mockResultData.data_sources.length < 1) {
    throw new Error("❌ mockResultData.data_sources 来源列表为空");
  }
  if (!mockResultData.geojson || mockResultData.geojson.type !== "FeatureCollection" || mockResultData.geojson.features.length < 1) {
    throw new Error("❌ mockResultData.geojson 缺失合法的 FeatureCollection 要素");
  }
  console.log("✅ 模拟数据契约校验通过: 01 提问、02 确认项、04 指标与步骤链、GeoJSON 多边形均合法");

  // 2. 验证 Search.vue 接口规范
  const searchVue = fs.readFileSync(new URL("../src/components/Search.vue", import.meta.url), "utf-8");
  if (!searchVue.includes("props = defineProps") || !searchVue.includes("loading") || !searchVue.includes("defaultValue")) {
    throw new Error("❌ Search.vue 缺失 props (loading 或 defaultValue) 定义");
  }
  if (!searchVue.includes("emit = defineEmits") || !searchVue.includes("search")) {
    throw new Error("❌ Search.vue 缺失 emit('search') 事件输出");
  }
  if (!searchVue.includes("flex-shrink: 0")) {
    throw new Error("❌ Search.vue 缺失 flex-shrink: 0 防挤压样式");
  }
  console.log("✅ Search.vue 接口校验通过: 具备 loading 状态、defaultValue 属性与 search 事件输出");

  // 3. 验证 Result.vue 4 种状态及标准 Element Plus 组件使用
  const resultVue = fs.readFileSync(new URL("../src/components/Result.vue", import.meta.url), "utf-8");
  if (!resultVue.includes("el-empty") || !resultVue.includes("el-descriptions") || !resultVue.includes("step-item") || !resultVue.includes("el-table")) {
    throw new Error("❌ Result.vue 缺失标准组件或基础步骤项结构 (el-empty/descriptions/step-item/table)");
  }
  if (!resultVue.includes("v-loading") || !resultVue.includes("el-alert")) {
    throw new Error("❌ Result.vue 缺失标准加载指令或执行状态提示");
  }
  if (!resultVue.includes("min-height: 0") || !resultVue.includes("overflow-y: auto")) {
    throw new Error("❌ Result.vue 缺失弹性滚动与高度约束样式");
  }
  console.log("✅ Result.vue 状态卡片校验通过: 包含空状态、el-descriptions 确认项、v-loading 分析态及简洁步骤/table 结果态");

  // 4. 验证 Map.vue 天地图组件规范与 geojson 接口
  const mapVue = fs.readFileSync(new URL("../src/components/Map.vue", import.meta.url), "utf-8");
  if (!mapVue.includes("geojson") || !mapVue.includes("Polygon") || !mapVue.includes("setViewport")) {
    throw new Error("❌ Map.vue 缺失 props.geojson 监听、Polygon 绘制或 setViewport 自适应聚焦");
  }
  if (mapVue.includes("Leaflet") || mapVue.includes("leaflet")) {
    throw new Error("❌ 严禁引入 Leaflet，必须使用天地图原生 JSAPI");
  }
  console.log("✅ Map.vue 天地图组件校验通过: 原生 JSAPI 驱动，具备 geojson 上图与 setViewport 自适应能力");

  // 5. 验证 App.vue 串联与布局隔离
  const appVue = fs.readFileSync(new URL("../src/App.vue", import.meta.url), "utf-8");
  if (!appVue.includes("<Search") || !appVue.includes("<Result") || !appVue.includes("<Map")) {
    throw new Error("❌ App.vue 缺失核心子组件模板声明");
  }
  if (!appVue.includes("handleSearch") || !appVue.includes("handleConfirm") || !appVue.includes("handleReset")) {
    throw new Error("❌ App.vue 缺失完整的检索、确认与重置流转处理函数");
  }
  if (!appVue.includes("overflow: hidden") || !appVue.includes("min-height: 0")) {
    throw new Error("❌ App.vue 缺失高度约束与视口溢出隔离样式");
  }
  console.log("✅ App.vue 状态流转校验通过: 支持 search ➔ confirm ➔ loading ➔ result 全流程");

  console.log("\n🎉 检索部分 UI Demo 与组件接口全部自动化测试通过！");
}

try {
  runTests();
} catch (err) {
  console.error("测试未通过:", err.message);
  process.exit(1);
}

export const defaultQuestion = "2025年6月至2025年7月历城区耕地集中种植区转为耕地非粮化的面积是多少";

// 02 任务解析数据
export const mockConfirmData = {
  original_task: "2025年6月至2025年7月历城区耕地集中种植区转为耕地非粮化的面积是多少",
  current_object: "耕地集中种植区转为耕地非粮化的总面积",
  time: "2025年6月至2025年7月",
  space: "历城区"
};

// 04 空间分析结果数据
export const mockResultData = {
  status: "success",
  area: {
    value: 27728.95,
    unit: "平方米"
  },
  data_sources: [
    { name: "2025年土地利用现状数据库", layer: "耕地集中种植区", time: "2025年6月", region: "历城区" },
    { name: "2025年遥感监测非粮化图斑库", layer: "非粮化监测图层", time: "2025年7月", region: "历城区" }
  ],
  steps: [
    { step: 1, name: "数据范围空间裁剪与过滤", tool: "ArcPy Clip_analysis", output: "历城区基础耕地多边形" },
    { step: 2, name: "非粮化种植候选斑块提取", tool: "ArcPy Select_analysis", output: "非粮化候选斑块数据集" },
    { step: 3, name: "时空变化检测叠加分析", tool: "ArcPy Intersect_analysis", output: "非粮化重叠斑块 (59处)" },
    { step: 4, name: "几何椭球面积汇总统计", tool: "ArcPy CalculateAreas_stats", output: "总面积 27,728.95 平方米" }
  ],
  geojson: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: 1, name: "历城区唐王街道非粮化监测图斑" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [117.15, 36.72],
              [117.20, 36.72],
              [117.20, 36.76],
              [117.15, 36.76],
              [117.15, 36.72]
            ]
          ]
        }
      },
      {
        type: "Feature",
        properties: { id: 2, name: "历城区董家街道非粮化监测图斑" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [117.18, 36.68],
              [117.23, 36.68],
              [117.23, 36.71],
              [117.18, 36.71],
              [117.18, 36.68]
            ]
          ]
        }
      },
      {
        type: "Feature",
        properties: { id: 3, name: "历城区郭店街道非粮化监测图斑" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [117.22, 36.73],
              [117.26, 36.73],
              [117.26, 36.77],
              [117.22, 36.77],
              [117.22, 36.73]
            ]
          ]
        }
      }
    ]
  }
};

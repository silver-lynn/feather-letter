# 图片与地图来源

本目录中的四张 `illustrations/*.png` 为本项目使用 OpenAI 图像生成工具制作的原创科普风格插图。它们用于界面方向评审，并不替代物种鉴定照片。

`references/*.jpg` 为可复用的 Wikimedia Commons 参考照片：

- 东方白鹳：Spaceaero2，CC BY-SA 3.0，https://commons.wikimedia.org/wiki/File:Oriental_Stork_3_marugame_kagawa.jpg
- 勺嘴鹬：tareq's Photography，CC BY-SA 4.0，https://commons.wikimedia.org/wiki/File:Spoon-billed_sandpiper.jpg
- 北京雨燕物种特征参考照（同种 Apus apus，未声称为北京繁殖种群个体）：Imran Shah，CC BY-SA 2.0，https://commons.wikimedia.org/wiki/File:Common_Swift_(Apus_apus)_(49771152216).jpg
- 斑头雁：Charles J. Sharp，CC BY-SA 4.0，https://commons.wikimedia.org/wiki/File:Bar-headed_geese_(Anser_indicus).jpg

`data/countries.geojson` 来自 Natural Earth 1:110m 国家边界数据，公共领域：
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

`data/gbif-monthly-clusters.json` 由 `scripts/build_gbif_flows.py` 从 GBIF Occurrence API 生成。筛选口径为 2016–2026 年、带坐标、无已标记空间问题、状态为 PRESENT 的记录；按月份抽样并聚合到约 10° 网格。它反映公开存在记录的相对集中程度，不是种群数量或无偏丰度估计：
https://techdocs.gbif.org/en/openapi/v1/occurrence

迁徙路线的研究校核入口：

- 东方白鹳 GPS 追踪：https://doi.org/10.1016/j.avrs.2023.100090
- 北京雨燕地理定位器追踪：https://doi.org/10.1186/s40462-022-00329-2
- 勺嘴鹬迁徙追踪：https://doi.org/10.18194/ws.00201
- 斑头雁卫星追踪：https://doi.org/10.1155/2011/323847

说明：政府或保护机构网页可作为物种身份、保护级别及科普信息的权威依据，但页面照片未必开放再利用。因此当前界面没有直接复制这些官方网页图片，而采用许可清晰的 Commons 照片，并保留来源署名。

新增 16 种候鸟的 Wikimedia Commons 文件名、作者、许可证及来源链接记录在 `data/photo-credits.json`。这些照片由 `scripts/fetch_commons_photos.py` 通过 Commons API 筛选明确标注为 CC 或公共领域的文件后下载。

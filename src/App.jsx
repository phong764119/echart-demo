import { useRef } from "react";
import "./App.css";
import { graphic, init } from "echarts";
import { useEffect } from "react";

const getTime = (n, t) => {
  switch (t) {
    case "h":
      return 60 * 60 * 1000 * n;
    case "m":
      return 60 * 1000 * n;
    case "s":
      return 1000 * n;
    default:
      return 0;
  }
};
const takt_data = [
  [0, getTime(12, "h"), getTime(12, "h") + getTime(5, "m"), 0, 0],
];

while (takt_data[takt_data.length - 1][2] < getTime(20, "h")) {
  let d = takt_data[takt_data.length - 1];
  let r = Math.floor(Math.random() * 101);
  let c = d[2] + getTime(5, "m");
  if (
    c <= getTime(13, "h") ||
    (c > getTime(15, "h") + getTime(10, "m") &&
      c <= getTime(15, "h") + getTime(20, "m")) ||
    (c > getTime(16, "h") && c <= getTime(16, "h") + getTime(40, "m")) ||
    c == getTime(17, "h") + getTime(10, "m") ||
    (c > getTime(19, "h") + getTime(10, "m") &&
      c <= getTime(19, "h") + getTime(20, "m")) ||
    c > getTime(19, "h") + getTime(30, "m")
  )
    r = 0;
  let t = r == 0 ? 0 : 80;
  takt_data.push([r, d[2], c, t]);
}

function convertMillisecToHHMM(milliseconds) {
  // Calculate the total number of hours
  const totalHours = Math.floor(milliseconds / (1000 * 60 * 60));

  // Calculate the remaining minutes
  const totalMinutes = Math.floor(
    (milliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Format hours and minutes to be two digits
  const formattedHours = String(totalHours).padStart(2, "0");
  const formattedMinutes = String(totalMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
const data = [
  {
    name: "Idle time",
    value: [3, getTime(12, "h"), getTime(13, "h"), getTime(1, "h")],
    itemStyle: {
      normal: {
        color: "#8FDBF3",
      },
    },
  },
  {
    name: "Idle time",
    value: [
      3,
      getTime(16, "h"),
      getTime(16, "h") + getTime(40, "m"),
      getTime(40, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#8FDBF3",
      },
    },
  },
  {
    name: "Changeover",
    value: [
      2,
      getTime(15, "h") + getTime(10, "m"),
      getTime(15, "h") + getTime(10, "m") + getTime(10, "m"),
      getTime(10, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#1E8B9D",
      },
    },
  },
  {
    name: "Stopped",
    value: [
      1,
      getTime(17, "h") + getTime(5, "m"),
      getTime(17, "h") + getTime(10, "m"),
      getTime(5, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#FA541C",
      },
    },
  },
  {
    name: "Stopped",
    value: [
      1,
      getTime(19, "h") + getTime(10, "m"),
      getTime(19, "h") + getTime(20, "m"),
      getTime(10, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#9D9898",
      },
    },
  },
  {
    name: "Stopped",
    value: [
      1,
      getTime(19, "h") + getTime(30, "m"),
      getTime(19, "h") + getTime(40, "m"),
      getTime(10, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#9D9898",
      },
    },
  },
  {
    name: "Running",
    value: [
      0,
      getTime(13, "h"),
      getTime(13, "h") + getTime(90, "m") + getTime(10, "m"),
      getTime(10, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#75D050",
      },
    },
  },
  {
    name: "Running",
    value: [
      0,
      getTime(13, "h") + getTime(100, "m"),
      getTime(15, "h") + getTime(10, "m"),
      getTime(15, "h") +
        getTime(10, "m") -
        (getTime(13, "h") + getTime(100, "m")),
    ],
    itemStyle: {
      normal: {
        color: "#F1FF58",
      },
    },
  },
  {
    name: "Running",
    value: [
      0,
      getTime(15, "h") + getTime(20, "m"),
      getTime(16, "h"),
      getTime(40, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#75D050",
      },
    },
  },
  {
    name: "Running",
    value: [
      0,
      getTime(16, "h") + getTime(40, "m"),
      getTime(17, "h") + getTime(5, "m"),
      getTime(25, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#75D050",
      },
    },
  },
  {
    name: "Running",
    value: [
      0,
      getTime(17, "h") + getTime(10, "m"),
      getTime(19, "h") + getTime(10, "m"),
      getTime(19, "h") +
        getTime(10, "m") -
        (getTime(15, "h") + getTime(10, "m")),
    ],
    itemStyle: {
      normal: {
        color: "#75D050",
      },
    },
  },
  {
    name: "Running",
    value: [
      0,
      getTime(19, "h") + getTime(20, "m"),
      getTime(19, "h") + getTime(30, "m"),
      getTime(10, "m"),
    ],
    itemStyle: {
      normal: {
        color: "#F1FF58",
      },
    },
  },
];

function App() {
  const chartRef = useRef();

  useEffect(() => {
    let myChart = init(chartRef.current, null, {
      renderer: "canvas",
    });
    let option;

    // let startTime = +new Date();
    let categories = ["Running", "Stopped", "Changeover", "Idle time"];

    function renderTakt(params, api) {
      let yVal = api.value(0);
      let start = api.coord([api.value(1), yVal]);
      let end = api.coord([api.value(2), yVal]);
      const [x1, y1] = api.coord([api.value(1), api.value(3)]);
      const [x2, y2] = api.coord([api.value(2), api.value(3)]);
      let height = api.size([0, yVal])[1];
      // graphic.Line();
      let rectShape = graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1],
          width: end[0] - start[0],
          height: height,
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        }
      );

      return {
        type: "group",
        children: [
          {
            type: "rect",
            transition: ["shape"],
            shape: rectShape,
            style: {
              fill: "#757171",
            },
          },
          {
            type: "line",
            shape: { x1, y1, x2, y2 },
            style: {
              stroke: "red",
              lineWidth: 1,
            },
          },
        ],
      };
    }

    function renderItem(params, api) {
      let categoryIndex = api.value(0);
      let start = api.coord([api.value(1), categoryIndex]);
      let end = api.coord([api.value(2), categoryIndex]);
      let height = api.size([0, 1])[1];
      let rectShape = graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height,
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        }
      );
      return (
        rectShape && {
          type: "rect",
          transition: ["shape"],
          shape: rectShape,
          style: api.style(),
        }
      );
    }
    option = {
      tooltip: {
        formatter: function (params) {
          return (
            params.marker +
            params.name +
            ": " +
            convertMillisecToHHMM(params.value[3])
          );
        },
      },
      title: {
        text: "Profile",
        left: "center",
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: [0, 1],
          },
        ],
      },
      dataZoom: [
        {
          filterMode: "weakFilter",

          showDataShadow: false,

          type: "inside",
          xAxisIndex: [0, 1],
        },
      ],
      grid: [
        {
          height: 300,
        },
        {
          top: 380,
          height: 100,
        },
      ],
      xAxis: [
        {
          gridIndex: 0,
          min: getTime(12, "h"),
          max: getTime(20, "h"),
          scale: true,
          position: "top",
          axisLine: {
            show: true,
          },
          minorTick: {
            show: true,
            length: 4,
          },
          axisTick: {
            show: true,
            length: 8,
            alignWithLabel: true,
          },
          splitLine: {
            show: true,
          },
          interval: getTime(1, "h"),

          axisLabel: {
            formatter: function (val) {
              return convertMillisecToHHMM(val);
            },
          },
        },
        {
          scale: true,
          gridIndex: 1,
          min: getTime(12, "h"),
          max: getTime(20, "h"),
          axisLabel: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          // axisLine: { show: false },
        },
      ],
      yAxis: [
        {
          gridIndex: 0,
          // scale: true,
          data: categories,
          type: "category",
          axisLine: {
            show: true,
          },
          // interval: 1,
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
            // alignWithLabel: true,
          },
        },
        {
          // scale: true,
          // data: ["aaa"],
          gridIndex: 1,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],

      series: [
        {
          type: "custom",
          renderItem: renderItem,

          encode: {
            x: [1, 2],
            y: 0,
          },
          data: data,
        },
        {
          type: "custom",
          renderItem: renderTakt,
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: takt_data,
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
        // {
        //   type: "bar",
        //   barCategoryGap: "0",
        //   xAxisIndex: 1,
        //   yAxisIndex: 1,
        //   itemStyle: {
        //     color: "#757171",
        //   },
        //   data: bar_values,
        // },
        // {
        //   type: "line",
        //   xAxisIndex: 1,
        //   yAxisIndex: 1,
        //   smooth: true,
        //   showSymbol: false,
        //   lineStyle: {
        //     width: 1,
        //     color: "red",
        //   },
        //   data: line_data,
        // },
      ],
    };
    myChart.setOption(option);
  }, []);

  return (
    <>
      <div ref={chartRef} style={{ width: "100%", height: "700px" }}></div>
    </>
  );
}

export default App;

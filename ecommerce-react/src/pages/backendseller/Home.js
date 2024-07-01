import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import "../../CSS/revenuseller.css";
import OrderService from "../../service/OrderService";
const ListRevenueStatisticssSeller = () => {
  const sellerId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  useEffect(() => {
    const fetchOrders = async () => {
      const result = await OrderService.getOrderWithOrderDetails();
      const responseData = result.data; // Assume the data is in the "data" key

      const filteredOrders = responseData.filter(
        (order) => order.seller_id === parseInt(sellerId, 10)
      );
      setOrders(filteredOrders);
      console.log("Filtered Orders:", filteredOrders);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    // Tính tổng doanh thu và số đơn hàng cho mỗi ngày
    const dataByDate = orders.reduce((acc, order) => {
      const date = new Date(order.order_detail_created).toLocaleDateString();
      acc[date] = acc[date] || { revenue: 0, orders: 0 }; // Khởi tạo nếu chưa tồn tại
      acc[date].revenue += order.order_detail_amount; // Tổng doanh thu cho mỗi ngày
      acc[date].orders++; // Số đơn hàng cho mỗi ngày
      return acc;
    }, {});

    // Tính tổng doanh thu từ số liệu đã tính
    let revenueTotal = 0;
    let ordersTotal = 0;
    const chartData = Object.keys(dataByDate).map((date) => {
      revenueTotal += dataByDate[date].revenue;
      ordersTotal += dataByDate[date].orders;
      return {
        date,
        revenue: dataByDate[date].revenue,
        orders: dataByDate[date].orders,
      };
    });

    // Cập nhật state với tổng doanh thu, số lượng đơn hàng và dữ liệu biểu đồ
    setTotalRevenue(revenueTotal);
    setTotalOrders(ordersTotal);
    setChartData(chartData);
  }, [orders]); // useEffect được kích hoạt lại mỗi khi orders thay đổi

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      // Lọc dữ liệu đơn hàng trong khoảng thời gian đã chọn
      const filteredData = orders.filter((order) => {
        const orderDate = new Date(order.order_detail_created);
        return (
          orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
        );
      });

      // Tổng hợp dữ liệu theo ngày
      const aggregatedData = filteredData.reduce((acc, order) => {
        const date = new Date(order.order_detail_created).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { revenue: 0, orders: 0 };
        }
        acc[date].revenue += order.order_detail_amount;
        acc[date].orders += 1; // Mỗi đơn hàng tăng lên 1
        return acc;
      }, {});

      // Chuyển đổi dữ liệu tổng hợp sang định dạng biểu đồ
      const chartData = Object.keys(aggregatedData).map((date) => ({
        date,
        ...aggregatedData[date],
      }));

      // Tính tổng doanh thu và tổng số đơn hàng
      let revenueTotal = 0;
      let ordersTotal = 0;

      filteredData.forEach((order) => {
        revenueTotal += order.order_detail_amount;
        ordersTotal += 1;
      });

      setTotalRevenue(revenueTotal);
      setTotalOrders(ordersTotal);
      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["Doanh thu", "Đơn hàng"],
      selected: {
        "Doanh thu": true,
        "Đơn hàng": true,
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: chartData.map((data) => data.date),
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Đơn hàng",
        min: 0,
        axisLabel: {
          formatter: (value) => value,
        },
      },
      {
        type: "value",
        name: "Doanh thu",
        min: 0,
        axisLabel: {
          formatter: (value) => value.toLocaleString(),
        },
      },
    ],
    series: [
      {
        name: "Doanh thu",
        type: "line",
        yAxisIndex: 1,
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        areaStyle: {
          opacity: 0, // Bỏ màu bóng ở dưới đường của doanh số
        },
        data: chartData.map((data) => data.revenue),
        lineStyle: { color: "#5470C6" },
        itemStyle: {
          color: "#5470C6",
        },
        showSymbol: false,
      },
      {
        name: "Đơn hàng",
        type: "line",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        areaStyle: {
          opacity: 0, // Bỏ màu bóng ở dưới đường của doanh số
        },
        data: chartData.map((data) => data.orders),
        lineStyle: { color: "rgb(255, 107, 69)" },
        itemStyle: {
          color: "rgb(255, 107, 69)",
        },
        showSymbol: false,
      },
    ],
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <div
      data-v-645bb55f
      className="datacenter-container clearfix BiOverview"
      style={{ marginTop: 20 }}
    >
      <div data-v-645bb55f className="dashboard datacenter-container-body">
        {/*fragment#13f223859b4#head*/}

        <div fragment="13f223859b4" className="date-export">
          <div
            data-v-2cea0e7b
            data-v-22a85d13
            className="date-export__date-picker mr-16 mb-8 eds-popover eds-popover--light"
          >
            <div data-v-2cea0e7b className="eds-popover__ref">
              <div
                data-v-2cea0e7b
                data-v-22a85d13
                className="eds-popover eds-popover--light"
              >
                <div data-v-2cea0e7b className="eds-popover__ref">
                  <div
                    data-v-61bd32e0
                    data-v-22a85d13
                    className="bi-date-input track-click-open-time-selector"
                    data-v-2cea0e7b
                    style={{ height: 50 }}
                  >
                    <span data-v-61bd32e0 className="title">
                      Khung Thời Gian
                    </span>
                    <div
                      className="d-flex justify-content-end mt-1"
                      style={{ height: 75, marginLeft: 100 }}
                    >
                      <div class="p-2">
                        <input
                          type="date"
                          style={{
                            outline: "none",
                            boxShadow: "none",
                            width: 200,
                            maxHeight: 30,
                            marginTop: 13,
                          }}
                          className="form-control border"
                          id="startDateInput"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div class="p-2" style={{ marginTop: 20 }}>
                        <span className="">-</span>
                      </div>
                      <div class="p-2">
                        <input
                          type="date"
                          style={{
                            outline: "none",
                            boxShadow: "none",
                            width: 200,
                            maxHeight: 30,
                            marginTop: 13,
                          }}
                          className="form-control"
                          id="endDateInput"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section data-edu="keyMetrics" className="feature-section">
          <p className="feature-section__title">Tổng quan</p>
          <div data-v-b469f326 className="container kmg-selectable km-page1">
            <div
              data-v-b469f326
              data-track-info='{"pageSection":"key_metrics","targetType":"metrics_card"}'
              className="key-metric-group"
            >
              <div
                data-v-5107c1cc
                data-v-b469f326
                className="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{
                  width: "227.4px",
                  marginLeft: 16,
                }}
              >
                <div data-v-5107c1cc className="title">
                  <span data-v-5107c1cc style={{ marginRight: 4 }}>
                    Doanh số
                  </span>
                  <div
                    data-v-2cea0e7b
                    data-v-e504d3bc
                    data-v-5107c1cc
                    className="info-tooltip eds-popover eds-popover--light"
                    style={{ color: "rgb(183, 183, 183)" }}
                  >
                    <div data-v-2cea0e7b className="eds-popover__ref">
                      <i
                        data-v-c3cf29f8
                        data-v-e504d3bc
                        className="eds-icon"
                        data-v-2cea0e7b
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M8,2 C4.6862915,2 2,4.6862915 2,8 C2,11.3137085 4.6862915,14 8,14 C11.3137085,14 14,11.3137085 14,8 C14,4.6862915 11.3137085,2 8,2 Z M7.98750749,10.2375075 C8.40172105,10.2375075 8.73750749,10.5732939 8.73750749,10.9875075 C8.73750749,11.401721 8.40172105,11.7375075 7.98750749,11.7375075 C7.57329392,11.7375075 7.23750749,11.401721 7.23750749,10.9875075 C7.23750749,10.5732939 7.57329392,10.2375075 7.98750749,10.2375075 Z M8.11700238,4.60513307 C9.97011776,4.60513307 10.7745841,6.50497267 9.94298079,7.72186504 C9.76926425,7.97606597 9.56587088,8.14546785 9.27050506,8.31454843 L9.11486938,8.39945305 L8.95824852,8.47993747 C8.56296349,8.68261431 8.49390831,8.75808648 8.49390831,9.0209925 C8.49390831,9.29713488 8.27005069,9.5209925 7.99390831,9.5209925 C7.71776594,9.5209925 7.49390831,9.29713488 7.49390831,9.0209925 C7.49390831,8.34166619 7.7650409,7.99681515 8.35913594,7.6662627 L8.76655168,7.45066498 C8.9424056,7.3502536 9.04307851,7.26633638 9.11735517,7.1576467 C9.52116165,6.56675314 9.11397414,5.60513307 8.11700238,5.60513307 C7.41791504,5.60513307 6.82814953,6.01272878 6.75715965,6.55275918 L6.75,6.66244953 L6.74194433,6.75232516 C6.69960837,6.98557437 6.49545989,7.16244953 6.25,7.16244953 C5.97385763,7.16244953 5.75,6.9385919 5.75,6.66244953 C5.75,5.44256682 6.87194406,4.60513307 8.11700238,4.60513307 Z"
                          ></path>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
                <div data-v-5107c1cc className="value">
                  <label data-v-5107c1cc className>
                    <span className="currency">
                      <span className="currency-value">
                        {" "}
                        {isNaN(totalRevenue)
                          ? "0"
                          : formatPrice(parseInt(totalRevenue, 10))}
                      </span>
                    </span>
                  </label>
                </div>
                <div data-v-5107c1cc className="shortcut mt-8">
                  <span data-v-5107c1cc className="vs">
                    so với 30 ngày trước
                  </span>
                  <div data-v-5107c1cc className="percent ratio-wrapper">
                    <div
                      data-v-28a3538c
                      data-v-5107c1cc
                      className="percent-value"
                    >
                      <span data-v-28a3538c className="rate-class-name">
                        0,00
                      </span>
                      <span data-v-28a3538c className="symbol-class-name">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-v-5107c1cc
                data-v-b469f326
                className="key-metric-item track-click-key-metric-item key-metric km-selectable"
                style={{
                  width: "227.4px",
                  marginLeft: 16,
                }}
              >
                <div data-v-5107c1cc className="title">
                  <span data-v-5107c1cc style={{ marginRight: 4 }}>
                    Đơn hàng
                  </span>
                  <div
                    data-v-2cea0e7b
                    data-v-e504d3bc
                    data-v-5107c1cc
                    className="info-tooltip eds-popover eds-popover--light"
                    style={{ color: "rgb(183, 183, 183)" }}
                  >
                    <div data-v-2cea0e7b className="eds-popover__ref">
                      <i
                        data-v-c3cf29f8
                        data-v-e504d3bc
                        className="eds-icon"
                        data-v-2cea0e7b
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M8,2 C4.6862915,2 2,4.6862915 2,8 C2,11.3137085 4.6862915,14 8,14 C11.3137085,14 14,11.3137085 14,8 C14,4.6862915 11.3137085,2 8,2 Z M7.98750749,10.2375075 C8.40172105,10.2375075 8.73750749,10.5732939 8.73750749,10.9875075 C8.73750749,11.401721 8.40172105,11.7375075 7.98750749,11.7375075 C7.57329392,11.7375075 7.23750749,11.401721 7.23750749,10.9875075 C7.23750749,10.5732939 7.57329392,10.2375075 7.98750749,10.2375075 Z M8.11700238,4.60513307 C9.97011776,4.60513307 10.7745841,6.50497267 9.94298079,7.72186504 C9.76926425,7.97606597 9.56587088,8.14546785 9.27050506,8.31454843 L9.11486938,8.39945305 L8.95824852,8.47993747 C8.56296349,8.68261431 8.49390831,8.75808648 8.49390831,9.0209925 C8.49390831,9.29713488 8.27005069,9.5209925 7.99390831,9.5209925 C7.71776594,9.5209925 7.49390831,9.29713488 7.49390831,9.0209925 C7.49390831,8.34166619 7.7650409,7.99681515 8.35913594,7.6662627 L8.76655168,7.45066498 C8.9424056,7.3502536 9.04307851,7.26633638 9.11735517,7.1576467 C9.52116165,6.56675314 9.11397414,5.60513307 8.11700238,5.60513307 C7.41791504,5.60513307 6.82814953,6.01272878 6.75715965,6.55275918 L6.75,6.66244953 L6.74194433,6.75232516 C6.69960837,6.98557437 6.49545989,7.16244953 6.25,7.16244953 C5.97385763,7.16244953 5.75,6.9385919 5.75,6.66244953 C5.75,5.44256682 6.87194406,4.60513307 8.11700238,4.60513307 Z"
                          ></path>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
                <div data-v-5107c1cc className="value">
                  <label data-v-5107c1cc className="number">
                    <span className="number">
                      <span className="currency-value">{totalOrders}</span>
                    </span>
                  </label>
                </div>
                <div data-v-5107c1cc className="shortcut mt-8">
                  <span data-v-5107c1cc className="vs">
                    so với 30 ngày trước
                  </span>
                  <div data-v-5107c1cc className="percent ratio-wrapper">
                    <div
                      data-v-28a3538c
                      data-v-5107c1cc
                      className="percent-value"
                    >
                      {/**/}
                      <span data-v-28a3538c className="rate-class-name">
                        0,00
                      </span>
                      <span data-v-28a3538c className="symbol-class-name">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-v-3b74e8d5
            data-track-info='{"pageSection":"key_metrics","targetType":"metrics_trend"}'
            className="key-metric-chart kmc-dashboard"
          >
            <div data-v-3b74e8d5 className="chart-header">
              <span data-v-3b74e8d5 className="chart-label">
                Biểu đồ
              </span>
              <div data-v-3b74e8d5 className="chart-selected-num">
                <div data-v-3b74e8d5 className="selected-num">
                  Đã chọn
                  <span data-v-3b74e8d5>1</span>
                  /4
                </div>
              </div>
            </div>
            <div data-v-3b74e8d5 className="chart-body" style={{ height: 380 }}>
              <div data-v-3b74e8d5 style={{ position: "relative" }}>
                <div
                  data-v-3b74e8d5
                  id="keyMetricsChart"
                  className="line-chart"
                  _echarts_instance_="ec_1716301474324"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    userSelect: "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 1168,
                      height: 193,
                      padding: 0,
                      margin: 0,
                      borderWidth: 0,
                      cursor: "default",
                    }}
                  >
                    <ReactECharts
                      option={option}
                      style={{ height: "300px", width: "100%" }}
                    />
                  </div>
                </div>
              </div>
              <div
                data-v-3b74e8d5
                className="chart-legend mt-24"
                style={{ marginTop: 125 }}
              ></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListRevenueStatisticssSeller;

import ReactApexChart from 'react-apexcharts';

const BarLineChart = ({ chartType, categories, data, title }) => {
  const options = {
    chart: { type: chartType || 'bar', height: 350, }, // Default to 'bar' if no type is provided
    plotOptions: {
      bar: {
        horizontal: chartType === 'bar' && false, endingShape: 'rounded',
      },
      line: {
        curve: 'smooth', // For line charts to make the line smooth
      },
    },
    dataLabels: { enabled: false, },
    stroke: { show: true, width: 2, colors: ['transparent'], },
    title: {
      text: title || 'Chart Title', align: "Right",
      style: {
        fontSize: '100%',
        color: '#333',
      },
    },
    xaxis: { categories: categories || [], title: { text: '' } },
    yaxis: { title: { text: 'Values', }, },
    fill: { opacity: 1, },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Value`; // Change this formatting based on chart type
        },
      },
    },
  };

  const series = [
    {
      name: title || 'Data Series',
      data: data || [],
    },
  ];

  return (
    <div>
      <ReactApexChart options={options} series={series} type={chartType} height={'200%'} />
    </div>
  );
};

const PieChart = ({ data, title }) => {
  const options = {
    chart: { type: 'pie', height: 350, },
    title: {
      text: title || 'Pie Chart Title',
      align: 'center',
      style: {
        fontSize: '100%',
        color: '#333',
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Value`;
        },
      },
    },
  };

  const series = data || [];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="pie" height={'350px'} />
    </div>
  );
};

export { BarLineChart, PieChart };

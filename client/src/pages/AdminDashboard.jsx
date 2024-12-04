import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  // State Variables
  const [timeRange, setTimeRange] = useState("2024");
  const [userCounts, setUserCounts] = useState({ members: 0, admins: 0 });
  const [totalPosts, setTotalPosts] = useState(350);
  const [monthlyUsersData, setMonthlyUsersData] = useState({
    labels: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    datasets: [
      {
        label: "ผู้ใช้งานรายเดือน",
        data: new Array(12).fill(0),
        borderColor: "#4CAF50",
        fill: false,
        tension: 0.4, // เพิ่มความเรียบของเส้น
      },
    ],
  });

  const [postComparisonData, setPostComparisonData] = useState({
    labels: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    datasets: [
      {
        label: "โพสต์คอนโด",
        data: [],
        backgroundColor: "#2196F3",
      },
      {
        label: "โพสต์อพาร์ตเมนต์",
        data: [],
        backgroundColor: "#FF9800",
      },
    ],
  });

  const [postStatusCounts, setPostStatusCounts] = useState({
    active: 0,
    completed: 0,
    closed: 0,
  });

  // กำหนด options สำหรับการปรับขนาดข้อความในกราฟ
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        font: {
          size: 18, // ขนาดฟอนต์ของ title
        },
      },
      legend: {
        labels: {
          font: {
            size: 18, // ขนาดฟอนต์ของ legend
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 16, // ขนาดฟอนต์ของ ticks บนแกน X
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 16, // ขนาดฟอนต์ของ ticks บนแกน Y
          },
        },
      },
    },
  };

  // Fetch User Data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/all");
        const users = response.data;

        const admins = users.filter((user) => user.role === "admin").length;
        const members = users.filter((user) => user.role === "member").length;

        const usersPerMonth = new Array(12).fill(0);
        users.forEach((user) => {
          const registerDate = new Date(user.createdAt);
          const month = registerDate.getMonth();
          if (registerDate.getFullYear() === 2024) {
            usersPerMonth[month] += 1;
          }
        });

        setMonthlyUsersData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: usersPerMonth,
            },
          ],
        }));

        setUserCounts({ admins, members });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Empty array ensures this runs once when component mounts

  // Fetch Post Data from API
  useEffect(() => {
    const fetchPostComparisonData = async () => {
      try {
        const response = await axios.get("/api/listing/all");
        const posts = response.data;

        const condoPosts = posts.filter((post) => post.type === "condo");
        const apartmentPosts = posts.filter(
          (post) => post.type === "apartment"
        );

        const condoPostsMonthly = new Array(12).fill(0);
        const apartmentPostsMonthly = new Array(12).fill(0);

        let activePosts = 0;
        let completedPosts = 0;
        let closedPosts = 0;

        posts.forEach((post) => {
          const postDate = new Date(post.createdAt);
          const month = postDate.getMonth();

          if (post.type === "condo") {
            condoPostsMonthly[month] += 1;
          } else if (post.type === "apartment") {
            apartmentPostsMonthly[month] += 1;
          }

          if (post.status === "active") {
            activePosts += 1;
          } else if (post.status === "completed") {
            completedPosts += 1;
          } else if (post.status === "closed") {
            closedPosts += 1;
          }
        });

        setPostComparisonData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: condoPostsMonthly,
            },
            {
              ...prevData.datasets[1],
              data: apartmentPostsMonthly,
            },
          ],
        }));

        setTotalPosts(posts.length);
        setPostStatusCounts({
          active: activePosts,
          completed: completedPosts,
          closed: closedPosts,
        });
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostComparisonData();
  }, []); // Empty array ensures this runs once when component mounts

  // Handle Time Range Change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-500 h-[88.9vh]">
      <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Section 1: User and Post Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-blue-300 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800">ผู้ใช้งาน</h3>
          <p className="text-gray-700">สมาชิก: {userCounts.members}</p>
          <p className="text-gray-700">ผู้ดูแลระบบ: {userCounts.admins}</p>
        </div>
        <div className="bg-yellow-300 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800">โพสต์ทั้งหมด</h3>
          <p className="text-gray-700">{totalPosts} โพสต์</p>
        </div>
        <div className="bg-green-300 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800">
            สถานะโพสต์ ที่กำลังปล่อยเช่า
          </h3>
          <p className="text-gray-700">{postStatusCounts.active} โพสต์</p>
        </div>
        <div className="bg-red-300 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800">
            สถานะโพสต์ ที่หมดอายุ
          </h3>
          <p className="text-gray-700">{postStatusCounts.closed} โพสต์</p>
        </div>
      </div>

      {/* Section 2: Graphs */}
      <div className="flex space-x-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            ผู้ใช้งานรายเดือน
          </h2>
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="p-2 border rounded-md text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024">2024</option>
          </select>
          <Line data={monthlyUsersData} options={chartOptions} />
        </div>

        <div className="flex-1 space-y-20">
          <h2 className="text-2xl font-semibold text-gray-800">
            เปรียบเทียบโพสต์
          </h2>
          <Bar data={postComparisonData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

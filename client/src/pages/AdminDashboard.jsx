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
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>

      {/* Section 1: User and Post Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-blue-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">ผู้ใช้งาน</h3>
          <p>สมาชิก: {userCounts.members}</p>
          <p>ผู้ดูแลระบบ: {userCounts.admins}</p>
        </div>
        <div className="bg-yellow-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">โพสต์ทั้งหมด</h3>
          <p>{totalPosts} โพสต์</p>
        </div>
        <div className="bg-green-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">
            สถานะโพสต์ ที่กำลังปล่อยเช่า
          </h3>
          <p>{postStatusCounts.active} โพสต์</p>
        </div>
        <div className="bg-red-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">สถานะโพสต์ ที่หมดอายุ</h3>
          <p>{postStatusCounts.closed} โพสต์</p>
        </div>
      </div>

      {/* Section 2: Graphs */}
      <div className="flex space-x-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold">ผู้ใช้งานรายเดือน</h2>
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="p-2 border rounded-md"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <Line data={monthlyUsersData} />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold mb-20">
            การเปรียบเทียบโพสต์ (คอนโด vs อพาร์ตเมนต์)
          </h2>
          <Bar data={postComparisonData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

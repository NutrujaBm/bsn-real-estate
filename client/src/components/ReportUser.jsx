import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import { CiFlag1 } from "react-icons/ci";

function ReportUser({ user }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null); // State for storing user data

  const { userId } = useParams(); // Assuming you are using `userId` from URL params

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/gallery/${userId}`);
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]); // Re-run the effect when userId changes

  const handleReportClick = () => setIsPopupVisible(true);
  const handleClosePopup = () => setIsPopupVisible(false);
  const goToNextStep = () => setStep(2);
  const goBackToFirstStep = () => setStep(1);

  const handleSubmitReport = async () => {
    try {
      setIsSubmitting(true);

      const reportData = {
        reporter: currentUser._id,
        reportedEntity: userData?._id, // Use userData if it is available
        entityType: "user",
        description,
        issueType: selectedIssue,
      };

      console.log("ข้อมูลที่ส่งไปยัง API:", reportData);

      const response = await axios.post("/api/report/create", reportData);

      if (response.status === 201) {
        alert("รายงานถูกส่งแล้ว");
        setIsPopupVisible(false);
      }
    } catch (error) {
      console.error("Error creating report:", error);
      alert("เกิดข้อผิดพลาดในการส่งรายงาน");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <button
        onClick={handleReportClick}
        className="flex items-center border p-2 rounded-3xl text-base bg-gray-200 hover:bg-gray-300"
        title="รายงาน"
      >
        <CiFlag1 className="mr-0 sm:mr-3 w-6 h-6" />
        <span className="hidden sm:inline">รายงาน</span>
      </button>

      {isPopupVisible && (
        <div className="fixed inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96">
            {step === 1 && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                <div className="bg-white p-6 rounded-lg w-[400px] h-[500px] relative">
                  <form>
                    <div className="mb-4">
                      <div className="border-y border-black border-opacity-10 py-2">
                        <p className="text-base font-medium">รายงานผู้ใช้</p>
                        <span className="text-base">ปัญหาคืออะไร</span>
                      </div>

                      <div className="flex flex-col mt-6">
                        <label className="flex items-center text-base mb-3">
                          <input
                            type="radio"
                            name="issueType"
                            value="impersonation"
                            className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                            onChange={() => setSelectedIssue("impersonation")}
                          />
                          การแอบอ้างเป็นบุคคลอื่น
                        </label>
                        <label className="flex items-center text-base mb-3">
                          <input
                            type="radio"
                            name="issueType"
                            value="hate-speech"
                            className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                            onChange={() => setSelectedIssue("hate-speech")}
                          />
                          มีวาจาสร้างความเกลียดชัง
                        </label>
                        <label className="flex items-center text-base mb-3">
                          <input
                            type="radio"
                            name="issueType"
                            value="spam-and-fraud"
                            className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                            onChange={() => setSelectedIssue("spam-and-fraud")}
                          />
                          สแปมและกลโกง
                        </label>
                        <label className="flex items-center text-base mb-3">
                          <input
                            type="radio"
                            name="issueType"
                            value="no-matching-issue"
                            className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                            onChange={() =>
                              setSelectedIssue("no-matching-issue")
                            }
                          />
                          ไม่มีรายการที่ตรงกับปัญหาของฉัน
                        </label>
                      </div>
                      <div className="absolute bottom-4 right-0 flex justify-between px-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedIssue) {
                              goToNextStep();
                            } else {
                              alert(
                                "กรุณาเลือกปัญหาก่อนที่จะไปยังขั้นตอนถัดไป"
                              );
                            }
                          }}
                          className="px-4 py-2 rounded-full text-base text-blue-500 hover:bg-blue-100"
                        >
                          ถัดไป
                        </button>
                      </div>
                    </div>
                  </form>
                  <button
                    onClick={handleClosePopup}
                    className="absolute top-10 right-3 text-gray-700"
                  >
                    <IoIosClose className="w-10 h-10" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                <div className="bg-white p-6 rounded-lg w-[400px] h-[500px] relative">
                  <div className="border-y border-black border-opacity-10 py-2">
                    <p className="text-base font-medium">รายงานผู้ใช้</p>
                    <span className="text-base">ปัญหาคืออะไร</span>
                  </div>
                  <form>
                    <div className="mb-3 mt-5">
                      <span className="text-base">
                        ปัญหาที่เลือก : {selectedIssue}
                      </span>
                    </div>
                    <div className="mb-5">
                      <span className="text-base">
                        ชื่อผู้ใช้ที่ถูกรายงาน : {userData?.username}
                      </span>
                    </div>

                    <div className="mb-4">
                      <textarea
                        className="w-full h-32 border p-2 mb-4 rounded-sm text-base"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="ระบุรายละเอียดเพิ่มเติม"
                      ></textarea>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                      <button
                        type="button"
                        onClick={goBackToFirstStep}
                        className="px-4 py-2 rounded-full text-base hover:bg-gray-200"
                      >
                        กลับ
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitReport}
                        className="px-4 py-2 rounded-full text-base text-blue-500 hover:bg-blue-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "กำลังส่ง..." : "ส่งรายงาน"}
                      </button>
                    </div>

                    <button
                      onClick={handleClosePopup}
                      className="absolute top-10 right-3 text-gray-700"
                    >
                      <IoIosClose className="w-10 h-10" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportUser;

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LeaveForm from "./LeaveForm";

const MOCK_LEAVE = {
  id: "LEAVE-001",
  employeeName: "John Doe",
  employeeId: "EMP-001",
  department: "Engineering",
  leaveType: "Casual Leave",
  fromDate: "2026-07-29",
  toDate: "2026-07-30",
  reason: "Personal work",
};

const EditLeave = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  /*
   * Mock record lookup.
   * Backend/API integration can be added later.
   */
  const leave = {
    ...MOCK_LEAVE,
    id: id || MOCK_LEAVE.id,
  };

  const handleSubmit = (data) => {
    setLoading(true);

    console.log("Leave request updated:", {
      id: leave.id,
      ...data,
    });

    setTimeout(() => {
      setLoading(false);
      navigate("/leave");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/leave");
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
          Edit Leave
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update the employee leave request.
        </p>
      </div>

      {/* Form */}

      <LeaveForm
        defaultValues={leave}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />

    </div>
  );
};

export default EditLeave;
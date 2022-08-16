import { useForm } from "react-hook-form";
import ProfileStyles from "./ProfileStyles.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Loading from "../../loader/loading.svg";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { token } = useAuthContext();
  const [userId, setUserId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const updateUser = (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!data.password) {
      delete data["password"];
      delete data["confirmPassword"];
    }
    axios
      .patch(`/api/auth/user/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        reset();
        setError("");
        setSuccess("Profile updated successfully");
      })
      .catch((err) => {
        setSuccess("");
        setError(err.response.data.error);
      });
  };

  useEffect(() => {
    axios
      .get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoading(false);
        setUserId(res.data._id);
        reset({
          userName: res.data.userName,
          regNo: res.data.regNo,
          mobile: res.data.mobile,
          dept: res.data.dept,
          email: res.data.email,
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [token, reset]);

  if (loading) {
    return (
      <div className="container d-block mx-auto bg-dark">
        <h1 className="display-5 mt-5">Events</h1>
        <div className="row mt-5 mb-5">
          <div className="col d-flex justify-content-center">
            <img src={Loading} alt="..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="EventCreationPage container">
      <h1 className="display-5">Profile</h1>
      <div className="row bg-dark">
        <div className="col-lg-8">
          <div className="EventCreationForm  my-3 py-4 px-5 border shadow rounded">
            <form className="pt-3" onSubmit={handleSubmit(updateUser)}>
              <div className="form-group">
                <label>
                  Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  {...register("userName", {
                    required: "Name is Required",
                  })}
                  className={`form-control m-3 w-75 ${
                    errors.userName ? ProfileStyles.errorInput : ""
                  }`}
                ></input>
                {errors.userName && (
                  <span className={`${ProfileStyles.error} w-75`}>
                    {errors.userName.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Register Number</label>
                <input
                  type="text"
                  className={`form-control m-3 w-75 ${
                    errors.regNo ? ProfileStyles.errorInput : ""
                  }`}
                  {...register("regNo")}
                ></input>
              </div>
              <div className="form-group">
                <label>
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control m-3 w-75 ${
                    errors.mobile ? ProfileStyles.errorInput : ""
                  }`}
                  {...register("mobile", {
                    required: "Mobile Number is Required",
                  })}
                ></input>
                {errors.mobile && (
                  <span className={`${ProfileStyles.error} w-75`}>
                    {errors.mobile.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  className={`form-control m-3 w-75 ${
                    errors.dept ? ProfileStyles.errorInput : ""
                  }`}
                  {...register("dept")}
                ></input>
              </div>
              <div className="form-group">
                <label>
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control m-3 w-75 ${
                    errors.email ? ProfileStyles.errorInput : ""
                  }`}
                  {...register("email", { required: "Email is required" })}
                ></input>
                {errors.email && (
                  <span className={`${ProfileStyles.error} w-75`}>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control m-3 w-75 ${
                    errors.email ? ProfileStyles.errorInput : ""
                  }`}
                  {...register("password", {})}
                ></input>
              </div>
              <div className="form-group">
                <label>
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className={`form-control m-3 w-75 ${
                    errors.email ? ProfileStyles.errorInput : ""
                  }`}
                  {...register("confirmPassword", {})}
                ></input>
              </div>
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group w-75 text-center">
                <button
                  type="submit"
                  className="btn btn-primary my-2 ms-1 btn-lg border-primary text-primary bg-dark"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;

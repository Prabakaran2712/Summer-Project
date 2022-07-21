import Header from "../../components/EventCreationForm/Header";
import { useForm } from "react-hook-form";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const additem = (data) => {
    console.log(data);
    axios.post("/api/users", data).then((res) => {
      if (res.ok) {
        console.log("success");
      }
    });
    // .catch((err) => {
    //   console.log(err);
    // });
  };
  return (
    <div className="EventCreationPage container">
      <Header title={"Sign up"} />
      <div className="row">
        <div className="col-lg-8">
          <div className="EventCreationForm  my-3 py-4 px-5 border shadow rounded">
            <form className="pt-3" onSubmit={handleSubmit(additem)}>
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
                    errors.userName ? "errorinput" : ""
                  }`}
                ></input>
                {errors.userName && (
                  <span className="error w-75">{errors.userName.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Register Number</label>
                <input
                  type="text"
                  className={`form-control m-3 w-75 ${
                    errors.regNo ? "errorinput" : ""
                  }`}
                  {...register("reqNo")}
                ></input>
              </div>
              <div className="form-group">
                <label>
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control m-3 w-75 ${
                    errors.mobile ? "errorinput" : ""
                  }`}
                  {...register("mobile", {
                    required: "Mobile Number is Required",
                  })}
                ></input>
                {errors.mobile && (
                  <span className="error w-75">{errors.mobile.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  className={`form-control m-3 w-75 ${
                    errors.dept ? "errorinput" : ""
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
                    errors.email ? "errorinput" : ""
                  }`}
                  {...register("email", { required: "Email is required" })}
                ></input>
                {errors.email && (
                  <span className="error w-75">{errors.email.message}</span>
                )}
              </div>
              <div className="form-group w-75 text-center">
                <button
                  type="submit"
                  className="btn btn-primary my-2 ms-1 btn-lg"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
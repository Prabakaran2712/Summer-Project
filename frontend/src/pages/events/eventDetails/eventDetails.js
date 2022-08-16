import image1 from "../../../images/e1.png";
import "./eventDetail.css";
import EventAbstract from "./eventAbstract";
import EventInformation from "./eventInformation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../loader/loading.svg";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Recommendations from "../../../components/events/Recommendations";

const EventDetail = () => {
  const { user, token } = useAuthContext();
  const [isOrganiser, setIsOrganiser] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  const [classname, setClassname] = useState("hide");
  const [loadclass, setLoadClass] = useState("view");

  const register = () => {
    setRegistrationLoading(true);
    axios
      .post(
        `/api/events/participants/${data._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setRegistered(true);
        setRegistrationLoading(false);
      });
  };

  const unregister = () => {
    setRegistrationLoading(true);
    axios
      .delete(`/api/events/participants/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setRegistered(false);
        setRegistrationLoading(false);
      });
  };

  useEffect(() => {
    const fetchDetail = () => {
      axios.get(`/api/events/${id}`).then((response) => {
        setData({
          ...response.data,
          eventStartDate: response.data.eventStartDate.substr(0, 16),
          eventEndDate: response.data.eventEndDate.substr(0, 16),
        });
        // check if current user is an organizer
        response.data.organisers.forEach((organiser) => {
          if (organiser.email === user) {
            setIsOrganiser(true);
            return;
          }
        });
        // check if current user is a participant
        response.data.participants.forEach((participant) => {
          if (participant.email === user) {
            setRegistered(true);
            return;
          }
        });
        setLoading(false);
      });
    };
    fetchDetail();
  }, [id, user]);

  if (loading) {
    return (
      <div className="container d-block mx-auto">
        <h1 className="display-5 mt-5">Events</h1>
        <div className="row mt-5 mb-5 bg-dark">
          <div className="col d-flex justify-content-center">
            <img src={Loading} alt="..." />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="mt-4">
        <h1 className="display-3">{data.eventName}</h1>
      </div>
      <div className="mt-5 mb-5 pb-3">
        <section className="eventDetail">
          <img
            src={data.image ? `/api/events/image/${data._id}` : image1}
            className={`card-img-top d-block mx-auto m-3 ${classname}`}
            alt="..."
            style={{ maxWidth: "400px" }}
            onLoad={() => {
              setClassname("view");
              setLoadClass("hide");
            }}
          />
          <img src={Loading} alt="..." className={`mx-auto ${loadclass}`} />
        </section>
        <div className="row mt-5 bg-dark">
          <div className="col-lg-7">
            <EventInformation detail={data} />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-4">
            <EventAbstract
              event={data}
              isOrganiser={isOrganiser}
              user={user}
              registered={registered}
              register={register}
              unregister={unregister}
              regLoading={registrationLoading}
            />
          </div>
        </div>
      </div>
      <Recommendations eventId={id} />
    </div>
  );
};

export default EventDetail;

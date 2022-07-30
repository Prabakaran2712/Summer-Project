import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import SearchList from "./SearchList";
import "./SearchList.css";
const SearchBar = () => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState([]);
  const { token } = useAuthContext();
  const [filteredDetail, setFilteredDetail] = useState(detail);
  const [Search, setSearch] = useState("*");
  const [Focus, setFocus] = useState(false);

  useEffect(() => {
    const fetchDetail = () => {
      axios
        .get("/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setDetail(response.data);
          setFilteredDetail(response.data);
          setLoading(false);
        });
    };
    fetchDetail();
  }, [token]);
  const search = (e) => {
    if (e.target.value.length === 0) {
      setSearch("*");
    } else {
      setSearch(e.target.value);
    }
    setFilteredDetail(
      detail.filter((x) => {
        return (
          Search === "*" || x.eventName.toLowerCase().includes(e.target.value)
        );
      })
    );
  };

  return (
    <div
      className="d-flex flex-column search-container"
      onBlur={() => {
        setTimeout(() => {
          setFocus(false);
        }, 200);
      }}
    >
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search events"
        aria-label="Search"
        onChange={search}
        onFocus={() => {
          setFocus(true);
        }}
      />
      {Focus && (
        <div>
          <SearchList
            setFocus={setFocus}
            details={filteredDetail}
            loading={loading}
            focus={Focus}
          />
        </div>
      )}
    </div>
  );
};
export default SearchBar;
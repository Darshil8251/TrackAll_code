import React from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "./Ordered.css";
import { Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import Searchbar from "../Seachbar";
import Swiggy from "../Image/Swiggy.svg";
import Ubereat from "../Image/Uber_Eats.svg";
import "bootstrap/dist/css/bootstrap.css";
import Spinner from "react-bootstrap/Spinner";
import Zomato from "../Image/Zomato.svg";
import Slider from "../Slider";
import Foodpanda from "../Image/Foodpanda.svg";

function Ordered() {
  const [newOrder, setNewOrder] = useState({});
  const [show, setShow] = useState(false);
  const [time, settime] = useState(10);

  const handleClose = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      "https://trackall.bsite.net/api/order/PutRejectOrder/" +
        newOrder.marketPlaceName +
        "/" +
        newOrder.orderId,
      requestOptions
    );
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const Ref = useRef(null);

  const [loading, setloading] = useState(false);
  // The state for our timer
  const [timer, setTimer] = useState("0:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (minutes > 9 ? minutes : minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("0:60");

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };

  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  const mystyle = {
    margintop: "200px",
    marginleft: "261px",
  };
  const [Details, setDetails] = useState([{}]); //State to render the fetched or Filtered Data
  const [resetdata, setresetdata] = useState([{}]); //To filter The data
  const [currentPage, setcurrentPage] = useState(1); // Use for pagination to set pages
  const [postsPerPage, setpostsPerPage] = useState(5); // set postperpage

  // Use For timer

  const connection = new HubConnectionBuilder()
    .withUrl("https://heyq.bsite.net/signalRServer")
    .build();
  useEffect(() => {
    var s = "71897957-87eb-45c0-8d50-a73c5490f17e";
    connection
      .start()
      .then(() => {
        connection.invoke("Get", s).catch((err) => console.error(err));
        console.log(s);
        console.log("connected");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    connection.on("ReceiveOrder", (data) => {
      handleShow();
      setNewOrder(data);
      clearTimer(getDeadTime());
    });
  }, []);

  // Fetching Data From API
  const FetchData = async () => {
    let res = await fetch(
      "https://heyq.bsite.net/api/api/orderapi/71897957-87eb-45c0-8d50-a73c5490f17e",
      {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    setDetails(data);
    setresetdata(data);
    setloading(true);
  };

  const accept = async() => {
    const accept = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      "https://trackall.bsite.net/api/order/PutAcceptOrder/" +
        newOrder.marketPlaceName +
        "/" +
        newOrder.orderId+"/"+time,
      accept
    );
  
    setShow(false);
  };

  useEffect(() => {
    FetchData();
  }, []);

  // if(loading==false){
  //   return (
  //     <>

  //    <div className="spiner">
  //      <Spinner animation="border"  />

  //    </div>
  //     </>
  //   )
  // }

  //Pagination java script code
  const lastIndex = currentPage * postsPerPage;
  const firstIndex = lastIndex - postsPerPage;
  const currentPosts = Details.slice(firstIndex, lastIndex);

  const numberOfPages = Math.ceil(Details.length / postsPerPage);

  const pageNumbers = [...Array(numberOfPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage !== numberOfPages) setcurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setcurrentPage(currentPage - 1);
  };

  // Image Import

  const image = (supplier) => {
    if (supplier == "Swiggy") return Swiggy;
    if (supplier == "Uber Eats") return Ubereat;
    if (supplier == "Zomato") return Zomato;
    if (supplier == "Food Panda")
      return "https://play-lh.googleusercontent.com/1keEOkk2GrxZpaRH73-vDqpAXhJNU9tbP5mfk82X6YxH8EhnU2JPOb5w1FLUJiqkEg";
  };

  return (
    <>
      <Slider />
      <Searchbar Details={Details} />
      <div className="maincontainer">
        <div>
          <div className="navbar">
            <header>
              <div className="brand">
                <a>Order List</a>
              </div>

              <div className="dropdown">
                <button className="dropbtn">
                  <p className="dropname">Filter by</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    fill="currentColor"
                    className="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                    class="dropicon"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
                <div className="dropdown-content">
                  <a
                    onClick={() => {
                      setDetails(resetdata);
                      setcurrentPage(1);
                    }}
                  >
                    All
                  </a>
                  <a
                    onClick={() => {
                      setDetails(
                        resetdata.filter(
                          (item) => item.marketPlaceName === "Zomato"
                        )
                      );
                      setcurrentPage(1);
                    }}
                  >
                    Zomato
                  </a>
                  <a
                    onClick={() => {
                      setDetails(
                        resetdata.filter(
                          (item) => item.marketPlaceName === "Swiggy"
                        )
                      );
                      setcurrentPage(1);
                    }}
                  >
                    Swiggy
                  </a>
                  <a
                    onClick={() => {
                      setDetails(
                        resetdata.filter(
                          (item) => item.marketPlaceName === "Uber Eats"
                        )
                      );
                      setcurrentPage(1);
                    }}
                  >
                    Uber Eats
                  </a>
                </div>
              </div>

              <div className="dropname2">
                <p className="dropdownname">
                  Entries per page:{" "}
                  <select
                    className="entery_selection"
                    value={postsPerPage}
                    onChange={(e) => {
                      setpostsPerPage(e.target.value);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option>20</option>
                  </select>
                  <div className="20"></div>
                </p>
              </div>

              <nav className="navbarstatus">
                <ul className="ulcss">
                  <li className="statuscss">
                    <p href="/" className="statusbuttonname">
                      Status :
                    </p>
                  </li>
                  <li className="statuscss statuscolor">
                    <a
                      className="statusbutton"
                      onClick={() => setDetails(resetdata)}
                    >
                      All
                    </a>
                  </li>
                  <li className="statuscss statuscolor">
                    <a
                      className="statusbutton"
                      onClick={() =>
                        setDetails(
                          resetdata.filter(
                            (item) =>
                              item.status == "Accepted" ||
                              item.status == "Ready"
                          )
                        )
                      }
                    >
                      Accepted
                    </a>
                  </li>
                  <li className="statuscss statuscolor">
                    <a
                      className="statusbutton"
                      onClick={() =>
                        setDetails(
                          resetdata.filter(
                            (item) => item.status === "Completed"
                          )
                        )
                      }
                    >
                      Completed
                    </a>
                  </li>
                  <li className="statuscss statuscolor">
                    <a
                      className="statusbutton"
                      onClick={() =>
                        setDetails(
                          resetdata.filter(
                            (item) => item.status === "Cancelled"
                          )
                        )
                      }
                    >
                      Cancelled
                    </a>
                  </li>
                </ul>
              </nav>
            </header>
          </div>
          <table id="example" className="tablecss">
            <thead>
              <tr className="trhead">
                <th scope="col">No</th>
                <th scope="col">Order Details</th>
                <th scope="col">Items</th>
                <th scope="col">Total price</th>
                <th scope="col">Delivery Details</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody style={{ marginTop: "100px" }}>
              {currentPosts.map((item, index) => {
                return (
                  <>
                    <tr key={index} className="trborder">
                      <th scope="row">{index + 1}</th>

                      <td className="table_order_details_orderidname">
                        <div
                          className="table_order_details"
                          style={{ marginRight: "-80px" }}
                        >
                          {/* <img
                            className="table_order_details_img"
                            src="logo192.png"
                          />{" "} */}
                          <img
                            className="table_order_details_img"
                            src={image(item.marketPlaceName)}
                            style={{ borderRadius: "12px" }}
                          />
                          &nbsp;&nbsp; &nbsp;
                          {item.customerName}
                          <br />
                          {item.orderId}
                        </div>
                      </td>
                      <td>{item.itemName}</td>
                      <td>&#8377;{item.price}</td>
                      <td>{item.deliveryBoyName}</td>
                      <td>{item.location}</td>
                      <td className="order_status">
                        {item.status}
                        <br /> {item.toPrepare}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Html/css Code  */}
          <nav className="paginationmain">
            <ul
              className="pagination justify-content-center"
              style={{ marginTop: "15px", float: "right" }}
            >
              <li className="page-item">
                <a className="page-link" onClick={prevPage} href="#">
                  &laquo;
                </a>
              </li>
              {pageNumbers.map((pgNumber) => (
                <li
                  key={pgNumber}
                  className={`page-item ${
                    currentPage == pgNumber ? "active" : ""
                  } `}
                >
                  <a
                    onClick={() => setcurrentPage(pgNumber)}
                    className="page-link"
                    href="#"
                  >
                    {pgNumber}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link" onClick={nextPage} href="#">
                  &raquo;
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
          style={{ width: "374px", margin: "auto", borderRadius: "12px" }}
        >
          <div style={{ borderRadius: "3px" }}>
            <div
              style={{
                backgroundColor: "#FBB700",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <Modal.Header>
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    fontWeight: "700",
                    fontSize: "18px",
                  }}
                >
                  Order Alert
                </div>
              </Modal.Header>
            </div>
            <div>
              <Modal.Body>
                <p style={{ textAlign: "center" }}>
                  Orderd From:
                  <span style={{ color: "#E3263F" }}>
                    {newOrder.marketPlaceName}
                  </span>
                </p>
                <hr />

                {/* {newOrder.itemName} = {newOrder.price}
                    <hr></hr>
                    Total = {newOrder.price} */}

                <p style={{ textAlign: "center", lineHeight: "38px" }}>
                  {newOrder.itemName} = {newOrder.price}
                  <br />
                  <div
                    style={{
                      borderBottom: "2px dashed black",
                      width: "214px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  ></div>
                  Total = {newOrder.price}
                  <hr />
                </p>
              </Modal.Body>
            </div>

            <div style={{ textAlign: "center" }}>
              <p>
                Select Preprationtime
                <br />
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Basic mixed styles example"
                >
                  <button
                    type="button"
                    style={{ background: " #FEDE87", borderRadius: "2px" }}
                    onClick={() => {
                      if (time >= 5) {
                        settime(time - 5);
                      }
                    }}
                  >
                    -
                  </button>
                  <button type="button" style={{ background: " #FEDE87" }}>
                    <div>{time}</div>
                  </button>
                  <button
                    type="button"
                    style={{ background: " #FEDE87" }}
                    onClick={() => {
                      settime(time + 5);
                    }}
                  >
                    +
                  </button>
                </div>
              </p>
              <div className="button" style={{ margin: "20px" }}>
                <button
                  className="btn btn-outline-danger"
                  style={{
                    width: "150px",
                    height: "40px",
                  }}
                  onClick={handleClose}
                >
                  Reject
                </button>
                <button
                  className="btn"
                  style={{
                    width: "150px",
                    height: "40px",
                    backgroundColor: "#279500",
                    color: "white",
                  }}
                  onClick={accept}
                >
                  Accept ({timer})
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default Ordered;

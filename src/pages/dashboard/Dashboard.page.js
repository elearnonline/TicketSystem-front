import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { TicketTable } from "../../components/ticket-table/TicketTable.comp";
// import tickets from "../../assets/data/dummy-tickets.json";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";
import { Link } from "react-router-dom";

import { fetchAllTickets } from "../ticket-list/ticketsAction";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);

  const [ticketData, setTicketData] = useState([])
  useEffect(() => {
    async function fetchSearchData() {
      const response = await fetch(`https://vast-castle-36162.herokuapp.com/v1/ticket`, {
        headers: {
          'authorization': JSON.parse(localStorage.getItem('crmSite')).refreshJWT
        }
      })
      const data = await response.json();
      console.log('Line 23', data.result);
      setTicketData(data.result)
    }
    fetchSearchData()
  }, [])


  useEffect(() => {
    if (!ticketData.length) {
      dispatch(fetchAllTickets());
    }
  }, [ticketData, dispatch]);



  console.log('Line 33', ticketData)

  const pendingTickets = ticketData.filter((row) => row.status !== "Closed");
  const totlatTickets = ticketData.length;

  console.log('Line 38', tickets)
  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb page="Dashboard" />
        </Col>
      </Row>
      <Row>
        <Col className="text-center mt-5 mb-2">
          <Link to="/add-ticket">
            <Button
              variant="info"
              style={{ fontSize: "2rem", padding: "10px 30px" }}
            >
              Add New Ticket
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col className="text-center  mb-2">
          <div>Total tickets: {totlatTickets}</div>
          <div>Pending tickets: {pendingTickets.length}</div>
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">Recently Added tickets</Col>
      </Row>
      <hr />

      <Row>
        <Col className="recent-ticket">
          {
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subjects</th>
                  <th>Status</th>
                  <th>Opened Date</th>
                </tr>
              </thead>
              <tbody>
                {ticketData.length > 0 ? (
                  ticketData?.map((row) => (
                    <tr key={row._id}>
                      <td>{row._id}</td>
                      <td>
                        <Link to={`/ticket/${row._id}`}>{row.subject}</Link>
                      </td>
                      <td>{row.status}</td>
                      <td>{row.openAt && new Date(row.openAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No ticket show{" "}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          }

          {/* <TicketTable tickets={ticketData} /> */}
        </Col>
      </Row>
    </Container>
  );
};

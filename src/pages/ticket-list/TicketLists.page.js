import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllTickets } from "./ticketsAction";

import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";

import { Link } from "react-router-dom";

export const TicketLists = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const [ticketData, setTicketData] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    async function fetchSearchData() {
      const response = await fetch(`https://vast-castle-36162.herokuapp.com/v1/ticket`, {
        headers: {
          'authorization': JSON.parse(localStorage.getItem('crmSite')).refreshJWT
        }
      })
      const data = await response.json();
      setTicketData(data.result)
    }
    fetchSearchData()
  }, [])

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value)
  };
  useEffect(() => {
    let newList = [];
    if (search !== '') {
      ticketData.filter((item) => {
        const newData = Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())

        if (newData) {
          newList.push(item)
          setSearchResult(newList)
        } else {
          return setSearchResult(newList)
        }
      })
    }
    else {
      setSearchResult(ticketData);
    }
  }, [ticketData, search,])


  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb page="Ticket Lists" />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Link to="/add-ticket">
            <Button variant="info">Add New Ticket</Button>
          </Link>
        </Col>
        <Col className="text-right">
          <div>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="3">
                  Search:
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    name="searchStr"
                    onChange={handleOnChange}
                    placeholder="Search ..."
                  />
                </Col>
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
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
                {searchResult.length > 0 ? (
                  searchResult?.map((row) => (
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
        </Col>
      </Row>
    </Container>
  );
};

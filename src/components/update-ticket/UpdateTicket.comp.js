import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";

import { replyOnTicket } from "../../pages/ticket-list/ticketsAction";

export const UpdateTicket = ({ _id }) => {
  const dispatch = useDispatch();
  const {
    user: { name },
  } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('https://vast-castle-36162.herokuapp.com/v1/user/profile', {
      headers: {
        'authorization': JSON.parse(localStorage.getItem('crmSite')).refreshJWT
      }
    })
      .then(res => res.json())
      .then(data => setUserName(data.user.name))
      .catch(err => console.log('Line 78', err))

  }, [])
  const handleOnSubmit = (e) => {
    e.preventDefault();

    const msgObj = {
      message,
      sender: userName,
    };

    dispatch(replyOnTicket(_id, msgObj));
    setMessage("");
  };

  return (
    <div>
      <Form onSubmit={handleOnSubmit}>
        <Form.Label>Reply</Form.Label>
        <Form.Text>
          Please reply your message here or update the ticket
        </Form.Text>
        <Form.Control
          value={message}
          onChange={handleOnChange}
          as="textarea"
          row="5"
          name="detail"
        />
        <div className="text-right mt-3 mb-3">
          <Button variant="info" type="submit">
            Reply
          </Button>
        </div>
      </Form>
    </div>
  );
};

UpdateTicket.propTypes = {
  _id: PropTypes.string.isRequired,
};

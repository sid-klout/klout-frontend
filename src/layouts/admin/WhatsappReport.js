import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './custom.css';
import { useSelector } from 'react-redux';

function WhatsappReport(props) {
  const event_id = props.match.params.id;
  const [event, setEvent] = useState([]);
  const [profile, setProfile] = useState([]);
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedTemplate, setSelectedTemplate] = useState('delegate_invitation');
  const [activeCard, setActiveCard] = useState('total_sent_messages'); 
  const authToken = useSelector(state => state.auth.token);
  const [totalMessage, setTotalMessage] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [totalRead, setTotalRead] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);

  useEffect(() => {
    axios.post(`/api/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((res) => {
      if (res.data.status === 200) {
        setProfile(res.data.user);
        console.log(res.data.user.id);
        axios.post(`https://app.klout.club/api/organiser/v1/whatsapp/all-recipt`, {userID: res.data.user.id, eventUUID:event_id, templateName: selectedTemplate} , {
            headers: {
              'Content-Type': `application/json`
            }
          }).then((res) => {
            if (res.data.status) {
                setData(res.data.data);
                setTempData(res.data.data);
                setTotalMessage(res.data.data.length)
                const delivered = res.data.data.filter(item => item.messageID.messageStatus !== "Failed");
                setTotalDelivered(delivered.length);
                const read = res.data.data.filter(item => item.messageID.messageStatus === "Read");
                setTotalRead(read.length)
                const failed = res.data.data.filter(item => item.messageID.messageStatus === "Failed");
                setTotalFailed(failed.length)
            }
          });
      }
    });

  }, [selectedTemplate]);

  useEffect(() => {
    axios.get(`/api/events/${event_id}`).then((res) => {
      if (res.data.status === 200) {
        setEvent(res.data.data);
      }
    });
  }, [event_id]);

  // Dummy data for table
  const tableData = data;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handleCardClick = (card) => {
    let newData = [];
  
    if(card === 'total_delivered_messages'){
      newData = tempData.filter(item => item.messageID && item.messageID.messageStatus !== 'Failed');
    } else if(card === 'total_read_messages'){
      newData = tempData.filter(item => item.messageID && item.messageID.messageStatus === 'Read');
    } else if(card === 'total_failed_messages'){
      newData = tempData.filter(item => item.messageID && item.messageID.messageStatus === 'Failed');
    }else{
      newData = structuredClone(tempData);
      
    }
  
    setData(newData);
    setActiveCard(card);
  };

  // function to convert the date to normal date for the user to read properly
  function normalDateFormat(date){
    const newDate = new Date(date);
    const readableDate = newDate.toLocaleString();
    return readableDate;
  }

  // function to capital the first letter of the name
  function capitalizeFirstLetter(word){
    return word[0].toUpperCase() + word.slice(1);
  }

  return (
    <div className="container">
      <h2 className="my-4">Whatsapp Report</h2>

      {/* Template Buttons */}
      <div className="mb-4">
        <div className="btn-group">
          <button
            className={`btn ${selectedTemplate === 'delegate_invitation' ? 'btn-active' : 'btn-outline-primary'}`}
            style={{ fontWeight: '600' }}
            onClick={() => {setSelectedTemplate('delegate_invitation'); setActiveCard('total_sent_messages')}}
          >
            Invitation 
          </button>
          <button
            className={`btn ${selectedTemplate === 'event_downloadapp' ? 'btn-active' : 'btn-outline-primary'}`}
            style={{ fontWeight: '600' }}
            onClick={() => {setSelectedTemplate('event_downloadapp'); setActiveCard('total_sent_messages')}}
          >
            Reminder
          </button>
          <button
            className={`btn ${selectedTemplate === 'event_reminder_today' ? 'btn-active' : 'btn-outline-primary'}`}
            style={{ fontWeight: '600' }}
            onClick={() => {setSelectedTemplate('event_reminder_today'); setActiveCard('total_sent_messages')}}
          >
            Same Day Invitation
          </button>
        </div>
      </div>

      {/* Status Boxes */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div
            className={`card border-primary clickable-card ${activeCard === 'total_sent_messages' ? 'card-active' : ''}`}
            onClick={() => handleCardClick('total_sent_messages')}
          >
            <div className="card-body text-center">
              <h5 className="card-title">Sent Messages</h5>
              <p className="card-text display-4">{totalMessage}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className={`card border-success clickable-card ${activeCard === 'total_delivered_messages' ? 'card-active' : ''}`}
            onClick={() => handleCardClick('total_delivered_messages')}
          >
            <div className="card-body text-center">
              <h5 className="card-title">Delivered Messages</h5>
              <p className="card-text display-4">{totalDelivered}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className={`card border-info clickable-card ${activeCard === 'total_read_messages' ? 'card-active' : ''}`}
            onClick={() => handleCardClick('total_read_messages')}
          >
            <div className="card-body text-center">
              <h5 className="card-title">Read Messages</h5>
              <p className="card-text display-4">{totalRead}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className={`card border-danger clickable-card ${activeCard === 'total_failed_messages' ? 'card-active' : ''}`}
            onClick={() => handleCardClick('total_failed_messages')}
          >
            <div className="card-body text-center">
              <h5 className="card-title">Failed Messages</h5>
              <p className="card-text display-4">{totalFailed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>S.No</th>
            {/* <th>Event Name</th> */}
            <th>Name</th>
            <th>Phone Number</th>
            <th>Message Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item._id}>
              <td>{index+1}</td>
              {/* <td>{item.eventName}</td> */}
              <td>{item.firstName ? capitalizeFirstLetter(item.firstName) : ""}</td>
              <td>{item.messageID && item.messageID.customerPhoneNumber ? item.messageID.customerPhoneNumber : ""}</td>
              <td>{item.messageID && item.messageID.messageStatus ? item.messageID.messageStatus : ""}</td>
              <td>{item.messageID && item.messageID.timestamp ? normalDateFormat(item.messageID.timestamp) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, pageIndex) => (
            <li
              className={`page-item ${pageIndex + 1 === currentPage ? 'active' : ''}`}
              key={pageIndex + 1}
            >
              <button className="page-link" onClick={() => setCurrentPage(pageIndex + 1)}>
                {pageIndex + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default WhatsappReport;

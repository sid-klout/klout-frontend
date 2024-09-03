import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const data = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Event ${i + 1}`,
  image: 'https://via.placeholder.com/150', // Image size
}));

function AllReports() {
    const authToken = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [events, setEvents] = useState([]);
    const itemsPerPage = 5;


  useEffect(() => {
    axios.post("/api/eventslist", {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
        
      }
    }).then((res) => {
      if (res.data.status === 200) {
        console.log(res.data.data)
        setEvents(res.data.data);
        console.log(events)
      }
      setLoading(false);
    });
  }, []);

  // Calculate the current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className="container">
      <h2 className="my-4">All Reports</h2>
      <div className="row">
        {currentItems.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card">
              <img src={'https:api.klout.club/'+item.image} style={{ height: "180px", objectFit: "cover" }} className="card-img-top" alt={item.name} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <div className="d-flex">
                  <Link
                    to={`/organiser/admin/whatsapp-report/${item.uuid}`}
                    className="btn flex-fill me-2"
                    style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FaWhatsapp size={20} />
                  </Link>
                  <Link
                    // to={``}
                    className="btn flex-fill"
                    style={{ backgroundColor: '#0072C6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FaEnvelope size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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

export default AllReports;

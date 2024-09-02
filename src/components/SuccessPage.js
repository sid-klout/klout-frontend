import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import QrCode from './path-to-your-qr-code-image.jpg'; // Replace with the correct path to your QR code image

const SuccessPage = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-12 text-center">
          <h2>You have successfully checked in.</h2>
          <p>Now Download the Klout Club App, to connect and network with your fellow participants at this event.</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 mb-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.klout.app&pli=1"
            className="download-btn flexbox-center d-block text-center p-3"
            style={{ background: "black", textDecoration: "none", color: "#fff" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="download-btn-icon mb-2">
              <i className="icofont icofont-brand-android-robot" style={{ fontSize: "2rem" }}></i>
            </div>
            <div className="download-btn-text">
              <p style={{ marginBottom: "0.5rem" }}>Available on</p>
              <h4>Android Store</h4>
            </div>
          </a>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <a
            href="https://apps.apple.com/in/app/klout-club/id6475306206"
            className="download-btn flexbox-center d-block text-center p-3"
            style={{ background: "black", textDecoration: "none", color: "#fff" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="download-btn-icon mb-2">
              <i className="icofont icofont-brand-apple" style={{ fontSize: "2rem" }}></i>
            </div>
            <div className="download-btn-text">
              <p style={{ marginBottom: "0.5rem" }}>Available on</p>
              <h4>Apple Store</h4>
            </div>
          </a>
        </div>
      </div>

      {/* <div className="row justify-content-center mt-5">
        <div className="col-lg-6 text-center">
          <h5>Or scan this QR code to download the app</h5>
          <div className="mt-4">
            <img src={QrCode} alt="QR" style={{ width: '200px', height: '200px' }} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SuccessPage;

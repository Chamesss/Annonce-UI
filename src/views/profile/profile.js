import React, { useState } from "react";
import { FaMapMarkerAlt, FaCity, FaPhoneAlt, FaHome, FaBuilding, FaEnvelope, FaUser } from "react-icons/fa";
import { Button } from "react-bootstrap";

function Profile({ userinfo }) {
  const [user, setUser] = useState(userinfo);
  const [message, setMessage] = useState('');

  const handleSendVerification = async (userid, email) => {
    try {
    const response = await fetch(`http://localhost:8080/user/send/${email}/${userid}`, {
      method:"GET"
    })
    const data = await response.json();
    if (data.status === true) {
      setMessage(data.message);
    }
  } catch (error) {
    console.log(error);
  }

  }

  return (
    <div className="container mx-5">
      <h2>My profile</h2>
      {user !== null ? (
        <div className="container d-flex justify-content-center align-items-center py-5">
          <div className="row justify-content-center ">
            <div className="profile-picture border border-2 rounded-circle shadow-lg p-3 mb-1 bg-white rounded" style={{ width: '150px', height: '150px' }}>
              <img src={user.picture} alt="Profile" className="rounded-circle" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="text-center pt-2 fs-5" >
              <span className="badge badge-pill bg-secondary">{user.firstname} {user.lastname}</span>
            </div>
            <div className="px-4 py-1">
              <hr className="my-4" style={{ borderWidth: '4px', fontWeight: 'bold' }} />
              <div className="col-lg-8">
                <div>
                  {user.type === "individual" ? (
                    <div><p><FaHome /><strong> Type: </strong>Individual</p></div>
                  ) : (<div><p><FaBuilding /><strong> Type: </strong>Entreprise</p></div>)}
                  <p><FaPhoneAlt /><strong> Telephone:</strong> +216 {user.tel}</p>
                  <p><FaEnvelope /><strong> E-mail:</strong> {user.email} </p>
                  <p><FaMapMarkerAlt /><strong> Région:</strong> {user.country} </p>
                  <p><FaCity /><strong> Ville:</strong> {user.city}</p>
                  <p><FaMapMarkerAlt /><strong> Rejoint à:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  {user.state ? (
                    <p className="d-flex flex-row"><FaUser /><strong> State: </strong><p className="text text-success"> Account activated </p></p>
                  ) : (<div>
                    <p><FaUser /><strong> State:</strong> Account not activated</p>
                    <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSendVerification(user._id,user.email)}
                    >Request verification</button>
                    {message && <p className="text text-success">{message}</p>}
                  </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (null)}
    </div>
  )
}

export default Profile;
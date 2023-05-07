import React from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const { address } = useParams();

  return (
    <div>
      <h1>Item {address}</h1>
      <p>Welcome to item page {address}!</p>
    </div>
  );
}

export default Profile;
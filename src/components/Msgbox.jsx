import React from 'react';

function Msgbox({ user, name, message }) {
  const isUser = user === name;
  const isAdmin = name === 'Admin';
  console.log(user);

  return (
    <div className="messages mt-3">
      <div className={`msg-container ${isAdmin ? 'admin-msg' : isUser ? 'msg' : 'other-msg'}`}>
        {!isAdmin && <p className={isUser ? 'text-danger fw-bolder text-end me-4' : 'text-success text-start ms-4  fw-bolder '}>{isUser ? 'You' : name}</p>}
        <div className={`message ${isUser ? 'user-msg-bubble fw-bolder  text-end pe-4 b2 fixed-end' :isAdmin? 'b1 text-center ': 'other-msg-bubble text-start  fw-bolder  ps-4 ms-2 b3'}`}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Msgbox;

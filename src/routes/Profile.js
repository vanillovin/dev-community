import React from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import styled from 'styled-components';
import { useUser } from '../context';

const UserContainer = styled.div`
  display: flex;
  border: 1px solid lightgray;
`;

// loading
const Profile = () => {
  const user = useUser();
  // console.log('Profile', user);

  return (
    <div>
      <UserContainer>
        <div>
          <div className="left">
            <div>
              <AiOutlineUser />
            </div>
          </div>
          <div className="right">
            <div>user.name</div>
          </div>
        </div>
      </UserContainer>

      <div>
        <div>my post</div>
      </div>
    </div>
  );
};

export default Profile;

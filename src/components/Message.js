import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  display: flex;
  margin-top: 60px;
  justify-content: center;
`;

const Text = styled.span`
  color: ${(props) => props.color};
  font-weight: bold;
  font-size: 24px;
  letter-spacing: 1px;
`;

const Message = ({ text, color }) => {
  return (
    <Container>
      <Text color={color}>{text}</Text>
    </Container>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Message;

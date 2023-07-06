import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  
.react-select__control {
    border-radius: 25px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    border: 1px solid rgb(214, 214, 214);
    margin-top: 15px;
  }

  @media (max-width: 555px) {
    font-size: 0.89rem;
    height: 30px;
  }
`;

const ResponsiveSelect = (props) => {
    return <StyledSelect {...props} />;
};

export default ResponsiveSelect;
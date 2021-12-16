import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';

export const Background = styled.div`
  background: linear-gradient(#2fbac4, #ffffff);
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
`;
export const Wrapper = styled.div``;
export const BaseBox = styled.div`
  background-color: white;
  padding: 30px;
  margin-top: 35px;
  border-radius: 3px;
`;
export const Title = styled.div`
  font-size: 24px;
  padding: 15px 0;
`;

export const InputContainer = styled.form``;
export const InputLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  width: 100%;
`;
export const Input = styled.input`
  margin-top: 5px;
  width: 100%;
  border: 2px solid #f3f3f3;
  border-radius: 2px;
  height: 25px;
  box-sizing: border-box;
  padding: 15px 10px;
`;

export const TextArea = styled.textarea`
  margin-top: 5px;
  width: 100%;
  border: 2px solid #f3f3f3;
  border-radius: 2px;
  height: 25px;
  box-sizing: border-box;
  height: 100px;
  width: 100%;
  resize: none;
`;

export const InputItem = styled.div`
  margin-bottom: 10px;
`;

export const FindLocation = styled(DaumPostcode)`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  height: 400px;
  padding: 7px;
`;

export const CancelButton = styled.button`
  border: 1px solid #0cb5d9;
  border-radius: 3px;
  margin-top: 12px;
  background-color: white;
  color: #0cb5d9;
  padding: 8px 0px;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? '0.2' : '1')};
  cursor: pointer;
`;

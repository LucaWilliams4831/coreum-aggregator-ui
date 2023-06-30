import React from "react";
import ReactSlider from "react-slider";
import styled from "styled-components";

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 25px;
`;

const StyledThumb = styled.div`
  height: 25px;
  line-height: 25px;
  width: 25px;
  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  cursor: grab;
`;

const Thumb = (props, state) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
);

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props) =>
    props.index === 0 ? "#ff0" :
    props.index === 1 ? "#f00" :
     props.index === 2 ? "#0f0" :
      "#00f"};
  border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;
const SSilder = ({onChangeValue}) =>{
  return (
    
  <StyledSlider
    defaultValue={[25, 50, 75]}
    renderTrack={Track}
    renderThumb={Thumb}
    onChange={(value) => {onChangeValue(value)}}
  />
)
}
export default SSilder;

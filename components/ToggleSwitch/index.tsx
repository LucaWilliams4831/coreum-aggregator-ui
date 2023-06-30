const ToggleSwitch = ({ toggle, setToggle }) => {
  return (
    <div className={`mode-toggle noselect ${toggle ? 'dark' : ''}`} onClick={() => setToggle(!toggle)}>
      <div className="toggle-switch"></div>
    </div>
  )
}

export default ToggleSwitch

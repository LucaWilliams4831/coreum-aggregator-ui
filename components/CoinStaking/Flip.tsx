import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import StarryGalaxy from '../StarryGalaxy.js';

import SSilder from '../Layout/SSilder';
import Select from "react-select";
import { useSigningClient } from '../../contexts/cosmwasm'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import Slider from '@mui/material/Slider';
import GradeIcon from '@mui/icons-material/Grade.js';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined.js';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined.js';
import TwitterIcon from '@mui/icons-material/Twitter.js';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined.js';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from "@material-ui/core/styles";
import Link from 'next/link.js';
import Backdrop from '@mui/material/Backdrop';


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      // Default transform is "translate(14px, 20px) scale(1)""
      // This lines up the label with the initial cursor position in the input
      // after changing its padding-left.
      transform: "translate(20px, 16px) scale(1);"
    },
    "&.Mui-focused .MuiInputLabel-outlined": {
      color: "white"
    }
  },
  inputRoot: {
    color: "white",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 20
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white"
    }
  },
  paper: {
    backgroundColor: "#303030",
    color: "white",
    marginLeft: "5%",
    width: "90%",
    padding: "10px"
  }
}));

const apyLists = [
  "100% @ 2 year stake",
  "40% @ 1 year",
  "20% @ 6 month",
  "10% @ 30 days"
];

const Flip = () => {

  const [loadingView, setLoadingView] = useState(false);
  const [rocketView, setRocketView] = useState(false);

  const hideLoading = () => {
    setLoadingView(false);
  };

  const hideRocket = () => {
    setRocketView(false);
  }

  const classes = useStyles();

  const {
    walletAddress,
    signingClient,
    executeStake,
    executeUnStake,
    executeReward,
    connectWallet,
    disconnect,
    loading,
    getConfig,
    isAdmin,
    getBalances,
    nativeBalanceStr,
    getHoleAmount
  } = useSigningClient();

  //Work Variables

  const [apyValue, setApyValue] = useState(apyLists[0]);

  const [level, setLevel] = useState("");

  const [artistValue, setArtistValue] = useState(25);
  const [burnValue, setBurnValue] = useState(25);
  const [charityValue, setCharityValue] = useState(25);
  const [myValue, setMyValue] = useState(25);

  const onChangeSliderValue = (value_, sliderNo_) => {
    console.log("onChangeSliderValue log - 1", value_, sliderNo_);

    let _value_1 = artistValue;
    let _value_2 = burnValue;
    let _value_3 = charityValue;
    let _value_4 = myValue;

    if (sliderNo_ === 1) {
      _value_1 = artistValue;
      _value_2 = burnValue;
      _value_3 = charityValue;
      _value_4 = myValue;
    } else if (sliderNo_ === 2) {
      _value_1 = burnValue;
      _value_2 = charityValue;
      _value_3 = myValue;
      _value_4 = artistValue;
    } else if (sliderNo_ === 3) {
      _value_1 = charityValue;
      _value_2 = myValue;
      _value_3 = artistValue;
      _value_4 = burnValue;
    } else if (sliderNo_ === 4) {
      _value_1 = myValue;
      _value_2 = artistValue;
      _value_3 = burnValue;
      _value_4 = charityValue;
    }

    _value_1 = value_;
    _value_2 = 100 - _value_1 - _value_3 - _value_4;

    if (_value_2 < 0) {
      _value_3 += _value_2;
      _value_2 = 0;
    }

    if (_value_2 > 100) {
      _value_3 += _value_2 - 100;
      _value_2 = 100;
    }

    if (_value_3 < 0) {
      _value_4 += _value_3;
      _value_3 = 0;
    }

    if (_value_3 > 100) {
      _value_4 += _value_3 - 100;
      _value_3 = 100;
    }

    if (sliderNo_ === 1) {
      setArtistValue(_value_1);
      setBurnValue(_value_2);
      setCharityValue(_value_3);
      setMyValue(_value_4);
    } else if (sliderNo_ === 2) {
      setBurnValue(_value_1);
      setCharityValue(_value_2);
      setMyValue(_value_3);
      setArtistValue(_value_4);
    } else if (sliderNo_ === 3) {
      setCharityValue(_value_1);
      setMyValue(_value_2);
      setArtistValue(_value_3);
      setBurnValue(_value_4);
    } else if (sliderNo_ === 4) {
      setMyValue(_value_1);
      setArtistValue(_value_2);
      setBurnValue(_value_3);
      setCharityValue(_value_4);
    }

  }

  const handleStake = async (event: MouseEvent<HTMLElement>) => {

    if (!signingClient || walletAddress.length === 0) {
      console.log("luca wallet not connected")
      NotificationManager.error('Please connect wallet first')

      return
    }


    setLoadingView(true);
    event.preventDefault()

    const _index = apyLists.findIndex((value) => value === apyValue);
    await executeStake(parseInt(level), _index);
    setLoadingView(false);
  }
  const handleUnStake = async (event: MouseEvent<HTMLElement>) => {

    if (!signingClient || walletAddress.length === 0) {
      NotificationManager.error('Please connect wallet first')
      return
    }
    setLoadingView(true);
    event.preventDefault()
    await executeUnStake()
    setLoadingView(false);
  }
  const handleReward = async (event: MouseEvent<HTMLElement>) => {


    if (!signingClient || walletAddress.length === 0) {
      NotificationManager.error('Please connect wallet first')
      return
    }
    setLoadingView(true);
    event.preventDefault()
    let _tempSliderValue = [];
    _tempSliderValue.push(artistValue);
    _tempSliderValue.push(artistValue + burnValue);
    _tempSliderValue.push(artistValue + burnValue + charityValue);
    await executeReward(_tempSliderValue)
    setLoadingView(false);
  }

  const [sliderValue, setSliderValue] = useState([25, 50, 75]);

  const onChangeValue = (value) => {
    console.log("onChangeValue log - 1 : ", value);
    setSliderValue(value);
  }

  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet(false)
    } else {
      disconnect()
    }
  }

  const selectMaxAmount = async () => {
    const maxAmount = await getHoleAmount();
    setLevel(maxAmount);
    console.log("selectMaxAmount log - 1 ", maxAmount);
  }

  return (
    <>
      <div>
        <div className="staking-navbar"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "20px auto 0",
            width: "100vw",
            maxWidth: "1400px",
            padding: "0 20px"
          }}>
          <Link href="/">
            <img alt="" src="../images/logo10.png" style={{ width: "120px", cursor: "pointer" }} />
          </Link>
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Link href="https://blackholedrops.app/">
              <p style={{ color: "white", margin: "0", fontSize: "18px", fontWeight: "700", cursor: "pointer" }}>Drops</p>
            </Link>
            <Link href="/">
              <p style={{ color: "white", margin: "0 0 0 50px", fontSize: "18px", fontWeight: "700", cursor: "pointer" }}>Staking</p>
            </Link>
          </div>
          <div>
            <Link href="https://twitter.com/BlackHoleLLC">
              <TwitterIcon style={{ color: "white", fontSize: "32px", cursor: "pointer" }} />
            </Link>
            <Link href="https://discord.com/invite/pY6cj2vNJD">
              <img alt="" src="../images/Discord-Logo-White.png" style={{ width: "32px", height: "32px", marginLeft: "10px", cursor: "pointer" }} />
            </Link>
            <Link href="https://t.me/HoleChat">
              <img alt="" src="../images/telegram2.png" style={{ width: "32px", height: "32px", marginLeft: "10px", cursor: "pointer" }} />
            </Link>
          </div>
        </div>
        <StarryGalaxy />
        <div className='container blackhole-main-wrapper'>
          <div className='row'>
            <div className="field-set" style={{ marginTop: 20 }} >
              <Button className='wallet-connect'
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid white",
                  width: "100%",
                  height: "42px",
                  color: "white",
                  margin: "20px 0 50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  padding: "0 20px"
                }}
                onClick={handleConnect}>
                <AccountBalanceWalletOutlinedIcon />
                <p style={{
                  margin: "5px 10px 0",
                  fontSize: "14px",
                  color: "white"
                }}>
                  {walletAddress ? walletAddress.substring(0, 12) + "..." + walletAddress.substring(walletAddress.length - 6, walletAddress.length) : 'Connect Wallet'}
                </p>
              </Button>
            </div>
            <div className='trade-cryptocurrency-box col-lg-12 col-md-12'
              style={{
                padding: "40px",
                backgroundColor: "#212428",
                borderRadius: "5px",
                opacity: "0.9",
                display: "flex",
                flexDirection: "row",
                position: "relative"
              }}>
              <div className='col-lg-6 col-md-12' style={{ padding: "0 25px 0 0" }}>
                <div className='currency-selection'>
                  <FormControl fullWidth variant="standard" sx={{ minWidth: 250 }}>
                    <h4 style={{ color: "white" }}>Hole staking amount</h4>
                    <input type="text"
                      id="demo-simple-select-standard"
                      defaultValue={1}
                      value={level}
                      placeholder={"Amount"}
                      onChange={(event) => {
                        setLevel(event.target.value.toString())
                      }}
                      style={{
                        marginTop: "50px",
                        width: "100%",
                        backgroundColor: "transparent",
                        borderRadius: "32px",
                        height: "48px",
                        fontSize: "18px",
                        padding: "5px 20px",
                        color: "grey"
                      }}
                    />
                    <Button className="amount-max-button" variant="outlined" style={{ borderColor: "white", cursor: "pointer" }} onClick={selectMaxAmount}>Max</Button>
                  </FormControl>
                </div>
                <Autocomplete
                  disablePortal
                  className='apys-select-combo'
                  classes={classes}
                  options={apyLists}
                  value={apyValue}
                  onChange={(event, newValue) => {
                    setApyValue(newValue);
                  }}
                  sx={{ width: "100%" }}
                  renderInput={(params) => <TextField {...params} label="APYs" />}
                />
                <div className="staking-panel" style={{ marginTop: "132px", position: 'relative', width: "48%", float: "left" }} >
                  <Button style={{ backgroundColor: "#ece698", width: "100%", height: "48px", color: "black !important", padding: "5px", borderRadius: "32px" }}
                    onClick={handleStake}>
                    <GradeIcon />
                    <p style={{
                      margin: "3px 5px 0",
                      fontSize: "14px",
                      color: "black !important"
                    }}>Stake</p>
                  </Button>
                </div>
                <div className="staking-panel" style={{ marginTop: "132px", width: "48%", marginLeft: "4%", float: "right" }} >
                  <Button style={{ backgroundColor: "#ece698", width: "100%", height: "48px", color: "black !important", padding: "5px", borderRadius: "32px" }}
                    onClick={handleUnStake}>
                    <ReplyOutlinedIcon />
                    <p style={{
                      margin: "3px 5px 0",
                      fontSize: "14px",
                      color: "black !important"
                    }}>Unstake</p>
                  </Button>
                </div>
              </div>
              <div style={{
                backgroundColor: "grey",
                width: "2px",
                height: "90%",
                top: "5%",
                left: "calc(50% - 1px)"
              }} />
              <div className='col-lg-6 col-md-12' style={{ padding: "0 0 0 25px" }}>
                <div className="value-slider artist-value-slider" style={{ marginTop: 30 }} >
                  <p>Artist Wallet :</p>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <Slider valueLabelDisplay="on" value={artistValue} defaultValue={25} aria-label="Default" onChange={(event, value) => onChangeSliderValue(value, 1)} />
                    <Button variant="outlined" onClick={() => onChangeSliderValue(100, 1)}>Max</Button>
                  </div>
                </div>
                <div className="value-slider burn-value-slider" style={{ marginTop: 5 }} >
                  <p>Burn Wallet :</p>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <Slider valueLabelDisplay="on" value={burnValue} defaultValue={25} aria-label="Default" onChange={(event, value) => onChangeSliderValue(value, 2)} />
                    <Button variant="outlined" onClick={() => onChangeSliderValue(100, 2)}>Max</Button>
                  </div>
                </div>
                <div className="value-slider charity-value-slider" style={{ marginTop: 5 }} >
                  <p>Charity Wallet :</p>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <Slider valueLabelDisplay="on" value={charityValue} defaultValue={25} aria-label="Default" onChange={(event, value) => onChangeSliderValue(value, 3)} />
                    <Button variant="outlined" onClick={() => onChangeSliderValue(100, 3)}>Max</Button>
                  </div>
                </div>
                <div className="value-slider my-value-slider" style={{ marginTop: 5 }} >
                  <p>My Wallet :</p>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <Slider valueLabelDisplay="on" value={myValue} defaultValue={25} aria-label="Default" onChange={(event, value) => onChangeSliderValue(value, 4)} />
                    <Button variant="outlined" onClick={() => onChangeSliderValue(100, 4)}>Max</Button>
                  </div>
                </div>
                <div className="staking-panel" style={{ marginTop: "40px" }} >
                  <Button style={{ backgroundColor: "#ece698", width: "100%", height: "48px", color: "black !important", padding: "5px", borderRadius: "32px" }}
                    onClick={handleReward}>
                    <PaidOutlinedIcon />
                    <p style={{
                      margin: "3px 5px 0",
                      fontSize: "14px",
                      color: "black !important"
                    }}>Claim Reward</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingView}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={lodingView}
        // onClick={hideLoading}
        >
          <img alt="..." src="../images/stake/loading.gif" />
        </Backdrop>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={rocketView}
        // onClick={hideRocket}
        >
          <img className={rocketView ? 'stake-rocket rocket-animation' : 'stake-rocket'} alt="..." src="../images/stake/rocket.gif" />
        </Backdrop> */}
        <NotificationContainer />
      </div>
    </>
  );
};

export default Flip;

import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'
import TextField from '@mui/material/TextField'
import {NotificationContainer, NotificationManager} from 'react-notifications'
import 'react-notifications/lib/notifications.css'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useSigningClient } from '../../contexts/cosmwasm'
import { fromBase64, toBase64 } from '@cosmjs/encoding'
import {
    convertMicroDenomToDenom, 
    convertDenomToMicroDenom,
    convertFromMicroDenom
  } from '../../util/conversion'
const Admin = () => {

  const { 
    walletAddress,
    signingClient,
    executeRemoveTreasury,
    getConfig,
    config

  } = useSigningClient()

  //Work Variables
  
  const [level, setLevel] = useState(1)
  const [fetchAmount, setFetchAmount] = useState(0)

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0)
      return
    getConfig()
  }, [walletAddress, signingClient, ])



  const handleSubmit = async (event: MouseEvent<HTMLElement>) => {
    if (!signingClient || walletAddress.length === 0) {
      NotificationManager.error('Please connect wallet first')  
      return
    }
    event.preventDefault()
    executeRemoveTreasury(fetchAmount)
  }

  return (
    <>
      <div className='ptb-100'>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-lg-6 col-md-12'>
              <div className=''>
                <h1>
                  <span>Treasury Amount <br/>{convertMicroDenomToDenom(config.treasury_amount)} JUNO</span>
                </h1>
                
              </div>
            </div>
            <div className='col-lg-6 col-md-12'>
              <div className='trade-cryptocurrency-box'>
                
                <div className='currency-selection'>
                    <FormControl fullWidth variant="standard" sx={{ m: 1, minWidth: 250 }}>
                        <h4>Hole amount</h4>
                        <p/>
                        <TextField fullWidth type="number" 
                            variant="standard" 
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min:0 }} 
                            value={fetchAmount}
                            onChange={(e) => {
                                setFetchAmount(Number(e.target.value))
                                
                            }}
                            error={fetchAmount==0}
                        />
                        
                    </FormControl>
                </div>

                <div className="row col-md-12">
                
                    
                    
                </div>
                <button type='submit'
                onClick={handleSubmit}
                >
                  <i className='bx bxs-hand-right'></i> Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Admin;

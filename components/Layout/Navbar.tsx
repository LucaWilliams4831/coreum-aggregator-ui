import React, { useState, useEffect } from 'react';
import Link from '../../util/ActiveLink';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import styled from 'styled-components'
import { useSigningClient } from '../../contexts/cosmwasm'
import ToggleSwitch from '../ToggleSwitch'

import { ToggleContext } from './Layout'
import { useContext } from 'react'
import ThemeContext from '../../contexts/ThemeContext'

const NavLink = styled.a`
  white-space: nowrap;
  color: var(--mainColor) !important;
  cursor: pointer;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-right: 20 !important;
  font-size: 25px !important;
  line-height: 28px !important;
  padding-left: unset !important;
  padding-right: unset !important;
  floating: center;
  padding-left: unset !important;
  padding-right: unset !important;
`

const Navbar = ({ toggle, setToggle }) => {

  const {
    walletAddress,
    connectWallet,
    signingClient,
    disconnect,
    loading,
    getConfig,
    isAdmin,
    getBalances,
    nativeBalanceStr,
  } = useSigningClient()

  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet(false)
    } else {
      disconnect()
    }
  }

  useEffect(() => {
    let account = localStorage.getItem("address")
    if (account != null) {
      connectWallet(true)
    }
  }, [])

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0)
      return
    getConfig()
    getBalances()
  }, [walletAddress, signingClient,])

  const [showMenu, setshowMenu] = useState(false);
  const toggleMenu = () => {
    setshowMenu(!showMenu)
  };
  useEffect(() => {
    let elementId = document.getElementById('navbar');
    document.addEventListener('scroll', () => {
      if (window.scrollY > 170) {
        elementId.classList.add('is-sticky');
      } else {
        elementId.classList.remove('is-sticky');
      }
    });
    window.scrollTo(0, 0);
  }, []);



  const { setTheme, changeTheme } = useContext(ThemeContext)
  useEffect(() => {
    setTheme('primary')
    return () => changeTheme('theme1')
  }, [])

  useEffect(() => {
    toggle ? changeTheme('primary') : changeTheme('theme1')
  }, [toggle])
  //Work Variables

  return (
    <>
      <NotificationContainer />
      <div id='navbar' className='navbar-area'>
        <div className='raimo-responsive-nav'>
          <div className='container'>
            <div className='raimo-responsive-menu'>
              {/* <div onClick={() => toggleMenu()} className='hamburger-menu'>
                {showMenu ? (
                  <i className='bx bx-x'></i>
                ) : (
                  <i className='bx bx-menu'></i>
                )}
              </div>               */}
            </div>
          </div>
        </div>
        <nav className={'show navbar navbar-expand-md navbar-light'}>
          <div className='container'>
            <Link className="flex" href='/'>
              <div className="d-flex flex-row align-items-center" >
              </div>
            </Link>
            <div className='collapse navbar-collapse mean-menu'>

              <ul className='navbar-nav'>
                {!isAdmin ? <></> :
                  <li className='nav-item'>
                    <Link href='/adminview' activeClassName='active'>
                      <NavLink className='nav-link'>Admin</NavLink>
                    </Link>
                  </li>
                }
              </ul>
              <div className='others-option'>
                <div className='d-flex align-items-center p-5'>
                  {/* <ToggleSwitch toggle={toggle} setToggle={setToggle} /> */}
                  {/* {walletAddress.length == 0 ? <></> :
                    <div className='banner-wrapper-content'>
                      <span className="sub-title ms-2" style={{ "marginBottom": "0px", "fontSize": "16px" }}>
                        {nativeBalanceStr}
                      </span>
                    </div>
                  } */}
                  <i className={loading ? 'bx bx-loader bx-spin bx-md' : ''}></i>
                  <div className="flex flex-grow lg:flex-grow-0 max-w-full ms-2">
                    <button
                      className="block default-btn w-full max-w-full truncate"
                      onClick={handleConnect}
                    >
                      <i className='bx bxs-contact'></i>
                      {walletAddress ? walletAddress.substring(0, 12) + "..." + walletAddress.substring(walletAddress.length - 6, walletAddress.length) : 'Connect Wallet'}
                    </button>
                  </div>
                  {/* <div className='option-item'>
                    {walletAddress.length == 0 ?
                      <Link href='https://keplr.app/' activeClassName='active'>
                        <a className='login-btn'>
                          <i className='bx bxs-error'></i> no Keplr?
                        </a>
                      </Link> : <></>
                    }
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

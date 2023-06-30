import React, { useEffect, useState } from "react";

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WalletIcon from '@mui/icons-material/Wallet';
import TwitterIcon from '@mui/icons-material/Twitter';
import DiamondIcon from '@mui/icons-material/Diamond';
import Avatar from '@mui/material/Avatar';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';

import { createClient } from '@supabase/supabase-js';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

import axios from "axios";

const supabase = createClient(
    'https://qoufvvgorapeyyocgkpc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdWZ2dmdvcmFwZXl5b2Nna3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzEyMTg5NDgsImV4cCI6MTk4Njc5NDk0OH0.oJMDZA1SiOkzjOkiu2s8HDXOdDLf7vvw5YP2YGvQeJQ'
)

const drawerWidth = 240;

const COMMUNITY_SERIAL_NUM = 2;
const AAA_METAHUAHUA_SERIAL_NUM = 3;
const TORIPUNKS_SERIAL_NUM = 5;
const CYBERHUAHUA_SERIAL_NUM = 7;
const HUAHUAPUNKS_SERIAL_NUM = 11;

const QUEST_PAGE_NO = 1;
const LEADERBOARD_PAGE_NO = 2;
const ACCOUNT_PAGE_NO = 3;

const SERVER_URL = 'http://95.216.88.188';

const QUEST_TYPE_COMMIT = 'commit';
const QUEST_TYPE_AAA = 'aaa';
const QUEST_TYPE_TORI = 'tori';
const QUEST_TYPE_CYBER = 'cyber';
const QUEST_TYPE_HUA = 'hua';

const LEVEL_XP = 1000;

interface Props {
    window?: () => Window;
}

export default function Home(props: Props) {
    const { window } = props;

    const [userLoginFlag, setUserLoginFlag] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [dbUserInfo, setDbUserInfo] = useState({});

    const [mobileOpen, setMobileOpen] = useState(false);

    const [currentPageNo, setCurrentPageNo] = useState(QUEST_PAGE_NO);

    const [selectedQuestType, setSelectedQuestType] = useState(COMMUNITY_SERIAL_NUM * AAA_METAHUAHUA_SERIAL_NUM * TORIPUNKS_SERIAL_NUM * CYBERHUAHUA_SERIAL_NUM * HUAHUAPUNKS_SERIAL_NUM);

    const [open, setOpen] = React.useState(false);

    const [selectedQuestInfo, setSelectedQuestInfo] = useState({});

    const handleClickOpen = (item) => {
        console.log('handleClickOpen log - 1 : ', item);
        setSelectedQuestInfo(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getQuests();
    }, []);

    useEffect(() => {
        if (userLoginFlag) {
            console.log('pre - getUserInfo log - 1 : ', userInfo);
            getUserInfo(userInfo.user_metadata);
        }
    }, [userInfo, userLoginFlag]);

    const getUserInfo = async (info) => {
        console.log('getUserInfo log - 1 : ');
        const user = await getInfoResponse(SERVER_URL + '/api/user/get_user_info?'
            + 'avatarUrl=' + btoa(info.avatar_url)
            + '&fullName=' + btoa(info.full_name)
            + '&name=' + btoa(info.name)
        );
        if (!user || !user.data.result) {
            alert("Something wrong with server!");
            return;
        }
        console.log('getUserInfo log - 2 : ', user.data.data);

        setDbUserInfo(user.data.data);
    }

    const getQuests = async () => {
        console.log('getQuests log - 1 : ');
        const quests = await getInfoResponse(SERVER_URL + '/api/quests/get_all_quests');
        console.log('getQuests log - 2 : ', quests);

        if (!quests || !quests.data.result) {
            setCommunityQuests([]);
        }

        if (!quests || !quests.data.result) {
            setCommunityQuests([]);
            setAaaQuests([]);
            setToripunksQuests([]);
            setCyberQuests([]);
            setHuahuapunksQuests([]);
            setLeaderboardInfo([]);
        }

        const questInfo = quests.data.data;
        let tempCommunityQuests = [];
        let tempAaaQuests = [];
        let tempToripunksQuests = [];
        let tempCyberQuests = [];
        let tempHuahuapunksQuests = [];

        for (let i = 0; i < questInfo.length; i++) {
            if (questInfo[i].type === QUEST_TYPE_COMMIT) {
                tempCommunityQuests.push({
                    title: questInfo[i].title,
                    contents: questInfo[i].detail,
                    xp: questInfo[i].reward,
                    count: "ONCE",
                    locked: false
                });
            } else if (questInfo[i].type === QUEST_TYPE_AAA) {
                tempAaaQuests.push({
                    title: questInfo[i].title,
                    contents: questInfo[i].detail,
                    xp: questInfo[i].reward,
                    count: "ONCE",
                    locked: false
                });
            } else if (questInfo[i].type === QUEST_TYPE_TORI) {
                tempToripunksQuests.push({
                    title: questInfo[i].title,
                    contents: questInfo[i].detail,
                    xp: questInfo[i].reward,
                    count: "ONCE",
                    locked: false
                });
            } else if (questInfo[i].type === QUEST_TYPE_CYBER) {
                tempCyberQuests.push({
                    title: questInfo[i].title,
                    contents: questInfo[i].detail,
                    xp: questInfo[i].reward,
                    count: "ONCE",
                    locked: false
                });
            } else if (questInfo[i].type === QUEST_TYPE_HUA) {
                tempHuahuapunksQuests.push({
                    title: questInfo[i].title,
                    contents: questInfo[i].detail,
                    xp: questInfo[i].reward,
                    count: "ONCE",
                    locked: false
                });
            }
        }

        setCommunityQuests(tempCommunityQuests);
        setAaaQuests(tempAaaQuests);
        setToripunksQuests(tempToripunksQuests);
        setCyberQuests(tempCyberQuests);
        setHuahuapunksQuests(tempHuahuapunksQuests);
    }

    const getInfoResponse = async (url) => {
        const result = await axios({
            method: 'get',
            url: url,
            headers: {}
        });

        console.log('getInfoResponse log - 1 : ', result);
        return result;
    }

    const onClickLeaderboard = async () => {
        console.log('onClickLeaderboard log - 1 ');
        setCurrentPageNo(LEADERBOARD_PAGE_NO);
        const user = await getInfoResponse(SERVER_URL + '/api/user/get_all');
        if (!user || !user.data.result) {
            alert("Something wrong with server!");
            return;
        }
        console.log('onClickLeaderboard log - 2 : ', user.data.data);

        setLeaderboardInfo(user.data.data);
    }

    const onClickLeaderboardItem = async (item) => {
        setCurrentPageNo(ACCOUNT_PAGE_NO);
        setSelectedLeaderboardInfo(item);
    }

    const [communityQuests, setCommunityQuests] = useState([]);
    const [aaaQuests, setAaaQuests] = useState([]);
    const [toripunksQuests, setToripunksQuests] = useState([]);
    const [cyberQuests, setCyberQuests] = useState([]);
    const [huahuapunksQuests, setHuahuapunksQuests] = useState([]);

    const [leaderboardInfo, setLeaderboardInfo] = useState([]);
    const [selectedLeaderboardInfo, setSelectedLeaderboardInfo] = useState({});

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    const onClickClaimBtn = async (xp) => {
        console.log('onClickClaimBtn log - 1 ');
        const user = await getInfoResponse(SERVER_URL + '/api/user/claim_xp?'
            + '&name=' + btoa(dbUserInfo.name)
            + '&xp=' + btoa(xp)
        );
        if (!user || !user.data.result) {
            alert("Something wrong with server!");
            return;
        }
        console.log('onClickClaimBtn log - 2 : ', user.data.data);
        setDbUserInfo(user.data.data);
        setOpen(false);
    }

    const onClickSelectQuestTypeBtn = (num) => {
        let currentValue = selectedQuestType;
        if (currentValue % num === 0) {
            setSelectedQuestType(currentValue / num);
            return;
        }
        setSelectedQuestType(currentValue * num);
    }

    supabase.auth.onAuthStateChange(async (event) => {
        if (event !== 'SIGNED_OUT') {
            console.log("Connection successful!");
            getUserData();
        } else {
            console.log("Connection failed!");
            setUserLoginFlag(false);
        }
    });

    const getUserData = async () => {
        console.log('getUserData log - 1');
        await supabase.auth.getUser().then((value) => {
            if (value.data?.user) {
                console.log('getUserData log - 2 : ', value.data.user);
                setUserInfo(value.data.user);
                setUserLoginFlag(true);
            }
        });
    }

    const signOutUser = async () => {
        const { error } = await supabase.auth.signOut();
        setUserInfo({});
        setUserLoginFlag(false);
    }

    const drawer = (
        <div>
            <Toolbar
                style={{
                    backgroundColor: "#181821",
                    borderBottom: "1px solid #ffffff3d",
                    paddingLeft: "20px",
                    minHeight: '76px'
                }}>
                <img alt="" src="images/aggregator/logo.png" />
            </Toolbar>
            <Divider />
            <List
                style={{
                    padding: "10px"
                }}>
                {
                    userLoginFlag &&
                    <ListItemButton sx={{
                        width: 'calc(100% - 10px)',
                        margin: '5px 5px 15px 5px',
                        padding: '10px',
                        borderRadius: '20px',
                        border: '1px solid #1ce9c3',
                        backgroundColor: '#1ce9c310',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Avatar alt={userInfo.user_metadata.full_name}
                            src={userInfo.user_metadata.avatar_url}
                            sx={{
                                cursor: "pointer",
                                width: 56,
                                height: 56
                            }}
                            onClick={() => { signOutUser() }} />
                        <div style={{
                            width: '120px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <p style={{
                                color: 'white',
                                margin: 0,
                                fontSize: '18px'
                            }}>{userInfo.user_metadata.full_name}</p>
                            <BorderLinearProgress variant="determinate" value={parseInt(dbUserInfo.xp % LEVEL_XP / 10)}
                                sx={{
                                    height: 5,
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#1ce9c3'
                                    }
                                }} />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <p style={{
                                    color: '#1ce9c3',
                                    margin: 0
                                }}>0%</p>
                                <p style={{
                                    color: '#1ce9c3',
                                    margin: 0
                                }}>lvl{parseInt(dbUserInfo.xp / LEVEL_XP) + 1}</p>
                            </div>
                        </div>
                    </ListItemButton>
                }
                <ListItemButton
                    onClick={() => { setCurrentPageNo(QUEST_PAGE_NO) }}
                    style={{
                        color: "white",
                        padding: "5px 20px",
                        backgroundColor: `${currentPageNo === QUEST_PAGE_NO ? "#ffffff0f" : "transparent"}`,
                        borderRadius: "10px"
                    }}>
                    <ListItemIcon
                        style={{
                            color: `${currentPageNo === QUEST_PAGE_NO ? "#1ce9c3" : "white"}`,
                        }}>
                        <BoltOutlinedIcon
                            style={{
                                width: "32px",
                                height: "32px"
                            }} />
                    </ListItemIcon>
                    <p
                        style={{
                            fontSize: "18px",
                            margin: "0",
                            padding: "0",
                            color: `${currentPageNo === QUEST_PAGE_NO ? "#1ce9c3" : "white"}`,
                            fontWeight: "700"
                        }}>Quests</p>
                </ListItemButton>
                <ListItemButton
                    onClick={() => onClickLeaderboard()}
                    style={{
                        color: "white",
                        padding: "5px 20px",
                        backgroundColor: `${currentPageNo === LEADERBOARD_PAGE_NO ? "#ffffff0f" : "transparent"}`,
                        borderRadius: "10px"
                    }}>
                    <ListItemIcon
                        style={{
                            color: `${currentPageNo === LEADERBOARD_PAGE_NO ? "#1ce9c3" : "white"}`,
                        }}>
                        <LeaderboardOutlinedIcon
                            style={{
                                width: "32px",
                                height: "32px"
                            }} />
                    </ListItemIcon>
                    <p
                        style={{
                            fontSize: "18px",
                            margin: "0",
                            padding: "0",
                            color: `${currentPageNo === LEADERBOARD_PAGE_NO ? "#1ce9c3" : "white"}`,
                            fontWeight: "700"
                        }}>Leaderboard</p>
                </ListItemButton>
            </List>
        </div >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{
            display: 'flex',
            backgroundColor: '#181821f0'
        }}>
            <div style={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url(./images/noise.gif)',
                zIndex: '-1'
                // opacity: '.05'
            }} />
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    height: '76px',
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar
                    style={{
                        backgroundColor: "#181821",
                        borderBottom: "1px solid #ffffff3d",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "none",
                        zIndex: "1",
                        minHeight: '76px'
                    }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div></div>
                    {
                        !userLoginFlag ?
                            <>
                                <Auth
                                    supabaseClient={supabase}
                                    appearance={{ theme: ThemeSupa }}
                                    theme='dark'
                                    onlyThirdPartyProviders={true} // hide email login
                                    providers={['discord']}
                                />
                            </>
                            :
                            <>
                                <Avatar alt={userInfo.user_metadata.full_name}
                                    src={userInfo.user_metadata.avatar_url}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => { signOutUser() }} />
                            </>
                    }
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    border: "none",
                    height: "100vh",
                    backgroundColor: "transparent"
                }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: "transparent", boxShadow: "none" },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: "transparent", border: "none" },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100vw - ${drawerWidth}px)` },
                    borderLeft: "1px solid #ffffff3d"
                }}
            >
                <Toolbar />
                {
                    currentPageNo === QUEST_PAGE_NO &&
                    <div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "flex-start"
                            }}>
                            <img alt="" src="images/aggregator/metahuahua.png"
                                style={{
                                    width: "200px",
                                    height: "200px"
                                }} />
                            <div
                                style={{
                                    marginLeft: "30px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                <h1 style={{
                                    color: "white"
                                }}>AAA MetaHuahua</h1>
                                <p style={{
                                    color: "#ffffffcc",
                                    fontSize: "20px"
                                }}>Born to build a Web3.</p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                    <i className="fa fa-link"
                                        style={{
                                            color: "grey",
                                            fontSize: "32px"
                                        }} />
                                    <i className="fab fa-skype"
                                        style={{
                                            color: "grey",
                                            fontSize: "32px",
                                            marginLeft: "30px"
                                        }} />
                                    <i className="fab fa-discord"
                                        style={{
                                            color: "grey",
                                            fontSize: "32px",
                                            marginLeft: "30px"
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                marginTop: "10px"
                            }}>
                            <Button style={{ margin: "10px 0px 0px 0px", float: "left", borderRadius: "10px" }} color="success"
                                variant={`${selectedQuestType % COMMUNITY_SERIAL_NUM === 0 ? "contained" : "outlined"}`}
                                onClick={() => onClickSelectQuestTypeBtn(COMMUNITY_SERIAL_NUM)}>
                                COMMUNITY
                            </Button>
                            <Button style={{ margin: "10px 0px 0px 10px", float: "left", borderRadius: "10px" }} color="primary"
                                variant={`${selectedQuestType % AAA_METAHUAHUA_SERIAL_NUM === 0 ? "contained" : "outlined"}`}
                                onClick={() => onClickSelectQuestTypeBtn(AAA_METAHUAHUA_SERIAL_NUM)}>
                                AAA METAHUAHUA
                            </Button>
                            <Button style={{ margin: "10px 0px 0px 10px", float: "left", borderRadius: "10px" }} color="secondary"
                                variant={`${selectedQuestType % TORIPUNKS_SERIAL_NUM === 0 ? "contained" : "outlined"}`}
                                onClick={() => onClickSelectQuestTypeBtn(TORIPUNKS_SERIAL_NUM)}>
                                TORIPUNKS
                            </Button>
                            <Button style={{ margin: "10px 0px 0px 10px", float: "left", borderRadius: "10px" }} color="warning"
                                variant={`${selectedQuestType % CYBERHUAHUA_SERIAL_NUM === 0 ? "contained" : "outlined"}`}
                                onClick={() => onClickSelectQuestTypeBtn(CYBERHUAHUA_SERIAL_NUM)}>
                                CYBERHUAHUA
                            </Button>
                            <Button style={{ margin: "10px 0px 0px 10px", float: "left", borderRadius: "10px" }} color="error"
                                variant={`${selectedQuestType % HUAHUAPUNKS_SERIAL_NUM === 0 ? "contained" : "outlined"}`}
                                onClick={() => onClickSelectQuestTypeBtn(HUAHUAPUNKS_SERIAL_NUM)}>
                                HUAHUAPUNKS
                            </Button>
                        </div>
                        {
                            selectedQuestType % COMMUNITY_SERIAL_NUM === 0 &&
                            <div>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#2e7d32",
                                        margin: "20px 0 0 0",
                                        width: "100%",
                                        float: "left"
                                    }}>
                                    #Community
                                </p>
                                {
                                    communityQuests.map((item, index) => {
                                        return <div
                                            style={{
                                                width: "330px",
                                                height: "230px",
                                                backgroundColor: "#2e7d3210",
                                                borderRadius: "7px",
                                                border: "2px solid #2e7d32",
                                                padding: "15px",
                                                position: "relative",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                margin: "10px 10px 0 0",
                                                float: "left"
                                            }}
                                            onClick={() => handleClickOpen(item)}>
                                            <p
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    margin: "0"
                                                }}>
                                                {item.title}
                                            </p>
                                            <p
                                                style={{
                                                    color: "#8e9eaf",
                                                    fontSize: "14px",
                                                    margin: "0"
                                                }}>
                                                {item.contents}
                                            </p>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    width: "calc(100% - 30px)",
                                                    bottom: "15px",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                <p
                                                    style={{
                                                        backgroundColor: "#2e7d3220",
                                                        border: "1px solid #2e7d32",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#2e7d32",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {`${item.xp} XP`}
                                                </p>
                                                <p
                                                    style={{
                                                        backgroundColor: "#8e9eaf20",
                                                        border: "1px solid #8e9eaf",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#8e9eaf",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {item.count}
                                                </p>
                                            </div>
                                            {
                                                item.locked &&
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        position: "absolute",
                                                        backgroundColor: "#2e7d3220",
                                                        top: "0",
                                                        left: "0",
                                                        backdropFilter: "blur(7px)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center"
                                                    }}>
                                                    <LockOutlinedIcon
                                                        style={{
                                                            color: "#2e7d32",
                                                            width: "48px",
                                                            height: "48px",
                                                            margin: "35px 0 15px"
                                                        }} />
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "white",
                                                            fontSize: "18px"
                                                        }}>
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "#8e9eaf",
                                                            fontSize: "14px"
                                                        }}>
                                                        UNLOCKS WITH 'VERIFIED' DISCORD ROLE
                                                    </p>
                                                    <p
                                                        style={{
                                                            width: "fit-content",
                                                            backgroundColor: "#2e7d3220",
                                                            border: "1px solid #2e7d32",
                                                            borderRadius: "5px",
                                                            padding: "0 5px",
                                                            color: "#2e7d32",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            margin: "10px 0"
                                                        }}>
                                                        {`${item.xp} XP`}
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        }
                        {
                            selectedQuestType % AAA_METAHUAHUA_SERIAL_NUM === 0 &&
                            <div>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#1976d2",
                                        margin: "20px 0 0 0",
                                        width: "100%",
                                        float: "left"
                                    }}>
                                    #AAA Metahuahua
                                </p>
                                {
                                    aaaQuests.map((item, index) => {
                                        return <div
                                            style={{
                                                width: "330px",
                                                height: "230px",
                                                backgroundColor: "#1976d210",
                                                borderRadius: "7px",
                                                border: "2px solid #1976d2",
                                                padding: "15px",
                                                position: "relative",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                margin: "10px 10px 0 0",
                                                float: "left"
                                            }}
                                            onClick={() => handleClickOpen(item)}>
                                            <p
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    margin: "0"
                                                }}>
                                                {item.title}
                                            </p>
                                            <p
                                                style={{
                                                    color: "#8e9eaf",
                                                    fontSize: "14px",
                                                    margin: "0"
                                                }}>
                                                {item.contents}
                                            </p>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    width: "calc(100% - 30px)",
                                                    bottom: "15px",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                <p
                                                    style={{
                                                        backgroundColor: "#1976d220",
                                                        border: "1px solid #1976d2",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#1976d2",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {`${item.xp} XP`}
                                                </p>
                                                <p
                                                    style={{
                                                        backgroundColor: "#8e9eaf20",
                                                        border: "1px solid #8e9eaf",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#8e9eaf",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {item.count}
                                                </p>
                                            </div>
                                            {
                                                item.locked &&
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        position: "absolute",
                                                        backgroundColor: "#1976d220",
                                                        top: "0",
                                                        left: "0",
                                                        backdropFilter: "blur(7px)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center"
                                                    }}>
                                                    <LockOutlinedIcon
                                                        style={{
                                                            color: "#1976d2",
                                                            width: "48px",
                                                            height: "48px",
                                                            margin: "35px 0 15px"
                                                        }} />
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "white",
                                                            fontSize: "18px"
                                                        }}>
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "#8e9eaf",
                                                            fontSize: "14px"
                                                        }}>
                                                        UNLOCKS WITH 'VERIFIED' DISCORD ROLE
                                                    </p>
                                                    <p
                                                        style={{
                                                            width: "fit-content",
                                                            backgroundColor: "#1976d220",
                                                            border: "1px solid #1976d2",
                                                            borderRadius: "5px",
                                                            padding: "0 5px",
                                                            color: "#1976d2",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            margin: "10px 0"
                                                        }}>
                                                        {`${item.xp} XP`}
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        }
                        {
                            selectedQuestType % TORIPUNKS_SERIAL_NUM === 0 &&
                            <div>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#9c27b0",
                                        margin: "20px 0 0 0",
                                        width: "100%",
                                        float: "left"
                                    }}>
                                    #Toripunks
                                </p>
                                {
                                    toripunksQuests.map((item, index) => {
                                        return <div
                                            style={{
                                                width: "330px",
                                                height: "230px",
                                                backgroundColor: "#9c27b010",
                                                borderRadius: "7px",
                                                border: "2px solid #9c27b0",
                                                padding: "15px",
                                                position: "relative",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                margin: "10px 10px 0 0",
                                                float: "left"
                                            }}
                                            onClick={() => handleClickOpen(item)}>
                                            <p
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    margin: "0"
                                                }}>
                                                {item.title}
                                            </p>
                                            <p
                                                style={{
                                                    color: "#8e9eaf",
                                                    fontSize: "14px",
                                                    margin: "0"
                                                }}>
                                                {item.contents}
                                            </p>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    width: "calc(100% - 30px)",
                                                    bottom: "15px",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                <p
                                                    style={{
                                                        backgroundColor: "#9c27b020",
                                                        border: "1px solid #9c27b0",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#9c27b0",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {`${item.xp} XP`}
                                                </p>
                                                <p
                                                    style={{
                                                        backgroundColor: "#8e9eaf20",
                                                        border: "1px solid #8e9eaf",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#8e9eaf",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {item.count}
                                                </p>
                                            </div>
                                            {
                                                item.locked &&
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        position: "absolute",
                                                        backgroundColor: "#9c27b020",
                                                        top: "0",
                                                        left: "0",
                                                        backdropFilter: "blur(7px)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center"
                                                    }}>
                                                    <LockOutlinedIcon
                                                        style={{
                                                            color: "#9c27b0",
                                                            width: "48px",
                                                            height: "48px",
                                                            margin: "35px 0 15px"
                                                        }} />
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "white",
                                                            fontSize: "18px"
                                                        }}>
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "#8e9eaf",
                                                            fontSize: "14px"
                                                        }}>
                                                        UNLOCKS WITH 'VERIFIED' DISCORD ROLE
                                                    </p>
                                                    <p
                                                        style={{
                                                            width: "fit-content",
                                                            backgroundColor: "#9c27b020",
                                                            border: "1px solid #9c27b0",
                                                            borderRadius: "5px",
                                                            padding: "0 5px",
                                                            color: "#9c27b0",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            margin: "10px 0"
                                                        }}>
                                                        {`${item.xp} XP`}
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        }
                        {
                            selectedQuestType % CYBERHUAHUA_SERIAL_NUM === 0 &&
                            <div>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#ed6c02",
                                        margin: "20px 0 0 0",
                                        width: "100%",
                                        float: "left"
                                    }}>
                                    #Cyberhuahua
                                </p>
                                {
                                    cyberQuests.map((item, index) => {
                                        return <div
                                            style={{
                                                width: "330px",
                                                height: "230px",
                                                backgroundColor: "#ed6c0210",
                                                borderRadius: "7px",
                                                border: "2px solid #ed6c02",
                                                padding: "15px",
                                                position: "relative",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                margin: "10px 10px 0 0",
                                                float: "left"
                                            }}
                                            onClick={() => handleClickOpen(item)}>
                                            <p
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    margin: "0"
                                                }}>
                                                {item.title}
                                            </p>
                                            <p
                                                style={{
                                                    color: "#8e9eaf",
                                                    fontSize: "14px",
                                                    margin: "0"
                                                }}>
                                                {item.contents}
                                            </p>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    width: "calc(100% - 30px)",
                                                    bottom: "15px",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                <p
                                                    style={{
                                                        backgroundColor: "#ed6c0220",
                                                        border: "1px solid #ed6c02",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#ed6c02",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {`${item.xp} XP`}
                                                </p>
                                                <p
                                                    style={{
                                                        backgroundColor: "#8e9eaf20",
                                                        border: "1px solid #8e9eaf",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#8e9eaf",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {item.count}
                                                </p>
                                            </div>
                                            {
                                                item.locked &&
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        position: "absolute",
                                                        backgroundColor: "#ed6c0220",
                                                        top: "0",
                                                        left: "0",
                                                        backdropFilter: "blur(7px)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center"
                                                    }}>
                                                    <LockOutlinedIcon
                                                        style={{
                                                            color: "#ed6c02",
                                                            width: "48px",
                                                            height: "48px",
                                                            margin: "35px 0 15px"
                                                        }} />
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "white",
                                                            fontSize: "18px"
                                                        }}>
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "#8e9eaf",
                                                            fontSize: "14px"
                                                        }}>
                                                        UNLOCKS WITH 'VERIFIED' DISCORD ROLE
                                                    </p>
                                                    <p
                                                        style={{
                                                            width: "fit-content",
                                                            backgroundColor: "#ed6c0220",
                                                            border: "1px solid #ed6c02",
                                                            borderRadius: "5px",
                                                            padding: "0 5px",
                                                            color: "#ed6c02",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            margin: "10px 0"
                                                        }}>
                                                        {`${item.xp} XP`}
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        }
                        {
                            selectedQuestType % HUAHUAPUNKS_SERIAL_NUM === 0 &&
                            <div>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        color: "#d32f2f",
                                        margin: "20px 0 0 0",
                                        width: "100%",
                                        float: "left"
                                    }}>
                                    #Huahuapunks
                                </p>
                                {
                                    huahuapunksQuests.map((item, index) => {
                                        return <div
                                            style={{
                                                width: "330px",
                                                height: "230px",
                                                backgroundColor: "#d32f2f10",
                                                borderRadius: "7px",
                                                border: "2px solid #d32f2f",
                                                padding: "15px",
                                                position: "relative",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                margin: "10px 10px 0 0",
                                                float: "left"
                                            }}
                                            onClick={() => handleClickOpen(item)}>
                                            <p
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: "18px",
                                                    color: "white",
                                                    margin: "0"
                                                }}>
                                                {item.title}
                                            </p>
                                            <p
                                                style={{
                                                    color: "#8e9eaf",
                                                    fontSize: "14px",
                                                    margin: "0"
                                                }}>
                                                {item.contents}
                                            </p>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    width: "calc(100% - 30px)",
                                                    bottom: "15px",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                <p
                                                    style={{
                                                        backgroundColor: "#d32f2f20",
                                                        border: "1px solid #d32f2f",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#d32f2f",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {`${item.xp} XP`}
                                                </p>
                                                <p
                                                    style={{
                                                        backgroundColor: "#8e9eaf20",
                                                        border: "1px solid #8e9eaf",
                                                        borderRadius: "5px",
                                                        padding: "0 5px",
                                                        color: "#8e9eaf",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        margin: "0"
                                                    }}>
                                                    {item.count}
                                                </p>
                                            </div>
                                            {
                                                item.locked &&
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        position: "absolute",
                                                        backgroundColor: "#d32f2f20",
                                                        top: "0",
                                                        left: "0",
                                                        backdropFilter: "blur(7px)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center"
                                                    }}>
                                                    <LockOutlinedIcon
                                                        style={{
                                                            color: "#d32f2f",
                                                            width: "48px",
                                                            height: "48px",
                                                            margin: "35px 0 15px"
                                                        }} />
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "white",
                                                            fontSize: "18px"
                                                        }}>
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: "0",
                                                            fontWeight: "700",
                                                            color: "#8e9eaf",
                                                            fontSize: "14px"
                                                        }}>
                                                        UNLOCKS WITH 'VERIFIED' DISCORD ROLE
                                                    </p>
                                                    <p
                                                        style={{
                                                            width: "fit-content",
                                                            backgroundColor: "#d32f2f20",
                                                            border: "1px solid #d32f2f",
                                                            borderRadius: "5px",
                                                            padding: "0 5px",
                                                            color: "#d32f2f",
                                                            fontSize: "12px",
                                                            fontWeight: "700",
                                                            margin: "10px 0"
                                                        }}>
                                                        {`${item.xp} XP`}
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </div>
                }
                {
                    currentPageNo === LEADERBOARD_PAGE_NO &&
                    <div>
                        <h1
                            style={{
                                color: "white"
                            }}>
                            Leaderboard
                        </h1>
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "15px 0",
                                backgroundColor: "#171a1f"
                            }}>
                            {
                                leaderboardInfo.map((item, index) => {
                                    return <PlayInfoWrapper
                                        onClick={() => onClickLeaderboardItem(item)}>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                            <p
                                                style={{
                                                    margin: "0 20px 0 0",
                                                    color: "#1ce9c3"
                                                }}>
                                                {index + 1}
                                            </p>
                                            <Avatar
                                                alt={item.fullName}
                                                src={item.avatarUrl}
                                            />
                                            <p
                                                style={{
                                                    margin: "0 0 0 20px",
                                                    color: "white",
                                                    fontSize: "16px"
                                                }}>
                                                {item.fullName}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}>
                                            <p
                                                style={{
                                                    margin: "0 50px 0 0",
                                                    color: "#c3ccd5",
                                                    fontSize: "14px"
                                                }}>
                                                {`${item.quests} quests`}
                                            </p>
                                            <p
                                                style={{
                                                    margin: "0",
                                                    color: "#1ce9c3"
                                                }}>
                                                {`${item.xp} xp`}
                                            </p>
                                        </div>
                                    </PlayInfoWrapper>
                                })
                            }
                        </div>
                    </div>
                }
                {
                    currentPageNo === ACCOUNT_PAGE_NO &&
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                            <Avatar
                                alt={selectedLeaderboardInfo.fullName}
                                src={selectedLeaderboardInfo.avatarUrl}
                                style={{
                                    width: "96px",
                                    height: "96px"
                                }}
                            />
                            <p
                                style={{
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    margin: "0 0 0 30px"
                                }}>
                                {selectedLeaderboardInfo.fullName}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: "20px"
                            }}>
                            <p
                                style={{
                                    color: "white",
                                    fontSize: "18px",
                                    margin: "0 50px 0 0"
                                }}>
                                #1 rank
                            </p>
                            <p
                                style={{
                                    color: "white",
                                    fontSize: "18px",
                                    margin: "0"
                                }}>
                                0 invites
                            </p>
                            <HelpOutlineIcon
                                style={{
                                    color: "white",
                                    marginLeft: "10px"
                                }}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: "20px"
                            }}>
                            <Button variant="outlined" color="warning"
                                style={{
                                    backgroundColor: "#ed6c0210",
                                    padding: "2px 5px"
                                }}>
                                <i className="fab fa-discord"
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        color: "#ed6c02"
                                    }} />
                                <p
                                    style={{
                                        margin: "0 0 0 5px",
                                        fontSize: "12px",
                                        color: "#ed6c02"
                                    }}>{selectedLeaderboardInfo.name}</p>
                            </Button>
                            <Button variant="outlined" color="secondary"
                                style={{
                                    backgroundColor: "#9c27b010",
                                    padding: "2px 5px",
                                    marginLeft: "10px",
                                }}>
                                <WalletIcon
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        color: "#9c27b0"
                                    }} />
                                <p
                                    style={{
                                        margin: "0 0 0 5px",
                                        fontSize: "12px",
                                        color: "#9c27b0"
                                    }}>TOR1X...9698</p>
                            </Button>
                        </div>
                        <div
                            style={{
                                width: "500px",
                                marginTop: "20px",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                            <BorderLinearProgress variant="determinate" value={50} />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px"
                                    }}>
                                    {selectedLeaderboardInfo.xp} XP
                                </p>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "14px"
                                    }}>
                                    LVL {parseInt(selectedLeaderboardInfo.xp / LEVEL_XP)}
                                </p>
                            </div>
                        </div>
                        <p
                            style={{
                                margin: "20px 0 10px",
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "white"
                            }}>
                            ACTIVITY
                        </p>
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#171c21",
                                    padding: "5px 15px",
                                    borderRadius: "12px"
                                }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                    <BoltOutlinedIcon
                                        style={{
                                            backgroundColor: "#919eab14",
                                            width: "42px",
                                            height: "42px",
                                            padding: "5px",
                                            borderRadius: "12px",
                                            color: "#1ce9c3"
                                        }} />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginLeft: "10px"
                                        }}>
                                        <p
                                            style={{
                                                margin: "0",
                                                fontSize: "12px",
                                                color: "white"
                                            }}>
                                            QUEST COMPLETED
                                        </p>
                                        <p
                                            style={{
                                                margin: "0",
                                                fontSize: "16px",
                                                color: "white"
                                            }}>
                                            Daily connect
                                        </p>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}>
                                    <p
                                        style={{
                                            margin: "0",
                                            color: "#1ce9c3"
                                        }}>
                                        200
                                    </p>
                                    <p
                                        style={{
                                            margin: "0",
                                            color: "#1ce9c3"
                                        }}>
                                        XP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "690px",
                            minWidth: "690px"
                        },
                    },
                }}
            >
                <div
                    style={{
                        backgroundColor: "#0f1215",
                        padding: "20px"
                    }}>
                    <h1
                        style={{
                            color: "white",
                            marginBottom: "20px"
                        }}>
                        {selectedQuestInfo.title}
                    </h1>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row"
                        }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginRight: "10px",
                                minWidth: "320px"
                            }}>
                            <div
                                style={{
                                    border: "1px solid grey",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderRadius: "8px",
                                    padding: "15px"
                                }}>
                                <LockOutlinedIcon
                                    style={{
                                        color: "#18a0fb",
                                        width: "32px",
                                        height: "32px"
                                    }} />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginLeft: "10px"
                                    }}>
                                    <p
                                        style={{
                                            margin: "0"
                                        }}>
                                        {selectedQuestInfo.contents}
                                    </p>
                                    <p
                                        style={{
                                            margin: "0",
                                            color: "white",
                                            fontSize: "20px"
                                        }}>
                                        Verified
                                    </p>
                                </div>
                            </div>
                            {
                                userLoginFlag &&
                                <Button variant="contained" color="primary"
                                    onClick={() => onClickClaimBtn(selectedQuestInfo.xp)}
                                    style={{
                                        marginTop: "20px"
                                    }}>
                                    Claim
                                </Button>
                            }
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: "320px"

                            }}>
                            <div
                                style={{
                                    border: "1px solid grey",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: "8px",
                                    padding: "15px"
                                }}>
                                <p
                                    style={{
                                        margin: "0",
                                        color: "white"
                                    }}>
                                    REWARDS
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                    <DiamondIcon
                                        style={{
                                            color: "#18a0fb"
                                        }} />
                                    <p
                                        style={{
                                            margin: "0 0 0 10px",
                                            color: "white",
                                            fontSize: "24px"
                                        }}>
                                        {selectedQuestInfo.xp} XP
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog >
        </Box >
    );
};

const PlayInfoWrapper = styled(Button)({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderRadius: "0",
    padding: "10px 50px",
    color: "black",
    cursor: "pointer",
    "&:hover": {
        backgroundColor: "#00000080"
    }
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));
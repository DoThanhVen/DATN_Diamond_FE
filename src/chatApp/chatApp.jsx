import React, { useEffect, useRef, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import getAccountFromCookie from '../service/getAccountLogin';
import { useNavigate } from 'react-router';
import { callAPI } from '../service/API';
import ScrollableFeed from 'react-scrollable-feed';
import Footer from '../page_user/components/Footer';
import MainNavbar from '../page_user/components/Navbar';
import moment from 'moment';
import './App.css'
import { ThongBao } from '../service/ThongBao';
var stompClient = null;

const ChatApp = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [tab, setTab] = useState('CHATROOM');
  const [historySender, setHistorySender] = useState([]);
  const [listMess, setListMess] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [historyReceiver, setHistoryReceiver] = useState([]);
  const navigate = useNavigate();
  const [receiverData, setReceiverData] = useState([]);
  const [file, setfile] = useState(null);
  const [showTime, setShowTime] = useState(false);

  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: null,
    image: ''
  });
  const chatBottomRef = useRef(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [listMess, selectedRecipient, file]);

  const scrollToBottom = () => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const getData = async () => {
    try {
      const accountData = getAccountFromCookie();
      const params = new URLSearchParams(window.location.search);
      if (params.has('ShopName')) {
        const res = await callAPI(`/api/account/findaccountbyshopname/${params.get('ShopName')}`, 'GET');
        if (accountData) {
          setUserData({
            ...userData,
            username: accountData.username,
            receivername: res.data.username,
            connected: true,
          });
          setSelectedRecipient(res.data.username);
          getHistoryDataWithParam(accountData.id, res.data.username);
        } else {
          navigate('/login');
        }
      } else {
        if (accountData) {
          setUserData({
            ...userData,
            username: accountData.username,
            connected: true,
          });
          getHistoryData(accountData.id);
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryDataWithParam = async (id, receiver) => {
    try {
      const senderChatData = await callAPI(`/api/chat/getchatbysender/${id}`, 'GET');
      const receiverChatData = await callAPI(`/api/chat/getchatbyreceiver/${id}`, 'GET');

      const combinedData = [...senderChatData.data, ...receiverChatData.data];

      const uniqueData = combinedData.reduce((acc, current) => {
        const existingItem = acc.find((item) => (
          (item.sender.username === current.sender.username && item.receiver.username === current.receiver.username) ||
          (item.sender.username === current.receiver.username && item.receiver.username === current.sender.username)
        ));

        if (!existingItem) {
          acc.push(current);
        }
        return acc;
      }, []);

      const filteredSenderData = uniqueData.filter((item) => item.receiver.username !== userData.username);
      const filteredReceiverData = uniqueData.filter((item) => item.sender.username !== userData.username);
      const array = [];
      array.push(receiver)
      setReceiverData(array)
      setHistorySender(filteredSenderData);
      setHistoryReceiver(filteredReceiverData);
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryData = async (id) => {
    try {
      const senderChatData = await callAPI(`/api/chat/getchatbysender/${id}`, 'GET');
      const receiverChatData = await callAPI(`/api/chat/getchatbyreceiver/${id}`, 'GET');
      console.log('his', receiverChatData)
      const combinedData = [...senderChatData.data, ...receiverChatData.data];

      const uniqueData = combinedData.reduce((acc, current) => {
        const existingItem = acc.find((item) => (
          (item.sender.username === current.sender.username && item.receiver.username === current.receiver.username) ||
          (item.sender.username === current.receiver.username && item.receiver.username === current.sender.username)
        ));

        if (!existingItem) {
          acc.push(current);
        }
        return acc;
      }, []);

      const filteredSenderData = uniqueData.filter((item) => item.receiver.username !== userData.username);
      const filteredReceiverData = uniqueData.filter((item) => item.sender.username !== userData.username);

      setHistorySender(filteredSenderData);
      setHistoryReceiver(filteredReceiverData);
    } catch (error) {
      console.log(error);
    }
  };


  const connect = () => {
    let Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      sender: userData.username,
      status: 'JOIN'
    };
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log('Payload Data:', payloadData);
    let updatedPrivateChats = new Map(privateChats);

    if (updatedPrivateChats.get(payloadData.sender)) {
      updatedPrivateChats.get(payloadData.sender).push(payloadData);
    } else {
      updatedPrivateChats.set(payloadData.sender, [payloadData]);
    }

    setPrivateChats(updatedPrivateChats);

    if (payloadData.receiver === userData.username) {
      const newMessage = {
        sender: { username: payloadData.sender },
        receiver: { username: payloadData.receiver },
        message: payloadData.message,
        image: payloadData.image,
        date: payloadData.time
      };

      setListMess(prevMessages => [...prevMessages, newMessage]);
      const newSender = { sender: selectedRecipient };
      setHistorySender(prevSenders => prevSenders ? [newSender, ...prevSenders] : [newSender]);

      // Tương tự cho historyReceiver
      const newReceiver = { receiver: selectedRecipient };
      setHistoryReceiver(prevReceivers => prevReceivers ? [newReceiver, ...prevReceivers] : [newReceiver]);

    }

  };




  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        sender: userData.username,
        receiver: selectedRecipient,
        message: userData.message,
        image: file,
        status: 'MESSAGE'
      };
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));


      stompClient.subscribe(`/user/${selectedRecipient}/private`, onPrivateMessage);
      const newMessage = {
        sender: { username: userData.username },
        receiver: { username: selectedRecipient },
        message: userData.message,
        image: file,
        date: new Date().toISOString()
      };
      setListMess(prevMessages => [...prevMessages, newMessage]);
      setUserData({ ...userData, message: '', file: '' });
      setfile(null)
      const newSender = { sender: userData.username };
      setHistorySender(prevSenders => prevSenders ? [newSender, ...prevSenders] : [newSender]);

      // Cập nhật người nhận trong historyReceiver
      const newReceiver = { receiver: selectedRecipient };
      setHistoryReceiver(prevReceivers => prevReceivers ? [newReceiver, ...prevReceivers] : [newReceiver]);

    }
  };


  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };

  const getHistoryData2 = async (id2) => {
    try {
      const senderChatData = await callAPI(`/api/chat/getchatby`, 'GET');
      const newdata = senderChatData.data.filter((item) => (item.sender.username === userData.username && item.receiver.username === id2) || (item.receiver.username === userData.username && item.sender.username === id2))
      const sortedMessages = newdata.sort((a, b) => new Date(b.date) - new Date(a.date));
      setListMess(sortedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelect = (event) => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/jxr', 'image/vnd.wap.wbmp'];
    const files = event.target.files;
    if (files !== null) {
      const imageFiles = Array.from(files).filter(file => allowedFormats.includes(file.type));
      if (imageFiles.length === 0) {
        ThongBao("Vui lòng chỉ chọn tệp hình ảnh có định dạng phù hợp.", "info");
        return;
      }
      if (imageFiles[0].size > 15 * 1024) {
        ThongBao(
          "Kích thước ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 15Kb.",
          "info"
        );
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result;
          setfile(base64String);
          setUserData({ ...userData, file: base64String });
        };
        reader.readAsDataURL(imageFiles[0]);
      };
    }

  }
  function formatDate(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  }

  return (
    <div className="container">
      <nav>
        <MainNavbar />
      </nav>
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li onClick={() => setTab('CHATROOM')} className={`member ${tab === 'CHATROOM' && 'active'}`} style={{ fontSize: '27px' }}>
                {userData.username}
              </li>
              {historySender && historySender.map((name, index) => (
                name.receiver && name.receiver.username !== receiverData[0] && name.receiver.username !== userData.username && (
                  <li
                    onClick={() => { registerUser(); getHistoryData2(name.receiver.username); setSelectedRecipient(name.receiver.username); }}
                    className={`member ${tab === name.receiver.username && 'active'}`}
                    key={index}
                  >
                    {name.receiver.username}
                  </li>
                )
              ))}
              {historyReceiver && historyReceiver.map((name, index) => (
                name.sender && name.receiver.username !== receiverData[0] && name.sender.username !== userData.username && (
                  <li
                    onClick={() => { registerUser(); getHistoryData2(name.sender.username); setSelectedRecipient(name.sender.username); }}
                    className={`member ${tab === name.sender.username && 'active'}`}
                    key={index}
                  >
                    {name.sender.username}
                  </li>)
              ))}
              {receiverData && receiverData.map((name, index) => (
                name !== userData.username && (
                  <li
                    onClick={() => { registerUser(); getHistoryData2(name); setSelectedRecipient(name); }}
                    className={`member ${tab === name && 'active'}`}
                    key={index}
                  >
                    {name}
                  </li>
                )
              ))}
            </ul>
          </div>

          {selectedRecipient ? (
            <div className="chat-content">
              <ScrollableFeed>
                <ul className="chat-messages" style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                  {listMess.map((chat, index) => (
                    <li
                      className={`message`}
                      key={index}
                      style={{
                        backgroundColor:
                          chat.sender.username === userData.username ? '#c3e6cb' : '#bee5eb'
                      }}
                      onClick={() => setShowTime(!showTime)}
                    >
                      {chat.sender.username === userData.username ? (
                        <div className="message-data" >
                          <span className="username">Bạn: </span>
                          {chat.message}
                          {showTime && <span className="message-time">{formatDate(chat.time)}</span>}
                        </div>
                      ) : chat.sender.username === selectedRecipient ? (
                        <div className="message-data" >
                          <span className="username">{chat.sender.username}: </span>
                          {chat.message}
                          {showTime && <span className="message-time">{formatDate(chat.time)}</span>}
                        </div>
                      ) : chat.receiver.username === userData.username ? (
                        <div className="message-data" >
                          <span className="username">You: </span>
                          {chat.message}
                          {showTime && <span className="message-time">{formatDate(chat.time)}</span>}
                        </div>
                      ) : chat.receiver.username === selectedRecipient ? (
                        <div className="message-data" >
                          <span className="username">{chat.receiver.username}: </span>
                          {chat.message}
                          {showTime && <span className="message-time">{formatDate(chat.time)}</span>}
                        </div>
                      ) : null}

                      {chat.image && (
                        <div>
                          <img src={chat.image} alt="Sent File" style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'contain'
                          }} />
                        </div>
                      )}
                    </li>
                  ))}
                  {file && (
                    <div>
                      <img src={file} alt="Selected File" />
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </ul>
              </ScrollableFeed>



              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendPrivateValue}>
                  send
                </button>
                <label className="file-input-label" htmlFor="file-input">
                  <i className="fa-solid fa-image" style={{ padding: '10px', fontSize: '30px' }}></i>
                  <input
                    type="file"
                    id="file-input"
                    className="file-input"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

            </div>
          ) : (
            null
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default ChatApp;

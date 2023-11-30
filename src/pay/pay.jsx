import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { callAPI } from '../service/API';
import './BankList.css';
import { useLocation, useNavigate } from 'react-router';
import {ThongBao} from '../service/ThongBao'
const VNPayBankSelection = () => {
    const [bankList, setBankList] = useState([]);
    const location = useLocation();
    const [status, setStatus] = useState('');
    const navigate=useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const statusParam = params.get('status');
        setStatus(statusParam || '');
        if(statusParam==='success'){
            ThongBao('Thanh toán thành công','success')
            navigate('/pay');
        }else{
            ThongBao('Thanh toán thất bại','error')
            navigate('/pay');
        }
    }, [location.search]);

    useEffect(() => {
        console.log('Status changed:', status);
    }, [status]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.vietqr.io/v2/banks?utm_source=j2team&utm_medium=url_shortener&utm_campaign=bank-list-api');
                if (response.data && response.data.data) {
                    setBankList(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching bank list:', error);
            }
        };

        fetchData();
    }, []);

    const Pay = async (bank) => {
        if (bank.code !== 'NCB') {
            alert('Chỉ chọn ngân hàng NCB ->Làm theo hướng dẫn');
            return;
        }
        try {
            const res = await callAPI(`/pay?price=100000&typeBank=${bank.code}`, 'GET');
            window.location.href = res; // Redirect to the payment URL
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return (
        <div>
            <h1>Danh sách ngân hàng</h1>
            <div className="bank-note">
                <p>Lưu ý: Chỉ chọn Ngân hàng TMCP Quốc Dân NCB và điền đúng thông tin sau:</p>
                <p>Số thẻ: 9704198526191432198 <br />
                    Tên chủ thẻ: NGUYEN VAN A <br />
                    Ngày phát hành: 07/15 <br />
                    Mật khẩu OTP: 123456</p>
            </div>
            <div className="bank-list">
                {bankList.map((bank, index) => (
                    <div key={index} className="bank-item" onClick={() => Pay(bank)}>
                        <img src={bank.logo} alt={bank.shortName} />
                        <p>{bank.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VNPayBankSelection;

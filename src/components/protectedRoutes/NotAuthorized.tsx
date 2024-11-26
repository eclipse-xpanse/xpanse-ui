import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { homePageRoute } from '../utils/constants';

function NotAuthorized(): React.JSX.Element {
    const navigate = useNavigate();
    const backHome = () => {
        void navigate(homePageRoute);
    };

    return (
        <Result
            status='warning'
            title='User not authorized to view this page'
            extra={
                <Button
                    type='primary'
                    key='console'
                    onClick={() => {
                        backHome();
                    }}
                >
                    Back Home
                </Button>
            }
        />
    );
}

export default NotAuthorized;

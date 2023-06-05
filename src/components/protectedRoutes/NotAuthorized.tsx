import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotAuthorized(): JSX.Element {
    const navigate = useNavigate();

    return (
        <Result
            status='warning'
            title='User not authorized to view this page'
            extra={
                <Button type='primary' key='console' onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            }
        />
    );
}

export default NotAuthorized;

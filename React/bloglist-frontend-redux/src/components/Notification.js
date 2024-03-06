import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';

const Notification = () => {
  // Fetch notification from state
  const notification = useSelector((state) => state.notification);

  // If no message was given, return null
  if (!notification.notification) {
    return null;
  }

  // The style of the notification is dependent on if the message is an error or not
  if (notification.isError) {
    return (
      <Alert id="danger" variant="danger">
        {notification.notification}
      </Alert>
    );
  } else {
    return (
      <Alert id="success" variant="success">
        {notification.notification}
      </Alert>
    );
  }
};

export default Notification;

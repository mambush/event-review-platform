const NotificationItem = ({ notification }) => {
    return (
      <div className="card mb-2">
        <div className="card-body">
          <h6 className="card-title">{notification.title}</h6>
          <p className="card-text">{notification.message}</p>
          <small className="text-muted">{new Date(notification.timestamp).toLocaleString()}</small>
        </div>
      </div>
    );
  };
  
  export default NotificationItem;
import { useState } from "react";

let setNotificationExternal = null;

const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  setNotificationExternal = setNotification;

  const showNotification = (message, type = "success") => {
    if (setNotificationExternal) {
      setNotificationExternal({
        open: true,
        message,
        type,
      });
    }
  };

  const closeNotification = () => {
    if (setNotificationExternal) {
      setNotificationExternal((prev) => ({ ...prev, open: false }));
    }
  };

  return {
    notification,
    showNotification,
    closeNotification,
  };
};

export default useNotification;

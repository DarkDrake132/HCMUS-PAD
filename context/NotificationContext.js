import { useState, useEffect, createContext } from "react";

import Notification from "../components/ui/Notification/Notification";
import Modal from "../components/ui/Modal/Modal";

import * as notiUtils from "../utility/NotificationUtility";

export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    fixed: false,
    message: "",
    type: notiUtils.WARNING,
    autoCloseTime: "",
  });

  const value = {
    notification,
    setNotification,
    notiUtils,
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Modal
        show={notification.message}
        modalClosed={() => {}}
        position="RightBottom"
      >
        <Notification
          type={notification.type}
          content={notification.message}
          fixed={notification.fixed}
          autoCloseTime={notification.autoCloseTime}
          closeHandler={() => {
            setNotification((prevState) => ({
              ...prevState,
              message: "",
            }));
          }}
        />
      </Modal>
    </NotificationContext.Provider>
  );
}

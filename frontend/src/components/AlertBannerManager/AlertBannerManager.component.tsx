import React, { useEffect, useState } from 'react';
import { AlertBanner, AlertBannerProps, Button } from '@sk-web-gui/react';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import AlertBannerForm from './AlertBannerForm.component';
import { getAlertBannerMessage } from '@services/alert-banner-service/alert-banner-service';
import { useUserStore } from '@services/user-service/user-service';
import { emptyAlertBannerMessage } from '@services/alert-banner-service/defaults';
import { AlertBannerMessage } from '@data-contracts/backend/data-contracts';
import dayjs from 'dayjs';

interface AlertBannerManagerProps {
  className?: string;
}

const AlertBannerManager = ({ className }: AlertBannerManagerProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [messageData, setMessageData] = useState<AlertBannerMessage>(emptyAlertBannerMessage);
  const { user } = useUserStore();
  const [severityFromForm, setSeverityFromForm] = useState(emptyAlertBannerMessage.severity);

  const handleNewAlert = () => {
    setShowEditForm(true);
    setIsEdit(false);
  };

  const handleEditAlert = () => {
    setShowAlert(false);
    setShowEditForm(true);
    setIsEdit(true);
  };

  const handleAlertBannerClose = () => {
    setSeverityFromForm(messageData.severity);
    setShowEditForm(false);
    if (messageData.message) {
      setShowAlert(true);
    }
  };

  const getEditMessageContent = (showEditForm) => {
    if (showEditForm) {
      return (
        <AlertBanner
          severity={
            showEditForm
              ? (severityFromForm as AlertBannerProps['severity'])
              : (messageData.severity as AlertBannerProps['severity'])
          }
          fromDate={dayjs(messageData.fromDate).toDate()}
          toDate={dayjs(messageData.toDate).toDate()}
          contentClassName="max-width-content"
          childrenClassName="max-w-full no-underline"
          showClose={false}
        >
          <AlertBannerForm
            isEdit={isEdit}
            onClose={handleAlertBannerClose}
            onSuccess={fetchAlertBannerMessage}
            messageData={messageData}
            setSeverityFromForm={setSeverityFromForm}
          />
        </AlertBanner>
      );
    } else {
      return (
        <AlertBanner
          severity="neutral"
          contentClassName="max-width-content grayscale"
          childrenClassName="max-w-full"
          showClose={false}
        >
          <Button
            onClick={handleNewAlert}
            className="text-gray "
            variant="link"
            rightIcon={<ModeEditOutlinedIcon className="material-icon ml-4 !text-xl" />}
          >
            Nytt Systemmeddelande ...
          </Button>
        </AlertBanner>
      );
    }
  };

  const getMessageContent = (message: AlertBannerMessage) => {
    if (user.permissions.canEditSystemMessages) {
      return (
        <button
          data-cy="alert-banner-edit"
          onClick={handleEditAlert}
          className="alert-banner-message hover:text-primary [&>span]:hover:no-underline inline-block whitespace-normal text-left text-gray"
        >
          <span className="underline">
            <span className="sr-only">Editera </span>
            {message.message}
          </span>{' '}
          <ModeEditOutlinedIcon aria-hidden className="material-icon ml-4 !text-xl" />
        </button>
      );
    } else {
      return messageData.message;
    }
  };

  const fetchAlertBannerMessage = () => {
    getAlertBannerMessage().then((res) => {
      if (!res.error) {
        setMessageData(res.message);
        setSeverityFromForm(res.message.severity);
        setShowAlert(true);
        setShowEditForm(false);
      } else {
        setMessageData(emptyAlertBannerMessage);
        setShowAlert(false);
        setShowEditForm(false);
        setSeverityFromForm(emptyAlertBannerMessage.severity);
      }
    });
  };

  useEffect(() => {
    fetchAlertBannerMessage();
  }, []);

  return (
    <div data-cy="alert-banner" className={`${className} alert-banner-edit`}>
      {user.permissions.canEditSystemMessages && !showAlert && <div>{getEditMessageContent(showEditForm)}</div>}
      {showAlert && (
        <AlertBanner
          severity={messageData.severity as AlertBannerProps['severity']}
          fromDate={dayjs(messageData.fromDate).toDate()}
          toDate={dayjs(messageData.toDate).toDate()}
          contentClassName="max-width-content"
          contentType="tab"
        >
          {getMessageContent(messageData)}
        </AlertBanner>
      )}
    </div>
  );
};

export default AlertBannerManager;

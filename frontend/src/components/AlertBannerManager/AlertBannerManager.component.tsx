import React, { useEffect, useState } from 'react';
import { Alert, Button, Icon } from '@sk-web-gui/react';
import { Pencil } from 'lucide-react';
import AlertBannerForm from './AlertBannerForm.component';
import { getAlertBannerMessage } from '@services/alert-banner-service/alert-banner-service';
import { useUserStore } from '@services/user-service/user-service';
import { emptyAlertBannerMessage } from '@services/alert-banner-service/defaults';
import { AlertBannerMessage } from '@data-contracts/backend/data-contracts';
import { AlertBannerSeverity } from '@interfaces/alert-banner';
import dayjs from 'dayjs';

interface AlertBannerManagerProps {
  className?: string;
}

const isWithinDates = (message: AlertBannerMessage) => {
  const fromDate = dayjs(message.fromDate).toDate();
  const toDate = dayjs(message.toDate).toDate();
  const todayDate = new Date();
  return !(todayDate < fromDate || toDate < todayDate);
};

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
        <Alert type={severityFromForm as AlertBannerSeverity}>
          <Alert.Icon />
          <Alert.Content>
            <AlertBannerForm
              isEdit={isEdit}
              onClose={handleAlertBannerClose}
              onSuccess={fetchAlertBannerMessage}
              messageData={messageData}
              setSeverityFromForm={setSeverityFromForm}
            />
          </Alert.Content>
        </Alert>
      );
    } else {
      return (
        <Alert type="neutral">
          <Alert.Content>
            <Button onClick={handleNewAlert} className="text-dark-secondary " variant="link" rightIcon={<Pencil />}>
              Nytt Systemmeddelande ...
            </Button>
          </Alert.Content>
        </Alert>
      );
    }
  };

  const getMessageContent = (message: AlertBannerMessage) => {
    if (user.permissions.canEditSystemMessages) {
      return (
        <button
          data-cy="alert-banner-edit"
          onClick={handleEditAlert}
          className="alert-banner-message hover:text-vattjom-text-primary [&>span]:hover:no-underline inline-block whitespace-normal text-left text-dark-secondary"
        >
          <span className="underline">
            <span className="sr-only">Editera </span>
            {message.message}
          </span>{' '}
          <Icon className="ml-10" icon={<Pencil />} />
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
      {showAlert && isWithinDates(messageData) && (
        <Alert type={messageData.severity as AlertBannerSeverity}>
          <Alert.Icon />
          <Alert.Content>{getMessageContent(messageData)}</Alert.Content>
        </Alert>
      )}
    </div>
  );
};

export default AlertBannerManager;

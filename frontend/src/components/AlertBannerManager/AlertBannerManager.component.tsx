import React, { useEffect, useState } from 'react';
import { Alert, Button } from '@sk-web-gui/react';
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

const AlertBannerManager = ({ className = '' }: AlertBannerManagerProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [messageData, setMessageData] = useState<AlertBannerMessage>(emptyAlertBannerMessage);
  const { user } = useUserStore();
  const canEdit = user.permissions.canEditSystemMessages;

  const handleNewAlert = () => {
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEditAlert = () => {
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const fetchAlertBannerMessage = () => {
    getAlertBannerMessage().then((res) => {
      if (!res.error) {
        setMessageData(res.message);
        setShowAlert(true);
      } else {
        setMessageData(emptyAlertBannerMessage);
        setShowAlert(false);
      }
      setIsModalOpen(false);
    });
  };

  useEffect(() => {
    fetchAlertBannerMessage();
  }, []);

  const showMessage = showAlert && isWithinDates(messageData);
  const showNewButton = canEdit && !showAlert;

  return (
    <>
      {(showMessage || showNewButton) && (
        <div data-cy="alert-banner" className={`${className} p-16`}>
          {showNewButton && (
            <Alert type="neutral">
              <Alert.Content>
                <Button onClick={handleNewAlert} variant="link">
                  Nytt systemmeddelande
                </Button>
              </Alert.Content>
            </Alert>
          )}
          {showMessage && (
            <Alert type={messageData.severity as AlertBannerSeverity}>
              <Alert.Icon />
              <Alert.Content>{messageData.message}</Alert.Content>
              {canEdit && (
                <Alert.Button data-cy="alert-banner-edit" size="sm" onClick={handleEditAlert}>
                  Redigera
                </Alert.Button>
              )}
            </Alert>
          )}
        </div>
      )}
      {canEdit && (
        <AlertBannerForm
          isOpen={isModalOpen}
          isEdit={isEdit}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchAlertBannerMessage}
          messageData={isEdit ? messageData : emptyAlertBannerMessage}
        />
      )}
    </>
  );
};

export default AlertBannerManager;

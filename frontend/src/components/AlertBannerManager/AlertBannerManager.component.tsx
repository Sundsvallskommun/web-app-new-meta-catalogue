import React, { useEffect, useState } from 'react';
import { Button, Icon, cx } from '@sk-web-gui/react';
import { CircleAlert, CircleCheck, Info } from 'lucide-react';
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

// Same look as the verification bar in drafts (ExportVerifyInfo)
const severityStyles: Record<
  AlertBannerSeverity,
  { background: string; color: 'tertiary' | 'info' | 'success' | 'warning' | 'error'; icon: React.ReactElement }
> = {
  neutral: { background: 'bg-background-200', color: 'tertiary', icon: <Info /> },
  info: { background: 'bg-info-background-200', color: 'info', icon: <Info /> },
  success: { background: 'bg-success-background-200', color: 'success', icon: <CircleCheck /> },
  warning: { background: 'bg-warning-background-200', color: 'warning', icon: <CircleAlert /> },
  error: { background: 'bg-error-background-200', color: 'error', icon: <CircleAlert /> },
};

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
  const severity = severityStyles[messageData.severity] ? (messageData.severity as AlertBannerSeverity) : 'info';

  return (
    <>
      {(showMessage || showNewButton) && (
        <div
          data-cy="alert-banner"
          className={cx(className, showMessage ? severityStyles[severity].background : 'bg-background-200')}
        >
          <div className="max-width-content mx-auto flex flex-wrap items-center justify-between gap-md p-md">
            {showMessage ?
              <span className="flex items-center gap-sm">
                <Icon
                  className="shrink-0"
                  color={severityStyles[severity].color}
                  icon={severityStyles[severity].icon}
                />
                {messageData.message}
              </span>
            : <Button onClick={handleNewAlert} variant="link">
                Nytt systemmeddelande
              </Button>
            }
            {showMessage && canEdit && (
              <Button data-cy="alert-banner-edit" size="sm" variant="tertiary" onClick={handleEditAlert}>
                Redigera
              </Button>
            )}
          </div>
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

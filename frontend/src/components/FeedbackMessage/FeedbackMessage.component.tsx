import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import { Button } from '@sk-web-gui/react';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import _ from 'lodash';

const getSeverity = (severity) => {
  let bgColor, borderColor, iconColor;

  switch (severity) {
    case 'warning':
      bgColor = 'bg-warning-light';
      iconColor = 'text-warning';
      borderColor = 'border-warning';
      break;
    case 'error':
      bgColor = 'bg-error-light';
      iconColor = 'text-error';
      borderColor = 'border-error';
      break;
    default:
      bgColor = 'bg-info-light';
      iconColor = 'text-info';
      borderColor = 'border-info';
  }
  return { bgColor, borderColor, iconColor };
};

interface FeedbackMessageProps {
  children;
  severity: 'neutral' | 'info' | 'warning' | 'error' | 'success';
  background?: boolean;
  className?: string;
  removeCallback?: () => void;
  id?: string;
}

export default function FeedbackMessage({
  children,
  severity,
  background,
  className = '',
  removeCallback,
  id,
}: FeedbackMessageProps) {
  const { bgColor, borderColor, iconColor } = getSeverity(severity);
  const defaultId = useState(_.uniqueId('feedback-message-'));
  const [_id] = id ? [id] : defaultId;

  const removeSelf = () => {
    removeCallback();
  };

  return (
    <div className={`feedback-message ${className}`}>
      <div
        className={`p-2 pr-4 rounded-md ${background && bgColor} ${iconColor} ${
          background && `border ${borderColor}`
        } flex`}
      >
        <span className="flex items-center h-[24px]">
          <ErrorOutlinedIcon className="material-icon mr-sm !text-base " />
        </span>
        <span className="text-sm grow font-semibold" id={_id}>
          {children}
        </span>
        {removeCallback && (
          <Button
            aria-label="Dölj meddelande tills sidomladdning"
            iconButton
            size="fit"
            className="border-0 -mr-2"
            onClick={removeSelf}
            aria-controls={_id}
          >
            <CloseIcon className="max-h-[16px]" />
          </Button>
        )}
      </div>
    </div>
  );
}

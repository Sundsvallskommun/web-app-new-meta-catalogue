import { cx, Icon } from '@sk-web-gui/react';
import styles from './savingspinner.module.scss';
import { RefreshCw } from 'lucide-react';

export const SavingSpinner = ({ className }) => {
  return (
    <div className={cx(styles.spinner, className)}>
      <Icon color="primary" icon={<RefreshCw />} />
    </div>
  );
};

export default SavingSpinner;

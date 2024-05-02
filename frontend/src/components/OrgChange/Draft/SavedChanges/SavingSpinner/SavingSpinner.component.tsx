import { cx } from '@sk-web-gui/react';
import styles from './savingspinner.module.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export const SavingSpinner = ({ className }) => {
  return (
    <div className={cx(styles.spinner, className)}>
      <AutorenewIcon sx={{ fontSize: '2rem' }} className="text-primary" />
    </div>
  );
};

export default SavingSpinner;

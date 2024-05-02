import { AriaMenuKeyboard } from '@sk-web-gui/react';
import { useEffect } from 'react';

export const useAriaKeyboard = (ref) => {
  useEffect(() => {
    let ariaKeyboard: InstanceType<typeof AriaMenuKeyboard>;
    if (ref?.current) {
      ariaKeyboard = new AriaMenuKeyboard(ref.current);
    }

    return () => {
      ariaKeyboard?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current]);
};

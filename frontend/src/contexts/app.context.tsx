import { HighlightedTableRow } from '@interfaces/highlighted-table-row';
import { createContext, useContext, useState } from 'react';
export interface AppContextInterface {
  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

  highlightedTableRow: HighlightedTableRow;
  setHighlightedTableRow: (highlightedTableRow: HighlightedTableRow) => void;

  isOrgChange: boolean;
  setIsOrgChange: (isOrgChange: boolean) => void;

  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>(null);

export function AppWrapper({ children }) {
  const contextDefaults = {
    isCookieConsentOpen: true,
    highlightedTableRow: {},
    isOrgChange: false,
  };
  const setDefaults = () => {
    setIsCookieConsentOpen(contextDefaults.isCookieConsentOpen);
    setHighlightedTableRow(contextDefaults.highlightedTableRow);
    setIsOrgChange(contextDefaults.isOrgChange);
  };
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(contextDefaults.isCookieConsentOpen);
  const [highlightedTableRow, setHighlightedTableRow] = useState<HighlightedTableRow>(
    contextDefaults.highlightedTableRow
  );
  const [isOrgChange, setIsOrgChange] = useState(contextDefaults.isOrgChange);

  return (
    <AppContext.Provider
      value={{
        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        highlightedTableRow,
        setHighlightedTableRow: (highlightedTableRow: HighlightedTableRow) =>
          setHighlightedTableRow(highlightedTableRow),

        isOrgChange,
        setIsOrgChange: (isOrgChange: boolean) => setIsOrgChange(isOrgChange),

        setDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

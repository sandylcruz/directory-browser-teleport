import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

interface ErrorContextValue {
  addError: (error: string) => void;
  errors: string[];
}

const ErrorContext = React.createContext<ErrorContextValue>({
  addError: () => {
    return;
  },
  errors: [],
});

const ErrorProvider = React.memo(({ children }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (error: string) => {
    // TODO: given more time, this implementation would be more advanced.
    // For now, we'll just replace all of the errors any time a new one is received.
    // Ideally, we would show all errors and give users the ability to manually close errors.
    setErrors([error]);
  };

  useEffect(() => {
    if (errors.length) {
      const timeoutId = setTimeout(() => {
        setErrors([]);
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errors]);

  return (
    <ErrorContext.Provider
      value={{
        addError,
        errors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
});

export const useErrors = (): ErrorContextValue => useContext(ErrorContext);

export default ErrorProvider;

import { useState, useEffect } from 'react';
import { getMiPrimeraK } from '../flags';

/**
 * Hook para usar el flag `mi-primera-k` en componentes React.
 *
 * @example
 * import { useMiPrimeraK } from '../hooks/useMiPrimeraK';
 *
 * function MyComponent() {
 *   const enabled = useMiPrimeraK();
 *   return enabled ? <NewFeature /> : <OldFeature />;
 * }
 */
export function useMiPrimeraK() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    getMiPrimeraK().then(setEnabled);
  }, []);

  return enabled;
}

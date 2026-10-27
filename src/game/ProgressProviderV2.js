import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createProgress, startLevel, completeLevel, recordAttempt } from './progressionV2';
import { createSaveService } from './saveServiceV2';
import { audioManager } from './AudioManagerV2';

const Context = createContext(null);
export function ProgressProvider({ children }) {
  const service = useRef(createSaveService(AsyncStorage)).current;
  const current = useRef(createProgress());
  const [data, setData] = useState(current.current);
  const [loaded, setLoaded] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [warning, setWarning] = useState('');
  useEffect(() => { audioManager.settings(data.settings); }, [data.settings]);
  useEffect(() => {
    let active = true;
    service.load().then(result => {
      if (!active) return;
      current.current = result.data; setData(result.data); setHasSave(result.exists); setWarning(result.warning); setLoaded(true);
    });
    return () => { active = false; };
  }, [service]);
  const update = useCallback(async transform => {
    const next = transform(current.current);
    if (!next) return false;
    current.current = next; setData(next);
    try { await service.save(next); setHasSave(true); setWarning(''); return true; }
    catch { setWarning('Progresso apenas nesta sessão: não foi possível salvar no dispositivo.'); return false; }
  }, [service]);
  const begin = useCallback(id => update(value => startLevel(value, id)), [update]);
  const complete = useCallback((id, score) => update(value => completeLevel(value, id, score)), [update]);
  const attempt = useCallback((id, score) => update(value => recordAttempt(value, id, score)), [update]);
  const setSetting = useCallback((key, enabled) => update(value => Object.hasOwn(value.settings, key) && typeof enabled === 'boolean' ? { ...value, settings: { ...value.settings, [key]: enabled } } : null), [update]);
  const value = useMemo(() => ({ data, loaded, hasSave, warning, begin, complete, attempt, setSetting }), [data, loaded, hasSave, warning, begin, complete, attempt, setSetting]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useProgress = () => useContext(Context);

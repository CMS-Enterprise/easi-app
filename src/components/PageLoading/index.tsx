import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner';

import './index.scss';

type PageLoadingProps = {
  fullScreen?: boolean;
};

const PageLoading: React.FC<PageLoadingProps> = ({ fullScreen = false }) => {
  const { t } = useTranslation('general');

  const portalEl = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return document.createElement('div');
  }, []);

  useEffect(() => {
    if (!fullScreen || !portalEl) {
      // no-op func return required in order to return a cleanup func later
      return () => {};
    }

    document.body.appendChild(portalEl);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
      if (portalEl.parentNode === document.body) {
        document.body.removeChild(portalEl);
      }
    };
  }, [fullScreen, portalEl]);

  const content = (
    <div
      className={fullScreen ? 'page-loading page-loading--full' : 'margin-y-10'}
      data-testid="page-loading"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <Spinner size="xl" aria-valuetext={t('pageLoading')} aria-busy />
      </div>

      <h1 className="margin-top-6 text-center">{t('pageLoading')}</h1>
    </div>
  );

  if (fullScreen && portalEl) {
    return createPortal(content, portalEl);
  }

  return content;
};

export default PageLoading;

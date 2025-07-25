import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

interface ExternalLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  variant?: 'external' | 'unstyled' | 'nav';
  onClick?: () => void;
}

const ExternalLink = ({
  children,
  className,
  href,
  variant = 'external',
  onClick
}: ExternalLinkProps) => {
  const { t } = useTranslation('general');

  return (
    <Link
      href={href}
      aria-label={t('newTab')}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default ExternalLink;

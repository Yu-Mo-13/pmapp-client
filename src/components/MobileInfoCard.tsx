'use client';

import Link from 'next/link';
import React from 'react';

type MobileInfoCardBaseProps = {
  headerText: string;
  primaryText: string;
  secondaryText: string;
  statusText?: string;
  centerContent?: boolean;
};

type MobileInfoCardButtonProps = MobileInfoCardBaseProps & {
  onClick: () => void;
  disabled?: boolean;
  href?: never;
};

type MobileInfoCardLinkProps = MobileInfoCardBaseProps & {
  href: string;
  onClick?: never;
  disabled?: never;
};

type MobileInfoCardStaticProps = MobileInfoCardBaseProps & {
  href?: never;
  onClick?: never;
  disabled?: never;
};

type MobileInfoCardProps =
  | MobileInfoCardButtonProps
  | MobileInfoCardLinkProps
  | MobileInfoCardStaticProps;

const containerClassName =
  'min-h-[150px] w-full max-w-[335px] rounded-md border border-[#334155] bg-white p-4 text-left shadow-[8px_8px_0_rgba(0,0,0,0.18)]';

const MobileInfoCardBody: React.FC<MobileInfoCardBaseProps> = ({
  headerText,
  primaryText,
  secondaryText,
  statusText,
}) => {
  return (
    <>
      <dl className="w-full text-gray-900">
        <div className="space-y-1">
          <dd className="text-[15px] font-normal text-gray-900">{headerText}</dd>
        </div>
        <div
          className="mb-3 mt-[3px] h-px w-full bg-[#334155]"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <dd className="break-all text-[16px] font-semibold leading-6">
            {primaryText}
          </dd>
        </div>
        <div className="mt-2 space-y-2">
          <dd className="break-all text-[16px] font-semibold leading-6">
            {secondaryText}
          </dd>
        </div>
      </dl>
      {statusText && (
        <p className="mt-4 text-sm font-medium text-[#3CB371]">{statusText}</p>
      )}
    </>
  );
};

const MobileInfoCard: React.FC<MobileInfoCardProps> = (props) => {
  const alignClassName = props.centerContent ? 'flex items-center' : 'block';

  if ('href' in props && props.href) {
    return (
      <Link
        href={props.href}
        className={`${alignClassName} ${containerClassName} transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
      >
        <MobileInfoCardBody {...props} />
      </Link>
    );
  }

  if ('onClick' in props && props.onClick) {
    return (
      <button
        type="button"
        onClick={props.onClick}
        disabled={props.disabled}
        className={`${alignClassName} ${containerClassName} transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <MobileInfoCardBody {...props} />
      </button>
    );
  }

  return (
    <div className={`${alignClassName} ${containerClassName}`}>
      <MobileInfoCardBody {...props} />
    </div>
  );
};

export default MobileInfoCard;

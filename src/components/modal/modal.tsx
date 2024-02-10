import React, { useEffect } from 'react';
import cx from 'classnames';
import { Portal } from 'react-portal';

import Button from 'components/button';
import './modal.scss';
import { IconButton } from 'components/icon-button';

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    onClose: () => void;
    size?: 'sm' | 'md';
}

const Modal = ({ children, className, onClose, size = 'md' }: ModalProps) => {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', listener);

        return () => {
            window.removeEventListener('keydown', listener);
        };
    }, [onClose]);

    return (
        <Portal>
            <div
                className={cx(
                    'xmodal xmodal--active',
                    `xmodal--${size}`,
                    className
                )}
            >
                <div className="xmodal__overlay" />
                <div className="xmodal__container">{children}</div>
            </div>
        </Portal>
    );
};

interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
    onClose: (event: React.MouseEvent) => void;
}

const ModalHeader = ({ children, className, onClose }: ModalHeaderProps) => (
    <div className={cx('xmodal__header', className)}>
        {onClose && <IconButton onClick={onClose} icon="fal fa-times" />}
        <div className="xmodal__title">{children}</div>
    </div>
);

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

const ModalBody = ({ children, className }: ModalBodyProps) => (
    <div className={cx('xmodal__body', className)}>{children}</div>
);

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

const ModalFooter = ({ children, className }: ModalFooterProps) => (
    <div className={cx('xmodal__footer', className)}>{children}</div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;

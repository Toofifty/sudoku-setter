import React from 'react';
import cx from 'classnames';
import { Portal } from 'react-portal';
import Button from 'components/button';
import './modal.scss';

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md';
}

const Modal = ({ children, className, size = 'md' }: ModalProps) => (
    <Portal>
        <div className={cx('modal active', `modal-${size}`, className)}>
            <div className="modal-overlay" />
            <div className="modal-container">{children}</div>
        </div>
    </Portal>
);

interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
    onClose?: (event: React.MouseEvent) => void;
}

const ModalHeader = ({ children, className, onClose }: ModalHeaderProps) => (
    <div className={cx('modal-header', className)}>
        {onClose && (
            <Button onClick={onClose}>
                <i className="fa fa-times" />
            </Button>
        )}
        <div className="modal-title">{children}</div>
    </div>
);

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

const ModalBody = ({ children, className }: ModalBodyProps) => (
    <div className={cx('modal-body', className)}>{children}</div>
);

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

const ModalFooter = ({ children, className }: ModalFooterProps) => (
    <div className={cx('modal-footer', className)}>{children}</div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;

import React, { useEffect, useState } from 'react';
import Modal from 'components/modal';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import Button from 'components/button';
import Toggle from 'components/toggle';
import { isFilled } from 'utils/solve/helper';
import { sum } from 'utils/misc';

interface ArrowModalProps {
    selection: number[];
    onClose: () => void;
}

const ArrowModal = ({ selection, onClose }: ArrowModalProps) => {
    const solution = useSelector((state) => state.solver.solution);
    const createArrow = useAction('shared/create-arrow');

    const canBeTwoDigits =
        selection[1] - selection[0] === 1 && selection.length > 3;

    const [twoDigits, setTwoDigits] = useState(false);
    const digits = twoDigits ? 2 : 1;

    const minimum = (() => {
        const minimums: number[] = [];
        for (let index of selection.slice(digits)) {
            const cell = solution[index];
            if (isFilled(cell)) {
                minimums.push(cell.value);
            } else {
                minimums.push(
                    Math.min(
                        ...cell.candidates.filter((c) => !minimums.includes(c))
                    )
                );
            }
        }
        return Math.max(sum(minimums), twoDigits ? 12 : 1);
    })();

    const maximum = (() => {
        const maximums: number[] = [];
        for (let index of selection.slice(digits)) {
            const cell = solution[index];
            if (isFilled(cell)) {
                maximums.push(cell.value);
            } else {
                maximums.push(
                    Math.max(
                        ...cell.candidates.filter((c) => !maximums.includes(c))
                    )
                );
            }
        }
        return sum(maximums);
    })();

    const [total, setTotal] = useState(minimum);

    useEffect(() => {
        if (minimum > 10) {
            setTwoDigits(true);
        }
        if (total < minimum) {
            setTotal(minimum);
        }
    }, [minimum, total]);

    return (
        <Modal size="sm">
            <Modal.Header onClose={onClose}>
                <i className="fad fa-bullseye-arrow m-r-12" />
                Create arrow
            </Modal.Header>
            <form
                onSubmit={(e) => {
                    if (total < minimum || total > maximum) {
                        return false;
                    }
                    createArrow({
                        head: selection.slice(0, digits),
                        tail: selection.slice(digits),
                    });
                    onClose();
                    e.preventDefault();
                }}
            >
                <Modal.Body>
                    <div className="content">
                        <p>
                            {twoDigits ? (
                                <>
                                    <strong>Two</strong> total cells
                                </>
                            ) : (
                                <>
                                    <strong>One</strong> total cell
                                </>
                            )}{' '}
                            summing{' '}
                            <strong>
                                {selection.length - (twoDigits ? 2 : 1)}
                            </strong>{' '}
                            cell
                            {selection.length - (twoDigits ? 2 : 1) === 1
                                ? ''
                                : 's'}
                        </p>
                        <div className="form-group">
                            {canBeTwoDigits && (
                                <Toggle
                                    checked={twoDigits}
                                    onChange={() => setTwoDigits(!twoDigits)}
                                >
                                    2-digit sum
                                </Toggle>
                            )}
                            <label className="form-label" htmlFor="value">
                                Value
                            </label>
                            <input
                                name="total"
                                className="form-input"
                                type="text"
                                min={minimum}
                                max={maximum}
                                step={1}
                                placeholder="Total value"
                                id="value"
                                onChange={(e) => {
                                    setTotal(Number(e.target.value));
                                }}
                                value={total ?? minimum}
                                autoFocus
                                onFocus={(e) =>
                                    e.target.setSelectionRange(
                                        0,
                                        e.target.value.length
                                    )
                                }
                                onKeyDown={({ key, target }) => {
                                    if (key === 'ArrowUp') {
                                        setTotal(
                                            Number((target as any).value) + 1
                                        );
                                    }
                                    if (key === 'ArrowDown') {
                                        setTotal(
                                            Number((target as any).value) - 1
                                        );
                                    }
                                }}
                            />
                            <p>
                                min: {minimum} max: {maximum}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button danger className="m-r-12" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        primary
                        submit
                        disabled={total < minimum || total > maximum}
                    >
                        <i className="fad fa-check m-r-12" />
                        Create
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default ArrowModal;

import React, { useState } from 'react';
import useSelector from 'hooks/use-selector';
import { isFilled } from 'utils/reduce/helper';
import useAction from 'hooks/use-action';

interface KillerCageModalProps {
    selection: number[];
    onClose: () => void;
}

const KillerCageModal = ({ selection, onClose }: KillerCageModalProps) => {
    const board = useSelector((state) => state.sudoku.board);
    const createCage = useAction('create-killer-cage');

    const minimum = (() => {
        const minimums: number[] = [];
        for (let index of selection) {
            const cell = board[index];
            if (isFilled(cell)) {
                minimums.push(cell.value);
            } else {
                minimums.push(
                    Math.min(
                        ...cell.marks.filter((mark) => !minimums.includes(mark))
                    )
                );
            }
        }
        return minimums.reduce((total, n) => total + n, 0);
    })();

    const maximum = (() => {
        const maximums: number[] = [];
        for (let index of selection) {
            const cell = board[index];
            if (isFilled(cell)) {
                maximums.push(cell.value);
            } else {
                maximums.push(
                    Math.max(
                        ...cell.marks.filter((mark) => !maximums.includes(mark))
                    )
                );
            }
        }
        return maximums.reduce((total, n) => total + n, 0);
    })();

    const [total, setTotal] = useState<number>(minimum);

    return (
        <div className="modal modal-sm active">
            <div className="modal-overlay" />
            <div className="modal-container">
                <div className="modal-header">
                    <button
                        className="btn btn-clear float-right"
                        aria-label="Close"
                        onClick={onClose}
                    />
                    <div className="modal-title h5">Create Killer Cage</div>
                </div>
                <form
                    onSubmit={() => {
                        if (total < minimum || total > maximum) {
                            return false;
                        }
                        createCage({ total, cage: selection });
                        onClose();
                    }}
                >
                    <div className="modal-body">
                        <div className="content">
                            <p>
                                Over <strong>{selection.length}</strong> cell
                                {selection.length === 1 ? '' : 's'}
                            </p>
                            <div className="form-group">
                                <label className="form-label" htmlFor="value">
                                    Value
                                </label>
                                <input
                                    className="form-input"
                                    type="number"
                                    min={minimum}
                                    max={maximum}
                                    step={1}
                                    placeholder="Total value"
                                    id="value"
                                    onChange={(e) =>
                                        setTotal(Number(e.target.value))
                                    }
                                    value={total ?? minimum}
                                />
                            </div>
                            <p>
                                min: {minimum} max: {maximum}
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-link mr-2" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KillerCageModal;

import React, { useState } from 'react';
import useSelector from 'hooks/use-selector';
import { isFilled } from 'utils/solve/helper';
import useAction from 'hooks/use-action';

interface KillerCageModalProps {
    selection: number[];
    onClose: () => void;
}

const KillerCageModal = ({ selection, onClose }: KillerCageModalProps) => {
    const solution = useSelector((state) => state.solver.solution);
    const createCage = useAction('shared/create-killer-cage');

    const minimum = (() => {
        const minimums: number[] = [];
        for (let index of selection) {
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
        return minimums.reduce((total, n) => total + n, 0);
    })();

    const maximum = (() => {
        const maximums: number[] = [];
        for (let index of selection) {
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
                                    name="total"
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
                        <button
                            className="btn btn-link mr-2"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button className="btn btn-primary" type="submit">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KillerCageModal;

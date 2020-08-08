import React, { useState } from 'react';
import useSelector from 'hooks/use-selector';
import { isFilled } from 'utils/solve/helper';
import useAction from 'hooks/use-action';
import Modal from 'components/modal';
import Button from 'components/button';

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
        <Modal size="sm">
            <Modal.Header onClose={onClose}>Create Killer Cage</Modal.Header>
            <form
                onSubmit={() => {
                    if (total < minimum || total > maximum) {
                        return false;
                    }
                    createCage({ total, cage: selection });
                    onClose();
                }}
            >
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button danger className="m-r-12" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button primary submit>
                        <i className="fa fa-border-none m-r-12" />
                        Create
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default KillerCageModal;
